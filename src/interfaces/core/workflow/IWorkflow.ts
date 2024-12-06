import { THookType } from '../../../types';
import { EWorkflowStatus } from '../../../enums';

/**
 * Interface representing a workflow, which defines the execution flow of tasks or processes.
 * Includes methods for executing the workflow, controlling its state, and adding hooks 
 * to customize its behavior at various lifecycle stages.
 * 
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

     /**
      * Retrieves the name of the workflow.
      * Example:
      * ```typescript
      * const workflowName = workflow.getName();
      * ```
      * @returns The name of the workflow as a string.
      */
     getName(): string;

     /**
      * Pauses the execution of the workflow. 
      * If the workflow is already paused or not running, this method has no effect.
      * Example:
      * ```typescript
      * await workflow.pause();
      * ```
      * @returns A promise that resolves once the workflow is paused.
      */
     pause(): Promise<void>;

     /**
      * Resumes a paused workflow and continues execution from where it left off.
      * Example:
      * ```typescript
      * const output = await workflow.resume();
      * ```
      * @returns A promise resolving to the output of the workflow of type `Output`.
      * @throws An error if the workflow is not in a paused state.
      */
     resume(): Promise<Output>;

     /**
      * Cancels the execution of the workflow.
      * Once cancelled, the workflow cannot be resumed and its state is considered final.
      * Example:
      * ```typescript
      * await workflow.cancel();
      * ```
      * @returns A promise that resolves once the workflow is cancelled.
      */
     cancel(): Promise<void>;

     /**
      * Retrieves the current status of the workflow.
      * Example:
      * ```typescript
      * const status = workflow.getStatus();
      * ```
      * @returns The status of the workflow as an `EWorkflowStatus` enum value.
      */
     getStatus(): EWorkflowStatus;

     /**
      * Retrieves the status of all tasks within the workflow.
      * Example:
      * ```typescript
      * const tasksStatus = workflow.getTasksStatus();
      * ```
      * @returns An array of objects, each containing the name and status of a task.
      */
     getTasksStatus(): Array<{ name: string; status: string }>;

     /**
      * Restores the state of the workflow from a previously saved state.
      * This is useful for resuming workflows after a system restart or failure.
      * Example:
      * ```typescript
      * workflow.restoreState({ status: EWorkflowStatus.Paused, currentTaskIndex: 2 });
      * ```
      * @param state - An object containing the workflow's status and the index of the current task.
      */
     restoreState(state: { status: EWorkflowStatus; currentTaskIndex: number }): void;
}
