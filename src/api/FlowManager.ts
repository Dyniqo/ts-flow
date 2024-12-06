import { WorkflowBuilder } from "../core/workflow/WorkflowBuilder";
import { Task } from "../core/task/Task";
import { Logger } from "../utils/Logger";
import { EWorkflowStatus } from "../enums";
import { ErrorHandler } from "../core/error/ErrorHandler";
import { ConditionalTask, ParallelTask, ScheduledTask } from "../core/task";
import { IScheduledTask } from "../interfaces/core/task";
import { ITask } from "../interfaces/core/task/ITask";
import { ILogger } from "../interfaces/utils/ILogger";
import { IErrorHandler } from "../interfaces/core/error/IErrorHandler";
import { IPersistence } from "../interfaces/utils/IPersistence";
import { TTaskOptions, TWorkflowOptions } from "../types";
import { InMemoryPersistence } from "../utils/InMemoryPersistence";
import { IWorkflow } from "../interfaces/core/workflow/IWorkflow";

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
      * A map to store and manage workflows by their names.
      * The key is the workflow name (string), and the value is the corresponding `IWorkflow` instance.
      * This allows efficient retrieval and management of multiple workflows.
      */
     private workflows: Map<string, IWorkflow> = new Map();


     constructor(options?: {
          logger?: ILogger;
          errorHandler?: IErrorHandler;
          persistence?: IPersistence;
     }) {
          this.logger = options?.logger || new Logger();
          this.errorHandler = options?.errorHandler || new ErrorHandler(this.logger);
          this.persistence = options?.persistence || new InMemoryPersistence();
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
      * Builds a workflow from the given WorkflowBuilder instance.
      * Example:
      * ```typescript
      * const builder = flowManager.createWorkflow('MyWorkflow');
      * const workflow = flowManager.buildWorkflow(builder);
      * ```
      * @param builder - The WorkflowBuilder instance used to construct the workflow.
      * @returns An instance of `IWorkflow`.
      */
     public buildWorkflow(builder: WorkflowBuilder): IWorkflow {
          const workflow = builder.build();
          this.workflows.set(workflow.getName(), workflow);
          return workflow;
     }

     /**
      * Retrieves a workflow by its name.
      * Example:
      * ```typescript
      * const workflow = flowManager.getWorkflow('MyWorkflow');
      * if (workflow) {
      *   console.log('Workflow found!');
      * }
      * ```
      * @param name - The name of the workflow.
      * @returns An instance of `IWorkflow`, or undefined if not found.
      */
     public getWorkflow(name: string): IWorkflow | undefined {
          return this.workflows.get(name);
     }

     /**
      * Pauses an active workflow.
      * Example:
      * ```typescript
      * await flowManager.pauseWorkflow('MyWorkflow');
      * ```
      * @param name - The name of the workflow to pause.
      * @returns A promise that resolves when the workflow is paused.
      */
     public async pauseWorkflow(name: string): Promise<void> {
          const workflow = this.workflows.get(name);
          if (!workflow) {
               this.logger.warn(`Workflow "${name}" not found.`);
               return;
          }
          await workflow.pause();
     }

     /**
      * Resumes a paused workflow.
      * Example:
      * ```typescript
      * await flowManager.resumeWorkflow('MyWorkflow');
      * ```
      * @param name - The name of the workflow to resume.
      * @returns A promise that resolves when the workflow is resumed.
      */
     public async resumeWorkflow(name: string): Promise<any> {
          const workflow = this.workflows.get(name);
          if (!workflow) {
               this.logger.warn(`Workflow "${name}" not found.`);
               return;
          }
          return await workflow.resume();
     }

     /**
      * Cancels a running or paused workflow.
      * Example:
      * ```typescript
      * await flowManager.cancelWorkflow('MyWorkflow');
      * ```
      * @param name - The name of the workflow to cancel.
      * @returns A promise that resolves when the workflow is cancelled.
      */
     public async cancelWorkflow(name: string): Promise<void> {
          const workflow = this.workflows.get(name);
          if (!workflow) {
               this.logger.warn(`Workflow "${name}" not found.`);
               return;
          }
          await workflow.cancel();
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
          tasks: ITask<Input, Output>[],
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
      * const parallelTask = flowManager.createParallelTasks(
      *   'parallelTask',
      *   [taskA, taskB, taskC]
      * );
      * ```
      * @param tasks - An array of tasks to execute in parallel.
      * @param logger - Optional logger instance for the parallel task.
      * @returns An instance of `ITask`.
     */
     public createParallelTasks<Input = any, Output = any>(
          name: string,
          tasks: ITask<Input, Output>[],
          logger?: ILogger
     ): ITask<Input, Output> {
          return new ParallelTask<Input, Output>(name, tasks, logger || this.logger);
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

     public getWorkflowStatus(name: string): EWorkflowStatus | undefined {
          const workflow = this.workflows.get(name);
          if (!workflow) {
               this.logger.warn(`Workflow "${name}" not found.`);
               return undefined;
          }
          return workflow.getStatus();
     }

     /**
      * Retrieves the status of all tasks in a workflow.
      * Example:
      * ```typescript
      * const tasksStatus = flowManager.getWorkflowTasksStatus('MyWorkflow');
      * tasksStatus?.forEach(task => console.log(`${task.name}: ${task.status}`));
      * ```
      * @param name - The name of the workflow.
      * @returns An array of task statuses, or undefined if the workflow is not found.
      */
     public getWorkflowTasksStatus(name: string): Array<{ name: string; status: string }> | undefined {
          const workflow = this.workflows.get(name);
          if (!workflow) {
               this.logger.warn(`Workflow "${name}" not found.`);
               return undefined;
          }
          return workflow.getTasksStatus();
     }

     /**
      * Restores the state of a workflow from the persistence layer.
      * Example:
      * ```typescript
      * await flowManager.restoreWorkflow('MyWorkflow');
      * ```
      * @param name - The name of the workflow to restore.
      * @returns A promise that resolves when the workflow is restored.
      */
     public async restoreWorkflow(name: string): Promise<void> {
          const state = await this.persistence?.getWorkflowState(name);
          const workflow = this.workflows.get(name);
          if (workflow && state) {
               workflow.restoreState(state);
          } else {
               this.logger.warn(`No state or workflow found for "${name}".`);
          }
     }
}
