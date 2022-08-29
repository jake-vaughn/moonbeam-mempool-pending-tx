import { ethers } from "hardhat"

var wsProvider = new ethers.providers.WebSocketProvider("ws://127.0.0.1:9944")

async function main() {
    console.log("Running getPendingTx...")

    const rpcProvider = ethers.provider
    // const blockNum = await wsProvider.getBlockNumber()
    // const block = await wsProvider.getBlock(blockNum)
    // console.log(block)

    const limCook = await rpcProvider.getSigner(0)

    wsProvider.on("pending", (tx) => {
        wsProvider.getTransaction(tx).then(async function (transaction) {
            if (transaction.to == "0x59ddC0C8d067dEB508b36d69254Ac6bafD260575") {
                console.log(transaction.hash)

                console.log(`gasLimit: ${transaction.gasLimit?.toString()}`)
                console.log(`maxFeePerGas: ${transaction.maxFeePerGas?.toString()}`)
                console.log(`maxPriorityFeePerGas: ${transaction.maxPriorityFeePerGas?.toString()}`)
                console.log()

                try {
                    const gasEstimate = await limCook.estimateGas({
                        to: "0xc8367169672C4289797a29Bf8Bc7854804EE39F6",
                        data: transaction.data,
                    })
                    console.log(`Gas Estimate: ${gasEstimate}`)
                    if (gasEstimate.toNumber() > 50000) {
                        console.log(`Transaction ${transaction.hash}\nPassed?`)

                        const sendTx = await limCook.sendTransaction({
                            to: "0xc8367169672C4289797a29Bf8Bc7854804EE39F6",
                            data: transaction.data,
                            gasLimit: 500000,
                            maxFeePerGas: 121500000000,
                            maxPriorityFeePerGas: 2100000000,
                        })
                        await sendTx.wait(1)
                        console.log(sendTx)
                    }
                    console.log(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`)
                } catch (e) {
                    console.log("tx will likely revert")
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
