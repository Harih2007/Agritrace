// Example: How to use WalletLoginButton in your pages

'use client';

import { WalletLoginButton } from '../components/WalletLoginButton';
import '../styles/WalletButton.css';

export default function ExamplePage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>AgriChain - Wallet Login Example</h1>
      
      {/* Simple usage */}
      <div style={{ marginTop: '2rem' }}>
        <h2>Simple Usage:</h2>
        <WalletLoginButton />
      </div>

      {/* In a navigation bar */}
      <div style={{ marginTop: '3rem' }}>
        <h2>In Navigation Bar:</h2>
        <nav style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '1rem',
          background: '#f5f5f5',
          borderRadius: '8px'
        }}>
          <div>
            <h3 style={{ margin: 0 }}>🌾 AgriChain</h3>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <a href="/products">Products</a>
            <a href="/scan">Scan</a>
            <WalletLoginButton />
          </div>
        </nav>
      </div>

      {/* Instructions */}
      <div style={{ marginTop: '3rem', padding: '1rem', background: '#e8f5e9', borderRadius: '8px' }}>
        <h3>How it works:</h3>
        <ol>
          <li>Click the "Wallet" button</li>
          <li>Approve MetaMask connection</li>
          <li>Sign the authentication message</li>
          <li>You're logged in!</li>
        </ol>
        <p><strong>Note:</strong> Make sure MetaMask is installed and backend is running on port 3000</p>
      </div>
    </div>
  );
}
