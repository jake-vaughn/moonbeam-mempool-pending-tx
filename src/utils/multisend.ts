import { JsonRpcSigner } from "@ethersproject/providers"
import { BigNumber } from "ethers"
import { formatEther } from "ethers/lib/utils"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import yesno from "yesno"

import { BulkSend } from "../types"

export async function topUpEth(
  addresses: string[],
  topUpAmount: BigNumber,
  signer: JsonRpcSigner,
  hre: HardhatRuntimeEnvironment,
) {
  const bulkSend: BulkSend = await hre.ethers.getContract("BulkSend", signer)

  const addrList: string[] = []
  const amountList: BigNumber[] = []
  let totalSendAmount = BigNumber.from(0)

  for (const addr of addresses) {
    const addrBalance = await hre.ethers.provider.getBalance(addr)
    let amountToFill = topUpAmount.sub(addrBalance)

    if (!amountToFill.isNegative()) {
      addrList.push(addr)
      amountList.push(amountToFill)
      totalSendAmount = totalSendAmount.add(amountToFill)
    }
  }

  console.log(`Total cost will be ${formatEther(totalSendAmount)}`)

  const ok = await yesno({ question: "Do you want to initiate multisend?" })
  if (!ok) return

  const tx = await bulkSend.bulkSendEth(addrList, amountList, {
    value: totalSendAmount,
    // gasLimit: 1500000,
    // maxFeePerGas: 350000000000,
    // maxPriorityFeePerGas: 350000000000,
    // nonce: 18,
  })

  const txReceipt = await tx.wait()
  return txReceipt
}
