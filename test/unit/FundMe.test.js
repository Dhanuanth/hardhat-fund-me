const { assert, expect } = require("chai");
const { deployments, ethers, getNamedAccounts } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");
let bool_1 = developmentChains.includes(network.name);
!bool_1
  ? describe.skip
  : describe("FundMe", async function () {
      let fundMe,
        mockV3Aggregator,
        deployer,
        fundMeDeployment,
        mockV3AggregatorDeployment;
      const ETH_VALUE = ethers.parseEther("10");
      beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer; //deployer has the address
        await deployments.fixture(["all"]); //all the files which has  the tag we mentioned in the deploy script will get delpyed

        fundMeDeployment = await deployments.get("FundMe");

        fundMe = await ethers.getContractAt("FundMe", fundMeDeployment.address); //we need to pass the contractName or ABI and address of the deployed contract

        mockV3AggregatorDeployment = await deployments.get("MockV3Aggregator");
        mockV3Aggregator = await ethers.getContractAt(
          "MockV3Aggregator",
          mockV3AggregatorDeployment.address
        );
      });

      describe("constructor", async () => {
        it("testing to sets the aggregator address correctly ", async () => {
          const response = await fundMe.s_priceFeed();
          assert.equal(response, mockV3Aggregator.target);
        });
      });

      describe("testing Fund", async () => {
        it("fail if minimum fund is not given ", async () => {
          await expect(fundMe.fund()).to.be.revertedWith(
            "You need to spend more ETH!"
          );
        });
        it("adding funds to the deployed onctract", async () => {
          await fundMe.fund({ value: ETH_VALUE });
          const response = await fundMe.s_addressToAmountFunded(deployer);

          assert.equal(response.toString(), ETH_VALUE.toString());
        });
      });

      describe("testing withdrawals", async () => {
        beforeEach(async () => {
          await fundMe.fund({ value: ETH_VALUE });
        });

        it("withdrawing amount after adding 1 eth", async () => {
          const startingDeployerBalance = await ethers.provider.getBalance(
            deployer
          );
          const startingFundMeBalance = await ethers.provider.getBalance(
            fundMeDeployment.address
          );

          const transactionResponse = await fundMe.withdraw();
          const transactionReceipt = await transactionResponse.wait();
          const { gasUsed, gasPrice } = transactionReceipt;
          const gasCost = gasUsed * gasPrice;

          const endingFundMeBalance = await ethers.provider.getBalance(
            fundMeDeployment.address
          );
          const endingDeployerBalance = await ethers.provider.getBalance(
            deployer
          );

          assert.equal(endingFundMeBalance, "0");
          // console.log(
          //   startingFundMeBalance.toString() +
          //     "   " +
          //     startingDeployerBalance.toString()
          // );
          // console.log(endingDeployerBalance.toString() + "  " + gasCost.toString());
          assert.equal(
            (startingFundMeBalance + startingDeployerBalance).toString(),
            (endingDeployerBalance + gasCost).toString()
          );
        });
        ///9990007160813263426264
      });

      it("withdraw from multiple accounts funded ", async () => {
        const accounts = await ethers.getSigners();

        for (let i = 0; i < 5; i++) {
          const fundMeConnectedContracr = await fundMe.connect(accounts[i]);
          await fundMeConnectedContracr.fund({ value: ETH_VALUE });
        }

        const startingDeployerBalance = await ethers.provider.getBalance(
          deployer
        );
        const startingFundMeBalance = await ethers.provider.getBalance(
          fundMeDeployment.address
        );

        const transactionResponse = await fundMe.withdraw();

        const transactionReceipt = await transactionResponse.wait();
        const { gasUsed, gasPrice } = transactionReceipt;
        const gasCost = gasUsed * gasPrice;

        const endingFundMeBalance = await ethers.provider.getBalance(
          fundMeDeployment.address
        );
        const endingDeployerBalance = await ethers.provider.getBalance(
          deployer
        );

        assert.equal(endingFundMeBalance, "0");

        assert.equal(
          (startingFundMeBalance + startingDeployerBalance).toString(),
          (endingDeployerBalance + gasCost).toString()
        );
      });

      it("testing Onlyowners can withraw dhanuanth ", async () => {
        const accounts = await ethers.getSigners();

        const fundMeCntract = await fundMe.connect(accounts[1]);
        await fundMeCntract.fund({ value: ETH_VALUE });

        await expect(fundMeCntract.withdraw()).to.be.reverted;
        // const response = fundMe.assert.equal(s_addressToAmountFunded);
      });
    });
