import { JsonRpcProvider } from "@ethersproject/providers"
import { ethers } from "hardhat"
import { HardhatRuntimeEnvironment } from "hardhat/types"

async function main() {
    console.log("Running getPendingTx...")
    const provider: JsonRpcProvider = ethers.provider
    console.log(await provider.getBlockNumber())
    provider.on("block", (blockNumber) => {
        console.log(blockNumber)
    })
    provider.on("pending", (pendingTransaction) => {
        console.log(pendingTransaction)

        // provider.getTransaction(tx).then(function (transaction) {
        //     console.log(transaction)
        // })
    })
    // provider.once("txHash", (transaction) => {
    //     // Emitted when the transaction has been mined
    //     console.log(transaction)
    // })
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
