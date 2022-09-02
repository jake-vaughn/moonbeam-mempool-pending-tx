import { getNamedAccounts, network, deployments, ethers } from "hardhat"
import { assert, expect } from "chai"
import { developmentChains, networkConfig } from "../../helper-hardhat-config"
import { ITarget3 } from "../../typechain-types/interfaces"
import { BigNumber, Contract, ContractFactory } from "ethers"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { abi, bytecode } from "../../contractJson/target3Copy"
import { JsonRpcSigner } from "@ethersproject/providers"

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle Unit Tests", function () {
          let target3CopyContractFactory: ContractFactory
          let target3Copy: Contract
          let iTarget3Copy: ITarget3
          let deployer: string
          let deployerSig: JsonRpcSigner
          let accounts: SignerWithAddress[]
          const chainId = network.config.chainId!

          this.beforeEach(async function () {
              accounts = await ethers.getSigners() // could also do with getNamedAccounts
              //   deployer = accounts[0]
              deployer = (await getNamedAccounts()).deployer
              deployerSig = ethers.provider.getSigner(deployer)

              target3CopyContractFactory = new ethers.ContractFactory(abi, bytecode, deployerSig)
              target3Copy = await target3CopyContractFactory.deploy({
                  maxFeePerGas: 102000000000,
                  maxPriorityFeePerGas: 1000000000,
              })
              const target3CopyDeployTx = await target3Copy.deployTransaction
              await target3CopyDeployTx.wait()

              iTarget3Copy = await ethers.getContractAt("ITarget3", target3Copy.address, deployerSig)
          })

          describe("admin", function () {
              it("checks admin is set and returns", async function () {
                  //   const slot = ethers.utils.hexValue(1)
                  //   const address = iTarget3Copy.address
                  //   const paddedSlot = ethers.utils.hexZeroPad(slot, 32)
                  //   const storageLocation = await ethers.provider.getStorageAt(address, paddedSlot)
                  assert.equal((await iTarget3Copy.admin()).toString(), deployer)
              })
          })

          describe("withdrawEth", function () {
              it("returns Eth to admin", async function () {
                  await deployerSig.sendTransaction({
                      value: ethers.utils.parseEther("1"),
                      to: iTarget3Copy.address,
                  })
                  assert.equal(
                      (await ethers.provider.getBalance(iTarget3Copy.address)).toString(),
                      ethers.utils.parseEther("1").toString()
                  )
                  await iTarget3Copy.withdrawEth(await ethers.provider.getBalance(iTarget3Copy.address))
                  assert.equal((await ethers.provider.getBalance(iTarget3Copy.address)).toString(), "0")
              })
          })
      })
