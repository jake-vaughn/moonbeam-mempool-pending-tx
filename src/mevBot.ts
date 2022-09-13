import { TransactionReceipt, TransactionResponse } from "@ethersproject/providers"
import chalk from "chalk"
import { BigNumber, Signer } from "ethers"
import hre from "hardhat"

import { moonbeamBlastWssUrl, moonbeamWsUrl, networkConfig, targetContractItem } from "../helper-hardhat-config"
import { logHumanReadable } from "./logHumanReadable"
import { getErrorMessage } from "./utils/getErrorMessage"
import { logger, mevBotTransportFile } from "./utils/logger"

const ethers = hre.ethers
const chainId = hre.network.config.chainId!
const wsProvider = new hre.ethers.providers.WebSocketProvider(moonbeamWsUrl!)
const targetContracts = networkConfig[chainId].targetContracts
let txFound: number = 0
let txReported: number = 0

async function mevBot() {
  mevBotTransportFile.on("logged", async function (info) {
    await logHumanReadable(info)
  })

  console.log("debug", `Running: mevBot `, {
    Chain: networkConfig[chainId].name,
    RpcProvider: ethers.provider.connection.url,
    WsProvider: networkConfig[chainId].websocket,
  })

  wsProvider.on("pending", txHash => {
    // console.log(txHash)
    wsProvider.getTransaction(txHash).then(async function (memPoolTx) {
      if (memPoolTx != null && memPoolTx.to! in targetContracts && targetContracts[memPoolTx.to!].active) {
        const target = targetContracts[memPoolTx.to!]
        txFound++
        switch (target.type) {
          case 1:
            await type1(memPoolTx, target)
            break
          case 3:
            await target3(memPoolTx, target)
            break
          case 99:
            break
          default:
            logger.info("Something wrong")
            break
        }
      }
    })
  })
}

async function type1(memPoolTx: TransactionResponse, target: targetContractItem) {
  try {
    const signerIdx = target.signers[memPoolTx.from]
    if (signerIdx == undefined) {
      throw new Error("Unknown From Address")
    }
    const mevBotSigner = ethers.provider.getSigner(signerIdx)
    const mevBotGasEstimate = await mevBotSigner.estimateGas({
      to: target.copyContractAddr,
      data: memPoolTx.data,
      gasLimit: 1500000,
      maxFeePerGas: 200000000000,
      maxPriorityFeePerGas: 2100000000,
    })

    if (mevBotGasEstimate.toNumber() > 0) {
      const mevBotTx = await mevBotSigner.sendTransaction({
        to: target.copyContractAddr,
        data: memPoolTx.data,
        gasLimit: 1500000,
        maxFeePerGas: 200000000000,
        maxPriorityFeePerGas: 2100000000,
      })
      await tempLog(target, memPoolTx, mevBotTx)
    }
    return
  } catch (err) {
    await tempErrorLog(err, target, memPoolTx)
    return
  }
}

async function target3(memPoolTx: TransactionResponse, target: targetContractItem) {
  try {
    const signerIdx = target.signers[memPoolTx.from]
    if (signerIdx == undefined) {
      throw new Error("Unknown From Address")
    }
    const wadSentHex = ethers.utils.hexDataSlice(memPoolTx.data, 4, 32 + 4)
    const glmrSent = ethers.utils.formatEther(wadSentHex)
    // console.log(
    //   glmrSent,
    //   ethers.utils.formatEther(BigNumber.from("424000000000000000000")),
    //   BigNumber.from(wadSentHex).lte(BigNumber.from("424000000000000000000")),
    // )

    const mevBotSigner = ethers.provider.getSigner(signerIdx)

    console.log()

    if (BigNumber.from(wadSentHex).lte(BigNumber.from("469000000000000000000"))) {
      const mevBotTx = await mevBotSigner.sendTransaction({
        to: target.copyContractAddr,

        gasLimit: 750000,

        data: memPoolTx.data,

        nonce: await mevBotSigner.getTransactionCount(),
        maxPriorityFeePerGas: memPoolTx.maxPriorityFeePerGas,
        maxFeePerGas: memPoolTx.maxFeePerGas,
      })

      await tempLog(target, memPoolTx, mevBotTx)
    }

    return
  } catch (err) {
    await tempErrorLog(err, target, memPoolTx)
    return
  }
}

async function tempLog(target: targetContractItem, memPoolTx: TransactionResponse, mevBotTx: TransactionResponse) {
  txReported++
  logger.debug(`${txReported}/${txFound}:`, {
    memPoolHash: memPoolTx.hash,
    mevBotHash: mevBotTx.hash,
    blockFound: ethers.provider.blockNumber,
    txReported: txReported,
    txFound: txFound,
    name: target.name,
    type: target.type,
    from: memPoolTx.from,
    to: memPoolTx.to,
    signer: target.signers[memPoolTx.from],
  })
  return
}

async function tempErrorLog(
  err: unknown,
  target: targetContractItem,
  memPoolTx: TransactionResponse,
  mevBotTx?: TransactionResponse,
) {
  txReported++
  logger.error(`${txReported}/${txFound}: ${target.name}`, {
    memPoolHash: `${memPoolTx.hash}`,
    error: err,
  })
}
mevBot().catch(error => {
  logger.error(error)
  process.exitCode = 1
})
