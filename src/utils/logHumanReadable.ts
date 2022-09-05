import { TransactionReceipt, TransactionResponse } from "@ethersproject/providers"
import chalk from "chalk"
import { BigNumber } from "ethers"
import { ethers, network } from "hardhat"

import { networkConfig, targetContractItem } from "../../helper-hardhat-config"
import { getErrorMessage } from "./getErrorMessage"
import { logger } from "./logger"

async function receiptLogger(
  target: targetContractItem,
  memPoolTx: TransactionResponse,
  mevBotTx: TransactionResponse,
  mevBotGasEstimate?: BigNumber,
) {
  const memPoolTxReceipt = await handleWait(memPoolTx)
  const mevBotTxReceipt = await handleWait(mevBotTx)
  let blockPosition: string
  if (memPoolTxReceipt.blockNumber == mevBotTxReceipt.blockNumber) {
    if (memPoolTxReceipt.transactionIndex >= mevBotTxReceipt.transactionIndex) {
      blockPosition = `Same Block: index ${chalk.greenBright(`Ahead`)} mevIdx: ${chalk.yellow(
        mevBotTxReceipt.transactionIndex,
      )} vs memIdx: ${chalk.yellow(memPoolTxReceipt.transactionIndex)}`
    } else {
      blockPosition = `Same Block: index ${chalk.redBright(`Behind`)} mevIdx: ${chalk.yellow(
        mevBotTxReceipt.transactionIndex,
      )} vs memIdx: ${chalk.yellow(memPoolTxReceipt.transactionIndex)}`
    }
  } else if (memPoolTxReceipt.blockNumber >= mevBotTxReceipt.blockNumber) {
    blockPosition = `${chalk.greenBright(`Ahead`)} by ${chalk.yellow(
      memPoolTxReceipt.blockNumber - mevBotTxReceipt.blockNumber,
    )} blocks`
  } else {
    blockPosition = `${chalk.redBright(`Behind`)} by ${chalk.yellow(
      mevBotTxReceipt.blockNumber - memPoolTxReceipt.blockNumber,
    )} blocks`
  }

  const statusWithColor = mevBotTxReceipt.status
    ? chalk.greenBright(mevBotTxReceipt.status)
    : chalk.redBright(mevBotTxReceipt.status)

  logger.info(
    `${chalk.greenBright(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`)}\n` +
      `${chalk.greenBright(`Target Name:  ${target.name}`)}\n` +
      `memPoolTxReceipt transactionHash: ${chalk.cyan(memPoolTxReceipt.transactionHash)}\n` +
      `mevBotTxReceipt transactionHash:  ${chalk.cyan(mevBotTxReceipt.transactionHash)}\n` +
      // `Blocks Behind Detected:           ${chalk.yellow(mevBotTxReceipt.blockNumber - blockNumDesired!)}\n`+
      `memPoolTxReceipt blockNumber:     ${chalk.yellow(memPoolTxReceipt.blockNumber)}\n` +
      `mevBotTxReceipt blockNumber:      ${chalk.yellow(mevBotTxReceipt.blockNumber)}\n` +
      `${blockPosition}\n` +
      `memPoolTxReceipt status:          ${chalk.yellow(memPoolTxReceipt.status)}\n` +
      `mevBotTxReceipt status:           ${statusWithColor}\n` +
      `mevBotTx estimateGas:             ${chalk.yellow(mevBotGasEstimate)}\n` +
      `mevBotTxReceipt gasUsed:          ${chalk.yellow(mevBotTxReceipt.gasUsed)}\n` +
      `${chalk.greenBright(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`)}\n`,
  )
  return
}

async function errorLogger(err: unknown, target: targetContractItem, memPoolTx: TransactionResponse) {
  const signerIdx = target.signers[memPoolTx.from]
  const mevBotSigner = ethers.provider.getSigner(signerIdx)
  const memPoolTxReceipt = await handleWait(memPoolTx)
  if (
    getErrorMessage(err) == "execution fatal: Module(ModuleError { index: 51, error: [0, 0, 0, 0], message: None })"
  ) {
    logger.error(err)
  }
  logger.error(
    `${chalk.redBright(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`)}\n` +
      `${chalk.redBright(`Pending listener failed with error:`)}\n` +
      getErrorMessage(err) +
      chalk.redBright(`\n\nTarge Name: ${target.name}\n`) +
      `memPoolTxReceipt transactionHash: ${chalk.cyan(memPoolTxReceipt.transactionHash)}\n` +
      `memPoolTxReceipt blockNumber: ${chalk.yellow(memPoolTxReceipt.blockNumber)}\n` +
      `memPoolTxReceipt status: ${chalk.yellow(memPoolTxReceipt.status)}\n` +
      `\n` +
      `memPoolTx.from: ${chalk.cyan(memPoolTx.from)} \n` +
      `target.signer: ${chalk.cyan(await mevBotSigner.getAddress())}\n` +
      `signerIdx: ${chalk.yellow(signerIdx)}\n` +
      `${chalk.redBright(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`)}\n`,
  )
  return
}

async function handleWait(tx: TransactionResponse) {
  try {
    const chainId = network.config.chainId!
    const txReceipt = await tx.wait(networkConfig[chainId].blockConfirmations)
    return txReceipt
  } catch (error: any) {
    if (error !== null && "receipt" in error) {
      const txReceipt: TransactionReceipt = error.receipt
      return txReceipt
    }
    throw error
  }
}
