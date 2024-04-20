const { getNamedAccounts, ethers } = require("hardhat");

async function main() {
  let deployer = (await getNamedAccounts()).deployer;
  const accounts = await ethers.getSigners();
  let sendvalue = ethers.parseEther("0.1");
  await deployments.fixture(["all"]);

  let contract = await deployments.get("FundMe");
  let fundMeContract = await ethers.getContractAt("FundMe", contract.address);

  await fundMeContract.fund({ value: sendvalue });
  const response1 = await fundMeContract.s_addressToAmountFunded(deployer);
  console.log(response1);

  await fundMeContract.withdraw();

  const response2 = await fundMeContract.s_addressToAmountFunded(deployer);
  console.log(response2);
}

main()
  .then(() => process.exit())
  .catch((e) => {
    console.log(e);
    process.exit(0);
  });
