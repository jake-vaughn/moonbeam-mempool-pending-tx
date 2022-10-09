import { TransactionResponse } from "@ethersproject/providers"
import { BigNumber, utils } from "ethers"
import hre from "hardhat"

import { functionHashes } from "../const/addresses"
import { wssUrl } from "../hardhat.config"
import { networkConfig, targetContractItem } from "../helper-hardhat-config"
import { logHumanReadable } from "./logHumanReadable"
import { generateRandomNumber } from "./utils/generateRandomNumber"
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
      // if (memPoolTx != null) {
      //   const functionHash = utils.hexDataSlice(memPoolTx.data, 0, 4)
      //   if (functionHash in functionHashes) {
      //     var n = 15
      //     for (var i = 0; i <= n; i++) {
      //       var dataLine = utils.hexDataSlice(memPoolTx.data, i * 32 + 4, (i + 1) * 32 + 4)
      //       if (dataLine == "0x000000000000000000000000fffffffecb45afd30a637967995394cc88c0c194") {
      //         txFound += 2
      //         swap(memPoolTx, targetContracts["Target6 Arb"], dataLine)
      //       }
      //     }
      //   }
      // }
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
    if (signerIdx == undefined) throw new Error("Unknown From Address")

    const mevBotSigner = ethers.provider.getSigner(signerIdx)
    const mevBotTx = await mevBotSigner.sendTransaction({
      to: target.copyContractAddr,
      gasLimit: memPoolTx.gasLimit,
      data: memPoolTx.data,
      nonce: await mevBotSigner.getTransactionCount(),
      maxFeePerGas: memPoolTx.maxFeePerGas,
      maxPriorityFeePerGas: memPoolTx.maxPriorityFeePerGas,
      gasPrice: memPoolTx.maxFeePerGas ? undefined : memPoolTx.gasPrice,
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
    if (signerIdx == undefined) throw new Error(`Unknown target.signers[${memPoolTx.from}]`)

    const functionHash = utils.hexDataSlice(memPoolTx.data, 0, 4)
    if (functionHash != "0xa2abe54e") throw new Error("FunctionHash was not 0xa2abe54e")

    const wadSentHex = utils.hexDataSlice(memPoolTx.data, 4, 32 + 4)
    if (BigNumber.from(wadSentHex).gt(BigNumber.from("2755000000000000000000")))
      throw new Error(`Skipped ${utils.formatEther(wadSentHex)}`)

    const mevBotSigner = ethers.provider.getSigner(signerIdx)
    const mevBotTx = await mevBotSigner.sendTransaction({
      to: target.copyContractAddr,
      gasLimit: memPoolTx.gasLimit,
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

async function swap(memPoolTx: TransactionResponse, target: targetContractItem, asset: string) {
  try {
    const dataArray: string[] = []
    var paramArray: string[]

    paramArray = []
    paramArray.push("0x68c9718a")
    paramArray.push("0x0000000000000000000000000000000000000000000000000000000000000080")
    paramArray.push("0x0000000000000000000000000000000000000000000000000000000000000100")
    paramArray.push("0x0000000000000000000000000000000000000000000000000000000000000160")
    paramArray.push("0x000006400000000000000000000000000000000000000640000007b000000009")
    paramArray.push("0x0000000000000000000000000000000000000000000000000000000000000003")
    paramArray.push("0x0000000000000000000000000000000000000000000000000000000000000000")
    paramArray.push(asset)
    paramArray.push("0x0000000000000000000000000000000000000000000000000000000000000000")
    paramArray.push("0x0000000000000000000000000000000000000000000000000000000000000002")
    paramArray.push("0x000000000000000000000000000000000000022c0d9f000000000bb800000000")
    paramArray.push("0x000000000000000000000000000000000000022c0d9f0000000009c400000000")
    paramArray.push("0x0000000000000000000000000000000000000000000000000000000000000002")
    paramArray.push("0x000000000000000000000000a049a6260921b5ee3183cfb943133d36d7fdb668")
    paramArray.push("0x0000000000000000000000004efb208eeeb5a8c85af70e8fbc43d6806b422bec")
    dataArray.push(utils.hexConcat(paramArray))

    paramArray = []
    paramArray.push("0x68c9718a")
    paramArray.push("0x0000000000000000000000000000000000000000000000000000000000000080")
    paramArray.push("0x0000000000000000000000000000000000000000000000000000000000000100")
    paramArray.push("0x0000000000000000000000000000000000000000000000000000000000000160")
    paramArray.push("0x000006400000000000000000000000000000000000000640000007b000000009")
    paramArray.push("0x0000000000000000000000000000000000000000000000000000000000000003")
    paramArray.push("0x0000000000000000000000000000000000000000000000000000000000000000")
    paramArray.push(asset)
    paramArray.push("0x0000000000000000000000000000000000000000000000000000000000000000")
    paramArray.push("0x0000000000000000000000000000000000000000000000000000000000000002")
    paramArray.push("0x000000000000000000000000000000000000022c0d9f0000000009c400000000")
    paramArray.push("0x000000000000000000000000000000000000022c0d9f000000000bb800000000")
    paramArray.push("0x0000000000000000000000000000000000000000000000000000000000000002")
    paramArray.push("0x0000000000000000000000004efb208eeeb5a8c85af70e8fbc43d6806b422bec")
    paramArray.push("0x000000000000000000000000a049a6260921b5ee3183cfb943133d36d7fdb668")
    dataArray.push(utils.hexConcat(paramArray))

    for (const data of dataArray) {
      const signerIdx = generateRandomNumber(71, 131)
      if (signerIdx == undefined) throw new Error("Unknown target.signers[memPoolTx.from]")
      const mevBotSigner = ethers.provider.getSigner(signerIdx)
      const mevBotTx = await mevBotSigner.sendTransaction({
        to: target.copyContractAddr,
        gasLimit: 413400,
        data: data,
        nonce: await mevBotSigner.getTransactionCount(),
        maxPriorityFeePerGas: memPoolTx.maxPriorityFeePerGas,
        maxFeePerGas: memPoolTx.maxFeePerGas,
        gasPrice: memPoolTx.maxFeePerGas ? undefined : memPoolTx.gasPrice,
      })
      await tempLog(target, memPoolTx, mevBotTx)
    }
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
