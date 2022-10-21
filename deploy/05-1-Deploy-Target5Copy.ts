import { DeployFunction } from "hardhat-deploy/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"

import { abi, bytecode } from "../contracts/contractJson/target5Copy"

const deployTarget5CopyContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, ethers } = hre
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()

  const deployerSig = await ethers.getSigner(deployer)
  const target5CopyContractFactory = new ethers.ContractFactory(abi, bytecode, deployerSig)

  log("Deploying target5 and waiting for confirmations...")
  const target5Copy = await target5CopyContractFactory.deploy({})

  log(`target5 deployed at ${target5Copy.address}`)
  const target5CopyDeployTx = await target5Copy.deployTransaction
  const txReceipt = await target5CopyDeployTx.wait()
  console.log(`Gas used`, txReceipt.gasUsed.toString())

  log("----------------------------------------------------")
}

export default deployTarget5CopyContract
deployTarget5CopyContract.tags = ["target5"]
