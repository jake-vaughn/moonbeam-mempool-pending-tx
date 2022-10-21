import { DeployFunction } from "hardhat-deploy/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"

import { abi, bytecode } from "../contracts/contractJson/target7Copy"

const deployTarget7CopyContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, ethers } = hre
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()

  const deployerSig = await ethers.getSigner(deployer)
  const target7CopyContractFactory = new ethers.ContractFactory(abi, bytecode, deployerSig)

  log("Deploying target7 and waiting for confirmations...")
  const target7Copy = await target7CopyContractFactory.deploy({
    maxFeePerGas: 102000000000,
    maxPriorityFeePerGas: 1000000000,
  })

  log(`target7 deployed at ${target7Copy.address}`)
  const target7CopyDeployTx = await target7Copy.deployTransaction
  const txReceipt = await target7CopyDeployTx.wait()
  console.log(`Gas used`, txReceipt.gasUsed.toString())

  log("----------------------------------------------------")
}

export default deployTarget7CopyContract
deployTarget7CopyContract.tags = ["target7"]
