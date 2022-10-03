import { TransactionResponse } from "@ethersproject/providers"
import { BigNumber, utils } from "ethers"
import hre from "hardhat"

import { wssUrl } from "../hardhat.config"
import { networkConfig, targetContractItem } from "../helper-hardhat-config"
import { logHumanReadable } from "./logHumanReadable"
import { logger, mevBotTransportFile } from "./utils/logger"

const { ethers, network } = hre
const chainId = network.config.chainId!

const wssProvider = new ethers.providers.WebSocketProvider(wssUrl!)
const targetContracts = networkConfig[chainId].targetContracts
let txFound: number = 0
let txReported: number = 0

async function mevBot() {
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
          default:
            logger.info("target.type case default")
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
    const mevBotTx = await mevBotSigner.sendTransaction({
      to: target.copyContractAddr,
      gasLimit: 725400,
      data: memPoolTx.data,
      nonce: await mevBotSigner.getTransactionCount(),
      maxFeePerGas: memPoolTx.maxFeePerGas,
      maxPriorityFeePerGas: memPoolTx.maxPriorityFeePerGas,
    })

    await tempLog(target, memPoolTx, mevBotTx)
    return
  } catch (err) {
    await tempErrorLog(err, target, memPoolTx)
    return
  }
}

async function target2(memPoolTx: TransactionResponse, target: targetContractItem) {
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
    if (signerIdx == undefined) throw new Error("Unknown target.signers[memPoolTx.from]")

    const functionHash = utils.hexDataSlice(memPoolTx.data, 0, 4)
    if (functionHash != "0xa2abe54e") throw new Error("FunctionHash was not 0xa2abe54e")

    const wadSentHex = utils.hexDataSlice(memPoolTx.data, 4, 32 + 4)
    if (BigNumber.from(wadSentHex).gt(BigNumber.from("1735000000000000000000")))
      throw new Error(`Skipped ${utils.formatEther(wadSentHex)}`)

    const mevBotSigner = ethers.provider.getSigner(signerIdx)
    const mevBotTx = await mevBotSigner.sendTransaction({
      to: target.copyContractAddr,
      gasLimit: 725400,
      data: memPoolTx.data,
      nonce: await mevBotSigner.getTransactionCount(),
      maxPriorityFeePerGas: memPoolTx.maxPriorityFeePerGas,
      maxFeePerGas: memPoolTx.maxFeePerGas,
    })
    await tempLog(target, memPoolTx, mevBotTx)
    // const feeEstimate = utils.hexDataSlice(memPoolTx.data, 32 + 4, 32 * 2 + 4)
    // const maxPriorityFeePerGas = utils.formatUnits(memPoolTx.maxPriorityFeePerGas!, "gwei")
    // const maxFeePerGas = utils.formatUnits(memPoolTx.maxFeePerGas!, "gwei")
    // console.log(utils.formatEther(feeEstimate), maxPriorityFeePerGas, maxFeePerGas)
  } catch (err) {
    await tempErrorLog(err, target, memPoolTx)
  }
}

async function tempLog(target: targetContractItem, memPoolTx: TransactionResponse, mevBotTx: TransactionResponse) {
  txReported++
  logger.debug(`${txReported}/${txFound}`, {
    memPoolTx: memPoolTx,
    mevBotTx: mevBotTx,
    blockFound: ethers.provider.blockNumber,
    txReported: txReported,
    txFound: txFound,
    name: target.name,
    type: target.type,
    signer: target.signers[memPoolTx.from],
  })
}

async function tempErrorLog(err: unknown, target: targetContractItem, memPoolTx: TransactionResponse) {
  txReported++
  logger.error(`error ${txReported}/${txFound}`, {
    memPoolTx: memPoolTx,
    blockFound: ethers.provider.blockNumber,
    txReported: txReported,
    txFound: txFound,
    name: target.name,
    type: target.type,
    signer: target.signers[memPoolTx.from],
    error: err,
  })
}

mevBot().catch(error => {
  logger.error(error)
  process.exitCode = 1
})
