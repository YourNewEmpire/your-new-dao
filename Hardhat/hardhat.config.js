require("dotenv").config();
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-ganache");
const privateKey1 = process.env.MNEMONIC;
const privateKey2 = process.env.MNEMONIC_2;
const nodeUrl = process.env.MATIC_NODE;
const polygonScan = process.env.POLYGONSCAN;

module.exports = {
  solidity: {
    version: "0.8.0",
    optimizer: {
      enabled: false,
      runs: 200,
    },
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545/",
    },
    polygon: {
      chainId: 137,
      url: `https://rpc-mainnet.maticvigil.com/v1/${nodeUrl}`,
      accounts: [privateKey1],
    },
    mumbai: {
      chainId: 80001,
      url: `https://rpc-mumbai.maticvigil.com/v1/${nodeUrl}`,
      accounts: [privateKey1],
    },
  },
  //* Keep name as 'etherscan' to avoid errors.
  etherscan: {
    apiKey: {
      polygon: polygonScan,
    },
  },
};
