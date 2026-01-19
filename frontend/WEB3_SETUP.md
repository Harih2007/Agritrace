# 🔗 Web3 & MetaMask Integration Guide

## ✅ Installation Complete

MetaMask SDK with Wagmi has been installed and configured for your Next.js frontend!

---

## 📦 Installed Packages

```json
{
  "@metamask/sdk": "latest",
  "wagmi": "latest",
  "viem": "2.x",
  "@tanstack/react-query": "latest"
}
```

---

## 🏗️ Project Structure

```
frontend/
├── lib/
│   └── wagmi.js              # Wagmi configuration
├── components/
│   ├── Web3Provider.js       # Web3 context provider
│   └── ConnectWallet.js      # Wallet connect button
└── .env.local                # Environment variables
```

---

## ⚙️ Configuration

### 1. Wagmi Config (`lib/wagmi.js`)

Configured for:
- ✅ Avalanche Fuji Testnet (Chain ID: 43113)
- ✅ Avalanche Mainnet (Chain ID: 43114)
- ✅ MetaMask connector
- ✅ SSR support for Next.js

### 2. Environment Variables (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_AVALANCHE_RPC=https://api.avax-test.network/ext/bc/C/rpc
NEXT_PUBLIC_CHAIN_ID=43113
NEXT_PUBLIC_INFURA_API_KEY=          # Optional
NEXT_PUBLIC_PRODUCT_REGISTRY_ADDRESS= # After deployment
NEXT_PUBLIC_ESCROW_ADDRESS=           # After deployment
```

---

## 🚀 Usage

### Step 1: Wrap Your App with Web3Provider

Update `app/layout.js`:

```javascript
import { Web3Provider } from '../components/Web3Provider';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}
```

### Step 2: Add Connect Wallet Button

In any page or component:

```javascript
import { ConnectWallet } from '../components/ConnectWallet';

export default function HomePage() {
  return (
    <div>
      <h1>AgriChain</h1>
      <ConnectWallet />
    </div>
  );
}
```

### Step 3: Use Wagmi Hooks

```javascript
'use client';

import { useAccount, useBalance, useChainId } from 'wagmi';

export function UserProfile() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const chainId = useChainId();

  if (!isConnected) {
    return <div>Please connect your wallet</div>;
  }

  return (
    <div>
      <p>Address: {address}</p>
      <p>Balance: {balance?.formatted} {balance?.symbol}</p>
      <p>Chain ID: {chainId}</p>
    </div>
  );
}
```

---

## 🔧 Available Hooks

### Account Management

```javascript
import { useAccount, useConnect, useDisconnect } from 'wagmi';

const { address, isConnected, isConnecting } = useAccount();
const { connect, connectors } = useConnect();
const { disconnect } = useDisconnect();
```

### Balance

```javascript
import { useBalance } from 'wagmi';

const { data: balance } = useBalance({
  address: '0x...',
});
```

### Network

```javascript
import { useChainId, useSwitchChain } from 'wagmi';

const chainId = useChainId();
const { switchChain } = useSwitchChain();
```

### Contract Interaction

```javascript
import { useReadContract, useWriteContract } from 'wagmi';

// Read from contract
const { data } = useReadContract({
  address: '0x...',
  abi: ProductRegistryABI,
  functionName: 'getProduct',
  args: [productId],
});

// Write to contract
const { writeContract } = useWriteContract();

writeContract({
  address: '0x...',
  abi: ProductRegistryABI,
  functionName: 'registerProduct',
  args: [name, ipfsHash],
});
```

---

## 📝 Example: Product Registration

```javascript
'use client';

import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useState } from 'react';
import ProductRegistryABI from '../contracts/ProductRegistry.json';

export function RegisterProduct() {
  const { address } = useAccount();
  const [productName, setProductName] = useState('');
  const [ipfsHash, setIpfsHash] = useState('');
  
  const { writeContract, data: hash } = useWriteContract();
  
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleRegister = async () => {
    writeContract({
      address: process.env.NEXT_PUBLIC_PRODUCT_REGISTRY_ADDRESS,
      abi: ProductRegistryABI.abi,
      functionName: 'registerProduct',
      args: [productName, ipfsHash],
    });
  };

  return (
    <div>
      <input
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
        placeholder="Product Name"
      />
      <input
        value={ipfsHash}
        onChange={(e) => setIpfsHash(e.target.value)}
        placeholder="IPFS Hash"
      />
      <button onClick={handleRegister} disabled={isLoading}>
        {isLoading ? 'Registering...' : 'Register Product'}
      </button>
      {isSuccess && <div>Product registered successfully!</div>}
    </div>
  );
}
```

---

## 🎨 Styling the Connect Button

Add to your CSS:

```css
.wallet-connected {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 1rem;
  background: #f5f5f5;
  border-radius: 8px;
}

