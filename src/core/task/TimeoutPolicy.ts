import { ITimeoutPolicy } from '../../interfaces/core/task/ITimeoutPolicy';

/**
 * Class implementing a timeout policy for tasks, defining the maximum time allowed for execution.
 */
export class TimeoutPolicy implements ITimeoutPolicy {
     /**
      * The timeout duration in milliseconds.
      */
     private timeout: number;

     /**
      * Constructs a TimeoutPolicy with a specified timeout duration.
      * Example:
      * ```typescript
      * const policy = new TimeoutPolicy(5000); // 5000 milliseconds timeout
      * ```
      * @param timeout - The timeout duration in milliseconds. Defaults to 0 (no timeout).
      */
     constructor(timeout: number = 0) {
          this.timeout = timeout;
     }

     /**
      * Retrieves the configured timeout duration for the policy.
      * Example:
      * ```typescript
      * const timeout = policy.getTimeout(); // Returns 5000
      * ```
      * @returns The timeout duration in milliseconds.
      */
     public getTimeout(): number {
          return this.timeout;
     }
}
