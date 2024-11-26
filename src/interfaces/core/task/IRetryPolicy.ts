/**
 * Interface defining the policy for retrying failed tasks.
 * Allows customization of retry logic, including determining whether to retry
 * and calculating the delay between retry attempts.
 */
export interface IRetryPolicy {

     /**
      * Determines whether a task should be retried based on the error and the current attempt number.
      * Example:
      * ```typescript
      * const shouldRetry = retryPolicy.shouldRetry(new Error('Network error'), 2);
      * ```
      * @param error - The error that caused the task to fail.
      * @param attempt - The current attempt number (starting from 1).
      * @returns `true` if the task should be retried, `false` otherwise.
      */
     shouldRetry(error: Error, attempt: number): boolean;

     /**
      * Calculates the delay (in milliseconds) before the next retry attempt.
      * Example:
      * ```typescript
      * const delay = retryPolicy.getDelay(3); // Get delay for the 3rd retry attempt.
      * ```
      * @param attempt - The current attempt number (starting from 1).
      * @returns The delay in milliseconds before the next retry.
      */
     getDelay(attempt: number): number;
}
