const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: './backend/.env' });

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

async function verifySetup() {
  log('\n🔍 Setup Verification\n', 'blue');
  log('=' .repeat(50), 'blue');

  const results = {
    supabase: false,
    supabaseTables: false,
    pinata: false,
    contracts: false
  };

  // 1. Check Supabase Connection
  log('\n1️⃣  Checking Supabase connection...', 'cyan');
  try {
    const response = await axios.get(`${process.env.SUPABASE_URL}/rest/v1/products?select=count`, {
      headers: {
        'apikey': process.env.SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`
      }
    });
    log('   ✅ Supabase connected and tables exist!', 'green');
    results.supabase = true;
    results.supabaseTables = true;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      log('   ⚠️  Connected but tables not created yet', 'yellow');
      log('   → Run the SQL schema in Supabase dashboard', 'yellow');
      results.supabase = true;
    } else {
      log('   ❌ Connection error: ' + (error.message || 'Unknown'), 'red');
    }
  }

  // 2. Check Pinata
  log('\n2️⃣  Checking Pinata (IPFS)...', 'cyan');
  try {
    const response = await axios.get('https://api.pinata.cloud/data/testAuthentication', {
      headers: {
        'Authorization': `Bearer ${process.env.PINATA_JWT}`
      }
    });
    log('   ✅ Pinata authenticated!', 'green');
    results.pinata = true;
  } catch (error) {
    log('   ❌ Pinata error: ' + error.message, 'red');
  }

  // 3. Check Compiled Contracts
  log('\n3️⃣  Checking smart contracts...', 'cyan');
  
  const buildPath = path.join(__dirname, '../build/contracts');
  if (fs.existsSync(buildPath)) {
    const files = fs.readdirSync(buildPath);
    const contracts = files.filter(f => f.endsWith('.json'));
    
    if (contracts.length > 0) {
      log(`   ✅ ${contracts.length} contracts compiled`, 'green');
      log(`   → ProductRegistry, Escrow, SupplyChain`, 'cyan');
      results.contracts = true;
    } else {
      log('   ⚠️  No compiled contracts found', 'yellow');
    }
  } else {
    log('   ⚠️  Contracts not compiled yet', 'yellow');
    log('   → Run: npm run compile', 'yellow');
  }

  // 4. Check Deployed Contracts
  log('\n4️⃣  Checking deployed contracts...', 'cyan');
  const productRegistryAddress = process.env.PRODUCT_REGISTRY_ADDRESS;
  const escrowAddress = process.env.ESCROW_CONTRACT_ADDRESS;
  
  if (productRegistryAddress && productRegistryAddress !== 'deployed_contract_address') {
    log('   ✅ ProductRegistry deployed: ' + productRegistryAddress, 'green');
  } else {
    log('   ⚠️  Contracts not deployed yet', 'yellow');
    log('   → Run: npm run deploy:fuji', 'yellow');
  }

  // Summary
  log('\n' + '=' .repeat(50), 'blue');
  log('\n📊 Setup Status:\n', 'blue');
  
  log(`   Supabase Connection:  ${results.supabase ? '✅' : '❌'}`, results.supabase ? 'green' : 'red');
  log(`   Database Tables:      ${results.supabaseTables ? '✅' : '⚠️ '}`, results.supabaseTables ? 'green' : 'yellow');
  log(`   Pinata (IPFS):        ${results.pinata ? '✅' : '❌'}`, results.pinata ? 'green' : 'red');
  log(`   Contracts Compiled:   ${results.contracts ? '✅' : '⚠️ '}`, results.contracts ? 'green' : 'yellow');

  const allReady = results.supabase && results.supabaseTables && results.pinata && results.contracts;
  
  if (allReady) {
    log('\n✨ All systems ready! You can deploy contracts now.\n', 'green');
  } else {
    log('\n📝 Next Steps:\n', 'yellow');
    if (!results.supabaseTables) {
      log('   1. Run SQL schema in Supabase dashboard (see SUPABASE_SETUP.md)', 'cyan');
    }
    if (!results.contracts) {
      log('   2. Compile contracts: npm run compile', 'cyan');
    }
    log('   3. Deploy to Fuji: npm run deploy:fuji', 'cyan');
    log('   4. Start backend: npm run backend\n', 'cyan');
  }
}

verifySetup().catch(error => {
  log(`\n💥 Error: ${error.message}`, 'red');
  process.exit(1);
});
