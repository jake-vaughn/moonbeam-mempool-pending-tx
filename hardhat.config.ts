// import "@matterlabs/hardhat-zksync-deploy"
import "@matterlabs/hardhat-zksync-solc"
import "@nomicfoundation/hardhat-toolbox"
import "hardhat-deploy"
import { HardhatUserConfig } from "hardhat/config"

import "./tasks/accounts"
import "./tasks/addressMapping"
import "./tasks/backToSender"
import "./tasks/refill"
import "./tasks/sendEth"
import "./tasks/transferErc20"
import "./tasks/unwrap"
import { accounts, addForkConfiguration, node_url } from "./utils/networks"

require("@matterlabs/hardhat-zksync-deploy")

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: addForkConfiguration({
    hardhat: {
      initialBaseFeePerGas: 0, // to fix : https://github.com/sc-forks/solidity-coverage/issues/652, see https://github.com/sc-forks/solidity-coverage/issues/652#issuecomment-896330136
    },
    localhost: {
      url: node_url("localhost"),
      accounts: accounts(),
      chainId: 31337,
    },
    mainnet: {
      url: node_url("mainnet"),
      accounts: accounts("default"),
      chainId: 1,
    },
    moonbeam: {
      url: node_url("moonbeam"),
      accounts: accounts("default"),
      chainId: 1284,
    },
    moonriver: {
      url: node_url("moonriver"),
      accounts: accounts("default"),
      chainId: 1285,
    },
    goerli: {
      url: node_url("goerli"),
      accounts: accounts("default"),
      chainId: 5,
    },
    zktestnet: {
      url: "https://zksync2-testnet.zksync.dev",
      accounts: accounts("default"),
      chainId: 280,
      zksync: true,
    },
  }),
  namedAccounts: {
    zero: {
      // signer call with unknown falls back to this address
      default: 0,
    },
    deployer: {
      // Take the second account as deployer
      default: 1,
    },
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
  },
  solidity: {
    compilers: [
      { version: "0.8.12" },
      { version: "0.8.9" },
      { version: "0.6.12" },
      { version: "0.6.6" },
      { version: "0.4.24" },
      { version: "0.4.18" },
    ],
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },
  zksolc: {
    version: "1.2.0",
    compilerSource: "binary",
    settings: {
      experimental: {
        dockerImage: "matterlabs/zksolc",
        tag: "v1.2.0",
      },
    },
  },
  zkSyncDeploy: {
    zkSyncNetwork: "https://zksync2-testnet.zksync.dev",
    ethNetwork: "goerli", // Can also be the RPC URL of the network (e.g. `https://goerli.infura.io/v3/<API_KEY>`)
  },
  mocha: {
    timeout: 200000, // 200 seconds max for running tests
  },
}

export default config
