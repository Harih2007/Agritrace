/**
 * Script to register products on Avalanche blockchain
 * and store transaction hashes in the database
 */

const path = require('path');
const { ethers } = require(path.join(__dirname, '../backend/node_modules/ethers'));
const { createClient } = require(path.join(__dirname, '../backend/node_modules/@supabase/supabase-js'));
require(path.join(__dirname, '../backend/node_modules/dotenv')).config({ path: './backend/.env' });

// Contract ABI (simplified for registerProduct function)
const PRODUCT_REGISTRY_ABI = [
  "function registerProduct(string memory _name, string memory _ipfsHash, string memory _metadata) public returns (uint256)",
  "function getProduct(uint256 _productId) public view returns (tuple(uint256 id, string name, string ipfsHash, address owner, uint256 timestamp, bool isActive, string metadata))",
  "function productCount() public view returns (uint256)",
  "event ProductRegistered(uint256 indexed productId, address indexed owner, string ipfsHash)"
];

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Initialize ethers provider and wallet
const provider = new ethers.JsonRpcProvider(process.env.AVALANCHE_RPC_URL);

// Create wallet from mnemonic or private key
let wallet;
if (process.env.MNEMONIC) {
  wallet = ethers.Wallet.fromPhrase(process.env.MNEMONIC, provider);
} else if (process.env.PRIVATE_KEY && process.env.PRIVATE_KEY !== '0x0000000000000000000000000000000000000000000000000000000000000000') {
  wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
} else {
  console.error('❌ No valid MNEMONIC or PRIVATE_KEY found in environment');
  process.exit(1);
}

// Contract instance
const productRegistry = new ethers.Contract(
  process.env.PRODUCT_REGISTRY_ADDRESS,
  PRODUCT_REGISTRY_ABI,
  wallet
);

async function registerProductOnChain(productData) {
  console.log(`\n📦 Registering product: ${productData.name}`);
  
  try {
    // Prepare metadata
    const metadata = JSON.stringify({
      description: productData.description || '',
      price: productData.price || '0',
      quantity: productData.quantity || '0',
      location: productData.location || ''
    });

    // Register on blockchain
    console.log('  ⏳ Sending transaction to blockchain...');
    const tx = await productRegistry.registerProduct(
      productData.name,
      productData.ipfs_hash,
      metadata
    );

    console.log(`  📝 Transaction hash: ${tx.hash}`);
    console.log('  ⏳ Waiting for confirmation...');
    
    // Wait for transaction confirmation
    const receipt = await tx.wait();
    
    console.log(`  ✅ Confirmed in block: ${receipt.blockNumber}`);
    console.log(`  ⛽ Gas used: ${receipt.gasUsed.toString()}`);

    // Get the product ID from the event
    const event = receipt.logs.find(log => {
      try {
        const parsed = productRegistry.interface.parseLog(log);
        return parsed.name === 'ProductRegistered';
      } catch (e) {
        return false;
      }
    });

    let blockchainId = null;
    if (event) {
      const parsed = productRegistry.interface.parseLog(event);
      blockchainId = parsed.args.productId.toString();
      console.log(`  🆔 Blockchain Product ID: ${blockchainId}`);
    }

    return {
      success: true,
      transactionHash: tx.hash,
      blockNumber: receipt.blockNumber,
      blockchainId: blockchainId,
      gasUsed: receipt.gasUsed.toString()
    };

  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
}

async function updateProductInDatabase(productId, blockchainData) {
  console.log(`  💾 Updating database for product ID: ${productId}`);
  
  try {
    const { data, error } = await supabase
      .from('products')
      .update({
        blockchain_hash: blockchainData.transactionHash,
        blockchain_id: blockchainData.blockchainId || productId.toString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', productId);

    if (error) throw error;
    
    console.log('  ✅ Database updated successfully');
    return true;
  } catch (error) {
    console.error(`  ❌ Database error: ${error.message}`);
    return false;
  }
}

async function registerAllProducts() {
  console.log('🚀 Starting product registration on Avalanche Fuji\n');
  console.log('=' .repeat(60));
  
  try {
    // Get all products from database that don't have blockchain_hash
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .or('blockchain_hash.is.null,blockchain_hash.eq.');

    if (error) throw error;

    if (!products || products.length === 0) {
      console.log('\n✅ All products are already registered on blockchain!');
      return;
    }

    console.log(`\n📋 Found ${products.length} products to register\n`);

    let successCount = 0;
    let failCount = 0;

    for (const product of products) {
      const result = await registerProductOnChain(product);
      
      if (result.success) {
        const updated = await updateProductInDatabase(product.id, result);
        if (updated) {
          successCount++;
          console.log(`  🎉 Product registered successfully!\n`);
        } else {
          failCount++;
        }
      } else {
        failCount++;
      }

      // Wait a bit between transactions to avoid nonce issues
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 Registration Summary:');
    console.log(`  ✅ Successful: ${successCount}`);
    console.log(`  ❌ Failed: ${failCount}`);
    console.log(`  📦 Total: ${products.length}`);
    console.log('\n🎉 Registration process complete!');

  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  }
}

async function registerSingleProduct(productId) {
  console.log(`🚀 Registering single product ID: ${productId}\n`);
  console.log('=' .repeat(60));
  
  try {
    // Get product from database
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (error) throw error;
    if (!product) {
      console.log('❌ Product not found in database');
      return;
    }

    const result = await registerProductOnChain(product);
    
    if (result.success) {
      await updateProductInDatabase(product.id, result);
      console.log('\n🎉 Product registered successfully!');
      console.log(`\nView on explorer: https://testnet.snowtrace.io/tx/${result.transactionHash}`);
    } else {
      console.log('\n❌ Registration failed');
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

// Main execution
const args = process.argv.slice(2);
if (args.length > 0 && args[0] === '--product-id') {
  const productId = args[1];
  if (!productId) {
    console.log('Usage: node register-product-onchain.js --product-id <id>');
    process.exit(1);
  }
  registerSingleProduct(productId);
} else {
  registerAllProducts();
}
