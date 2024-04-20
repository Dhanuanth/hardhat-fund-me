const { getNamedAccounts, ethers } = require("hardhat");

async function main() {
  let deployer = (await getNamedAccounts()).deployer;
  const accounts = await ethers.getSigners();

  await deployments.fixture(["all"]);

  let contract = await deployments.get("FundMe");
  let fundMeContract = await ethers.getContractAt("FundMe", contract.address);

  let sendvalue = ethers.parseEther("0.1");

  console.log("Funding by " + deployer + ".........");
  // console.log("Funding By " + accounts[0]);
  // await fundMeContract.connect(accounts[0]);

  await fundMeContract.fund({ value: sendvalue });

  console.log("!FUNDED!");
}

main()
  .then(() => process.exit())
  .catch((e) => {
    console.log(e);
    process.exit(0);
  });
