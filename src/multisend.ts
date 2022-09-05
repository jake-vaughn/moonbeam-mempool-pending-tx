import { JsonRpcSigner } from "@ethersproject/providers"
import { BigNumber } from "ethers"
import { formatEther } from "ethers/lib/utils"
import { HardhatRuntimeEnvironment } from "hardhat/types"

import { BulkSend } from "./types"

export async function topUpEth(
  addresses: string[],
  topUpAmount: BigNumber,
  signer: JsonRpcSigner,
  hre: HardhatRuntimeEnvironment,
) {
  // console.log(signer, await signer.getAddress())
  // console.log(hre.ethers.provider)

  const bulkSend: BulkSend = await hre.ethers.getContract("BulkSend", signer)
  // console.log(bulkSend)

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
      // console.log(
      //   `address:     ${addr}\n`,
      //   `Ballance:    ${formatEther(addrBalance)}\n`,
      //   `AmountToFill ${formatEther(amountToFill)}\n`,
      // )
    }
  }
  console.log(`Total cost is ${formatEther(totalSendAmount)}`)

  if (totalSendAmount.isZero()) {
    console.log("nothing sent all accounts are topped up")
    return
  }

  // const tx = await bulkSend.bulkSendEth(addrList, amountList, {
  //   value: totalSendAmount,
  // })

  // // console.log(tx)

  // const txReceipt = await tx.wait()
  // return txReceipt
}
