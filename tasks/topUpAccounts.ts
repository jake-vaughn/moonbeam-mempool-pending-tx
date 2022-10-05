import { formatEther, parseEther } from "ethers/lib/utils"
import { task } from "hardhat/config"
import { HardhatRuntimeEnvironment } from "hardhat/types"

import { networkConfig } from "../helper-hardhat-config"
import { topUpEth } from "../src/utils/multisend"

task("topUpAccounts", "Sends 0.01 eth to all active signers", async (_taskArgs, hre: HardhatRuntimeEnvironment) => {
  const targets = networkConfig[hre.network.config.chainId!].targetContracts
  const addressList: string[] = []
  const addrMap = new Map<string, boolean>()
  const AMOUNT_TO_SEND = parseEther("10")
  const { deployer } = await hre.getNamedAccounts()
  const deploySig = await hre.ethers.provider.getSigner(deployer)

  for (const target in targets) {
    if (targets[target].active) {
      for (const sig in targets[target].signers) {
        const sigIdx = targets[target].signers[sig]
        const signer = await hre.ethers.provider.getSigner(sigIdx)
        const sigAddr = await signer.getAddress()
        if (!addrMap.has(sigAddr)) addrMap.set(sigAddr, true)
      }
    }
  }
  for (const addr of addrMap.keys()) {
    addressList.push(addr)
  }
  console.log(`Topping up ${addressList.length} addresses with ${formatEther(AMOUNT_TO_SEND)} Eth`)
  const txReceipt = await topUpEth(addressList, AMOUNT_TO_SEND, deploySig, hre)
  if (txReceipt != undefined) console.log(`Success ${txReceipt.transactionHash}`)
})
