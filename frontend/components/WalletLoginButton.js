'use client';

import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi';
import { useState, useEffect } from 'react';

export function WalletLoginButton() {
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [user, setUser] = useState(null);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Skip backend authentication for now - just show connected status
  useEffect(() => {
    if (isConnected && address && !user) {
      // Set user from wallet address (no backend auth needed for demo)
      setUser({
        address: address,
        role: 'farmer' // Default role for demo
      });
      localStorage.setItem('walletAddress', address);
    }
  }, [isConnected, address, user]);

  const handleWalletAuth = async () => {
    if (!address) return;

    setIsAuthenticating(true);
    try {
      // Create message to sign
      const message = `Sign this message to authenticate with AgriChain.\n\nAddress: ${address}\nTimestamp: ${Date.now()}`;
      
      // Request signature from MetaMask
      const signature = await signMessageAsync({ message });

      // Send to backend for verification
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/wallet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address,
          message,
          signature,
        }),
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      const data = await response.json();
      
      // Store auth token and user data
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }
      localStorage.setItem('userData', JSON.stringify(data.user));
      localStorage.setItem('walletAddress', address);
      
      setUser(data.user);
      
      // Show success message
      console.log('Wallet authenticated successfully!');
    } catch (error) {
      console.error('Wallet authentication error:', error);
      // Disconnect on auth failure
      disconnect();
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleDisconnect = () => {
    // Clear auth data
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('walletAddress');
    setUser(null);
    
    // Disconnect wallet
    disconnect();
  };

  // If authenticated, show user info
  if (isConnected && user) {
    return (
      <div className="wallet-authenticated">
        <div className="wallet-info">
          <div className="wallet-icon">🦊</div>
          <div className="wallet-details">
            <div className="wallet-address">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </div>
            {user.role && (
              <div className="wallet-role">
                {user.role}
              </div>
            )}
          </div>
        </div>
        <button 
          onClick={handleDisconnect} 
          className="btn-wallet-disconnect"
        >
          Disconnect
        </button>
      </div>
    );
  }

  // If connected but authenticating
  if (isConnected && isAuthenticating) {
    return (
      <div className="wallet-authenticating">
        <div className="spinner"></div>
        <span>Authenticating...</span>
      </div>
    );
  }

  // Show connect button - only MetaMask
  const metaMaskConnector = connectors.find(c => c.name.toLowerCase().includes('metamask')) || connectors[0];

  return (
    <div className="wallet-login">
      {metaMaskConnector && (
        <button
          onClick={() => connect({ connector: metaMaskConnector })}
          disabled={isPending}
          className="btn-wallet-login"
        >
          <span className="wallet-icon">🦊</span>
          <span className="wallet-text">
            {isPending ? 'Connecting...' : 'Wallet'}
          </span>
        </button>
      )}
    </div>
  );
}
