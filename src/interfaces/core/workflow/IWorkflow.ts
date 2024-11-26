import { THookType } from '../../../types';

/**
 * Interface representing a workflow, which defines the execution flow of tasks or processes.
 * Includes methods for executing the workflow and adding hooks to customize its behavior.
 * @template Input - The type of the input data for the workflow.
 * @template Output - The type of the output data produced by the workflow.
 */
export interface IWorkflow<Input = any, Output = any> {

     /**
      * Executes the workflow with the provided input.
      * The workflow processes the input through its defined sequence and returns the final output.
      * Example:
      * ```typescript
      * const result = await workflow.execute({ userId: 42 });
      * ```
      * @param input - The input data of type `Input` required to execute the workflow.
      * @returns A promise resolving to the output of the workflow of type `Output`.
      */
     execute(input: Input): Promise<Output>;

     /**
      * Adds a hook to the workflow at a specific point in its lifecycle.
      * Hooks allow custom logic to be executed during various stages, such as before execution,
      * after completion, or in case of an error.
      * Example:
      * ```typescript
      * workflow.addHook('onWorkflowStart', async (context) => {
      *   console.log('Workflow started:', context);
      * });
      * ```
      * @param hookType - The type of the hook (e.g., 'onWorkflowStart', 'onTaskFinish').
      * @param hook - A function to execute at the specified hook point, receiving the context
      *               and an optional error object.
      */
     addHook(
          hookType: THookType,
          hook: (context: any, error?: Error) => Promise<void>
     ): void;
}
