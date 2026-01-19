const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabase');
const { authenticateWallet } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const Joi = require('joi');

// Validation schemas
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  fullName: Joi.string().optional(),
  role: Joi.string().valid('farmer', 'distributor', 'retailer', 'consumer', 'admin', 'transporter').default('consumer'),
  walletAddress: Joi.string().optional(),
  phone: Joi.string().optional(),
  address: Joi.string().optional()
});

const walletAuthSchema = Joi.object({
  signature: Joi.string().required(),
  message: Joi.string().required(),
  address: Joi.string().required()
});

// Traditional email/password login
router.post('/login', validate(loginSchema), async (req, res) => {
  const { email, password } = req.body;
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    return res.status(401).json({ error: error.message });
  }

  res.json({
    user: data.user,
    session: data.session,
    token: data.session.access_token
  });
});

// Signup
router.post('/signup', validate(signupSchema), async (req, res) => {
  const { email, password, fullName, role, walletAddress, phone, address } = req.body;
  
  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { 
        full_name: fullName,
        role: role || 'consumer'
      }
    }
  });

  if (authError) {
    return res.status(400).json({ error: authError.message });
  }

  // Create user profile with role
  const { data: userData, error: userError } = await supabase
    .from('users')
    .insert({
      id: authData.user.id,
      email,
      full_name: fullName,
      role: role || 'consumer',
      wallet_address: walletAddress,
      phone,
      address
    })
    .select()
    .single();

  if (userError) {
    // If profile creation fails, we should ideally delete the auth user
    // but for now, just log the error
    console.error('Failed to create user profile:', userError);
  }

  res.status(201).json({
    user: {
      ...authData.user,
      profile: userData
    },
    message: 'User created successfully',
    role: role || 'consumer'
  });
});

// Wallet authentication
router.post('/wallet', validate(walletAuthSchema), authenticateWallet, async (req, res) => {
  const { address } = req.body;
  
  // Check if user exists with this wallet
  const { data: existingUser } = await supabase
    .from('users')
    .select('*')
    .eq('wallet_address', address)
    .single();

  if (!existingUser) {
    // Create new user with wallet
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({ wallet_address: address })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json({
      user: newUser,
      message: 'Wallet authenticated and user created'
    });
  }

  res.json({
    user: existingUser,
    message: 'Wallet authenticated successfully'
  });
});

// Get current user profile
router.get('/profile', async (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization header' });
  }

  const token = authHeader.replace('Bearer ', '');
  
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  // Get user profile with role
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError) {
    return res.status(404).json({ error: 'Profile not found' });
  }

  res.json({
    user: {
      ...user,
      profile
    }
  });
});

// Update user profile
router.put('/profile', async (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization header' });
  }

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  const { fullName, phone, address, walletAddress } = req.body;

  const { data, error: updateError } = await supabase
    .from('users')
    .update({
      full_name: fullName,
      phone,
      address,
      wallet_address: walletAddress
    })
    .eq('id', user.id)
    .select()
    .single();

  if (updateError) {
    return res.status(400).json({ error: updateError.message });
  }

  res.json({
    profile: data,
    message: 'Profile updated successfully'
  });
});

// Logout
router.post('/logout', async (req, res) => {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
