import { TaskContext } from './TaskContext';
import { RetryPolicy } from './RetryPolicy';
import { Logger } from '../../utils/Logger';
import { ErrorHandler } from '../error/ErrorHandler';
import { ETaskStatus } from '../../enums';
import { TTaskOptions } from '../../types';
import { TimeoutPolicy } from './TimeoutPolicy';
import { IErrorHandler } from '../../interfaces/core/error/IErrorHandler';
import { IPersistence } from '../../interfaces/utils/IPersistence';
import { ITask } from '../../interfaces/core/task/ITask';
import { ILogger } from '../../interfaces/utils/ILogger';

/**
 * Represents a task that supports execution with retry and timeout policies.
 * This class includes logging, error handling, and optional state persistence.
 * 
 * @template Input - The type of input data for the task.
 * @template Output - The type of output data produced by the task.
 */
export class Task<Input = any, Output = any> implements ITask<Input, Output> {
     /**
      * The name of the task.
      */
     public readonly name: string;

     /**
      * Configuration options for the task, including retry and timeout settings.
      */
     protected readonly options: TTaskOptions;

     /**
      * The function that defines the task's logic.
      */
     private executeFn: (context: TaskContext<Input, Output>) => Promise<Output>;

     /**
      * Current execution status of the task, e.g., Pending, Running, Completed.
      */
     private status: ETaskStatus = ETaskStatus.Pending;

     /**
      * Retry policy instance for managing retry logic and delays.
      */
     private retryPolicy: RetryPolicy;

     /**
      * Timeout policy instance for enforcing execution time limits.
      */
     private timeoutPolicy: TimeoutPolicy;

     /**
      * Logger instance for capturing task-related events and errors.
      */
     protected logger: ILogger;

     /**
      * Error handler for managing task execution errors.
      */
     private errorHandler: IErrorHandler;

     /**
      * Optional persistence mechanism for storing task states.
      */
     private persistence?: IPersistence;

     /**
      * Constructs a Task instance with the provided parameters.
      * 
      * Example:
      * ```typescript
      * const task = new Task(
      *   'MyTask',
      *   async (context) => {
      *     return await performLogic(context.getInput());
      *   },
      *   { retryCount: 3, timeout: 5000 }
      * );
      * ```
      * 
      * @param name - The unique name of the task.
      * @param executeFn - The function to execute the task logic.
      * @param options - Task-specific options, including retry and timeout settings.
      * @param logger - Optional logger instance for capturing logs.
      * @param errorHandler - Optional error handler instance.
      * @param persistence - Optional persistence mechanism for task state management.
      */
     constructor(
          name: string,
          executeFn: (context: TaskContext<Input, Output>) => Promise<Output>,
          options?: TTaskOptions,
          logger?: ILogger,
          errorHandler?: IErrorHandler,
          persistence?: IPersistence
     ) {
          this.name = name;
          this.executeFn = executeFn;
          this.options = options || {};
          this.options.retryCount = this.options.retryCount ?? 0;
          this.options.timeout = this.options.timeout ?? 0;
          this.retryPolicy = new RetryPolicy(
               this.options.retryCount,
               this.options.backoffOptions
          );
          this.timeoutPolicy = new TimeoutPolicy(this.options.timeout);
          this.logger = logger || new Logger();
          this.errorHandler = errorHandler || new ErrorHandler(this.logger);
          this.persistence = persistence;
     }

     /**
      * Executes the task within the provided context, applying retry and timeout policies.
      * 
      * Example:
      * ```typescript
      * const result = await task.run(context);
      * ```
      * 
      * @param context - The context containing task input, output, and other metadata.
      * @returns A promise that resolves to the output of the task.
      */
     public async run(context: TaskContext<Input, Output>): Promise<Output> {
          this.logger.info(`Running task: ${this.name}`);
          this.status = ETaskStatus.Running;
          let attempt = 0;

          /**
           * Executes the task with a timeout policy.
           * Rejects if the task exceeds the specified timeout duration.
           */
          const executeWithTimeout = async (): Promise<Output> => {
               return new Promise<Output>((resolve, reject) => {
                    const timeout = this.timeoutPolicy.getTimeout();
                    let timer: NodeJS.Timeout | null = null;

                    if (timeout && timeout > 0) {
                         timer = setTimeout(() => {
                              this.status = ETaskStatus.TimedOut;
                              reject(new Error(`Task "${this.name}" timed out after ${timeout}ms`));
                         }, timeout);
                    }

                    this.executeFn(context)
                         .then((result) => {
                              if (timer) clearTimeout(timer);
                              resolve(result);
                         })
                         .catch((error) => {
                              if (timer) clearTimeout(timer);
                              reject(error);
                         });
               });
          };

          while (true) {
               try {
                    const result = await executeWithTimeout();
                    context.setTaskOutput(this.name, result);

                    this.status = ETaskStatus.Completed;
                    this.logger.info(`Finished task: ${this.name}`);

                    if (this.persistence) {
                         await this.persistence.saveTaskState(this.name, { status: this.status });
                    }

                    return result;
               } catch (error) {
                    attempt++;
                    await this.errorHandler.handleError(error, context);

                    if (this.retryPolicy.shouldRetry(error, attempt)) {
                         this.status = ETaskStatus.Retrying;
                         const delay = this.retryPolicy.getDelay(attempt);
                         this.logger.warn(
                              `Retrying task "${this.name}" in ${delay}ms (Attempt ${attempt})`
                         );
                         await new Promise((res) => setTimeout(res, delay));
                    } else {
                         this.status = ETaskStatus.Failed;
                         this.logger.error(`Task "${this.name}" failed after ${attempt} attempts`);

                         if (this.persistence) {
                              await this.persistence.saveTaskState(this.name, { status: this.status });
                         }

                         throw error;
                    }
               }
          }
     }

     /**
      * Retrieves the current status of the task.
      * Example:
      * ```typescript
      * const status = task.getStatus();
      * console.log(`Current status: ${status}`);
      * ```
      * @returns The current execution status of the task.
      */
     public getStatus(): ETaskStatus {
          return this.status;
     }
}
