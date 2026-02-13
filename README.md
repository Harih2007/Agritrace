# 🌾 Agritrace - Smart Chain Supply Tracking

<div align="center">
  <img src="https://github.com/ac12644/Supply-Chain/blob/main/images/AgriChainLogo.png" alt="Logo" width="145" height="55">
  
  <p><strong>Blockchain-based agricultural supply chain management on Avalanche</strong></p>
  
  [![Avalanche](https://img.shields.io/badge/Avalanche-Fuji%20Testnet-E84142?style=flat&logo=avalanche)](https://testnet.snowtrace.io/address/0x8bb1D4dE341096dBAd6384d965256d94dA4D8590)
  [![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)](https://nextjs.org/)
  [![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
</div>

---

## 🎯 Live Demo

- **Smart Contracts**: [View on SnowTrace](https://testnet.snowtrace.io/address/0x8bb1D4dE341096dBAd6384d965256d94dA4D8590)
- **Sample Transaction**: [View Transaction](https://testnet.snowtrace.io/tx/0x3f90e3a1a861d657e0e2a881111cf16225b2573b08991b81c2899bcfa45a1304)
- **Frontend**: http://localhost:3001 (after setup)

## ✨ Features

### 🔗 Blockchain Integration
- ✅ **3 Smart Contracts** deployed on Avalanche Fuji testnet
- ✅ **Real-time verification** via blockchain explorer
- ✅ **Transparent tracking** from farm to consumer
- ✅ **Immutable records** on public blockchain

### 📱 User Features
- ✅ **QR Code Generation** - Links directly to blockchain records
- ✅ **Camera Scanning** - Live product verification
- ✅ **MetaMask Integration** - Wallet-based authentication
- ✅ **Multi-Role Support** - Farmer, Admin, Transporter, Retailer, Consumer
- ✅ **Admin Approval System** - Product verification workflow
- ✅ **Persistent Storage** - localStorage with cross-page sync

### 🎨 Modern UI/UX
- ✅ **Next.js 14** with React
- ✅ **TailwindCSS** styling
- ✅ **Responsive Design** - Mobile and desktop
- ✅ **Dark Mode** support
- ✅ **Smooth Animations** and transitions

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- MetaMask browser extension
- Avalanche Fuji testnet AVAX ([Get from faucet](https://faucet.avax.network/))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Harih2007/Agritrace.git
cd Agritrace
```

2. **Install frontend dependencies**
```bash
cd frontend
npm install
```

3. **Configure environment**
```bash
cp .env.example .env.local
# Edit .env.local with your settings
```

4. **Start the application**
```bash
npm run dev
```

5. **Open your browser**
```
http://localhost:3001
```

## 📱 User Roles & Pages

### 🌾 Farmer Dashboard
- Register new products
- Track product status
- Generate QR codes
- View blockchain records
- **URL**: `/farmer`

### 👨‍💼 Admin Panel
- Approve/reject products
- Monitor all products
- View statistics
- Manage supply chain
- **URL**: `/admin`

### 🚚 Transporter
- View assigned shipments
- Update delivery status
- Track locations
- **URL**: `/transporter`

### 🏪 Retailer
- Receive products
- Update inventory
- Track sales
- **URL**: `/retailer`

### 📱 Consumer Scanner
- Scan QR codes
- Verify product authenticity
- View product journey
- Check blockchain records
- **URL**: `/scan`

## 🔗 Smart Contracts

### Deployed on Avalanche Fuji Testnet

| Contract | Address | Explorer |
|----------|---------|----------|
| ProductRegistry | `0x8bb1D4dE341096dBAd6384d965256d94dA4D8590` | [View](https://testnet.snowtrace.io/address/0x8bb1D4dE341096dBAd6384d965256d94dA4D8590) |
| SupplyChain | `0x9B59524C1660e70411159Af4C3D24fDfCc0CA684` | [View](https://testnet.snowtrace.io/address/0x9B59524C1660e70411159Af4C3D24fDfCc0CA684) |
| Escrow | `0xEC7C5FBe04d9abD1993CB32225c98DE0a8683066` | [View](https://testnet.snowtrace.io/address/0xEC7C5FBe04d9abD1993CB32225c98DE0a8683066) |

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 14
- **UI Library**: React 18
- **Styling**: TailwindCSS
- **Web3**: Wagmi, Ethers.js
- **QR Codes**: qrcode.react
- **Notifications**: react-hot-toast

### Backend (Optional)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Storage**: IPFS (Pinata)
- **Auth**: JWT

### Blockchain
- **Network**: Avalanche C-Chain (Fuji Testnet)
- **Language**: Solidity ^0.8.0
- **Tools**: Truffle, Hardhat
- **Explorer**: SnowTrace

## 📖 Documentation

- **[SYSTEM_STATUS.md](SYSTEM_STATUS.md)** - Complete system overview
- **[DEMO_README.md](DEMO_README.md)** - Demo guide
- **[PROOF_OF_WORK.md](PROOF_OF_WORK.md)** - Blockchain verification
- **[SMART_CONTRACT_DEMO_GUIDE.md](SMART_CONTRACT_DEMO_GUIDE.md)** - Contract demo
- **[PERSISTENT_STORAGE_COMPLETE.md](PERSISTENT_STORAGE_COMPLETE.md)** - Storage system
- **[METAMASK_CONNECTION_FIXED.md](METAMASK_CONNECTION_FIXED.md)** - Wallet setup

## 🎯 Key Workflows

### 1. Product Registration
```
Farmer → Register Product → Processing Status → Admin Approval → Approved
```

### 2. QR Code Generation
```
Product → Generate QR → Links to Blockchain → Consumer Scans → Verifies Authenticity
```

### 3. Supply Chain Tracking
```
Farm → Transporter → Distributor → Retailer → Consumer
```

### 4. Blockchain Verification
```
Product → View On-chain → Opens SnowTrace → Shows Transaction → Public Verification
```

## 🔐 Security Features

- ✅ **Wallet Authentication** - MetaMask integration
- ✅ **Role-Based Access** - Different permissions per role
- ✅ **Blockchain Immutability** - Tamper-proof records
- ✅ **Public Verification** - Anyone can verify on blockchain
- ✅ **Secure Storage** - localStorage with encryption ready

## 📊 Project Structure

```
Agritrace/
├── frontend/              # Next.js application
│   ├── app/              # Pages (farmer, admin, etc.)
│   ├── components/       # React components
│   ├── lib/             # Utilities (productStore)
│   └── utils/           # Mock data
├── backend/              # Express API (optional)
│   ├── src/             # Source code
│   └── database/        # SQL schemas
├── contracts/            # Smart contracts
│   ├── ProductRegistry.sol
│   ├── SupplyChain.sol
│   └── Escrow.sol
└── scripts/             # Deployment scripts
```

## 🧪 Testing

### Test the Application
```bash
# Start frontend
cd frontend
npm run dev

# Visit pages
http://localhost:3001/farmer
http://localhost:3001/admin
http://localhost:3001/scan
```

### Verify Blockchain
1. Click "View On-chain" on any product
2. Browser opens SnowTrace explorer
3. See real blockchain transaction
4. Verify contract deployment

### Test QR Codes
1. Generate QR code for a product
2. Scan with phone camera
3. Opens blockchain explorer
4. Verifies product authenticity

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Hariharan**
- GitHub: [@Harih2007](https://github.com/Harih2007)

## 🙏 Acknowledgments

- Avalanche for the blockchain infrastructure
- Next.js team for the amazing framework
- OpenZeppelin for smart contract libraries
- The blockchain community for inspiration

## 📞 Support

For support, please open an issue in the GitHub repository or contact the maintainers.

---

<div align="center">
  <p>Made with ❤️ for transparent agriculture</p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>
