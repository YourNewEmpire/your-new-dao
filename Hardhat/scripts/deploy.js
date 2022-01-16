const hre = require("hardhat");
// const { utils, Signer, Transaction } = require("ethers");
async function main() {
  //const [seller, buyer ] = await hre.ethers.getSigners();

  const Dao = await hre.ethers.getContractFactory("DAO");
  const dao = await Dao.deploy("InitialName");

  //! I was planning on adding contract to CMS to automate the process of displaying new DAOs on the frontend
  //! The problem is, Hardhat dao.address doesn't return the actual address of the contract.

  await dao.deployed();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
