/**
 * Enum representing the possible statuses of a task in the system.
 */
export enum ETaskStatus {
     /**
      * The task has been created but has not started yet.
      * This is the initial state of most tasks.
      */
     Pending = 'Pending',

     /**
      * The task is currently in progress.
      * This status indicates that the task is being actively executed.
      */
     Running = 'Running',

     /**
      * The task has successfully completed all required operations.
      * This status signifies that the task has finished without any errors.
      */
     Completed = 'Completed',

     /**
      * The task has failed to complete successfully due to an error.
      * This status often requires intervention or retry logic.
      */
     Failed = 'Failed',

     /**
      * The task encountered an issue and is being retried.
      * This status is typically used when automatic retry mechanisms are in place.
      */
     Retrying = 'Retrying',

     /**
      * The task exceeded its allocated time and was terminated.
      * This status indicates a timeout occurred during execution.
      */
     TimedOut = 'TimedOut',
}
