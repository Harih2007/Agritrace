<!-- PROJECT LOGO -->

<br />
<div align="center">
  <a href="#">
    <img src="https://github.com/ac12644/Supply-Chain/blob/main/images/AgriChainLogo.png" alt="Logo" width="145" height="55">
  </a>
  
  <h3 align="center">AgriChain - Blockchain Supply Chain on Avalanche</h3>

  <p align="center">
    A complete blockchain-based supply chain management system with product registry, escrow payments, QR verification, and IPFS storage - deployed on Avalanche C-Chain.
  </p>

  <p align="center">
    <a href="https://betterprogramming.pub/supply-chain-smart-contract-design-e0ae5071bcbe">📖 Original Article</a> •
    <a href="AVALANCHE_DEPLOYMENT_GUIDE.md">🚀 Deployment Guide</a> •
    <a href="DOCUMENTATION_INDEX.md">📚 Documentation</a> •
    <a href="backend/API_REFERENCE.md">📡 API Reference</a>
  </p>

  <p align="center">
    <strong>✅ Status: COMPLETE & DEPLOYMENT READY</strong>
  </p>
</div>

---

## 🎉 Project Status

**Implementation**: ✅ **COMPLETE** (8/8 Requirements Met)  
**Blockchain**: ✅ Avalanche C-Chain (Fuji Testnet + Mainnet)  
**Backend API**: ✅ 25+ Endpoints Ready  
**Documentation**: ✅ 13 Comprehensive Guides  
**Testing**: ✅ Automated Test Suite  
**Deployment**: ✅ Fully Automated  

### Quick Links
- 📋 [Project Summary](PROJECT_SUMMARY.md) - Complete overview
- 🚀 [Deployment Guide](AVALANCHE_DEPLOYMENT_GUIDE.md) - Deploy in 25 minutes
- ⚡ [Quick Reference](QUICK_REFERENCE.md) - Commands & API
- 📊 [Requirements Checklist](REQUIREMENTS_CHECKLIST.md) - Implementation status
- 🔄 [Workflow Guide](WORKFLOW_GUIDE.md) - System workflows
- 📚 [Documentation Index](DOCUMENTATION_INDEX.md) - All documentation

---

## About The Project

The agricultural industry is a major contributor to the global economy, with over $6 trillion in revenue every year. This industry provides the world with essential commodities such as rice, corn, wheat and livestock. However, despite its vital role in providing essential products around the globe, agricultural supply chains face many common challenges across geographies and commodities.

Blockchain technology creates a single source of truth. This is important for supply chains that involve multiple participants in a network who don't necessarily trust each other.

This project provides a **complete, production-ready** blockchain supply chain solution deployed on **Avalanche C-Chain**, featuring:

- ✅ **Smart Contracts** - Product registry, escrow payments, supply chain tracking
- ✅ **Backend API** - 25+ RESTful endpoints with authentication
- ✅ **Database** - PostgreSQL with Row Level Security
- ✅ **IPFS Storage** - Decentralized file storage via Pinata
- ✅ **QR Codes** - Product verification and tracking
- ✅ **Security** - JWT auth, wallet signatures, rate limiting
- ✅ **Documentation** - 13 comprehensive guides

![Flow diagram](/images/flow.png)

## 🚀 What's New - Avalanche Integration

This implementation extends the original supply chain concept with:

### Blockchain Features
- **Avalanche C-Chain** integration (Fuji testnet + mainnet)
- **Sub-second finality** for fast transactions
- **Low gas costs** (~0.01-0.1 AVAX per transaction)
- **Smart contract events** for real-time tracking
- **Transaction retry logic** with exponential backoff

### Backend Features
- **Dual Authentication** - Email/password + wallet signatures
- **Product Management** - Full CRUD with blockchain sync
- **Escrow Payments** - Secure AVAX payments with dispute resolution
- **QR Code System** - Generate and verify product authenticity
- **IPFS Integration** - Decentralized storage for product assets
- **Comprehensive API** - RESTful endpoints with validation

### Developer Features
- **Automated Deployment** - One-command setup and deployment
- **Testing Suite** - Automated API and contract testing
- **Error Handling** - Comprehensive logging and retry logic
- **Documentation** - Step-by-step guides for everything

### ⚙️Functions:

1. Farmer creates a product and lists it to be purchased by Distributor
2. Farmer ships the product
3. Distributor receives the product, process it, package it and put it on sale
4. Retailer buys the product from Distributor
5. Distributor ships the product to Retailer
6. Retailer receives the product and put it on sale
7. Consumer purchase the product

## 🛠️ Technology Stack

