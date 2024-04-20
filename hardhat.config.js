require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */

const SEPOLIUM_RPC_URL = process.env.SEPOLIA_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const COINMARKETCAP_KEY = process.env.COINMARKETCAP_KEY;
module.exports = {
  solidity: {
    compilers: [{ version: "0.8.8" }, { version: "0.6.6" }],
  },
  networks: {
    hardhat: {
      chainId: 31337,
      // gasPrice: 130000000000,
    },
    sepolium: {
      url: SEPOLIUM_RPC_URL, //tells which node operator we are using (here-> alchemy )
      accounts: [PRIVATE_KEY], ///tells which account wallet are we using to do this transaction (sepolia wallet from metamask)
      chainId: 11155111, ///tells that we are using seploia network
      blockConfirmations: 6,
    },
    localhost: {
      url: "http://127.0.0.1:8545/", //hardhat provides the node
      chainId: 31337, // provides the network also
      // account wallet hardhat provides by default
    },
  },
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
      1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  gasReporter: {
    enable: true,
    outputFile: "gas-report.txt",
    currency: "USD",
    coinmarketcap: COINMARKETCAP_KEY,
  },
};
