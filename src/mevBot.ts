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
  logger.debug(`Running: mevBot `, {
    Chain: networkConfig[chainId].name,
    RpcProvider: ethers.provider.connection.url,
    WsProvider: networkConfig[chainId].websocket,
  })

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
    const mevBotSigner = ethers.provider.getSigner(signerIdx)

    const mevBotTx = await mevBotSigner.sendTransaction({
      to: target.copyContractAddr,

      gasLimit: 750000,

      data: memPoolTx.data,

      maxPriorityFeePerGas: memPoolTx.maxPriorityFeePerGas,
      maxFeePerGas: memPoolTx.maxFeePerGas,
    })

    await tempLog(target, memPoolTx, mevBotTx)
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
    name: target.name,
    type: target.type,
    from: memPoolTx.from,
    to: memPoolTx.to,
    signer: target.signers[memPoolTx.from],
  })
  return
}

async function tempErrorLog(
  error: unknown,
  target: targetContractItem,
  memPoolTx: TransactionResponse,
  mevBotTx?: TransactionResponse,
) {
  txReported++
  logger.error(
    `${txFound}/${txReported}:`,
    {
      memPoolHash: `${memPoolTx.hash}`,
    },
    error,
  )
}
mevBot().catch(error => {
  logger.error(error)
  process.exitCode = 1
})
