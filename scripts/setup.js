const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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

const exec = (command, cwd = process.cwd()) => {
  try {
    execSync(command, { cwd, stdio: 'inherit' });
    return true;
  } catch (error) {
    return false;
  }
};

const checkFile = (filePath) => {
  return fs.existsSync(filePath);
};

const copyEnvFile = (source, dest) => {
  if (!checkFile(dest)) {
    fs.copyFileSync(source, dest);
    log(`✅ Created ${dest}`, 'green');
    return true;
  } else {
    log(`⚠️  ${dest} already exists, skipping`, 'yellow');
    return false;
  }
};

async function setup() {
  log('\n🚀 AgriChain Setup Script\n', 'cyan');
  log('This script will help you set up the project for Avalanche deployment.\n', 'blue');

  // Step 1: Check Node.js version
  log('📋 Step 1: Checking Node.js version...', 'blue');
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.split('.')[0].substring(1));
  
  if (majorVersion >= 16) {
    log(`✅ Node.js ${nodeVersion} detected`, 'green');
  } else {
    log(`❌ Node.js 16+ required. Current: ${nodeVersion}`, 'red');
    process.exit(1);
  }

  // Step 2: Check for required tools
  log('\n📋 Step 2: Checking required tools...', 'blue');
  
  const hasTruffle = exec('truffle version', process.cwd());
  if (!hasTruffle) {
    log('⚠️  Truffle not found. Install with: npm install -g truffle', 'yellow');
  } else {
    log('✅ Truffle installed', 'green');
  }

  // Step 3: Create environment files
  log('\n📋 Step 3: Setting up environment files...', 'blue');
  
  const rootEnvExample = path.join(__dirname, '../.env.example');
  const rootEnv = path.join(__dirname, '../.env');
  
  if (checkFile(rootEnvExample)) {
    copyEnvFile(rootEnvExample, rootEnv);
  }

  const backendEnvExample = path.join(__dirname, '../backend/.env.example');
  const backendEnv = path.join(__dirname, '../backend/.env');
  
  if (checkFile(backendEnvExample)) {
    copyEnvFile(backendEnvExample, backendEnv);
  }

  // Step 4: Install dependencies
  log('\n📋 Step 4: Installing dependencies...', 'blue');
  
  log('Installing root dependencies...', 'cyan');
  if (exec('npm install', path.join(__dirname, '..'))) {
    log('✅ Root dependencies installed', 'green');
  } else {
    log('❌ Failed to install root dependencies', 'red');
  }

  log('Installing backend dependencies...', 'cyan');
  if (exec('npm install', path.join(__dirname, '../backend'))) {
    log('✅ Backend dependencies installed', 'green');
  } else {
    log('❌ Failed to install backend dependencies', 'red');
  }

  // Step 5: Create necessary directories
  log('\n📋 Step 5: Creating directories...', 'blue');
  
  const dirs = [
    path.join(__dirname, '../backend/abis'),
    path.join(__dirname, '../build')
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      log(`✅ Created ${dir}`, 'green');
    }
  });

  // Step 6: Display next steps
  log('\n✨ Setup Complete!\n', 'green');
  log('📝 Next Steps:\n', 'cyan');
  log('1. Configure your environment files:', 'yellow');
  log('   - Edit .env with your mnemonic and RPC URL', 'reset');
  log('   - Edit backend/.env with all required credentials', 'reset');
  log('');
  log('2. Get Avalanche testnet AVAX:', 'yellow');
  log('   - Visit: https://faucet.avax.network/', 'reset');
  log('   - Request testnet AVAX for your wallet', 'reset');
  log('');
  log('3. Set up Supabase:', 'yellow');
  log('   - Create a project at https://supabase.com', 'reset');
  log('   - Run the schema from backend/database/schema.sql', 'reset');
  log('   - Add credentials to backend/.env', 'reset');
  log('');
  log('4. Set up Pinata (IPFS):', 'yellow');
  log('   - Create account at https://pinata.cloud', 'reset');
  log('   - Get API keys and JWT token', 'reset');
  log('   - Add credentials to backend/.env', 'reset');
  log('');
  log('5. Compile and deploy contracts:', 'yellow');
  log('   - Run: truffle compile', 'reset');
  log('   - Run: truffle migrate --network avalanche_fuji', 'reset');
  log('   - Run: node scripts/deploy-avalanche.js', 'reset');
  log('');
  log('6. Start the backend server:', 'yellow');
  log('   - cd backend', 'reset');
  log('   - npm run dev', 'reset');
  log('');
  log('7. Test the API:', 'yellow');
  log('   - Run: node scripts/test-api.js', 'reset');
  log('');
  log('📚 Documentation:', 'cyan');
  log('   - AVALANCHE_DEPLOYMENT_GUIDE.md - Complete deployment guide', 'reset');
  log('   - REQUIREMENTS_CHECKLIST.md - Implementation status', 'reset');
  log('   - backend/API_REFERENCE.md - API documentation', 'reset');
  log('');
  log('🎉 Happy coding!\n', 'green');
}

setup().catch(error => {
  log(`\n❌ Setup failed: ${error.message}`, 'red');
  process.exit(1);
});
