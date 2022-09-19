import { CurrencyAmount, Token } from "@uniswap/sdk-core"
import { Pair, Route } from "custom-uniswap-v2-sdk"
import hre from "hardhat"

const { ethers, network } = hre
const rpcProvider = ethers.provider
const chainId = network.config.chainId!

async function main() {
  const stellaFactoryAddr = "0x68A384D826D3678f78BB9FB1533c7E9577dACc0E"
  const stellaInitCodeHash = "0x48a6ca3d52d0d0a6c53a83cc3c8688dd46ea4cb786b169ee959b95ad30f61643"
  const wglmrAddress = "0xAcc15dC74880C9944775448304B263D191c6077F" // must be checksummed
  const dotAddress = "0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080" // must be checksummed

  const wglmrDecimals = 18
  const dotDecimals = 10

  const WGLMR = new Token(chainId, wglmrAddress, wglmrDecimals)
  const DOT = new Token(chainId, dotAddress, dotDecimals)

  const dotWglmrPair = getPair(WGLMR, DOT, stellaFactoryAddr, stellaInitCodeHash)
}

async function getPair(tokenA: Token, tokenB: Token, factoryAddr: string, initCodeHash: string): Promise<Pair> {
  const pairAddress = Pair.getAddress(tokenA, tokenB, factoryAddr, initCodeHash)

  const reserves = [
    /* use pairAddress to fetch reserves here */
  ]
  const [reserve0, reserve1] = reserves

  const tokens = [tokenA, tokenB]
  const [token0, token1] = tokens[0].sortsBefore(tokens[1]) ? tokens : [tokens[1], tokens[0]]

  const pair = new Pair(
    CurrencyAmount.fromRawAmount(token0, reserve0),
    CurrencyAmount.fromRawAmount(token1, reserve1),
    factoryAddr,
    initCodeHash,
  )
  return pair
}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
