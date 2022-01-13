const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    const [seller, buyer] = await ethers.getSigners();

    //
    const Dao = await ethers.getContractFactory("DAO");
    const dao = Dao.attach("0xd16bCBbd6fcA80201444d4dA2b6e4A272E5c8376");
    const tx = await dao.connect(buyer).buyOwnership();
    await tx.wait();
    expect(await dao.isOwner(buyer)).to.equal(true);

  });
});