.wallet-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.wallet-address {
  font-family: monospace;
  font-weight: 600;
}

.wallet-balance {
  font-size: 0.875rem;
  color: #666;
}

.network-warning {
  color: #ff6b6b;
  font-size: 0.875rem;
}

.btn-connect,
.btn-disconnect {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.btn-connect {
  background: #3498db;
  color: white;
}

.btn-connect:hover {
  background: #2980b9;
}

.btn-connect:disabled {
  background: #95a5a6;
  cursor: not-allowed;
}

.btn-disconnect {
  background: #e74c3c;
  color: white;
}

.btn-disconnect:hover {
  background: #c0392b;
}
```

---

## 🌐 Network Configuration

### Avalanche Fuji Testnet

```javascript
{
  id: 43113,
  name: 'Avalanche Fuji',
  network: 'avalanche-fuji',
  nativeCurrency: {
    decimals: 18,
    name: 'Avalanche',
    symbol: 'AVAX',
  },
  rpcUrls: {
    default: { http: ['https://api.avax-test.network/ext/bc/C/rpc'] },
  },
  blockExplorers: {
    default: { name: 'SnowTrace', url: 'https://testnet.snowtrace.io' },
  },
}
```

### Avalanche Mainnet

```javascript
{
  id: 43114,
  name: 'Avalanche',
  network: 'avalanche',
  nativeCurrency: {
    decimals: 18,
    name: 'Avalanche',
    symbol: 'AVAX',
  },
  rpcUrls: {
    default: { http: ['https://api.avax.network/ext/bc/C/rpc'] },
  },
  blockExplorers: {
    default: { name: 'SnowTrace', url: 'https://snowtrace.io' },
  },
}
```

---

## 🔐 Best Practices

### 1. Always Check Connection

```javascript
const { isConnected } = useAccount();

if (!isConnected) {
  return <ConnectWallet />;
}
```

### 2. Verify Network

```javascript
const chainId = useChainId();
const isCorrectNetwork = chainId === 43113; // Fuji testnet

if (!isCorrectNetwork) {
  return <div>Please switch to Avalanche Fuji Testnet</div>;
}
```

### 3. Handle Errors

```javascript
const { writeContract, error } = useWriteContract();

if (error) {
  console.error('Transaction failed:', error);
}
```

### 4. Wait for Confirmations

```javascript
const { data: hash } = useWriteContract();
const { isLoading, isSuccess } = useWaitForTransactionReceipt({
  hash,
  confirmations: 2, // Wait for 2 confirmations
});
```

---

## 🧪 Testing

### 1. Start Frontend

```bash
cd frontend
npm run dev
```

### 2. Open Browser

Visit: http://localhost:3001

### 3. Connect MetaMask

1. Click "Connect MetaMask"
2. Approve connection
3. Switch to Avalanche Fuji Testnet if needed

### 4. Test Features

- View wallet address
- Check AVAX balance
- Interact with contracts (after deployment)

---

## 🚨 Troubleshooting

### MetaMask Not Detected

```javascript
if (typeof window.ethereum === 'undefined') {
  return <div>Please install MetaMask</div>;
}
```

### Wrong Network

```javascript
import { useSwitchChain } from 'wagmi';
import { avalancheFuji } from 'wagmi/chains';

const { switchChain } = useSwitchChain();

<button onClick={() => switchChain({ chainId: avalancheFuji.id })}>
  Switch to Fuji
</button>
```

### Transaction Failed

- Check gas fees
- Verify contract address
- Ensure wallet has AVAX
- Check contract ABI matches

---

## 📚 Resources

- [Wagmi Documentation](https://wagmi.sh/)
- [MetaMask SDK Docs](https://docs.metamask.io/wallet/how-to/use-sdk/)
- [Avalanche Docs](https://docs.avax.network/)
- [Viem Documentation](https://viem.sh/)

---

## ✅ Next Steps

1. ✅ **Deploy Smart Contracts**
   ```bash
   npm run deploy:fuji
   ```

2. ✅ **Update Contract Addresses**
   - Copy addresses to `frontend/.env.local`

3. ✅ **Copy Contract ABIs**
   ```bash
   mkdir -p frontend/contracts
   cp build/contracts/*.json frontend/contracts/
   ```

4. ✅ **Test Wallet Connection**
   - Start frontend
   - Connect MetaMask
   - Verify network

5. ✅ **Implement Contract Interactions**
   - Product registration
   - QR code generation
   - Escrow creation

---

**Web3 integration is ready! Connect your wallet and start building!** 🚀
