import { ethers } from "hardhat"

import { sendAllGlmr } from "../../src/utils/sendEth"

const rpcProvider = ethers.provider

async function simpleSendGlmr() {
  const sig = rpcProvider.getSigner(0)
  console.log(await sig.getAddress())

  const to = await (await rpcProvider.getSigner(10)).getAddress()
  console.log(to)

  await sendAllGlmr(sig, to)
}

simpleSendGlmr().catch(error => {
  console.error(error)
  process.exitCode = 1
})
