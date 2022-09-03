import { Signer } from "@ethersproject/abstract-signer"
import { formatEther } from "ethers/lib/utils"
import { task } from "hardhat/config"
import { HardhatRuntimeEnvironment } from "hardhat/types"

task("accounts", "Prints the list of accounts", async (_taskArgs, hre: HardhatRuntimeEnvironment) => {
  const accounts: Signer[] = await hre.ethers.getSigners()
  let i = 0
  for (const account of accounts) {
    const addr = await account.getAddress()
    console.log(i, ":", addr, await formatEther(await hre.ethers.provider.getBalance(addr)))
    i++
  }
})
