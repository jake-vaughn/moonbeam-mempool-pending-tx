import { ethers } from "hardhat"
import { addressMatchConfig } from "../helper-hardhat-config"

const rpcProvider = ethers.provider

async function main() {
    // const sig = await rpcProvider.getSigner(0)

    // console.log(await sig.getAddress())
    console.log(1, await (await rpcProvider.getSigner(1)).getAddress())

    for (const addr in addressMatchConfig) {
        // console.log(addressMatch[addr], await (await rpcProvider.getSigner(addressMatch[addr])).getAddress())
        // console.log(ethers.utils.getAddress(addr))
        // console.log(type2AddressMatch["0x5ba7831f4725fa8ccd2f851d572632d8cdc5d695"])
        // console.log(await sig.getAddress())
    }
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
