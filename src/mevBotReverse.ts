import { TransactionResponse } from "@ethersproject/providers"
import { BigNumber, utils } from "ethers"
import hre from "hardhat"

import { functionHashes } from "../const/addresses"
import { wssUrl } from "../hardhat.config"
import { networkConfig, targetContractItem } from "../helper-hardhat-config"
import { logHumanReadable } from "./logHumanReadable"
import { generateRandomNumber } from "./utils/generateRandomNumber"
import { logger, mevBotTransportFile } from "./utils/logger"

const { ethers, network } = hre
const chainId = network.config.chainId!

const wssProvider = new ethers.providers.WebSocketProvider(wssUrl!)
const targetArbs = networkConfig[chainId].targetArbs
let txReported: number = 0

async function mevBotReverse() {
  console.log("debug", `Running: mevBot `, {
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
        const functionHash = utils.hexDataSlice(memPoolTx.data, 0, 4)
        const target = targetArbs[functionHash]
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
        // if (
        //   memPoolTx != null &&
        //   memPoolTx.to! in targetArbs &&
        //   targetArbs[functionHash].signers[memPoolTx.from] != undefined
        // ) {
        //   await tempErrorLog(err, targetArbs[functionHash], memPoolTx)
        // }
      }
    })
  })
}

async function ArbSwapExactETHForTokens(memPoolTx: TransactionResponse, target: targetContractItem) {
  try {
    const dataArray: string[] = []
    var paramArray: string[]

    paramArray = []
    paramArray.push("0x68c9718a")
    paramArray.push("0x0000000000000000000000000000000000000000000000000000000000000080")
    paramArray.push("0x0000000000000000000000000000000000000000000000000000000000000100")
    paramArray.push("0x0000000000000000000000000000000000000000000000000000000000000160")
    paramArray.push("0x000006400000000000000000000000000000000000000640000007b000000009")
    paramArray.push("0x0000000000000000000000000000000000000000000000000000000000000003")
    paramArray.push("0x0000000000000000000000000000000000000000000000000000000000000000")
    paramArray.push("0x000000000000000000000000fffffffecb45afd30a637967995394cc88c0c194")
    paramArray.push("0x0000000000000000000000000000000000000000000000000000000000000000")
    paramArray.push("0x0000000000000000000000000000000000000000000000000000000000000002")
    paramArray.push("0x000000000000000000000000000000000000022c0d9f000000000bb800000000")
    paramArray.push("0x000000000000000000000000000000000000022c0d9f0000000009c400000000")
    paramArray.push("0x0000000000000000000000000000000000000000000000000000000000000002")
    paramArray.push("0x000000000000000000000000a049a6260921b5ee3183cfb943133d36d7fdb668")
    paramArray.push("0x0000000000000000000000004efb208eeeb5a8c85af70e8fbc43d6806b422bec")
    dataArray.push(utils.hexConcat(paramArray))

    paramArray = []
    paramArray.push("0x68c9718a")
    paramArray.push("0x0000000000000000000000000000000000000000000000000000000000000080")
    paramArray.push("0x0000000000000000000000000000000000000000000000000000000000000100")
    paramArray.push("0x0000000000000000000000000000000000000000000000000000000000000160")
    paramArray.push("0x000006400000000000000000000000000000000000000640000007b000000009")
    paramArray.push("0x0000000000000000000000000000000000000000000000000000000000000003")
    paramArray.push("0x0000000000000000000000000000000000000000000000000000000000000000")
    paramArray.push("0x000000000000000000000000fffffffecb45afd30a637967995394cc88c0c194")
    paramArray.push("0x0000000000000000000000000000000000000000000000000000000000000000")
    paramArray.push("0x0000000000000000000000000000000000000000000000000000000000000002")
    paramArray.push("0x000000000000000000000000000000000000022c0d9f0000000009c400000000")
    paramArray.push("0x000000000000000000000000000000000000022c0d9f000000000bb800000000")
    paramArray.push("0x0000000000000000000000000000000000000000000000000000000000000002")
    paramArray.push("0x0000000000000000000000004efb208eeeb5a8c85af70e8fbc43d6806b422bec")
    paramArray.push("0x000000000000000000000000a049a6260921b5ee3183cfb943133d36d7fdb668")
    dataArray.push(utils.hexConcat(paramArray))

    for (const data of dataArray) {
      const signerIdx = generateRandomNumber(71, 131)
      if (signerIdx == undefined) throw new Error("Unknown target.signers[memPoolTx.from]")
      const mevBotSigner = ethers.provider.getSigner(signerIdx)
      const mevBotTx = await mevBotSigner.sendTransaction({
        to: target.copyContractAddr,
        gasLimit: 413400,
        data: data,
        nonce: await mevBotSigner.getTransactionCount(),
        maxPriorityFeePerGas: memPoolTx.maxPriorityFeePerGas,
        maxFeePerGas: memPoolTx.maxFeePerGas,
        gasPrice: memPoolTx.maxFeePerGas ? undefined : memPoolTx.gasPrice,
      })
      await tempLog(target, memPoolTx, mevBotTx)
    }
  } catch (err) {
    await tempErrorLog(err, target, memPoolTx)
  }
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

mevBotReverse().catch(error => {
  logger.error(error)
  // process.exitCode = 1
})
