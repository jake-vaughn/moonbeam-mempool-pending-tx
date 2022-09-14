import { utils } from "ethers"
import hre from "hardhat"

import { getArrayItem, getMappingItem, getUint256 } from "../utils/solidityStorageUtils"

const ethers = hre.ethers
const chainId = hre.network.config.chainId!

export async function getSetCallerStorage() {
  const slot = utils.hexValue(0)
  //   const address = "0x2541300Dff59926F0855016e861A1426fb547037"
  //   const paddedSlot = utils.hexZeroPad(slot, 32)
  //   const storageLocation = await ethers.provider.getStorageAt(address, paddedSlot)
  //   console.log(storageLocation.toString())
  const value = await getMappingItem(
    slot,
    "0x5F31BAaE1B7adb9E28C33010B7b923C031a963B8",
    "0xfD362A28B086aEE786C33cb9C3440292Ef700483",
  )
  console.log(value)
}

getSetCallerStorage()
