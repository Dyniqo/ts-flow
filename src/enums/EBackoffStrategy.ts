/**
 * Enum representing the different backoff strategies for retry mechanisms.
 * Backoff strategies determine how the delay between retries is calculated.
 */
export enum EBackoffStrategy {
     /**
      * FIXED backoff strategy applies a constant delay between retries.
      * This strategy is simple and predictable, making it suitable for scenarios
      * where consistent retry intervals are desired.
      * Example: A fixed delay of 5 seconds for every retry.
      */
     FIXED = 'fixed',

     /**
      * EXPONENTIAL backoff strategy increases the delay exponentially with each retry.
      * This strategy reduces the load on the system during repeated failures by increasing
      * the delay between attempts.
      * Example: First retry after 1 second, second retry after 2 seconds, third retry after 4 seconds, etc.
      */
     EXPONENTIAL = 'exponential',

     /**
      * LINEAR backoff strategy increases the delay in a linear fashion with each retry.
      * This strategy adds a consistent increment to the delay for each subsequent attempt.
      * Example: First retry after 1 second, second retry after 2 seconds, third retry after 3 seconds, etc.
      */
     LINEAR = 'linear',
}
