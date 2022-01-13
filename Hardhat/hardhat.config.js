require("dotenv").config();
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-ganache");
const privateKey1 = process.env.MNEMONIC
const privateKey2 = process.env.MNEMONIC_2
const maticUrl = process.env.MATIC_APP_ID
const polygonScan = process.env.POLYGONSCAN
module.exports = {
  solidity: "0.8.0",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545/",
    },
    matic: {
      chainId: 137,
      url: `https://speedy-nodes-nyc.moralis.io/${maticUrl}/polygon/matic`,
      accounts: [privateKey1, privateKey2]
    },
    mumbai: {
      chainId: 80001,
      url: `https://speedy-nodes-nyc.moralis.io/${maticUrl}/polygon/mumbai`,
      accounts: [privateKey1, privateKey2]
    }
  },
  //* Keep name as 'etherscan' to avoid errors.
  etherscan: {
    url: 'https://polygonscan.com/',
    apiKey: polygonScan
  }
};
