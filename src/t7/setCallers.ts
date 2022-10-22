import { utils } from "ethers"
import hre from "hardhat"

import "../../const/namedContracts"
import { namedContracts } from "../../const/namedContracts"
import { networkConfig } from "../../helper-hardhat-config"

const { ethers, getNamedAccounts } = hre
const rpcProvider = hre.ethers.provider
const chainId = hre.network.config.chainId!
const namedContract = namedContracts[chainId].t7
const target = networkConfig[chainId].targetContracts[namedContract.addr]
const signers = target.signers

async function setCallers() {
  const { deployer } = await getNamedAccounts()
  const deploySig = rpcProvider.getSigner(deployer)

  const functionHash = "0x" + namedContract.functions!.setFunc.mod!

  let nonce = await deploySig.getTransactionCount()

  for (const addr in signers) {
    // console.log(signers[addr], await (await rpcProvider.getSigner(signers[addr])).getAddress())
    const sig = await rpcProvider.getSigner(signers[addr])
    const sigAddr = await sig.getAddress()
    const sigAddrPadded = utils.hexZeroPad(sigAddr, 32)
    const inputData = utils.hexConcat([functionHash, sigAddrPadded])

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
