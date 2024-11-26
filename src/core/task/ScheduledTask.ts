import * as cron from 'node-cron';

import { IScheduledTask } from '../../interfaces/core/task/IScheduledTask';
import { Task } from './Task';
import { TaskContext } from './TaskContext';
import { ILogger } from '../../interfaces/utils/ILogger';
import { TTaskOptions } from '../../types';
import { Logger } from '../../utils/Logger';

/**
 * Represents a scheduled task that runs based on a cron expression.
 * Provides methods to configure, start, and stop the scheduled execution of the task.
 * 
 * @template Input - The type of the input data for the task.
 * @template Output - The type of the output data produced by the task.
 */
export class ScheduledTask<Input = any, Output = any> extends Task<Input, Output> implements IScheduledTask {
     /**
      * The cron expression defining the schedule for the task.
      */
     private cronExpression: string;

     /**
      * The active cron job instance managing the scheduled execution.
      */
     private cronJob: cron.ScheduledTask | null = null;

     /**
      * Logger instance for logging task status and lifecycle events.
      */
     protected logger: ILogger;

     /**
      * Constructs a ScheduledTask instance with a name, execution function, and a cron schedule.
      * Example:
      * ```typescript
      * const task = new ScheduledTask(
      *   'MyScheduledTask',
      *   async (context) => {
      *     console.log('Running scheduled task');
      *   },
      *   '0 * * * *' // Runs at the top of every hour
      * );
      * ```
      * @param name - The name of the scheduled task.
      * @param executeFn - The function containing the logic to execute the task.
      * @param cronExpression - A cron expression defining the schedule for the task.
      * @param options - Optional configuration options for the task.
      * @param logger - Optional custom logger instance.
      */
     constructor(
          name: string,
          executeFn: (context: TaskContext<Input, Output>) => Promise<Output>,
          cronExpression: string,
          options?: TTaskOptions,
          logger?: ILogger
     ) {
          super(name, executeFn, options, logger);
          this.cronExpression = cronExpression;
          this.logger = logger || new Logger();
     }

     /**
      * Updates the cron expression for the scheduled task.
      * Example:
      * ```typescript
      * task.schedule('30 9 * * *'); // Runs at 9:30 AM daily
      * ```
      * @param cronExpression - The new cron expression to set.
      */
     public schedule(cronExpression: string): void {
          this.cronExpression = cronExpression;
     }

     /**
      * Starts the scheduled task based on the current cron expression.
      * Logs a warning if the task is already running.
      * Example:
      * ```typescript
      * task.start();
      * ```
      */
     public start(): void {
          if (this.cronJob) {
               this.logger.warn(`Scheduled task "${this.name}" is already running.`);
               return;
          }

          this.cronJob = cron.schedule(this.cronExpression, async () => {
               await this.run(new TaskContext<Input, Output>(null as unknown as Input));
          });
          this.logger.info(`Scheduled task "${this.name}" started with expression "${this.cronExpression}".`);
     }

     /**
      * Stops the scheduled task, preventing further executions.
      * Logs a warning if the task is not running.
      * Example:
      * ```typescript
      * task.stop();
      * ```
      */
     public stop(): void {
          if (this.cronJob) {
               this.cronJob.stop();
               this.cronJob = null;
               this.logger.info(`Scheduled task "${this.name}" stopped.`);
          } else {
               this.logger.warn(`Scheduled task "${this.name}" is not running.`);
          }
     }
}
