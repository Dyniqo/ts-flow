import { Task } from './Task';
import { TaskContext } from './TaskContext';
import { TWorkflowOptions } from '../../types';
import { runMiddlewareWithTask } from '../../utils/middlewareRunner';
import { ILogger } from '../../interfaces/utils/ILogger';
import { ITask } from '../../interfaces/core/task/ITask';

/**
 * Represents a task that executes multiple child tasks in parallel.
 * All child tasks run concurrently, and the parent task waits for all to complete.
 * @template Input - The type of the input data for the task.
 * @template Output - The type of the output data for the task.
 */
export class ParallelTask<Input = any, Output = any> extends Task<Input, Output> {
     /**
      * An array of tasks to execute in parallel.
      */
     private tasks: ITask<Input, Output>[]

     /**
      * Workflow-specific options used to configure middleware or other behaviors during task execution.
      */
     protected workflowOptions: TWorkflowOptions;

     /**
      * Constructs a `ParallelTask` with a name and a list of child tasks to be executed in parallel.
      * Example:
      * ```typescript
      * const parallelTask = new ParallelTask(
      *   'MyParallelTask',
      *   [taskA, taskB, taskC],
      *   logger,
      *   { middleware: [middlewareFunction] }
      * );
      * ```
      * @param name - The name of the parallel task.
      * @param tasks - An array of tasks to execute in parallel.
      * @param logger - Optional logger instance for logging.
      * @param workflowOptions - Optional workflow-specific configuration options.
      */
     constructor(
          name: string,
          tasks: ITask<Input, Output>[],
          logger?: ILogger,
          workflowOptions?: TWorkflowOptions
     ) {
          super(
               name,
               async (context: TaskContext<Input, Output>) => {
                    const results: Output[] = await Promise.all(
                         tasks.map(task =>
                              (async () => {
                                   let taskResult: Output;
                                   await runMiddlewareWithTask(this.workflowOptions, context, async () => {
                                        taskResult = await task.run(context);
                                   });
                                   return taskResult!;
                              })()
                         )
                    );
                    return results as unknown as Output;
               },
               undefined,
               logger
          );
          this.tasks = tasks;
          this.workflowOptions = workflowOptions || {};
     }
}
