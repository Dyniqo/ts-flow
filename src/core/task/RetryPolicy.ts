import { IRetryPolicy } from '../../interfaces/core/task/IRetryPolicy';
import { IBackoffStrategy } from '../../interfaces/utils/IBackoffStrategy';
import { BackoffStrategyFactory } from '../../utils/BackoffStrategies';
import { TBackoffOptions } from '../../types';
import { EBackoffStrategy } from '../../enums';

/**
 * Class implementing a retry policy for tasks, controlling the number of retry attempts
 * and the delay between retries based on a backoff strategy.
 */
export class RetryPolicy implements IRetryPolicy {
     /**
      * The maximum number of retry attempts allowed.
      */
     private maxAttempts: number;

     /**
      * The backoff strategy used to calculate delays between retries.
      */
     private backoffStrategy: IBackoffStrategy;

     /**
      * Constructs a RetryPolicy with a maximum number of attempts and optional backoff options.
      * Example:
      * ```typescript
      * const policy = new RetryPolicy(3, { strategy: 'exponential', delay: 100, maxDelay: 1000 });
      * ```
      * @param maxAttempts - The maximum number of retry attempts allowed.
      * @param backoffOptions - Configuration for the backoff strategy.
      */
     constructor(maxAttempts: number = 0, backoffOptions?: TBackoffOptions) {
          this.maxAttempts = maxAttempts;
          this.backoffStrategy = BackoffStrategyFactory.createStrategy(
               backoffOptions || { strategy: EBackoffStrategy.FIXED, delay: 0 }
          );
     }

     /**
      * Determines whether a task should be retried based on the current attempt number.
      * Example:
      * ```typescript
      * const shouldRetry = retryPolicy.shouldRetry(new Error('Network issue'), 2);
      * ```
      * @param error - The error that caused the task to fail.
      * @param attempt - The current retry attempt number (starting from 1).
      * @returns `true` if the task should be retried, `false` otherwise.
      */
     public shouldRetry(error: Error, attempt: number): boolean {
          return attempt < this.maxAttempts;
     }

     /**
      * Calculates the delay (in milliseconds) before the next retry attempt based on the backoff strategy.
      * Example:
      * ```typescript
      * const delay = retryPolicy.getDelay(2); // Returns the delay for the second retry.
      * ```
      * @param attempt - The current retry attempt number (starting from 1).
      * @returns The delay in milliseconds before the next retry.
      */
     public getDelay(attempt: number): number {
          return this.backoffStrategy.getDelay(attempt);
     }
}
