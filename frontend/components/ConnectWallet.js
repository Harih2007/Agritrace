'use client';

import { useAccount, useConnect, useDisconnect, useBalance, useChainId } from 'wagmi';
import { avalancheFuji } from 'wagmi/chains';

export function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { data: balance } = useBalance({
    address: address,
  });

  const isCorrectNetwork = chainId === avalancheFuji.id;

  if (isConnected && address) {
    return (
      <div className="wallet-connected">
        <div className="wallet-info">
          <div className="wallet-address">
            {address.slice(0, 6)}...{address.slice(-4)}
          </div>
          {balance && (
            <div className="wallet-balance">
              {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
            </div>
          )}
          {!isCorrectNetwork && (
            <div className="network-warning">
              ⚠️ Please switch to Avalanche Fuji Testnet
            </div>
          )}
        </div>
        <button 
          onClick={() => disconnect()} 
          className="btn-disconnect"
        >
          Disconnect
        </button>
      </div>
    );
  }

  // Filter to only show MetaMask connector
  const metaMaskConnector = connectors.find(c => c.name.toLowerCase().includes('metamask')) || connectors[0];

  return (
    <div className="wallet-connect">
      {metaMaskConnector && (
        <button
          onClick={() => connect({ connector: metaMaskConnector })}
          disabled={isPending}
          className="btn-connect"
        >
          {isPending ? 'Connecting...' : 'Connect MetaMask'}
        </button>
      )}
    </div>
  );
}
