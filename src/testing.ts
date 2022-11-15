import { utils } from "ethers"
import { EVM, Transaction } from "evm"
import hre from "hardhat"
import * as zksync from "zksync-web3"

import { networkConfig } from "../helper-hardhat-config"

const { network, deployments, getNamedAccounts, ethers } = hre

const rpcProvider = hre.ethers.provider
// const chainId = hre.network.config.chainId!
// const targetContracts = networkConfig[chainId].targetContracts
// const target = targetContracts["0x08a025B3AF7f175E95Fa304218aCDDB87f150F20"]
// const signers = target.signers

async function main() {
  // const web3 = new Web3(new Web3.providers.HttpProvider("https://moonbeam.api.onfinality.io/public"))
  const syncProvider = new zksync.Provider("https://zksync2-testnet.zksync.dev")

  syncProvider
    .getTransactionReceipt("0xc732ddf0ae3484494b495a4d67581b90a92990c6169ee5151e0cf90fd4ad4216")
    .then(transactionResponse => {
      console.log(transactionResponse)
    })

  // syncProvider
  //   .getTransaction("0xc732ddf0ae3484494b495a4d67581b90a92990c6169ee5151e0cf90fd4ad4216")
  //   .then(transactionData => {
  //     console.log(transactionData)
  //     // const transaction = new Transaction()
  //     // transaction.setInput(transactionData.data)
  //     // console.log(transaction.getFunction()) /* Get function */
  //   })

  // ethers.provider.getCode("0x8b6784b18d534b98d738719f05b0a8a54bb4c098").then(code => {
  //   const evm = new EVM(code)
  //   console.log(evm.getFunctions()) /* Get functions */
  //   // console.log(evm.getEvents()) /* Get events */
  //   // console.log(evm.decompile()) /* Decompile bytecode */
  // })
}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
