import { utils } from "ethers"
import hre from "hardhat"

import { networkConfig } from "../../helper-hardhat-config"

const rpcProvider = hre.ethers.provider
const chainId = hre.network.config.chainId!
const targetContracts = networkConfig[chainId].targetContracts
const target = targetContracts["0x8B6784b18d534b98d738719F05B0a8a54bB4C098"]

async function withdrawDot() {
  const { getNamedAccounts, ethers } = hre
  const { deployer } = await getNamedAccounts()

  const deployerSig = await ethers.getSigner(deployer)

  let inputData = ""
  const functionHash = "0xc7e42b1b"
  const dotAddr = ""

  const dotAddrPadded = utils.hexZeroPad(dotAddr, 32)
  inputData = utils.hexConcat([functionHash, dotAddrPadded])

  console.log(inputData)

  const tx = await deployerSig.sendTransaction({
    to: target.copyContractAddr,
    data: inputData,
    maxFeePerGas: 102000000000,
    maxPriorityFeePerGas: 1000000000,
  })

  const txReceipt = await tx.wait()
  console.log(`Transaction hash: ${txReceipt.transactionHash}`)
}

withdrawDot().catch(error => {
  console.error(error)
  process.exitCode = 1
})
