import { TransactionReceipt, TransactionResponse } from "@ethersproject/providers"
import { BigNumber } from "ethers"
import { ethers } from "hardhat"
import chalk from "chalk"
import { any } from "hardhat/internal/core/params/argumentTypes"

var wsProvider = new ethers.providers.WebSocketProvider("ws://127.0.0.1:9944")

async function mevBot() {
    const rpcProvider = ethers.provider
    const mevBotSigner = await rpcProvider.getSigner(1)
    const mevBotSignerAddr = await mevBotSigner.getAddress()

    console.log(
        chalk.green(`Running mevBot...\n`),
        `mevBotSignerAddr: ${chalk.cyan(mevBotSignerAddr)}\n`,
        `Waiting for a memPoolTx Target...`
    )

    wsProvider.on("pending", (txHash) => {
        wsProvider.getTransaction(txHash).then(async function (memPoolTx) {
            if (memPoolTx != null && memPoolTx.to == "0x2372AA79d0f35310E3Cd3525ecff352922bdAf7C") {
                try {
                    const mevBotGasEstimate = await mevBotSigner.estimateGas({
                        to: "0x726714e8457aCbD729805223616Ec5A6D8C7193A",
                        data: memPoolTx.data,
                        // gasLimit: 1000000,
                        // maxFeePerGas: 121500000000,
                        // maxPriorityFeePerGas: 2100000000,
                    })

                    if (mevBotGasEstimate.toNumber() > 0) {
                        const mevBotTx = await mevBotSigner.sendTransaction({
                            to: "0x726714e8457aCbD729805223616Ec5A6D8C7193A",
                            data: memPoolTx.data,
                            gasLimit: 1000000,
                            maxFeePerGas: 121500000000,
                            maxPriorityFeePerGas: 2100000000,
                        })

                        const memPoolTxReceipt = await handleWait(memPoolTx)
                        const mevBotTxReceipt = await handleWait(mevBotTx)
                        console.log(
                            `~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n`,
                            chalk.green(`Transaction Sent!\n`),
                            `memPoolTxReceipt blockNumber: ${chalk.yellow(memPoolTxReceipt?.blockNumber)}\n`,
                            `mevBotTxReceipt blockNumber:  ${chalk.yellow(mevBotTxReceipt?.blockNumber)}\n`,
                            `memPoolTxReceipt transactionHash: ${chalk.cyan(memPoolTxReceipt?.transactionHash)}\n`,
                            `mevBotTxReceipt transactionHash:  ${chalk.cyan(mevBotTxReceipt?.transactionHash)}\n`,
                            `mevBotTx estimateGas:    ${chalk.yellow(mevBotGasEstimate)}\n`,
                            `mevBotTxReceipt gasUsed: ${chalk.yellow(mevBotTxReceipt?.gasUsed)}\n`,
                            `memPoolTxReceipt status: ${chalk.yellow(memPoolTxReceipt?.status)}\n`,
                            `mevBotTxReceipt status:  ${chalk.yellow(mevBotTxReceipt?.status)}\n`
                        )
                    }
                } catch (err) {
                    const memPoolTxReceipt = await handleWait(memPoolTx)

                    console.log(
                        `~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n`,
                        `pending listener failed with error\n`,
                        err,
                        chalk.green(`\nMempool Transaction was`),
                        `memPoolTxReceipt blockNumber: ${chalk.yellow(memPoolTxReceipt?.blockNumber)}\n`,
                        `memPoolTxReceipt transactionHash: ${chalk.cyan(memPoolTxReceipt?.transactionHash)}\n`,
                        `memPoolTxReceipt status: ${chalk.yellow(memPoolTxReceipt?.status)}\n`
                    )
                }
            }
        })
    })
}

async function handleWait(tx: TransactionResponse) {
    try {
        const txReceipt = await tx.wait()
        return txReceipt
    } catch (error: any) {
        if (error !== null && "receipt" in error) {
            const txReceipt: TransactionReceipt = error.receipt
            return txReceipt
        }
        console.log(`handleWait failed with error\n`, error)
        return undefined
    }
}

// Able to use async/await everywhere and properly handle errors.
mevBot().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
