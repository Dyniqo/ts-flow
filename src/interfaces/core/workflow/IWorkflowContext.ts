/**
 * Interface defining the context for a workflow, providing methods for managing inputs, outputs,
 * task-specific data, and additional key-value pairs. This context is used to manage and share data
 * throughout the workflow's execution.
 * 
 * @template Input - The type of the input data for the workflow.
 * @template Output - The type of the output data produced by the workflow.
 */
export interface IWorkflowContext<Input = any, Output = any> {

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
      * Useful for sharing intermediate results or additional metadata during workflow execution.
      * Example:
      * ```typescript
      * workflowContext.set('isProcessed', true);
      * ```
      * @param key - A string key to associate with the value.
      * @param value - The value to store, which can be of any type.
      */
     set(key: string, value: any): void;

     /**
      * Retrieves a value from the workflow's context using a key.
      * Example:
      * ```typescript
      * const isProcessed = workflowContext.get<boolean>('isProcessed');
      * ```
      * @param key - The key associated with the value to retrieve.
      * @returns The value associated with the key, or `undefined` if the key does not exist.
      * @template T - The expected type of the value being retrieved.
      */
     get<T = any>(key: string): T | undefined;

     /**
      * Sets the final output data of the workflow.
      * Typically used to store the result after the workflow execution is complete.
      * Example:
      * ```typescript
      * workflowContext.setOutput(finalResult);
      * ```
      * @param output - The output data of type `Output`.
      */
     setOutput(output: Output): void;

     /**
      * Retrieves the final output data of the workflow.
      * Example:
      * ```typescript
      * const output = workflowContext.getOutput();
      * ```
      * @returns The output data of type `Output`, or `undefined` if not set.
      */
     getOutput(): Output | undefined;

     /**
      * Stores the output of a specific task in the workflow.
      * Useful for tracking task-specific results and sharing them across the workflow.
      * Example:
      * ```typescript
      * workflowContext.setTaskOutput('TaskA', { result: 'success' });
      * ```
      * @param taskName - The name of the task.
      * @param output - The output data of the task.
      */
     setTaskOutput(taskName: string, output: any): void;

     /**
      * Retrieves the output of a specific task in the workflow.
      * Example:
      * ```typescript
      * const taskOutput = workflowContext.getTaskOutput<{ result: string }>('TaskA');
      * ```
      * @param taskName - The name of the task.
      * @returns The output data of the task, or `undefined` if no output is set for the task.
      * @template T - The expected type of the task output.
      */
     getTaskOutput<T = any>(taskName: string): T | undefined;

     /**
      * Retrieves all task outputs stored in the workflow context.
      * Useful for summarizing or debugging task results at the end of the workflow.
      * Example:
      * ```typescript
      * const allOutputs = workflowContext.getAllTaskOutputs();
      * ```
      * @returns An object containing all task outputs, where keys are task names and values are their outputs.
      */
     getAllTaskOutputs(): { [taskName: string]: any };
}
