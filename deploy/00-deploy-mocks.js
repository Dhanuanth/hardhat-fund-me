const { network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const chainId = network.config.chainId;

  if (developmentChains.includes(network.name)) {
    console.log("Local deploymennt Happening");
    await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      log: true,
      args: [8, 200000000000], ///Decimals , Initial_answer
    });

    log("Mocks deployed------------------");
  }
};

module.exports.tags = ["all", "mocks"];
