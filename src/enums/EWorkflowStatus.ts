/**
 * Enum representing the different statuses a workflow can have.
 */
export enum EWorkflowStatus {
     /**
      * The workflow is created but not yet started.
      * Typically, a workflow in this state is awaiting user action or a trigger to begin.
      */
     Pending = 'Pending',

     /**
      * The workflow is currently running.
      * This status indicates that the workflow's tasks are actively being executed.
      */
     Running = 'Running',

     /**
      * The workflow has been temporarily paused.
      * This status is used when a workflow is intentionally halted and can be resumed later.
      */
     Paused = 'Paused',

     /**
      * The workflow has finished successfully.
      * All tasks in the workflow have been completed without errors.
      */
     Completed = 'Completed',

     /**
      * The workflow has failed during execution.
      * This status typically indicates an error or exception occurred that prevented completion.
      */
     Failed = 'Failed',

     /**
      * The workflow has been cancelled before completion.
      * This status indicates that the workflow was terminated intentionally, often by user action.
      */
     Cancelled = 'Cancelled'
}
