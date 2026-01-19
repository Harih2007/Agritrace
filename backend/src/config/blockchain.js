const { ethers } = require('ethers');
const logger = require('../utils/logger');

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

// Initialize provider with retry logic
const createProvider = () => {
  const rpcUrl = process.env.AVALANCHE_RPC_URL || 'https://api.avax-test.network/ext/bc/C/rpc';
  
  const provider = new ethers.JsonRpcProvider(rpcUrl, {
    name: 'avalanche',
    chainId: rpcUrl.includes('test') ? 43113 : 43114
  });

  // Add connection monitoring
  provider.on('error', (error) => {
    logger.error('Provider error:', error);
  });

  return provider;
};

const provider = createProvider();

// Initialize wallet (optional - only needed for blockchain writes)
let wallet = null;
try {
  const privateKey = process.env.PRIVATE_KEY;
  
  // Only initialize wallet if private key is properly set
  if (privateKey && privateKey !== 'your_private_key' && privateKey.length === 66) {
    wallet = new ethers.Wallet(privateKey, provider);
    logger.info(`Wallet initialized: ${wallet.address}`);
  } else {
    logger.warn('Wallet not initialized - PRIVATE_KEY not configured (read-only mode)');
    logger.warn('Blockchain write operations will not be available');
  }
} catch (error) {
  logger.error('Failed to initialize wallet:', error);
  logger.warn('Continuing in read-only mode');
  wallet = null;
}

// Load contract ABIs
const loadContractABI = (name) => {
  try {
    const contractData = require(`../../abis/${name}.json`);
    return contractData.abi || contractData;
  } catch (error) {
    logger.warn(`ABI for ${name} not found. Run deployment script first.`);
    return [];
  }
};

const ProductRegistryABI = loadContractABI('ProductRegistry');
const EscrowABI = loadContractABI('Escrow');
const SupplyChainABI = loadContractABI('SupplyChain');

// Initialize contracts with error handling
const createContract = (address, abi, name) => {
  if (!address || address === 'deployed_contract_address') {
    logger.warn(`${name} address not configured. Set ${name.toUpperCase()}_ADDRESS in .env`);
    return null;
  }
  
  if (!wallet) {
    logger.warn(`${name} contract initialized in read-only mode (no wallet)`);
    // Return read-only contract connected to provider
    try {
      return new ethers.Contract(address, abi, provider);
    } catch (error) {
      logger.error(`Failed to initialize ${name} contract:`, error);
      return null;
    }
  }
  
  try {
    return new ethers.Contract(address, abi, wallet);
  } catch (error) {
    logger.error(`Failed to initialize ${name} contract:`, error);
    return null;
  }
};

const productRegistryContract = createContract(
  process.env.PRODUCT_REGISTRY_ADDRESS,
  ProductRegistryABI,
  'ProductRegistry'
);

const escrowContract = createContract(
  process.env.ESCROW_CONTRACT_ADDRESS,
  EscrowABI,
  'Escrow'
);

const supplyChainContract = createContract(
  process.env.SUPPLY_CHAIN_ADDRESS,
  SupplyChainABI,
  'SupplyChain'
);

// Utility function for transaction with retry
const executeTransaction = async (txFunction, retries = MAX_RETRIES) => {
  for (let i = 0; i < retries; i++) {
    try {
      const tx = await txFunction();
      logger.info(`Transaction sent: ${tx.hash}`);
      
      const receipt = await tx.wait();
      logger.info(`Transaction confirmed: ${receipt.hash} (Block: ${receipt.blockNumber})`);
      
      return receipt;
    } catch (error) {
      logger.error(`Transaction attempt ${i + 1} failed:`, error.message);
      
      if (i === retries - 1) throw error;
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (i + 1)));
    }
  }
};

// Gas estimation helper
const estimateGasWithBuffer = async (contract, method, args, buffer = 1.2) => {
  try {
    const estimated = await contract[method].estimateGas(...args);
    return Math.floor(Number(estimated) * buffer);
  } catch (error) {
    logger.warn('Gas estimation failed, using default:', error.message);
    return 500000; // Default gas limit
  }
};

// Network status check
const checkNetworkStatus = async () => {
  try {
    const network = await provider.getNetwork();
    const blockNumber = await provider.getBlockNumber();
    const gasPrice = await provider.getFeeData();
    
    logger.info('Network status:', {
      chainId: network.chainId,
      name: network.name,
      blockNumber,
      gasPrice: ethers.formatUnits(gasPrice.gasPrice || 0, 'gwei') + ' gwei'
    });
    
    return true;
  } catch (error) {
    logger.error('Network check failed:', error);
    return false;
  }
};

module.exports = {
  provider,
  wallet,
  productRegistryContract,
  escrowContract,
  supplyChainContract,
  executeTransaction,
  estimateGasWithBuffer,
  checkNetworkStatus
};
