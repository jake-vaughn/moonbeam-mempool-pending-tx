import { backBurnerSigs, target3Sigs } from "./const/addresses"

export interface networkConfigInfo {
  [key: number]: networkConfigItem
}

export interface targetContractInfo {
  [targetAddr: string]: targetContractItem
}

export interface addressMatchInfo {
  [addr: string]: number
}

export interface networkConfigItem {
  name?: string
  blockConfirmations?: number
  targetContracts: targetContractInfo
  targetArbs: targetContractInfo
}

export interface targetContractItem {
  // Personal name for target
  name?: string
  // type 1: Single Signer and contract (funds sent to signer)
  // type 2: ...
  // type 99: is a todo
  type: number
  // Address that is being copied
  copyContractAddr: string
  // Main signature function hash reversed for use
  mainFunc: string
  // Signers root (Signers should not overlap)
  signers: addressMatchInfo
}

export const networkConfig: networkConfigInfo = {
  31337: {
    name: "hardhat",
    blockConfirmations: 1,
    targetContracts: {
      "0xAdaaF4999349346935387797c5F79E07C43c12eD": {
        name: "Target(3)🔳",
        type: 1,
        copyContractAddr: "0xCCD3c7C9b6CA00551BeEC7977522e0791f0012eB",
        mainFunc: "",
        signers: target3Sigs,
      },
    },
    targetArbs: {},
  },
  1284: {
    name: "moonbeam",
    blockConfirmations: 1,
    targetContracts: {
      // "0x59ddC0C8d067dEB508b36d69254Ac6bafD260575": {
      //   name: "Target(1)",
      //   type: 1,
      //   copyContractAddr: "0xc8367169672C4289797a29Bf8Bc7854804EE39F6",
      //   mainFunc: "",
      //   signers: {
      //     // 2 addresses for First Target
      //     "0xBa5aCE2Bf8a96bCcC8Bf58b9Fb8b89a16AA86f58": 8,
      //     "0xd3870F9A418f11Bab18D3A5d89BC1Ae8eBee0551": 9,
      //   },
      // },
      // "0x2372AA79d0f35310E3Cd3525ecff352922bdAf7C": {
      //   name: "Target(2)",
      //   type: 1,
      //   copyContractAddr: "0x726714e8457aCbD729805223616Ec5A6D8C7193A",
      //   mainFunc: "",
      //   signers: {
      //     // 1 address for Second Target
      //     "0xE4ef74629a9da7DFd2a940c4BFBA56D3B8110769": 10,
      //   },
      // },
      "0xAdaaF4999349346935387797c5F79E07C43c12eD": {
        name: "Target(3)🔳",
        type: 1,
        copyContractAddr: "0xA4e4AA5328Bc1224cDFeF6dF994958531D3833B8",
        mainFunc: "0xb5dd43d9",
        signers: target3Sigs,
      },
      // "0xAb9C7a8654b9224E3A741Dc3A4991F2d1b82307A": {
      //   name: "Target(4)",
      //   type: 1,
      //   copyContractAddr: "0x7Ff769F69CEE5A5FB13afb6E2195313Ce3884981",
      //   mainFunc: "",
      //   signers: {
      //     // ? addresses
      //     "0x6df2eA5Ecc8d604A554FcF092A9F939cd8b7F09E": 61,
      //     "0xf9e156992644536653b9da48DC1090c74EF904e9": 62,
      //     "0x8A3169843fc4fD85201ED558e96217e9eA0BA7e1": 63,
      //     "0x9Da53054B8C3002496f5Dd521df1fc515de1d9F3": 64,
      //     "0xF02435ea48A5664BE1109C99e79404F463E8499F": 65,
      //     // "0x55E2C08E9Ca9918CEF411257FABcF4aB2228FcB8": 66,
      //     // "0xcB0B5edB701019c9F67d45f989533a66DC1a491E": 67,
      //     // "0x6df2eA5Ecc8d604A554FcF092A9F939cd8b7F09E": 68,
      //     // "0x6df2eA5Ecc8d604A554FcF092A9F939cd8b7F09E": 69,
      //   },
      // },
      "0x2b731E8e2C72cC14628346EB1Bc11ebF1A4ef2e6": {
        name: "Target(5)💓",
        type: 1,
        copyContractAddr: "0xfda140A05F78DBFB3381C9E878cCdb66043B65BC",
        mainFunc: "0x68c9718a",
        signers: backBurnerSigs,
      },
      "0x8B6784b18d534b98d738719F05B0a8a54bB4C098": {
        name: "Target(6)⏪",
        type: 1,
        copyContractAddr: "0x157f8cE52B68ba1AF6B56304d44188A6165b9CE0",
        mainFunc: "0x61b9e895",
        signers: backBurnerSigs,
      },
      "0x08a025B3AF7f175E95Fa304218aCDDB87f150F20": {
        name: "Target(7)🔄",
        type: 1,
        copyContractAddr: "0x050e3BAa8fd3747db1Ea89f778c54cDeC82D499F",
        mainFunc: "0x68c9718a",
        signers: backBurnerSigs,
      },
    },
    targetArbs: {
      "0x7ff36ab5": {
        name: "ASEEFT(6)🍞",
        type: 1,
        copyContractAddr: "0xb094f7ba5361098dfa96FEcA687130d9ef0EF561",
        mainFunc: "0x68c9718a",
        signers: backBurnerSigs,
      },
      "0x18cbafe5": {
        name: "ASETFE(6)💩",
        type: 1,
        copyContractAddr: "0xb094f7ba5361098dfa96FEcA687130d9ef0EF561",
        mainFunc: "0x68c9718a",
        signers: backBurnerSigs,
      },
    },
  },
  1285: {
    name: "moonbeam",
    blockConfirmations: 1,
    targetContracts: {
      "3": {
        name: "Target(3)🔳",
        type: 1,
        copyContractAddr: "",
        mainFunc: "0xb5dd43d9",
        signers: target3Sigs,
      },
      "5": {
        name: "Target(5)💓",
        type: 1,
        copyContractAddr: "",
        mainFunc: "0x68c9718a",
        signers: backBurnerSigs,
      },
      "0xee5b3eade0460d91f86584cef73ed9afeb6a034d": {
        name: "Target(6)⏪",
        type: 1,
        copyContractAddr: "",
        mainFunc: "0x7292dd91",
        signers: backBurnerSigs,
      },
      "7": {
        name: "Target(7)🔄",
        type: 1,
        copyContractAddr: "",
        mainFunc: "0x68c9718a",
        signers: backBurnerSigs,
      },
    },
    targetArbs: {
      "0x7ff36ab5": {
        name: "ASEEFT(6)🍞",
        type: 1,
        copyContractAddr: "0xb094f7ba5361098dfa96FEcA687130d9ef0EF561",
        mainFunc: "0x68c9718a",
        signers: backBurnerSigs,
      },
      "0x18cbafe5": {
        name: "ASETFE(6)💩",
        type: 1,
        copyContractAddr: "0xb094f7ba5361098dfa96FEcA687130d9ef0EF561",
        mainFunc: "0x68c9718a",
        signers: backBurnerSigs,
      },
    },
  },
}

export const developmentChains = ["hardhat", "localhost"]
