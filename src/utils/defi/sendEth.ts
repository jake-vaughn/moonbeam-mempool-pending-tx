import { utils } from "ethers"
import hre from "hardhat"

import { networkConfig } from "../../../helper-hardhat-config"
import { transferWglmr } from "./wglmr"

const { ethers, getNamedAccounts, network } = hre
const rpcProvider = ethers.provider
const chainId = network.config.chainId!
const targetContracts = networkConfig[chainId].targetContracts
const target = targetContracts["0xB96dE8B07764969C7AF521cA546112ea1e191580"]
const signers = target.signers

async function sendEth() {
  const { deployer } = await getNamedAccounts()
  const deploySig = rpcProvider.getSigner(deployer)
  const amountWei = utils.parseEther("0")

  transferWglmr(target.copyContractAddr, amountWei, deploySig, hre)
}

sendEth().catch(error => {
  console.error(error)
  process.exitCode = 1
})
