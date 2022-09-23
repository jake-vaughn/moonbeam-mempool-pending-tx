import "@nomicfoundation/hardhat-toolbox"
import { config as dotenvConfig } from "dotenv"
import "hardhat-deploy"
import { HardhatUserConfig } from "hardhat/config"
import type { NetworkUserConfig } from "hardhat/types"
import { resolve } from "path"

import "./tasks/accounts"
import "./tasks/addressMapping"
import "./tasks/sendEth"
import "./tasks/topUpAccounts"

const dotenvConfigPath: string = process.env.DOTENV_CONFIG_PATH || "./.env"
dotenvConfig({ path: resolve(__dirname, dotenvConfigPath) })

// Ensure that we have all the environment variables we need.
const mnemonic: string | undefined = process.env.MNEMONIC
if (!mnemonic) {
  throw new Error("Please set your MNEMONIC in a .env file")
}

// const moonbeamRpcUrl: string | undefined = process.env.MOONBEAM_RPC_URL
// if (!moonbeamRpcUrl) {
//   throw new Error("Please set your MOONBEAM_RPC_URL in a .env file")
// }

// const moonbeamWssUrl: string | undefined = process.env.MOONBEAM_WSS_URL
// if (!moonbeamWssUrl) {
//   throw new Error("Please set your MOONBEAM_WSS_URL in a .env file")
// }

const infuraApiKey: string | undefined = process.env.INFURA_API_KEY
if (!infuraApiKey) {
  throw new Error("Please set your INFURA_API_KEY in a .env file")
}

export let wssUrl: string = ""

const chainIds = {
  "arbitrum-mainnet": 42161,
  avalanche: 43114,
  bsc: 56,
  goerli: 5,
  hardhat: 31337,
  mainnet: 1,
  moonbeam: 1284,
  "optimism-mainnet": 10,
  "polygon-mainnet": 137,
  "polygon-mumbai": 80001,
}

function getChainConfig(chain: keyof typeof chainIds): NetworkUserConfig {
  let jsonRpcUrl: string
  switch (chain) {
    case "avalanche":
      jsonRpcUrl = "https://api.avax.network/ext/bc/C/rpc"
      break
    case "bsc":
      jsonRpcUrl = "https://bsc-dataseed1.binance.org"
      break
    case "moonbeam":
      jsonRpcUrl = "" // moonbeamRpcUrl!
      wssUrl = "" //moonbeamWssUrl!
      break
    default:
      jsonRpcUrl = "https://" + chain + ".infura.io/v3/" + infuraApiKey
  }
  return {
    accounts: {
      count: 120,
      mnemonic,
      path: "m/44'/60'/0'/0",
    },
    chainId: chainIds[chain],
    url: jsonRpcUrl,
  }
}

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  mocha: {
    timeout: 200000, // 200 seconds max for running tests
  },
  networks: {
    hardhat: {
      accounts: {
        count: 100,
        mnemonic,
        path: "m/44'/60'/0'/0",
      },
      // // If you want to do some forking, uncomment this
      //   forking: {
      //     url: chainRpcUrl,
      //   },
      chainId: chainIds.hardhat,
    },
    localhost: {
      chainId: 31337,
    },
    arbitrum: getChainConfig("arbitrum-mainnet"),
    avalanche: getChainConfig("avalanche"),
    bsc: getChainConfig("bsc"),
    goerli: getChainConfig("goerli"),
    mainnet: getChainConfig("mainnet"),
    moonbeam: getChainConfig("moonbeam"),
    optimism: getChainConfig("optimism-mainnet"),
    "polygon-mainnet": getChainConfig("polygon-mainnet"),
    "polygon-mumbai": getChainConfig("polygon-mumbai"),
  },
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
      {
        version: "0.8.9",
        settings: {
          metadata: {
            // Not including the metadata hash
            // https://github.com/paulrberg/hardhat-template/issues/31
            bytecodeHash: "none",
          },
          // Disable the optimizer when debugging
          // https://hardhat.org/hardhat-network/#solidity-optimizer-support
          optimizer: { enabled: true, runs: 800 },
        },
      },
      { version: "0.6.12" },
      { version: "0.6.6" },
      { version: "0.4.24" },
      { version: "0.4.18" },
    ],
  },
  typechain: {
    outDir: "src/types",
    target: "ethers-v5",
  },
}

export default config
