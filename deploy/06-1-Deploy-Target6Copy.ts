import { DeployFunction } from "hardhat-deploy/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"

import { abi, bytecode } from "../contracts/contractJson/target6Copy"

const deployTarget6CopyContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, ethers } = hre
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()

  const deployerSig = await ethers.getSigner(deployer)
  const target6CopyContractFactory = new ethers.ContractFactory(abi, bytecode, deployerSig)

  log("Deploying target6 and waiting for confirmations...")
  const target6Copy = await target6CopyContractFactory.deploy({})

  log(`target6 deployed at ${target6Copy.address}`)
  const target6CopyDeployTx = await target6Copy.deployTransaction
  const txReceipt = await target6CopyDeployTx.wait()
  console.log(`Gas used`, txReceipt.gasUsed.toString())

  log("----------------------------------------------------")
}

export default deployTarget6CopyContract
deployTarget6CopyContract.tags = ["target6"]
