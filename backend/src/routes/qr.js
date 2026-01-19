const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const { authenticateUser } = require('../middleware/auth');
const { supabaseAdmin } = require('../config/supabase');
const logger = require('../utils/logger');

// Generate QR code for product
router.post('/generate/:productId', authenticateUser, async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;

  try {
    // Get product
    const { data: product, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('id', productId)
      .eq('owner_id', userId)
      .single();

    if (error || !product) {
      return res.status(404).json({ error: 'Product not found or unauthorized' });
    }

    // Create QR data
    const qrData = {
      productId: product.id,
      blockchainId: product.blockchain_id,
      name: product.name,
      ipfsHash: product.ipfs_hash,
      verificationUrl: `${process.env.APP_URL || 'http://localhost:3000'}/api/qr/verify/${product.id}`,
      timestamp: new Date().toISOString()
    };

    // Generate QR code as data URL
    const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData), {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 400,
      margin: 2
    });

    // Store QR code info in database
    const { data: qrRecord, error: qrError } = await supabaseAdmin
      .from('qr_codes')
      .insert({
        product_id: productId,
        qr_data: qrData,
        qr_image_url: qrCodeDataURL
      })
      .select()
      .single();

    if (qrError) throw qrError;

    res.json({
      qrCode: qrCodeDataURL,
      qrData,
      message: 'QR code generated successfully'
    });
  } catch (error) {
    logger.error('QR generation failed:', error);
    throw error;
  }
});

// Verify product via QR code
router.get('/verify/:productId', async (req, res) => {
  const { productId } = req.params;

  try {
    // Get product with blockchain verification
    const { data: product, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (error || !product) {
      return res.status(404).json({ 
        verified: false,
        error: 'Product not found' 
      });
    }

    // Get QR code record
    const { data: qrCode } = await supabaseAdmin
      .from('qr_codes')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // Increment scan count if QR code exists
    if (qrCode) {
      await supabaseAdmin
        .from('qr_codes')
        .update({ scans_count: (qrCode.scans_count || 0) + 1 })
        .eq('id', qrCode.id);
      
      logger.info(`QR code scanned for product ${productId}, scan count: ${(qrCode.scans_count || 0) + 1}`);
    }

    res.json({
      verified: product.is_active,
      product: {
        id: product.id,
        name: product.name,
        description: product.description,
        blockchainId: product.blockchain_id,
        ipfsHash: product.ipfs_hash,
        blockchainHash: product.blockchain_hash,
        isActive: product.is_active,
        price: product.price,
        metadata: product.metadata
      },
      qrCode: qrCode ? {
        imageUrl: qrCode.qr_image_url,
        scansCount: (qrCode.scans_count || 0) + 1,
        createdAt: qrCode.created_at
      } : null,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('QR verification failed:', error);
    res.status(500).json({ 
      verified: false,
      error: 'Verification failed' 
    });
  }
});

// Scan QR code (decode QR data)
router.post('/scan', async (req, res) => {
  const { qrData } = req.body;

  if (!qrData) {
    return res.status(400).json({ error: 'QR data required' });
  }

  try {
    // Parse QR data
    const data = JSON.parse(qrData);
    
    // Validate required fields
    if (!data.productId) {
      return res.status(400).json({ 
        valid: false,
        error: 'Invalid QR code: missing product ID' 
      });
    }
    
    // Verify product exists
    const { data: product, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('id', data.productId)
      .single();

    if (error || !product) {
      return res.status(404).json({ 
        valid: false,
        error: 'Invalid QR code or product not found' 
      });
    }

    // Verify blockchain ID matches
    if (data.blockchainId && data.blockchainId !== product.blockchain_id) {
      logger.warn(`QR code blockchain ID mismatch for product ${data.productId}`);
      return res.status(400).json({ 
        valid: false,
        error: 'QR code data does not match blockchain record' 
      });
    }

    // Get QR code record and increment scan count
    const { data: qrCode } = await supabaseAdmin
      .from('qr_codes')
      .select('*')
      .eq('product_id', data.productId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (qrCode) {
      await supabaseAdmin
        .from('qr_codes')
        .update({ scans_count: (qrCode.scans_count || 0) + 1 })
        .eq('id', qrCode.id);
    }

    logger.info(`QR code scanned successfully for product ${data.productId}`);

    res.json({
      valid: true,
      verified: product.is_active,
      product: {
        id: product.id,
        name: product.name,
        description: product.description,
        blockchainId: product.blockchain_id,
        ipfsHash: product.ipfs_hash,
        blockchainHash: product.blockchain_hash,
        isActive: product.is_active,
        price: product.price,
        metadata: product.metadata
      },
      scannedData: data,
      scansCount: qrCode ? (qrCode.scans_count || 0) + 1 : 0
    });
  } catch (error) {
    logger.error('QR scan failed:', error);
    
    // Check if it's a JSON parse error
    if (error instanceof SyntaxError) {
      return res.status(400).json({ 
        valid: false,
        error: 'Invalid QR code format: not valid JSON' 
      });
    }
    
    res.status(500).json({ 
      valid: false,
      error: 'QR code scan failed' 
    });
  }
});

// Get QR code statistics for a product
router.get('/stats/:productId', authenticateUser, async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;

  try {
    // Verify product ownership
    const { data: product, error: productError } = await supabaseAdmin
      .from('products')
      .select('id, name, owner_id')
      .eq('id', productId)
      .eq('owner_id', userId)
      .single();

    if (productError || !product) {
      return res.status(404).json({ error: 'Product not found or unauthorized' });
    }

    // Get all QR codes for this product
    const { data: qrCodes, error: qrError } = await supabaseAdmin
      .from('qr_codes')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (qrError) throw qrError;

    const totalScans = qrCodes.reduce((sum, qr) => sum + (qr.scans_count || 0), 0);
    const latestQR = qrCodes[0] || null;

    res.json({
      productId: product.id,
      productName: product.name,
      totalQRCodes: qrCodes.length,
      totalScans,
      latestQRCode: latestQR ? {
        id: latestQR.id,
        imageUrl: latestQR.qr_image_url,
        scansCount: latestQR.scans_count || 0,
        createdAt: latestQR.created_at
      } : null,
      allQRCodes: qrCodes.map(qr => ({
        id: qr.id,
        scansCount: qr.scans_count || 0,
        createdAt: qr.created_at
      }))
    });
  } catch (error) {
    logger.error('Failed to get QR stats:', error);
    throw error;
  }
});

module.exports = router;
