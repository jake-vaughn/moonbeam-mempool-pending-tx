import chalk from "chalk"
import path from "path"
import winston from "winston"

const { format, transports } = winston

const logFormat = format.printf(
  info =>
    `${chalk.whiteBright(info.timestamp)} ${info.level} [${info.label}]: ${info.message}` +
    (info.metadata.Chain ? `\nChain: ` + chalk.cyanBright(info.metadata.Chain) : "") +
    (info.metadata.name ? `\nname: ` + info.metadata.name : "") +
    (info.metadata.memPoolHash ? `\nmemPoolHash: ` + chalk.cyanBright(info.metadata.memPoolHash) : "") +
    (info.metadata.mevBotHash ? `\nmevBotHash: ` + chalk.cyanBright(info.metadata.mevBotHash) : ""),
)

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: format.combine(
    format.label({ label: path.basename("../mevBot", ".ts") }),
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    // Format the metadata object
    format.metadata({ fillExcept: ["message", "level", "timestamp", "label"] }),
  ),
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), logFormat),
    }),
    new transports.File({
      filename: "logs/mevBot.log",
      format: format.combine(
        // Render in one line in your log file.
        // If you use prettyPrint() here it will be really
        // difficult to exploit your logs files afterwards.
        format.json(),
      ),
    }),
  ],
  exitOnError: false,
})
