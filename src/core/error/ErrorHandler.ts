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
      * Handles an error by logging it and performing optional custom error-handling actions.
      * This method can be extended to include logic for sending error reports, updating metrics, or retrying tasks.
      * Example:
      * ```typescript
      * await errorHandler.handleError(new Error('Something went wrong'), { taskId: '123' });
      * ```
      * @param error - The error to handle.
      * @param context - Additional context information to provide more details about the error.
      *                  This can include metadata such as the current task or workflow state.
      * @returns A promise that resolves once the error handling is complete.
      */
     public async handleError(error: Error, context: any): Promise<void> {
          this.logger.error(`Error: ${error.message}`);
     }
}
