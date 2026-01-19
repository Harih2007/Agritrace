# Contract ABIs

After compiling and deploying your smart contracts, copy the ABI JSON files here:

1. Compile contracts:
```bash
truffle compile
```

2. Copy ABIs from `build/contracts/` to this directory:
- `ProductRegistry.json`
- `Escrow.json`
- `SupplyChain.json`

The backend will load these ABIs to interact with the deployed contracts.

## Example structure:

```json
{
  "contractName": "ProductRegistry",
  "abi": [
    {
      "inputs": [],
      "name": "productCount",
      "outputs": [{"type": "uint256"}],
      "stateMutability": "view",
      "type": "function"
    }
  ]
}
```

Note: You only need the ABI array, but the full build artifact works too.
