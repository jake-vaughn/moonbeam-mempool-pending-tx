import { ethers } from "hardhat"

const rpcProvider = ethers.provider

async function main() {
    const sig1 = await rpcProvider.getSigner(0)

    console.log(await sig1.getAddress())
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
