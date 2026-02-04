// Structured logger utility
import winston from 'winston';

export interface LogContext {
  service?: string;
  userId?: string;
  requestId?: string;
  [key: string]: any;
}

class Logger {
  private logger: winston.Logger;

  constructor(serviceName: string = 'unknown') {
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      defaultMeta: { service: serviceName },
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          ),
        }),
      ],
    });
  }

  info(message: string, context?: LogContext) {
    this.logger.info(message, context);
  }

  error(message: string, error?: Error | any, context?: LogContext) {
    this.logger.error(message, {
      ...context,
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name,
      } : error,
    });
  }

  warn(message: string, context?: LogContext) {
    this.logger.warn(message, context);
  }

  debug(message: string, context?: LogContext) {
    this.logger.debug(message, context);
  }
}

export const createLogger = (serviceName: string) => new Logger(serviceName);
