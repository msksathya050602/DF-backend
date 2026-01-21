import * as winston from "winston";

import { isLocal } from "@/config";

export interface LoggerInterface {
  info(msg: string, xCorrelationId?: string): void;
  warn(msg: string, xCorrelationId?: string): void;
  error(msg: string, xCorrelationId?: string): void;
  debug(msg: string, xCorrelationId?: string): void;
}

export type LoggerOption = {
  logFileName: string;
  logLevel: "info" | "warn" | "error" | "debug";
  dirName?: string;
};

export class Logger implements LoggerInterface {
  private logger: winston.Logger;

  constructor(loggerOption: LoggerOption) {
    this.initializeLogger(loggerOption);
  }

  private initializeLogger(loggerOption: LoggerOption) {
    const {
      logFileName = "service",
      logLevel = "debug",
      dirName,
    } = loggerOption;
    const { json, combine, timestamp, errors } = winston.format;
    const format = combine(
      winston.format((info) => {
        info["xCorrelationId"];
        return info;
      })(),
      timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      errors({ stack: true }),
      json(),
    );
    const transports: (
      | winston.transports.ConsoleTransportInstance
      | winston.transports.FileTransportInstance
    )[] = [new winston.transports.Console()];
    const writeFile = new winston.transports.File({
      filename: `${logFileName}.log`,
      level: logLevel,
      dirname: dirName,
    });
    transports.push(writeFile);
    this.logger = winston.createLogger({ format, transports });
  }

  info(msg: string, xCorrelationId?: string): void {
    this.logger.info(msg, { xCorrelationId });
  }
  warn(msg: string, xCorrelationId?: string): void {
    this.logger.warn(msg, { xCorrelationId });
  }
  error(msg: string, xCorrelationId?: string): void {
    this.logger.error(msg, { xCorrelationId });
  }
  debug(msg: string, xCorrelationId?: string): void {
    this.logger.debug(msg, { xCorrelationId });
  }
}

const loggerOption: LoggerOption = {
  logFileName: "service",
  logLevel: "debug",
  // ...(!isLocal && { dirName: '/app/logs' }),
};
const logger = new Logger(loggerOption);

export default logger;
