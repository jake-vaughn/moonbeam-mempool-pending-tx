import { ethers } from "hardhat"

var wsProvider = new ethers.providers.WebSocketProvider("ws://127.0.0.1:9944")

async function main() {
    const rpcProvider = ethers.provider
    const limCook = await rpcProvider.getSigner(0)
    const limCookAddr = console.log(await limCook.getAddress())

    console.log("Running getPendingTx...")
    console.log("Bot Signer Address:", limCookAddr)
    console.log(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`)

    wsProvider.on("pending", (tx) => {
        wsProvider.getTransaction(tx).then(async function (transaction?) {
            console.log(transaction)

            if (transaction != null && transaction.to == "0x59ddC0C8d067dEB508b36d69254Ac6bafD260575") {
                try {
                    const gasEstimate = await limCook.estimateGas({
                        to: "0xc8367169672C4289797a29Bf8Bc7854804EE39F6",
                        data: transaction.data,
                        gasLimit: 500000,
                        maxFeePerGas: 121500000000,
                        maxPriorityFeePerGas: 2100000000,
                    })
                    if (gasEstimate.toNumber() < 35000) {
                        const sendTx = await limCook.sendTransaction({
                            to: "0xc8367169672C4289797a29Bf8Bc7854804EE39F6",
                            data: transaction.data,
                            gasLimit: 500000,
                            maxFeePerGas: 121500000000,
                            maxPriorityFeePerGas: 2100000000,
                        })
                        const txReceipt = await sendTx.wait()
                        console.log("BlockNum:", txReceipt.blockNumber)
                        console.log("tx:", transaction.hash, "\nMirror tx:", txReceipt.transactionHash)
                        // console.log(`gasLimit: ${transaction.gasLimit}`)
                        // console.log(`gasPrice: ${transaction.gasPrice}`)
                        // console.log(`maxFeePerGas: ${transaction.maxFeePerGas}`)
                        // console.log(`maxPriorityFeePerGas: ${transaction.maxPriorityFeePerGas}`)
                        console.log("Gas Est:", gasEstimate, "\nGas Used:", txReceipt.gasUsed)
                    }
                    console.log(
                        `~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`
                    )
                } catch (e) {
                    console.log("tx will likely revert")
                    console.log(`transaction: ${transaction.hash}`)
                }
            }
        })
    })
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
