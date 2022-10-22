import { utils } from "ethers"
import { formatEther, formatUnits } from "ethers/lib/utils"
import hre from "hardhat"
import yesno from "yesno"

import { namedContracts } from "../../const/namedContracts"
import { networkConfig } from "../../helper-hardhat-config"
import { IERC20 } from "../types"

const { ethers, getNamedAccounts } = hre
const rpcProvider = hre.ethers.provider
const chainId = hre.network.config.chainId!
const namedContract = namedContracts[chainId].t7
const target = networkConfig[chainId].targetContracts[namedContract.addr]
const tokenAddr = namedContract.tokenAddr!

async function withdraw() {
  const { deployer } = await getNamedAccounts()
  const deploySig = await rpcProvider.getSigner(deployer)

  const token: IERC20 = await ethers.getContractAt("IERC20", tokenAddr)
  const tokenBalance = await token.balanceOf(target.copyContractAddr)

  const functionHash = "0x" + namedContract.functions!.withdrawFunc.orig
  const wglmrAddrPadded = utils.hexZeroPad(tokenAddr, 32)
  const inputData = utils.hexConcat([functionHash, wglmrAddrPadded])

  console.log(`Balance of ${formatUnits(tokenBalance, await token.decimals())} ${await token.name()}`)
  var ok = await yesno({
    question: `Do you want to withdraw ${formatUnits(tokenBalance, await token.decimals())} ${await token.name()}?`,
  })
  if (!ok) return

  console.log(inputData)
  const tx = await deploySig.sendTransaction({
    to: target.copyContractAddr,
    data: inputData,
  })

  console.log(`Transaction hash: ${tx.hash}`)
}

withdraw().catch(error => {
  console.error(error)
  process.exitCode = 1
})
