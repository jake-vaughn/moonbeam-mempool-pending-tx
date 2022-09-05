import { formatEther, parseEther } from "ethers/lib/utils"
import { task } from "hardhat/config"
import { HardhatRuntimeEnvironment } from "hardhat/types"

task("sendEth", "Sends 0.01 eth from deployer to itself", async (_taskArgs, hre: HardhatRuntimeEnvironment) => {
  const AMOUNT_TO_SEND = parseEther("18.4916")
  const { deployer } = await hre.getNamedAccounts()
  const senderSig = await hre.ethers.provider.getSigner("0xafcd18f11d0370b795e85ee00ee505fe5e4552f6")
  console.log(deployer)

  const tx = await senderSig.sendTransaction({ to: deployer, value: AMOUNT_TO_SEND })

  const txReceipt = await tx.wait()

  if (txReceipt != undefined) {
    console.log(`Success ${txReceipt.transactionHash}`)
  }
})
