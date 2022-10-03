export interface addressesNamesItem {
  [targetAddr: string]: string
}

export interface blindArbItem {
  [targetAddr: string]: arbItem
}

export interface arbItem {
  symbol?: string
  factories: string[]
}

export const blindArb: blindArbItem = {
  "0x000000000000000000000000fffffffecb45afd30a637967995394cc88c0c194": {
    symbol: "POOP",
    factories: [
      "0x0000000000000000000000004efb208eeeb5a8c85af70e8fbc43d6806b422bec",
      "0x000000000000000000000000a049a6260921b5ee3183cfb943133d36d7fdb668",
    ],
  },
}

export const lpAddresses: addressesNamesItem = {
  "0x000000000000000000000000b929914b89584b4081c7966ac6287636f7efd053": "usdc-wglmr beam",
  "0x000000000000000000000000555b74dafc4ef3a5a1640041e3244460dc7610d1": "usdc-wglmr stella",
  "0x0000000000000000000000001eb802dfcc9e6d0b553c99c461f27d4000b46cef": "usdc-wglmr zen",
  "0x000000000000000000000000972e5f71358013d1e96f749e5e8e45f4587a4e12": "madUsdc-eth beam",
  "0x00000000000000000000000049a1cc58dcf28d0139daea9c18a3ca23108e78b3": "eth-wglmr stella",
  "0x000000000000000000000000b76543ab05b208ee4d0eccc435dfb6ef00d96142": "dot-wglmr zen",
  "0x000000000000000000000000a927e1e1e044ca1d9fe1854585003477331fe2af": "dot-wglmr stella",
  "0x000000000000000000000000d95cab0ed89269390f2ad121798e6092ea395139": "ausd-wglmr stella",
  "0x00000000000000000000000012e2302e94b5cb1ba2ec01e4fee12a82894cc284": "usdc-ausd pad",
  "0x000000000000000000000000367c36dae9ba198a4fee295c22bc98cb72f77fe1": "busd-wglmr stella",
  "0x0000000000000000000000002738ddff4e24916c56953b0845d0a931c4c47f8c": "usdc-busd flare",
  "0x000000000000000000000000bce4f60832b06e6aa35b832b2549361d9b6861f1": "usdc-wglmr alpha",
  "0x000000000000000000000000d8fbdef502770832e90a6352b275f20f38269b74": "dot-wglmr beam",
  "0x000000000000000000000000ff6ba9a54b3c4cc6d906921fe0b10f68f395afbd": "eth-wglmr lunar",
  "0x00000000000000000000000060d98677e9a122ca3aebad554ad9ee6f30f54d4b": "eth-usdc alpha",
  "0x000000000000000000000000b6c21f139dd75e7b841ef2412549da366453eb0a": "usdt-wglmr stella",
  "0x000000000000000000000000c05437153c9211c85cc1979a1f01cd718dad6b61": "ceUsdc-wglmr conv",
  "0x000000000000000000000000a0143c896408b0804bd05dc2cfb0bff8c915f1a0": "ceUsdc-wglmr zen",
  "0x000000000000000000000000c038b028b2ec1615949b44a317948ef96c251936": "usdt-usdc alpha",
  "0x0000000000000000000000004c5f99045af91d2b6d4fa0ea89fc47cf42711555": "xcIbtc-wglmr stella",
  "0x0000000000000000000000000557949ea1f39e08233246d15af6c24cf8b92b82": "xcIbtc-usdc beam",
  "0x0000000000000000000000009bfcf685e641206115dadc0c9ab17181e1d4975c": "NA",
  "0x000000000000000000000000fc1e699a700974c2d0cd1dd6e4dedd5750089530": "NA",
  "0x00000000000000000000000016f7cf04fa6405efdabc0a9866477a974d7a6d53": "NA",
  "0x000000000000000000000000b822eef11c9478f6155a4161a9ed847e89759aa3": "NA",
  "0x00000000000000000000000016b33336d87687e4a8dcbc30416688c581b42f7c": "NA",
  "0x000000000000000000000000a87b84da24e27193875f4acad69b03a271de9751": "NA",
  "0x00000000000000000000000072a41101ce2698ea84c5948be5534ad36b71e3a1": "NA",
  "0x00000000000000000000000026a2abd79583155ea5d34443b62399879d42748a": "NA",
  "0x0000000000000000000000007f5ac0fc127bcf1eaf54e3cd01b00300a0861a62": "stella-wglmr stella",
  "0x00000000000000000000000081e11a9374033d11cc7e7485a7192ae37d0795d6": "stella-usdc stella",
  "0x0000000000000000000000004efb208eeeb5a8c85af70e8fbc43d6806b422bec": "poop-wglmr stella",
  "0x000000000000000000000000a049a6260921b5ee3183cfb943133d36d7fdb668": "poop-wglmr beam",
  "0x000000000000000000000000a35b2c07cb123ea5e1b9c7530d0812e7e03ec3c1": "NA",
  "0x000000000000000000000000f4c10263f2a4b1f75b8a5fd5328fb61605321639": "NA",
  "0x000000000000000000000000051fcf8986b30860a1341e0031e5622bd18d8a85": "NA",
  "0x000000000000000000000000a0799832fb2b9f18acf44b92fbbedcfd6442dd5e": "NA",
  "0x00000000000000000000000034a1f4ab3548a92c6b32cd778eed310fcd9a340d": "NA",
  "0x000000000000000000000000ac2657ba28768fe5f09052f07a9b7ea867a4608f": "NA",
  "0x0000000000000000000000006a2d262d56735dba19dd70682b39f6be9a931d98": "NA",
  "0x00000000000000000000000068f9f8ffd44f20a8bc4ef81d276228af622a3083": "NA",
  "0x000000000000000000000000a423e7eeb60547d9c7b65005477b63ae7ce67e62": "NA",
  "0x0000000000000000000000006e509b52728c5674997a25a3ee8d6b5227678f98": "NA",
  "0x00000000000000000000000030172290d10db83bc84e6ab5ed60d057495e86b0": "NA",
  "0x000000000000000000000000e4b52aed43938894d9d73656758f25ea91abdfda": "NA",
  "0x000000000000000000000000077fc7b4455050249d7f5511ed588a665e03e6c5": "NA",
  "0x0000000000000000000000002afab635ea2dc4b498ef1c00e63b7a7dba9c93c6": "NA",
  "0x00000000000000000000000091ed237532e2fffa3f114e9a1b9af3e65a8495ec": "NA",
  "0x00000000000000000000000094f9eb420174b8d7396a87c27073f74137b40fe2": "NA",
  "0x00000000000000000000000030d2a9f5fdf90ace8c17952cbb4ee48a55d916a7": "NA",
  "0x0000000000000000000000006853f323508ba1c33a09c4e956ecb9044cc1a801": "NA",
  "0x0000000000000000000000009d19edbfd29d2e01537624b25806493da0d73bbe": "NA",
  "0x000000000000000000000000b521c0acf67390c1364f1e940e44db25828e5ef9": "NA",
  "0x00000000000000000000000092e9768a57162d074dc8c798d4e69e4e0389bbd4": "NA",
  "0x0000000000000000000000009d0122589d60181af7981636bbcb221d904d7559": "NA",
  "0x00000000000000000000000085f1cea5e82c7245f4262d8200d705fccf5944ef": "NA",
  "0x000000000000000000000000f9a1a6c60620a032453aef36a7db078f4fddb9df": "NA",
  "0x0000000000000000000000002726eb7be5ec2356961e92043b10eebbc012dc5e": "NA",
  "0x0000000000000000000000006ba3071760d46040fb4dc7b627c9f68efaca3000": "NA",
  "0x00000000000000000000000086b16a393b76a8f2f734f41bcd09bd5d8504a9f3": "NA",
  "0x0000000000000000000000001dc78acda13a8bc4408b207c9e48cdbc096d95e0": "NA",
  "0x0000000000000000000000008fafcec72b4f06084572a2fcb015593370f5c0c6": "NA",
  "0x000000000000000000000000caf6d9a502aee41a0ef1a079d0cef8e877588116": "NA",
  "0x000000000000000000000000e28459075c806b1bfa72a38e669ccd6fb4125f6a": "NA",
  "0x000000000000000000000000b60590313975f0d98821b6cab5ea2a6d9641d7b6": "NA",
  "0x0000000000000000000000004d1e33b13d6f5b761fa80221d771b89694f43d97": "NA",
  "0x00000000000000000000000056573740f125716e76e9ab44d125cbd003860d3c": "NA",
  "0x00000000000000000000000099588867e817023162f4d4829995299054a5fc57": "NA",
  "0x00000000000000000000000061b4cec9925b1397b64dece8f898047eed0f7a07": "NA",
  "0x000000000000000000000000ab89ed43d10c7ce0f4d6f21616556aecb71b9c5f": "NA",
  "0x000000000000000000000000713081a4b9d51fba1e8fa29247b77d7aa8ed6551": "NA",
  "0x000000000000000000000000fd0468f209a9f99a4bc8beb26816dc333dd7f1f8": "NA",
  "0x000000000000000000000000e3db50049c74de2f7d7269823af3178cf22fd5e3": "NA",
  "0x00000000000000000000000033d0271cc9615d665c81115aabaedd0b1d098761": "NA",
  "0x0000000000000000000000005e3ebf3813ece2ce3090c2ce36cc567dd0b279fd": "NA",
}

