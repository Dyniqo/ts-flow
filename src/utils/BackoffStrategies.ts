import { IBackoffStrategy } from '../interfaces/utils/IBackoffStrategy';
import { EBackoffStrategy } from '../enums';

/**
 * Implementation of a fixed backoff strategy where the delay between attempts
 * is constant regardless of the attempt count.
 */
export class FixedBackoffStrategy implements IBackoffStrategy {
     private delay: number;

     /**
      * Constructs a FixedBackoffStrategy with a specific delay.
      * @param delay - The fixed delay in milliseconds between retries.
      */
     constructor(delay: number) {
          this.delay = delay;
     }

     /**
      * Returns the delay for the current retry attempt.
      * Example:
      * ```typescript
      * const delay = fixedStrategy.getDelay(1); // Always returns the fixed delay.
      * ```
      * @param attempt - The current retry attempt number (not used in this strategy).
      * @returns The fixed delay in milliseconds.
      */
     public getDelay(attempt: number): number {
          return this.delay;
     }
}

/**
 * Implementation of an exponential backoff strategy where the delay increases exponentially
 * with each attempt, up to a maximum delay.
 */
export class ExponentialBackoffStrategy implements IBackoffStrategy {
     private initialDelay: number;
     private maxDelay: number;

     /**
      * Constructs an ExponentialBackoffStrategy with an initial delay and a maximum delay.
      * @param initialDelay - The delay for the first retry in milliseconds.
      * @param maxDelay - The maximum delay allowed in milliseconds.
      */
     constructor(initialDelay: number, maxDelay: number) {
          this.initialDelay = initialDelay;
          this.maxDelay = maxDelay;
     }

     /**
      * Returns the exponentially calculated delay for the current retry attempt.
      * Example:
      * ```typescript
      * const delay = exponentialStrategy.getDelay(3); // Exponentially increases with attempts.
      * ```
      * @param attempt - The current retry attempt number.
      * @returns The calculated delay in milliseconds, capped at the maximum delay.
      */
     public getDelay(attempt: number): number {
          const delay = this.initialDelay * 2 ** (attempt - 1);
          return Math.min(delay, this.maxDelay);
     }
}

/**
 * Implementation of a linear backoff strategy where the delay increases linearly
 * with each attempt, up to a maximum delay.
 */
export class LinearBackoffStrategy implements IBackoffStrategy {
     private initialDelay: number;
     private maxDelay: number;

     /**
      * Constructs a LinearBackoffStrategy with an initial delay and a maximum delay.
      * @param initialDelay - The delay increment for each retry in milliseconds.
      * @param maxDelay - The maximum delay allowed in milliseconds.
      */
     constructor(initialDelay: number, maxDelay: number) {
          this.initialDelay = initialDelay;
          this.maxDelay = maxDelay;
     }

     /**
      * Returns the linearly calculated delay for the current retry attempt.
      * Example:
      * ```typescript
      * const delay = linearStrategy.getDelay(3); // Increases linearly with attempts.
      * ```
      * @param attempt - The current retry attempt number.
      * @returns The calculated delay in milliseconds, capped at the maximum delay.
      */
     public getDelay(attempt: number): number {
          const delay = this.initialDelay * attempt;
          return Math.min(delay, this.maxDelay);
     }
}

/**
 * Factory class to create different backoff strategies based on provided options.
 */
export class BackoffStrategyFactory {

     /**
      * Creates an instance of a backoff strategy based on the specified options.
      * Example:
      * ```typescript
      * const strategy = BackoffStrategyFactory.createStrategy({
      *   strategy: EBackoffStrategy.EXPONENTIAL,
      *   delay: 100,
      *   maxDelay: 1000,
      * });
      * ```
      * @param options - An object specifying the strategy type, initial delay, and optional maximum delay.
      * @returns An instance of a class implementing IBackoffStrategy.
      * @throws Error if an invalid strategy type is specified.
      */
     public static createStrategy(options: {
          strategy: EBackoffStrategy;
          delay: number;
          maxDelay?: number;
     }): IBackoffStrategy {
          switch (options.strategy) {
               case EBackoffStrategy.FIXED:
                    return new FixedBackoffStrategy(options.delay);
               case EBackoffStrategy.EXPONENTIAL:
                    return new ExponentialBackoffStrategy(
                         options.delay,
                         options.maxDelay || Infinity
                    );
               case EBackoffStrategy.LINEAR:
                    return new LinearBackoffStrategy(
                         options.delay,
                         options.maxDelay || Infinity
                    );
               default:
                    throw new Error('Invalid backoff strategy');
          }
     }
}
