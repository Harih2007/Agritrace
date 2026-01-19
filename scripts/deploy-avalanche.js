const fs = require('fs');
const path = require('path');

/**
 * Post-deployment script for Avalanche
 * Copies ABIs and updates configuration
 */

async function main() {
  console.log('🚀 Starting Avalanche deployment setup...\n');

  // Check if build directory exists
  const buildDir = path.join(__dirname, '../build/contracts');
  if (!fs.existsSync(buildDir)) {
    console.error('❌ Build directory not found. Please run "truffle compile" first.');
    process.exit(1);
  }

  // Create backend/abis directory
  const abisDir = path.join(__dirname, '../backend/abis');
  if (!fs.existsSync(abisDir)) {
    fs.mkdirSync(abisDir, { recursive: true });
    console.log('✅ Created backend/abis directory');
  }

  // Copy ABI files
  const contracts = ['ProductRegistry', 'Escrow', 'SupplyChain'];
  
  for (const contract of contracts) {
    const sourcePath = path.join(buildDir, `${contract}.json`);
    const destPath = path.join(abisDir, `${contract}.json`);
    
    if (fs.existsSync(sourcePath)) {
      const contractData = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
      
      // Extract only ABI and networks
      const abiData = {
        abi: contractData.abi,
        networks: contractData.networks,
        contractName: contractData.contractName
      };
      
      fs.writeFileSync(destPath, JSON.stringify(abiData, null, 2));
      console.log(`✅ Copied ${contract} ABI`);
      
      // Display deployed addresses
      if (contractData.networks) {
        Object.keys(contractData.networks).forEach(networkId => {
          const address = contractData.networks[networkId].address;
          console.log(`   Network ${networkId}: ${address}`);
        });
      }
    } else {
      console.warn(`⚠️  ${contract}.json not found in build directory`);
    }
  }

  console.log('\n📝 Next steps:');
  console.log('1. Update backend/.env with deployed contract addresses');
  console.log('2. Run database migrations: cd backend && npm run migrate');
  console.log('3. Start backend server: cd backend && npm run dev');
  console.log('\n✨ Setup complete!');
}

main().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
