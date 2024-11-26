/**
 * Enum representing the levels of logging in the system.
 */
export enum ELogLevel {
     /**
      * DEBUG level logs are used for detailed diagnostic information.
      * These logs are helpful during development and troubleshooting.
      * Example: Variable values, flow of the application, etc.
      */
     DEBUG = 'debug',

     /**
      * INFO level logs are used to record general information about the application's operation.
      * These logs provide insights into the normal functioning of the application.
      * Example: Application startup, key events, etc.
      */
     INFO = 'info',

     /**
      * WARN level logs indicate potential issues that do not immediately disrupt the application but may need attention.
      * These logs act as early warnings for developers or operators.
      * Example: Deprecations, configuration issues, etc.
      */
     WARN = 'warn',

     /**
      * ERROR level logs are used to record serious issues that impact application functionality.
      * These logs typically indicate the need for immediate attention or resolution.
      * Example: Application crashes, unhandled exceptions, etc.
      */
     ERROR = 'error',
}
