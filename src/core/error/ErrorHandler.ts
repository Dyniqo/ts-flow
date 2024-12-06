import { IErrorHandler } from '../../interfaces/core/error/IErrorHandler';
import { ILogger } from '../../interfaces/utils/ILogger';

/**
 * Implementation of the IErrorHandler interface for handling errors.
 * This class logs errors using the provided logger and provides a hook for custom error-handling logic.
 */
export class ErrorHandler implements IErrorHandler {
     /**
      * Logger instance for recording error messages.
      */
     private logger: ILogger;

     /**
      * Constructs an ErrorHandler instance with the given logger.
      * Example:
      * ```typescript
      * const errorHandler = new ErrorHandler(myLogger);
      * ```
      * @param logger - An implementation of the ILogger interface used for logging errors.
      */
     constructor(logger: ILogger) {
          this.logger = logger;
     }

     /**
      * Handles an error by logging its details and optionally executing additional error-handling logic.
      * This method serves as a central point for managing errors in tasks and workflows,
      * enabling features like logging, reporting, retrying, or updating system metrics.
      * 
      * Example:
      * ```typescript
      * await errorHandler.handleError(new Error('Task execution failed'), { taskId: '123', step: 'data processing' });
      * ```
      * 
      * @param error - The error to handle. Includes the message and stack trace.
      * @param context - Optional context providing additional information about the error's origin or impact.
      *                  This can include metadata such as task or workflow identifiers, input data, or state.
      * @returns A promise that resolves once the error has been logged and handled.
      */
     public async handleError(error: Error, context: any): Promise<void> {
          this.logger.error(`Error: ${error.message}`);
     }
}
