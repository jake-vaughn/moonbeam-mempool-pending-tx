import { TransactionReceipt, TransactionResponse } from "@ethersproject/providers"
import chalk from "chalk"
import { BigNumber, Signer } from "ethers"
import hre from "hardhat"

import { networkConfig, targetContractItem } from "../helper-hardhat-config"
import { getErrorMessage } from "./utils/getErrorMessage"

const ethers = hre.ethers
const chainId = hre.network.config.chainId!
const wsProvider = new hre.ethers.providers.WebSocketProvider(networkConfig[chainId].websocket!)
const targetContracts = networkConfig[chainId].targetContracts

async function mevBot() {
  console.log(
    chalk.green(`Running mevBot...\n`),
    `Chain:            ${networkConfig[chainId].name}\n`,
    `RPC Provider:     ${"*TODO*"}\n`,
    `WS Provider:      ${networkConfig[chainId].websocket!}\n`,
    `Waiting for a memPoolTx target...`,
  )

  wsProvider.on("pending", txHash => {
    wsProvider.getTransaction(txHash).then(async function (memPoolTx) {
      for (const targetAddr in targetContracts) {
        const target = targetContracts[targetAddr]
        if (target.active && memPoolTx != null && memPoolTx.to == targetAddr) {
          switch (target.type) {
            case 1:
              await type1(memPoolTx, target)
              break
            case 3:
              await target3(memPoolTx, target)
              break
            case 99:
              console.log(
                `~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n`,
                chalk.green(`type 99 found\n`),
                `Target name: ${target.name}\n`,
                `Block Number: ${chalk.cyan(await ethers.provider.getBlockNumber())}`,
                `From ${memPoolTx.from}`,
              )
              break
            default:
              console.log("Something wrong")
              break
          }
        }
      }
    })
  })
}

async function type1(memPoolTx: TransactionResponse, target: targetContractItem) {
  try {
    const mevBotSigner = ethers.provider.getSigner(target.signers[memPoolTx.from])
    const blockNumDesired = (await ethers.provider.getBlockNumber()) + 1
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
      await receiptLogger(target, memPoolTx, mevBotTx, mevBotGasEstimate, blockNumDesired)
    }
  } catch (err) {
    await errorLogger(err, target, memPoolTx)
  }
}

async function target3(memPoolTx: TransactionResponse, target: targetContractItem) {
  try {
    const signerIdx = target.signers[memPoolTx.from]
    if (signerIdx == undefined) {
      throw new Error("Unknown Address Called in a type 2 transaction")
    }
    const accounts: Signer[] = await ethers.getSigners()
    const mevBotSigner: Signer = accounts[signerIdx]
    const blockNumDesired = (await ethers.provider.getBlockNumber()) + 1
    const mevBotGasEstimate = await mevBotSigner.estimateGas({
      to: target.copyContractAddr,
      data: memPoolTx.data,
      gasLimit: 500000,
      maxFeePerGas: memPoolTx.maxFeePerGas!.toNumber() + 1000000000,
      maxPriorityFeePerGas: memPoolTx.maxPriorityFeePerGas!.toNumber() + 1000000000,
    })

    console.log(
      `~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n`,
      `memPoolTx.hash: ${chalk.cyan(memPoolTx.hash)}\n`,
      `estimateGas: ${chalk.yellow(mevBotGasEstimate)}\n`,
      `memPoolTx.from: ${chalk.cyan(memPoolTx.from)} \n`,
      `target.signer: ${chalk.cyan(await mevBotSigner.getAddress())}\n`,
      `signerIdx: ${chalk.yellow(signerIdx)}\n`,
      `~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n`,
    )

    // if (mevBotGasEstimate.toNumber() > 0) {
    //     const mevBotTx = await mevBotSigner.sendTransaction({
    //         to: target.copyContractAddr,
    //         data: memPoolTx.data,
    //         gasLimit: 500000,
    //         maxFeePerGas: memPoolTx.maxFeePerGas!.toNumber() + 1000000000,
    //         maxPriorityFeePerGas: memPoolTx.maxPriorityFeePerGas!.toNumber() + 1000000000,
    //     })
    //     await receiptLogger(target, memPoolTx, mevBotTx, mevBotGasEstimate, blockNumDesired)
    // }
  } catch (err) {
    await errorLogger(err, target, memPoolTx)
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
  blockNumDesired?: number,
) {
  const memPoolTxReceipt = await handleWait(memPoolTx)
  const mevBotTxReceipt = await handleWait(mevBotTx)
  const statusWithColor = mevBotTxReceipt.status
    ? chalk.greenBright(mevBotTxReceipt.status)
    : chalk.redBright(mevBotTxReceipt.status)
  console.log(
    chalk.greenBright(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n`),
    chalk.greenBright(`Target Name:  ${target.name}\n`),
    `memPoolTxReceipt transactionHash: ${chalk.cyan(memPoolTxReceipt.transactionHash)}\n`,
    `mevBotTxReceipt transactionHash:  ${chalk.cyan(mevBotTxReceipt.transactionHash)}\n`,
    `Blocks Behind:                    ${chalk.yellow(mevBotTxReceipt.blockNumber - blockNumDesired!)}\n`,
    `memPoolTxReceipt blockNumber:     ${chalk.yellow(memPoolTxReceipt.blockNumber)}\n`,
    `mevBotTxReceipt blockNumber:      ${chalk.yellow(mevBotTxReceipt.blockNumber)}\n`,
    `memPoolTxReceipt status:          ${chalk.yellow(memPoolTxReceipt.status)}\n`,
    `mevBotTxReceipt status:           ${statusWithColor}\n`,
    `mevBotTx estimateGas:             ${chalk.yellow(mevBotGasEstimate)}\n`,
    `mevBotTxReceipt gasUsed:          ${chalk.yellow(mevBotTxReceipt.gasUsed)}\n`,
    chalk.greenBright(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n`),
  )
}

async function errorLogger(err: unknown, target: targetContractItem, memPoolTx: TransactionResponse) {
  const signerIdx = target.signers[memPoolTx.from]
  const mevBotSigner = ethers.provider.getSigner(signerIdx)
  const memPoolTxReceipt = await handleWait(memPoolTx)
  if (
    getErrorMessage(err) == "execution fatal: Module(ModuleError { index: 51, error: [0, 0, 0, 0], message: None })"
  ) {
    console.log(err)
  }
  console.log(
    chalk.redBright(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n`),
    chalk.redBright(`Pending listener failed with error:\n`),
    getErrorMessage(err),
    chalk.redBright(`\n\nTarge Name: ${target.name}\n`),
    `memPoolTxReceipt transactionHash: ${chalk.cyan(memPoolTxReceipt.transactionHash)}\n`,
    `memPoolTxReceipt blockNumber: ${chalk.yellow(memPoolTxReceipt.blockNumber)}\n`,
    `memPoolTxReceipt status: ${chalk.yellow(memPoolTxReceipt.status)}\n`,
    `\n`,
    `memPoolTx.from: ${chalk.cyan(memPoolTx.from)} \n`,
    `target.signer: ${chalk.cyan(await mevBotSigner.getAddress())}\n`,
    `signerIdx: ${chalk.yellow(signerIdx)}\n`,
    chalk.redBright(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n`),
  )
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
mevBot().catch(error => {
  console.error(error)
  process.exitCode = 1
})
