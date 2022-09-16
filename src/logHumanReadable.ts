import { TransactionReceipt, TransactionResponse } from "@ethersproject/providers"
import hre from "hardhat"

import { getErrorMessage } from "./utils/getErrorMessage"
// import { networkConfig, targetContractItem } from "../../helper-hardhat-config"
import { loggerHumanReadable } from "./utils/logger"

const ethers = hre.ethers

export async function logHumanReadable(info: any) {
  try {
    // console.log(info.message, md)
    const md = info.metadata

    if (
      typeof md !== "object" ||
      md === null ||
      !("memPoolTx" in md) ||
      !("mevBotTx" in md) ||
      !("blockFound" in md) ||
      !("txReported" in md) ||
      !("txFound" in md) ||
      !("name" in md) ||
      !("type" in md) ||
      !("signer" in md)
    ) {
      if (typeof md === "object" || (md !== null && "errMsg" in md)) {
        throw new Error(md.errMsg)
      }
      throw new Error("type of log does not match")
    }

    const [receipt1, receipt2] = await Promise.all([
      receiptWaitHandler(md.memPoolTx, md.blockFound),
      receiptWaitHandler(md.mevBotTx, md.blockFound),
    ])
    const [memReceipt, memSuccess] = receipt1
    const [mevReceipt, mevSuccess] = receipt2

    let blockPosition: string

    if (memReceipt.blockNumber == mevReceipt.blockNumber) {
      if (memReceipt.transactionIndex >= mevReceipt.transactionIndex) {
        blockPosition = `I🟢[${memReceipt.transactionIndex - mevReceipt.transactionIndex}]`
      } else {
        blockPosition = `I🔴[${mevReceipt.transactionIndex - memReceipt.transactionIndex}]`
      }
    } else if (memReceipt.blockNumber >= mevReceipt.blockNumber) {
      blockPosition = `B🟢[${memReceipt.blockNumber - mevReceipt.blockNumber}]`
    } else {
      blockPosition = `B🔴[${mevReceipt.blockNumber - memReceipt.blockNumber}]`
    }

    await loggerHumanReadable.debug(`${md.name}:`, {
      status: `${memSuccess} ${mevSuccess}`,
      blockPosition: blockPosition,
      logId: `${md.txReported}/${md.txFound}`,
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
): Promise<[TransactionReceipt, string]> {
  try {
    let replacement = undefined
    replacement = {
      data: response.data,
      from: response.from,
      nonce: response.nonce,
      to: response.to!,
      value: response.value,
      startBlock,
    }

    const receipt = await ethers.provider._waitForTransaction(response.hash, 1, 0, replacement)
    if (receipt.logs.length == 0) {
      return [receipt, "🟥"]
    }
    return [receipt, "🟩"]
  } catch (error: any) {
    if (error !== null && "reason" in error) {
      const receipt: TransactionReceipt = error.receipt

      if (error.reason == "transaction failed") {
        return [receipt, "🟥"]
      }
      if (error.reason == "replaced") {
        if (receipt.logs.length == 0) {
          return [receipt, "❌"]
        }
        return [receipt, "❎"]
      }
    }
    throw error
  }
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
