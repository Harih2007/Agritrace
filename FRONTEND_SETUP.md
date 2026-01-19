# 🎨 Frontend Setup Guide

The AgriTrace Next.js frontend has been integrated into your project!

## 📁 Project Structure

```
Supply-Chain-Smart-Contract/
├── frontend/              ← Next.js frontend (NEW!)
│   ├── app/              # Next.js 14 App Router
│   ├── components/       # React components
│   ├── pages/            # API routes
│   ├── utils/            # Utilities
│   └── middleware/       # Auth middleware
├── backend/              # Express API (port 3000)
├── contracts/            # Smart contracts
└── scripts/              # Deployment scripts
```

## 🚀 Quick Start

### 1. Install Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

Or install everything at once:
```bash
npm run install:all
```

### 2. Configure Environment

The frontend `.env.local` is already created with default values:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_AVALANCHE_RPC=https://api.avax-test.network/ext/bc/C/rpc
NEXT_PUBLIC_CHAIN_ID=43113
```

### 3. Start Backend (Terminal 1)

```bash
npm run backend
```

Backend runs on: `http://localhost:3000`

### 4. Start Frontend (Terminal 2)

```bash
npm run frontend
```

Frontend runs on: `http://localhost:3001`

### 5. Open Browser

Visit: **http://localhost:3001**

---

## 🎯 Available Routes

### Public Routes
- `/` - Landing page
- `/login` - Authentication
- `/scan` - QR code scanner

### Role-Based Dashboards
- `/farmer` - Farmer dashboard
- `/transporter` - Transporter dashboard
- `/retailer` - Retailer dashboard
- `/admin` - Admin dashboard

---

## 🔧 Configuration

### Update Backend URL

If your backend runs on a different port or domain:

Edit `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=https://your-backend-api.com
```

### Update Contract Addresses

After deploying contracts, update `frontend/.env.local`:
```env
NEXT_PUBLIC_PRODUCT_REGISTRY_ADDRESS=0x...
NEXT_PUBLIC_ESCROW_ADDRESS=0x...
NEXT_PUBLIC_SUPPLY_CHAIN_ADDRESS=0x...
```

---

## 📦 NPM Scripts

### Root Level (from project root)

```bash
# Install all dependencies (backend + frontend)
npm run install:all

# Start backend
npm run backend

# Start frontend
npm run frontend

# Build frontend for production
npm run frontend:build

# Start frontend in production mode
npm run frontend:start
```

### Frontend Level (from frontend/ folder)

```bash
cd frontend

# Development
npm run dev          # Start dev server on port 3001

# Production
npm run build        # Build for production
npm run start        # Start production server

# Linting
npm run lint         # Run ESLint
```

---

## 🔗 Backend Integration

The frontend is pre-configured to connect to your backend API.

### API Calls Example

```javascript
// In your frontend components
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Fetch products
const response = await fetch(`${API_URL}/api/products`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
```

### Authentication Flow

1. User logs in via `/login`
2. Backend returns JWT token
3. Token stored in localStorage/cookies
4. Token included in subsequent API requests

---

## 🎨 Features

### ✅ Implemented
- Multi-role dashboards (Farmer, Transporter, Retailer, Admin)
- QR code scanner
- Product management UI
- Supply chain tracking
- Responsive design with Tailwind CSS
- Toast notifications

### 🔄 Needs Backend Connection
- Authentication (connect to `/api/auth/login`)
- Product CRUD (connect to `/api/products`)
- QR generation (connect to `/api/qr/generate`)
- IPFS uploads (connect to `/api/ipfs/upload`)
- Escrow payments (connect to `/api/payments/escrow`)

---

## 🛠️ Customization

### Update API Endpoints

Edit files in `frontend/utils/` or create an API service:

```javascript
// frontend/utils/api.js
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = {
  products: {
    getAll: () => fetch(`${API_URL}/api/products`),
    create: (data) => fetch(`${API_URL}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
  }
};
```

### Add Web3 Integration

Install ethers.js in frontend:
```bash
cd frontend
npm install ethers
```

Create Web3 utility:
```javascript
// frontend/utils/web3.js
import { ethers } from 'ethers';

export const connectWallet = async () => {
  if (!window.ethereum) throw new Error('MetaMask not installed');
  
  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  
  return { provider, signer };
};
```

---

## 🧪 Testing

### Test Frontend Locally

1. Start backend: `npm run backend`
2. Start frontend: `npm run frontend`
3. Open: `http://localhost:3001`
4. Test login, navigation, and features

### Test API Connection

```javascript
// In browser console
fetch('http://localhost:3000/health')
  .then(res => res.json())
  .then(console.log);
```

---

## 🚀 Deployment

### Deploy Frontend (Vercel)

```bash
cd frontend
npm run build
vercel deploy
```

### Environment Variables in Production

Set in Vercel dashboard:
- `NEXT_PUBLIC_API_URL` - Your production backend URL
- `NEXT_PUBLIC_AVALANCHE_RPC` - Avalanche RPC
- `NEXT_PUBLIC_CHAIN_ID` - 43113 (Fuji) or 43114 (Mainnet)
- Contract addresses

### Deploy Backend

Deploy your backend to:
- Railway
- Render
- AWS/Azure
- DigitalOcean

Update `NEXT_PUBLIC_API_URL` to point to deployed backend.

---

## 🔒 CORS Configuration

Make sure your backend allows requests from frontend:

In `backend/.env`:
```env
CORS_ORIGIN=http://localhost:3001,https://your-frontend-domain.com
```

---

## 📝 Common Issues

### Port Already in Use
```bash
# Frontend uses port 3001 by default
# Change in frontend/package.json if needed
"dev": "next dev -p 3002"
```

### API Connection Failed
- Ensure backend is running on port 3000
- Check CORS settings
- Verify `NEXT_PUBLIC_API_URL` in `.env.local`

### Build Errors
```bash
cd frontend
rm -rf .next node_modules
npm install
npm run build
```

### Module Not Found
```bash
cd frontend
npm install
```

---

## 📚 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **QR Codes:** qrcode.react
- **Notifications:** react-hot-toast
- **State:** React hooks
- **API:** Fetch API

---

## 🎉 You're All Set!

Your frontend is integrated and ready to use!

**Next steps:**
1. Install dependencies: `npm run install:all`
2. Start backend: `npm run backend`
3. Start frontend: `npm run frontend`
4. Open: http://localhost:3001

Happy coding! 🚀
