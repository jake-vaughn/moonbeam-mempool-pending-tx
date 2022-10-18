import { TransactionReceipt, TransactionResponse } from "@ethersproject/providers"
import { ethers } from "hardhat"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import path from "path"
import winston from "winston"

import { getErrorMessage } from "./utils/getErrorMessage"

const { format, transports } = winston

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
    (info.metadata.memHash ? ` https://moonscan.io/tx/` + info.metadata.memHash : "") +
    (info.metadata.mevHash ? ` https://moonscan.io/tx/` + info.metadata.mevHash : ""),
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
      if (getErrorMessage(error) == "timeout exceeded (timeout=600000, code=TIMEOUT, version=providers/5.7.0)") {
        return [
          await ethers.provider.getTransactionReceipt(
            "0x78789539aba360cdd8ca2ceddc2ba799f1e05f557b96402323f7bacf006c56b3",
          ),
          "🕑",
        ]
      }
    }
    throw error
  }
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// function receiptLogParse(logs: Log[]): [string, string] {
//   let wadSent = "0"
//   if (logs.length == 0) {
//     return ["failed", wadSent]
//   }
//   const wadSentHex = logs.at(0)!.data
//   const amount1OutHex = ethers.utils.hexDataSlice(logs.at(logs.length - 1)!.data, 32 * 3)
//   // console.log(wadSentHex, `\n`, amount1OutHex)
//   // console.log(BigNumber.from(wadSentHex).toString(), BigNumber.from(amount1OutHex).toString())
//   wadSent = ethers.utils.formatEther(BigNumber.from(wadSentHex))
//   wadSent = wadSent.slice(0, wadSent.length - 16)
