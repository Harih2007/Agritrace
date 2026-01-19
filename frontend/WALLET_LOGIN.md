# 🦊 Wallet Login Button - Usage Guide

## Overview

The `WalletLoginButton` component provides a complete MetaMask authentication flow with backend integration.

---

## ✨ Features

- ✅ One-click MetaMask connection
- ✅ Automatic signature request for authentication
- ✅ Backend API integration
- ✅ Token storage and session management
- ✅ User role display
- ✅ Disconnect functionality
- ✅ Loading states
- ✅ Responsive design
- ✅ Dark mode support

---

## 🚀 Quick Start

### 1. Import the Component

```javascript
import { WalletLoginButton } from '../components/WalletLoginButton';
import '../styles/WalletButton.css';
```

### 2. Add to Your Page

```javascript
export default function HomePage() {
  return (
    <div>
      <nav>
        <h1>AgriChain</h1>
        <WalletLoginButton />
      </nav>
    </div>
  );
}
```

That's it! The button handles everything automatically.

---

## 🔄 Authentication Flow

### Step 1: User Clicks "Wallet" Button
- MetaMask popup appears
- User approves connection

### Step 2: Signature Request
- Component generates authentication message
- User signs message in MetaMask

### Step 3: Backend Verification
- Signature sent to `/api/auth/wallet`
- Backend verifies signature
- Returns JWT token and user data

### Step 4: Session Storage
- Token stored in `localStorage`
- User data cached
- Wallet address saved

### Step 5: Authenticated State
- Shows wallet address
- Displays user role
- Provides disconnect button

---

## 📊 Component States

### 1. Disconnected (Initial)
```
┌─────────────────┐
│  🦊  Wallet     │
└─────────────────┘
```

### 2. Authenticating
```
┌──────────────────────┐
│  ⟳  Authenticating...│
└──────────────────────┘
```

### 3. Authenticated
```
┌────────────────────────────────┐
│ 🦊  0x1234...5678  │ Disconnect│
│     farmer         │           │
└────────────────────────────────┘
```

---

## 🎨 Styling

### Import CSS

```javascript
import '../styles/WalletButton.css';
```

### Custom Styling

Override CSS variables:

```css
.btn-wallet-login {
  --wallet-primary: #f6851b;
  --wallet-hover: #e2761b;
  --wallet-shadow: rgba(246, 133, 27, 0.3);
}
```

### Tailwind CSS

```javascript
<WalletLoginButton className="my-custom-class" />
```

---

## 🔧 Advanced Usage

### Access User Data

```javascript
'use client';

import { useEffect, useState } from 'react';
import { WalletLoginButton } from '../components/WalletLoginButton';

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <div>
      <WalletLoginButton />
      
      {user && (
        <div>
          <h2>Welcome, {user.role}!</h2>
          <p>Wallet: {user.wallet_address}</p>
        </div>
      )}
    </div>
  );
}
```

### Protected Routes

```javascript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';

export default function ProtectedPage() {
  const { isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!isConnected || !token) {
      router.push('/login');
    }
  }, [isConnected]);

  return <div>Protected Content</div>;
}
```

### Custom Authentication Handler

```javascript
import { WalletLoginButton } from '../components/WalletLoginButton';

export default function CustomAuth() {
  const handleAuthSuccess = (userData) => {
    console.log('User authenticated:', userData);
    // Custom logic here
  };

  return (
    <WalletLoginButton 
      onAuthSuccess={handleAuthSuccess}
    />
  );
}
```

---

## 🔐 Security Features

### 1. Message Signing
- Unique message per authentication
- Includes timestamp to prevent replay attacks
- Wallet address included in message

### 2. Backend Verification
- Signature verified on server
- Invalid signatures rejected
- Token-based session management

### 3. Secure Storage
- JWT tokens in localStorage
- Automatic token refresh
- Secure logout process

---

## 📱 Responsive Design

