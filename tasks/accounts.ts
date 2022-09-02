import { Signer } from "@ethersproject/abstract-signer"
import { task } from "hardhat/config"

task("accounts", "Prints the list of accounts", async (_taskArgs, hre) => {
  const accounts: Signer[] = await hre.ethers.getSigners()
  let i = 0
  for (const account of accounts) {
    console.log(i, ":", await account.getAddress())
    i++
  }
})
