const { ethers } = require('ethers');
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

async function checkWallet() {
  log('\n💰 Wallet Balance Check\n', 'blue');
  log('=' .repeat(50), 'blue');

  const rpcUrl = process.env.AVALANCHE_RPC || 'https://api.avax-test.network/ext/bc/C/rpc';
  const mnemonic = process.env.MNEMONIC_KEY;
  const privateKey = process.env.PRIVATE_KEY;

  if (!mnemonic && !privateKey) {
    log('\n❌ No wallet credentials found!', 'red');
    log('\nYou need to set either:', 'yellow');
    log('  1. MNEMONIC_KEY in root .env file', 'yellow');
    log('  2. PRIVATE_KEY in root .env file', 'yellow');
    log('\n📝 To get started:', 'cyan');
    log('  1. Create a MetaMask wallet', 'cyan');
    log('  2. Copy your 12-word mnemonic phrase', 'cyan');
    log('  3. Add it to .env file: MNEMONIC_KEY="your twelve word phrase here"', 'cyan');
    log('  4. Get testnet AVAX from: https://faucet.avax.network/', 'cyan');
    return;
  }

  try {
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    let wallet;

    if (mnemonic && mnemonic !== 'your_wallet_mnemonic_phrase') {
      wallet = ethers.Wallet.fromMnemonic(mnemonic).connect(provider);
      log('✅ Wallet loaded from mnemonic', 'green');
    } else if (privateKey && privateKey !== 'your_private_key') {
      wallet = new ethers.Wallet(privateKey, provider);
      log('✅ Wallet loaded from private key', 'green');
    } else {
      log('❌ Wallet credentials are placeholder values', 'red');
      log('Please update your .env file with real credentials', 'yellow');
      return;
    }

    const address = wallet.address;
    const balance = await provider.getBalance(address);
    const balanceInAvax = ethers.utils.formatEther(balance);
    const network = await provider.getNetwork();

    log(`\n📍 Network: ${network.name || 'Unknown'} (Chain ID: ${network.chainId})`, 'cyan');
    log(`🔑 Address: ${address}`, 'cyan');
    log(`💵 Balance: ${balanceInAvax} AVAX`, balanceInAvax > 0 ? 'green' : 'red');

    if (parseFloat(balanceInAvax) === 0) {
      log('\n⚠️  Your wallet has no AVAX!', 'yellow');
      log('\n📝 To get testnet AVAX:', 'cyan');
      log('  1. Visit: https://faucet.avax.network/', 'cyan');
      log(`  2. Enter your address: ${address}`, 'cyan');
      log('  3. Request testnet AVAX (you\'ll get 2 AVAX)', 'cyan');
      log('  4. Wait ~30 seconds for confirmation', 'cyan');
    } else if (parseFloat(balanceInAvax) < 0.5) {
      log('\n⚠️  Low balance! You might need more AVAX for deployment', 'yellow');
    } else {
      log('\n✅ Sufficient balance for deployment!', 'green');
      log('\n📋 Estimated deployment costs:', 'cyan');
      log('  - ProductRegistry: ~0.05 AVAX', 'cyan');
      log('  - Escrow: ~0.03 AVAX', 'cyan');
      log('  - SupplyChain: ~0.1 AVAX', 'cyan');
      log('  - Total: ~0.2 AVAX', 'cyan');
    }

    // Check network connectivity
    const blockNumber = await provider.getBlockNumber();
    log(`\n🔗 Network Status: Connected (Block ${blockNumber})`, 'green');

  } catch (error) {
    log('\n❌ Error checking wallet:', 'red');
    log(`   ${error.message}`, 'yellow');
    
    if (error.message.includes('invalid mnemonic')) {
      log('\n💡 Your mnemonic phrase appears to be invalid', 'yellow');
      log('   Make sure it\'s exactly 12 or 24 words', 'yellow');
    }
  }

  log('\n' + '=' .repeat(50) + '\n', 'blue');
}

checkWallet().catch(error => {
  log(`\n💥 Fatal error: ${error.message}`, 'red');
  process.exit(1);
});
