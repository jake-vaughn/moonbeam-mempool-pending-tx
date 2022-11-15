import { HardhatRuntimeEnvironment } from "hardhat/types"

module.exports = async (hre: HardhatRuntimeEnvironment) => {
  const { getNamedAccounts, deployments } = hre
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  await deploy("BulkSend", {
    from: deployer,
    args: [],
    log: true,
  })
  log("------------------------------------------------------------------")
}
module.exports.tags = ["bulkSend"]

// import { Deployer } from "@matterlabs/hardhat-zksync-deploy"
// import * as ethers from "ethers"
// import { HardhatRuntimeEnvironment } from "hardhat/types"
// import { Wallet, utils } from "zksync-web3"

// import config from "../hardhat.config"

// // An example of a deploy script that will deploy and call a simple contract.
// export default async function (hre: HardhatRuntimeEnvironment) {
//   console.log(`Running deploy script for the BulkSend contract`)

//   let mnemonic = ""

//   // Load the second account from a mnemonic
//   let path = "m/44'/60'/0'/0/1"

//   let mnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic, path)

//   const privateKey1 = mnemonicWallet.privateKey

//   // Initialize the wallet.
//   const wallet = new Wallet(privateKey1)

//   console.log(wallet.address)

//   // Create deployer object and load the artifact of the contract we want to deploy.
//   const deployer = new Deployer(hre, wallet)
//   const artifact = await deployer.loadArtifact("BulkSend")

//   // Deploy this contract. The returned object will be of a `Contract` type, similarly to ones in `ethers`.
//   // `greeting` is an argument for contract constructor.
//   const bulkSendContract = await deployer.deploy(artifact)

//   // Show the contract info.
//   const contractAddress = bulkSendContract.address
//   console.log(`${artifact.contractName} was deployed to ${contractAddress}`)
// }
