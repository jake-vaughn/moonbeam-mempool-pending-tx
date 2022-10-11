import { TransactionResponse } from "@ethersproject/providers"
import { BigNumber, utils } from "ethers"
import hre from "hardhat"
import yesno from "yesno"

import { functionHashes } from "../../const/addresses"
import { wssUrl } from "../../hardhat.config"
import { networkConfig, targetContractItem } from "../../helper-hardhat-config"
import { logHumanReadable } from "../logHumanReadable"
import { generateRandomNumber } from "../utils/generateRandomNumber"
import { logger, mevBotTransportFile, tempLog } from "../utils/logger"

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
    ethers.provider.getTransaction(txHash).then(async function (memPoolTx) {
      try {
        const functionHash = utils.hexDataSlice(memPoolTx.data, 0, 4)
        const target = targetArbs[functionHash]
        const signerIdx = target.signers[memPoolTx.from]
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
        await tempLog(target, memPoolTx, mevBotTx, ethers.provider.blockNumber)
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

mevBotReverse().catch(error => {
  logger.error(error)
  // process.exitCode = 1
})