export const tokenAddresses: addressesNamesItem = {
  "0x0000000000000000000000000000000000000000000000000000000000000000": "zero",
  "0x000000000000000000000000acc15dc74880c9944775448304b263d191c6077f": "WGLMR",
  "0x0000000000000000000000008f552a71efe5eefc207bf75485b356a0b3f01ec9": "madUSDC",
  "0x000000000000000000000000fa9343c3897324496a05fc75abed6bac29f8a40f": "ETH",
  "0x000000000000000000000000a649325aa7c5093d12d6f98eb4378deae68ce23f": "BUSD",
  "0x000000000000000000000000818ec0a7fe18ff94269904fced6ae3dae6d6dc0b": "USDC",
  "0x000000000000000000000000322e86852e492a7ee17f28a78c663da38fb33bfb": "FRAX",
  "0x000000000000000000000000ffffffff5ac1f9a51a93f5c527385edf7fe98a52": "xcIBTC",
  "0x000000000000000000000000ffffffffea09fb06d082fd1275cd48b191cbcd1d": "xcUSDT",
  "0x000000000000000000000000ffffffff1fcacbd218edc0eba20fc2308c778080": "xcDOT",
  "0x000000000000000000000000cd3b51d98478d53f4515a306be565c6eebef1d58": "GLINT",
  "0x000000000000000000000000ffffffff52c56a9257bb97f4b2b6f7b2d624ecda": "xcaUSD",
  "0x000000000000000000000000ffffffff4c1cbcd97597339702436d4f18a375ab": "xcINTR",
  "0x0000000000000000000000000e358838ce72d5e61e0018a2ffac4bec5f4c88d2": "STELLA",
  "0x000000000000000000000000c9baa8cfdde8e328787e29b4b078abf2dadc2055": "BNB",
  "0x000000000000000000000000fffffffecb45afd30a637967995394cc88c0c194": "POOP",
  "0x00000000000000000000000027292cf0016e5df1d8b37306b2a98588acbd6fca": "axlATOM",
  "0x000000000000000000000000511ab53f793683763e5a8829738301368a2411e3": "WELL",
  "0x0000000000000000000000009fda7ceec4c18008096c2fe2b85f05dc300f94d0": "LDO",
  "0x000000000000000000000000e3e43888fa7803cdc7bea478ab327cf1a0dc11a7": "FLARE",
  "0x0000000000000000000000003fd9b6c9a24e09f67b7b706d72864aebb439100c": "ZLK",
  "0x000000000000000000000000568e579a447ae1c6fef3c7c0456c947cb63abc3e": "CRYSTL",
  "0x000000000000000000000000efaeee334f0fd1712f9a8cc375f427d9cdd40d73": "USDT",
  "0x000000000000000000000000c19281f22a075e0f10351cd5d6ea9f0ac63d4327": "FTM",
  "0x00000000000000000000000031dab3430f3081dff3ccd80f17ad98583437b213": "LUNA",
  "0x0000000000000000000000006a2d262d56735dba19dd70682b39f6be9a931d98": "ceUSDC",
  "0x000000000000000000000000a423e7eeb60547d9c7b65005477b63ae7ce67e62": "EFT",
  "0x00000000000000000000000030d2a9f5fdf90ace8c17952cbb4ee48a55d916a7": "madETH",
}

