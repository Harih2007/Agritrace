const axios = require('axios');
require('dotenv').config();

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

// Test Supabase
async function testSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  
  if (!url || !key) {
    log('❌ Supabase credentials not found in .env', 'red');
    return false;
  }

  try {
    const response = await axios.get(`${url}/rest/v1/`, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      }
    });
    log('✅ Supabase connection successful', 'green');
    log(`   URL: ${url}`, 'cyan');
    return true;
  } catch (error) {
    log('❌ Supabase connection failed', 'red');
    log(`   Error: ${error.message}`, 'yellow');
    if (error.response) {
      log(`   Status: ${error.response.status}`, 'yellow');
    }
    return false;
  }
}

// Test Pinata
async function testPinata() {
  const apiKey = process.env.PINATA_API_KEY;
  const jwt = process.env.PINATA_JWT;
  
  if (!apiKey && !jwt) {
    log('❌ Pinata credentials not found in .env', 'red');
    return false;
  }

  try {
    const headers = jwt 
      ? { 'Authorization': `Bearer ${jwt}` }
      : { 'pinata_api_key': apiKey, 'pinata_secret_api_key': process.env.PINATA_SECRET_KEY };

    const response = await axios.get('https://api.pinata.cloud/data/testAuthentication', {
      headers
    });
    
    log('✅ Pinata authentication successful', 'green');
    log(`   Message: ${response.data.message}`, 'cyan');
    return true;
  } catch (error) {
    log('❌ Pinata authentication failed', 'red');
    log(`   Error: ${error.message}`, 'yellow');
    if (error.response) {
      log(`   Status: ${error.response.status}`, 'yellow');
      log(`   Data: ${JSON.stringify(error.response.data)}`, 'yellow');
    }
    return false;
  }
}

// Test Avalanche RPC
async function testAvalancheRPC() {
  const rpcUrl = process.env.AVALANCHE_RPC_URL;
  
  if (!rpcUrl) {
    log('❌ Avalanche RPC URL not found in .env', 'red');
    return false;
  }

  try {
    const response = await axios.post(rpcUrl, {
      jsonrpc: '2.0',
      method: 'eth_blockNumber',
      params: [],
      id: 1
    });
    
    const blockNumber = parseInt(response.data.result, 16);
    log('✅ Avalanche RPC connection successful', 'green');
    log(`   URL: ${rpcUrl}`, 'cyan');
    log(`   Current block: ${blockNumber}`, 'cyan');
    return true;
  } catch (error) {
    log('❌ Avalanche RPC connection failed', 'red');
    log(`   Error: ${error.message}`, 'yellow');
    return false;
  }
}

// Test Infura (if configured)
async function testInfura() {
  const infuraKey = process.env.INFURA_API;
  
  if (!infuraKey) {
    log('⚠️  Infura API key not configured (optional)', 'yellow');
    return null;
  }

  try {
    const response = await axios.post(`https://avalanche-fuji.infura.io/v3/${infuraKey}`, {
      jsonrpc: '2.0',
      method: 'eth_blockNumber',
      params: [],
      id: 1
    });
    
    const blockNumber = parseInt(response.data.result, 16);
    log('✅ Infura connection successful', 'green');
    log(`   Current block: ${blockNumber}`, 'cyan');
    return true;
  } catch (error) {
    log('❌ Infura connection failed', 'red');
    log(`   Error: ${error.message}`, 'yellow');
    return false;
  }
}

// Main test runner
async function runTests() {
  log('\n🔑 API Key Validation Test\n', 'blue');
  log('=' .repeat(50), 'blue');
  
  const results = {
    supabase: false,
    pinata: false,
    avalanche: false,
    infura: null
  };

  log('\n📊 Testing Supabase...', 'blue');
  results.supabase = await testSupabase();

  log('\n📦 Testing Pinata (IPFS)...', 'blue');
  results.pinata = await testPinata();

  log('\n⛓️  Testing Avalanche RPC...', 'blue');
  results.avalanche = await testAvalancheRPC();

  log('\n🌐 Testing Infura...', 'blue');
  results.infura = await testInfura();

  // Summary
  log('\n' + '=' .repeat(50), 'blue');
  log('\n📋 Summary:', 'blue');
  log(`   Supabase: ${results.supabase ? '✅ Working' : '❌ Failed'}`, results.supabase ? 'green' : 'red');
  log(`   Pinata: ${results.pinata ? '✅ Working' : '❌ Failed'}`, results.pinata ? 'green' : 'red');
  log(`   Avalanche: ${results.avalanche ? '✅ Working' : '❌ Failed'}`, results.avalanche ? 'green' : 'red');
  if (results.infura !== null) {
    log(`   Infura: ${results.infura ? '✅ Working' : '❌ Failed'}`, results.infura ? 'green' : 'red');
  }

  const allPassed = results.supabase && results.pinata && results.avalanche;
  
  if (allPassed) {
    log('\n✨ All required API keys are valid!\n', 'green');
  } else {
    log('\n⚠️  Some API keys need attention. Check the errors above.\n', 'yellow');
  }
}

// Run the tests
runTests().catch(error => {
  log(`\n💥 Test failed: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
