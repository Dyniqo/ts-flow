import { ITaskContext } from './ITaskContext';

/**
 * Interface representing a task that can be executed within a workflow or standalone.
 * Tasks have a name and an execution logic that operates on a provided context.
 * @template Input - The type of the input data for the task.
 * @template Output - The type of the output data produced by the task.
 */
export interface ITask<Input = any, Output = any> {

     /**
      * The name of the task, used for identification and logging purposes.
      * Example:
      * ```typescript
      * const taskName = task.name; // "MyTask"
      * ```
      */
     name: string;

     /**
      * Executes the task's logic using the provided context.
      * The context contains input data, stores output data, and allows managing task-specific state.
      * Example:
      * ```typescript
      * const result = await task.run(context);
      * ```
      * @param context - An instance of `ITaskContext` that provides input, output, and additional data for the task.
      * @returns A promise that resolves to the output of the task.
      */
     run(context: ITaskContext<Input, Output>): Promise<Output>;
}
