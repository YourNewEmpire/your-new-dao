// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "./MetaTx/ContextMixin.sol";
import "./MetaTx/NativeMetaTransaction.sol";

contract DAO is ERC1155, ContextMixin, NativeMetaTransaction {
    event contractSaleEvent(address newOwner);
    //Contract Sale Price
    address public constant originalSeller =
        0x5f4c3843495Babe89cB3516cEbD8840024e741fa;
    uint256 public constant salePrice = 0.1 ether;
    bool public contractSold;

    modifier onlySeller() {
        require(
            msg.sender == originalSeller,
            "You are not the original seller"
        );
        _;
    }

    string public ownerContractName;
    string public ownerName;
    // Token ID state for owners to set
    mapping(string => uint256) public tokenIdMapping;
    uint256[] public tokenIdArray;
    // Mapping for DAO owner address'.
    mapping(address => bool) public isOwner;
    // Array of DAO owners.
    address[] public owners;
    // Take index of Proposal and address of voter to find if they have voted.
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    // Proposals to vote on.
    Proposal[] public proposals;

    modifier onlyOwners() {
        require(
            isOwner[msg.sender] = true,
            "You need to have ownership for this."
        );
        _;
    }

    // Typing for the Proposal object
    struct Proposal {
        bytes32 name; // short name (up to 32 bytes),
        uint256 voteCount; // number of accumulated votes, should use counter util in future
    }

    constructor() ERC1155("") {
        //Set contract status as unsold
        contractSold = false;
    }

    // Ownership

    function buyOwnership(string memory newOwnerName, string memory newDaoName)
        public
        payable
    {
        require(msg.value >= salePrice, "Not enough pay, Chad.");
        require(contractSold == false, "SOLD. Find another DAO to purchase.");
        // Ensure my ownership is false
        isOwner[originalSeller] = false;
        isOwner[msg.sender] = true;
        owners.push(msg.sender);
        // Mark as sold
        contractSold = true;

        ownerName = newOwnerName;
        ownerContractName = newDaoName;
        emit contractSaleEvent(msg.sender);
        // initial mint of semi-fungible COINS
    }

    function addOwners(address[] memory newOwners) public onlyOwners {
        for (uint256 i = 0; i < newOwners.length; i++) {
            address daoOwner = newOwners[i];
            require(
                daoOwner != address(0),
                "invalid owner. cannot be zero address"
            );
            require(!isOwner[daoOwner], "owner not unique");
            isOwner[daoOwner] = true;
            owners.push(daoOwner);
        }
    }

    //Voting

    //Only Owners of the DAO can launch new proposals.
    function newProposal(bytes32 newName) public onlyOwners {
        proposals.push(Proposal({name: newName, voteCount: 0}));
    }

    /**
    This needs to be reworked in future so that only NFT owners can vote
     For simplicity, only token id: 0 holders can vote. 
     By OpenZeppelins example, the 0 token can act as a semi-fungible COINS for now
     */
    function newVote(uint256 index) public {
        require(
            balanceOf(msg.sender, 0) > 0,
            "You need ownership of NFTs or Coins for this."
        );
        require(
            hasVoted[index][msg.sender] != true,
            "You already voted on this proposal"
        );
        // In future, check that I or the NFT artist cannot vote.
        proposals[index].voteCount++;
        hasVoted[index][msg.sender] = true;
    }

    // NFTs

    // Set new URI for clients like OpenSea to read metadata: https://eips.ethereum.org/EIPS/eip-1155#metadata
    function setBaseURI(string memory newURI) public onlyOwners {
        _setURI(newURI);
    }

    // This will add the first token as id 0.
    function addNewTokenIDs(string[] memory newTokens) public onlyOwners {
        require(newTokens.length >= 1, "No arguments were passed in.");
        for (uint256 i = 0; i < newTokens.length; i++) {
            tokenIdMapping[newTokens[i]] = i;
            tokenIdArray.push(i);
        }
    }

    function withdraw() public payable onlySeller {
        uint256 balance = address(this).balance;
        require(balance > 0, "No ether left to withdraw");
        (bool success, ) = (msg.sender).call{value: balance}("");
        require(success, "Transfer failed.");
    }
}
