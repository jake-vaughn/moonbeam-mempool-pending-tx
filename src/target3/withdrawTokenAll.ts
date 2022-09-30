import hre from "hardhat"

import { networkConfig } from "../../helper-hardhat-config"
import { IERC20, ITarget3 } from "../../typechain-types/interfaces"

const { ethers, network, getNamedAccounts } = hre
const chainId = network.config.chainId!
const targetContracts = networkConfig[chainId].targetContracts
const target = targetContracts["0xB96dE8B07764969C7AF521cA546112ea1e191580"]
const CONTRACT_ADDRESS = target.copyContractAddr

async function withdrawTokenAll() {
  const { deployer } = await getNamedAccounts()

  const iTarget3: ITarget3 = await ethers.getContractAt("ITarget3", CONTRACT_ADDRESS, deployer)
  const iWglmr: IERC20 = await ethers.getContractAt("IERC20", "0xAcc15dC74880C9944775448304B263D191c6077F")

  const wglmrBalance = await iWglmr.balanceOf(iTarget3.address)

  console.log(`Balance of ${ethers.utils.formatEther(wglmrBalance).toString()} WGLMR`)
  const tx = await iTarget3.withdrawToken(iWglmr.address, wglmrBalance, {
    maxFeePerGas: 102000000000,
    maxPriorityFeePerGas: 1000000000,
  })
  await tx.wait()

  console.log(`Balance of ${ethers.utils.formatEther(await iWglmr.balanceOf(iTarget3.address)).toString()} WGLMR`)
}

withdrawTokenAll().catch(error => {
  console.error(error)
  process.exitCode = 1
})