### Desktop
- Full wallet address display
- Role badge visible
- Hover effects enabled

### Mobile
- Shortened address format
- Touch-optimized buttons
- Responsive layout

### Tablet
- Adaptive sizing
- Optimized spacing
- Touch-friendly targets

---

## 🎯 Integration Examples

### Example 1: Navigation Bar

```javascript
export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <h1>AgriChain</h1>
      </div>
      <div className="nav-links">
        <a href="/products">Products</a>
        <a href="/scan">Scan QR</a>
        <WalletLoginButton />
      </div>
    </nav>
  );
}
```

### Example 2: Login Page

```javascript
export default function LoginPage() {
  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Welcome to AgriChain</h1>
        <p>Connect your wallet to get started</p>
        
        <div className="login-options">
          <WalletLoginButton />
          
          <div className="divider">OR</div>
          
          <button className="btn-email-login">
            Email Login
          </button>
        </div>
      </div>
    </div>
  );
}
```

### Example 3: User Profile

```javascript
'use client';

import { useState, useEffect } from 'react';
import { WalletLoginButton } from '../components/WalletLoginButton';

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  if (!user) {
    return (
      <div className="profile-login">
        <h2>Please connect your wallet</h2>
        <WalletLoginButton />
      </div>
    );
  }

  return (
    <div className="profile">
      <div className="profile-header">
        <h2>Profile</h2>
        <WalletLoginButton />
      </div>
      
      <div className="profile-info">
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>Wallet:</strong> {user.wallet_address}</p>
        <p><strong>Joined:</strong> {user.created_at}</p>
      </div>
    </div>
  );
}
```

---

## 🧪 Testing

### Test Wallet Connection

1. Start frontend: `npm run dev`
2. Open: http://localhost:3001
3. Click "Wallet" button
4. Approve MetaMask connection
5. Sign authentication message
6. Verify authenticated state

### Test Backend Integration

```bash
# Check if backend is running
curl http://localhost:3000/health

# Test wallet auth endpoint
curl -X POST http://localhost:3000/api/auth/wallet \
  -H "Content-Type: application/json" \
  -d '{
    "address": "0x...",
    "message": "Sign this message...",
    "signature": "0x..."
  }'
```

---

## 🚨 Troubleshooting

### MetaMask Not Detected

```javascript
if (typeof window.ethereum === 'undefined') {
  return (
    <div className="wallet-error">
      <p>MetaMask not detected</p>
      <a href="https://metamask.io/download/" target="_blank">
        Install MetaMask
      </a>
    </div>
  );
}
```

### Authentication Failed

- Check backend is running
- Verify API URL in `.env.local`
- Check browser console for errors
- Ensure wallet is on correct network

### Signature Rejected

- User must approve signature in MetaMask
- Cannot proceed without signature
- Component will disconnect on rejection

---

## 📚 API Reference

### Props

```typescript
interface WalletLoginButtonProps {
  onAuthSuccess?: (user: User) => void;
  onAuthError?: (error: Error) => void;
  className?: string;
}
```

### Events

- `onAuthSuccess` - Called after successful authentication
- `onAuthError` - Called if authentication fails

### Storage Keys

- `authToken` - JWT authentication token
- `userData` - User profile data
- `walletAddress` - Connected wallet address

---

## ✅ Checklist

Before using in production:

- [ ] Backend `/api/auth/wallet` endpoint working
- [ ] CORS configured for frontend domain
- [ ] SSL/HTTPS enabled
- [ ] Error handling implemented
- [ ] Loading states tested
- [ ] Mobile responsiveness verified
- [ ] Dark mode tested
- [ ] Security audit completed

---

## 🎉 Summary

The `WalletLoginButton` provides:

- ✅ Complete MetaMask authentication
- ✅ Backend API integration
- ✅ Session management
- ✅ Beautiful UI with animations
- ✅ Responsive design
- ✅ Easy to integrate

**Just import and use - it handles everything!** 🚀
