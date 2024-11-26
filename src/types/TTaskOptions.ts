import { TBackoffOptions } from './TBackoffOptions';

/**
 * Type representing the configuration options for a task.
 * These options define how a task behaves in various scenarios, such as retries, timeouts, and backoff strategies.
 */
export type TTaskOptions = {
     /**
      * The maximum number of retry attempts allowed for the task.
      * If not specified, the default behavior of the system will be applied.
      * Example: Setting `retryCount: 3` means the task will retry up to three times upon failure.
      */
     retryCount?: number;

     /**
      * The configuration options for the backoff strategy to use during retries.
      * This determines how delays are applied between retry attempts.
      * Example: Using an exponential backoff strategy with specific intervals.
      */
     backoffOptions?: TBackoffOptions;

     /**
      * The maximum amount of time (in milliseconds) allowed for the task to complete.
      * If the task exceeds this time, it will be marked as timed out.
      * Example: Setting `timeout: 5000` ensures the task will fail if not completed within 5 seconds.
      */
     timeout?: number;
};
