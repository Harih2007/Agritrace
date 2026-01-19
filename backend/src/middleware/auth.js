const { supabase } = require('../config/supabase');
const { ethers } = require('ethers');

const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    
    // Verify Supabase JWT token
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

const authenticateWallet = async (req, res, next) => {
  try {
    const { signature, message, address } = req.body;
    
    if (!signature || !message || !address) {
      return res.status(400).json({ error: 'Missing wallet authentication data' });
    }

    // Verify signature
    const recoveredAddress = ethers.verifyMessage(message, signature);
    
    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    req.walletAddress = address;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Wallet authentication failed' });
  }
};

module.exports = { authenticateUser, authenticateWallet };
