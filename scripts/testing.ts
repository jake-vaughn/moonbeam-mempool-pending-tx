import { ethers } from "hardhat"
import { type2AddressMatch } from "../helper-hardhat-config"

const rpcProvider = ethers.provider

async function main() {
    const sig = await rpcProvider.getSigner(0)

    console.log(await sig.getAddress())

    for (const addr in type2AddressMatch) {
        const sig = await rpcProvider.getSigner(type2AddressMatch["0x5ba7831f4725fa8ccd2f851d572632d8cdc5d695"])

        console.log(type2AddressMatch["0x5ba7831f4725fa8ccd2f851d572632d8cdc5d695"])

        console.log(await sig.getAddress())
    }
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
