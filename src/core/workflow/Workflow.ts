import { Logger } from '../../utils/Logger';
import { EWorkflowStatus } from '../../enums';
import { WorkflowContext } from './WorkflowContext';
import { HookManager } from '../hooks/HookManager';
import { ErrorHandler } from '../error/ErrorHandler';
import { THookType, TWorkflowOptions } from '../../types';
import { ITask } from '../../interfaces/core/task/ITask';
import { ILogger } from '../../interfaces/utils/ILogger';
import { IPersistence } from '../../interfaces/utils/IPersistence';
import { runMiddlewareWithTask } from '../../utils/middlewareRunner';
import { IWorkflow } from '../../interfaces/core/workflow/IWorkflow';
import { IErrorHandler } from '../../interfaces/core/error/IErrorHandler';

/**
 * Represents a workflow, which manages the execution of multiple tasks in sequence.
 * Includes lifecycle hooks, error handling, persistence, and control mechanisms (pause, resume, cancel).
 * Implements the `IWorkflow` interface.
 * 
 * @template Input - The type of input data for the workflow.
 * @template Output - The type of output data produced by the workflow.
 */
export class Workflow<Input = any, Output = any> implements IWorkflow<Input, Output> {
     /**
      * The name of the workflow.
      */
     private name: string;

     /**
      * A list of tasks included in the workflow.
      */
     private tasks: ITask[];

     /**
      * HookManager instance for managing workflow lifecycle hooks.
      */
     private hookManager: HookManager;

     /**
      * Workflow context for managing input, output, and task-specific data.
      */
     private context!: WorkflowContext<Input, Output>;

     /**
      * Configuration options for the workflow, such as retry settings or middleware.
      */
     private options: TWorkflowOptions;

     /**
      * Optional validator function for validating workflow input before execution.
      */
     private validator?: (input: Input) => Promise<string[]>;

     /**
      * Logger instance for logging workflow details and events.
      */
     private logger: ILogger;

     /**
      * Error handler for managing errors during workflow execution.
      */
     private errorHandler: IErrorHandler;

     /**
      * Optional persistence mechanism for saving workflow states across executions.
      */
     private persistence?: IPersistence;

     /**
      * Current status of the workflow (e.g., Pending, Running, Paused).
      */
     private status: EWorkflowStatus = EWorkflowStatus.Pending;

     /**
      * Index of the current task being executed in the workflow.
      */
     private currentTaskIndex: number = 0;

     /**
      * Indicates whether the workflow is currently paused.
      */
     private isPaused: boolean = false;

     /**
      * Indicates whether the workflow is cancelled.
      */
     private isCancelled: boolean = false;

     /**
      * Constructs a Workflow instance.
      * Example:
      * ```typescript
      * const workflow = new Workflow('MyWorkflow', tasks, hookManager, options, logger);
      * ```
      * @param name - The name of the workflow.
      * @param tasks - An array of tasks to execute as part of the workflow.
      * @param hookManager - The HookManager instance for managing lifecycle hooks.
      * @param options - Optional configuration options for the workflow.
      * @param logger - Optional logger instance for logging details.
      * @param errorHandler - Optional error handler instance.
      * @param persistence - Optional persistence mechanism for saving workflow states.
      */
     constructor(
          name: string,
          tasks: ITask[],
          hookManager: HookManager,
          options?: TWorkflowOptions,
          logger?: ILogger,
          errorHandler?: IErrorHandler,
          persistence?: IPersistence
     ) {
          this.name = name;
          this.tasks = tasks;
          this.hookManager = hookManager;
          this.options = options || {};
          this.logger = logger || new Logger();
          this.errorHandler = errorHandler || new ErrorHandler(this.logger);
          this.persistence = persistence;
     }

     /**
      * Returns the name of the workflow.
      * Example:
      * ```typescript
      * const name = workflow.getName();
      * ```
      * @returns The name of the workflow as a string.
      */
     public getName(): string {
          return this.name;
     }

