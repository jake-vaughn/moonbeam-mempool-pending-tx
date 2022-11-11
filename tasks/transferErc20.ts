import { formatUnits, parseUnits } from "ethers/lib/utils"
import { task } from "hardhat/config"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import yesno from "yesno"

import { IERC20 } from "../src/types"

// const ERC20_ADDRESS = "0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080" // DOT
// const DESTINATION_ADDRESS = "0xe6F1886F7C762aE25778FA3F04CE2dB6f7507ef0" // t5m

const ERC20_ADDRESS = "0x818ec0A7Fe18Ff94269904fCED6AE3DaE6d6dC0b" // USDC
const DESTINATION_ADDRESS = "0xB4644C2170b421117162cb5F16Ac3648A4317122" // t7m
const TRANSFER_AMOUNT_ETH = "10"

task("transferErc20", "transfers a given erc20 to destination", async (_taskArgs, hre: HardhatRuntimeEnvironment) => {
  const { ethers } = hre
  const { deployer } = await hre.getNamedAccounts()
  const deploySig = await hre.ethers.provider.getSigner(deployer)
  const erc20: IERC20 = await ethers.getContractAt("IERC20", ERC20_ADDRESS, deploySig)

  const erc20Balance = await erc20.balanceOf(deploySig.getAddress())
  console.log(`Balance of deployer is ${formatUnits(erc20Balance, await erc20.decimals())} ${await erc20.name()}`)
  var sendAmount = erc20Balance

  if (parseUnits(TRANSFER_AMOUNT_ETH, await erc20.decimals()).lte(sendAmount)) {
    sendAmount = parseUnits(TRANSFER_AMOUNT_ETH, await erc20.decimals())
  }

  const ok = await yesno({
    question: `Do you want to Transfer ${formatUnits(
      sendAmount,
      await erc20.decimals(),
    )} ${await erc20.name()} to ${DESTINATION_ADDRESS}`,
  })
  if (!ok) return

  const tx = await erc20.transfer(DESTINATION_ADDRESS, sendAmount)
  console.log(`Tx Hash: ${tx.hash}`)
})
