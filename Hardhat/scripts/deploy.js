const hre = require("hardhat");
const { utils, Signer, Transaction } = require("ethers");
async function main() {
  //const [seller, buyer ] = await hre.ethers.getSigners();

  const Dao = await hre.ethers.getContractFactory("DAO");
  const dao = await Dao.deploy();

  await dao.deployed();
  //await dao.connect(buyer).buyOwnership()
  console.log("Greeter deployed to:", dao.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });