import { JsonRpcSigner } from "@ethersproject/providers"
import { BigNumberish } from "ethers"
import { formatUnits, parseUnits } from "ethers/lib/utils"
import { HardhatRuntimeEnvironment } from "hardhat/types"

import { PromiseOrValue } from "../../../typechain-types/common"
import { IERC20 } from "../../types/interfaces"

async function getErc20Balance(erc20Addr: string, signer: JsonRpcSigner, hre: HardhatRuntimeEnvironment) {
  const { ethers } = hre
  const erc20: IERC20 = await ethers.getContractAt("IERC20", erc20Addr, signer)
  const erc20Balance = await erc20.balanceOf(await signer.getAddress())
  return erc20Balance
}

async function transferErc20(
  erc20Addr: string,
  destination: PromiseOrValue<string>,
  amountWei: BigNumberish,
  signer: JsonRpcSigner,
  hre: HardhatRuntimeEnvironment,
) {
  const { ethers } = hre
  const erc20: IERC20 = await ethers.getContractAt("IERC20", erc20Addr, signer)
  console.log(`Transferring ${formatUnits(amountWei, await erc20.decimals())} ${await erc20.name()}`)

  // const tx = await erc20.transfer(destination, amountWei)
  // return await tx.wait()
}

export { getErc20Balance, transferErc20 }
