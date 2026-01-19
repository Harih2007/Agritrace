# AgriTrace Frontend

Next.js frontend for the AgriChain supply chain platform.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your backend URL

# Run development server
npm run dev
```

Open [http://localhost:3001](http://localhost:3001)

## 📁 Structure

```
frontend/
├── app/              # Next.js 14 App Router
│   ├── admin/       # Admin dashboard
│   ├── farmer/      # Farmer interface
│   ├── retailer/    # Retailer interface
│   ├── transporter/ # Transporter interface
│   ├── scan/        # QR code scanner
│   └── login/       # Authentication
├── components/      # Reusable components
├── pages/api/       # API routes (if needed)
├── utils/           # Utility functions
└── middleware/      # Next.js middleware

```

## 🔧 Configuration

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_AVALANCHE_RPC=https://api.avax-test.network/ext/bc/C/rpc
NEXT_PUBLIC_CHAIN_ID=43113
NEXT_PUBLIC_PRODUCT_REGISTRY_ADDRESS=0x...
NEXT_PUBLIC_ESCROW_ADDRESS=0x...
```

### Backend Connection

The frontend connects to the backend API at `http://localhost:3000` by default.

Make sure your backend is running:
```bash
cd ../backend
npm run dev
```

## 🎨 Features

- **Multi-role Interface** - Admin, Farmer, Retailer, Transporter
- **QR Code Scanner** - Scan products for verification
- **Product Management** - Create and track products
- **Supply Chain Tracking** - Real-time product journey
- **Wallet Integration** - Connect MetaMask for blockchain operations

## 📦 Available Scripts

```bash
npm run dev      # Start development server (port 3001)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🔗 API Integration

The frontend uses the backend API endpoints:

```javascript
// Example: Fetch products
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
const data = await response.json();
```

## 🌐 Deployment

### Vercel (Recommended)

```bash
npm run build
vercel deploy
```

### Environment Variables in Production

Set these in your deployment platform:
- `NEXT_PUBLIC_API_URL` - Your backend API URL
- `NEXT_PUBLIC_AVALANCHE_RPC` - Avalanche RPC endpoint
- `NEXT_PUBLIC_CHAIN_ID` - Network chain ID
- Contract addresses

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **UI Components:** Lucide React icons
- **QR Codes:** qrcode.react
- **Notifications:** react-hot-toast
- **Web3:** ethers.js (via backend)

## 📝 Notes

- Frontend runs on port 3001 (to avoid conflict with backend on 3000)
- Uses Next.js 14 App Router
- Tailwind CSS for styling
- Server-side rendering enabled

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Change port in package.json
"dev": "next dev -p 3001"
```

### API Connection Failed
- Ensure backend is running on port 3000
- Check CORS settings in backend
- Verify API_URL in .env.local

### Build Errors
```bash
rm -rf .next node_modules
npm install
npm run build
```

## 📚 Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [Backend API Reference](../backend/API_REFERENCE.md)
- [Tailwind CSS](https://tailwindcss.com/docs)
