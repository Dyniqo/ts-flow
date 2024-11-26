/**
 * Type representing different types of hooks available in the workflow system.
 * Hooks allow custom logic to be executed at specific points during the workflow lifecycle.
 */
export type THookType =
     | 'onWorkflowStart' // Triggered when the workflow starts. Useful for initialization or logging.
     | 'onWorkflowFinish' // Triggered when the workflow finishes successfully. Useful for cleanup or result processing.
     | 'onWorkflowError' // Triggered when an error occurs in the workflow. Useful for error handling or alerts.
     | 'onTaskStart' // Triggered when a task within the workflow starts. Useful for logging or monitoring.
     | 'onTaskFinish' // Triggered when a task within the workflow finishes successfully. Useful for task-specific logic or post-processing.
     | 'onAllTasksFinish' // Triggered when all tasks in the workflow are completed. Useful for summarization or final reporting.
     | 'onTaskRetry' // Triggered when a task is retried after a failure. Useful for tracking retry attempts or adjusting strategy.
     | 'onTaskTimeout'; // Triggered when a task times out. Useful for timeout-specific handling or escalation.
