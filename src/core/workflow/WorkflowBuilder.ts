import { Workflow } from './Workflow';
import { IWorkflowBuilder } from '../../interfaces/core/workflow/IWorkflowBuilder';
import { ITask } from '../../interfaces/core/task/ITask';
import { HookManager } from '../hooks/HookManager';
import { THookType, TWorkflowOptions } from '../../types';
import { ConditionalTask } from '../task/ConditionalTask';
import { ParallelTask } from '../task/ParallelTask';
import { ILogger } from '../../interfaces/utils/ILogger';
import { IErrorHandler } from '../../interfaces/core/error/IErrorHandler';
import { IPersistence } from '../../interfaces/utils/IPersistence';

/**
 * A builder class for constructing workflows in a step-by-step, fluent manner.
 * Allows the configuration of tasks, hooks, options, and other dependencies before creating a `Workflow` instance.
 */
export class WorkflowBuilder implements IWorkflowBuilder {
     /**
      * The name of the workflow being built.
      */
     private name: string = '';

     /**
      * The list of tasks included in the workflow.
      */
     private tasks: ITask[] = [];

     /**
      * The HookManager instance for managing lifecycle hooks.
      */
     private hookManager: HookManager = new HookManager();

     /**
      * Configuration options for the workflow.
      */
     private options: TWorkflowOptions = {};

     /**
      * Optional logger instance for logging workflow activities.
      */
     private logger?: ILogger;

     /**
      * Optional error handler for managing errors during workflow execution.
      */
     private errorHandler?: IErrorHandler;

     /**
      * Optional persistence mechanism for saving workflow states.
      */
     private persistence?: IPersistence;

     /**
      * Sets the name of the workflow.
      * Example:
      * ```typescript
      * builder.setName('MyWorkflow');
      * ```
      * @param name - The name to assign to the workflow.
      * @returns The current `WorkflowBuilder` instance for chaining.
      */
     public setName(name: string): WorkflowBuilder {
          this.name = name;
          return this;
     }

     /**
      * Adds a single task to the workflow.
      * Tasks are executed sequentially unless otherwise specified.
      * Example:
      * ```typescript
      * builder.addTask(myTask);
      * ```
      * @param task - The task to add to the workflow.
      * @returns The current `WorkflowBuilder` instance for chaining.
      */
     public addTask(task: ITask): WorkflowBuilder {
          this.tasks.push(task);
          return this;
     }

     /**
      * Adds a set of tasks to be executed in parallel.
      * Example:
      * ```typescript
      * builder.addParallelTasks([task1, task2]);
      * ```
      * @param tasks - An array of tasks to execute in parallel.
      * @returns The current `WorkflowBuilder` instance for chaining.
      */
     public addParallelTasks(tasks: ITask[]): WorkflowBuilder {
          const parallelTask = new ParallelTask('ParallelTasks', tasks, this.logger);
          this.tasks.push(parallelTask);
          return this;
     }

     /**
      * Adds a group of conditional tasks to the workflow.
      * The tasks are executed only if the specified condition evaluates to `true`.
      * Example:
      * ```typescript
      * builder.addConditionalTasks(
      *   (context) => context.get('shouldRunTasks') === true,
      *   [taskA, taskB]
      * );
      * ```
      * @param condition - A function that determines whether the tasks should be executed.
      * @param tasks - The tasks to execute if the condition is met.
      * @returns The current `WorkflowBuilder` instance for chaining.
      */
     public addConditionalTasks(
          condition: (context: any) => boolean,
          tasks: ITask[]
     ): WorkflowBuilder {
          const conditionalTask = new ConditionalTask(
               'ConditionalTasks',
               condition,
               tasks,
               this.logger
          );
          this.tasks.push(conditionalTask);
          return this;
     }

     /**
      * Adds a lifecycle hook to the workflow.
      * Hooks are triggered at specific stages during workflow execution.
      * Example:
      * ```typescript
      * builder.addHook('onTaskFinish', async (context) => {
      *   console.log('Task finished:', context);
      * });
      * ```
      * @param hookType - The type of the hook (e.g., 'onWorkflowStart', 'onTaskFinish').
      * @param hook - A function to execute at the specified stage.
      * @returns The current `WorkflowBuilder` instance for chaining.
      */
     public addHook(
          hookType: THookType,
          hook: (context: any, error?: Error) => Promise<void>
     ): WorkflowBuilder {
          this.hookManager.registerHook(hookType, hook);
          return this;
     }

     /**
      * Configures workflow-specific options such as retry policies and timeouts.
      * Example:
      * ```typescript
      * builder.setOptions({ retryCount: 3, timeout: 5000 });
      * ```
      * @param options - The configuration options for the workflow.
      * @returns The current `WorkflowBuilder` instance for chaining.
      */
     public setOptions(options: TWorkflowOptions): WorkflowBuilder {
          this.options = options;
          return this;
     }

     /**
      * Sets a custom logger for the workflow.
      * Example:
      * ```typescript
      * builder.setLogger(myLogger);
      * ```
      * @param logger - The logger instance to use.
      * @returns The current `WorkflowBuilder` instance for chaining.
      */
     public setLogger(logger: ILogger): WorkflowBuilder {
          this.logger = logger;
          return this;
     }

     /**
      * Sets a custom error handler for managing errors during workflow execution.
      * Example:
      * ```typescript
      * builder.setErrorHandler(myErrorHandler);
      * ```
      * @param errorHandler - The error handler instance to use.
      * @returns The current `WorkflowBuilder` instance for chaining.
      */
     public setErrorHandler(errorHandler: IErrorHandler): WorkflowBuilder {
          this.errorHandler = errorHandler;
          return this;
     }

     /**
      * Sets a persistence mechanism for saving and restoring workflow states.
      * Example:
      * ```typescript
      * builder.setPersistence(myPersistenceLayer);
      * ```
      * @param persistence - The persistence mechanism to use.
      * @returns The current `WorkflowBuilder` instance for chaining.
      */
     public setPersistence(persistence: IPersistence): WorkflowBuilder {
          this.persistence = persistence;
          return this;
     }

     /**
      * Builds and returns the fully configured workflow instance.
      * Throws an error if the workflow name is not set.
      * Example:
      * ```typescript
      * const workflow = builder.build();
      * ```
      * @returns The configured `Workflow` instance.
      */
     public build(): Workflow {
          if (!this.name) {
               throw new Error('Workflow must have a name');
          }
          return new Workflow(
               this.name,
               this.tasks,
               this.hookManager,
               this.options,
               this.logger,
               this.errorHandler,
               this.persistence
          );
     }
}
