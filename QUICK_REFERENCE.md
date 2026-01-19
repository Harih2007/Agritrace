# Quick Reference Card

## 🚀 Quick Start Commands

```bash
# Initial Setup
npm run setup                    # Run setup wizard
npm install                      # Install root dependencies
cd backend && npm install        # Install backend dependencies

# Smart Contracts
npm run compile                  # Compile contracts
npm run deploy:fuji             # Deploy to Avalanche Fuji testnet
npm run deploy:mainnet          # Deploy to Avalanche mainnet
npm run post-deploy             # Copy ABIs and show addresses
npm run test:contracts          # Run contract tests

# Backend Server
npm run backend                 # Start backend in dev mode
npm run backend:start           # Start backend in production mode

# Testing
npm run test:api                # Test all API endpoints
```

## 🌐 Network Information

### Avalanche Fuji Testnet
```
Network ID: 43113
RPC: https://api.avax-test.network/ext/bc/C/rpc
Explorer: https://testnet.snowtrace.io/
Faucet: https://faucet.avax.network/
```

### Avalanche Mainnet
```
Network ID: 43114
RPC: https://api.avax.network/ext/bc/C/rpc
Explorer: https://snowtrace.io/
```

## 📡 API Endpoints

### Authentication
```bash
POST /api/auth/signup           # Create account
POST /api/auth/login            # Email/password login
POST /api/auth/wallet           # Wallet authentication
POST /api/auth/logout           # Logout
```

### Products
```bash
POST   /api/products            # Create product
GET    /api/products/:id        # Get product details
PUT    /api/products/:id        # Update product
DELETE /api/products/:id        # Deactivate product
GET    /api/products/user/:id   # List user products
```

### Payments (Escrow)
```bash
POST /api/payments/escrow                    # Create escrow
POST /api/payments/escrow/:id/confirm-delivery  # Confirm delivery
POST /api/payments/escrow/:id/release        # Release funds
POST /api/payments/escrow/:id/dispute        # Raise dispute
GET  /api/payments/escrow/:id                # Get escrow details
```

### QR Codes
```bash
POST /api/qr/generate/:productId  # Generate QR code
GET  /api/qr/verify/:productId    # Verify product
POST /api/qr/scan                 # Scan QR code
```

### IPFS
```bash
POST   /api/ipfs/upload          # Upload file
GET    /api/ipfs/:hash           # Get file info
POST   /api/ipfs/pin             # Pin existing hash
DELETE /api/ipfs/unpin/:hash     # Unpin content
GET    /api/ipfs/user/files      # List user files
```

## 🔑 Environment Variables

### Root .env
```bash
MNEMONIC_KEY=your_12_word_mnemonic
AVALANCHE_RPC=https://api.avax-test.network/ext/bc/C/rpc
```

### Backend .env
```bash
# Server
PORT=3000
NODE_ENV=development

# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_KEY=xxx

# Blockchain
AVALANCHE_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
PRIVATE_KEY=xxx
PRODUCT_REGISTRY_ADDRESS=0x...
ESCROW_CONTRACT_ADDRESS=0x...
SUPPLY_CHAIN_ADDRESS=0x...

# IPFS
PINATA_API_KEY=xxx
PINATA_SECRET_KEY=xxx
PINATA_JWT=xxx

# Security
JWT_SECRET=xxx
CORS_ORIGIN=http://localhost:3000
```

## 📝 Example API Calls

### Create Product
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Organic Wheat",
    "description": "Premium organic wheat",
    "ipfsHash": "QmXxx...",
    "metadata": {"weight": "50kg", "origin": "Farm A"},
    "price": 99.99
  }'
```

### Create Escrow
```bash
curl -X POST http://localhost:3000/api/payments/escrow \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": 1,
    "sellerAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "amount": "0.1"
  }'
```

### Upload to IPFS
```bash
curl -X POST http://localhost:3000/api/ipfs/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": {"data": "test"},
    "name": "Test File",
    "metadata": {"type": "json"}
  }'
```

### Generate QR Code
```bash
curl -X POST http://localhost:3000/api/qr/generate/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🔧 Troubleshooting

### Contract Deployment Failed
```bash
# Check wallet balance
# Verify RPC URL is correct
# Ensure mnemonic/private key is set
# Try increasing gas limit in truffle-config.js
```

