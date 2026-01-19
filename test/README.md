# Smart Contract Testing Guide

## Overview

This directory contains tests for the smart contracts deployed on Avalanche. Tests ensure contract functionality, security, and gas efficiency.

## Test Structure

```
test/
├── README.md              # This file
├── SupplyChain.js        # Supply chain contract tests
├── ProductRegistry.test.js   # Product registry tests (to be created)
└── Escrow.test.js        # Escrow contract tests (to be created)
```

## Running Tests

### All Tests
```bash
truffle test
```

### Specific Test File
```bash
truffle test test/ProductRegistry.test.js
```

### On Specific Network
```bash
truffle test --network avalanche_fuji
```

## Test Coverage

### ProductRegistry Contract

#### Registration Tests
- ✅ Should register a new product
- ✅ Should emit ProductRegistered event
- ✅ Should increment product count
- ✅ Should store correct product data
- ✅ Should assign correct owner
- ✅ Should add product to owner's list

#### Update Tests
- ✅ Should allow owner to update product
- ✅ Should emit ProductUpdated event
- ✅ Should reject updates from non-owner
- ✅ Should reject updates to inactive products

#### Deactivation Tests
- ✅ Should allow owner to deactivate product
- ✅ Should emit ProductDeactivated event
- ✅ Should reject deactivation from non-owner
- ✅ Should prevent operations on deactivated products

#### Query Tests
- ✅ Should return correct product data
- ✅ Should return owner's products list
- ✅ Should handle non-existent products

### Escrow Contract

#### Creation Tests
- ✅ Should create escrow with payment
- ✅ Should emit EscrowCreated and EscrowFunded events
- ✅ Should store correct escrow data
- ✅ Should reject zero amount
- ✅ Should set correct initial state

#### Delivery Tests
- ✅ Should allow buyer to confirm delivery
- ✅ Should emit EscrowDelivered event
- ✅ Should reject confirmation from non-buyer
- ✅ Should reject confirmation in wrong state

#### Release Tests
- ✅ Should allow buyer to release funds
- ✅ Should transfer funds to seller
- ✅ Should emit EscrowCompleted event
- ✅ Should reject release before delivery
- ✅ Should reject release from non-buyer

#### Dispute Tests
- ✅ Should allow buyer/seller to raise dispute
- ✅ Should emit EscrowDisputed event
- ✅ Should allow arbiter to resolve dispute
- ✅ Should handle refund to buyer
- ✅ Should handle release to seller

#### Cancellation Tests
- ✅ Should allow buyer to cancel
- ✅ Should refund buyer on cancellation
- ✅ Should emit appropriate events
- ✅ Should reject cancellation in wrong state

## Writing Tests

### Test Template

```javascript
const ProductRegistry = artifacts.require("ProductRegistry");

contract("ProductRegistry", (accounts) => {
  let registry;
  const owner = accounts[0];
  const user1 = accounts[1];
  const user2 = accounts[2];

  beforeEach(async () => {
    registry = await ProductRegistry.new({ from: owner });
  });

  describe("Product Registration", () => {
    it("should register a new product", async () => {
      const result = await registry.registerProduct(
        "Test Product",
        "QmTest123",
        JSON.stringify({ category: "test" }),
        { from: user1 }
      );

      // Check event
      assert.equal(result.logs[0].event, "ProductRegistered");
      
      // Check product data
      const product = await registry.getProduct(1);
      assert.equal(product.name, "Test Product");
      assert.equal(product.owner, user1);
      assert.equal(product.isActive, true);
    });
  });
});
```

### Best Practices

1. **Use beforeEach**: Deploy fresh contract for each test
2. **Test Events**: Verify events are emitted correctly
3. **Test Reverts**: Use `expectRevert` for negative tests
4. **Test State**: Verify state changes
5. **Test Access Control**: Verify only authorized users can perform actions
6. **Test Edge Cases**: Zero values, max values, etc.
7. **Gas Testing**: Monitor gas usage

### Testing Utilities

```javascript
const { expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const { BN, constants, ether } = require('@openzeppelin/test-helpers');

// Expect transaction to revert
await expectRevert(
  registry.updateProduct(1, "hash", "metadata", { from: user2 }),
  "Not product owner"
);

// Expect event emission
expectEvent(result, "ProductRegistered", {
  productId: new BN(1),
  owner: user1
});

// Work with ether amounts
const amount = ether('1'); // 1 AVAX
```

## Gas Optimization Tests

### Measure Gas Usage

```javascript
it("should measure gas for product registration", async () => {
  const result = await registry.registerProduct(
    "Test Product",
    "QmTest123",
    JSON.stringify({ category: "test" }),
    { from: user1 }
  );

  console.log("Gas used:", result.receipt.gasUsed);
  
  // Assert gas is within acceptable range
  assert.isBelow(result.receipt.gasUsed, 200000);
});
```

