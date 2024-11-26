/**
 * Interface defining a backoff strategy for calculating delays between retry attempts.
 * A backoff strategy determines how the delay evolves based on the number of attempts.
 */
export interface IBackoffStrategy {
     /**
      * Calculates the delay for a given retry attempt.
      * @param attempt - The current retry attempt number (starting from 1).
      * @returns The delay in milliseconds before the next retry attempt.
      */
     getDelay(attempt: number): number;
}
