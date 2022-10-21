import { BytesLike } from "ethers"

let contractJson = JSON.parse("./target7Copy")

export const abi: any[] = contractJson.abi
export const bytecode: BytesLike = contractJson.bytecode
