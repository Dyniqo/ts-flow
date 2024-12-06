import { IPersistence } from '../interfaces/utils/IPersistence';

/**
 * In-memory implementation of the `IPersistence` interface.
 * Provides a lightweight mechanism to persist workflow and task states during execution.
 * Useful for testing or scenarios where durable storage is not required.
 */
export class InMemoryPersistence implements IPersistence {
     /**
      * A map to store the states of workflows.
      * The keys represent workflow IDs, and the values are their corresponding states.
      */
     private workflowStates: Map<string, any> = new Map();

     /**
      * A map to store the states of tasks.
      * The keys represent task IDs, and the values are their corresponding states.
      */
     private taskStates: Map<string, any> = new Map();

     /**
      * Saves the state of a workflow in memory.
      * Example:
      * ```typescript
      * await persistence.saveWorkflowState('workflow1', { status: 'running' });
      * ```
      * @param workflowId - The unique identifier for the workflow.
      * @param state - The state data to save.
      */
     async saveWorkflowState(workflowId: string, state: any): Promise<void> {
          this.workflowStates.set(workflowId, state);
     }

     /**
      * Retrieves the state of a workflow from memory.
      * Example:
      * ```typescript
      * const state = await persistence.getWorkflowState('workflow1');
      * ```
      * @param workflowId - The unique identifier for the workflow.
      * @returns A promise resolving to the state of the workflow, or `undefined` if not found.
      */
     async getWorkflowState(workflowId: string): Promise<any> {
          return this.workflowStates.get(workflowId);
     }

     /**
      * Saves the state of a task in memory.
      * Example:
      * ```typescript
      * await persistence.saveTaskState('task1', { status: 'completed' });
      * ```
      * @param taskId - The unique identifier for the task.
      * @param state - The state data to save.
      */
     async saveTaskState(taskId: string, state: any): Promise<void> {
          this.taskStates.set(taskId, state);
     }

     /**
      * Retrieves the state of a task from memory.
      * Example:
      * ```typescript
      * const state = await persistence.getTaskState('task1');
      * ```
      * @param taskId - The unique identifier for the task.
      * @returns A promise resolving to the state of the task, or `undefined` if not found.
      */
     async getTaskState(taskId: string): Promise<any> {
          return this.taskStates.get(taskId);
     }
}
