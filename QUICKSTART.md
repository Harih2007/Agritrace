# Quick Start Guide

Get the backend running in 10 minutes.

## Prerequisites

- Node.js v16+ installed
- Git installed
- Text editor

## Step 1: Clone & Install (2 min)

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

## Step 2: Get Free Services (5 min)

### A. Supabase (Database & Auth)
1. Go to https://supabase.com
2. Sign up (free)
3. Create new project
4. Wait for database to initialize (~2 min)
5. Go to Settings → API
6. Copy:
   - Project URL
   - `anon` public key
   - `service_role` secret key
7. Go to SQL Editor
8. Paste contents of `backend/database/schema.sql`
9. Click "Run"

### B. Pinata (IPFS Storage)
1. Go to https://pinata.cloud
2. Sign up (free - 1GB)
3. Go to API Keys
4. Create new key (all permissions)
5. Copy:
   - API Key
   - API Secret
   - JWT Token

### C. Avalanche Testnet (Blockchain)
1. Install MetaMask browser extension
2. Add Avalanche Fuji Testnet:
   - Network Name: Avalanche Fuji
   - RPC URL: https://api.avax-test.network/ext/bc/C/rpc
   - Chain ID: 43113
   - Symbol: AVAX
3. Copy your wallet address
4. Go to https://faucet.avax.network/
5. Request testnet AVAX (free)
6. Export private key from MetaMask:
   - Click account → Account details → Export Private Key
   - **NEVER share this or commit to git!**

## Step 3: Configure Environment (1 min)

### Root .env
```bash
cp .env.example .env
```

Edit `.env`:
```bash
MNEMONIC_KEY=your twelve word mnemonic from metamask
AVALANCHE_RPC=https://api.avax-test.network/ext/bc/C/rpc
```

### Backend .env
```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:
```bash
PORT=3000
NODE_ENV=development

# From Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_KEY=eyJhbGc...

# From MetaMask (without 0x prefix)
AVALANCHE_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
PRIVATE_KEY=your_private_key_without_0x

# From Pinata
PINATA_JWT=eyJhbGc...
PINATA_API_KEY=your_api_key
PINATA_SECRET_KEY=your_secret_key

# Generate random string
JWT_SECRET=your_random_secret_here

CORS_ORIGIN=http://localhost:3000

# Leave these empty for now
PRODUCT_REGISTRY_ADDRESS=
ESCROW_CONTRACT_ADDRESS=
SUPPLY_CHAIN_ADDRESS=
```

## Step 4: Deploy Contracts (1 min)

```bash
# Compile contracts
truffle compile

# Deploy to Avalanche Fuji testnet
truffle migrate --network avalanche_fuji
```

**Copy the deployed addresses!** You'll see output like:
```
ProductRegistry: 0x1234...
Escrow: 0x5678...
SupplyChain: 0x9abc...
```

Update `backend/.env` with these addresses:
```bash
PRODUCT_REGISTRY_ADDRESS=0x1234...
ESCROW_CONTRACT_ADDRESS=0x5678...
SUPPLY_CHAIN_ADDRESS=0x9abc...
```

## Step 5: Copy Contract ABIs (30 sec)

```bash
# Copy ABIs to backend
cp build/contracts/ProductRegistry.json backend/abis/
cp build/contracts/Escrow.json backend/abis/
cp build/contracts/SupplyChain.json backend/abis/
```

## Step 6: Start Backend (10 sec)

```bash
cd backend
npm run dev
```

You should see:
```
Server running on port 3000
Environment: development
```

## Step 7: Test It! (30 sec)

Open a new terminal:

```bash
# Health check
curl http://localhost:3000/health

# Create account
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

If you see JSON responses, **you're done!** 🎉

## What's Next?

### Test the API
Use the token from login to test other endpoints:

```bash
# Save your token
TOKEN="your_token_from_login_response"

# Create a product
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Test Product",
    "description": "My first product",
    "ipfsHash": "QmTest123",
    "price": 100
  }'
```

### Build Frontend
Now you can build a frontend that calls these APIs!

### Read Documentation
- `backend/API_REFERENCE.md` - All API endpoints
- `BACKEND_SETUP.md` - Detailed setup
- `IMPLEMENTATION_SUMMARY.md` - What was built

## Troubleshooting

### "Cannot find module"
```bash
cd backend
npm install
```

### "Insufficient funds"
Get more testnet AVAX: https://faucet.avax.network/

### "Invalid token"
Make sure you're using the token from the login response

### "Contract not deployed"
Run `truffle migrate --network avalanche_fuji` again

### "Database error"
Check that you ran the schema.sql in Supabase

### Still stuck?
1. Check `backend/logs/error.log`
2. Verify all environment variables
3. Make sure services are running
4. Review `BACKEND_SETUP.md`

## Common Commands

```bash
# Start backend (development)
cd backend && npm run dev

# Start backend (production)
cd backend && npm start

# Compile contracts
truffle compile

# Deploy contracts
truffle migrate --network avalanche_fuji

# Run tests (if you add them)
truffle test

# Check logs
tail -f backend/logs/combined.log
```

## Security Reminders

⚠️ **NEVER commit these files:**
- `.env`
- `backend/.env`
- Private keys
- Mnemonic phrases

✅ **Always use:**
- `.env.example` for templates
- Environment variables
- `.gitignore`

## Production Deployment

When ready for production:

1. Change `NODE_ENV=production`
2. Use Avalanche mainnet
3. Get real AVAX for gas
4. Use strong JWT_SECRET
5. Configure CORS properly
6. Set up monitoring
7. Enable HTTPS
8. Use environment secrets (not .env files)

## Resources

- Avalanche Docs: https://docs.avax.network/
- Supabase Docs: https://supabase.com/docs
- Pinata Docs: https://docs.pinata.cloud/
- Truffle Docs: https://trufflesuite.com/docs/

## Support

Need help? Check:
- `backend/logs/` for errors
- `BACKEND_SETUP.md` for details
- `API_REFERENCE.md` for endpoints
- GitHub issues (if applicable)

---

**Congratulations!** You now have a fully functional blockchain-based supply chain backend! 🚀