export const exchanges: addressesNamesItem = {
  "0x000000000000000000000000000000000000022c0d9f0000000009c400000000": "stella",
  "0x000000000000000000000000000000000000022c0d9f000000000bb800000000": "beam",
  "0x000000000000000000000000000000000000022c0d9f0000000007d000000000": "pad",
  "0x0000000000000000000000000000000000006d9a640a000000000bb800000000": "zen",
}

export const functionHashes: addressesNamesItem = {
  "0x38ed1739": "swapExactTokensForTokens",
  "0x7ff36ab5": "swapExactETHForTokens",
  "0x18cbafe5": "swapExactTokensForETH",
  "0x8803dbee": "swapTokensForExactTokens",
  "0xfb3bdb41": "swapETHForExactTokens",
}

export const routers: addressesNamesItem = {
  "0x96b244391D98B62D19aE89b1A4dCcf0fc56970C7": "beamRouter",
  "0x70085a09D30D6f8C4ecF6eE10120d1847383BB57": "stellaRouter",
  "0x40F1fEF0Fe68Fd10ff904070ee00a7769EE7fe34": "padRouter",
  "0xd3B02Ff30c218c7f7756BA14bcA075Bf7C2C951e": "solarflareRouter",
  "0x7a3909C7996EFE42d425cD932fc44E3840fCAB71": "zenlinkRouter",
  "0x09350b691C36c9Dc2245E70A0da9a39e874A6F13": "convergenceRouter",
  "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506": "sushiRouter",
  "0xd0A01ec574D1fC6652eDF79cb2F880fd47D34Ab1": "oldStellaRouter",
  "0xc2544A32872A91F4A553b404C6950e89De901fdb": "fraxRouter",
}
