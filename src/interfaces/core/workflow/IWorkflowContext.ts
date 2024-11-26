/**
 * Interface defining the context for a workflow, providing methods for managing inputs, outputs,
 * and additional key-value data. This context is used to share and manage data throughout the workflow's execution.
 * @template Input - The type of the input data for the workflow.
 */
export interface IWorkflowContext<Input = any> {

     /**
      * Retrieves the input data provided to the workflow.
      * Example:
      * ```typescript
      * const input = workflowContext.getInput();
      * ```
      * @returns The input data of type `Input`.
      */
     getInput(): Input;

     /**
      * Stores a key-value pair in the workflow's context.
      * Useful for sharing intermediate results or additional data during workflow execution.
      * Example:
      * ```typescript
      * workflowContext.set('userId', 42);
      * ```
      * @param key - A string key to associate with the value.
      * @param value - The value to store, which can be of any type.
      */
     set(key: string, value: any): void;

     /**
      * Retrieves a value from the workflow's context using a key.
      * Example:
      * ```typescript
      * const userId = workflowContext.get<number>('userId');
      * ```
      * @param key - The key associated with the value to retrieve.
      * @returns The value associated with the key, or `undefined` if the key does not exist.
      * @template T - The expected type of the value being retrieved.
      */
     get<T = any>(key: string): T | undefined;

     /**
      * Retrieves the output data of the workflow.
      * Typically used at the end of the workflow to gather final results.
      * Example:
      * ```typescript
      * const output = workflowContext.getOutput();
      * ```
      * @returns The output data, which can be of any type.
      */
     getOutput(): any;
}
