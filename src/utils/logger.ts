import chalk from "chalk"
import path from "path"
import winston from "winston"

const { format, transports } = winston

const logFormat = format.printf(
  info =>
    `${info.message}` +
    (info.metadata.Chain ? ` Chain: ` + info.metadata.Chain : "") +
    (info.metadata.name ? ` name: ` + info.metadata.name : "") +
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

// Human Readable
const logFormatHumanReadable = format.printf(
  info =>
    `${info.timestamp} ${info.message}` +
    (info.metadata.blockPosition ? ` blockPosition: ` + info.metadata.blockPosition : "") +
    (info.metadata.memHash ? ` memHash: https://moonscan.io/tx/` + info.metadata.memHash : "") +
    (info.metadata.mevHash ? ` mevHash: https://moonscan.io/tx/` + info.metadata.mevHash : ""),
)

export const loggerHumanReadable = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: format.combine(
    format.label({ label: path.basename("../mevBot", ".ts") }),
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    // Format the metadata object
    format.metadata({ fillExcept: ["message", "level", "timestamp", "label"] }),
  ),
  transports: [
    // new transports.Console({
    //   format: format.combine(format.colorize(), logFormatHumanReadable),
    // }),
    new transports.File({
      filename: "logs/mevBotReceipts.log",
      format: format.combine(logFormatHumanReadable),
    }),
  ],
  exitOnError: false,
})
