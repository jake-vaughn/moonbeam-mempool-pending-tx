import { ethers, network } from "hardhat"
import { BigNumber } from "ethers"
import { JsonRpcSigner, Provider, TransactionReceipt, TransactionResponse } from "@ethersproject/providers"
import { networkConfig, targetContractItem } from "../helper-hardhat-config"
import chalk from "chalk"

const rpcProvider = ethers.provider
const chainId = network.config.chainId!
const wsProvider = new ethers.providers.WebSocketProvider(networkConfig[chainId].websocket!)
const targetContracts = networkConfig[chainId].targetContracts

async function mevBot() {
    console.log(
        chalk.green(`Running mevBot...\n`),
        `Chain:            ${networkConfig[chainId].name}\n`,
        `RPC Provider:     ${"*TODO*"}\n`,
        `WS Provider:      ${networkConfig[chainId].websocket!}\n`,
        `Waiting for a memPoolTx target...`
    )

    wsProvider.on("pending", (txHash) => {
        wsProvider.getTransaction(txHash).then(async function (memPoolTx) {
            for (const targetAddr in targetContracts) {
                const target = targetContracts[targetAddr]
                if (target.active && memPoolTx != null && memPoolTx.to == targetAddr) {
                    switch (target.type) {
                        case 1:
                            await type1(memPoolTx, target)
                            break
                        case 99:
                            console.log(
                                `~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n`,
                                chalk.green(`type 99 found\n`),
                                `Target name: ${target.name}\n`,
                                `Block Number: ${await rpcProvider.getBlockNumber()}`
                            )
                            break
                        default:
                            console.log("Something wrong")
                            break
                    }
                }
            }
        })
    })
}

async function type1(memPoolTx: TransactionResponse, target: targetContractItem) {
    const mevBotSigner = await rpcProvider.getSigner(target.signers[0])
    const blockNumDesired = (await rpcProvider.getBlockNumber()) + 1
    try {
        const mevBotGasEstimate = await mevBotSigner.estimateGas({
            to: target.copyContractAddr,
            data: memPoolTx.data,
            gasLimit: 1500000,
            maxFeePerGas: 200000000000,
            maxPriorityFeePerGas: 2100000000,
        })

        if (mevBotGasEstimate.toNumber() > 0) {
            const mevBotTx = await mevBotSigner.sendTransaction({
                to: target.copyContractAddr,
                data: memPoolTx.data,
                gasLimit: 1500000,
                maxFeePerGas: 200000000000,
                maxPriorityFeePerGas: 2100000000,
            })

            const memPoolTxReceipt = await handleWait(memPoolTx)
            const mevBotTxReceipt = await handleWait(mevBotTx)
            receiptLogger(target, memPoolTxReceipt, mevBotTxReceipt, mevBotGasEstimate, blockNumDesired)
        }
    } catch (err) {
        const memPoolTxReceipt = await handleWait(memPoolTx)

        console.log(
            `~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n`,
            `pending listener failed with error\n`,
            err,
            chalk.green(`\nMempool Transaction was`),
            `memPoolTxReceipt blockNumber: ${chalk.yellow(memPoolTxReceipt.blockNumber)}\n`,
            `memPoolTxReceipt transactionHash: ${chalk.cyan(memPoolTxReceipt.transactionHash)}\n`,
            `memPoolTxReceipt status: ${chalk.yellow(memPoolTxReceipt.status)}\n`
        )
    }
}

async function handleWait(tx: TransactionResponse) {
    try {
        const txReceipt = await tx.wait(networkConfig[chainId].blockConfirmations)
        return txReceipt
    } catch (error: any) {
        if (error !== null && "receipt" in error) {
            const txReceipt: TransactionReceipt = error.receipt
            return txReceipt
        }
        console.log(`handleWait failed to handle error\n`)
        throw error
    }
}

function receiptLogger(
    target: targetContractItem,
    memPoolTxReceipt: TransactionReceipt,
    mevBotTxReceipt: TransactionReceipt,
    mevBotGasEstimate?: BigNumber,
    blockNumDesired?: number
) {
    console.log(
        `~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n`,
        chalk.green(`Target ${target.name} Copied\n`),
        // `memPoolTxReceipt transactionHash: ${chalk.cyan(memPoolTxReceipt.transactionHash)}\n`,
        // `mevBotTxReceipt transactionHash:  ${chalk.cyan(mevBotTxReceipt.transactionHash)}\n`,
        `blockNumDesired:                     ${chalk.yellow(blockNumDesired)}\n`,
        `memPoolTxReceipt blockNumber:        ${chalk.yellow(memPoolTxReceipt.blockNumber)}\n`,
        `mevBotTxReceipt blockNumber:         ${chalk.yellow(mevBotTxReceipt.blockNumber)}\n`,
        `memPoolTxReceipt status:             ${chalk.yellow(memPoolTxReceipt.status)}\n`,
        `mevBotTxReceipt status:              ${chalk.yellow(mevBotTxReceipt.status)}\n`
        // `mevBotTx estimateGas:             ${chalk.yellow(mevBotGasEstimate)}\n`,
        // `mevBotTxReceipt gasUsed:          ${chalk.yellow(mevBotTxReceipt.gasUsed)}\n`
    )
}

// Able to use async/await everywhere and properly handle errors.
mevBot().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