### Blockchain
- **Avalanche C-Chain** (Fuji testnet + mainnet)
- **Solidity** ^0.8.0
- **Truffle Suite** v5.11.0
- **ethers.js** v6.6.0

### Backend
- **Node.js** v16+
- **Express.js** v4.18
- **Supabase** (PostgreSQL)
- **Winston** (logging)
- **Joi** (validation)

### Storage & Services
- **IPFS** via Pinata
- **QR Code** generation
- **JWT** authentication

## 🚀 Quick Start (25 Minutes)

### Prerequisites
- Node.js v16 or higher
- npm or yarn
- Avalanche wallet with testnet AVAX ([Get from faucet](https://faucet.avax.network/))
- Supabase account
- Pinata account

### Step 1: Setup (5 minutes)
```bash
# Clone the repository
git clone <repository-url>
cd agrichain-avalanche

# Run automated setup
npm run setup
```

### Step 2: Configure (10 minutes)
```bash
# Edit root .env
MNEMONIC_KEY=your_12_word_mnemonic
AVALANCHE_RPC=https://api.avax-test.network/ext/bc/C/rpc

# Edit backend/.env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key
AVALANCHE_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
PRIVATE_KEY=your_private_key
PINATA_JWT=your_pinata_jwt
JWT_SECRET=your_jwt_secret
```

### Step 3: Deploy Contracts (5 minutes)
```bash
# Compile smart contracts
npm run compile

# Deploy to Avalanche Fuji testnet
npm run deploy:fuji

# Copy ABIs and configure backend
npm run post-deploy
```

### Step 4: Setup Database (2 minutes)
1. Go to your Supabase project
2. Run the SQL from `backend/database/schema.sql`
3. Verify tables are created

### Step 5: Start Backend (1 minute)
```bash
# Start the backend server
npm run backend
```

### Step 6: Test (2 minutes)
```bash
# Run API tests
npm run test:api
```

**🎉 Done! Your system is now running on Avalanche Fuji testnet!**

## 📚 Documentation

### Essential Guides
- **[AVALANCHE_DEPLOYMENT_GUIDE.md](AVALANCHE_DEPLOYMENT_GUIDE.md)** - Complete deployment instructions
- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Quick commands and API reference
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Project overview and status
- **[REQUIREMENTS_CHECKLIST.md](REQUIREMENTS_CHECKLIST.md)** - Implementation tracking

### Technical Documentation
- **[AVALANCHE_INTEGRATION.md](AVALANCHE_INTEGRATION.md)** - Avalanche-specific details
- **[WORKFLOW_GUIDE.md](WORKFLOW_GUIDE.md)** - System workflows and architecture
- **[backend/API_REFERENCE.md](backend/API_REFERENCE.md)** - Complete API documentation
- **[test/README.md](test/README.md)** - Testing guide

### All Documentation
See **[DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)** for complete documentation index

## 📡 API Endpoints

### Authentication
```bash
POST /api/auth/signup          # Create account
POST /api/auth/login           # Email/password login
POST /api/auth/wallet          # Wallet authentication
POST /api/auth/logout          # Logout
```

### Products
```bash
POST   /api/products           # Create product
GET    /api/products/:id       # Get product
PUT    /api/products/:id       # Update product
DELETE /api/products/:id       # Deactivate product
GET    /api/products/user/:id  # List user products
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
POST   /api/ipfs/upload       # Upload file
GET    /api/ipfs/:hash        # Get file info
POST   /api/ipfs/pin          # Pin existing hash
DELETE /api/ipfs/unpin/:hash  # Unpin content
```

See **[backend/API_REFERENCE.md](backend/API_REFERENCE.md)** for complete API documentation.

## 🔧 Available Scripts

```bash
# Setup and Installation
npm run setup              # Run setup wizard
npm install               # Install dependencies

# Smart Contracts
npm run compile           # Compile contracts
npm run deploy:fuji       # Deploy to Fuji testnet
npm run deploy:mainnet    # Deploy to mainnet
npm run post-deploy       # Copy ABIs and configure
npm run test:contracts    # Run contract tests

# Backend
npm run backend           # Start backend (dev mode)
npm run backend:start     # Start backend (production)

# Testing
npm run test:api          # Test all API endpoints
```

## 🏗️ Project Structure

```
agrichain-avalanche/
├── contracts/              # Smart contracts
│   ├── ProductRegistry.sol
│   ├── Escrow.sol
│   └── supplyChain/
├── backend/               # Backend API
│   ├── src/
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Auth, validation
│   │   ├── config/       # Configuration
│   │   └── utils/        # Utilities
│   ├── database/         # SQL schema
│   └── abis/            # Contract ABIs
├── scripts/              # Automation scripts
├── test/                 # Tests
├── migrations/           # Truffle migrations
└── docs/                # Documentation
```

1. Clone the repo
   ```sh
   git clone https://github.com/ac12644/Supply-Chain.git
   ```
2. Install packages
   ```sh
   yarn
   ```
3. start truffle development nework
   ```sh
   truffle develop
   ```
4. test smart contracts
   ```sh
    $truffle(develop)> test
   ```
5. to deploy run
   ```sh
    $truffle(develop)> deploy
   ```

### Specification

### Modifiers

1. Checking ownership and values paid

```solidity
// Define a modifer that checks to see if msg.sender == owner of the contract
modifier onlyOwner() {
  require(msg.sender == owner);
  _;
}

// Define a modifer that verifies the Caller
modifier verifyCaller (address _address) {
  require(msg.sender == _address);
  _;
}

// Define a modifier that checks if the paid amount is sufficient to cover the price
modifier paidEnough(uint _price) {
  require(msg.value >= _price);
  _;
}

// Define a modifier that checks the price and refunds the remaining balance
modifier checkValue(uint _productCode, address payable addressToFund) { // ADDED address payable
  uint _price = items[_productCode].productPrice;
  uint  amountToReturn = msg.value - _price;
  addressToFund.transfer(amountToReturn);
  _;
}
```

2. Check the item has passed the previous step of the supplychain.

```solidity
// itemState : 0
modifier producedByFarmer(uint _productCode) {
  require(items[_productCode].itemState == State.ProduceByFarmer);
  _;
}
// State : 1
modifier forSaleByFarmer(uint _productCode) {
  require(items[_productCode].itemState == State.ForSaleByFarmer);
  _;
}
// State : 2
modifier purchasedByDistributor(uint _productCode) {
  require(items[_productCode].itemState == State.PurchasedByDistributor);
  _;
}
// State : 3
modifier shippedByFarmer(uint _productCode) {
  require(items[_productCode].itemState == State.ShippedByFarmer);
  _;
}
// State : 4
modifier receivedByDistributor(uint _productCode) {
  require(items[_productCode].itemState == State.ReceivedByDistributor);
  _;
}
// State : 5
modifier processByDistributor(uint _productCode) {
  require(items[_productCode].itemState == State.ProcessedByDistributor);
  _;
}
// State : 6
modifier packagedByDistributor(uint _productCode) {
  require(items[_productCode].itemState == State.PackageByDistributor);
  _;
}
// State : 7
modifier forSaleByDistributor(uint _productCode) {
  require(items[_productCode].itemState == State.ForSaleByDistributor);
  _;
}

// State : 8
modifier shippedByDistributor(uint _productCode) {
  require(items[_productCode].itemState == State.ShippedByDistributor);
  _;
}
// State : 9
modifier purchasedByRetailer(uint _productCode) {
  require(items[_productCode].itemState == State.PurchasedByRetailer);
  _;
}
// State : 10
modifier receivedByRetailer(uint _productCode) {
  require(items[_productCode].itemState == State.ReceivedByRetailer);
  _;
}
// State : 11
modifier forSaleByRetailer(uint _productCode) {
  require(items[_productCode].itemState == State.ForSaleByRetailer);
  _;
}
// State : 12
modifier purchasedByConsumer(uint _productCode) {
  require(items[_productCode].itemState == State.PurchasedByConsumer);
  _;
}
```

3. Role based modifiers inherited from other contracts.

_Note: Used to implement Access Control_

```solidity
// FarmerRole.sol
modifier onlyFarmer() {
  require(isFarmer(msg.sender));
  _;
}
// DistributorRole.sol
modifier onlyDistributor() {
  require(isDistributor(msg.sender));
  _;
}
// RetailerRole.sol
modifier onlyRetailer() {
   require(isRetailer(msg.sender));
  _;
}
// ConsumerRole.sol
modifier onlyConsumer() {
  require(isConsumer(msg.sender));
  _;
}

```

### Events

Each supplychain function emits its own event.

```solidity
event ProduceByFarmer(uint productCode);         //1
event ForSaleByFarmer(uint productCode);         //2
event PurchasedByDistributor(uint productCode);  //3
event ShippedByFarmer(uint productCode);         //4
event ReceivedByDistributor(uint productCode);   //5
event ProcessedByDistributor(uint productCode);  //6
event PackagedByDistributor(uint productCode);   //7
event ForSaleByDistributor(uint productCode);    //8
event PurchasedByRetailer(uint productCode);     //9
event ShippedByDistributor(uint productCode);    //10
event ReceivedByRetailer(uint productCode);      //11
event ForSaleByRetailer(uint productCode);       //12
event PurchasedByConsumer(uint productCode);     //13
```
