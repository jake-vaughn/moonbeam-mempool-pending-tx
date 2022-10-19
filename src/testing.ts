import { utils } from "ethers"
import { EVM, Transaction } from "evm"
import hre from "hardhat"
import Web3 from "web3"

import { networkConfig } from "../helper-hardhat-config"

const rpcProvider = hre.ethers.provider
// const chainId = hre.network.config.chainId!
// const targetContracts = networkConfig[chainId].targetContracts
// const target = targetContracts["0x08a025B3AF7f175E95Fa304218aCDDB87f150F20"]
// const signers = target.signers

async function main() {
  const web3 = new Web3(new Web3.providers.HttpProvider("https://moonbeam.api.onfinality.io/public"))

  // web3.eth
  //   .getTransaction("0x58f0aadfb2a3e375167cdc069017f9930eed37084c421aefae7642a9a8aefcf1")
  //   .then(transactionData => {
  //     const transaction = new Transaction()
  //     transaction.setInput(transactionData.input)
  //     console.log(transaction.getFunction()) /* Get function */
  //   })

  web3.eth.getCode("0x8b6784b18d534b98d738719f05b0a8a54bb4c098").then(code => {
    /* CryptoKitties contract */
    const evm = new EVM(code)
    console.log(evm.getFunctions()) /* Get functions */
    // console.log(evm.getEvents()) /* Get events */
    console.log(evm.decompile()) /* Decompile bytecode */
  })
}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
