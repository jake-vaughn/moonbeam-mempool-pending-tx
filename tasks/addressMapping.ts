import { task } from "hardhat/config"
import { HardhatRuntimeEnvironment } from "hardhat/types"

import { networkConfig } from "../helper-hardhat-config"

task(
  "addressMapping",
  "outputs to console target from : index: signer",
  async (_taskArgs, hre: HardhatRuntimeEnvironment) => {
    const targets = networkConfig[hre.network.config.chainId!].targetContracts
    const addressList: string[] = []
    const { deployer } = await hre.getNamedAccounts()
    const deploySig = await hre.ethers.provider.getSigner(deployer)

    for (const target in targets) {
      if (targets[target].active) {
        for (const sig in targets[target].signers) {
          const sigIdx = targets[target].signers[sig]
          const signer = await hre.ethers.provider.getSigner(sigIdx)
          const sigAddr = await signer.getAddress()

          console.log(`https://moonscan.io/address/${sig}`, sigIdx, `https://moonscan.io/address/${sigAddr}`)

          //   console.log(addr, await formatEther(await hre.ethers.provider.getBalance(sigAddr)))
        }
      }
    }
  },
)
