import { TaskContext } from '../task';
import { Workflow } from './Workflow';
import { HookManager } from '../hooks/HookManager';
import { ParallelTask } from '../task/ParallelTask';
import { THookType, TWorkflowOptions } from '../../types';
import { ConditionalTask } from '../task/ConditionalTask';
import { ITask } from '../../interfaces/core/task/ITask';
import { ILogger } from '../../interfaces/utils/ILogger';
import { IPersistence } from '../../interfaces/utils/IPersistence';
import { IErrorHandler } from '../../interfaces/core/error/IErrorHandler';
import { IWorkflowBuilder } from '../../interfaces/core/workflow/IWorkflowBuilder';

/**
 * A fluent builder class for constructing workflows.
 * Supports adding tasks, hooks, validators, and configuration options step-by-step.
 */
export class WorkflowBuilder implements IWorkflowBuilder {
     /**
      * The name of the workflow being built.
      */
     private name: string = '';

     /**
      * List of tasks included in the workflow.
      */
     private tasks: ITask[] = [];

     /**
      * Instance of `HookManager` to manage workflow lifecycle hooks.
      */
     private hookManager: HookManager = new HookManager();

     /**
      * Configuration options for the workflow, such as middleware or retry settings.
      */
     private options: TWorkflowOptions = {};

     /**
      * Optional logger instance for logging workflow-related activities.
      */
     private logger?: ILogger;

     /**
      * Optional error handler for managing workflow execution errors.
      */
     private errorHandler?: IErrorHandler;

     /**
      * Optional persistence mechanism for saving and restoring workflow states.
      */
     private persistence?: IPersistence;

     /**
      * Sets the name of the workflow.
      * Example:
      * ```typescript
      * builder.setName('MyWorkflow');
      * ```
      * @param name - The name of the workflow.
      * @returns The current instance of `WorkflowBuilder` for chaining.
      */
     public setName(name: string): WorkflowBuilder {
          this.name = name;
          return this;
     }

     /**
      * Adds a task to the workflow.
      * Tasks are executed sequentially unless specified otherwise.
      * Example:
      * ```typescript
      * builder.addTask(myTask);
      * ```
      * @param task - The task to add.
      * @returns The current instance of `WorkflowBuilder` for chaining.
      */
     public addTask(task: ITask): WorkflowBuilder {
          this.tasks.push(task);
          return this;
     }

     /**
      * Adds a set of tasks to the workflow that will run in parallel.
      * Example:
      * ```typescript
      * builder.addParallelTasks('MyParallelTasks', [taskA, taskB, taskC]);
      * ```
      * @param name - A name for the parallel task group.
      * @param tasks - An array of tasks to run in parallel.
      * @returns The current instance of `WorkflowBuilder` for chaining.
      */
     public addParallelTasks(name: string, tasks: ITask[]): WorkflowBuilder {
          const parallelTask = new ParallelTask(name, tasks, this.logger, this.options);
          this.tasks.push(parallelTask);
          return this;
     }

     /**
      * Adds a group of conditional tasks to the workflow.
      * The tasks execute only if the provided condition function evaluates to `true`.
      * Example:
      * ```typescript
      * builder.addConditionalTasks(
      *   'ConditionalGroup',
      *   (context) => context.get('shouldRun') === true,
      *   [taskX, taskY]
      * );
      * ```
      * @param name - A name for the conditional task group.
      * @param condition - A function to evaluate whether to execute the tasks.
      * @param tasks - An array of tasks to run if the condition is met.
      * @returns The current instance of `WorkflowBuilder` for chaining.
      */
     public addConditionalTasks<Input = any, Output = any>(
          name: string,
          condition: (context: TaskContext<Input, Output>) => boolean,
          tasks: ITask<Input, Output>[]
     ): WorkflowBuilder {
          const conditionalTask = new ConditionalTask<Input, Output>(
               name,
               condition,
               tasks,
               this.logger,
               this.options
          );
          this.tasks.push(conditionalTask);
          return this;
     }

     /**
      * Sets a validator function to validate the workflow's input.
      * Example:
      * ```typescript
      * builder.setValidator(async (input) => {
      *   const errors = [];
      *   if (!input.userId) errors.push('User ID is required.');
      *   return errors;
      * });
      * ```
      * @param validator - A function that validates the input and returns an array of error messages.
      * @returns The current instance of `WorkflowBuilder` for chaining.
      */
     public setValidator<Input, Output>(validator: (input: Input) => Promise<string[]>): WorkflowBuilder {
          (this.options as any).validator = validator;
          return this;
     }

     /**
      * Adds a lifecycle hook to the workflow.
      * Hooks are triggered at specific points during the workflow's lifecycle.
      * Example:
      * ```typescript
      * builder.addHook('onTaskFinish', async (context) => {
      *   console.log('Task finished:', context);
      * });
      * ```
      * @param hookType - The type of the hook (e.g., 'onWorkflowStart', 'onTaskFinish').
      * @param hook - The function to execute during the specified lifecycle event.
      * @returns The current instance of `WorkflowBuilder` for chaining.
      */
     public addHook(
          hookType: THookType,
          hook: (context: any, error?: Error) => Promise<void>
     ): WorkflowBuilder {
          this.hookManager.registerHook(hookType, hook);
          return this;
     }

     /**
      * Configures the workflow's options, such as middleware, retry policies, or timeouts.
      * Example:
      * ```typescript
      * builder.setOptions({ retryCount: 3, timeout: 5000 });
      * ```
      * @param options - The options to configure.
      * @returns The current instance of `WorkflowBuilder` for chaining.
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
      * @returns The current instance of `WorkflowBuilder` for chaining.
      */
     public setLogger(logger: ILogger): WorkflowBuilder {
          this.logger = logger;
          return this;
     }

     /**
      * Sets a custom error handler for the workflow.
      * Example:
      * ```typescript
      * builder.setErrorHandler(myErrorHandler);
      * ```
      * @param errorHandler - The error handler instance to use.
      * @returns The current instance of `WorkflowBuilder` for chaining.
      */
     public setErrorHandler(errorHandler: IErrorHandler): WorkflowBuilder {
          this.errorHandler = errorHandler;
          return this;
     }

     /**
      * Sets a persistence mechanism for the workflow to save and restore states.
      * Example:
      * ```typescript
      * builder.setPersistence(myPersistenceLayer);
      * ```
      * @param persistence - The persistence mechanism to use.
      * @returns The current instance of `WorkflowBuilder` for chaining.
      */
     public setPersistence(persistence: IPersistence): WorkflowBuilder {
          this.persistence = persistence;
          return this;
     }

     /**
      * Builds and returns the configured workflow instance.
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
          const wf = new Workflow(
               this.name,
               this.tasks,
               this.hookManager,
               this.options,
               this.logger,
               this.errorHandler,
               this.persistence
          );
          // Set the validator if defined in options.
          if ((this.options as any).validator) {
               wf.setValidator((this.options as any).validator);
          }
          return wf;
     }
}
