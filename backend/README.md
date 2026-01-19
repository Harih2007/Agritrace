# Supply Chain Backend API

Blockchain-based product management system with Avalanche integration, Supabase authentication, IPFS storage, and escrow payments.

## Features

- **Dual Authentication**: Traditional email/password and wallet signature authentication
- **Product Registry**: Register and manage products on Avalanche blockchain
- **Escrow Payments**: Secure payment processing with dispute resolution
- **QR Code Generation**: Generate and verify product QR codes
- **IPFS Storage**: Decentralized file storage via Pinata
- **Comprehensive Error Handling**: Structured error responses and logging

## Tech Stack

- **Backend**: Node.js, Express
- **Blockchain**: Avalanche (Fuji Testnet/Mainnet), Ethers.js
- **Database**: Supabase (PostgreSQL)
- **Storage**: IPFS via Pinata
- **Authentication**: Supabase Auth + Wallet Signatures

## Prerequisites

- Node.js v16+
- Supabase account and project
- Pinata account for IPFS
- Avalanche wallet with AVAX for gas fees
- Deployed smart contracts (ProductRegistry, Escrow, SupplyChain)

## Installation

1. Install dependencies:
```bash
cd backend
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Set up Supabase database:
```bash
# Run the schema.sql in your Supabase SQL editor
```

4. Deploy smart contracts:
```bash
cd ..
truffle migrate --network avalanche_fuji
# Copy contract addresses to .env
```

5. Start the server:
```bash
npm run dev  # Development
npm start    # Production
```

## Environment Variables

See `.env.example` for all required variables:

- **SUPABASE_URL**: Your Supabase project URL
- **SUPABASE_ANON_KEY**: Supabase anonymous key
- **SUPABASE_SERVICE_KEY**: Supabase service role key
- **AVALANCHE_RPC_URL**: Avalanche RPC endpoint
- **PRIVATE_KEY**: Wallet private key for blockchain transactions
- **PINATA_JWT**: Pinata JWT token for IPFS uploads
- **CONTRACT_ADDRESSES**: Deployed contract addresses

## API Endpoints

### Authentication

#### POST /api/auth/login
Login with email/password
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### POST /api/auth/signup
Create new account
```json
{
  "email": "user@example.com",
  "password": "password123",
  "walletAddress": "0x..." // optional
}
```

#### POST /api/auth/wallet
Authenticate with wallet signature
```json
{
  "signature": "0x...",
  "message": "Sign this message to authenticate",
  "address": "0x..."
}
```

### Products

#### POST /api/products
Create new product (requires authentication)
```json
{
  "name": "Product Name",
  "description": "Product description",
  "ipfsHash": "Qm...",
  "metadata": {},
  "price": 100
}
```

#### GET /api/products/:id
Get product details

#### PUT /api/products/:id
Update product (requires authentication)

#### DELETE /api/products/:id
Deactivate product (requires authentication)

#### GET /api/products/user/:userId
List user's products

### Payments (Escrow)

#### POST /api/payments/escrow
Create escrow payment (requires authentication)
```json
{
  "productId": 1,
  "sellerAddress": "0x...",
  "amount": "1.5"
}
```

#### POST /api/payments/escrow/:id/confirm-delivery
Confirm delivery (buyer only)

#### POST /api/payments/escrow/:id/release
Release funds to seller (buyer only)

#### POST /api/payments/escrow/:id/dispute
Raise dispute

#### GET /api/payments/escrow/:id
Get escrow details

### QR Codes

#### POST /api/qr/generate/:productId
Generate QR code for product (requires authentication)

#### GET /api/qr/verify/:productId
Verify product via QR code

#### POST /api/qr/scan
Scan and decode QR code
```json
{
  "qrData": "{...}"
}
```

### IPFS

#### POST /api/ipfs/upload
Upload file to IPFS (requires authentication)
```json
{
  "file": "base64_encoded_file",
  "filename": "file.jpg",
  "contentType": "image/jpeg",
  "metadata": {}
}
```

#### GET /api/ipfs/:hash
Get IPFS file info

#### POST /api/ipfs/pin
Pin existing IPFS hash

#### DELETE /api/ipfs/unpin/:hash
Unpin content

#### GET /api/ipfs/user/files
List user's IPFS files

## Smart Contracts

### ProductRegistry
Manages product registration on blockchain
- `registerProduct(name, ipfsHash, metadata)`: Register new product
- `updateProduct(productId, ipfsHash, metadata)`: Update product
- `deactivateProduct(productId)`: Deactivate product
- `getProduct(productId)`: Get product details

### Escrow
Handles secure payments with escrow
- `createEscrow(seller, productId)`: Create escrow with payment
- `confirmDelivery(escrowId)`: Buyer confirms delivery
- `releaseFunds(escrowId)`: Release funds to seller
- `raiseDispute(escrowId)`: Raise dispute
- `resolveDispute(escrowId, releaseToBuyer)`: Arbiter resolves dispute

## Error Handling

All errors follow a consistent format:
```json
{
  "error": "Error message",
  "details": "Additional details"
}
```

HTTP Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 429: Too Many Requests
- 500: Internal Server Error

## Security

- Helmet.js for security headers
- CORS configuration
- Rate limiting
- Input validation with Joi
- Row Level Security (RLS) in Supabase
- JWT token authentication
- Wallet signature verification

## Logging

Winston logger with multiple transports:
- Console (development)
- File: `logs/error.log` (errors only)
- File: `logs/combined.log` (all logs)

## Development

```bash
npm run dev  # Start with nodemon
```

## Production

```bash
npm start
```

## Testing

Deploy to Avalanche Fuji testnet for testing:
```bash
truffle migrate --network avalanche_fuji
```

Get testnet AVAX from: https://faucet.avax.network/

## License

MIT
