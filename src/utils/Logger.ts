import { ILogger } from '../interfaces/utils/ILogger';
import { ELogLevel } from '../enums';

/**
 * Implementation of a logger that supports multiple log levels and integrates
 * with an optional external logging system. By default, logs are printed to the console.
 */
export class Logger implements ILogger {
     private level: ELogLevel;
     private externalLogger: any;

     /**
      * Constructs a Logger instance with optional configurations for log level and external logger.
      * Example:
      * ```typescript
      * const logger = new Logger({ level: ELogLevel.DEBUG });
      * ```
      * @param options - Configuration object for the logger.
      *                 - `level` specifies the minimum log level to output.
      *                 - `externalLogger` allows integration with an external logging system.
      */
     constructor(options?: { level?: ELogLevel; externalLogger?: any }) {
          this.level = options?.level || ELogLevel.INFO;
          this.externalLogger = options?.externalLogger;
     }

     /**
      * Sets the logging level for the logger.
      * Example:
      * ```typescript
      * logger.setLevel(ELogLevel.WARN);
      * ```
      * @param level - The new log level to set.
      */
     public setLevel(level: ELogLevel): void {
          this.level = level;
     }

     /**
      * Logs a message at the specified log level.
      * If an external logger is provided, the message is passed to it.
      * Otherwise, the message is logged to the console if it meets the log level threshold.
      * Example:
      * ```typescript
      * logger.log(ELogLevel.INFO, 'This is an info message');
      * ```
      * @param level - The log level of the message.
      * @param message - The message to log.
      */
     public log(level: ELogLevel, message: string): void {
          if (this.externalLogger) {
               this.externalLogger.log(level, message);
          } else {
               if (this.shouldLog(level)) {
                    console.log(`[${level.toUpperCase()}] ${message}`);
               }
          }
     }

     /**
      * Logs a debug-level message.
      * Example:
      * ```typescript
      * logger.debug('This is a debug message');
      * ```
      * @param message - The debug message to log.
      */
     public debug(message: string): void {
          this.log(ELogLevel.DEBUG, message);
     }

     /**
      * Logs an info-level message.
      * Example:
      * ```typescript
      * logger.info('This is an info message');
      * ```
      * @param message - The info message to log.
      */
     public info(message: string): void {
          this.log(ELogLevel.INFO, message);
     }

     /**
      * Logs a warning-level message.
      * Example:
      * ```typescript
      * logger.warn('This is a warning message');
      * ```
      * @param message - The warning message to log.
      */
     public warn(message: string): void {
          this.log(ELogLevel.WARN, message);
     }

     /**
      * Logs an error-level message.
      * Example:
      * ```typescript
      * logger.error('This is an error message');
      * ```
      * @param message - The error message to log.
      */
     public error(message: string): void {
          this.log(ELogLevel.ERROR, message);
     }

     /**
      * Determines if a message at the specified log level should be logged
      * based on the current log level threshold.
      * @param level - The log level to check.
      * @returns `true` if the message should be logged, `false` otherwise.
      */
     private shouldLog(level: ELogLevel): boolean {
          const levels = {
               [ELogLevel.DEBUG]: 0,
               [ELogLevel.INFO]: 1,
               [ELogLevel.WARN]: 2,
               [ELogLevel.ERROR]: 3,
          };
          return levels[level] >= levels[this.level];
     }
}
