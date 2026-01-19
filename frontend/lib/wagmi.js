import { http, createConfig } from 'wagmi';
import { avalancheFuji, avalanche } from 'wagmi/chains';
import { metaMask } from 'wagmi/connectors';

// Get environment variables
const infuraApiKey = process.env.NEXT_PUBLIC_INFURA_API_KEY;
const avalancheRpc = process.env.NEXT_PUBLIC_AVALANCHE_RPC || 'https://api.avax-test.network/ext/bc/C/rpc';

export const config = createConfig({
  ssr: true, // Enable for Next.js SSR
  chains: [avalancheFuji, avalanche],
  connectors: [
    metaMask({
      infuraAPIKey: infuraApiKey,
      dappMetadata: {
        name: 'AgriChain',
        url: typeof window !== 'undefined' ? window.location.origin : 'https://agrichain.com',
      },
    }),
  ],
  transports: {
    [avalancheFuji.id]: http(avalancheRpc),
    [avalanche.id]: http('https://api.avax.network/ext/bc/C/rpc'),
  },
});
