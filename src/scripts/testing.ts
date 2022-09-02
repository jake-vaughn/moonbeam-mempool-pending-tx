import { ethers, network } from "hardhat"

import { networkConfig, networkConfigInfo } from "../helper-hardhat-config"

const rpcProvider = ethers.provider
const chainId = network.config.chainId!
const targetContracts = networkConfig[chainId].targetContracts

async function main() {
  // const sig = await rpcProvider.getSigner(0)

  // console.log(await sig.getAddress())
  console.log(1, await (await rpcProvider.getSigner(1)).getAddress())

  for (const addr in targetContracts["0x2541300Dff59926F0855016e861A1426fb547037"]) {
    // console.log(addressMatch[addr], await (await rpcProvider.getSigner(addressMatch[addr])).getAddress())
    // console.log(ethers.utils.getAddress(addr))
    // console.log(type2AddressMatch["0x5ba7831f4725fa8ccd2f851d572632d8cdc5d695"])
    // console.log(await sig.getAddress())
  }
}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
