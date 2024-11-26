import { WorkflowBuilder } from '../core/workflow/WorkflowBuilder';
import { ITask } from '../interfaces/core/task/ITask';
import { ILogger } from '../interfaces/utils/ILogger';
import { IErrorHandler } from '../interfaces/core/error/IErrorHandler';
import { IPersistence } from '../interfaces/utils/IPersistence';
import { TTaskOptions, TWorkflowOptions } from '../types';
import { Task } from '../core/task/Task';
import { Logger } from '../utils/Logger';
import { ErrorHandler } from '../core/error/ErrorHandler';
import { IScheduledTask } from '../interfaces/core/task';
import { ConditionalTask, ParallelTask, ScheduledTask } from '../core/task';

/**
 * A manager class for creating and managing workflows, tasks, and related components.
 * Provides methods for creating workflows, tasks, and integrating logging, error handling, and persistence.
 */
export class FlowManager {
     /**
      * Logger instance for logging workflow and task details.
      */
     private logger: ILogger;

     /**
      * Error handler for managing errors during workflow or task execution.
      */
     private errorHandler: IErrorHandler;

     /**
      * Optional persistence mechanism for saving workflow and task states.
      */
     private persistence?: IPersistence;

     /**
      * Constructs a FlowManager instance with optional logger, error handler, and persistence.
      * Example:
      * ```typescript
      * const flowManager = new FlowManager({
      *   logger: customLogger,
      *   errorHandler: customErrorHandler,
      *   persistence: customPersistence,
      * });
      * ```
      * @param options - Optional configuration for logger, error handler, and persistence.
      */
     constructor(options?: { logger?: ILogger; errorHandler?: IErrorHandler; persistence?: IPersistence }) {
          this.logger = options?.logger || new Logger();
          this.errorHandler = options?.errorHandler || new ErrorHandler(this.logger);
          this.persistence = options?.persistence;
     }

     /**
      * Creates a new workflow builder for constructing workflows.
      * Example:
      * ```typescript
      * const workflow = flowManager.createWorkflow('MyWorkflow').build();
      * ```
      * @param name - The name of the workflow.
      * @param options - Optional configuration options for the workflow.
      * @returns A `WorkflowBuilder` instance for configuring and building the workflow.
      */
     public createWorkflow(name: string, options?: TWorkflowOptions): WorkflowBuilder {
          const builder = new WorkflowBuilder()
               .setName(name)
               .setLogger(this.logger)
               .setErrorHandler(this.errorHandler)
               .setOptions(options || {});

          if (this.persistence) {
               builder.setPersistence(this.persistence);
          }

          return builder;
     }

     /**
      * Creates a new task with the specified name and execution function.
      * Example:
      * ```typescript
      * const task = flowManager.createTask('MyTask', async (context) => {
      *   return await processData(context.getInput());
      * });
      * ```
      * @param name - The name of the task.
      * @param executeFn - The function to execute for the task.
      * @param options - Optional configuration options for the task.
      * @returns An instance of `ITask`.
      */
     public createTask<Input = any, Output = any>(
          name: string,
          executeFn: (context: any) => Promise<Output>,
          options?: TTaskOptions
     ): ITask<Input, Output> {
          return new Task<Input, Output>(
               name,
               executeFn,
               options,
               this.logger,
               this.errorHandler,
               this.persistence
          );
     }

     /**
      * Creates a conditional task that executes its child tasks only if a condition is met.
      * Example:
      * ```typescript
      * const conditionalTask = flowManager.createConditionalTask(
      *   'CheckCondition',
      *   (context) => context.get('isValid'),
      *   [taskA, taskB]
      * );
      * ```
      * @param name - The name of the conditional task.
      * @param condition - A function that determines if the tasks should execute.
      * @param tasks - The tasks to execute if the condition is met.
      * @param logger - Optional logger instance for the conditional task.
      * @returns An instance of `ITask`.
      */
     public createConditionalTask<Input = any, Output = any>(
          name: string,
          condition: (context: any) => boolean,
          tasks: ITask[],
          logger?: ILogger
     ): ITask<Input, Output> {
          return new ConditionalTask<Input, Output>(
               name,
               condition,
               tasks,
               logger || this.logger
          );
     }

     /**
      * Creates a task that executes a group of tasks in parallel.
      * Example:
      * ```typescript
      * const parallelTask = flowManager.createParallelTasks([taskA, taskB, taskC]);
      * ```
      * @param tasks - An array of tasks to execute in parallel.
      * @param logger - Optional logger instance for the parallel task.
      * @returns An instance of `ITask`.
      */
     public createParallelTasks<Input = any, Output = any>(
          tasks: ITask[],
          logger?: ILogger
     ): ITask<Input, Output> {
          return new ParallelTask<Input, Output>(
               'ParallelTasks',
               tasks,
               logger || this.logger
          );
     }

     /**
      * Creates a scheduled task that runs at specified intervals defined by a cron expression.
      * Example:
      * ```typescript
      * const scheduledTask = flowManager.createScheduledTask(
      *   'DailyTask',
      *   async (context) => { console.log('Running scheduled task'); },
      *   '0 0 * * *' // Cron expression for daily execution
      * );
      * ```
      * @param name - The name of the scheduled task.
      * @param executeFn - The function to execute for the task.
      * @param cronExpression - The cron expression defining the schedule.
      * @param options - Optional configuration options for the task.
      * @param logger - Optional logger instance for the scheduled task.
      * @returns An instance of `IScheduledTask`.
      */
     public createScheduledTask<Input = any, Output = any>(
          name: string,
          executeFn: (context: any) => Promise<Output>,
          cronExpression: string,
          options?: TTaskOptions,
          logger?: ILogger
     ): IScheduledTask {
          return new ScheduledTask<Input, Output>(
               name,
               executeFn,
               cronExpression,
               options,
               logger || this.logger
          );
     }
}
