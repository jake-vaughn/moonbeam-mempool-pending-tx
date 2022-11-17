import { parseEther } from "ethers/lib/utils"
import { DeployFunction } from "hardhat-deploy/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre
  const { deploy } = deployments

  const { deployer, zero } = await getNamedAccounts()

  await deploy("SimpleERC20", {
    from: deployer,
    args: [zero, parseEther("1000000000")],
    log: true,
    autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
  })
}
export default func
func.tags = ["SimpleERC20"]
