const axios = require('axios');

const BASE_URL = process.env.API_URL || 'http://localhost:3000';

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

const testUsers = [
  {
    email: 'farmer@agrichain.com',
    password: 'Farmer123!',
    fullName: 'John Farmer',
    role: 'farmer',
    phone: '+1234567890',
    address: '123 Farm Road, Rural County'
  },
  {
    email: 'distributor@agrichain.com',
    password: 'Distributor123!',
    fullName: 'Sarah Distributor',
    role: 'distributor',
    phone: '+1234567891',
    address: '456 Distribution Center, City'
  },
  {
    email: 'retailer@agrichain.com',
    password: 'Retailer123!',
    fullName: 'Mike Retailer',
    role: 'retailer',
    phone: '+1234567892',
    address: '789 Store Street, Downtown'
  },
  {
    email: 'consumer@agrichain.com',
    password: 'Consumer123!',
    fullName: 'Jane Consumer',
    role: 'consumer',
    phone: '+1234567893',
    address: '321 Home Avenue, Suburb'
  },
  {
    email: 'admin@agrichain.com',
    password: 'Admin123!',
    fullName: 'Admin User',
    role: 'admin',
    phone: '+1234567894',
    address: 'AgriChain HQ'
  },
  {
    email: 'transporter@agrichain.com',
    password: 'Transporter123!',
    fullName: 'Tom Transporter',
    role: 'transporter',
    phone: '+1234567895',
    address: '555 Transport Hub, Industrial Zone'
  }
];

async function createUser(userData) {
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/signup`, userData);
    log(`✅ Created ${userData.role}: ${userData.email}`, 'green');
    log(`   Name: ${userData.fullName}`, 'cyan');
    log(`   Password: ${userData.password}`, 'cyan');
    return response.data;
  } catch (error) {
    if (error.response) {
      log(`❌ Failed to create ${userData.role}: ${error.response.data.error}`, 'red');
    } else {
      log(`❌ Error: ${error.message}`, 'red');
    }
    return null;
  }
}

async function createAllUsers() {
  log('\n🌾 Creating Test Users for AgriChain\n', 'blue');
  log('=' .repeat(60), 'blue');
  log(`\nAPI URL: ${BASE_URL}\n`, 'yellow');

  const results = [];

  for (const user of testUsers) {
    const result = await createUser(user);
    results.push({ ...user, success: !!result });
    log(''); // Empty line between users
  }

  // Summary
  log('=' .repeat(60), 'blue');
  log('\n📊 Summary:\n', 'blue');

  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  log(`✅ Successfully created: ${successful}`, 'green');
  log(`❌ Failed: ${failed}`, failed > 0 ? 'red' : 'green');

  log('\n📝 Test User Credentials:\n', 'cyan');
  log('Role          | Email                        | Password', 'cyan');
  log('-'.repeat(60), 'cyan');
  
  results.forEach(user => {
    const status = user.success ? '✅' : '❌';
    log(`${status} ${user.role.padEnd(12)} | ${user.email.padEnd(28)} | ${user.password}`, 'cyan');
  });

  log('\n💡 Usage:', 'yellow');
  log('   1. Use these credentials to login via API or frontend', 'yellow');
  log('   2. Each role has different permissions', 'yellow');
  log('   3. Admin has access to all features\n', 'yellow');

  log('🔗 Login Example:', 'cyan');
  log(`   POST ${BASE_URL}/api/auth/login`, 'cyan');
  log('   Body: { "email": "farmer@agrichain.com", "password": "Farmer123!" }\n', 'cyan');
}

// Run the script
createAllUsers().catch(error => {
  log(`\n💥 Fatal error: ${error.message}`, 'red');
  process.exit(1);
});
