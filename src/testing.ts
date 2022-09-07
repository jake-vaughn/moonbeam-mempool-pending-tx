import hre from "hardhat"

import { moonbeamBlastWssUrl, networkConfig, targetContractItem } from "../helper-hardhat-config"

const ethers = hre.ethers
const chainId = hre.network.config.chainId!
const wsProvider = new hre.ethers.providers.WebSocketProvider(moonbeamBlastWssUrl!)

async function main() {
  console.log(`Running: mevBot `, {
    Chain: networkConfig[chainId].name,
    RpcProvider: ethers.provider.connection.url,
    WsProvider: wsProvider.connection.url,
  })

  wsProvider.connection.user
  // wsProvider.on("pending", txHash => {
  //   console.log(txHash)
  //   wsProvider.getTransaction(txHash).then(async function (memPoolTx) {})
  // })
}

main().catch(error => {
  console.log(error)
  process.exitCode = 1
})
