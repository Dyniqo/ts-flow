import { TWorkflowOptions } from '../../types';
import { runMiddlewareWithTask } from '../../utils/middlewareRunner';
import { Task } from './Task';
import { TaskContext } from './TaskContext';
import { ILogger } from '../../interfaces/utils/ILogger';
import { ITask } from '../../interfaces/core/task/ITask';

/**
 * Represents a task that conditionally executes one or more child tasks
 * based on a provided condition function.
 * 
 * @template Input - The type of the input data for the task.
 * @template Output - The type of the output data for the task.
 */
export class ConditionalTask<Input = any, Output = any> extends Task<Input, Output> {
     /**
      * A function that evaluates the condition for executing the child tasks.
      */
     private condition: (context: TaskContext<Input, Output>) => boolean;

     /**
      * An array of tasks to execute if the condition is met.
      */
     private tasks: ITask<Input, Output>[];

     /**
      * Workflow-specific options used to configure middleware or other behaviors during task execution.
      */
     protected workflowOptions: TWorkflowOptions;

     /**
      * Constructs a ConditionalTask with a name, a condition function, and a list of tasks to execute if the condition is met.
      * Example:
      * ```typescript
      * const conditionalTask = new ConditionalTask(
      *   'MyConditionalTask',
      *   (context) => context.getInput().shouldRun,
      *   [taskA, taskB]
      * );
      * ```
      * @param name - The name of the conditional task.
      * @param condition - A function that determines whether the child tasks should execute.
      * @param tasks - An array of tasks to execute if the condition is met.
      * @param logger - Optional logger instance for logging.
      */
     constructor(
          name: string,
          condition: (context: TaskContext<Input, Output>) => boolean,
          tasks: ITask<Input, Output>[],
          logger?: ILogger,
          workflowOptions?: TWorkflowOptions
     ) {
          super(
               name,
               async (context: TaskContext<Input, Output>) => {
                    if (condition(context)) {
                         logger?.info(`Condition met in task: ${name}`);
                         const results: Output[] = [];
                         for (const task of tasks) {
                              await runMiddlewareWithTask(this.workflowOptions, context, async () => {
                                   const result = await task.run(context);
                                   results.push(result);
                              });
                         }
                         return results as unknown as Output;
                    } else {
                         logger?.info(`Condition not met in task: ${name}`);
                         return undefined as unknown as Output;
                    }
               },
               undefined,
               logger
          );
          this.condition = condition;
          this.tasks = tasks;
          this.workflowOptions = workflowOptions || {};
     }
}
