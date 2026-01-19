# Avalanche Chain Deployment Guide

This guide covers the complete deployment of the supply chain system on Avalanche network (Fuji testnet and mainnet).

## Prerequisites

1. Node.js v16+ and npm/yarn
2. Truffle Suite installed globally: `npm install -g truffle`
3. Avalanche wallet with AVAX tokens
   - Fuji testnet: Get free AVAX from [Avalanche Faucet](https://faucet.avax.network/)
   - Mainnet: Purchase AVAX from exchanges
4. Supabase account and project
5. Pinata account for IPFS

## Step 1: Environment Setup

### Root Directory (.env)
```bash
# Blockchain Configuration
MNEMONIC_KEY=your_12_word_mnemonic_phrase
AVALANCHE_RPC=https://api.avax-test.network/ext/bc/C/rpc
```

### Backend Directory (backend/.env)
```bash
# Server Configuration
PORT=3000
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key

# Avalanche Blockchain Configuration
AVALANCHE_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
PRIVATE_KEY=your_private_key_without_0x_prefix
PRODUCT_REGISTRY_ADDRESS=will_be_set_after_deployment
ESCROW_CONTRACT_ADDRESS=will_be_set_after_deployment
SUPPLY_CHAIN_ADDRESS=will_be_set_after_deployment

# IPFS/Pinata Configuration
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret_key
PINATA_JWT=your_pinata_jwt

# Security
JWT_SECRET=generate_random_secret_here
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Application URL
APP_URL=http://localhost:3000
```

## Step 2: Install Dependencies

```bash
# Root directory
npm install

# Backend directory
cd backend
npm install
```

## Step 3: Compile Smart Contracts

```bash
# From root directory
truffle compile
```

This will generate ABI files in `build/contracts/` directory.

## Step 4: Deploy to Avalanche Fuji Testnet

```bash
# Deploy contracts
truffle migrate --network avalanche_fuji

# Save the deployed contract addresses
```

After deployment, you'll see output like:
```
ProductRegistry: 0x1234...
Escrow: 0x5678...
SupplyChain: 0x9abc...
```

## Step 5: Copy ABIs to Backend

```bash
# Create backend/abis directory if it doesn't exist
mkdir -p backend/abis

# Copy ABI files
cp build/contracts/ProductRegistry.json backend/abis/
cp build/contracts/Escrow.json backend/abis/
cp build/contracts/SupplyChain.json backend/abis/
```

## Step 6: Update Backend Environment

Update `backend/.env` with deployed contract addresses:
```bash
PRODUCT_REGISTRY_ADDRESS=0x1234...
ESCROW_CONTRACT_ADDRESS=0x5678...
SUPPLY_CHAIN_ADDRESS=0x9abc...
```

## Step 7: Setup Supabase Database

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the schema from `backend/database/schema.sql`
4. Verify all tables are created

## Step 8: Start Backend Server

```bash
cd backend
npm run dev
```

The server should start on http://localhost:3000

## Step 9: Test API Endpoints

### Health Check
```bash
curl http://localhost:3000/health
```

### Create User
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## Avalanche Network Details

### Fuji Testnet (Development)
- Network ID: 43113
- RPC URL: https://api.avax-test.network/ext/bc/C/rpc
- Explorer: https://testnet.snowtrace.io/
- Faucet: https://faucet.avax.network/

### Mainnet (Production)
- Network ID: 43114
- RPC URL: https://api.avax.network/ext/bc/C/rpc
- Explorer: https://snowtrace.io/

## Deploy to Mainnet

When ready for production:

1. Update `.env`:
```bash
AVALANCHE_RPC=https://api.avax.network/ext/bc/C/rpc
```

2. Deploy:
```bash
truffle migrate --network avalanche_mainnet
```

3. Update backend `.env` with mainnet contract addresses

## Troubleshooting

### Gas Estimation Failed
- Ensure wallet has sufficient AVAX
- Check RPC URL is correct
- Verify network is not congested

### Contract Deployment Timeout
- Increase `timeoutBlocks` in truffle-config.js
- Check network status at https://status.avax.network/

### Backend Connection Issues
- Verify contract addresses are correct
- Check private key format (no 0x prefix)
- Ensure RPC URL is accessible

## Security Best Practices

1. Never commit `.env` files
2. Use hardware wallet for mainnet deployments
3. Audit smart contracts before mainnet deployment
4. Implement multi-sig for contract ownership
5. Monitor contract events and transactions
6. Set up alerts for unusual activity

## Monitoring and Maintenance

1. Monitor contract events using Snowtrace
2. Set up logging and alerting for backend
3. Regular database backups
4. Monitor IPFS pinning status
5. Track gas usage and optimize

## Cost Estimation

### Fuji Testnet
- Free AVAX from faucet
- No real costs

### Mainnet
- Contract deployment: ~0.5-1 AVAX
- Product registration: ~0.01-0.05 AVAX per transaction
- Escrow operations: ~0.02-0.1 AVAX per transaction

## Support and Resources

- Avalanche Docs: https://docs.avax.network/
- Truffle Docs: https://trufflesuite.com/docs/
- Supabase Docs: https://supabase.com/docs
- IPFS/Pinata Docs: https://docs.pinata.cloud/
