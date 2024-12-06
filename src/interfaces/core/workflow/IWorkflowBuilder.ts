import { IWorkflow } from './IWorkflow';
import { ITask } from '../task/ITask';
import { ILogger } from '../../utils/ILogger';
import { IErrorHandler } from '../error/IErrorHandler';
import { IPersistence } from '../../utils/IPersistence';
import { THookType, TWorkflowOptions } from '../../../types';

/**
 * Interface for building a workflow through a fluent, step-by-step process.
 * Provides methods to configure the workflow's tasks, hooks, options, and other dependencies.
 */
export interface IWorkflowBuilder {

     /**
      * Sets the name of the workflow.
      * Example:
      * ```typescript
      * builder.setName('MyWorkflow');
      * ```
      * @param name - The name to assign to the workflow.
      * @returns The workflow builder instance for method chaining.
      */
     setName(name: string): IWorkflowBuilder;

     /**
      * Adds a task to the workflow.
      * Tasks are executed sequentially unless specified otherwise.
      * Example:
      * ```typescript
      * builder.addTask(myTask);
      * ```
      * @param task - The task to add to the workflow.
      * @returns The workflow builder instance for method chaining.
      */
     addTask(task: ITask): IWorkflowBuilder;

     /**
      * Adds a group of tasks to be executed in parallel.
      * Example:
      * ```typescript
      * builder.addParallelTasks('ParallelGroup', [task1, task2]);
      * ```
      * @param name - A unique name for the group of parallel tasks.
      * @param tasks - An array of tasks to execute in parallel.
      * @returns The workflow builder instance for method chaining.
      */
     addParallelTasks(name: string, tasks: ITask[]): IWorkflowBuilder;

     /**
      * Adds conditional tasks to the workflow.
      * The tasks are executed only if the specified condition evaluates to `true`.
      * Example:
      * ```typescript
      * builder.addConditionalTasks(
      *   'ConditionalGroup',
      *   (context) => context.get('shouldRunTasks') === true,
      *   [taskA, taskB]
      * );
      * ```
      * @param name - A unique name for the conditional task group.
      * @param condition - A function that evaluates the condition based on the workflow context.
      * @param tasks - An array of tasks to execute if the condition is met.
      * @returns The workflow builder instance for method chaining.
      */
     addConditionalTasks(
          name: string,
          condition: (context: any) => boolean,
          tasks: ITask[]
     ): IWorkflowBuilder;

     /**
      * Adds a hook to the workflow at a specific lifecycle point.
      * Example:
      * ```typescript
      * builder.addHook('onTaskFinish', async (context) => {
      *   console.log('Task finished:', context);
      * });
      * ```
      * @param hookType - The type of the hook (e.g., 'onWorkflowStart', 'onTaskFinish').
      * @param hook - A function to execute at the specified lifecycle point.
      * @returns The workflow builder instance for method chaining.
      */
     addHook(
          hookType: THookType,
          hook: (context: any, error?: Error) => Promise<void>
     ): IWorkflowBuilder;

     /**
      * Sets options for configuring the workflow.
      * Example:
      * ```typescript
      * builder.setOptions({ retryCount: 3 });
      * ```
      * @param options - An object defining configuration options for the workflow.
      * @returns The workflow builder instance for method chaining.
      */
     setOptions(options: TWorkflowOptions): IWorkflowBuilder;

     /**
      * Sets a logger to be used by the workflow for logging purposes.
      * Example:
      * ```typescript
      * builder.setLogger(myLogger);
      * ```
      * @param logger - An implementation of the ILogger interface.
      * @returns The workflow builder instance for method chaining.
      */
     setLogger(logger: ILogger): IWorkflowBuilder;

     /**
      * Sets an error handler for managing errors during workflow execution.
      * Example:
      * ```typescript
      * builder.setErrorHandler(myErrorHandler);
      * ```
      * @param errorHandler - An implementation of the IErrorHandler interface.
      * @returns The workflow builder instance for method chaining.
      */
     setErrorHandler(errorHandler: IErrorHandler): IWorkflowBuilder;

     /**
      * Sets a persistence mechanism for saving workflow state.
      * Example:
      * ```typescript
      * builder.setPersistence(myPersistenceLayer);
      * ```
      * @param persistence - An implementation of the IPersistence interface.
      * @returns The workflow builder instance for method chaining.
      */
     setPersistence(persistence: IPersistence): IWorkflowBuilder;

     /**
      * Builds and returns the configured workflow instance.
      * Example:
      * ```typescript
      * const workflow = builder.build();
      * ```
      * @returns The fully configured workflow ready for execution.
      */
     build(): IWorkflow;
}
