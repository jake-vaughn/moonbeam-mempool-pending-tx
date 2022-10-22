interface networkNamedContract {
  [key: number]: { [key: string]: { addr: string; functions?: functionInfo; tokenAddr?: string } }
}

interface functionInfo {
  [name: string]: { orig: string; mod?: string }
}

const bbFunctions: functionInfo = {
  setFunc: {
    orig: "85a909d4",
    mod: "8ca5cbb9", // appendStateBatch(bytes32[] _batch, uint256 _shouldStartAtElement)
  },
  mainFunc: {
    orig: "68c9718a",
    mod: "61b9e895", // commitRecord(string snapshotCid,string payloadCommitId,uint256 tentativeBlockHeight,string projectId,bytes32 apiKeyHash)
  },
  withdrawFunc: {
    orig: "c7e42b1b",
  },
}

export const namedContracts: networkNamedContract = {
  1284: {
    t3: { addr: "0xadaaf4999349346935387797c5f79e07c43c12ed", tokenAddr: "0xAcc15dC74880C9944775448304B263D191c6077F" },
    t5: {
      addr: "0x2b731E8e2C72cC14628346EB1Bc11ebF1A4ef2e6",
      functions: bbFunctions,
      tokenAddr: "0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080",
    },
    t6: {
      addr: "0x8B6784b18d534b98d738719F05B0a8a54bB4C098",
      functions: bbFunctions,
      tokenAddr: "0xAcc15dC74880C9944775448304B263D191c6077F",
    },
    t7: {
      addr: "0x08a025B3AF7f175E95Fa304218aCDDB87f150F20",
      functions: bbFunctions,
      tokenAddr: "0x818ec0A7Fe18Ff94269904fCED6AE3DaE6d6dC0b",
    },
  },
  1285: {
    t3: { addr: "0x4a721821bed5186d19471df9478888cc0d9308e4", tokenAddr: "0x98878B06940aE243284CA214f92Bb71a2b032B8A" },
    t6: {
      addr: "0xee5b3eade0460d91f86584cef73ed9afeb6a034d",
      functions: bbFunctions,
      tokenAddr: "0x98878B06940aE243284CA214f92Bb71a2b032B8A",
    },
  },
}
