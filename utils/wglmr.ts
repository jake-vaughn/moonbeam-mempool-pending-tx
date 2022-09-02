import { JsonRpcSigner } from "@ethersproject/providers"
import { BigNumberish } from "ethers"
import { ethers } from "hardhat"
import { PromiseOrValue } from "../typechain-types/common"
import { WETH9 } from "../typechain-types/tokens/WGLMR.sol"

const WGLMR_ADDRESS = "0xAcc15dC74880C9944775448304B263D191c6077F"

async function wrapGlmr(amountWei: BigNumberish, signer: JsonRpcSigner) {
    const wglmr: WETH9 = await ethers.getContractAt("WETH9", WGLMR_ADDRESS, signer)

    console.log(`Wrapping ${ethers.utils.formatEther(amountWei)} GLMR`)

    const tx = await wglmr.deposit({
        value: amountWei,
        maxFeePerGas: 102000000000,
        maxPriorityFeePerGas: 1000000000,
    })
    await tx.wait()
    const wglmrBalance = await wglmr.balanceOf(await signer.getAddress())

    console.log(`Balance of ${ethers.utils.formatEther(wglmrBalance)} WGLMR`)
}

async function transferWglmr(dst: PromiseOrValue<string>, amountWei: BigNumberish, signer: JsonRpcSigner) {
    const wglmr: WETH9 = await ethers.getContractAt("WETH9", WGLMR_ADDRESS, signer)

    console.log(`Transferring ${ethers.utils.formatEther(amountWei)} WGLMR`)

    const tx = await wglmr.transfer(dst, amountWei, {
        maxFeePerGas: 102000000000,
        maxPriorityFeePerGas: 1000000000,
    })
    await tx.wait()

    const wglmrBalance = await wglmr.balanceOf(dst)

    console.log(`Dst Balance of ${ethers.utils.formatEther(wglmrBalance)} WGLMR`)
}

export { wrapGlmr, transferWglmr }
