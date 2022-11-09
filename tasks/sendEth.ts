import { BigNumber } from "ethers"
import { formatEther, parseEther } from "ethers/lib/utils"
import { task } from "hardhat/config"
import { HardhatRuntimeEnvironment } from "hardhat/types"

const TO_ADDRESS = "0x769A00b6Ef2c67BCCdC5a5c4844cE2223233928D"
const AMOUNT_TO_SEND = parseEther("0")

task(
  "sendEth",
  "Sends given amount eth from deployer to a given address",
  async (_taskArgs, hre: HardhatRuntimeEnvironment) => {
    const { deployer } = await hre.getNamedAccounts()
    const deploySig = await hre.ethers.provider.getSigner(deployer)
    const txFee = "2100000000000000"
    const sendAmountSubFee = AMOUNT_TO_SEND //.sub(BigNumber.from(txFee))

    const tx = await deploySig.sendTransaction({ to: TO_ADDRESS, value: sendAmountSubFee })

    const txReceipt = await tx.wait()
    if (txReceipt != undefined) {
      console.log(`Success ${txReceipt.transactionHash}`)
    }
  },
)
