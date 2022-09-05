import { TransactionReceipt, TransactionResponse } from "@ethersproject/providers"
import chalk from "chalk"
import { BigNumber, Signer } from "ethers"
import hre from "hardhat"

import { networkConfig, targetContractItem } from "../helper-hardhat-config"
import { getErrorMessage } from "./utils/getErrorMessage"
import { logger } from "./utils/logger"

const ethers = hre.ethers
const chainId = hre.network.config.chainId!
const wsProvider = new hre.ethers.providers.WebSocketProvider(networkConfig[chainId].websocket!)
const targetContracts = networkConfig[chainId].targetContracts
let txFound: number = 0
let txReported: number = 0

async function mevBot() {
  logger.info(
    `${chalk.green(`Running mevBot...`)}\n` +
      `Chain:            ${networkConfig[chainId].name}\n` +
      `RPC Provider:     ${"*TODO*"}\n` +
      `WS Provider:      ${networkConfig[chainId].websocket!}\n` +
      `Waiting for a memPoolTx target...`,
  )

  wsProvider.on("pending", txHash => {
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
            logger.info(
              `~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n`,
              chalk.green(`type 99 found\n`),
              `Target name: ${target.name}\n`,
              `Block Number: ${chalk.cyan(await ethers.provider.getBlockNumber())}`,
              `From ${memPoolTx.from}`,
            )
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
      txReported++
      logger.info(
        `~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n` +
          `memPoolTx.hash: ${chalk.cyan(memPoolTx.hash)}\n` +
          // `estimateGas: ${chalk.yellow(mevBotGasEstimate)}\n`+
          `memPoolTx.from: ${chalk.cyan(memPoolTx.from)} \n` +
          `target.signer: ${chalk.cyan(await mevBotSigner.getAddress())}\n` +
          `signerIdx: ${chalk.yellow(signerIdx)}\n` +
          `mevBotTx.hash: ${chalk.cyan(mevBotTx.hash)}\n` +
          `found: ${txFound} reported: ${txReported}` +
          `~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n`,
      )
      // await receiptLogger(target, memPoolTx, mevBotTx, mevBotGasEstimate)
      return
    }
  } catch (err) {
    txReported++
    logger.error(
      `~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n` +
        getErrorMessage(err) +
        `\n\nmemPoolTx.hash: ${chalk.cyan(memPoolTx.hash)}\n` +
        // `estimateGas: ${chalk.yellow(mevBotGasEstimate)}\n`+
        `memPoolTx.from: ${chalk.cyan(memPoolTx.from)} \n` +
        `found: ${txFound} reported: ${txReported}` +
        `~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n`,
      err,
    )
    // await errorLogger(err, target, memPoolTx)
    return
  }
}

async function target3(memPoolTx: TransactionResponse, target: targetContractItem) {
  try {
    const signerIdx = target.signers[memPoolTx.from]
    if (signerIdx == undefined) {
      throw new Error("Unknown From Address")
    }
    const mevBotSigner = ethers.provider.getSigner(signerIdx)

    // const mevBotGasEstimate = await mevBotSigner.estimateGas({
    //   to: target.copyContractAddr,
    //   data: memPoolTx.data,
    //   gasLimit: 1500000,
    //   maxFeePerGas: memPoolTx.maxFeePerGas!.toNumber() + 1000000000,
    //   maxPriorityFeePerGas: memPoolTx.maxPriorityFeePerGas!.toNumber() + 1000000000,
    // })

    const mevBotTx = await mevBotSigner.sendTransaction({
      to: target.copyContractAddr,

      gasLimit: 750000,

      data: memPoolTx.data,

      maxPriorityFeePerGas: memPoolTx.maxPriorityFeePerGas?.add(1),
      maxFeePerGas: memPoolTx.maxFeePerGas?.add(1),
    })

    txReported++
    logger.info(
      `~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n` +
        `memPoolTx.hash: ${chalk.cyan(memPoolTx.hash)}\n` +
        // `estimateGas: ${chalk.yellow(mevBotGasEstimate)}\n`+
        `memPoolTx.from: ${chalk.cyan(memPoolTx.from)} \n` +
        `target.signer: ${chalk.cyan(await mevBotSigner.getAddress())}\n` +
        `signerIdx: ${chalk.yellow(signerIdx)}\n` +
        `mevBotTx.hash: ${chalk.cyan(mevBotTx.hash)}\n` +
        `found: ${txFound} reported: ${txReported}` +
        `~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n`,
    )

    // await receiptLogger(target, memPoolTx, mevBotTx, BigNumber.from(69420))
    return
  } catch (err) {
    txReported++
    logger.error(
      `~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n` +
        getErrorMessage(err) +
        `\n\nmemPoolTx.hash: ${chalk.cyan(memPoolTx.hash)}\n` +
        // `estimateGas: ${chalk.yellow(mevBotGasEstimate)}\n`+
        `memPoolTx.from: ${chalk.cyan(memPoolTx.from)} \n` +
        `found: ${txFound} reported: ${txReported}` +
        `~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n`,
      err,
    )
    // await errorLogger(err, target, memPoolTx)
    return
  }
}

async function handleWait(tx: TransactionResponse) {
  try {
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

  txReported++

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
      `found: ${txFound} reported: ${txReported}` +
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
  txReported++
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

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
mevBot().catch(error => {
  logger.error(error)
  process.exitCode = 1
})
