import { ethers } from "hardhat"

var wsProvider = new ethers.providers.WebSocketProvider("ws://127.0.0.1:9944")

async function main() {
    console.log("Running mirror0x2372ContractBot...")

    const rpcProvider = ethers.provider
    // const blockNum = await wsProvider.getBlockNumber()
    // const block = await wsProvider.getBlock(blockNum)
    // console.log(block)

    const mirrorBot0x2372 = await rpcProvider.getSigner(1)

    console.log(await mirrorBot0x2372.getAddress())

    wsProvider.on("pending", (tx) => {
        wsProvider.getTransaction(tx).then(async function (transaction) {
            if (
                transaction != null &&
                transaction.to == "0x2372AA79d0f35310E3Cd3525ecff352922bdAf7C"
            ) {
                console.log(`Transaction ${transaction.hash}`)
                // console.log(`gasLimit: ${transaction.gasLimit?.toString()}`)
                // console.log(`gasPrice: ${transaction.gasPrice?.toString()}`)
                // console.log(`maxFeePerGas: ${transaction.maxFeePerGas?.toString()}`)
                // console.log(`maxPriorityFeePerGas: ${transaction.maxPriorityFeePerGas?.toString()}`)

                const sendTx = await mirrorBot0x2372.sendTransaction({
                    to: "0x726714e8457aCbD729805223616Ec5A6D8C7193A",
                    data: transaction.data,
                    gasLimit: 1000000,
                    maxFeePerGas: 121500000000,
                    maxPriorityFeePerGas: 2100000000,
                })
                console.log(`Sending my own ${sendTx.hash}`)

                try {
                    const gasEstimate = await mirrorBot0x2372.estimateGas({
                        to: "0x726714e8457aCbD729805223616Ec5A6D8C7193A",
                        data: transaction.data,
                    })
                    console.log(`Gas Estimate: ${gasEstimate}`)
                } catch (e) {
                    console.log("tx will likely revert")
                }

                console.log(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`)
            }
        })
    })
}

// Able to use async/await everywhere and properly handle errors.
main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
