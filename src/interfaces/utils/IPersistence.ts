/**
 * Interface defining the persistence layer for storing and retrieving workflow and task states.
 * This interface abstracts the underlying storage mechanism, allowing for flexibility in implementation.
 */
export interface IPersistence {
     /**
      * Saves the state of a workflow.
      * @param workflowId - The unique identifier for the workflow.
      * @param state - The state object representing the current status or data of the workflow.
      * @returns A promise that resolves when the workflow state is successfully saved.
      */
     saveWorkflowState(workflowId: string, state: any): Promise<void>;

     /**
      * Retrieves the state of a workflow.
      * @param workflowId - The unique identifier for the workflow.
      * @returns A promise that resolves with the state object of the workflow, or null if not found.
      */
     getWorkflowState(workflowId: string): Promise<any>;

     /**
      * Saves the state of a task.
      * @param taskId - The unique identifier for the task.
      * @param state - The state object representing the current status or data of the task.
      * @returns A promise that resolves when the task state is successfully saved.
      */
     saveTaskState(taskId: string, state: any): Promise<void>;

     /**
      * Retrieves the state of a task.
      * @param taskId - The unique identifier for the task.
      * @returns A promise that resolves with the state object of the task, or null if not found.
      */
     getTaskState(taskId: string): Promise<any>;
}
