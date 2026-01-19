const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const { productRegistryContract } = require('../config/blockchain');
const { supabaseAdmin } = require('../config/supabase');
const Joi = require('joi');
const logger = require('../utils/logger');

const createProductSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  ipfsHash: Joi.string().required(),
  metadata: Joi.object().optional(),
  price: Joi.number().positive().optional()
});

const updateProductSchema = Joi.object({
  ipfsHash: Joi.string().optional(),
  metadata: Joi.object().optional(),
  isActive: Joi.boolean().optional()
});

// Create product
router.post('/', authenticateUser, validate(createProductSchema), async (req, res) => {
  const { name, description, ipfsHash, metadata, price } = req.body;
  const userId = req.user.id;

  try {
    // Register on blockchain
    const tx = await productRegistryContract.registerProduct(
      name,
      ipfsHash,
      JSON.stringify(metadata || {})
    );
    const receipt = await tx.wait();
    
    // Get product ID from event
    const event = receipt.logs.find(log => log.eventName === 'ProductRegistered');
    const productId = event.args.productId.toString();
    const blockchainHash = receipt.hash;

    // Store in database
    const { data: product, error } = await supabaseAdmin
      .from('products')
      .insert({
        blockchain_id: productId,
        name,
        description,
        ipfs_hash: ipfsHash,
        metadata,
        price,
        owner_id: userId,
        blockchain_hash: blockchainHash,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      logger.error('Database insert failed:', error);
      throw error;
    }

    res.status(201).json({
      product,
      blockchainHash,
      message: 'Product registered successfully'
    });
  } catch (error) {
    logger.error('Product creation failed:', error);
    throw error;
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Get from database
    const { data: product, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Get blockchain data
    const blockchainProduct = await productRegistryContract.getProduct(product.blockchain_id);

    res.json({
      product,
      blockchain: {
        id: blockchainProduct.id.toString(),
        owner: blockchainProduct.owner,
        timestamp: new Date(Number(blockchainProduct.timestamp) * 1000),
        isActive: blockchainProduct.isActive
      }
    });
  } catch (error) {
    logger.error('Product fetch failed:', error);
    throw error;
  }
});

// Update product
router.put('/:id', authenticateUser, validate(updateProductSchema), async (req, res) => {
  const { id } = req.params;
  const { ipfsHash, metadata, isActive } = req.body;
  const userId = req.user.id;

  try {
    // Get product
    const { data: product } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('id', id)
      .eq('owner_id', userId)
      .single();

    if (!product) {
      return res.status(404).json({ error: 'Product not found or unauthorized' });
    }

    // Update blockchain if ipfsHash or metadata changed
    if (ipfsHash || metadata) {
      const tx = await productRegistryContract.updateProduct(
        product.blockchain_id,
        ipfsHash || product.ipfs_hash,
        JSON.stringify(metadata || product.metadata)
      );
      await tx.wait();
    }

    // Deactivate on blockchain if needed
    if (isActive === false && product.is_active) {
      const tx = await productRegistryContract.deactivateProduct(product.blockchain_id);
      await tx.wait();
    }

    // Update database
    const { data: updatedProduct, error } = await supabaseAdmin
      .from('products')
      .update({
        ...(ipfsHash && { ipfs_hash: ipfsHash }),
        ...(metadata && { metadata }),
        ...(isActive !== undefined && { is_active: isActive }),
        updated_at: new Date()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      product: updatedProduct,
      message: 'Product updated successfully'
    });
  } catch (error) {
    logger.error('Product update failed:', error);
    throw error;
  }
});

// Delete product (deactivate)
router.delete('/:id', authenticateUser, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const { data: product } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('id', id)
      .eq('owner_id', userId)
      .single();

    if (!product) {
      return res.status(404).json({ error: 'Product not found or unauthorized' });
    }

    // Deactivate on blockchain
    const tx = await productRegistryContract.deactivateProduct(product.blockchain_id);
    await tx.wait();

    // Update database
    await supabaseAdmin
      .from('products')
      .update({ is_active: false })
      .eq('id', id);

    res.json({ message: 'Product deactivated successfully' });
  } catch (error) {
    logger.error('Product deletion failed:', error);
    throw error;
  }
});

// List user products
router.get('/user/:userId', authenticateUser, async (req, res) => {
  const { userId } = req.params;

  try {
    const { data: products, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('owner_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ products });
  } catch (error) {
    logger.error('Product list fetch failed:', error);
    throw error;
  }
});

module.exports = router;
