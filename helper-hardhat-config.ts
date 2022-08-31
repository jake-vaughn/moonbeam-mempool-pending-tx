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
                type: 99,
                copyContractAddr: "",
                signers: [99],
                active: true,
            },
        },
    },
}

export const developmentChains = ["hardhat", "localhost"]
