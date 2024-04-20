const { network, ethers, deployments, getNamedAccounts } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");
const { assert } = require("chai");
let bool_1 = developmentChains.includes(network.name);
bool_1
  ? describe.skip
  : describe("FundMe", function () {
      let fundMeDeployment, fundMe, deployer;
      const sendValue = ethers.parseEther("0.1");

      beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer;
        fundMeDeployment = await deployments.get("FundMe");
        fundMe = await ethers.getContractAt("FundMe", fundMeDeployment.address);
      });

      it("testing funds getting added", async () => {
        await fundMe.fund({ value: sendValue });

        const response = await fundMe.s_addressToAmountFunded(deployer);

        assert.equal(response.toString(), sendValue.toString());
      });
    });
