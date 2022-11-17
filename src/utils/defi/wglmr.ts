import { JsonRpcSigner } from "@ethersproject/providers"
import { BigNumberish } from "ethers"
import { HardhatRuntimeEnvironment } from "hardhat/types"

import { PromiseOrValue } from "../../../typechain-types/common"
import { IWETH9 } from "../../../typechain/contracts/Interfaces"

const WGLMR_ADDRESS = "0xAcc15dC74880C9944775448304B263D191c6077F"

async function wrapGlmr(amountWei: BigNumberish, signer: JsonRpcSigner, hre: HardhatRuntimeEnvironment) {
  const { ethers } = hre
  const wglmr: IWETH9 = (await ethers.getContractAt("IWETH9", WGLMR_ADDRESS, signer)) as IWETH9

  console.log(`Wrapping ${ethers.utils.formatEther(amountWei)} GLMR`)

  const tx = await wglmr.deposit({
    value: amountWei,
    maxFeePerGas: 102000000000,
    maxPriorityFeePerGas: 1000000000,
  })
  await tx.wait()
  const wglmrBalance = await getWglmrBalance(signer, hre)

  console.log(`Balance of ${ethers.utils.formatEther(wglmrBalance)} WGLMR`)
}

async function unwrapWglmr(amountWei: BigNumberish, signer: JsonRpcSigner, hre: HardhatRuntimeEnvironment) {
  const { ethers } = hre

  const wglmr: IWETH9 = (await ethers.getContractAt("IWETH9", WGLMR_ADDRESS, signer)) as IWETH9

  console.log(`Unwrapping ${ethers.utils.formatEther(amountWei)} WGLMR`)

  const tx = await wglmr.withdraw(amountWei, {
    maxFeePerGas: 102000000000,
    maxPriorityFeePerGas: 1000000000,
  })
  const txReceipt = await tx.wait()
  const wglmrBalance = await getWglmrBalance(signer, hre)
  console.log(`Balance of ${ethers.utils.formatEther(wglmrBalance)} WGLMR`)

  return txReceipt
}

async function transferWglmr(
  dst: PromiseOrValue<string>,
  amountWei: BigNumberish,
  signer: JsonRpcSigner,
  hre: HardhatRuntimeEnvironment,
) {
  const { ethers } = hre

  const wglmr: IWETH9 = (await ethers.getContractAt("IWETH9", WGLMR_ADDRESS, signer)) as IWETH9

  console.log(`Transferring ${ethers.utils.formatEther(amountWei)} WGLMR`)

  const tx = await wglmr.transfer(dst, amountWei, {
    maxFeePerGas: 102000000000,
    maxPriorityFeePerGas: 1000000000,
  })
  await tx.wait()

  const wglmrBalance = await wglmr.balanceOf(dst)

  console.log(`Dst Balance of ${ethers.utils.formatEther(wglmrBalance)} WGLMR`)
}

async function getWglmrBalance(signer: JsonRpcSigner, hre: HardhatRuntimeEnvironment) {
  const { ethers } = hre

  const wglmr: IWETH9 = (await ethers.getContractAt("IWETH9", WGLMR_ADDRESS, signer)) as IWETH9

  const wglmrBalance = await wglmr.balanceOf(await signer.getAddress())

  return wglmrBalance
}

export { wrapGlmr, unwrapWglmr, transferWglmr, getWglmrBalance }
