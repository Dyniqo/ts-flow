/**
 * Interface defining the policy for task timeouts.
 * Provides a mechanism to specify and retrieve the timeout duration for tasks.
 */
export interface ITimeoutPolicy {

     /**
      * Retrieves the timeout duration for a task.
      * The timeout is the maximum amount of time (in milliseconds) a task is allowed to run before being terminated.
      * Example:
      * ```typescript
      * const timeout = timeoutPolicy.getTimeout(); // e.g., 5000 milliseconds
      * ```
      * @returns The timeout duration in milliseconds.
      */
     getTimeout(): number;
}
