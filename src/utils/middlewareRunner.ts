import { TWorkflowOptions } from '../types';
import { ITaskContext } from '../interfaces/core/task/ITaskContext';

/**
 * Executes middleware functions in sequence for a given task context.
 * Middleware functions allow you to inject custom logic (e.g., logging, validation, transformation)
 * before and after the execution of a task.
 *
 * If no middleware is provided, it directly calls the `next` function, which represents
 * the task's execution logic.
 *
 * @param options - The workflow options, which may include a `middleware` array.
 * @param context - The task context providing input, output, and additional data for the task.
 * @param next - The function to execute the task logic after middleware processing is complete.
 */
export async function runMiddlewareWithTask(
     options: TWorkflowOptions,
     context: ITaskContext<any, any>,
     next: () => Promise<void>
) {
     if (options.middleware && options.middleware.length > 0) {
          let i = 0;

          /**
           * Recursively executes each middleware in the `middleware` array.
           * Middleware can choose to call `run()` to proceed to the next middleware or `next()` to proceed to the task logic.
           */
          const run = async () => {
               if (i < options.middleware!.length) {
                    const mw = options.middleware![i++];
                    await mw(context, run);
               } else {
                    await next();
               }
          };

          await run();
     } else {
          await next();
     }
}
