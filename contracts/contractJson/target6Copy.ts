import { BytesLike } from "ethers"

let contractJson = JSON.parse("./target6Copy")

export const abi: any[] = contractJson.abi
export const bytecode: BytesLike = contractJson.bytecode
