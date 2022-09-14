import { Log, TransactionReceipt } from "@ethersproject/providers"
import chalk from "chalk"
import { BigNumber } from "ethers"
import { ethers } from "hardhat"

// import { networkConfig, targetContractItem } from "../../helper-hardhat-config"
import { getErrorMessage } from "./utils/getErrorMessage"
import { loggerHumanReadable, target3Transport } from "./utils/logger"

export async function logHumanReadable(info: any) {
  try {
    // console.log(info.message, md)
    const md = info.metadata

    if (
      typeof md !== "object" ||
      md === null ||
      !("from" in md) ||
      !("memPoolHash" in md) ||
      !("mevBotHash" in md) ||
      !("txReported" in md) ||
      !("txFound" in md) ||
      !("name" in md) ||
      !("signer" in md) ||
      !("to" in md) ||
      !("type" in md)
    ) {
      throw new Error("type of log does not match")
    }

    const [memReceipt, memSuccess] = await receiptWaitHandler(md.memPoolHash)
    const [mevReceipt, mevSuccess] = await receiptWaitHandler(md.mevBotHash)

    let blockPosition: string
    if (memReceipt == undefined || mevReceipt == undefined) {
      blockPosition = "Tx was dropped"
    } else {
      if (memReceipt.blockNumber == mevReceipt.blockNumber) {
        if (memReceipt.transactionIndex >= mevReceipt.transactionIndex) {
          blockPosition = `AHEAD  [${memReceipt.transactionIndex - mevReceipt.transactionIndex}] Index `
        } else {
          blockPosition = `BEHIND [${mevReceipt.transactionIndex - memReceipt.transactionIndex}] Index `
        }
      } else if (memReceipt.blockNumber >= mevReceipt.blockNumber) {
        blockPosition = `AHEAD  [${memReceipt.blockNumber - mevReceipt.blockNumber}] Block `
      } else {
        blockPosition = `BEHIND [${mevReceipt.blockNumber - memReceipt.blockNumber}] Block `
      }
    }

    await loggerHumanReadable.debug(`${md.name}:`, {
      status: `[${memSuccess}] [${mevSuccess}]`,
      blockPosition: blockPosition,
      logId: `${md.txReported}/${md.txFound}`,
      memHash: md.memPoolHash,
      mevHash: md.mevBotHash,
    })
  } catch (err) {
    loggerHumanReadable.error(err + " INFO:" + JSON.stringify(info))
  }
  return
}

