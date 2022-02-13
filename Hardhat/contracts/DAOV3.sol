// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "./MetaTx/ContextMixin.sol";
import "./MetaTx/NativeMetaTransaction.sol";

contract DAOV3 is ERC1155, ContextMixin, NativeMetaTransaction {
    event contractSaleEvent(address newOwner);
    //todo - Add missing events for other methods

    //Contract Sale Price
    address public originalSeller;
    uint256 public constant salePrice = 1 ether;
    bool public contractSold;

    modifier onlySeller() {
        require(
            msg.sender == originalSeller,
            "You are not the original seller"
        );
        _;
    }
    // Contract name and ownerName (human string ie. "John Doe" )
    string public name;
    string public ownerName;
    // Token ID state for owners to set
    mapping(string => uint256) public tokenIdMapping;
    uint256[] public tokenIdArray;
    string[] public tokenStringArray;
    // Mapping for DAO owner address'.
    mapping(address => bool) public isOwner;
    // Array of DAO owners.
    address[] public owners;
    // Take index of Proposal and address of voter to find if they have voted.
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    // Take index of proposal and address and return weight

    // Proposals to vote on.
    Proposal[] public proposals;

    modifier onlyOwners() {
        require(
            isOwner[msg.sender] == true,
            "You need to have ownership for this."
        );
        _;
    }
    // Typing for the Proposal object
    struct Proposal {
        bytes32 name; // short name (up to 32 bytes),
        uint256 upVotes; // number of accumulated votes, should use counter util in future
        uint256 downVotes;
    }

    // Initialise EIP712
    constructor(string memory name_) ERC1155("") {
        //Set contract status as unsold
        contractSold = false;
        originalSeller = msg.sender;
        name = name_;
        _initializeEIP712(name_);
    }

    // Ownership
    function buyOwnership(string memory newOwnerName, string memory newDaoName)
        public
        payable
    {
        require(contractSold == false, "SOLD. Find another DAO to purchase.");
        require(msg.value >= salePrice, "Not enough pay, Chad.");
        isOwner[msg.sender] = true;
        owners.push(msg.sender);
        // Mark as sold
        contractSold = true;
        ownerName = newOwnerName;
        name = newDaoName;
        emit contractSaleEvent(msg.sender);
        // initial mint of semi-fungible COINS could happen in purchase
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

    // VOTING

    //Only Owners of the DAO can launch new proposals.
    function newProposal(bytes32 newName) public onlyOwners {
        proposals.push(Proposal({name: newName, upVotes: 0, downVotes: 0}));
    }

    /**
    This needs to be reworked so the us
     For simplicity, only token id: 0 holders can vote. 
     By OpenZeppelins example, the 0 token can act as a semi-fungible COINS for now
     */
    function voteUp(uint256 index) public {
        require(
            _isNFTOwner(msg.sender),
            "You need ownership of NFTs or Coins for this."
        );
        require(
            hasVoted[index][msg.sender] != true,
            "You already voted on this proposal"
        );
        // In future, check that I or the NFT artist cannot vote.
        proposals[index].upVotes++;
        hasVoted[index][msg.sender] = true;
    }

    function voteDown(uint256 index) public {
        require(
            _isNFTOwner(msg.sender),
            "You need ownership of NFTs or Coins for this."
        );
        require(
            hasVoted[index][msg.sender] != true,
            "You already voted on this proposal"
        );
        // In future, check that I or the NFT artist cannot vote.
        proposals[index].downVotes++;
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
            tokenStringArray.push(newTokens[i]);
        }
    }

    //Balance of batch but with 1 user. Check if user has any token
    function _isNFTOwner(address nftOwner) public view returns (bool) {
        require(
            nftOwner != address(0),
            "ERC1155: balance query for the zero address"
        );
        bool ownerOfOne = false;
        for (uint256 i = 0; i < tokenIdArray.length; i++) {
            uint256 owned = balanceOf(nftOwner, tokenIdArray[i]);
            if (owned != 0) {
                ownerOfOne = true;
            }
            // Call balanceOf for each i.
            // todo - just gotta realise minting real quick
        }
        if (ownerOfOne) return true;
        else return false;
    }

    function ownerMint(
        address to,
        string memory tokenString,
        uint256 amount
    ) public onlyOwners {
        require(amount != 0, "Failed to mint. No amount was passed in.");
        _mint(to, tokenIdMapping[tokenString], amount, "");
    }

    //todo - in future, define a batch mint abstraction too.

    // OPENSEA POLYGON (MAINNET) META TRANSACTIONS

    /**
     * This is used instead of msg.sender as transactions won't be sent by the original token owner, but by OpenSea.
     */
    function _msgSender() internal view override returns (address sender) {
        return ContextMixin.msgSender();
    }

    /**
     * As another option for supporting trading without requiring meta transactions, override isApprovedForAll to whitelist OpenSea proxy accounts on Matic
     */
    function isApprovedForAll(address _owner, address _operator)
        public
        view
        override
        returns (bool isOperator)
    {
        if (_operator == address(0x207Fa8Df3a17D96Ca7EA4f2893fcdCb78a304101)) {
            return true;
        }

        return ERC1155.isApprovedForAll(_owner, _operator);
    }

    // Original Seller (the deployer) can withdraw the contracts balance
    function withdraw() public payable onlySeller {
        uint256 balance = address(this).balance;
        require(balance > 0, "No ether left to withdraw");
        (bool success, ) = (msg.sender).call{value: balance}("");
        require(success, "Transfer failed.");
    }

    function contractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
