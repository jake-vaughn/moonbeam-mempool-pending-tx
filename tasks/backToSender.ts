import { BigNumber } from "ethers"
import { formatEther, parseEther } from "ethers/lib/utils"
import { task } from "hardhat/config"
import { HardhatRuntimeEnvironment } from "hardhat/types"

const START_IDX = 0
const END_IDX = 0

task("backToSender", "Sends eth balance back to deployer", async (_taskArgs, hre: HardhatRuntimeEnvironment) => {
  const { deployer } = await hre.getNamedAccounts()
  //   const txFee = "2100000000000000" // moonbeam
  const txFee = "21000000000000" // moonriver
  for (let i = START_IDX; i <= END_IDX; i++) {
    const sig = await hre.ethers.provider.getSigner(i)
    const sigBal = await hre.ethers.provider.getBalance(await sig.getAddress())
    const sendAmountSubFee = sigBal.sub(BigNumber.from(txFee))
    const tx = await sig.sendTransaction({ to: deployer, value: sendAmountSubFee })
    console.log(await sig.getAddress(), formatEther(sigBal), tx.hash)
  }
})
