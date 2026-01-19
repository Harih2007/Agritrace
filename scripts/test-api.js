const axios = require('axios');

const BASE_URL = process.env.API_URL || 'http://localhost:3000';
let authToken = '';
let productId = '';
let escrowId = '';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

const testEndpoint = async (name, fn) => {
  try {
    log(`\n🧪 Testing: ${name}`, 'blue');
    await fn();
    log(`✅ ${name} - PASSED`, 'green');
  } catch (error) {
    log(`❌ ${name} - FAILED`, 'red');
    if (error.response) {
      log(`   Status: ${error.response.status}`, 'yellow');
      log(`   Error: ${JSON.stringify(error.response.data, null, 2)}`, 'yellow');
    } else {
      log(`   Error: ${error.message}`, 'yellow');
    }
  }
};

// Test functions
const testHealthCheck = async () => {
  const response = await axios.get(`${BASE_URL}/health`);
  log(`   Response: ${JSON.stringify(response.data)}`, 'reset');
};

const testSignup = async () => {
  const response = await axios.post(`${BASE_URL}/api/auth/signup`, {
    email: `test${Date.now()}@example.com`,
    password: 'password123'
  });
  log(`   User created: ${response.data.user.email}`, 'reset');
};

const testLogin = async () => {
  // First create a user
  const email = `test${Date.now()}@example.com`;
  await axios.post(`${BASE_URL}/api/auth/signup`, {
    email,
    password: 'password123'
  });
  
  // Then login
  const response = await axios.post(`${BASE_URL}/api/auth/login`, {
    email,
    password: 'password123'
  });
  
  authToken = response.data.token;
  log(`   Token received: ${authToken.substring(0, 20)}...`, 'reset');
};

const testCreateProduct = async () => {
  const response = await axios.post(
    `${BASE_URL}/api/products`,
    {
      name: 'Test Product',
      description: 'A test product for API testing',
      ipfsHash: 'QmTest123456789',
      metadata: { category: 'test', weight: '1kg' },
      price: 99.99
    },
    {
      headers: { Authorization: `Bearer ${authToken}` }
    }
  );
  
  productId = response.data.product.id;
  log(`   Product created: ID ${productId}`, 'reset');
  log(`   Blockchain hash: ${response.data.blockchainHash}`, 'reset');
};

const testGetProduct = async () => {
  const response = await axios.get(`${BASE_URL}/api/products/${productId}`);
  log(`   Product: ${response.data.product.name}`, 'reset');
  log(`   Blockchain ID: ${response.data.blockchain.id}`, 'reset');
};

const testUpdateProduct = async () => {
  const response = await axios.put(
    `${BASE_URL}/api/products/${productId}`,
    {
      metadata: { category: 'updated', weight: '2kg' }
    },
    {
      headers: { Authorization: `Bearer ${authToken}` }
    }
  );
  log(`   Product updated: ${response.data.message}`, 'reset');
};

const testGenerateQR = async () => {
  const response = await axios.post(
    `${BASE_URL}/api/qr/generate/${productId}`,
    {},
    {
      headers: { Authorization: `Bearer ${authToken}` }
    }
  );
  log(`   QR code generated`, 'reset');
  log(`   Verification URL: ${response.data.qrData.verificationUrl}`, 'reset');
};

const testVerifyQR = async () => {
  const response = await axios.get(`${BASE_URL}/api/qr/verify/${productId}`);
  log(`   Verified: ${response.data.verified}`, 'reset');
  log(`   Product: ${response.data.product.name}`, 'reset');
};

const testIPFSUpload = async () => {
  const response = await axios.post(
    `${BASE_URL}/api/ipfs/upload`,
    {
      content: { test: 'data', timestamp: Date.now() },
      name: 'Test Upload',
      metadata: { type: 'test' }
    },
    {
      headers: { Authorization: `Bearer ${authToken}` }
    }
  );
  log(`   IPFS Hash: ${response.data.ipfsHash}`, 'reset');
  log(`   Gateway URL: ${response.data.gatewayUrl}`, 'reset');
};

const testCreateEscrow = async () => {
  const response = await axios.post(
    `${BASE_URL}/api/payments/escrow`,
    {
      productId: productId,
      sellerAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      amount: '0.1'
    },
    {
      headers: { Authorization: `Bearer ${authToken}` }
    }
  );
  
  escrowId = response.data.escrow.id;
  log(`   Escrow created: ID ${escrowId}`, 'reset');
  log(`   Blockchain hash: ${response.data.blockchainHash}`, 'reset');
};

const testGetEscrow = async () => {
  const response = await axios.get(
    `${BASE_URL}/api/payments/escrow/${escrowId}`,
    {
      headers: { Authorization: `Bearer ${authToken}` }
    }
  );
  log(`   Escrow status: ${response.data.escrow.status}`, 'reset');
  log(`   Amount: ${response.data.blockchain.amount} AVAX`, 'reset');
};

// Main test runner
const runTests = async () => {
  log('🚀 Starting API Tests\n', 'blue');
  log(`Base URL: ${BASE_URL}\n`, 'yellow');

  // Basic tests
  await testEndpoint('Health Check', testHealthCheck);
  await testEndpoint('User Signup', testSignup);
  await testEndpoint('User Login', testLogin);

  // Product tests (require auth)
  if (authToken) {
    await testEndpoint('Create Product', testCreateProduct);
    
    if (productId) {
      await testEndpoint('Get Product', testGetProduct);
      await testEndpoint('Update Product', testUpdateProduct);
      await testEndpoint('Generate QR Code', testGenerateQR);
      await testEndpoint('Verify QR Code', testVerifyQR);
    }

    // IPFS tests
    await testEndpoint('Upload to IPFS', testIPFSUpload);

    // Payment tests (require blockchain)
    if (productId) {
      log('\n⚠️  Escrow tests require deployed contracts and funded wallet', 'yellow');
      // Uncomment when contracts are deployed
      // await testEndpoint('Create Escrow', testCreateEscrow);
      // if (escrowId) {
      //   await testEndpoint('Get Escrow', testGetEscrow);
      // }
    }
  }

  log('\n✨ Test suite completed!\n', 'green');
};

// Run tests
runTests().catch(error => {
  log(`\n💥 Test suite failed: ${error.message}`, 'red');
  process.exit(1);
});
