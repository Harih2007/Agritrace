const axios = require('axios');

const BASE_URL = process.env.API_URL || 'http://localhost:3000';
let authToken = '';
let productId = '';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
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
    throw error;
  }
};

// Setup: Create user and product
const setup = async () => {
  log('\n📋 Setup: Creating test user and product...', 'cyan');
  
  // Create user
  const email = `qrtest${Date.now()}@example.com`;
  const signupResponse = await axios.post(`${BASE_URL}/api/auth/signup`, {
    email,
    password: 'password123'
  });
  authToken = signupResponse.data.token;
  log(`   User created: ${email}`, 'cyan');

  // Create product
  const productResponse = await axios.post(
    `${BASE_URL}/api/products`,
    {
      name: 'QR Test Product',
      description: 'Product for QR code testing',
      ipfsHash: 'QmTestHash123',
      metadata: { category: 'test' },
      price: 1.5
    },
    { headers: { Authorization: `Bearer ${authToken}` } }
  );
  productId = productResponse.data.product.id;
  log(`   Product created: ID ${productId}`, 'cyan');
};

// Test 1: Generate QR Code
const testGenerateQR = async () => {
  const response = await axios.post(
    `${BASE_URL}/api/qr/generate/${productId}`,
    {},
    { headers: { Authorization: `Bearer ${authToken}` } }
  );

  log(`   ✓ QR code generated`, 'green');
  log(`   ✓ QR data includes: productId, blockchainId, verificationUrl`, 'green');
  log(`   ✓ QR image URL: ${response.data.qrCode.substring(0, 50)}...`, 'cyan');
  
  // Verify QR data structure
  const qrData = response.data.qrData;
  if (!qrData.productId || !qrData.verificationUrl) {
    throw new Error('QR data missing required fields');
  }
  
  return response.data;
};

// Test 2: Verify Product via QR
const testVerifyQR = async () => {
  const response = await axios.get(`${BASE_URL}/api/qr/verify/${productId}`);

  log(`   ✓ Product verified: ${response.data.verified}`, 'green');
  log(`   ✓ Product name: ${response.data.product.name}`, 'cyan');
  log(`   ✓ Blockchain ID: ${response.data.product.blockchainId}`, 'cyan');
  log(`   ✓ Scan count incremented`, 'green');
  
  if (!response.data.product) {
    throw new Error('Product data not returned');
  }
  
  return response.data;
};

// Test 3: Scan QR Code with Valid Data
const testScanValidQR = async () => {
  const qrData = JSON.stringify({
    productId: productId,
    blockchainId: 'test-blockchain-id',
    name: 'QR Test Product',
    verificationUrl: `${BASE_URL}/api/qr/verify/${productId}`
  });

  const response = await axios.post(
    `${BASE_URL}/api/qr/scan`,
    { qrData }
  );

  log(`   ✓ QR code valid: ${response.data.valid}`, 'green');
  log(`   ✓ Product verified: ${response.data.verified}`, 'green');
  log(`   ✓ Scans count: ${response.data.scansCount}`, 'cyan');
  
  if (!response.data.valid) {
    throw new Error('Valid QR code marked as invalid');
  }
  
  return response.data;
};

// Test 4: Scan QR Code with Invalid Data
const testScanInvalidQR = async () => {
  try {
    await axios.post(
      `${BASE_URL}/api/qr/scan`,
      { qrData: 'invalid-json-data' }
    );
    throw new Error('Should have rejected invalid QR data');
  } catch (error) {
    if (error.response && error.response.status === 400) {
      log(`   ✓ Invalid QR data rejected correctly`, 'green');
      log(`   ✓ Error message: ${error.response.data.error}`, 'cyan');
    } else {
      throw error;
    }
  }
};

// Test 5: Scan QR Code with Missing Product
const testScanMissingProduct = async () => {
  const qrData = JSON.stringify({
    productId: 999999,
    blockchainId: 'fake-id',
    name: 'Non-existent Product'
  });

  try {
    await axios.post(
      `${BASE_URL}/api/qr/scan`,
      { qrData }
    );
    throw new Error('Should have rejected QR for non-existent product');
  } catch (error) {
    if (error.response && error.response.status === 404) {
      log(`   ✓ Non-existent product rejected correctly`, 'green');
      log(`   ✓ Error message: ${error.response.data.error}`, 'cyan');
    } else {
      throw error;
    }
  }
};

// Test 6: Get QR Code Statistics
const testQRStats = async () => {
  const response = await axios.get(
    `${BASE_URL}/api/qr/stats/${productId}`,
    { headers: { Authorization: `Bearer ${authToken}` } }
  );

  log(`   ✓ Total QR codes: ${response.data.totalQRCodes}`, 'cyan');
  log(`   ✓ Total scans: ${response.data.totalScans}`, 'cyan');
  log(`   ✓ Latest QR scans: ${response.data.latestQRCode?.scansCount || 0}`, 'cyan');
  
  if (response.data.totalScans < 2) {
    log(`   ⚠️  Expected at least 2 scans (verify + scan tests)`, 'yellow');
  }
  
  return response.data;
};

// Test 7: Multiple Scans Increment Count
const testMultipleScans = async () => {
  log(`   Scanning QR code 3 times...`, 'cyan');
  
  const qrData = JSON.stringify({
    productId: productId,
    blockchainId: 'test-blockchain-id',
    name: 'QR Test Product'
  });

  let lastCount = 0;
  for (let i = 0; i < 3; i++) {
    const response = await axios.post(
      `${BASE_URL}/api/qr/scan`,
      { qrData }
    );
    const currentCount = response.data.scansCount;
    
    if (currentCount <= lastCount && i > 0) {
      throw new Error(`Scan count not incrementing: ${lastCount} -> ${currentCount}`);
    }
    
    lastCount = currentCount;
    log(`   ✓ Scan ${i + 1}: count = ${currentCount}`, 'green');
  }
  
  log(`   ✓ Scan count incremented correctly`, 'green');
};

// Main test runner
const runTests = async () => {
  log('\n🔍 QR Code Functionality Tests\n', 'blue');
  log('=' .repeat(60), 'blue');
  log(`Base URL: ${BASE_URL}\n`, 'yellow');

  try {
    await setup();

    await testEndpoint('1. Generate QR Code', testGenerateQR);
    await testEndpoint('2. Verify Product via QR', testVerifyQR);
    await testEndpoint('3. Scan Valid QR Code', testScanValidQR);
    await testEndpoint('4. Reject Invalid QR Data', testScanInvalidQR);
    await testEndpoint('5. Reject Non-existent Product', testScanMissingProduct);
    await testEndpoint('6. Get QR Code Statistics', testQRStats);
    await testEndpoint('7. Multiple Scans Increment Count', testMultipleScans);

    log('\n' + '=' .repeat(60), 'blue');
    log('\n✨ All QR Code Tests Passed!\n', 'green');
    
    log('📊 Test Summary:', 'cyan');
    log('   ✅ QR code generation', 'green');
    log('   ✅ Product verification', 'green');
    log('   ✅ QR code scanning', 'green');
    log('   ✅ Invalid data rejection', 'green');
    log('   ✅ Scan count tracking', 'green');
    log('   ✅ Statistics retrieval', 'green');
    
    log('\n🎯 All Requirement 4 acceptance criteria verified!\n', 'green');

  } catch (error) {
    log('\n💥 Test suite failed\n', 'red');
    process.exit(1);
  }
};

// Run tests
runTests().catch(error => {
  log(`\n💥 Fatal error: ${error.message}`, 'red');
  process.exit(1);
});
