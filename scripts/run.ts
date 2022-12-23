import { ethers } from "hardhat";

async function main() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
  const unlockTime = currentTimestampInSeconds + ONE_YEAR_IN_SECS;

  const lockedAmount = ethers.utils.parseEther("1");

  const NFTMinter = await ethers.getContractFactory("NFTMinter");
  const nftMinter = await NFTMinter.deploy(unlockTime, { value: lockedAmount });

  await nftMinter.deployed();

  console.log(`Lock with 1 ETH and unlock timestamp ${unlockTime} deployed to ${nftMinter.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch(async (error) => {
  const baseTokenURI = `ipfs://${process.env.REACT_APP_BASEURI}/`;
  // Get contract that we want to deploy
  const contractFactory = await ethers.getContractFactory("NFTMinter");
  // Deploy contract with the correct constructor arguments
  const contract = await contractFactory.deploy(baseTokenURI);

  // Wait for this transaction to be mined
  await contract.deployed();

  console.log("NFTMinter deployed to:", contract.address);
});
