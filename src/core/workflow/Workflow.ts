import { IWorkflow } from '../../interfaces/core/workflow/IWorkflow';
import { ITask } from '../../interfaces/core/task/ITask';
import { WorkflowContext } from './WorkflowContext';
import { HookManager } from '../hooks/HookManager';
import { THookType, TWorkflowOptions } from '../../types';
import { ILogger } from '../../interfaces/utils/ILogger';
import { IErrorHandler } from '../../interfaces/core/error/IErrorHandler';
import { IPersistence } from '../../interfaces/utils/IPersistence';
import { Logger } from '../../utils/Logger';
import { ErrorHandler } from '../error/ErrorHandler';

/**
 * A class representing a workflow, which consists of a series of tasks to be executed sequentially.
 * Provides lifecycle hooks, error handling, and persistence options for managing workflow states.
 * Implements the IWorkflow interface.
 * 
 * @template Input - The type of input data provided to the workflow.
 * @template Output - The type of output data produced by the workflow.
 */
export class Workflow<Input = any, Output = any> implements IWorkflow<Input, Output> {
     /**
      * The name of the workflow.
      */
     private name: string;

     /**
      * The tasks included in the workflow.
      */
     private tasks: ITask[];

     /**
      * HookManager for managing lifecycle hooks.
      */
     private hookManager: HookManager;

     /**
      * The context for the workflow, containing input, output, and intermediate data.
      */
     private context: WorkflowContext<Input>;

     /**
      * Configuration options for the workflow, such as retry count and timeout settings.
      */
     private options: TWorkflowOptions;

     /**
      * Logger instance for logging workflow execution details.
      */
     private logger: ILogger;

     /**
      * Error handler for managing workflow execution errors.
      */
     private errorHandler: IErrorHandler;

     /**
      * Optional persistence mechanism for saving workflow states.
      */
     private persistence?: IPersistence;

     /**
      * Constructs a Workflow instance.
      * Example:
      * ```typescript
      * const workflow = new Workflow('MyWorkflow', tasks, hookManager);
      * ```
      * @param name - The name of the workflow.
      * @param tasks - An array of tasks to be executed as part of the workflow.
      * @param hookManager - The HookManager instance for managing lifecycle hooks.
      * @param options - Optional configuration options for the workflow.
      * @param logger - Optional logger instance for logging execution details.
      * @param errorHandler - Optional error handler for managing execution errors.
      * @param persistence - Optional persistence mechanism for saving workflow state.
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
      * Executes the workflow by running its tasks sequentially.
      * Triggers lifecycle hooks at appropriate stages and handles errors if they occur.
      * Example:
      * ```typescript
      * const result = await workflow.execute({ userId: 123 });
      * ```
      * @param input - The input data for the workflow.
      * @returns A promise resolving to the workflow's output.
      */
     public async execute(input: Input): Promise<Output> {
          this.context = new WorkflowContext<Input>(input);

          try {
               this.logger.info(`Starting workflow: ${this.name}`);
               await this.hookManager.executeHooks('onWorkflowStart', this.context);

               for (const task of this.tasks) {
                    await this.hookManager.executeHooks('onTaskStart', task);
                    await task.run(this.context);
                    await this.hookManager.executeHooks('onTaskFinish', task);
               }

               await this.hookManager.executeHooks('onAllTasksFinish', this.context);
               await this.hookManager.executeHooks('onWorkflowFinish', this.context);

               this.logger.info(`Finished workflow: ${this.name}`);

               if (this.persistence) {
                    await this.persistence.saveWorkflowState(this.name, { status: 'completed' });
               }

               return this.context.getOutput() as Output;
          } catch (error) {
               this.logger.error(`Error in workflow: ${this.name}`);
               await this.errorHandler.handleError(error, this.context);
               await this.hookManager.executeHooks('onWorkflowError', this.context, error);

               if (this.persistence) {
                    await this.persistence.saveWorkflowState(this.name, { status: 'failed' });
               }

               throw error;
          }
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
      * @param hook - A function to execute at the specified lifecycle stage.
      */
     public addHook(
          hookType: THookType,
          hook: (context: any, error?: Error) => Promise<void>
     ): void {
          this.hookManager.registerHook(hookType, hook);
     }
}
