import { DeployFunction } from "hardhat-deploy/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"

import { developmentChains, networkConfig } from "../../helper-hardhat-config"

const deployBulkSendContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { network, deployments, getNamedAccounts, ethers } = hre
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  log("Deploying BulkSend and waiting for confirmations...")
  const args: any = []
  const bulkSend = await deploy("BulkSend", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: networkConfig[network.config.chainId!].blockConfirmations || 1,
  })
  log("--------------------------------------------------------------------------------------------")
}
export default deployBulkSendContract
deployBulkSendContract.tags = ["all", "bulkSend"]
