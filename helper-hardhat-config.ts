export interface networkConfigItem {
    name?: string
    blockConfirmations?: number
    websocket: string
    targetContracts: targetContractInfo
}

export interface networkConfigInfo {
    [key: number]: networkConfigItem
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
    signers: number[]
    // Enable Disable Target
    active: boolean
}

export interface targetContractInfo {
    [targetAddr: string]: targetContractItem
}

export interface type2Info {
    [addr: string]: number
}

export const networkConfig: networkConfigInfo = {
    1284: {
        name: "moonbeam",
        blockConfirmations: 1,
        websocket: process.env.MOONBEAM_WS_URL || "ws://127.0.0.1:9944",
        targetContracts: {
            "0x59ddC0C8d067dEB508b36d69254Ac6bafD260575": {
                name: "First Target",
                type: 1,
                copyContractAddr: "0xc8367169672C4289797a29Bf8Bc7854804EE39F6",
                signers: [0],
                active: false,
            },
            "0x2372AA79d0f35310E3Cd3525ecff352922bdAf7C": {
                name: "Second Target",
                type: 1,
                copyContractAddr: "0x726714e8457aCbD729805223616Ec5A6D8C7193A",
                signers: [0],
                active: true,
            },
            "0x2541300Dff59926F0855016e861A1426fb547037": {
                name: "0x2541 Contract (Todo) High Prof",
                type: 2,
                copyContractAddr: "0x8b8f84c8913eb2cdbf8b552c035ef397e1f0c225",
                signers: [50],
                active: true,
            },
        },
    },
}

export const developmentChains = ["hardhat", "localhost"]

export const type2AddressMatch: type2Info = {
    "0xd7178258b69bcace33502285fe0d5094611dd4e1": 1,
    "0x3235463b966275914d5bf85c4754dcfd2a4bd695": 2,
    "0x3567779ab5ff236bfff34851bf4ab8af5611c9ed": 3,
    "0x7ca226547f14e2654aacbce3fa31fa1eb9fdb440": 4,
    "0xbdb61f01c7238fcd9af0c0d09239412f87f59335": 5,
    "0x53124cf991845ac2e40b564601fd5b61dabd0322": 6,
    "0xae32219976c13198247ffd1ddddaf7250b0ec98b": 7,
    "0xb7ef6eb82d4f08768bf3cff91f578df13e3b29c1": 8,
    "0x37081c8cb9b3647bff27579bcbb0d76c4a353cb5": 9,
    "0x5ba7831f4725fa8ccd2f851d572632d8cdc5d695": 10,
    "0x6f72894c12b9a4d1a8a3a6d9ed11a24b65de21e7": 11,
    "0x4fadca4ad1dc3d57295adc4b886b0d79851d0874": 12,
    "0xa3696072ad865fd43df458d3e012e173d5ac2932": 13,
    "0x05443e799b50caf675875ca35edcca703345d62f": 14,
    "0xaff714aa3f9a143aa76cd66f8a44b2e9bee60b03": 15,
    "0x6b1879fb60616580e9a0d46a4b6c2426b2d2e2e2": 16,
    "0x24492253fbdcef8a6c0720fa1dcfbe43920bf9b7": 17,
    "0x1e7f595dcbfbb1af66c29bd35d2ffe702fdc9882": 18,
    "0x49c7966fa57bdd0b53167462eaa8e4ddcf745eb9": 19,
    "0xb345d6e25ba1e83cc1b82127c3d42c822127d8a0": 20,
    "0x16ee6f30cd85da059790dae8d67b5f323cc9318c": 21,
    "0xfacd32eab0ef45f261cc52c8629db0c889749592": 22,
    "0x29217583b134128787a441c0353e53c1cd2113df": 23,
    "0xcd60e35ddc140279536781181a836b124a5df79f": 24,
    "0xfc85548c5c0540e4f5b86f60a8ddae78bf3b7dcb": 25,
    "0xdbee2d0c6171aded0c65e6b76459a784d71971a6": 26,
    "0x82b8d4f29161072a057e789805e6296faad39f7f": 27,
    "0xf0d8d8c3470e4362fd84e5da5db016476fe8cbc3": 28,
    "0x1afbffa81e9bb11ac74e4b19c13fad895414df2b": 29,
    "0x6b71de8b9ff00b77a6b0ea3819709dddbfac48f7": 30,
    "0x4826f20d8dbc1348dd6e7e643cb0ac47c566c7f9": 31,
    "0xfdf0217c1a23abfe2eef5b98a216c01b648ff47e": 32,
    "0x5689ee6420367ad1b591689b1835d0e6b5c948da": 33,
    "0xabf7833565cc116f605e44bc07c517569b23ea7a": 34,
    "0x9626618043348156f3de6661de9e2e11438361e4": 35,
    "0x5add820725fe2d97ee1ce2e1c2ea2b3741c4c06a": 36,
    "0x4b1ec619fdb40f63c3aaf2e8f95994799d86de3e": 37,
    "0xd53a7a311954c9cead810b587bcba08f0fcbbf08": 38,
    "0x20a92eaabd9ac054787f7c636e85a519c4f82c71": 39,
    "0xedf66abfc533e14e4208c3a4f077ff32357ea774": 40,
    "0x2bd8953298e623bde115f1b191b676c53c9a6186": 41,
    "0xf9421e95290a1778c8b0362c51cecd0d0f948de2": 42,
    "0x7d7140424194fe2322ef3a698df892109a886967": 43,
    "0x3a40f2018f09d570947eba70c9cbfb428a82d678": 44,
    "0xfa9628a08d95dc24c8a61e13e7d130a7f5fc6a5b": 45,
    "0x8e30d079c50b7e1341ff849f82e561b8e4a2c31e": 46,
    "0x79eb95aa4f2ef7883487649e02c152e553f8433c": 47,
    "0x9507ed4443648a4f92f3200423a0268fc6127d5a": 48,
    "0x44cdc2d3f73c76c9cbb097fff3bbb261ae850f6e": 49,
    "0xa76aaa5c2c6d0c3b1e640ddcb222e36b1b004944": 50,
}
