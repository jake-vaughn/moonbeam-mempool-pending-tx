import { BigNumber } from "@ethersproject/bignumber"
import { TransactionReceipt, TransactionResponse } from "@ethersproject/providers"
import { ethers, network } from "hardhat"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import path from "path"
import winston from "winston"

import { networkConfig } from "../../helper-hardhat-config"
import { getErrorMessage } from "./getErrorMessage"

const { format, transports } = winston
const chainId = network.config.chainId!
const netConf = networkConfig[chainId]

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Human Readable
const logFormatHumanReadable = format.printf(
  info =>
    `${info.timestamp} ` +
    `${info.message}` +
    (info.metadata.status ? ` ${info.metadata.status}` : "") +
    (info.metadata.blockPosition ? ` ${info.metadata.blockPosition}` : "") +
    (info.metadata.logId ? ` ${info.metadata.logId}` : "") +
    (info.metadata.errMsg ? ` ${info.metadata.errMsg}` : "") +
    (info.metadata.memHash ? ` ${netConf.etherScan}` + info.metadata.memHash : "") +
    (info.metadata.mevHash ? ` ${netConf.etherScan}` + info.metadata.mevHash : ""),
)

export const logHumanReadableTransportFile = new transports.File({
  filename: "logs/mevBotReceipts.log",
  format: format.combine(logFormatHumanReadable),
})

export const loggerHumanReadable = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: format.combine(
    format.label({ label: path.basename("../mevBot", ".ts") }),
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    // Format the metadata object
    format.metadata({ fillExcept: ["message", "level", "timestamp", "label"] }),
  ),
  transports: [logHumanReadableTransportFile],
  exitOnError: false,
})

export async function logHumanReadable(info: any, hre: HardhatRuntimeEnvironment) {
  try {
    // console.log(info.message, md)
    const md = info.metadata

    if ("error" in md) {
      const receipt1 = await receiptWaitHandler(md.memPoolTx, md.blockFound, hre)
      const [memReceipt, memSuccess] = receipt1

      await loggerHumanReadable.error(`${md.name}:`, {
        status: `${memSuccess}`,
        logId: `${md.txReported}`,
        memHash: memReceipt.transactionHash,
        errMsg: getErrorMessage(md.error),
      })
      return
    }

    await delay(100000 + md.txReported * 10)
    const [receipt1, receipt2] = await Promise.all([
      receiptWaitHandler(md.memPoolTx, md.blockFound, hre),
      receiptWaitHandler(md.mevBotTx, md.blockFound, hre),
    ])
    const [memReceipt, memSuccess] = receipt1
    const [mevReceipt, mevSuccess] = receipt2

    let blockPosition: string

    if (memReceipt.blockNumber == mevReceipt.blockNumber) {
      if (memReceipt.transactionIndex >= mevReceipt.transactionIndex) {
        blockPosition = `✅[${memReceipt.transactionIndex - mevReceipt.transactionIndex}]`
      } else {
        blockPosition = `❌[${mevReceipt.transactionIndex - memReceipt.transactionIndex}]`
      }
    } else if (memReceipt.blockNumber >= mevReceipt.blockNumber) {
      blockPosition = `🟩[${memReceipt.blockNumber - mevReceipt.blockNumber}]`
    } else {
      blockPosition = `🟥[${mevReceipt.blockNumber - memReceipt.blockNumber}]`
    }

    await loggerHumanReadable.debug(`${md.name}:`, {
      status: `${memSuccess} ${mevSuccess}`,
      blockPosition: blockPosition,
      logId: `${md.txReported}`,
      memHash: memReceipt.transactionHash,
      mevHash: mevReceipt.transactionHash,
    })
  } catch (err) {
    loggerHumanReadable.error(getErrorMessage(err) + " INFO:" + JSON.stringify(info))
  }
  return
}

async function receiptWaitHandler(
  response: TransactionResponse,
  startBlock: number,
  hre: HardhatRuntimeEnvironment,
): Promise<[TransactionReceipt, string]> {
  try {
    const { ethers } = hre
    let replacement = undefined
    replacement = {
      data: response.data,
      from: response.from,
      nonce: response.nonce,
      to: response.to!,
      value: response.value,
      startBlock,
    }

    const receipt = await ethers.provider._waitForTransaction(response.hash, 6, 600000, replacement)
    if (receipt.logs.length == 0) {
      return [receipt, "🔴"]
    }
    return [receipt, "🟢"]
  } catch (error: any) {
    if (error !== null && "reason" in error) {
      const receipt: TransactionReceipt = error.receipt

      if (error.reason == "transaction failed") {
        return [receipt, "🔴"]
      }
      if (error.reason == "replaced" || error.reason == "repriced") {
        if (receipt.logs.length == 0) {
          return [receipt, "⛔"]
        }
        return [receipt, "🌎"]
      }
      if (getErrorMessage(error) == "timeout exceeded (timeout=600000, code=TIMEOUT, version=providers/5.7.2)") {
        return [fakeTxReceipt, "🕑"]
      }
    }
    throw error
  }
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const fakeTxReceipt: TransactionReceipt = {
  to: "0x0000000000000000000000000000000000000000000000000000000000000000",
  from: "0x0000000000000000000000000000000000000000000000000000000000000000",
  contractAddress: "0x0000000000000000000000000000000000000000000000000000000000000000",
  transactionIndex: 0,
  gasUsed: BigNumber.from(0),
  logsBloom: "",
  blockHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
  transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
  logs: [],
  blockNumber: 0,
  confirmations: 0,
  cumulativeGasUsed: BigNumber.from(0),
  effectiveGasPrice: BigNumber.from(0),
  byzantium: true,
  type: 0,
  status: 1,
}
