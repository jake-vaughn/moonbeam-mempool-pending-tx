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
  // Signers root (Signers should not overlap)
  signers: addressMatchInfo
  // Enable Disable Target
  active: boolean
}

export const networkConfig: networkConfigInfo = {
  31337: {
    name: "hardhat",
    blockConfirmations: 1,
    targetContracts: {},
  },
  1284: {
    name: "moonbeam",
    blockConfirmations: 1,
    targetContracts: {
      "0x59ddC0C8d067dEB508b36d69254Ac6bafD260575": {
        name: "Target[1]",
        type: 1,
        copyContractAddr: "0xc8367169672C4289797a29Bf8Bc7854804EE39F6",
        signers: {
          // 2 addresses for First Target
          "0xBa5aCE2Bf8a96bCcC8Bf58b9Fb8b89a16AA86f58": 8,
          "0xd3870F9A418f11Bab18D3A5d89BC1Ae8eBee0551": 9,
        },
        active: false,
      },
      "0x2372AA79d0f35310E3Cd3525ecff352922bdAf7C": {
        name: "Target[2]",
        type: 1,
        copyContractAddr: "0x726714e8457aCbD729805223616Ec5A6D8C7193A",
        signers: {
          // 1 address for Second Target
          "0xE4ef74629a9da7DFd2a940c4BFBA56D3B8110769": 10,
        },
        active: false,
      },
      "0x2541300Dff59926F0855016e861A1426fb547037": {
        name: "Target[3]",
        type: 3,
        copyContractAddr: "0x5F31BAaE1B7adb9E28C33010B7b923C031a963B8",
        signers: {
          // 50 addresses
          "0xd7178258b69Bcace33502285fe0D5094611dD4e1": 11,
          "0x3235463b966275914d5Bf85c4754dCfD2a4BD695": 12,
          "0x3567779aB5FF236BFFf34851BF4aB8AF5611C9ed": 13,
          "0x7CA226547f14e2654aACbCe3fa31FA1eB9Fdb440": 14,
          "0xBdB61F01C7238fcd9AF0C0d09239412f87f59335": 15,
          "0x53124Cf991845AC2E40b564601fD5B61DabD0322": 16,
          "0xAE32219976c13198247FFd1DDddaF7250b0EC98B": 17,
          "0xb7eF6EB82d4f08768bF3CfF91f578dF13e3B29C1": 18,
          "0x37081c8cB9B3647bFF27579bcbB0D76c4A353cB5": 19,
          "0x5Ba7831f4725fa8CCd2f851d572632d8CDc5d695": 20,
          "0x6f72894C12b9A4d1a8a3a6D9ed11A24B65dE21e7": 21,
          "0x4FADCA4Ad1Dc3d57295AdC4B886b0d79851d0874": 22,
          "0xa3696072Ad865fd43dF458D3e012E173D5ac2932": 23,
          "0x05443e799b50Caf675875ca35EDCcA703345D62f": 24,
          "0xafF714aA3F9a143aa76cd66F8a44B2E9bee60b03": 25,
          "0x6b1879fB60616580E9A0D46a4B6c2426b2D2E2e2": 26,
          "0x24492253FbdcEf8A6C0720fa1DCFbE43920bF9b7": 27,
          "0x1e7F595dcbFbB1AF66c29bd35D2ffE702FDc9882": 28,
          "0x49C7966FA57Bdd0b53167462EAA8E4DdcF745eB9": 29,
          "0xB345D6E25BA1E83cC1b82127C3d42C822127d8a0": 30,
          "0x16eE6F30cd85Da059790DaE8D67B5f323CC9318C": 31,
          "0xFacd32Eab0EF45F261CC52C8629Db0c889749592": 32,
          "0x29217583b134128787a441C0353E53C1CD2113Df": 33,
          "0xCD60e35ddc140279536781181A836B124a5dF79f": 34,
          "0xFc85548C5c0540e4f5b86F60A8ddAe78bf3B7DCB": 35,
          "0xdbeE2D0C6171ADeD0C65e6B76459a784d71971A6": 36,
          "0x82B8d4f29161072a057E789805e6296fAAD39F7f": 37,
          "0xf0D8D8c3470e4362Fd84E5da5Db016476Fe8CBC3": 38,
          "0x1AfBffa81e9Bb11Ac74e4B19c13FaD895414Df2b": 39,
          "0x6B71De8B9fF00B77A6B0eA3819709dDdbfAc48F7": 40,
          "0x4826f20d8Dbc1348dd6e7E643cB0ac47C566C7f9": 41,
          "0xFDf0217C1A23ABfe2eef5b98A216c01B648fF47E": 42,
          "0x5689Ee6420367ad1B591689b1835D0E6B5c948DA": 43,
          "0xAbF7833565cc116f605e44Bc07c517569b23eA7A": 44,
          "0x9626618043348156f3dE6661DE9e2e11438361e4": 45,
          "0x5aDd820725Fe2d97Ee1CE2e1C2EA2B3741c4C06A": 46,
          "0x4b1Ec619fDB40F63C3AAf2E8f95994799D86De3e": 47,
          "0xD53a7a311954C9cEAD810b587BcBA08F0FcBbF08": 48,
          "0x20a92eaaBd9aC054787F7c636E85A519c4f82c71": 49,
          "0xEDF66AbFc533e14e4208c3a4F077ff32357EA774": 50,
          "0x2BD8953298E623bdE115F1B191b676c53C9A6186": 51,
          "0xf9421e95290A1778c8B0362C51cECd0D0F948de2": 52,
          "0x7d7140424194FE2322ef3A698df892109a886967": 53,
          "0x3a40F2018f09d570947EbA70c9cBfB428A82D678": 54,
          "0xfA9628a08d95Dc24C8a61E13e7D130a7F5FC6a5b": 55,
          "0x8e30d079c50b7E1341fF849F82E561b8E4A2C31E": 56,
          "0x79Eb95AA4f2EF7883487649e02C152E553F8433C": 57,
          "0x9507ed4443648a4F92f3200423A0268fC6127D5A": 58,
          "0x44cdC2D3f73c76c9cBb097Fff3BBb261Ae850f6E": 59,
          "0xA76aaa5c2c6d0C3b1E640DDCB222E36B1B004944": 60,
        },
        active: true,
      },
      "0xAb9C7a8654b9224E3A741Dc3A4991F2d1b82307A": {
        name: "Target[4]",
        type: 1,
        copyContractAddr: "0x7Ff769F69CEE5A5FB13afb6E2195313Ce3884981",
        signers: {
          // ? addresses
          "0x6df2eA5Ecc8d604A554FcF092A9F939cd8b7F09E": 61,
          "0xf9e156992644536653b9da48DC1090c74EF904e9": 62,
          "0x8A3169843fc4fD85201ED558e96217e9eA0BA7e1": 63,
          "0x9Da53054B8C3002496f5Dd521df1fc515de1d9F3": 64,
          "0xF02435ea48A5664BE1109C99e79404F463E8499F": 65,
          // "0x55E2C08E9Ca9918CEF411257FABcF4aB2228FcB8": 66,
          // "0xcB0B5edB701019c9F67d45f989533a66DC1a491E": 67,
          // "0x6df2eA5Ecc8d604A554FcF092A9F939cd8b7F09E": 68,
          // "0x6df2eA5Ecc8d604A554FcF092A9F939cd8b7F09E": 69,
        },
        active: false,
      },
      "0x2b731E8e2C72cC14628346EB1Bc11ebF1A4ef2e6": {
        name: "Target[5]",
        type: 1,
        copyContractAddr: "0xfda140A05F78DBFB3381C9E878cCdb66043B65BC",
        signers: {
          // 31 addresses
          "0x90FC9647B848e720Cb8Cc95FA44885B370328002": 71,
          "0x364bB62cf4dcc7E43B4BE9A4A7eB8a660Ad9C4cE": 72,
          "0x102208793a9CA523dBc01614FD90f3FC882Bb562": 73,
          "0x6169e6B12B8bB19Ad6880dB2ceE7B7F99FbF5Fa2": 74,
          "0xBaE2Ca85F533f2fAf3CD018057cd64C42a2Fc669": 75,
          "0x8f31921C5bCa85D70D8079F82E7deE82C82DC4Fd": 76,
          "0x04e298D28C5d1137806429C0F410e2Dc9392c802": 77,
          "0xD0E073e5eDD2df5e46e3c515de64904601112B74": 78,
          "0x4629f9da2156Cd02d5f4b1d327139e241b279061": 79,
          "0xE68d4398042D5b509E9a133489A4eE66a59DAaA6": 80,
          "0x5A0c6A9Bf4ec7417e914C13C1d7Bd51AF9507309": 81,
          "0xa9A0b1B8C017995ca96b211e5E5f487EA17851cD": 82,
          "0xFEC1c9c23879bE98772B3351356888cCDBAC2144": 83,
          "0x53Aef3C3fBaC175Be832c130df76348Ed22ce3d1": 84,
          "0x6C90BFF4f74F2ED676566bea4437aad6529B8455": 85,
          "0x67c265b564d5441149D71034Ab14DC7165Cf7C3C": 86,
          "0x06Aae553418db70cC0372de3cDEF682A74Af2c65": 87,
          "0x70e2411F071E3344Cd4d4BfcA245aD34907a4972": 88,
          "0xf446c79c64d0361151318659315f46F2E0e683eB": 89,
          "0x3Ba0e872e26Ace18F5486fb993C56bDc39F790d3": 90,
          "0xF83E6eFA3869b75c87175a4fDa8E82ef8fbAfCee": 91,
          "0x36E5199689da74Ece12149787c0BdD919E24e08F": 92,
          "0x71870615d98d25bee6f1d36C8397eD1070a49796": 93,
          "0x32c5E39fe274b170693B70dCb6f9DA01312C72b0": 94,
          "0x68A9f00f64EC13e2f54794F1648B5d54dB45c955": 95,
          "0x39f252d2BEe92e7c5aF1426e8236B9556C5B1F41": 96,
          "0x02d78F7aB70F96551B657e10662bA4f9c688Bb5D": 97,
          "0x40CAA8db2e964B8caE0B4be1B99F78341C86e155": 98,
          "0xADE4322476f06316f95d8980Cd55b40bB972196B": 99,
          "0xbf2785Ba01f7D925906F80D9b543881DEC6537b8": 100,
          "0x1119a1FB80623307f83C6A70F9af7e766fF2A492": 101,
        },
        active: true,
      },
    },
  },
}

export const developmentChains = ["hardhat", "localhost"]
