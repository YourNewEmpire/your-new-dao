const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DAO Contract", function () {
  //? Set factory, provider, signers and names before buying with second hh address (buyer).
  beforeEach(async function () {
    Dao = await ethers.getContractFactory("DAO");
    provider = ethers.provider;
    [seller, buyer, daoOwner2, daoOwner3] = await ethers.getSigners();
    txOptions = { value: ethers.utils.parseEther("1.0") };
    buyerName = "Arch";
    daoName = buyerName + "Dao";
    baseURI = "https://base.uri/{id}.json";
    newTokenIDs = ["COINS", "HELMET", "SWORD"];
    deployedDao = await Dao.deploy("InitialName");
    daoPurchase = await deployedDao
      .connect(buyer)
      .buyOwnership(buyerName, daoName, txOptions);
    await daoPurchase.wait();
  });
  describe("Deployment + DAO Purchase", function () {
    it("Should purchase ownership and set names correctly", async function () {
      expect(await deployedDao.isOwner(buyer.address)).to.equal(true);
      expect(await deployedDao.name()).to.equal(daoName);
      expect(await deployedDao.ownerName()).to.equal(buyerName);
    });
  });
  describe("NFT Management", function () {
    it("Should set new token IDs", async function () {
      const addNewTokens = await deployedDao
        .connect(buyer)
        .addNewTokenIDs(newTokenIDs);
      await addNewTokens.wait();
      expect(await deployedDao.tokenStringArray(0)).to.equal(newTokenIDs[0]);
      expect(await deployedDao.tokenIdArray(1)).to.equal(1);
      expect(await deployedDao.tokenIdMapping(newTokenIDs[0])).to.equal(0);
      expect(await deployedDao.tokenIdMapping(newTokenIDs[1])).to.equal(1);
    });
    it("Should set new base URI", async function () {
      const setBaseURI = await deployedDao.connect(buyer).setBaseURI(baseURI);
      await setBaseURI.wait();
      expect(await deployedDao.uri(0)).to.equal(baseURI);
    });

    //todo - test base uri
  });

  describe("Owner Management", function () {
    it("Should set new owners", async function () {
      const addedOwners = await deployedDao
        .connect(buyer)
        .addOwners([daoOwner2.address, daoOwner3.address]);
      await addedOwners.wait();
      expect(await deployedDao.owners(1)).to.equal(daoOwner2.address);
    });
  });

  //? Check balance is 1 before withdrawal, then withdraw and ensure balance is 0
  describe("Seller Withdrawal and Contract + Account Balances ", function () {
    it("Should have 1 ether balance", async function () {
      expect(await deployedDao.contractBalance()).to.equal(txOptions.value);
    });
    it("Should withdraw balance", async function () {
      const withdrawnEther = await deployedDao.connect(seller).withdraw();
      await withdrawnEther.wait();
      expect(await deployedDao.contractBalance()).to.equal(
        txOptions.value - txOptions.value
      );
    });
    it("Should change balances of seller and buyer", async function () {
      const balance = async (addr) => {
        const addrBalance = await provider.getBalance(addr);
        return parseFloat(ethers.utils.formatEther(addrBalance));
      };
      expect(await balance(seller.address)).to.greaterThan(10000);
      expect(await balance(buyer.address)).to.lessThan(10000);
    });
  });
});
