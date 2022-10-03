import { TransactionResponse } from "@ethersproject/providers"
import { BigNumber, utils } from "ethers"
import { promises as fsPromises, readFileSync, writeFileSync } from "fs"
import hre from "hardhat"
import { join } from "path"

import { exchanges, functionHashes, lpAddresses, routers, tokenAddresses } from "../../const/addresses"
import { wssUrl } from "../../hardhat.config"
import { networkConfig, targetContractItem } from "../../helper-hardhat-config"
import { logHumanReadable } from "../logHumanReadable"
import { logger, mevBotTransportFile } from "../utils/logger"

const { ethers, network } = hre
const chainId = network.config.chainId!

const wssProvider = new ethers.providers.WebSocketProvider(wssUrl!)
const targetContracts = networkConfig[chainId].targetContracts
const addrMap = new Map<string, boolean>()

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
      if (memPoolTx != null && memPoolTx.to! == "0x8B6784b18d534b98d738719F05B0a8a54bB4C098") {
        const target = targetContracts[memPoolTx.to!]
        txFound++
        await type1(memPoolTx, target)
      }
      if (memPoolTx != null) {
        try {
          const functionHash = utils.hexDataSlice(memPoolTx.data, 0, 4)
          if (functionHash in functionHashes) {
            txFound++
            var parsedData = ""

            parsedData +=
              `\n` + "swap " + memPoolTx.hash + " " + ethers.provider.blockNumber + " " + routers[memPoolTx.to!]
            var n = 0
            if (functionHash == "0x7ff36ab5") var n = 4
            if (functionHash == "0x38ed1739" || functionHash == "0x18cbafe5" || functionHash == "0x8803dbee") var n = 5
            for (var i = 0; i <= n; i++) {
              var dataLine = utils.hexDataSlice(memPoolTx.data, i * 32 + 4, (i + 1) * 32 + 4)
              if (i == n && n < 6) {
                n = n + BigNumber.from(dataLine).toNumber()
                dataLine = BigNumber.from(dataLine).toNumber() + "------------"
              }
              if (dataLine in tokenAddresses) parsedData += `\n` + tokenAddresses[dataLine]
            }

            parsedData +=
              `\n` +
              "maxFeePerGas: " +
              (memPoolTx.maxFeePerGas ? utils.formatUnits(memPoolTx.maxFeePerGas!, "gwei") : memPoolTx.maxFeePerGas)
            parsedData +=
              `\n` +
              "maxPriorityFeePerGas: " +
              (memPoolTx.maxPriorityFeePerGas
                ? utils.formatUnits(memPoolTx.maxPriorityFeePerGas!, "gwei")
                : memPoolTx.maxPriorityFeePerGas)
            parsedData +=
              `\n` +
              "gasPrice: " +
              (memPoolTx.gasPrice ? utils.formatUnits(memPoolTx.gasPrice!, "gwei") : memPoolTx.gasPrice)
            parsedData += `\n` + "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
            console.log(parsedData)
            await asyncWriteFile("./swaps.log", parsedData)

            // await tempLog(targetContracts["0x2372AA79d0f35310E3Cd3525ecff352922bdAf7C"], memPoolTx, mevBotTx)
          }
        } catch (err) {
          console.log(err)
          await asyncWriteFile("./swaps.log", "ERROR " + memPoolTx.hash)

          //   await tempErrorLog(err, targetContracts["0x2372AA79d0f35310E3Cd3525ecff352922bdAf7C"], memPoolTx)
        }
      }
    })
  })
}

