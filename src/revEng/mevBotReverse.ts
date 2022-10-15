import { TransactionResponse } from "@ethersproject/providers"
import { BigNumber, utils } from "ethers"
import { formatEther, hexConcat, hexDataSlice } from "ethers/lib/utils"
import hre from "hardhat"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { add } from "winston"
import yesno from "yesno"

import { tokenAddresses } from "../../const/addresses"
import { wssUrl } from "../../hardhat.config"
import { targetContractItem } from "../../helper-hardhat-config"
import { networkConfig } from "../../helper-hardhat-config"
import { logHumanReadable } from "../logHumanReadable"
import { generateRandomNumber } from "../utils/generateRandomNumber"
import { logger, mevBotTransportFile, tempErrorLog, tempLog } from "../utils/logger"

const { ethers, network } = hre
const chainId = network.config.chainId!

const wssProvider = new ethers.providers.WebSocketProvider(wssUrl!)
const targetArbs = networkConfig[chainId].targetArbs

async function mevBotReverse() {
  console.log("debug", `Running: mevBot `, {
    Chain: networkConfig[chainId].name,
    RpcProvider: ethers.provider.connection.url,
    WssProvider: wssProvider.connection.url,
  })

  const ok = await yesno({ question: `Enable Logging?` })
  if (ok) {
    mevBotTransportFile.on("logged", async function (info) {
      await logHumanReadable(info, hre)
    })
  }

  wssProvider.on("pending", txHash => {
    // console.log(txHash)
    wssProvider.getTransaction(txHash).then(async function (memPoolTx) {
      try {
        const functionHash = utils.hexDataSlice(memPoolTx.data, 0, 4)
        const target = targetArbs[functionHash]

        switch (functionHash) {
          case "0x7ff36ab5":
            // await arbSwapExactETHForTokens(target, memPoolTx)
            break
          case "0x18cbafe5":
            await arbSwapExactTokensForETH(target, memPoolTx)
            break
          default:
            break
        }
      } catch (err) {
        // if (
        //   memPoolTx != null &&
        //   memPoolTx.to! in targetArbs &&
        //   targetArbs[functionHash].signers[memPoolTx.from] != undefined
        // ) {
        //   await tempErrorLog(err, targetArbs[functionHash], memPoolTx, ethers.provider.blockNumber)
        // }
      }
    })
  })
}
async function arbSwapExactETHForTokens(target: targetContractItem, memPoolTx: TransactionResponse) {
  try {
    const path: string[] = []
    var i = 0
    // var amountOutMin = hexDataSlice(memPoolTx.data, i * 32 + 4, (i + 1) * 32 + 4)
    i++
    // var na1 = hexDataSlice(memPoolTx.data, i * 32 + 4, (i + 1) * 32 + 4)
    i++
    // var to = hexDataSlice(memPoolTx.data, i * 32 + 4, (i + 1) * 32 + 4)
    i++
    // var deadline = hexDataSlice(memPoolTx.data, i * 32 + 4, (i + 1) * 32 + 4)
    i++
    var hexNum = hexDataSlice(memPoolTx.data, i * 32 + 4, (i + 1) * 32 + 4)
    var n = BigNumber.from(hexNum).toNumber()
    i++
    for (i; i <= n + 4; i++) {
      const token = hexDataSlice(memPoolTx.data, i * 32 + 4, (i + 1) * 32 + 4)
      if (token == "0x000000000000000000000000fffffffecb45afd30a637967995394cc88c0c194") {
        const signerIdx = generateRandomNumber(71, 131)
        if (signerIdx == undefined) throw new Error(`Unknown target.signers ${signerIdx}`)
        const mevBotSigner = ethers.provider.getSigner(signerIdx)
        const mevBotTx = await mevBotSigner.sendTransaction({
          to: target.copyContractAddr,
          gasLimit: 413400,
          data: "0x68c9718a000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000160000006400000000000000000000000000000000000000640000007b00000000900000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000000000000000000000000000000fffffffecb45afd30a637967995394cc88c0c19400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000022c0d9f0000000009c400000000000000000000000000000000000000000000022c0d9f000000000bb80000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000004efb208eeeb5a8c85af70e8fbc43d6806b422bec000000000000000000000000a049a6260921b5ee3183cfb943133d36d7fdb668",
          nonce: await mevBotSigner.getTransactionCount(),
          maxPriorityFeePerGas: memPoolTx.maxPriorityFeePerGas,
          maxFeePerGas: memPoolTx.maxFeePerGas,
          gasPrice: memPoolTx.maxFeePerGas ? undefined : memPoolTx.gasPrice,
        })
        tempLog(target, memPoolTx, mevBotTx!, ethers.provider.blockNumber)
      }
      // path.push(hexDataSlice(memPoolTx.data, i * 32 + 4, (i + 1) * 32 + 4))
    }

    console.log(memPoolTx.hash)
    console.log(formatEther(memPoolTx.value))
    // console.log(amountOutMin)
    // console.log(na1)
    // console.log(to)
    // console.log(BigNumber.from(deadline).toString())
    console.log(n)
    // console.log(path)
    for (const addr of path) {
      console.log(tokenAddresses[addr])
    }
  } catch (error) {
    console.log(error)
  }
}

