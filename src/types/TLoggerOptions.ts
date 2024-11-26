import { ELogLevel } from '../enums';

/**
 * Type representing the configuration options for logging in the system.
 * These options allow customization of logging levels and integration with external loggers.
 */
export type TLoggerOptions = {
     /**
      * The logging level to be used by the logger.
      * Determines the severity of logs that should be captured.
      * Example: Setting `level: ELogLevel.INFO` will log messages at the `INFO` level and higher (e.g., WARN, ERROR).
      * Optional: If not specified, the system will use a default logging level.
      */
     level?: ELogLevel;

     /**
      * An external logger instance to be used instead of the default logger.
      * Allows integration with third-party logging libraries such as Winston, Bunyan, or custom implementations.
      * Example: Providing a Winston logger instance to use its advanced features.
      * Optional: If not specified, the system will use its internal logging mechanism.
      */
     externalLogger?: any;
};
