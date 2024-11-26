import { EBackoffStrategy } from '../enums';

/**
 * Type representing the configuration options for backoff strategies used during retries.
 * Backoff options control how delays between retry attempts are calculated.
 */
export type TBackoffOptions = {
     /**
      * The backoff strategy to apply during retries.
      * Defines the approach for calculating the delay between retry attempts.
      * Example strategies: `fixed`, `exponential`, `linear`.
      */
     strategy: EBackoffStrategy;

     /**
      * The initial delay (in milliseconds) before the first retry attempt.
      * This value serves as the base delay for the backoff strategy.
      * Example: Setting `delay: 1000` starts with a 1-second delay before the first retry.
      */
     delay: number;

     /**
      * The maximum allowable delay (in milliseconds) between retries.
      * Ensures that the calculated delay does not exceed this value, even for exponential strategies.
      * Example: Setting `maxDelay: 10000` caps the delay to 10 seconds.
      * Optional: If not provided, the delay is determined solely by the backoff strategy.
      */
     maxDelay?: number;
};
