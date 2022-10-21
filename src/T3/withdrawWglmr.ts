import { BigNumber } from "ethers"
import { formatEther, parseEther } from "ethers/lib/utils"
import hre from "hardhat"
import yesno from "yesno"

import { networkConfig } from "../../helper-hardhat-config"
import { IERC20, ITarget3 } from "../../typechain-types/interfaces"
import { unwrapWglmr } from "../utils/defi/wglmr"

const { ethers, network, getNamedAccounts } = hre
const chainId = network.config.chainId!
const targetContracts = networkConfig[chainId].targetContracts
const target = targetContracts["0xAdaaF4999349346935387797c5F79E07C43c12eD"]
const CONTRACT_ADDRESS = target.copyContractAddr

async function withdrawWglmr() {
  const { deployer } = await getNamedAccounts()
  const deploySig = await ethers.provider.getSigner(deployer)

  const iTarget3: ITarget3 = await ethers.getContractAt("ITarget3", CONTRACT_ADDRESS, deploySig)
  const iWglmr: IERC20 = await ethers.getContractAt("IERC20", "0xAcc15dC74880C9944775448304B263D191c6077F")

  const wglmrBalance = await iWglmr.balanceOf(iTarget3.address)
  const withdrawAmount = wglmrBalance.sub(BigNumber.from(parseEther("5000")))

  // Withdraw
  console.log(`Balance of ${formatEther(wglmrBalance)} WGLMR`)
  var ok = await yesno({ question: `Do you want to withdraw ${formatEther(withdrawAmount)} WGLMR?` })
  if (!ok) return

  const tx = await iTarget3.withdrawToken(iWglmr.address, withdrawAmount)
  var txReceipt = await tx.wait()
  if (txReceipt != undefined) console.log(`Success ${txReceipt.transactionHash}`)

  // Unwrap
  ok = await yesno({ question: `Do you want to unwrap the ${formatEther(withdrawAmount)} WGLMR?` })
  if (!ok) return

  var txReceipt = await unwrapWglmr(withdrawAmount, deploySig, hre)
  if (txReceipt != undefined) console.log(`Success ${txReceipt.transactionHash}`)
}

withdrawWglmr().catch(error => {
  console.error(error)
  process.exitCode = 1
})
