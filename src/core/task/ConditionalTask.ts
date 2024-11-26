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
      * A list of child tasks to execute if the condition is met.
      */
     private tasks: ITask[];

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
          tasks: ITask[],
          logger?: ILogger
     ) {
          super(name, async (context: TaskContext<Input, Output>) => {
               return undefined as Output;
          }, undefined, logger);

          this.condition = condition;
          this.tasks = tasks;
     }

     /**
      * Executes the child tasks if the condition is met.
      * Logs the execution status of the task and its condition.
      * Example:
      * ```typescript
      * await conditionalTask.run(context);
      * ```
      * @param context - The context shared among all child tasks.
      * @returns A promise resolving to the output of the context after executing child tasks, if any.
      */
     public async run(context: TaskContext<Input, Output>): Promise<Output> {
          if (this.condition(context)) {
               this.logger.info(`Condition met in task: ${this.name}`);
               for (const task of this.tasks) {
                    await task.run(context);
               }
          } else {
               this.logger.info(`Condition not met in task: ${this.name}`);
          }

          return context.getOutput() as Output;
     }
}