async function type1(memPoolTx: TransactionResponse, target: targetContractItem) {
  try {
    const functionHash = utils.hexDataSlice(memPoolTx.data, 0, 4)
    if (functionHash != "0x68c9718a") console.log("FunctionHash was not 0x68c9718a")

    var parsedData = ""
    parsedData += `\n` + "arb " + memPoolTx.hash + " " + ethers.provider.blockNumber
    var n = 4
    var c = 0
    for (var i = 0; i <= n; i++) {
      var dataLine = utils.hexDataSlice(memPoolTx.data, i * 32 + 4, (i + 1) * 32 + 4)
      if (i < 3) {
        dataLine = BigNumber.from(dataLine).toNumber().toString()
        if (
          dataLine == "128" ||
          dataLine == "256" ||
          dataLine == "352" ||
          dataLine == "288" ||
          dataLine == "416" ||
          dataLine == "320" ||
          dataLine == "480"
        )
          continue
      } else if (i == n && c < 3) {
        c++
        n = n + BigNumber.from(dataLine).toNumber() + 1
        if (c == 3) {
          n--
        }
        dataLine = BigNumber.from(dataLine).toNumber() + "--------------"
        if (c != 2 && c != 3) {
          continue
        }
      } else if (i == 3) {
        // if (dataLine == "0x000006400000000000000000000000000000000000000640000007b000000009") {
        // } else {
        var tmp1 = BigNumber.from(utils.hexDataSlice(dataLine, 0, 4)).toNumber()
        var tmp2 = BigNumber.from(utils.hexDataSlice(dataLine, 4, 8)).toNumber()
        var tmp3 = BigNumber.from(utils.hexDataSlice(dataLine, 8, 12)).toNumber()
        var tmp4 = BigNumber.from(utils.hexDataSlice(dataLine, 12, 16)).toNumber()
        var tmp5 = BigNumber.from(utils.hexDataSlice(dataLine, 16, 20)).toNumber()
        var tmp6 = BigNumber.from(utils.hexDataSlice(dataLine, 20, 24)).toNumber()
        var tmp7 = BigNumber.from(utils.hexDataSlice(dataLine, 24, 28)).toNumber()
        var tmp8 = BigNumber.from(utils.hexDataSlice(dataLine, 28, 32)).toNumber()
        dataLine = tmp1 + "," + tmp2 + "," + tmp3 + "," + tmp4 + "," + tmp5 + "," + tmp6 + "," + tmp7 + "," + tmp8
        // }
      } else if (dataLine in tokenAddresses) dataLine = tokenAddresses[dataLine]
      else if (dataLine in exchanges) dataLine = exchanges[dataLine]
      else if (dataLine in lpAddresses) dataLine = lpAddresses[dataLine]
      else {
        if (!addrMap.has(dataLine)) {
          addrMap.set(dataLine, true)
          await asyncWriteFile("./addr.log", dataLine + `\n`)
        }
      }

      parsedData += `\n` + dataLine
    }
    parsedData +=
      `\n` +
      "maxFeePerGas: " +
      (memPoolTx.maxFeePerGas ? utils.formatUnits(memPoolTx.maxFeePerGas!, "gwei") : memPoolTx.maxFeePerGas)
    parsedData +=
      `\n` +
      "maxPriorityFeePerGas: " +
      (memPoolTx.maxPriorityFeePerGas
        ? utils.formatUnits(memPoolTx.maxPriorityFeePerGas!, "gwei")
        : memPoolTx.maxPriorityFeePerGas)
    parsedData +=
      `\n` + "gasPrice: " + (memPoolTx.gasPrice ? utils.formatUnits(memPoolTx.gasPrice!, "gwei") : memPoolTx.gasPrice)

    parsedData += `\n` + "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
    console.log(parsedData)
    await asyncWriteFile("./target6.log", parsedData)

    // await tempLog(target, memPoolTx)
    return
  } catch (err) {
    await tempErrorLog(err, target, memPoolTx)
    return
  }
}

async function tempLog(target: targetContractItem, memPoolTx: TransactionResponse) {
  txReported++
  logger.debug(`${txReported}/${txFound}`, {
    memPoolTx: memPoolTx,
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

// ✅ write to file ASYNCHRONOUSLY
async function asyncWriteFile(filename: string, data: any) {
  /**
   * flags:
   *  - w = Open file for reading and writing. File is created if not exists
   *  - a+ = Open file for reading and appending. The file is created if not exists
   */
  try {
    await fsPromises.appendFile(join(__dirname, filename), data, {})

    // const contents = await fsPromises.readFile(join(__dirname, filename), "utf-8")
    // console.log(contents) // 👉️ "One Two Three Four"

    // return contents
  } catch (err) {
    console.log(err)
    return "Something went wrong"
  }
}

mevBot().catch(error => {
  logger.error(error)
  process.exitCode = 1
})
