import { TBackoffOptions } from './TBackoffOptions';

/**
 * Type representing the configuration options for a workflow.
 * These options define behavior for retries, timeouts, backoff strategies, and middleware handling.
 */
export type TWorkflowOptions = {
     /**
      * The maximum number of retry attempts allowed for the workflow.
      * If the workflow fails, it will retry up to this number of times before giving up.
      * Example: Setting `retryCount: 3` allows the workflow to retry up to three times.
      * Optional: If not specified, the default system behavior will be applied.
      */
     retryCount?: number;

     /**
      * Configuration for the backoff strategy during retries.
      * This determines how delays are calculated between retry attempts.
      * Example: Using exponential backoff with a base delay of 1 second.
      * Optional: If not provided, the default backoff strategy will be applied.
      */
     backoffOptions?: TBackoffOptions;

     /**
      * The maximum time (in milliseconds) allowed for the workflow to complete.
      * If the workflow exceeds this time, it will be terminated and considered as timed out.
      * Example: Setting `timeout: 30000` means the workflow has 30 seconds to complete.
      * Optional: If not provided, the workflow will not have a timeout by default.
      */
     timeout?: number;

     /**
      * An array of middleware functions to be executed at various stages of the workflow.
      * Middleware functions can be used to extend or modify the workflow's behavior.
      * Each middleware receives a `context` object and a `next` function to call the next middleware in the chain.
      * Example: Logging, validation, or custom workflow behavior.
      * Optional: If not provided, no middleware will be applied.
      */
     middleware?: Array<(context: any, next: () => Promise<void>) => Promise<void>>;
};
