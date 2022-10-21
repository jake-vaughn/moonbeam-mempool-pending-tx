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
  // const functionHash = "0x85a909d4" // original
  const functionHash = "0x8ca5cbb9" // new
  let nonce = await deploySig.getTransactionCount()

  for (const addr in signers) {
    // console.log(signers[addr], await (await rpcProvider.getSigner(signers[addr])).getAddress())
    const sig = await rpcProvider.getSigner(signers[addr])
    const sigAddr = await sig.getAddress()
    const sigAddrPadded = utils.hexZeroPad(sigAddr, 32)
    inputData = utils.hexConcat([functionHash, sigAddrPadded])

    const tx = await deploySig.sendTransaction({
      to: target.copyContractAddr,
      data: inputData,
      nonce: nonce,
    })

    console.log(`Nonce: ${nonce} hash: ${tx.hash}`)
    console.log(inputData)
    nonce++
  }
}

setCallers().catch(error => {
  console.error(error)
  process.exitCode = 1
})
