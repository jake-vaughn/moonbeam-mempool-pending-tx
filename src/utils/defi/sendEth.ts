import { JsonRpcSigner } from "@ethersproject/providers"
import { utils } from "ethers"

async function sendAllGlmr(signer: JsonRpcSigner, dst: string) {
  const balance = await signer.getBalance()
  console.log(balance.toString())

  signer.sendTransaction({
    to: dst,
    value: balance.sub(utils.parseEther("0.0021").sub(1)),
  })
}

export { sendAllGlmr }
