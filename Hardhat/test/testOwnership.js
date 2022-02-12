const { expect } = require("chai");
const { ethers } = require("hardhat");

beforeEach(async function () {
  // Get the ContractFactory and Signers here.
  Dao = await ethers.getContractFactory("DAOV3");
  [seller, buyer, thirdWheel] = await ethers.getSigners();
  deployedDao = await Dao.deploy("InitialName");
});

describe("Deployment + DAO Purchase", function () {
  it("Should purchase ownership", async function () {
    const [seller, buyer, thirdWheel] = await ethers.getSigners();
    const txOptions = { value: ethers.utils.parseEther("1.0") };
    const buyerName = "Arch";
    const daoName = buyerName + "Dao";
    const tx = await deployedDao
      .connect(buyer)
      .buyOwnership(buyerName, daoName, txOptions);
    await tx.wait();
    expect(await deployedDao.isOwner(buyer.address)).to.equal(true);
    expect(await deployedDao.name()).to.equal(daoName);
    expect(await deployedDao.ownerName()).to.equal(buyerName);
  });
});
