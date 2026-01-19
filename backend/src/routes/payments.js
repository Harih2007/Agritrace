const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const { escrowContract } = require('../config/blockchain');
const { supabaseAdmin } = require('../config/supabase');
const { ethers } = require('ethers');
const Joi = require('joi');
const logger = require('../utils/logger');

const createEscrowSchema = Joi.object({
  productId: Joi.number().required(),
  sellerAddress: Joi.string().required(),
  amount: Joi.string().required()
});

// Create escrow payment
router.post('/escrow', authenticateUser, validate(createEscrowSchema), async (req, res) => {
  const { productId, sellerAddress, amount } = req.body;
  const userId = req.user.id;

  try {
    // Verify product exists
    const { data: product } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Create escrow on blockchain
    const amountWei = ethers.parseEther(amount);
    const tx = await escrowContract.createEscrow(sellerAddress, product.blockchain_id, {
      value: amountWei
    });
    const receipt = await tx.wait();

    // Get escrow ID from event
    const event = receipt.logs.find(log => log.eventName === 'EscrowCreated');
    const escrowId = event.args.escrowId.toString();

    // Store in database
    const { data: escrow, error } = await supabaseAdmin
      .from('escrows')
      .insert({
        blockchain_id: escrowId,
        product_id: productId,
        buyer_id: userId,
        seller_address: sellerAddress,
        amount,
        status: 'funded',
        blockchain_hash: receipt.hash
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      escrow,
      blockchainHash: receipt.hash,
      message: 'Escrow created successfully'
    });
  } catch (error) {
    logger.error('Escrow creation failed:', error);
    throw error;
  }
});

// Confirm delivery
router.post('/escrow/:id/confirm-delivery', authenticateUser, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const { data: escrow } = await supabaseAdmin
      .from('escrows')
      .select('*')
      .eq('id', id)
      .eq('buyer_id', userId)
      .single();

    if (!escrow) {
      return res.status(404).json({ error: 'Escrow not found or unauthorized' });
    }

    // Confirm delivery on blockchain
    const tx = await escrowContract.confirmDelivery(escrow.blockchain_id);
    await tx.wait();

    // Update database
    await supabaseAdmin
      .from('escrows')
      .update({ status: 'delivered' })
      .eq('id', id);

    res.json({ message: 'Delivery confirmed' });
  } catch (error) {
    logger.error('Delivery confirmation failed:', error);
    throw error;
  }
});

// Release funds
router.post('/escrow/:id/release', authenticateUser, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const { data: escrow } = await supabaseAdmin
      .from('escrows')
      .select('*')
      .eq('id', id)
      .eq('buyer_id', userId)
      .single();

    if (!escrow) {
      return res.status(404).json({ error: 'Escrow not found or unauthorized' });
    }

    if (escrow.status !== 'delivered') {
      return res.status(400).json({ error: 'Delivery not confirmed' });
    }

    // Release funds on blockchain
    const tx = await escrowContract.releaseFunds(escrow.blockchain_id);
    await tx.wait();

    // Update database
    await supabaseAdmin
      .from('escrows')
      .update({ status: 'completed', completed_at: new Date() })
      .eq('id', id);

    res.json({ message: 'Funds released successfully' });
  } catch (error) {
    logger.error('Fund release failed:', error);
    throw error;
  }
});

// Raise dispute
router.post('/escrow/:id/dispute', authenticateUser, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const { data: escrow } = await supabaseAdmin
      .from('escrows')
      .select('*')
      .eq('id', id)
      .single();

    if (!escrow) {
      return res.status(404).json({ error: 'Escrow not found' });
    }

    // Verify user is buyer or seller
    if (escrow.buyer_id !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Raise dispute on blockchain
    const tx = await escrowContract.raiseDispute(escrow.blockchain_id);
    await tx.wait();

    // Update database
    await supabaseAdmin
      .from('escrows')
      .update({ status: 'disputed' })
      .eq('id', id);

    res.json({ message: 'Dispute raised' });
  } catch (error) {
    logger.error('Dispute creation failed:', error);
    throw error;
  }
});

// Get escrow details
router.get('/escrow/:id', authenticateUser, async (req, res) => {
  const { id } = req.params;

  try {
    const { data: escrow, error } = await supabaseAdmin
      .from('escrows')
      .select('*, products(*)')
      .eq('id', id)
      .single();

    if (error || !escrow) {
      return res.status(404).json({ error: 'Escrow not found' });
    }

    // Get blockchain data
    const blockchainEscrow = await escrowContract.getEscrow(escrow.blockchain_id);

    res.json({
      escrow,
      blockchain: {
        id: blockchainEscrow.id.toString(),
        buyer: blockchainEscrow.buyer,
        seller: blockchainEscrow.seller,
        amount: ethers.formatEther(blockchainEscrow.amount),
        state: blockchainEscrow.state,
        createdAt: new Date(Number(blockchainEscrow.createdAt) * 1000)
      }
    });
  } catch (error) {
    logger.error('Escrow fetch failed:', error);
    throw error;
  }
});

module.exports = router;
