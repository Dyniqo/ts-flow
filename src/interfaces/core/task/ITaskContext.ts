/**
 * Interface defining the context for a task, providing methods for managing input, output,
 * and additional data, as well as specific outputs for individual tasks within a workflow.
 * @template Input - The type of the input data for the task.
 * @template Output - The type of the output data for the task.
 */
export interface ITaskContext<Input = any, Output = any> {

     /**
      * Retrieves the input data provided to the task.
      * Example:
      * ```typescript
      * const input = taskContext.getInput();
      * ```
      * @returns The input data of type `Input`.
      */
     getInput(): Input;

     /**
      * Sets the output data produced by the task.
      * Example:
      * ```typescript
      * taskContext.setOutput(result);
      * ```
      * @param output - The output data of type `Output`.
      */
     setOutput(output: Output): void;

     /**
      * Retrieves the output data produced by the task.
      * Example:
      * ```typescript
      * const output = taskContext.getOutput();
      * ```
      * @returns The output data of type `Output`, or `undefined` if not set.
      */
     getOutput(): Output | undefined;

     /**
      * Stores a key-value pair in the task's context.
      * Useful for managing additional data required during task execution.
      * Example:
      * ```typescript
      * taskContext.set('userId', 12345);
      * ```
      * @param key - The key to associate with the value.
      * @param value - The value to store, which can be of any type.
      */
     set(key: string, value: any): void;

     /**
      * Retrieves a value from the task's context using a key.
      * Example:
      * ```typescript
      * const userId = taskContext.get<number>('userId');
      * ```
      * @param key - The key associated with the value to retrieve.
      * @returns The value associated with the key, or `undefined` if the key does not exist.
      * @template T - The expected type of the value being retrieved.
      */
     get<T = any>(key: string): T | undefined;

     /**
      * Associates the output of a specific task with its name in the context.
      * Useful for storing the results of individual tasks within a workflow.
      * Example:
      * ```typescript
      * taskContext.setTaskOutput('taskA', { result: 'success' });
      * ```
      * @param taskName - The name of the task whose output is being stored.
      * @param output - The output data to associate with the task.
      */
     setTaskOutput(taskName: string, output: any): void;

     /**
      * Retrieves the output of a specific task by its name.
      * Example:
      * ```typescript
      * const taskAOutput = taskContext.getTaskOutput<{ result: string }>('taskA');
      * ```
      * @param taskName - The name of the task whose output is being retrieved.
      * @returns The output associated with the specified task name, or `undefined` if not set.
      * @template T - The expected type of the task's output.
      */
     getTaskOutput<T = any>(taskName: string): T | undefined;

     /**
      * Retrieves all task outputs stored in the context.
      * Example:
      * ```typescript
      * const allOutputs = taskContext.getAllTaskOutputs();
      * ```
      * @returns An object containing all task outputs, where the keys are task names and the values are their outputs.
      */
     getAllTaskOutputs(): { [taskName: string]: any };
}
