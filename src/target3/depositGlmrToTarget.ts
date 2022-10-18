import hre from "hardhat"

import { networkConfig } from "../../helper-hardhat-config"
import { transferWglmr, wrapGlmr } from "../../src/utils/defi/wglmr"
import { IERC20 } from "../../typechain-types/interfaces"

const { ethers, getNamedAccounts, network } = hre
const chainId = network.config.chainId!
const targetContracts = networkConfig[chainId].targetContracts
const target = targetContracts["0xAdaaF4999349346935387797c5F79E07C43c12eD"]

const COPY_CONTRACT_ADDRESS = target.copyContractAddr

async function depositGlmrToTarget() {
  const { deployer } = await getNamedAccounts()
  const deploySig = ethers.provider.getSigner(deployer)
  const AMOUNT_TO_SEND = ethers.utils.parseEther("100")

  // await wrapGlmr(AMOUNT_TO_SEND, deploySig, hre)
  await transferWglmr(COPY_CONTRACT_ADDRESS, AMOUNT_TO_SEND, deploySig, hre)
  console.log("Glmr Transferred")
}

depositGlmrToTarget().catch(error => {
  console.error(error)
  process.exitCode = 1
})
