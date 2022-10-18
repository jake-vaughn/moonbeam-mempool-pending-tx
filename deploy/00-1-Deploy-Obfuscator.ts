import { DeployFunction } from "hardhat-deploy/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"

import { developmentChains, networkConfig } from "../helper-hardhat-config"

const deployObfuscatorContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { network, deployments, getNamedAccounts, ethers } = hre
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  log("Deploying Obfuscator and waiting for confirmations...")
  const args: any = []
  const obfuscator = await deploy("Obfuscator", {
    from: deployer,
    args: args,
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: networkConfig[network.config.chainId!].blockConfirmations || 1,
  })
  log("----------------------------------------------------")
}
export default deployObfuscatorContract
deployObfuscatorContract.tags = ["all", "obfuscator"]
