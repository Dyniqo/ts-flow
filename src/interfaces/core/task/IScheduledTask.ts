/**
 * Interface representing a scheduled task with methods for configuring its schedule,
 * starting, and stopping the task.
 * Useful in scenarios where periodic or recurring execution of a task is required.
 */
export interface IScheduledTask {

     /**
      * Configures the schedule for the task using a cron expression.
      * The cron expression determines the timing of task execution.
      * Example:
      * ```typescript
      * task.schedule('0 * * * *'); // Runs the task at the beginning of every hour.
      * ```
      * @param cronExpression - A string in cron format defining the schedule.
      */
     schedule(cronExpression: string): void;

     /**
      * Starts the execution of the scheduled task.
      * If already scheduled, the task will execute at the configured times.
      * Example:
      * ```typescript
      * task.start(); // Activates the task's scheduling.
      * ```
      */
     start(): void;

     /**
      * Stops the execution of the scheduled task.
      * Prevents further executions until restarted.
      * Example:
      * ```typescript
      * task.stop(); // Halts the scheduled task's execution.
      * ```
      */
     stop(): void;
}
