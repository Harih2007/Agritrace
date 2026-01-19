// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Escrow {
    enum EscrowState { Created, Funded, Delivered, Completed, Disputed, Cancelled, Refunded }

    struct EscrowTransaction {
        uint256 id;
        address payable buyer;
        address payable seller;
        uint256 amount;
        uint256 productId;
        EscrowState state;
        uint256 createdAt;
        uint256 completedAt;
    }

    mapping(uint256 => EscrowTransaction) public escrows;
    uint256 public escrowCount;
    address public arbiter;

    event EscrowCreated(uint256 indexed escrowId, address buyer, address seller, uint256 amount);
    event EscrowFunded(uint256 indexed escrowId);
    event EscrowDelivered(uint256 indexed escrowId);
    event EscrowCompleted(uint256 indexed escrowId);
    event EscrowDisputed(uint256 indexed escrowId);
    event EscrowCancelled(uint256 indexed escrowId);
    event EscrowRefunded(uint256 indexed escrowId);

    modifier onlyBuyer(uint256 _escrowId) {
        require(msg.sender == escrows[_escrowId].buyer, "Only buyer");
        _;
    }

    modifier onlySeller(uint256 _escrowId) {
        require(msg.sender == escrows[_escrowId].seller, "Only seller");
        _;
    }

    modifier onlyArbiter() {
        require(msg.sender == arbiter, "Only arbiter");
        _;
    }

    constructor() {
        arbiter = msg.sender;
    }

    function createEscrow(address payable _seller, uint256 _productId) public payable returns (uint256) {
        require(msg.value > 0, "Amount must be greater than 0");
        
        escrowCount++;
        
        escrows[escrowCount] = EscrowTransaction({
            id: escrowCount,
            buyer: payable(msg.sender),
            seller: _seller,
            amount: msg.value,
            productId: _productId,
            state: EscrowState.Funded,
            createdAt: block.timestamp,
            completedAt: 0
        });

        emit EscrowCreated(escrowCount, msg.sender, _seller, msg.value);
        emit EscrowFunded(escrowCount);
        
        return escrowCount;
    }

    function confirmDelivery(uint256 _escrowId) public onlyBuyer(_escrowId) {
        require(escrows[_escrowId].state == EscrowState.Funded, "Invalid state");
        
        escrows[_escrowId].state = EscrowState.Delivered;
        emit EscrowDelivered(_escrowId);
    }

    function releaseFunds(uint256 _escrowId) public onlyBuyer(_escrowId) {
        require(escrows[_escrowId].state == EscrowState.Delivered, "Not delivered");
        
        escrows[_escrowId].state = EscrowState.Completed;
        escrows[_escrowId].completedAt = block.timestamp;
        escrows[_escrowId].seller.transfer(escrows[_escrowId].amount);
        
        emit EscrowCompleted(_escrowId);
    }

    function raiseDispute(uint256 _escrowId) public {
        require(
            msg.sender == escrows[_escrowId].buyer || msg.sender == escrows[_escrowId].seller,
            "Not authorized"
        );
        require(escrows[_escrowId].state == EscrowState.Funded || escrows[_escrowId].state == EscrowState.Delivered, "Invalid state");
        
        escrows[_escrowId].state = EscrowState.Disputed;
        emit EscrowDisputed(_escrowId);
    }

    function resolveDispute(uint256 _escrowId, bool _releaseToBuyer) public onlyArbiter {
        require(escrows[_escrowId].state == EscrowState.Disputed, "Not disputed");
        
        if (_releaseToBuyer) {
            escrows[_escrowId].state = EscrowState.Refunded;
            escrows[_escrowId].buyer.transfer(escrows[_escrowId].amount);
            emit EscrowRefunded(_escrowId);
        } else {
            escrows[_escrowId].state = EscrowState.Completed;
            escrows[_escrowId].completedAt = block.timestamp;
            escrows[_escrowId].seller.transfer(escrows[_escrowId].amount);
            emit EscrowCompleted(_escrowId);
        }
    }

    function cancelEscrow(uint256 _escrowId) public onlyBuyer(_escrowId) {
        require(escrows[_escrowId].state == EscrowState.Created, "Cannot cancel");
        
        escrows[_escrowId].state = EscrowState.Cancelled;
        escrows[_escrowId].buyer.transfer(escrows[_escrowId].amount);
        
        emit EscrowCancelled(_escrowId);
        emit EscrowRefunded(_escrowId);
    }

    function getEscrow(uint256 _escrowId) public view returns (EscrowTransaction memory) {
        return escrows[_escrowId];
    }
}
