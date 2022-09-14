import { DeployFunction } from "hardhat-deploy/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"

import { abi, bytecode } from "../contractJson/target4Copy"

const deployTarget4CopyContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, ethers } = hre
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()

  const deployerSig = await ethers.getSigner(deployer)
  const target4CopyContractFactory = new ethers.ContractFactory(abi, bytecode, deployerSig)

  log("Deploying target4 and waiting for confirmations...")
  const target4Copy = await target4CopyContractFactory.deploy({
    maxFeePerGas: 102000000000,
    maxPriorityFeePerGas: 1000000000,
  })

  log(`target4 deployed at ${target4Copy.address}`)
  const target4CopyDeployTx = await target4Copy.deployTransaction
  const txReceipt = await target4CopyDeployTx.wait()
  console.log(`Gas used`, txReceipt.gasUsed.toString())

  log("----------------------------------------------------")
}

export default deployTarget4CopyContract
deployTarget4CopyContract.tags = ["target4"]
