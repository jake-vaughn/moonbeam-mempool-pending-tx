import { utils } from "ethers"
import hre from "hardhat"

import { getArrayItem, getMappingItem, getUint256 } from "../utils/solidityStorageUtils"

const ethers = hre.ethers
const chainId = hre.network.config.chainId!

export async function getSetCallerStorage() {
  const slot = utils.hexValue(0)
  // const address = "0x8141bb704eD7DdCB1BdD1d1B3e0CDF0Bbb25FbE5"
  // const paddedSlot = utils.hexZeroPad(slot, 32)
  // const storageLocation = await ethers.provider.getStorageAt(address, paddedSlot)
  // console.log(storageLocation.toString())

  const value = await getMappingItem(
    slot,
    "0x8141bb704eD7DdCB1BdD1d1B3e0CDF0Bbb25FbE5",
    "0xfD362A28B086aEE786C33cb9C3440292Ef700483",
  )
  console.log(value)
}

getSetCallerStorage()
