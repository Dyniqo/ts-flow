/**
 * Interface defining the context for a task, providing methods for managing input, output,
 * and additional data that may be required during task execution.
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
}
