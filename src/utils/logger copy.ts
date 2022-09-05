import { createLogger, format, transports } from "winston"

const { combine, timestamp, printf, colorize, json, prettyPrint } = format
const CATEGORY = "winston custom format"

// //Using the printf format.
// const customFormat = printf(({ message, timestamp }) => {
//   return `${timestamp}: ${message}`
// })

export const logger = createLogger({
  level: "info",
  format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), json()),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "./logs/mevBot.log", level: "error" }),
    new transports.File({ filename: "./logs/mevBot.log" }),
  ],
})
