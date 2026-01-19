// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ownership/Ownable.sol";

contract ProductRegistry is Ownable {
    struct Product {
        uint256 id;
        string name;
        string ipfsHash;
        address owner;
        uint256 timestamp;
        bool isActive;
        string metadata;
    }

    mapping(uint256 => Product) public products;
    mapping(address => uint256[]) public ownerProducts;
    uint256 public productCount;

    event ProductRegistered(uint256 indexed productId, address indexed owner, string ipfsHash);
    event ProductUpdated(uint256 indexed productId, string ipfsHash);
    event ProductDeactivated(uint256 indexed productId);

    function registerProduct(
        string memory _name,
        string memory _ipfsHash,
        string memory _metadata
    ) public returns (uint256) {
        productCount++;
        
        products[productCount] = Product({
            id: productCount,
            name: _name,
            ipfsHash: _ipfsHash,
            owner: _msgSender(),
            timestamp: block.timestamp,
            isActive: true,
            metadata: _metadata
        });

        ownerProducts[_msgSender()].push(productCount);
        
        emit ProductRegistered(productCount, _msgSender(), _ipfsHash);
        return productCount;
    }

    function updateProduct(uint256 _productId, string memory _ipfsHash, string memory _metadata) public {
        require(products[_productId].owner == _msgSender(), "Not product owner");
        require(products[_productId].isActive, "Product not active");
        
        products[_productId].ipfsHash = _ipfsHash;
        products[_productId].metadata = _metadata;
        
        emit ProductUpdated(_productId, _ipfsHash);
    }

    function deactivateProduct(uint256 _productId) public {
        require(products[_productId].owner == _msgSender(), "Not product owner");
        products[_productId].isActive = false;
        emit ProductDeactivated(_productId);
    }

    function getProduct(uint256 _productId) public view returns (Product memory) {
        return products[_productId];
    }

    function getOwnerProducts(address _owner) public view returns (uint256[] memory) {
        return ownerProducts[_owner];
    }
}
