import { utils } from "ethers"
import { formatEther } from "ethers/lib/utils"
import hre from "hardhat"
import yesno from "yesno"

import { networkConfig } from "../../helper-hardhat-config"
import { IERC20 } from "../types"
import { unwrapWglmr } from "../utils/defi/wglmr"

const { ethers, network, getNamedAccounts } = hre
const chainId = network.config.chainId!
const targetContracts = networkConfig[chainId].targetContracts
const target = targetContracts["0x8B6784b18d534b98d738719F05B0a8a54bB4C098"]
const CONTRACT_ADDRESS = target.copyContractAddr
const wglmrAddr = "0xAcc15dC74880C9944775448304B263D191c6077F"

async function withdrawWglmr() {
  const { getNamedAccounts, ethers } = hre
  const { deployer } = await getNamedAccounts()
  const deploySig = await ethers.provider.getSigner(deployer)

  const iWglmr: IERC20 = await ethers.getContractAt("IERC20", wglmrAddr)
  const wglmrBalance = await iWglmr.balanceOf(CONTRACT_ADDRESS)

  // Withdraw
  console.log(`Balance of ${formatEther(wglmrBalance)} WGLMR`)
  var ok = await yesno({ question: `Do you want to withdraw ${formatEther(wglmrBalance)} WGLMR?` })
  if (!ok) return

  let inputData = ""
  const functionHash = "0xc7e42b1b"
  const wglmrAddrPadded = utils.hexZeroPad(wglmrAddr, 32)
  inputData = utils.hexConcat([functionHash, wglmrAddrPadded])
  console.log(inputData)

  const tx = await deploySig.sendTransaction({
    to: target.copyContractAddr,
    data: inputData,
  })

  const txReceipt = await tx.wait()
  console.log(`Transaction hash: ${txReceipt.transactionHash}`)

  // Unwrap
  const ok2 = await yesno({ question: `Do you want to unwrap the ${formatEther(wglmrBalance)} WGLMR?` })
  if (!ok2) return

  var txReceipt2 = await unwrapWglmr(wglmrBalance, deploySig, hre)
  if (txReceipt != undefined) console.log(`Success ${txReceipt2.transactionHash}`)
}

withdrawWglmr().catch(error => {
  console.error(error)
  process.exitCode = 1
})