async function receiptWaitHandler(hash: any): Promise<[TransactionReceipt | undefined, string]> {
  try {
    const receipt = await ethers.provider.waitForTransaction(hash, 1, 1694200)
    if (receipt.logs.length == 0) {
      return [receipt, "F"]
    }
    return [receipt, "T"]
  } catch (error) {
    return [undefined, "D"]
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

//   return ["success", wadSent]
// }

// async function receiptLogger(
//   target: targetContractItem,
//   memPoolTx: TransactionResponse,
//   mevBotTx: TransactionResponse,
//   mevBotGasEstimate?: BigNumber,
// ) {
//   const memPoolTxReceipt = await handleWait(memPoolTx)
//   const mevBotTxReceipt = await handleWait(mevBotTx)
//   let blockPosition: string
//   if (memPoolTxReceipt.blockNumber == mevBotTxReceipt.blockNumber) {
//     if (memPoolTxReceipt.transactionIndex >= mevBotTxReceipt.transactionIndex) {
//       blockPosition = `Same Block: index ${chalk.greenBright(`Ahead`)} mevIdx: ${chalk.yellow(
//         mevBotTxReceipt.transactionIndex,
//       )} vs memIdx: ${chalk.yellow(memPoolTxReceipt.transactionIndex)}`
//     } else {
//       blockPosition = `Same Block: index ${chalk.redBright(`Behind`)} mevIdx: ${chalk.yellow(
//         mevBotTxReceipt.transactionIndex,
//       )} vs memIdx: ${chalk.yellow(memPoolTxReceipt.transactionIndex)}`
//     }
//   } else if (memPoolTxReceipt.blockNumber >= mevBotTxReceipt.blockNumber) {
//     blockPosition = `${chalk.greenBright(`Ahead`)} by ${chalk.yellow(
//       memPoolTxReceipt.blockNumber - mevBotTxReceipt.blockNumber,
//     )} blocks`
//   } else {
//     blockPosition = `${chalk.redBright(`Behind`)} by ${chalk.yellow(
//       mevBotTxReceipt.blockNumber - memPoolTxReceipt.blockNumber,
//     )} blocks`
//   }

//   const statusWithColor = mevBotTxReceipt.status
//     ? chalk.greenBright(mevBotTxReceipt.status)
//     : chalk.redBright(mevBotTxReceipt.status)

//   logger.info(
//     `${chalk.greenBright(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`)}\n` +
//       `${chalk.greenBright(`Target Name:  ${target.name}`)}\n` +
//       `memPoolTxReceipt transactionHash: ${chalk.cyan(memPoolTxReceipt.transactionHash)}\n` +
//       `mevBotTxReceipt transactionHash:  ${chalk.cyan(mevBotTxReceipt.transactionHash)}\n` +
//       // `Blocks Behind Detected:           ${chalk.yellow(mevBotTxReceipt.blockNumber - blockNumDesired!)}\n`+
//       `memPoolTxReceipt blockNumber:     ${chalk.yellow(memPoolTxReceipt.blockNumber)}\n` +
//       `mevBotTxReceipt blockNumber:      ${chalk.yellow(mevBotTxReceipt.blockNumber)}\n` +
//       `${blockPosition}\n` +
//       `memPoolTxReceipt status:          ${chalk.yellow(memPoolTxReceipt.status)}\n` +
//       `mevBotTxReceipt status:           ${statusWithColor}\n` +
//       `mevBotTx estimateGas:             ${chalk.yellow(mevBotGasEstimate)}\n` +
//       `mevBotTxReceipt gasUsed:          ${chalk.yellow(mevBotTxReceipt.gasUsed)}\n` +
//       `${chalk.greenBright(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`)}\n`,
//   )
//   return
// }

// async function errorLogger(err: unknown, target: targetContractItem, memPoolTx: TransactionResponse) {
//   const signerIdx = target.signers[memPoolTx.from]
//   const mevBotSigner = ethers.provider.getSigner(signerIdx)
//   const memPoolTxReceipt = await handleWait(memPoolTx)
//   if (
//     getErrorMessage(err) == "execution fatal: Module(ModuleError { index: 51, error: [0, 0, 0, 0], message: None })"
//   ) {
//     logger.error(err)
//   }
//   logger.error(
//     `${chalk.redBright(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`)}\n` +
//       `${chalk.redBright(`Pending listener failed with error:`)}\n` +
//       getErrorMessage(err) +
//       chalk.redBright(`\n\nTarge Name: ${target.name}\n`) +
//       `memPoolTxReceipt transactionHash: ${chalk.cyan(memPoolTxReceipt.transactionHash)}\n` +
//       `memPoolTxReceipt blockNumber: ${chalk.yellow(memPoolTxReceipt.blockNumber)}\n` +
//       `memPoolTxReceipt status: ${chalk.yellow(memPoolTxReceipt.status)}\n` +
//       `\n` +
//       `memPoolTx.from: ${chalk.cyan(memPoolTx.from)} \n` +
//       `target.signer: ${chalk.cyan(await mevBotSigner.getAddress())}\n` +
//       `signerIdx: ${chalk.yellow(signerIdx)}\n` +
//       `${chalk.redBright(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`)}\n`,
//   )
//   return
// }

// async function handleWait(tx: TransactionResponse) {
//   try {
//     const chainId = network.config.chainId!
//     const txReceipt = await tx.wait(networkConfig[chainId].blockConfirmations)
//     return txReceipt
//   } catch (error: any) {
//     if (error !== null && "receipt" in error) {
//       const txReceipt: TransactionReceipt = error.receipt
//       return txReceipt
//     }
//     throw error
//   }
// }

// console.log(
//   `
//     `~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`,
//   )}\n` +
//     ``Target Name: ${md.name}`)}\n` +
//     `memReceipt transactionHash: ${chalk.cyan(memReceipt.transactionHash)}\n` +
//     `mevReceipt transactionHash: ${chalk.cyan(mevReceipt.transactionHash)}\n` +
//     // `Blocks Behind Detected: ${chalk.yellow(mevReceipt.blockNumber - blockNumDesired!)}\n`+
//     `memReceipt blockNumber: ${chalk.yellow(memReceipt.blockNumber)}\n` +
//     `mevReceipt blockNumber: ${chalk.yellow(mevReceipt.blockNumber)}\n` +
//     `${blockPosition}\n` +
//     `memReceipt status: ${chalk.yellow(memReceipt.status)}\n` +
//     `mevReceipt status: ${statusWithColor}\n` +
//     // `mevBotTx estimateGas: ${chalk.yellow(mevBotGasEstimate)}\n` +
//     `mevReceipt gasUsed: ${chalk.yellow(mevReceipt.gasUsed)}\n` +
//     `
//       `~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`,
//     )}\n`,
// )
