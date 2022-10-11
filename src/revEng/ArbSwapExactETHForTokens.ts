import { TransactionResponse } from "@ethersproject/providers"
import { hexConcat } from "ethers/lib/utils"
import { HardhatRuntimeEnvironment } from "hardhat/types"

import { targetContractItem } from "../../helper-hardhat-config"
import { generateRandomNumber } from "../utils/generateRandomNumber"
import { tempErrorLog, tempLog } from "../utils/logger"

async function ArbSwapExactETHForTokens(
  memPoolTx: TransactionResponse,
  target: targetContractItem,
  hre: HardhatRuntimeEnvironment,
) {
  const { ethers } = hre
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
      await tempLog(target, memPoolTx, mevBotTx, ethers.provider.blockNumber)
    }
  } catch (err) {
    await tempErrorLog(err, target, memPoolTx, ethers.provider.blockNumber)
  }
}
