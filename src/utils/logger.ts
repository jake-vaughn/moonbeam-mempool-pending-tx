import { TransactionResponse } from "@ethersproject/providers"
import path from "path"
import winston from "winston"

import { targetContractItem } from "../../helper-hardhat-config"

const { format, transports } = winston
let txReported: number = 0

const logFormat = format.printf(
  info =>
    `${info.timestamp}` +
    ` - ${info.message}` +
    (info.metadata.name ? ` ` + info.metadata.name : "") +
    (info.metadata.blockFound ? ` blockFound: ` + info.metadata.blockFound : ""),
  // (info.metadata.memPoolHash ? `\nmemPoolHash: ` + chalk.cyanBright(info.metadata.memPoolHash) : "") +
  // (info.metadata.mevBotHash ? `\nmevBotHash: ` + chalk.cyanBright(info.metadata.mevBotHash) : ""),
)

export const mevBotTransportConsole = new transports.Console({
  format: format.combine(format.colorize(), logFormat),
})

export const mevBotTransportFile = new transports.File({
  filename: "logs/mevBot.log",
  format: format.combine(format.json()),
})

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: format.combine(
    format.label({ label: path.basename("../mevBot", ".ts") }),
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    // Format the metadata object
    format.metadata({ fillExcept: ["message", "level", "timestamp", "label"] }),
  ),
  transports: [mevBotTransportConsole, mevBotTransportFile],
  exitOnError: false,
})

export async function tempLog(
  target: targetContractItem,
  memPoolTx: TransactionResponse,
  mevBotTx: TransactionResponse,
  blockFound: number,
) {
  txReported++
  logger.debug(`${txReported}`, {
    memPoolTx: memPoolTx,
    mevBotTx: mevBotTx,
    blockFound: blockFound,
    txReported: txReported,
    name: target.name,
    type: target.type,
    signer: target.signers[memPoolTx.from],
  })
}

export async function tempErrorLog(
  err: unknown,
  target: targetContractItem,
  memPoolTx: TransactionResponse,
  blockFound: number,
) {
  txReported++
  logger.error(`error ${txReported}`, {
    memPoolTx: memPoolTx,
    blockFound: blockFound,
    txReported: txReported,
    name: target.name,
    type: target.type,
    signer: target.signers[memPoolTx.from],
    error: err,
  })
}
