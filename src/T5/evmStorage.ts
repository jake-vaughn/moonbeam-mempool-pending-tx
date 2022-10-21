import hre from "hardhat"

import { getLongStr, getMappingItem, getShortStr, getUint256 } from "../utils/solidityStorageUtils"

const ethers = hre.ethers

async function main() {
  const slot = ethers.utils.hexValue(0)
  const address = "0xfda140A05F78DBFB3381C9E878cCdb66043B65BC"
  const paddedSlot = ethers.utils.hexZeroPad(slot, 32)

  const storageLocation = await ethers.provider.getStorageAt(address, paddedSlot)
  console.log(storageLocation.toString())

  //   const storageValue = await getMappingItem(slot, address, "")
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
