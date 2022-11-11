import { hexConcat, hexDataSlice } from "@ethersproject/bytes"
import hre from "hardhat"
import yesno from "yesno"

import { networkConfig } from "../helper-hardhat-config"
import { mevBotReverse } from "./revEng/mevBotReverse"
import { logHumanReadable } from "./utils/logHumanReadable"
import { logger, mevBotTransportFile, tempErrorLog, tempLog } from "./utils/logger"

const { ethers, network } = hre
const rpcProvider = ethers.provider
const chainId = network.config.chainId!
const wssProvider = new ethers.providers.WebSocketProvider(networkConfig[chainId].wssUrl)
const targetContracts = networkConfig[chainId].targetContracts

async function mevBot() {
  console.log(`Running: mevBot`, {
    Chain: networkConfig[chainId].name,
    RpcProvider: rpcProvider.connection.url,
    WssProvider: wssProvider.connection.url,
  })

  const okLogging = await yesno({ question: `Enable Logging?` })
  if (okLogging) {
    mevBotTransportFile.on("logged", async function (info) {
      await logHumanReadable(info, hre)
    })
  }
  const okRev = await yesno({ question: `Attach mevBotReverse?` })
  if (okRev) await mevBotReverse()

  console.log(`Waiting for transactions...`)

  wssProvider.on("pending", txHash => {
    // console.log(txHash)
    wssProvider.getTransaction(txHash).then(async function (memPoolTx) {
      try {
        console.log(memPoolTx.from)

        const target = targetContracts[memPoolTx.to!]
        const signerIdx = target.signers[memPoolTx.from]
        const mevBotSigner = rpcProvider.getSigner(signerIdx)
        const data = hexDataSlice(memPoolTx.data, 4)

        const mevBotTx = await mevBotSigner.sendTransaction({
          to: target.copyContractAddr,
          gasLimit: memPoolTx.gasLimit,
          data: hexConcat([target.mainFunc, data]),
          nonce: await mevBotSigner.getTransactionCount(),
          maxFeePerGas: memPoolTx.maxFeePerGas,
          maxPriorityFeePerGas: memPoolTx.maxPriorityFeePerGas,
          gasPrice: memPoolTx.maxFeePerGas ? undefined : memPoolTx.gasPrice,
        })
        await tempLog(target, memPoolTx, mevBotTx, wssProvider.blockNumber)
      } catch (err) {
        if (
          memPoolTx != null &&
          memPoolTx.to! in targetContracts &&
          targetContracts[memPoolTx.to!].signers[memPoolTx.from] != undefined
        ) {
          await tempErrorLog(err, targetContracts[memPoolTx.to!], memPoolTx, wssProvider.blockNumber)
        }
      }
    })
  })
}

mevBot().catch(error => {
  logger.error(error)
  // process.exitCode = 1
})
