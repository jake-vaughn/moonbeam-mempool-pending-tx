import { TransactionResponse } from "@ethersproject/providers"
import hre from "hardhat"

import { wssUrl } from "../hardhat.config"
import { networkConfig, targetContractItem } from "../helper-hardhat-config"
import { logHumanReadable } from "./logHumanReadable"
import { logger, mevBotTransportFile } from "./utils/logger"

const { ethers, network } = hre
const chainId = network.config.chainId!

const wssProvider = new ethers.providers.WebSocketProvider(wssUrl!)
const targetContracts = networkConfig[chainId].targetContracts
let txReported: number = 0

async function mevBotCopier() {
  console.log("debug", `Running: mevBotCopier `, {
    Chain: networkConfig[chainId].name,
    RpcProvider: ethers.provider.connection.url,
    WssProvider: wssProvider.connection.url,
  })

  mevBotTransportFile.on("logged", async function (info) {
    await logHumanReadable(info)
  })

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
        await tempLog(target, memPoolTx, mevBotTx)
      } catch (err) {
        if (
          memPoolTx != null &&
          memPoolTx.to! in targetContracts &&
          targetContracts[memPoolTx.to!].signers[memPoolTx.from] != undefined
        ) {
          await tempErrorLog(err, targetContracts[memPoolTx.to!], memPoolTx)
        }
      }
    })
  })
}

async function tempLog(target: targetContractItem, memPoolTx: TransactionResponse, mevBotTx: TransactionResponse) {
  txReported++
  logger.debug(`${txReported}`, {
    memPoolTx: memPoolTx,
    mevBotTx: mevBotTx,
    blockFound: ethers.provider.blockNumber,
    txReported: txReported,
    name: target.name,
    type: target.type,
    signer: target.signers[memPoolTx.from],
  })
}

async function tempErrorLog(err: unknown, target: targetContractItem, memPoolTx: TransactionResponse) {
  txReported++
  logger.error(`error ${txReported}`, {
    memPoolTx: memPoolTx,
    blockFound: ethers.provider.blockNumber,
    txReported: txReported,
    name: target.name,
    type: target.type,
    signer: target.signers[memPoolTx.from],
    error: err,
  })
}

mevBotCopier().catch(error => {
  logger.error(error)
  // process.exitCode = 1
})