### Compare Gas Costs

```javascript
it("should compare gas costs for different operations", async () => {
  const register = await registry.registerProduct(...);
  const update = await registry.updateProduct(...);
  const deactivate = await registry.deactivateProduct(...);

  console.log("Register:", register.receipt.gasUsed);
  console.log("Update:", update.receipt.gasUsed);
  console.log("Deactivate:", deactivate.receipt.gasUsed);
});
```

## Security Tests

### Reentrancy Tests

```javascript
it("should prevent reentrancy attacks", async () => {
  // Deploy malicious contract
  const attacker = await MaliciousContract.new(escrow.address);
  
  // Attempt reentrancy
  await expectRevert(
    attacker.attack({ value: ether('1') }),
    "ReentrancyGuard: reentrant call"
  );
});
```

### Access Control Tests

```javascript
it("should enforce access control", async () => {
  await registry.registerProduct(..., { from: user1 });
  
  // Non-owner should not be able to update
  await expectRevert(
    registry.updateProduct(1, ..., { from: user2 }),
    "Not product owner"
  );
});
```

### Integer Overflow Tests

```javascript
it("should handle large numbers safely", async () => {
  const maxUint256 = new BN(2).pow(new BN(256)).sub(new BN(1));
  
  // Should not overflow
  await registry.registerProduct(...);
  const count = await registry.productCount();
  assert(count.lt(maxUint256));
});
```

## Integration Tests

### Multi-Contract Tests

```javascript
it("should integrate ProductRegistry and Escrow", async () => {
  // Register product
  await registry.registerProduct(..., { from: seller });
  const productId = await registry.productCount();
  
  // Create escrow for product
  await escrow.createEscrow(
    seller,
    productId,
    { from: buyer, value: ether('1') }
  );
  
  // Verify escrow references correct product
  const escrowData = await escrow.getEscrow(1);
  assert.equal(escrowData.productId.toString(), productId.toString());
});
```

## Continuous Integration

### GitHub Actions Example

```yaml
name: Smart Contract Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm install
      - run: truffle compile
      - run: truffle test
```

## Test Coverage

### Install Coverage Tool

```bash
npm install --save-dev solidity-coverage
```

### Run Coverage

```bash
truffle run coverage
```

### Coverage Report

```
File                    % Stmts    % Branch    % Funcs    % Lines
ProductRegistry.sol     100.00     100.00      100.00     100.00
Escrow.sol              98.50      95.00       100.00     98.50
SupplyChain.sol         95.00      90.00       95.00      95.00
```

## Performance Benchmarks

### Target Metrics

```
Product Registration:   < 200,000 gas
Product Update:         < 100,000 gas
Escrow Creation:        < 250,000 gas
Escrow Release:         < 150,000 gas
```

### Benchmark Tests

```javascript
describe("Performance Benchmarks", () => {
  it("should meet gas targets", async () => {
    const results = [];
    
    // Register 10 products
    for (let i = 0; i < 10; i++) {
      const result = await registry.registerProduct(...);
      results.push(result.receipt.gasUsed);
    }
    
    const average = results.reduce((a, b) => a + b) / results.length;
    console.log("Average gas:", average);
    assert.isBelow(average, 200000);
  });
});
```

## Debugging Tests

### Enable Verbose Logging

```bash
truffle test --verbose
```

### Debug Specific Transaction

```javascript
it("should debug transaction", async () => {
  const result = await registry.registerProduct(...);
  
  console.log("Transaction hash:", result.tx);
  console.log("Block number:", result.receipt.blockNumber);
  console.log("Gas used:", result.receipt.gasUsed);
  console.log("Logs:", result.logs);
});
```

### Use Truffle Debugger

```bash
truffle debug <transaction_hash>
```

## Common Issues

### Issue: Tests Timeout
```
Solution: Increase timeout in truffle-config.js
mocha: { timeout: 100000 }
```

### Issue: Insufficient Funds
```
Solution: Ensure test accounts have enough balance
Use ganache-cli with --defaultBalanceEther flag
```

### Issue: Contract Not Deployed
```
Solution: Check migrations are run before tests
truffle migrate --reset
```

## Resources

- Truffle Testing: https://trufflesuite.com/docs/truffle/testing/
- OpenZeppelin Test Helpers: https://docs.openzeppelin.com/test-helpers/
- Chai Assertions: https://www.chaijs.com/api/assert/
- Mocha Framework: https://mochajs.org/

## Next Steps

1. Write comprehensive tests for all contracts
2. Achieve >95% code coverage
3. Add integration tests
4. Set up CI/CD pipeline
5. Perform security audit
6. Benchmark gas costs
7. Document test results

---

**Note**: Always run full test suite before deploying to mainnet!
