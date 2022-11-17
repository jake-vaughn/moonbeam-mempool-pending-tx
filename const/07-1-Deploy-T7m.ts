import { DeployFunction } from "hardhat-deploy/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"

import { abi, bytecode } from "../contracts/contractJson/target7Copy"

module.exports = async function (hre: HardhatRuntimeEnvironment) {
  const { network, deployments, getNamedAccounts, ethers } = hre
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()

  const deployerSig = await ethers.getSigner(deployer)
  const contractFactory = new ethers.ContractFactory(abi, bytecode, deployerSig)

  const deployedContract = await contractFactory.deploy({})
  const txReceipt = await deployedContract.deployTransaction.wait()

  log(
    `deploying "T7m" (tx: ${txReceipt.blockHash})...: deployed at ${
      deployedContract.address
    } with ${txReceipt.gasUsed.toString()} gas`,
  )
  log("------------------------------------------------------------------")
}

module.exports.tags = ["t7m"]
