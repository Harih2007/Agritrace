# 🎯 Smart Contract Demo Guide

## How to Demonstrate Your Working Smart Contracts

This guide shows you how to prove to others that your Avalanche smart contracts are live and working.

---

## 🔗 Quick Links to Live Contracts

### Deployed Contracts on Avalanche Fuji Testnet

| Contract | Address | Live Explorer Link |
|----------|---------|-------------------|
| **ProductRegistry** | `0x8bb1D4dE341096dBAd6384d965256d94dA4D8590` | [View Contract →](https://testnet.snowtrace.io/address/0x8bb1D4dE341096dBAd6384d965256d94dA4D8590) |
| **SupplyChain** | `0x9B59524C1660e70411159Af4C3D24fDfCc0CA684` | [View Contract →](https://testnet.snowtrace.io/address/0x9B59524C1660e70411159Af4C3D24fDfCc0CA684) |
| **Escrow** | `0xEC7C5FBe04d9abD1993CB32225c98DE0a8683066` | [View Contract →](https://testnet.snowtrace.io/address/0xEC7C5FBe04d9abD1993CB32225c98DE0a8683066) |

### Sample Transaction
- **Transaction Hash**: `0x3f90e3a1a861d657e0e2a881111cf16225b2573b08991b81c2899bcfa45a1304`
- **View on Explorer**: [Click Here](https://testnet.snowtrace.io/tx/0x3f90e3a1a861d657e0e2a881111cf16225b2573b08991b81c2899bcfa45a1304)

---

## 📱 Live Demo Steps

### Step 1: Show the Deployed Contracts

1. **Open SnowTrace Explorer**
   - Go to: https://testnet.snowtrace.io/
   - Search for contract address: `0x8bb1D4dE341096dBAd6384d965256d94dA4D8590`

2. **What to Show:**
   - ✅ Contract is verified and deployed
   - ✅ Shows deployment date and block number
   - ✅ Contract code is visible (if verified)
   - ✅ Transaction history shows activity

### Step 2: Demonstrate the Frontend Integration

1. **Start Your Application**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

2. **Navigate to Farmer Dashboard**
   - Go to: http://localhost:3001/farmer
   - Show the product list

3. **Click "View On-chain" Button**
   - Click on any product's "View On-chain" button
   - Browser opens SnowTrace with the transaction
   - **This proves the frontend is connected to real blockchain data!**

### Step 3: Show QR Code with Blockchain Link

1. **Generate QR Code**
   - Click "Generate QR" on any product
   - QR code appears in modal

2. **Scan with Phone**
   - Use phone camera to scan QR code
   - Phone opens blockchain explorer
   - **This proves QR codes link to real blockchain transactions!**

3. **Download QR Code**
   - Click "Download QR" button
   - Open downloaded image
   - Scan it again to verify it works

### Step 4: Show the Scan Page

1. **Navigate to Scan Page**
   - Go to: http://localhost:3001/scan

2. **Start Camera**
   - Click "Start Camera to Scan"
   - Camera activates (shows live feed)
   - **This proves the scanning functionality works!**

3. **Search for Product**
   - Enter: `AGT-001`
   - Click Search
   - Product details appear with blockchain verification

---

## 🎥 Video Demo Script

### 30-Second Quick Demo

```
1. "Here's our supply chain app running on Avalanche blockchain"
2. [Show farmer dashboard] "These are real products"
3. [Click View On-chain] "Each product has a blockchain transaction"
4. [Browser opens SnowTrace] "Here's the proof on Avalanche testnet"
5. [Show contract address] "Our smart contract is live and verified"
6. [Generate QR] "Consumers can scan this to verify authenticity"
7. [Scan QR with phone] "It opens the blockchain record instantly"
```

### 2-Minute Full Demo

```
1. Introduction (15s)
   - "I built a blockchain-based supply chain tracking system"
   - "It's deployed on Avalanche Fuji testnet"

2. Show Contracts (30s)
   - Open SnowTrace
   - Show deployed contract addresses
   - Show transaction history
   - "These are real smart contracts, not mock data"

3. Frontend Demo (45s)
   - Show farmer dashboard
   - Click "View On-chain" button
   - Browser opens blockchain explorer
   - "Every product is registered on-chain"
   - Generate and scan QR code
   - "QR codes link directly to blockchain records"

4. Technical Details (30s)
   - Show contract addresses
   - Explain the architecture
   - "Products are stored on IPFS, tracked on Avalanche"
   - "Fully decentralized and transparent"
```

---

## 📊 Proof Points to Highlight

### 1. Contract Deployment Proof
- ✅ Contracts deployed on public testnet
- ✅ Verifiable on SnowTrace explorer
- ✅ Transaction history is public
- ✅ Anyone can verify the contracts

### 2. Frontend Integration Proof
- ✅ "View On-chain" button works
- ✅ Opens real blockchain explorer
- ✅ Shows actual transaction data
- ✅ QR codes contain blockchain links

### 3. Real-Time Verification
- ✅ Scan QR code with any phone
- ✅ Opens blockchain explorer
- ✅ No app installation needed
- ✅ Works on any device

---

## 🖼️ Screenshots to Take

### For Presentations/Portfolio

1. **Contract on SnowTrace**
   - Screenshot of contract page
   - Shows: Address, balance, transactions
   - URL visible in browser

2. **Farmer Dashboard**
   - Screenshot showing products
   - "View On-chain" buttons visible
   - Professional UI

3. **QR Code Modal**
   - Screenshot of generated QR code
   - Shows product details
   - Blockchain link visible

4. **Blockchain Explorer**
   - Screenshot of transaction details
   - Shows: Block number, timestamp, gas used
   - Proves transaction is real

5. **Scan Page with Camera**
   - Screenshot of camera active
   - Shows live video feed
   - Demonstrates scanning capability

---

## 🎤 Talking Points

### "Is this real or just mock data?"

**Answer:**
> "It's 100% real. Let me show you. [Click View On-chain] See? This opens SnowTrace, which is Avalanche's blockchain explorer. This transaction hash is stored on the actual Avalanche blockchain. Anyone can verify it. Here's the contract address: 0x8bb1D4dE341096dBAd6384d965256d94dA4D8590. You can search for it yourself on testnet.snowtrace.io."

### "How do I know the smart contracts are working?"

**Answer:**
> "Great question! First, here are the deployed contract addresses [show list]. Second, every product has a 'View On-chain' button that opens the blockchain explorer. Third, the QR codes contain blockchain links - scan one with your phone right now and you'll see the transaction. Fourth, you can interact with the contracts yourself using the addresses I provided."

### "Can consumers verify products?"

**Answer:**
> "Absolutely! Consumers just scan the QR code on the product packaging. Their phone opens the Avalanche blockchain explorer showing the complete product journey - when it was harvested, who handled it, where it's been. No app needed, works on any smartphone. It's completely transparent and tamper-proof."

---

## 🔧 Technical Verification Commands

### For Technical Audiences

```bash
# 1. Check contract on blockchain
curl https://api.avax-test.network/ext/bc/C/rpc \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0",
    "method":"eth_getCode",
    "params":["0x8bb1D4dE341096dBAd6384d965256d94dA4D8590", "latest"],
    "id":1
  }'

# 2. Get transaction receipt
curl https://api.avax-test.network/ext/bc/C/rpc \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0",
    "method":"eth_getTransactionReceipt",
    "params":["0x3f90e3a1a861d657e0e2a881111cf16225b2573b08991b81c2899bcfa45a1304"],
    "id":1
  }'

# 3. Read from contract (get product count)
node scripts/verify-contract.js
```

---

## 📝 Demo Checklist

Before your demo, make sure:

- [ ] Backend server is running (`npm run dev` in backend/)
- [ ] Frontend server is running (`npm run dev` in frontend/)
- [ ] Browser is open to farmer dashboard
- [ ] SnowTrace tab is open in background
- [ ] Phone camera is ready for QR scanning
- [ ] Internet connection is stable
- [ ] Contract addresses are copied and ready
- [ ] Sample transaction hash is ready to show

---

## 🌟 Impressive Features to Highlight

1. **Real Blockchain Integration**
   - Not just a UI mockup
   - Actually deployed on Avalanche
   - Verifiable by anyone

2. **QR Code Innovation**
   - Scans directly to blockchain
   - No app installation needed
   - Works on any smartphone

3. **Transparency**
   - All data is public
   - Anyone can verify
   - Tamper-proof records

4. **User Experience**
   - Simple "View On-chain" button
   - One-click verification
   - Mobile-friendly scanning

5. **Production Ready**
   - Deployed contracts
   - Working frontend
   - Real-time verification

---

## 🎯 Call to Action

### For Viewers/Judges

> "Try it yourself! Here's the contract address: 0x8bb1D4dE341096dBAd6384d965256d94dA4D8590
> 
> Go to testnet.snowtrace.io and search for it. You'll see it's real, deployed, and working.
> 
> Or scan this QR code with your phone right now - it'll open the blockchain record instantly."

---

## 📧 Share These Links

Send these to anyone who wants to verify:

1. **ProductRegistry Contract**: https://testnet.snowtrace.io/address/0x8bb1D4dE341096dBAd6384d965256d94dA4D8590

2. **Sample Transaction**: https://testnet.snowtrace.io/tx/0x3f90e3a1a861d657e0e2a881111cf16225b2573b08991b81c2899bcfa45a1304

3. **GitHub Repository**: [Your repo link]

4. **Live Demo**: [Your deployed frontend URL]

---

## 🏆 Success Metrics to Show

- ✅ **3 Smart Contracts Deployed** on Avalanche Fuji
- ✅ **Transaction Hash Visible** in every product
- ✅ **QR Codes Working** - scan to verify
- ✅ **Public Verification** - anyone can check
- ✅ **Real-Time Updates** - blockchain synced
- ✅ **Mobile Compatible** - works on all devices

---

**Remember**: The key is showing that clicking "View On-chain" opens a REAL blockchain explorer with REAL transaction data. That's the proof that your smart contracts are actually working!
