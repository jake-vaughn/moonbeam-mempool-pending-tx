import { utils } from "ethers"
import hre from "hardhat"

import { networkConfig } from "../../helper-hardhat-config"

const rpcProvider = hre.ethers.provider
const chainId = hre.network.config.chainId!
const targetContracts = networkConfig[chainId].targetContracts
const target = targetContracts["0x2b731E8e2C72cC14628346EB1Bc11ebF1A4ef2e6"]

async function withdrawDot() {
  const { getNamedAccounts, ethers } = hre
  const { deployer } = await getNamedAccounts()

  const deployerSig = await ethers.getSigner(deployer)

  let inputData = ""
  const functionHash = "0xc7e42b1b"
  const dotAddr = "0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080"

  const dotAddrPadded = utils.hexZeroPad(dotAddr, 32)
  inputData = utils.hexConcat([functionHash, dotAddrPadded])

  console.log(inputData)

  const tx = await deployerSig.sendTransaction({
    to: target.copyContractAddr,
    data: inputData,
  })

  const txReceipt = await tx.wait()
  console.log(`Transaction hash: ${txReceipt.transactionHash}`)
}

withdrawDot().catch(error => {
  console.error(error)
  process.exitCode = 1
})
