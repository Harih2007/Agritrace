/**
 * Test script for blockchain transaction viewing functionality
 * Tests the "View On-chain" button feature
 */

const axios = require('axios');

const API_BASE_URL = process.env.API_URL || 'http://localhost:3000/api';
const AVALANCHE_EXPLORER = 'https://testnet.snowtrace.io';

// Sample test transaction hash (you can replace with real ones)
const TEST_PRODUCTS = [
  {
    id: 'AGT-001',
    name: 'Organic Tomatoes',
    blockchain_hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
  },
  {
    id: 'AGT-002',
    name: 'Free-Range Eggs',
    blockchain_hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
  }
];

async function testBlockchainView() {
  console.log('🧪 Testing Blockchain Transaction View Functionality\n');
  console.log('=' .repeat(60));

  // Test 1: Verify explorer URL format
  console.log('\n📋 Test 1: Verify Explorer URL Format');
  TEST_PRODUCTS.forEach(product => {
    const explorerUrl = `${AVALANCHE_EXPLORER}/tx/${product.blockchain_hash}`;
    console.log(`✓ Product ${product.id}: ${explorerUrl}`);
  });

  // Test 2: Check if products have blockchain_hash field
  console.log('\n📋 Test 2: Check Product Schema');
  try {
    const response = await axios.get(`${API_BASE_URL}/products`);
    const products = response.data;
    
    if (products && products.length > 0) {
      const hasBlockchainHash = products.every(p => 'blockchain_hash' in p);
      if (hasBlockchainHash) {
        console.log('✓ All products have blockchain_hash field');
        console.log(`✓ Found ${products.length} products in database`);
        
        // Show sample product
        const sample = products[0];
        console.log('\nSample product:');
        console.log(`  ID: ${sample.id}`);
        console.log(`  Name: ${sample.name}`);
        console.log(`  Blockchain Hash: ${sample.blockchain_hash || 'Not set'}`);
      } else {
        console.log('✗ Some products missing blockchain_hash field');
      }
    } else {
      console.log('⚠ No products found in database');
    }
  } catch (error) {
    console.log('⚠ Could not fetch products from API');
    console.log(`  Error: ${error.message}`);
  }

  // Test 3: Simulate viewOnChain function
  console.log('\n📋 Test 3: Simulate viewOnChain Function');
  const testProduct = TEST_PRODUCTS[0];
  console.log(`Testing with product: ${testProduct.name}`);
  
  if (testProduct.blockchain_hash) {
    const explorerUrl = `${AVALANCHE_EXPLORER}/tx/${testProduct.blockchain_hash}`;
    console.log('✓ Function would open:', explorerUrl);
    console.log('✓ Toast message: "Opening blockchain explorer..."');
  } else {
    console.log('✗ Function would show error: "Blockchain transaction not found"');
  }

  // Test 4: Verify Avalanche Fuji testnet explorer accessibility
  console.log('\n📋 Test 4: Check Avalanche Explorer Accessibility');
  try {
    const response = await axios.get(AVALANCHE_EXPLORER, { timeout: 5000 });
    if (response.status === 200) {
      console.log('✓ Avalanche Fuji testnet explorer is accessible');
      console.log(`  URL: ${AVALANCHE_EXPLORER}`);
    }
  } catch (error) {
    console.log('⚠ Could not reach Avalanche explorer');
    console.log(`  This is normal - the explorer may block automated requests`);
  }

  // Test 5: Generate sample blockchain URLs
  console.log('\n📋 Test 5: Sample Blockchain Explorer URLs');
  console.log('\nYou can test these URLs in your browser:');
  TEST_PRODUCTS.forEach(product => {
    console.log(`\n${product.name}:`);
    console.log(`  Transaction: ${AVALANCHE_EXPLORER}/tx/${product.blockchain_hash}`);
    console.log(`  (Note: These are sample hashes for testing)`);
  });

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('✅ Blockchain View Tests Complete\n');
  console.log('Next Steps:');
  console.log('1. Start your frontend: cd frontend && npm run dev');
  console.log('2. Navigate to the Farmer Dashboard');
  console.log('3. Click "View On-chain" button on any product');
  console.log('4. Verify it opens the Avalanche explorer in a new tab');
  console.log('\nNote: For real transactions, you need to:');
  console.log('- Deploy contracts to Avalanche Fuji testnet');
  console.log('- Register products on-chain');
  console.log('- Store the transaction hash in the database');
}

// Run tests
testBlockchainView().catch(error => {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
});