     /**
      * Executes the workflow sequentially by running its tasks.
      * Handles input validation, lifecycle hooks, and middleware.
      * Example:
      * ```typescript
      * const result = await workflow.execute({ userId: 123 });
      * ```
      * @param input - The input data for the workflow.
      * @returns A promise that resolves to the workflow's output.
      * @throws Error if input validation fails or execution encounters an error.
      */
     public async execute(input: Input): Promise<Output> {
          this.context = new WorkflowContext<Input, Output>(input);

          if (this.validator) {
               const errors = await this.validator(input);
               if (errors.length > 0) {
                    this.logger.error(`Validation failed for workflow "${this.name}": ${errors.join(', ')}`);
                    throw new Error(`Workflow input validation failed: ${errors.join(', ')}`);
               }
          }

          try {
               this.logger.info(`Starting workflow: ${this.name}`);
               this.status = EWorkflowStatus.Running;
               await this.saveStatus();

               await this.hookManager.executeHooks('onWorkflowStart', this.context);

               for (; this.currentTaskIndex < this.tasks.length; this.currentTaskIndex++) {
                    if (this.isCancelled) {
                         this.logger.info(`Workflow ${this.name} cancelled, stopping execution.`);
                         break;
                    }
                    if (this.isPaused) {
                         this.logger.info(`Workflow ${this.name} paused at task index ${this.currentTaskIndex}.`);
                         await this.saveStatus();
                         return this.context.getOutput() as Output;
                    }

                    const task = this.tasks[this.currentTaskIndex];

                    await this.hookManager.executeHooks('onTaskStart', task);
                    await runMiddlewareWithTask(this.options, this.context, async () => {
                         await task.run(this.context);
                    });
                    await this.hookManager.executeHooks('onTaskFinish', task);

                    await this.saveStatus();
               }

               if (!this.isCancelled && !this.isPaused) {
                    await this.hookManager.executeHooks('onAllTasksFinish', this.context);
                    await this.hookManager.executeHooks('onWorkflowFinish', this.context);

                    this.status = EWorkflowStatus.Completed;
                    await this.saveStatus();

                    this.logger.info(`Finished workflow: ${this.name}`);

                    this.context.setOutput(this.context.getAllTaskOutputs() as Output);
                    return this.context.getOutput() as Output;
               } else {
                    return this.context.getOutput() as Output;
               }
          } catch (error) {
               const err = error as Error;
               this.logger.error(`Error in workflow: ${this.name}`);
               await this.errorHandler.handleError(err, this.context);
               await this.hookManager.executeHooks('onWorkflowError', this.context, err);

               this.status = EWorkflowStatus.Failed;
               await this.saveStatus();

               throw err;
          }
     }

     /**
      * Sets a validator function to validate workflow input.
      * Example:
      * ```typescript
      * workflow.setValidator(async (input) => {
      *   const errors = [];
      *   if (!input.userId) errors.push('User ID is required');
      *   return errors;
      * });
      * ```
      * @param validator - A function that validates the input and returns an array of error messages.
      */
     public setValidator(validator: (input: Input) => Promise<string[]>): void {
          this.validator = validator;
     }

     /**
      * Adds a hook to the workflow for a specific lifecycle stage.
      * Example:
      * ```typescript
      * workflow.addHook('onTaskFinish', async (context) => {
      *   console.log('Task finished:', context);
      * });
      * ```
      * @param hookType - The type of the hook (e.g., 'onWorkflowStart', 'onTaskFinish').
      * @param hook - A function to execute at the specified stage.
      */
     public addHook(
          hookType: THookType,
          hook: (context: any, error?: Error) => Promise<void>
     ): void {
          this.hookManager.registerHook(hookType, hook);
     }

     /**
      * Pauses the workflow execution.
      * Example:
      * ```typescript
      * await workflow.pause();
      * ```
      * @throws Warning if the workflow is not currently running.
      */
     public async pause(): Promise<void> {
          if (this.status !== EWorkflowStatus.Running) {
               this.logger.warn(`Cannot pause workflow "${this.name}" because it is not running.`);
               return;
          }
          this.isPaused = true;
          this.status = EWorkflowStatus.Paused;
          await this.saveStatus();
     }

