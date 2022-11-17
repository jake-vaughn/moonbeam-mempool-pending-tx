import { formatEther, parseEther } from "ethers/lib/utils"
import { task } from "hardhat/config"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import yesno from "yesno"

import { networkConfig } from "../helper-hardhat-config"
import { getWglmrBalance, unwrapWglmr } from "../src/utils/defi/wglmr"

task(
  "unwrap",
  "unwraps a set amount of wglmr in Deployer address",
  async (_taskArgs, hre: HardhatRuntimeEnvironment) => {
    const { deployer } = await hre.getNamedAccounts()
    const deploySig = await hre.ethers.provider.getSigner(deployer)
    const unwrapSpecificAmount = parseEther("633.201879740654698125")

    const wglmrBalance = await getWglmrBalance(deploySig, hre)
    console.log(`Balance of deployer is ${formatEther(wglmrBalance)} Wglmr`)

    const ok = await yesno({ question: `Do you want to unwrap ${formatEther(wglmrBalance)} Wglmr?` })
    if (!ok) return

    const txReceipt = await unwrapWglmr(wglmrBalance, deploySig, hre)
    if (txReceipt != undefined) console.log(`Success ${txReceipt.transactionHash}`)
  },
)
