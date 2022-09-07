import { TransactionReceipt, TransactionResponse } from "@ethersproject/providers"
import chalk from "chalk"
import { BigNumber } from "ethers"
import { ethers, network } from "hardhat"
import { createLogger, format, transports } from "winston"

import { logger, loggerHumanReadable, mevBotTransportFile } from "./utils/logger"

// import { networkConfig, targetContractItem } from "../../helper-hardhat-config"
// import { getErrorMessage } from "./getErrorMessage"

let txLogged = 0
let txLogFound = 0
let txLogCalled = -1

export async function logHumanReadable(info: any) {
  console.log(info.message, info.metadata)
  txLogCalled++
  if (
    typeof info.metadata === "object" &&
    info.metadata !== null &&
    "from" in info.metadata &&
    "memPoolHash" in info.metadata &&
    "mevBotHash" in info.metadata &&
    "txReported" in info.metadata &&
    "txFound" in info.metadata &&
    "name" in info.metadata &&
    "signer" in info.metadata &&
    "to" in info.metadata &&
    "type" in info.metadata
  ) {
    txLogFound++
    const md = info.metadata
    const memHash = md.memPoolHash
    const mevHash = md.mevBotHash
    const memReceipt = await ethers.provider.waitForTransaction(memHash, 6)
    const mevReceipt = await ethers.provider.waitForTransaction(mevHash, 6)

    if (memReceipt != null && mevReceipt != null) {
      let blockPosition: string
      if (memReceipt.blockNumber == mevReceipt.blockNumber) {
        if (memReceipt.transactionIndex >= mevReceipt.transactionIndex) {
          blockPosition = `Same Block: index Ahead memIdx: ${memReceipt.transactionIndex} vs mevIdx: ${mevReceipt.transactionIndex}`
        } else {
          blockPosition = `Same Block: index Behind memIdx: ${memReceipt.transactionIndex} vs mevIdx: ${mevReceipt.transactionIndex}`
        }
      } else if (memReceipt.blockNumber >= mevReceipt.blockNumber) {
        blockPosition = `Ahead by ${memReceipt.blockNumber - mevReceipt.blockNumber} blocks`
      } else {
        blockPosition = `Behind by ${mevReceipt.blockNumber - memReceipt.blockNumber} blocks`
      }

      const statusWithColor = mevReceipt.status
        ? chalk.greenBright(mevReceipt.status)
        : chalk.redBright(mevReceipt.status)

      txLogged++
      await loggerHumanReadable.debug(
        `${md.name}: ${txLogCalled} ${txLogged}/${txLogFound} ${info.metadata.txReported}/${info.metadata.txFound}`,
        {
          memHash: memReceipt.transactionHash,
          mevHash: mevReceipt.transactionHash,
          blockPosition: blockPosition,
        },
      )

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
    } else {
      await loggerHumanReadable.debug(
        `Failed to find me. ${md.name}: ${txLogCalled} ${txLogged}/${txLogFound} ${info.metadata.txReported}/${info.metadata.txFound}`,
        info,
      )
    }
    return
  }
}

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
