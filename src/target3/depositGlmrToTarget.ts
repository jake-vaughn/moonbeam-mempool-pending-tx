import { ethers, getNamedAccounts, network } from "hardhat"

import { networkConfig } from "../../helper-hardhat-config"
import { transferWglmr, wrapGlmr } from "../../src/utils/wglmr"
import { IERC20 } from "../../typechain-types/interfaces"

const rpcProvider = ethers.provider
const chainId = network.config.chainId!
const targetContracts = networkConfig[chainId].targetContracts
const target = targetContracts["0x2541300Dff59926F0855016e861A1426fb547037"]

const CONTRACT_ADDRESS = target.copyContractAddr
const AMOUNT_TO_SEND = ethers.utils.parseEther("0.05")

async function depositGlmrToTarget() {
  const { deployer } = await getNamedAccounts()
  const deploySig = rpcProvider.getSigner(deployer)

  await wrapGlmr(AMOUNT_TO_SEND, deploySig)
  await transferWglmr(CONTRACT_ADDRESS, AMOUNT_TO_SEND, deploySig)
  console.log("Glmr Transferred")
}

depositGlmrToTarget().catch(error => {
  console.error(error)
  process.exitCode = 1
})