     /**
      * Resumes the workflow execution from where it was paused.
      * Example:
      * ```typescript
      * const result = await workflow.resume();
      * ```
      * @returns A promise resolving to the workflow's output.
      * @throws Error if the workflow is not currently paused.
      */
     public async resume(): Promise<Output> {
          if (this.status !== EWorkflowStatus.Paused) {
               this.logger.warn(`Cannot resume workflow "${this.name}" because it is not paused.`);
               throw new Error(`Workflow "${this.name}" is not paused.`);
          }
          this.isPaused = false;
          this.status = EWorkflowStatus.Running;
          await this.saveStatus();

          for (; this.currentTaskIndex < this.tasks.length; this.currentTaskIndex++) {
               if (this.isCancelled) {
                    this.logger.info(`Workflow ${this.name} cancelled, stopping execution.`);
                    break;
               }
               if (this.isPaused) {
                    this.logger.info(`Workflow ${this.name} paused again at task index ${this.currentTaskIndex}.`);
                    await this.saveStatus();
                    return this.context.getOutput() as Output;
               }

               const task = this.tasks[this.currentTaskIndex];

               await this.hookManager.executeHooks('onTaskStart', task);
               await runMiddlewareWithTask(this.options, this.context, async () => {
                    await task.run(this.context);
               });
               await this.hookManager.executeHooks('onTaskFinish', task);

               await this.saveStatus();
          }

          if (!this.isCancelled && !this.isPaused) {
               await this.hookManager.executeHooks('onAllTasksFinish', this.context);
               await this.hookManager.executeHooks('onWorkflowFinish', this.context);

               this.status = EWorkflowStatus.Completed;
               await this.saveStatus();
          }

          this.context.setOutput(this.context.getAllTaskOutputs() as Output);
          return this.context.getOutput() as Output;
     }

     /**
      * Cancels the workflow execution.
      * Example:
      * ```typescript
      * await workflow.cancel();
      * ```
      * @throws Warning if the workflow is not running or paused.
      */
     public async cancel(): Promise<void> {
          if (this.status !== EWorkflowStatus.Running && this.status !== EWorkflowStatus.Paused) {
               this.logger.warn(`Cannot cancel workflow "${this.name}" because it is not running or paused.`);
               return;
          }
          this.isCancelled = true;
          this.status = EWorkflowStatus.Cancelled;
          await this.saveStatus();
     }

     /**
      * Saves the current workflow status and task index to persistence, if enabled.
      */
     private async saveStatus(): Promise<void> {
          if (this.persistence) {
               await this.persistence.saveWorkflowState(this.name, {
                    status: this.status,
                    currentTaskIndex: this.currentTaskIndex
               });
          }
     }

     /**
      * Retrieves the current status of the workflow.
      * Example:
      * ```typescript
      * const status = workflow.getStatus();
      * console.log(status);
      * ```
      * @returns The current status of the workflow.
      */
     public getStatus(): EWorkflowStatus {
          return this.status;
     }

     /**
      * Retrieves the status of all tasks in the workflow.
      * Example:
      * ```typescript
      * const tasksStatus = workflow.getTasksStatus();
      * console.log(tasksStatus);
      * ```
      * @returns An array of task names and their statuses.
      */
     public getTasksStatus(): Array<{ name: string; status: string }> {
          return this.tasks.map((task: any) => {
               const tName = task.name;
               const tStatus = task.getStatus ? task.getStatus() : 'Unknown';
               return { name: tName, status: tStatus };
          });
     }

     /**
      * Restores the workflow to a specific state, including its status and task index.
      * Example:
      * ```typescript
      * workflow.restoreState({ status: EWorkflowStatus.Paused, currentTaskIndex: 2 });
      * ```
      * @param state - The state object containing the status and task index to restore.
      */
     public restoreState(state: { status: EWorkflowStatus; currentTaskIndex: number }): void {
          this.status = state.status;
          this.currentTaskIndex = state.currentTaskIndex;
          this.logger.info(`Workflow "${this.name}" restored to status: ${this.status}, at task index: ${this.currentTaskIndex}`);
     }
}
