const SupplyChain = artifacts.require("SupplyChain");
const ProductRegistry = artifacts.require("ProductRegistry");
const Escrow = artifacts.require("Escrow");

module.exports = function (deployer) {
  deployer.deploy(SupplyChain);
  deployer.deploy(ProductRegistry);
  deployer.deploy(Escrow);
};
