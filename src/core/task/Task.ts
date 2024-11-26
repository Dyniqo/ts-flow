import { ITask } from '../../interfaces/core/task/ITask';
import { TaskContext } from './TaskContext';
import { TTaskOptions } from '../../types';
import { ILogger } from '../../interfaces/utils/ILogger';
import { ETaskStatus } from '../../enums';
import { RetryPolicy } from './RetryPolicy';
import { TimeoutPolicy } from './TimeoutPolicy';
import { IErrorHandler } from '../../interfaces/core/error/IErrorHandler';
import { IPersistence } from '../../interfaces/utils/IPersistence';
import { Logger } from '../../utils/Logger';
import { ErrorHandler } from '../error/ErrorHandler';

/**
 * Implementation of a task that can be executed with retry and timeout policies.
 * Includes support for logging, error handling, and optional persistence of task states.
 * 
 * @template Input - The type of the input data for the task.
 * @template Output - The type of the output data produced by the task.
 */
export class Task<Input = any, Output = any> implements ITask<Input, Output> {
     /**
      * The name of the task.
      */
     public readonly name: string;

     /**
      * Configuration options for the task, such as retry and timeout settings.
      */
     protected readonly options: TTaskOptions;

     /**
      * The function to execute the task's logic.
      */
     private executeFn: (context: TaskContext<Input, Output>) => Promise<Output>;

     /**
      * Current status of the task, e.g., Pending, Running, Completed.
      */
     private status: ETaskStatus = ETaskStatus.Pending;

     /**
      * The retry policy controlling the number of retries and delays between retries.
      */
     private retryPolicy: RetryPolicy;

     /**
      * The timeout policy controlling the task execution timeout.
      */
     private timeoutPolicy: TimeoutPolicy;

     /**
      * Logger instance for logging task lifecycle events.
      */
     protected logger: ILogger;

     /**
      * Error handler for managing errors during task execution.
      */
     private errorHandler: IErrorHandler;

     /**
      * Optional persistence mechanism for saving task states.
      */
     private persistence?: IPersistence;

     /**
      * Constructs a Task instance.
      * Example:
      * ```typescript
      * const task = new Task(
      *   'MyTask',
      *   async (context) => {
      *     // Task logic here
      *     return { result: 'Success' };
      *   },
      *   { retryCount: 3, timeout: 5000 }
      * );
      * ```
      * @param name - The name of the task.
      * @param executeFn - The function containing the logic to execute the task.
      * @param options - Configuration options for the task, including retry and timeout settings.
      * @param logger - Optional custom logger instance.
      * @param errorHandler - Optional custom error handler instance.
      * @param persistence - Optional persistence mechanism for saving task states.
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
      * Example:
      * ```typescript
      * const result = await task.run(context);
      * ```
      * @param context - The TaskContext instance providing input, output, and additional task-specific data.
      * @returns A promise resolving to the output of the task.
      */
     public async run(context: TaskContext<Input, Output>): Promise<Output> {
          this.logger.info(`Running task: ${this.name}`);
          this.status = ETaskStatus.Running;
          let attempt = 0;

          const executeWithTimeout = async (): Promise<Output> => {
               return new Promise<Output>((resolve, reject) => {
                    const timeout = this.timeoutPolicy.getTimeout();
                    let timer: NodeJS.Timeout | null = null;

                    if (timeout) {
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
                    context.setOutput(result);
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
}
