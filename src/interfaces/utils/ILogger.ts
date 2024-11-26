import { ELogLevel } from '../../enums';

/**
 * Interface defining the structure of a logger.
 * A logger is responsible for capturing and outputting log messages at various levels.
 */
export interface ILogger {
     /**
      * Logs a message at the specified log level.
      * @param level - The severity level of the log (e.g., DEBUG, INFO, WARN, ERROR).
      * @param message - The message to be logged.
      */
     log(level: ELogLevel, message: string): void;

     /**
      * Logs a debug-level message.
      * Typically used for detailed diagnostic information during development.
      * @param message - The debug message to be logged.
      */
     debug(message: string): void;

     /**
      * Logs an info-level message.
      * Used to record general informational events about the application's operation.
      * @param message - The informational message to be logged.
      */
     info(message: string): void;

     /**
      * Logs a warning-level message.
      * Used to highlight potentially harmful situations that might need attention.
      * @param message - The warning message to be logged.
      */
     warn(message: string): void;

     /**
      * Logs an error-level message.
      * Used to capture critical issues or errors that require immediate attention.
      * @param message - The error message to be logged.
      */
     error(message: string): void;

     /**
      * Sets the logging level for the logger.
      * Determines the minimum severity of logs that will be captured.
      * @param level - The desired log level (e.g., DEBUG, INFO, WARN, ERROR).
      */
     setLevel(level: ELogLevel): void;
}
