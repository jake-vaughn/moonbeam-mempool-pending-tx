import "@nomicfoundation/hardhat-toolbox"
import "@nomiclabs/hardhat-ethers"
import "hardhat-deploy"
import "dotenv/config"
import "@typechain/hardhat"
import "@nomiclabs/hardhat-etherscan"
import "hardhat-gas-reporter"
import "solidity-coverage"
import { HardhatUserConfig } from "hardhat/config"

const MOONBEAM_RPC_URL = process.env.MOONBEAM_RPC_URL || "https://rpc.api.moonbeam.network"
const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL || "https://eth-rinkeby.alchemyapi.io/v2/your-api-key"
const MNEMONIC = process.env.MNEMONIC || "your mnemonic"

// Your API key for Etherscan, obtain one at https://etherscan.io/
const MOONSCAN_API_KEY = process.env.MOONSCAN_API_KEY || "Your etherscan API key"
const REPORT_GAS = process.env.REPORT_GAS || false

const config: HardhatUserConfig = {
    defaultNetwork: "moonbeam",
    networks: {
        hardhat: {
            // // If you want to do some forking, uncomment this
            // forking: {
            //   url: MAINNET_RPC_URL
            // }
            chainId: 31337,
        },
        localhost: {
            chainId: 31337,
        },
        moonbeam: {
            url: MOONBEAM_RPC_URL,
            accounts: {
                mnemonic: MNEMONIC,
                path: "m/44'/60'/0'/0",
                initialIndex: 0,
                count: 100,
            },
            saveDeployments: true,
            chainId: 1284,
        },
    },
    etherscan: {
        // yarn hardhat verify --network <NETWORK> <CONTRACT_ADDRESS> <CONSTRUCTOR_PARAMETERS>
        apiKey: {
            moonbeam: MOONSCAN_API_KEY,
        },
    },
    gasReporter: {
        enabled: false,
        currency: "USD",
        outputFile: "gas-report.txt",
        noColors: true,
        // coinmarketcap: process.env.COINMARKETCAP_API_KEY,
        // token: MATIC
    },
    namedAccounts: {
        deployer: {
            default: 1, // Account 1 from mnemonic is deployer
            1284: 1,
        },
        fallback: {
            default: 0, // Account 0 is where failed code falls back to
            1284: 0,
        },
    },
    solidity: {
        compilers: [
            {
                version: "0.8.9",
            },
            {
                version: "0.4.24",
            },
        ],
    },
    mocha: {
        timeout: 200000, // 200 seconds max for running tests
    },
}

export default config
