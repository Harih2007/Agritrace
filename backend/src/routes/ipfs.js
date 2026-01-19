const express = require('express');
const router = express.Router();
const axios = require('axios');
const FormData = require('form-data');
const { authenticateUser } = require('../middleware/auth');
const { supabaseAdmin } = require('../config/supabase');
const logger = require('../utils/logger');

const PINATA_API_URL = 'https://api.pinata.cloud';
const PINATA_GATEWAY = 'https://gateway.pinata.cloud/ipfs/';

// Upload file to IPFS via Pinata
router.post('/upload', authenticateUser, async (req, res) => {
  try {
    if (!req.body.file && !req.body.content) {
      return res.status(400).json({ error: 'File or content required' });
    }

    const formData = new FormData();
    
    if (req.body.file) {
      // Handle base64 file upload
      const buffer = Buffer.from(req.body.file, 'base64');
      formData.append('file', buffer, {
        filename: req.body.filename || 'file',
        contentType: req.body.contentType || 'application/octet-stream'
      });
    } else {
      // Handle JSON content upload
      const blob = new Blob([JSON.stringify(req.body.content)], { type: 'application/json' });
      formData.append('file', blob, { filename: 'metadata.json' });
    }

    // Add metadata
    const metadata = JSON.stringify({
      name: req.body.name || 'Uploaded file',
      keyvalues: {
        userId: req.user.id,
        timestamp: new Date().toISOString(),
        ...req.body.metadata
      }
    });
    formData.append('pinataMetadata', metadata);

    // Upload to Pinata
    const response = await axios.post(
      `${PINATA_API_URL}/pinning/pinFileToIPFS`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${process.env.PINATA_JWT}`,
          ...formData.getHeaders()
        },
        maxBodyLength: Infinity
      }
    );

    const ipfsHash = response.data.IpfsHash;
    const gatewayUrl = `${PINATA_GATEWAY}${ipfsHash}`;

    // Store in database
    const { data: ipfsRecord, error } = await supabaseAdmin
      .from('ipfs_files')
      .insert({
        ipfs_hash: ipfsHash,
        gateway_url: gatewayUrl,
        filename: req.body.filename || 'file',
        content_type: req.body.contentType || 'application/json',
        user_id: req.user.id,
        metadata: req.body.metadata || {}
      })
      .select()
      .single();

    if (error) {
      logger.warn('Database insert failed but IPFS upload succeeded:', error);
    }

    res.status(201).json({
      ipfsHash,
      gatewayUrl,
      pinataUrl: `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
      record: ipfsRecord,
      message: 'File uploaded to IPFS successfully'
    });
  } catch (error) {
    logger.error('IPFS upload failed:', error);
    
    if (error.response) {
      return res.status(error.response.status).json({
        error: 'IPFS upload failed',
        details: error.response.data
      });
    }
    
    throw error;
  }
});

// Get file from IPFS
router.get('/:hash', async (req, res) => {
  const { hash } = req.params;

  try {
    // Get from database first
    const { data: ipfsRecord } = await supabaseAdmin
      .from('ipfs_files')
      .select('*')
      .eq('ipfs_hash', hash)
      .single();

    const gatewayUrl = `${PINATA_GATEWAY}${hash}`;

    res.json({
      ipfsHash: hash,
      gatewayUrl,
      pinataUrl: `https://gateway.pinata.cloud/ipfs/${hash}`,
      record: ipfsRecord || null
    });
  } catch (error) {
    logger.error('IPFS fetch failed:', error);
    throw error;
  }
});

// Pin existing IPFS hash
router.post('/pin', authenticateUser, async (req, res) => {
  const { ipfsHash, name } = req.body;

  if (!ipfsHash) {
    return res.status(400).json({ error: 'IPFS hash required' });
  }

  try {
    const response = await axios.post(
      `${PINATA_API_URL}/pinning/pinByHash`,
      {
        hashToPin: ipfsHash,
        pinataMetadata: {
          name: name || 'Pinned content',
          keyvalues: {
            userId: req.user.id,
            timestamp: new Date().toISOString()
          }
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.PINATA_JWT}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({
      ipfsHash,
      status: response.data.status,
      message: 'Content pinned successfully'
    });
  } catch (error) {
    logger.error('IPFS pinning failed:', error);
    
    if (error.response) {
      return res.status(error.response.status).json({
        error: 'Pinning failed',
        details: error.response.data
      });
    }
    
    throw error;
  }
});

// Unpin content
router.delete('/unpin/:hash', authenticateUser, async (req, res) => {
  const { hash } = req.params;

  try {
    await axios.delete(
      `${PINATA_API_URL}/pinning/unpin/${hash}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.PINATA_JWT}`
        }
      }
    );

    // Update database
    await supabaseAdmin
      .from('ipfs_files')
      .update({ is_pinned: false })
      .eq('ipfs_hash', hash);

    res.json({ message: 'Content unpinned successfully' });
  } catch (error) {
    logger.error('IPFS unpinning failed:', error);
    
    if (error.response) {
      return res.status(error.response.status).json({
        error: 'Unpinning failed',
        details: error.response.data
      });
    }
    
    throw error;
  }
});

// List user's IPFS files
router.get('/user/files', authenticateUser, async (req, res) => {
  const userId = req.user.id;

  try {
    const { data: files, error } = await supabaseAdmin
      .from('ipfs_files')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ files });
  } catch (error) {
    logger.error('IPFS file list fetch failed:', error);
    throw error;
  }
});

module.exports = router;