### Backend Won't Start
```bash
# Check all environment variables are set
# Verify contract addresses are correct
# Ensure Supabase credentials are valid
# Check if port 3000 is available
```

### Transaction Failed
```bash
# Check wallet has sufficient AVAX
# Verify contract address is correct
# Check network connectivity
# Review transaction on Snowtrace
```

### IPFS Upload Failed
```bash
# Verify Pinata credentials
# Check file size (max 10MB)
# Ensure network connectivity
# Review Pinata dashboard for errors
```

## 📊 Gas Costs (Approximate)

```
Product Registration:  0.01-0.05 AVAX
Product Update:        0.005-0.02 AVAX
Escrow Creation:       0.02-0.1 AVAX
Escrow Release:        0.01-0.05 AVAX
```

## 🔒 Security Checklist

- [ ] Private keys in .env (not in code)
- [ ] .env files in .gitignore
- [ ] Rate limiting enabled
- [ ] CORS configured
- [ ] Input validation on all endpoints
- [ ] Authentication on protected routes
- [ ] HTTPS in production
- [ ] Database RLS policies enabled
- [ ] Smart contracts audited (for mainnet)

## 📚 Documentation Files

```
README.md                        # Project overview
AVALANCHE_DEPLOYMENT_GUIDE.md   # Complete deployment guide
AVALANCHE_INTEGRATION.md        # Avalanche-specific details
REQUIREMENTS_CHECKLIST.md       # Implementation status
QUICK_REFERENCE.md              # This file
ARCHITECTURE.md                 # System architecture
QUICKSTART.md                   # Quick start guide
backend/API_REFERENCE.md        # API documentation
```

## 🛠️ Useful Scripts

```bash
# Check network status
node -e "const {ethers} = require('ethers'); \
  const p = new ethers.JsonRpcProvider('https://api.avax-test.network/ext/bc/C/rpc'); \
  p.getBlockNumber().then(console.log)"

# Check wallet balance
node -e "const {ethers} = require('ethers'); \
  const p = new ethers.JsonRpcProvider('https://api.avax-test.network/ext/bc/C/rpc'); \
  p.getBalance('YOUR_ADDRESS').then(b => console.log(ethers.formatEther(b)))"

# Estimate gas
node -e "const {ethers} = require('ethers'); \
  const p = new ethers.JsonRpcProvider('https://api.avax-test.network/ext/bc/C/rpc'); \
  p.getFeeData().then(f => console.log(ethers.formatUnits(f.gasPrice, 'gwei')))"
```

## 🎯 Development Workflow

1. **Setup**: Run `npm run setup`
2. **Configure**: Edit .env files
3. **Compile**: Run `npm run compile`
4. **Deploy**: Run `npm run deploy:fuji`
5. **Setup Backend**: Run `npm run post-deploy`
6. **Update Config**: Add contract addresses to backend/.env
7. **Start Server**: Run `npm run backend`
8. **Test**: Run `npm run test:api`

## 🚨 Emergency Procedures

### Contract Pause (if implemented)
```javascript
await contract.pause();
```

### Withdraw Funds (owner only)
```javascript
await contract.withdraw();
```

### Update Contract Address
1. Deploy new contract
2. Update backend/.env
3. Restart backend server
4. Update frontend config

## 📞 Support Resources

- Avalanche Discord: https://chat.avax.network/
- Avalanche Docs: https://docs.avax.network/
- Supabase Docs: https://supabase.com/docs
- Pinata Docs: https://docs.pinata.cloud/
- Truffle Docs: https://trufflesuite.com/docs/

## 💡 Tips

- Always test on Fuji before mainnet
- Monitor gas prices before transactions
- Keep private keys secure
- Regular database backups
- Monitor contract events
- Set up error alerting
- Document all changes
- Use version control

## ✅ Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Environment configured
- [ ] Contracts compiled
- [ ] Wallet funded
- [ ] Database schema deployed
- [ ] IPFS configured
- [ ] API tested
- [ ] Documentation updated
- [ ] Security reviewed
- [ ] Monitoring setup

---

**Last Updated**: 2025-10-09
**Version**: 1.0.0
