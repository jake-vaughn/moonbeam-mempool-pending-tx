import { BigNumber } from "ethers"
import { ethers, getNamedAccounts, network } from "hardhat"
import { networkConfig } from "../../helper-hardhat-config"
import { BulkSend } from "../../typechain-types"

const rpcProvider = ethers.provider
const chainId = network.config.chainId!
const targetContracts = networkConfig[chainId].targetContracts
const targetContractSigners = targetContracts["0x2541300Dff59926F0855016e861A1426fb547037"].signers
const AMOUNT_TO_DISTRIBUTE = ethers.utils.parseEther("0.01")

async function bulkSend() {
    const { deployer } = await getNamedAccounts()
    const bulkSend: BulkSend = await ethers.getContract("BulkSend", deployer)
    let addresses: string[] = []
    let amounts: BigNumber[] = []

    for (const addr in targetContractSigners) {
        // console.log(targetContractSigners[addr])
        const sig = rpcProvider.getSigner(targetContractSigners[addr])
        const sigAddr = await sig.getAddress()
        // console.log(sigAddr)
        addresses.push(sigAddr)

        let amountToFill = AMOUNT_TO_DISTRIBUTE.sub(await sig.getBalance())
        if (amountToFill.isNegative()) {
            amountToFill = BigNumber.from(0)
        }
        // console.log(amountToFill.toString())
        amounts.push(amountToFill)
    }

    for (let i = 0; i < addresses.length; i++) {
        console.log(addresses[i], amounts[i].toString())
    }
    console.log(
        `Total Eth Amount:`,
        ethers.utils.formatEther(AMOUNT_TO_DISTRIBUTE.mul(BigNumber.from(addresses.length)))
    )

    // const tx = await bulkSend.bulkSendEth(addresses, amounts, {
    //     value: AMOUNT_TO_DISTRIBUTE.mul(BigNumber.from(addresses.length)),
    // })
    // console.log(tx)
}

bulkSend().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
