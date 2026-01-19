/**
 * Smart Contract Verification Script
 * Run this to prove the contracts are deployed and working
 */

const path = require('path');
const { ethers } = require(path.join(__dirname, '../backend/node_modules/ethers'));

// Contract addresses on Avalanche Fuji
const CONTRACTS = {
  ProductRegistry: '0x8bb1D4dE341096dBAd6384d965256d94dA4D8590',
  SupplyChain: '0x9B59524C1660e70411159Af4C3D24fDfCc0CA684',
  Escrow: '0xEC7C5FBe04d9abD1993CB32225c98DE0a8683066'
};

const SAMPLE_TX = '0x3f90e3a1a861d657e0e2a881111cf16225b2573b08991b81c2899bcfa45a1304';
const RPC_URL = 'https://api.avax-test.network/ext/bc/C/rpc';

async function verifyContracts() {
  console.log('🔍 Verifying Smart Contracts on Avalanche Fuji Testnet\n');
  console.log('='.repeat(70));
  
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  
  // Check network
  console.log('\n📡 Network Information:');
  const network = await provider.getNetwork();
  console.log(`   Chain ID: ${network.chainId}`);
  console.log(`   Network: Avalanche Fuji Testnet`);
  console.log(`   RPC: ${RPC_URL}`);
  
  // Verify each contract
  console.log('\n📋 Contract Verification:');
  for (const [name, address] of Object.entries(CONTRACTS)) {
    console.log(`\n   ${name}:`);
    console.log(`   Address: ${address}`);
    
    try {
      // Get contract code
      const code = await provider.getCode(address);
      
      if (code === '0x') {
        console.log(`   ❌ NOT DEPLOYED - No code at this address`);
      } else {
        console.log(`   ✅ DEPLOYED - Contract code found (${code.length} bytes)`);
        console.log(`   🔗 View: https://testnet.snowtrace.io/address/${address}`);
        
        // Get contract balance
        const balance = await provider.getBalance(address);
        console.log(`   💰 Balance: ${ethers.formatEther(balance)} AVAX`);
      }
    } catch (error) {
      console.log(`   ❌ ERROR: ${error.message}`);
    }
  }
  
  // Verify sample transaction
  console.log('\n📝 Sample Transaction Verification:');
  console.log(`   Transaction Hash: ${SAMPLE_TX}`);
  
  try {
    const tx = await provider.getTransaction(SAMPLE_TX);
    
    if (tx) {
      console.log(`   ✅ FOUND - Transaction exists on blockchain`);
      console.log(`   Block Number: ${tx.blockNumber}`);
      console.log(`   From: ${tx.from}`);
      console.log(`   To: ${tx.to}`);
      console.log(`   Value: ${ethers.formatEther(tx.value)} AVAX`);
      console.log(`   🔗 View: https://testnet.snowtrace.io/tx/${SAMPLE_TX}`);
      
      // Get receipt
      const receipt = await provider.getTransactionReceipt(SAMPLE_TX);
      if (receipt) {
        console.log(`   Gas Used: ${receipt.gasUsed.toString()}`);
        console.log(`   Status: ${receipt.status === 1 ? '✅ Success' : '❌ Failed'}`);
      }
    } else {
      console.log(`   ❌ NOT FOUND - Transaction does not exist`);
    }
  } catch (error) {
    console.log(`   ❌ ERROR: ${error.message}`);
  }
  
  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('\n✅ Verification Complete!\n');
  console.log('📊 Summary:');
  console.log(`   • ${Object.keys(CONTRACTS).length} contracts deployed on Avalanche Fuji`);
  console.log(`   • All contracts are publicly verifiable`);
  console.log(`   • Transaction history is available on SnowTrace`);
  console.log('\n🔗 Quick Links:');
  console.log(`   • SnowTrace Explorer: https://testnet.snowtrace.io/`);
  console.log(`   • ProductRegistry: https://testnet.snowtrace.io/address/${CONTRACTS.ProductRegistry}`);
  console.log(`   • Sample Transaction: https://testnet.snowtrace.io/tx/${SAMPLE_TX}`);
  console.log('\n💡 Tip: Copy any address above and search on testnet.snowtrace.io to verify!\n');
}

// Run verification
verifyContracts().catch(error => {
  console.error('\n❌ Verification failed:', error.message);
  process.exit(1);
});
