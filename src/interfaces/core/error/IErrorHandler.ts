/**
 * Interface defining a mechanism for handling errors that occur during execution.
 * Can be used to log errors, notify external systems, or perform other recovery actions.
 */
export interface IErrorHandler {

     /**
      * Handles an error by processing or responding to it in a specific manner.
      * Example:
      * ```typescript
      * errorHandler.handleError(new Error('Something went wrong'), { taskId: '123' });
      * ```
      * @param error - The error object representing the issue that occurred.
      * @param context - Additional context or metadata related to where or why the error occurred.
      *                   This can be used for debugging or to enrich the error handling process.
      * @returns A promise that resolves when the error handling process is complete.
      */
     handleError(error: Error, context: any): Promise<void>;
}
