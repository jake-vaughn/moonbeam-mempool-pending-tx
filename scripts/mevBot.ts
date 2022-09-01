import { ethers, network } from "hardhat"
import { BigNumber } from "ethers"
import { JsonRpcSigner, Provider, TransactionReceipt, TransactionResponse } from "@ethersproject/providers"
import { networkConfig, targetContractItem, type2AddressMatch } from "../helper-hardhat-config"
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
                        case 2:
                            await type2(memPoolTx, target)
                            break
                        case 99:
                            console.log(
                                `~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n`,
                                chalk.green(`type 99 found\n`),
                                `Target name: ${target.name}\n`,
                                `Block Number: ${chalk.cyan(await rpcProvider.getBlockNumber())}`,
                                `From ${memPoolTx.from.toLowerCase()}`
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
    try {
        const mevBotSigner = rpcProvider.getSigner(target.signers[0])
        const blockNumDesired = (await rpcProvider.getBlockNumber()) + 1
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
            await receiptLogger(target, memPoolTx, mevBotTx, mevBotGasEstimate, blockNumDesired)
        }
    } catch (err) {
        await errorLogger(err, target, memPoolTx)
    }
}

async function type2(memPoolTx: TransactionResponse, target: targetContractItem) {
    try {
        const signerIdx = type2AddressMatch[memPoolTx.from.toLowerCase()]
        if (signerIdx == undefined) {
            throw new Error("Unknown Address Called in a type 2 transaction")
        }
        const mevBotSigner = rpcProvider.getSigner(signerIdx)
        const blockNumDesired = (await rpcProvider.getBlockNumber()) + 1
        const mevBotGasEstimate = await mevBotSigner.estimateGas({
            to: target.copyContractAddr,
            data: memPoolTx.data,
            gasLimit: 500000,
            maxFeePerGas: 200000000000,
            maxPriorityFeePerGas: 2100000000,
        })

        // console.log(
        //     `~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n`,
        //     `memPoolTx.hash: ${chalk.cyan(memPoolTx.hash)}\n`,
        //     `estimateGas: ${chalk.yellow(mevBotGasEstimate)}\n`,
        //     `memPoolTx.from: ${chalk.cyan(memPoolTx.from.toLowerCase())} \n`,
        //     `Index ${chalk.yellow(signerIdx)}\n`,
        //     `signer: ${chalk.cyan(await mevBotSigner.getAddress())}\n`,
        //     `~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n`
        // )

        if (mevBotGasEstimate.toNumber() > 0) {
            const mevBotTx = await mevBotSigner.sendTransaction({
                to: target.copyContractAddr,
                data: memPoolTx.data,
                gasLimit: 500000,
                maxFeePerGas: 200000000000,
                maxPriorityFeePerGas: 2100000000,
            })
            await receiptLogger(target, memPoolTx, mevBotTx, mevBotGasEstimate, blockNumDesired)
        }
    } catch (err) {
        await errorLogger(err, target, memPoolTx)
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
        throw error
    }
}

async function receiptLogger(
    target: targetContractItem,
    memPoolTx: TransactionResponse,
    mevBotTx: TransactionResponse,
    mevBotGasEstimate?: BigNumber,
    blockNumDesired?: number
) {
    const memPoolTxReceipt = await handleWait(memPoolTx)
    const mevBotTxReceipt = await handleWait(mevBotTx)
    const statusWithColor = mevBotTxReceipt.status
        ? chalk.greenBright(mevBotTxReceipt.status)
        : chalk.redBright(mevBotTxReceipt.status)
    console.log(
        chalk.greenBright(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n`),
        chalk.greenBright(`Target Name:  ${target.name}\n`),
        `memPoolTxReceipt transactionHash: ${chalk.cyan(memPoolTxReceipt.transactionHash)}\n`,
        `mevBotTxReceipt transactionHash:  ${chalk.cyan(mevBotTxReceipt.transactionHash)}\n`,
        `Blocks Behind:                    ${chalk.yellow(mevBotTxReceipt.blockNumber - blockNumDesired!)}\n`,
        `memPoolTxReceipt blockNumber:     ${chalk.yellow(memPoolTxReceipt.blockNumber)}\n`,
        `mevBotTxReceipt blockNumber:      ${chalk.yellow(mevBotTxReceipt.blockNumber)}\n`,
        `memPoolTxReceipt status:          ${chalk.yellow(memPoolTxReceipt.status)}\n`,
        `mevBotTxReceipt status:           ${statusWithColor}\n`,
        `mevBotTx estimateGas:             ${chalk.yellow(mevBotGasEstimate)}\n`,
        `mevBotTxReceipt gasUsed:          ${chalk.yellow(mevBotTxReceipt.gasUsed)}\n`,
        chalk.greenBright(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n`)
    )
}

async function errorLogger(err: unknown, target: targetContractItem, memPoolTx: TransactionResponse) {
    const signerIdx = type2AddressMatch[memPoolTx.from.toLowerCase()]
    const mevBotSigner = rpcProvider.getSigner(signerIdx)
    const memPoolTxReceipt = await handleWait(memPoolTx)
    console.log(
        chalk.redBright(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n`),
        chalk.redBright(`Pending listener failed with error:\n`),
        err,
        chalk.redBright(`\n\nTarge Name: ${target.name}\n`),
        `memPoolTxReceipt transactionHash: ${chalk.cyan(memPoolTxReceipt.transactionHash)}\n`,
        `memPoolTxReceipt blockNumber: ${chalk.yellow(memPoolTxReceipt.blockNumber)}\n`,
        `memPoolTxReceipt status: ${chalk.yellow(memPoolTxReceipt.status)}\n`,
        `\n`,
        `memPoolTx.from: ${chalk.cyan(memPoolTx.from.toLowerCase())} \n`,
        `Index ${chalk.yellow(signerIdx)}\n`,
        `signer: ${chalk.cyan(await mevBotSigner.getAddress())}\n`,
        chalk.redBright(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n`)
    )
}

// Able to use async/await everywhere and properly handle errors.
mevBot().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
