import { ITaskContext } from '../../interfaces';
import { IWorkflowContext } from '../../interfaces/core/workflow/IWorkflowContext';

/**
 * Class representing the context of a workflow, providing utilities for managing
 * workflow input, output, and intermediate task data.
 * Implements both `IWorkflowContext` and `ITaskContext` interfaces to allow
 * seamless integration with workflows and tasks.
 * 
 * @template Input - The type of input data provided to the workflow.
 * @template Output - The type of output data produced by the workflow.
 */
export class WorkflowContext<Input = any, Output = any> implements IWorkflowContext<Input, Output>, ITaskContext<Input, Output> {
     /**
      * The input data provided to the workflow or task.
      */
     protected input: Input;

     /**
      * The output data produced by the workflow or task.
      */
     private output?: Output;

     /**
      * A map to store additional contextual data during workflow execution.
      */
     private data: Map<string, any> = new Map();

     /**
      * A map to store the output of individual tasks in the workflow.
      */
     private taskOutputs: Map<string, any> = new Map();

     /**
      * Constructs a `WorkflowContext` instance with the provided input data.
      * Example:
      * ```typescript
      * const context = new WorkflowContext({ userId: 123 });
      * ```
      * @param input - The initial input data for the workflow.
      */
     constructor(input: Input) {
          this.input = input;
     }

     /**
      * Retrieves the input data provided to the workflow or task.
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
      * Retrieves the output data produced by the workflow or task.
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
      * Stores a key-value pair in the workflow's context.
      * Useful for saving intermediate results or metadata during execution.
      * Example:
      * ```typescript
      * context.set('isProcessed', true);
      * ```
      * @param key - The key to associate with the value.
      * @param value - The value to store, which can be of any type.
      */
     public set(key: string, value: any): void {
          this.data.set(key, value);
     }

     /**
      * Sets the output data for the workflow or task.
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
      * Retrieves a value from the workflow's context using a key.
      * Example:
      * ```typescript
      * const isProcessed = context.get<boolean>('isProcessed');
      * ```
      * @param key - The key associated with the value to retrieve.
      * @returns The value associated with the key, or `undefined` if the key does not exist.
      * @template T - The expected type of the value being retrieved.
      */
     public get<T = any>(key: string): T | undefined {
          return this.data.get(key);
     }

     /**
      * Associates the output of a specific task with its name in the workflow context.
      * Example:
      * ```typescript
      * context.setTaskOutput('fetchUser', { userId: 123 });
      * ```
      * @param taskName - The name of the task whose output is being stored.
      * @param output - The output data produced by the task.
      */
     public setTaskOutput(taskName: string, output: any): void {
          this.taskOutputs.set(taskName, output);
     }

     /**
      * Retrieves the output of a specific task using its name.
      * Example:
      * ```typescript
      * const taskOutput = context.getTaskOutput<{ userId: number }>('fetchUser');
      * ```
      * @param taskName - The name of the task whose output is being retrieved.
      * @returns The output data associated with the task, or `undefined` if not found.
      * @template T - The expected type of the task output being retrieved.
      */
     public getTaskOutput<T = any>(taskName: string): T | undefined {
          return this.taskOutputs.get(taskName);
     }

     /**
      * Retrieves all task outputs stored in the workflow context.
      * Example:
      * ```typescript
      * const allOutputs = context.getAllTaskOutputs();
      * console.log(allOutputs);
      * ```
      * @returns An object containing all task names and their associated outputs.
      */
     public getAllTaskOutputs(): { [taskName: string]: any } {
          const outputs: { [key: string]: any } = {};
          for (const [key, value] of this.taskOutputs.entries()) {
               outputs[key] = value;
          }
          return outputs;
     }
}
