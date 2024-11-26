import { Task } from './Task';
import { TaskContext } from './TaskContext';
import { ILogger } from '../../interfaces/utils/ILogger';
import { ITask } from '../../interfaces/core/task/ITask';

/**
 * Represents a task that executes multiple child tasks in parallel.
 * All child tasks run concurrently, and the parent task waits for all to complete.
 * @template Input - The type of the input data for the task.
 * @template Output - The type of the output data for the task.
 */
export class ParallelTask<Input = any, Output = any> extends Task<Input, Output> {
     private tasks: ITask[];

     /**
      * Constructs a ParallelTask with a name and a list of tasks to execute concurrently.
      * Example:
      * ```typescript
      * const parallelTask = new ParallelTask('MyParallelTask', [task1, task2]);
      * ```
      * @param name - The name of the parallel task.
      * @param tasks - An array of tasks to execute in parallel.
      * @param logger - Optional logger instance for logging.
      */
     constructor(name: string, tasks: ITask[], logger?: ILogger) {
          super(name, async (context: TaskContext<Input, Output>) => {
               return undefined as Output
          }, undefined, logger);
          this.tasks = tasks;
     }

     /**
      * Executes all child tasks concurrently and waits for their completion.
      * Example:
      * ```typescript
      * await parallelTask.run(context);
      * ```
      * @param context - The shared context for all child tasks.
      */
     public async run(context: TaskContext<Input, Output>): Promise<Output> {
          this.logger.info(`Running parallel tasks: ${this.name}`);
          await Promise.all(this.tasks.map((task) => task.run(context)));
          this.logger.info(`Finished parallel tasks: ${this.name}`);

          return context.getOutput() as Output
     }
}
