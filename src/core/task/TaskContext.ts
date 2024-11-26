import { ITaskContext } from '../../interfaces/core/task/ITaskContext';

/**
 * Implementation of the ITaskContext interface, providing methods for managing
 * task input, output, and contextual data during task execution.
 * 
 * @template Input - The type of the input data for the task.
 * @template Output - The type of the output data produced by the task.
 */
export class TaskContext<Input = any, Output = any> implements ITaskContext<Input, Output> {
     /**
      * The input data provided to the task.
      */
     private input: Input;

     /**
      * The output data produced by the task.
      */
     private output?: Output;

     /**
      * A map to store additional contextual data for the task.
      */
     private data: Map<string, any>;

     /**
      * Constructs a TaskContext with the provided input data.
      * Example:
      * ```typescript
      * const context = new TaskContext({ userId: 42 });
      * ```
      * @param input - The input data for the task.
      */
     constructor(input: Input) {
          this.input = input;
          this.data = new Map();
     }

     /**
      * Retrieves the input data for the task.
      * Example:
      * ```typescript
      * const input = context.getInput();
      * ```
      * @returns The input data of type `Input`.
      */
     public getInput(): Input {
          return this.input;
     }

     /**
      * Sets the output data produced by the task.
      * Example:
      * ```typescript
      * context.setOutput({ success: true });
      * ```
      * @param output - The output data of type `Output`.
      */
     public setOutput(output: Output): void {
          this.output = output;
     }

     /**
      * Retrieves the output data produced by the task.
      * Example:
      * ```typescript
      * const output = context.getOutput();
      * ```
      * @returns The output data of type `Output`, or `undefined` if not set.
      */
     public getOutput(): Output | undefined {
          return this.output;
     }

     /**
      * Stores a key-value pair in the task's context.
      * Useful for storing intermediate or additional data during task execution.
      * Example:
      * ```typescript
      * context.set('retryCount', 3);
      * ```
      * @param key - The key to associate with the value.
      * @param value - The value to store, which can be of any type.
      */
     public set(key: string, value: any): void {
          this.data.set(key, value);
     }

     /**
      * Retrieves a value from the task's context using a key.
      * Example:
      * ```typescript
      * const retryCount = context.get<number>('retryCount');
      * ```
      * @param key - The key associated with the value to retrieve.
      * @returns The value associated with the key, or `undefined` if the key does not exist.
      * @template T - The expected type of the value being retrieved.
      */
     public get<T = any>(key: string): T | undefined {
          return this.data.get(key);
     }
}