async function arbSwapExactTokensForETH(target: targetContractItem, memPoolTx: TransactionResponse) {
  try {
    const path: string[] = []
    var i = 5
    // var amountIn = hexDataSlice(memPoolTx.data, i * 32 + 4, (i + 1) * 32 + 4)
    // i++
    // var amountOutMin = hexDataSlice(memPoolTx.data, i * 32 + 4, (i + 1) * 32 + 4)
    // i++
    // var code = hexDataSlice(memPoolTx.data, i * 32 + 4, (i + 1) * 32 + 4)
    // i++
    // var to = hexDataSlice(memPoolTx.data, i * 32 + 4, (i + 1) * 32 + 4)
    // i++
    // var deadline = hexDataSlice(memPoolTx.data, i * 32 + 4, (i + 1) * 32 + 4)
    // i++
    var hexNum = hexDataSlice(memPoolTx.data, i * 32 + 4, (i + 1) * 32 + 4)
    var n = BigNumber.from(hexNum).toNumber()
    i++
    for (i; i <= n + 5; i++) {
      const token = hexDataSlice(memPoolTx.data, i * 32 + 4, (i + 1) * 32 + 4)
      if (token == "0x000000000000000000000000fffffffecb45afd30a637967995394cc88c0c194") {
        const signerIdx = generateRandomNumber(71, 131)
        if (signerIdx == undefined) throw new Error(`Unknown target.signers ${signerIdx}`)
        const mevBotSigner = ethers.provider.getSigner(signerIdx)
        const mevBotTx = await mevBotSigner.sendTransaction({
          to: target.copyContractAddr,
          gasLimit: 413400,
          data: "0x68c9718a000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000160000006400000000000000000000000000000000000000640000007b00000000900000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000000000000000000000000000000fffffffecb45afd30a637967995394cc88c0c19400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000022c0d9f0000000009c400000000000000000000000000000000000000000000022c0d9f000000000bb80000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000004efb208eeeb5a8c85af70e8fbc43d6806b422bec000000000000000000000000a049a6260921b5ee3183cfb943133d36d7fdb668",
          nonce: await mevBotSigner.getTransactionCount(),
          maxPriorityFeePerGas: memPoolTx.maxPriorityFeePerGas,
          maxFeePerGas: memPoolTx.maxFeePerGas,
          gasPrice: memPoolTx.maxFeePerGas ? undefined : memPoolTx.gasPrice,
        })
        tempLog(target, memPoolTx, mevBotTx!, ethers.provider.blockNumber)
      }
      // path.push(token)
    }

    // console.log(memPoolTx.hash)
    // console.log(amountIn)
    // console.log(formatEther(amountOutMin))
    // // console.log(code)
    // // console.log(to)
    // // console.log(BigNumber.from(deadline).toString())
    // console.log(n)
    // console.log(path)
    // for (const addr of path) {
    //   console.log(tokenAddresses[addr])
    // }
    // console.log()
  } catch (error) {
    console.log(error)
  }
}

async function tarbSwapExactETHForTokens(target: targetContractItem, memPoolTx: TransactionResponse) {
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
    paramArray.push("0x000000000000000000000000fffffffecb45afd30a637967995394cc88c0c194")
    paramArray.push("0x0000000000000000000000000000000000000000000000000000000000000000")
    paramArray.push("0x0000000000000000000000000000000000000000000000000000000000000002")
    paramArray.push("0x000000000000000000000000000000000000022c0d9f000000000bb800000000")
    paramArray.push("0x000000000000000000000000000000000000022c0d9f0000000009c400000000")
    paramArray.push("0x0000000000000000000000000000000000000000000000000000000000000002")
    paramArray.push("0x000000000000000000000000a049a6260921b5ee3183cfb943133d36d7fdb668")
    paramArray.push("0x0000000000000000000000004efb208eeeb5a8c85af70e8fbc43d6806b422bec")
    dataArray.push(hexConcat(paramArray))

    paramArray = []
    paramArray.push("0x68c9718a")
    paramArray.push("0x0000000000000000000000000000000000000000000000000000000000000080")
    paramArray.push("0x0000000000000000000000000000000000000000000000000000000000000100")
    paramArray.push("0x0000000000000000000000000000000000000000000000000000000000000160")
    paramArray.push("0x000006400000000000000000000000000000000000000640000007b000000009")
    paramArray.push("0x0000000000000000000000000000000000000000000000000000000000000003")
    paramArray.push("0x0000000000000000000000000000000000000000000000000000000000000000")
    paramArray.push("0x000000000000000000000000fffffffecb45afd30a637967995394cc88c0c194")
    paramArray.push("0x0000000000000000000000000000000000000000000000000000000000000000")
    paramArray.push("0x0000000000000000000000000000000000000000000000000000000000000002")
    paramArray.push("0x000000000000000000000000000000000000022c0d9f0000000009c400000000")
    paramArray.push("0x000000000000000000000000000000000000022c0d9f000000000bb800000000")
    paramArray.push("0x0000000000000000000000000000000000000000000000000000000000000002")
    paramArray.push("0x0000000000000000000000004efb208eeeb5a8c85af70e8fbc43d6806b422bec")
    paramArray.push("0x000000000000000000000000a049a6260921b5ee3183cfb943133d36d7fdb668")
    dataArray.push(hexConcat(paramArray))

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
      tempLog(target, memPoolTx, mevBotTx!, ethers.provider.blockNumber)
    }
  } catch (err) {
    await tempErrorLog(err, target, memPoolTx, ethers.provider.blockNumber)
  }
}

mevBotReverse().catch(error => {
  logger.error(error)
  // process.exitCode = 1
})
