import { utils } from "ethers"
import hre from "hardhat"

import { networkConfig } from "../../helper-hardhat-config"

const rpcProvider = hre.ethers.provider
const chainId = hre.network.config.chainId!
const targetContracts = networkConfig[chainId].targetContracts
const target = targetContracts["0x08a025B3AF7f175E95Fa304218aCDDB87f150F20"]

async function withdraw() {
  const { getNamedAccounts, ethers } = hre
  const { deployer } = await getNamedAccounts()

  const deployerSig = await ethers.getSigner(deployer)

  let inputData = ""
  const functionHash = "0xc7e42b1b"
  const tokenAddr = "0x818ec0A7Fe18Ff94269904fCED6AE3DaE6d6dC0b"

  const tokenAddrPadded = utils.hexZeroPad(tokenAddr, 32)
  inputData = utils.hexConcat([functionHash, tokenAddrPadded])

  console.log(inputData)

  const tx = await deployerSig.sendTransaction({
    to: target.copyContractAddr,
    data: inputData,
  })

  const txReceipt = await tx.wait()
  console.log(`Transaction hash: ${txReceipt.transactionHash}`)
}

withdraw().catch(error => {
  console.error(error)
  process.exitCode = 1
})
