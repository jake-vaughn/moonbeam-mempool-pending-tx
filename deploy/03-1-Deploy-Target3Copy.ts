import { DeployFunction } from "hardhat-deploy/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"

import { abi, bytecode } from "../contracts/contractJson/target3Copy"
import { developmentChains, networkConfig } from "../helper-hardhat-config"

const deployTarget3CopyContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { network, deployments, getNamedAccounts, ethers } = hre
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()

  const deployerSig = await ethers.getSigner(deployer)
  const target3CopyContractFactory = new ethers.ContractFactory(abi, bytecode, deployerSig)

  log("Deploying target3 and waiting for confirmations...")
  const target3Copy = await target3CopyContractFactory.deploy({})

  log(`target3 deployed at ${target3Copy.address}`)
  const target3CopyDeployTx = await target3Copy.deployTransaction
  const txReceipt = await target3CopyDeployTx.wait()
  console.log(`Gas used`, txReceipt.gasUsed.toString())

  log("----------------------------------------------------")
}

export default deployTarget3CopyContract
deployTarget3CopyContract.tags = ["target3"]
