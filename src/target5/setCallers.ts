import { utils } from "ethers"
import hre from "hardhat"

import { networkConfig } from "../../helper-hardhat-config"

const rpcProvider = hre.ethers.provider
const chainId = hre.network.config.chainId!
const targetContracts = networkConfig[chainId].targetContracts
const target = targetContracts["0x2b731E8e2C72cC14628346EB1Bc11ebF1A4ef2e6"]
const signers = target.signers

async function setCallers() {
  const { deployer } = await hre.getNamedAccounts()
  const deploySig = rpcProvider.getSigner(deployer)

  let inputData = ""

  const functionHash = "0x85a909d4"

  for (const addr in signers) {
    // console.log(signers[addr], await (await rpcProvider.getSigner(signers[addr])).getAddress())
    const sig = await rpcProvider.getSigner(signers[addr])
    const sigAddr = await sig.getAddress()
    const sigAddrPadded = utils.hexZeroPad(sigAddr, 32)
    inputData = utils.hexConcat([functionHash, sigAddrPadded])

    console.log(inputData)

    const tx = await deploySig.sendTransaction({
      to: target.copyContractAddr,
      data: inputData,
      maxFeePerGas: 102000000000,
      maxPriorityFeePerGas: 1000000000,
    })

    const txReceipt = await tx.wait()
    console.log(`Transaction hash: ${txReceipt.transactionHash}`)
  }
}

setCallers().catch(error => {
  console.error(error)
  process.exitCode = 1
})
