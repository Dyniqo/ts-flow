import { ITaskContext } from '../../interfaces';

/**
 * Implementation of the `ITaskContext` interface, providing methods for managing
 * task input, output, and contextual data during task execution.
 * This class also tracks outputs of individual tasks in a workflow, allowing
 * access to the results of all executed tasks.
 * 
 * @template Input - The type of the input data for the task.
 * @template Output - The type of the output data produced by the task.
 */
export class TaskContext<Input = any, Output = any> implements ITaskContext<Input, Output> {
     /**
      * The input data provided to the task.
      */
     protected input: Input;

     /**
      * The output data produced by the task.
      */
     private output?: Output;

     /**
      * A map to store additional contextual data for the task.
      */
     private data: Map<string, any> = new Map();

     /**
      * A map to track outputs of individual tasks by their names.
      * Useful for workflows that execute multiple tasks and need to manage their outputs.
      */
     private taskOutputs: Map<string, any> = new Map();

     /**
      * Constructs a `TaskContext` instance with the provided input data.
      * Example:
      * ```typescript
      * const context = new TaskContext({ userId: 42 });
      * ```
      * @param input - The input data for the task.
      */
     constructor(input: Input) {
          this.input = input;
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

     /**
      * Stores the output of a specific task by its name.
      * Useful for tracking outputs in workflows that involve multiple tasks.
      * Example:
      * ```typescript
      * context.setTaskOutput('taskA', { result: 'success' });
      * ```
      * @param taskName - The name of the task whose output is being stored.
      * @param output - The output data of the task.
      */
     public setTaskOutput(taskName: string, output: any): void {
          this.taskOutputs.set(taskName, output);
     }

     /**
      * Retrieves the output of a specific task by its name.
      * Example:
      * ```typescript
      * const taskAOutput = context.getTaskOutput('taskA');
      * ```
      * @param taskName - The name of the task whose output is being retrieved.
      * @returns The output of the task, or `undefined` if not found.
      * @template T - The expected type of the output data.
      */
     public getTaskOutput<T = any>(taskName: string): T | undefined {
          return this.taskOutputs.get(taskName);
     }

     /**
      * Retrieves all task outputs stored in the context.
      * Example:
      * ```typescript
      * const allOutputs = context.getAllTaskOutputs();
      * console.log(allOutputs); // { taskA: { result: 'success' }, taskB: { result: 'failure' } }
      * ```
      * @returns An object containing task names as keys and their respective outputs as values.
      */
     public getAllTaskOutputs(): { [taskName: string]: any } {
          const outputs: { [key: string]: any } = {};
          for (const [key, value] of this.taskOutputs.entries()) {
               outputs[key] = value;
          }
          return outputs;
     }
}
