import { IHookManager } from '../../interfaces/core/hooks/IHookManager';
import { THookType } from '../../types';

/**
 * Class responsible for managing and executing hooks in the workflow lifecycle.
 * Implements the `IHookManager` interface and provides functionality to register, execute, and remove hooks.
 * Hooks are categorized by type and can be dynamically added, retrieved, or removed as needed.
 */
export class HookManager implements IHookManager {
     /**
      * Map to store registered hooks categorized by their type.
      * The key represents the hook type (e.g., 'onWorkflowStart', 'onTaskFinish'),
      * and the value is an array of asynchronous hook functions.
      */
     private hooks: Map<
          THookType,
          Array<(context: any, error?: Error) => Promise<void>>
     > = new Map();

     /**
      * Registers a hook function to a specific hook type.
      * If the hook type doesn't exist, it initializes an empty array for it before adding the function.
      * Example:
      * ```typescript
      * hookManager.registerHook('onTaskFinish', async (context, error) => {
      *   console.log('Task finished:', context);
      * });
      * ```
      * @param hookType - The type of the hook (e.g., 'onWorkflowStart', 'onTaskFinish').
      * @param hook - A function to be executed when the hook type is triggered.
      */
     public registerHook(
          hookType: THookType,
          hook: (context: any, error?: Error) => Promise<void>
     ): void {
          if (!this.hooks.has(hookType)) {
               this.hooks.set(hookType, []);
          }
          this.hooks.get(hookType)!.push(hook);
     }

     /**
      * Executes all hooks registered for a specific hook type.
      * Hooks are executed asynchronously, and any error in one hook does not stop the execution of others.
      * Example:
      * ```typescript
      * await hookManager.executeHooks('onTaskFinish', taskContext);
      * ```
      * @param hookType - The type of the hook to execute.
      * @param context - The context passed to the hooks during execution.
      * @param error - (Optional) An error object to be passed to hooks that handle errors.
      */
     public async executeHooks(
          hookType: THookType,
          context: any,
          error?: Error
     ): Promise<void> {
          const hooks = this.hooks.get(hookType);
          if (hooks) {
               await Promise.all(hooks.map((hook) => hook(context, error)));
          }
     }

     /**
      * Removes all hooks registered for a specific hook type.
      * This clears the array of hooks for the given type.
      * Example:
      * ```typescript
      * hookManager.removeHooks('onTaskFinish');
      * ```
      * @param hookType - The type of the hook to remove.
      */
     public removeHooks(hookType: THookType): void {
          this.hooks.set(hookType, []);
     }

     /**
      * Retrieves all hooks registered for a specific hook type.
      * Example:
      * ```typescript
      * const hooks = hookManager.getHooks('onTaskFinish');
      * if (hooks) {
      *   console.log(`Number of hooks: ${hooks.length}`);
      * }
      * ```
      * @param hookType - The type of the hook to retrieve.
      * @returns An array of hook functions, or `undefined` if no hooks are registered for the given type.
      */
     public getHooks(hookType: THookType): Array<(context: any, error?: Error) => Promise<void>> | undefined {
          return this.hooks.get(hookType);
     }
}
