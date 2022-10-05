import { formatEther, parseEther } from "ethers/lib/utils"
import { task } from "hardhat/config"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import yesno from "yesno"

import { networkConfig } from "../helper-hardhat-config"
import { getWglmrBalance, unwrapWglmr } from "../src/utils/defi/wglmr"
import { topUpEth } from "../src/utils/multisend"

task(
  "unwrapWglmr",
  "unwraps a set amount of wglmr in Deployer address",
  async (_taskArgs, hre: HardhatRuntimeEnvironment) => {
    const { deployer } = await hre.getNamedAccounts()
    const deploySig = await hre.ethers.provider.getSigner(deployer)
    const unwrapAmount = parseEther("100")

    const wglmrBalance = getWglmrBalance(deploySig, hre)
    console.log(`Balance of ${await deploySig.getAddress()} is ${wglmrBalance} Wglmr`)

    const ok = await yesno({
      question: `Do you want to unwrap ${formatEther(unwrapAmount)} Wglmr?`,
    })

    if (!ok) {
      return
    }

    const txReceipt = await unwrapWglmr(unwrapAmount, deploySig, hre)
    if (txReceipt != undefined) console.log(`Success ${txReceipt.transactionHash}`)
  },
)
