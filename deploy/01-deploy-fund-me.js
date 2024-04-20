const { getNamedAccounts, deployments, network } = require("hardhat");

const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
  //  const {getNamedAccounts, deployments} = hre;

  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  let ethUsdPriceFeedAddress;

  if (developmentChains.includes(network.name)) {
    const ethUSDAggregator = await deployments.get("MockV3Aggregator");
    ethUsdPriceFeedAddress = ethUSDAggregator.address;
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeedAddress"];
  }

  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: [ethUsdPriceFeedAddress],
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    // await contract.deploymentTransaction().wait(6);  or we can add  blockConfirmations in config
    await verify(fundMe.address, [ethUsdPriceFeedAddress]);
  }
};

module.exports.tags = ["all", "fundMe"];
