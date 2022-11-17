import { HardhatRuntimeEnvironment } from "hardhat/types"

import { abi, bytecode } from "../contracts/contractJson/target3Copy"
import { developmentChains, networkConfig } from "../helper-hardhat-config"

module.exports = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, ethers } = hre
  const { deployer } = await getNamedAccounts()

  const deployerSig = await ethers.getSigner(deployer)
  const contractFactory = new ethers.ContractFactory(abi, bytecode, deployerSig)

  const deployedContract = await contractFactory.deploy({})
  const txReceipt = await deployedContract.deployTransaction.wait()

  console.log(
    `deploying "T3m" (tx: ${txReceipt.blockHash})...: deployed at ${
      deployedContract.address
    } with ${txReceipt.gasUsed.toString()} gas`,
  )
  console.log("------------------------------------------------------------------")
}

module.exports.tags = ["t3m"]
