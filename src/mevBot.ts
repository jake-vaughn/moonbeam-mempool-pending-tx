import hre from "hardhat"
import yesno from "yesno"

import { wssUrl } from "../hardhat.config"
import { networkConfig, targetContractItem } from "../helper-hardhat-config"
import { logHumanReadable } from "./logHumanReadable"
import { mevBotReverse } from "./revEng/mevBotReverse"
import { logger, mevBotTransportFile, tempErrorLog, tempLog } from "./utils/logger"

const { ethers, network } = hre
const chainId = network.config.chainId!

const wssProvider = new ethers.providers.WebSocketProvider(wssUrl!)
const targetContracts = networkConfig[chainId].targetContracts

async function mevBot() {
  console.log("debug", `Running: mevBotCopier `, {
    Chain: networkConfig[chainId].name,
    RpcProvider: ethers.provider.connection.url,
    WssProvider: wssProvider.connection.url,
  })

  const ok = await yesno({ question: `Enable Logging?` })
  if (ok) {
    mevBotTransportFile.on("logged", async function (info) {
      await logHumanReadable(info, hre)
    })
  }
  console.log(`Waiting for transactions...`)

  mevBotReverse()

  wssProvider.on("pending", txHash => {
    // console.log(txHash)
    ethers.provider.getTransaction(txHash).then(async function (memPoolTx) {
      try {
        const target = targetContracts[memPoolTx.to!]
        const signerIdx = target.signers[memPoolTx.from]
        const mevBotSigner = ethers.provider.getSigner(signerIdx)
        const mevBotTx = await mevBotSigner.sendTransaction({
          to: target.copyContractAddr,
          gasLimit: memPoolTx.gasLimit,
          data: memPoolTx.data,
          nonce: await mevBotSigner.getTransactionCount(),
          maxFeePerGas: memPoolTx.maxFeePerGas,
          maxPriorityFeePerGas: memPoolTx.maxPriorityFeePerGas,
          gasPrice: memPoolTx.maxFeePerGas ? undefined : memPoolTx.gasPrice,
        })
        await tempLog(target, memPoolTx, mevBotTx, ethers.provider.blockNumber)
      } catch (err) {
        if (
          memPoolTx != null &&
          memPoolTx.to! in targetContracts &&
          targetContracts[memPoolTx.to!].signers[memPoolTx.from] != undefined
        ) {
          await tempErrorLog(err, targetContracts[memPoolTx.to!], memPoolTx, ethers.provider.blockNumber)
        }
      }
    })
  })
}

mevBot().catch(error => {
  logger.error(error)
  // process.exitCode = 1
})
