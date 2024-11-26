import { IHookManager } from '../../interfaces/core/hooks/IHookManager';
import { THookType } from '../../types';

/**
 * Class responsible for managing and executing hooks in the workflow lifecycle.
 * Implements the IHookManager interface and provides functionality to register and execute hooks.
 */
export class HookManager implements IHookManager {
     /**
      * Map to store registered hooks categorized by their type.
      * Each hook type is associated with an array of hook functions.
      */
     private hooks: Map<
          THookType,
          Array<(context: any, error?: Error) => Promise<void>>
     > = new Map();

     /**
      * Registers a hook function to a specific hook type.
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
      * Hooks are executed sequentially, and any error in one hook does not stop the execution of others.
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
               for (const hook of hooks) {
                    await hook(context, error);
               }
          }
     }
}
