import { IWorkflowContext } from '../../interfaces/core/workflow/IWorkflowContext';

/**
 * Class representing the context of a workflow, allowing for input management,
 * storage of additional data, and retrieval of results or intermediate values.
 * Implements the IWorkflowContext interface.
 * 
 * @template Input - The type of input data provided to the workflow.
 */
export class WorkflowContext<Input = any> implements IWorkflowContext<Input> {
     /**
      * The input data provided to the workflow.
      */
     private input: Input;

     /**
      * A map to store additional data related to the workflow.
      */
     private data: Map<string, any> = new Map();

     /**
      * Constructs a WorkflowContext instance with the provided input.
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
      * Retrieves the input data provided to the workflow.
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
      * Stores a key-value pair in the workflow's context.
      * Useful for saving intermediate results or metadata during workflow execution.
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
      * Retrieves all stored data in the workflow's context.
      * Example:
      * ```typescript
      * const allData = context.getOutput();
      * ```
      * @returns A map containing all key-value pairs stored in the context.
      */
     public getOutput(): any {
          return this.data;
     }
}
