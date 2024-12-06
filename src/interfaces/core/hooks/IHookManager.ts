import { THookType } from '../../../types';

/**
 * Interface for managing hooks, which are functions that can be registered, executed, 
 * removed, or retrieved at specific points in a workflow or task lifecycle.
 * Hooks allow dynamic customization of behavior or additional logic injection.
 */
export interface IHookManager {

     /**
      * Registers a hook function to be executed for a specific hook type.
      * Example:
      * ```typescript
      * hookManager.registerHook('onTaskStart', async (context) => {
      *   console.log('Task is starting:', context);
      * });
      * ```
      * @param hookType - The type of the hook (e.g., 'onTaskStart', 'onWorkflowError').
      * @param hook - A function to execute when the hook is triggered.
      *               Receives the context and an optional error object.
      */
     registerHook(
          hookType: THookType,
          hook: (context: any, error?: Error) => Promise<void>
     ): void;

     /**
      * Executes all hooks registered for a specific hook type.
      * Example:
      * ```typescript
      * await hookManager.executeHooks('onTaskFinish', { taskId: '123' });
      * ```
      * @param hookType - The type of hook to execute (e.g., 'onTaskFinish', 'onWorkflowError').
      * @param context - The context data to pass to the hook functions.
      * @param error - Optional error object to pass to the hook functions, if applicable.
      * @returns A promise that resolves once all hooks for the specified type have been executed.
      */
     executeHooks(
          hookType: THookType,
          context: any,
          error?: Error
     ): Promise<void>;

     /**
      * Removes all hooks associated with a specific hook type.
      * This can be used to clear hooks dynamically during workflow execution.
      * Example:
      * ```typescript
      * hookManager.removeHooks('onWorkflowError');
      * ```
      * @param hookType - The type of hook to remove (e.g., 'onWorkflowError', 'onTaskStart').
      */
     removeHooks(hookType: THookType): void;

     /**
      * Retrieves all registered hooks for a specific hook type.
      * Example:
      * ```typescript
      * const hooks = hookManager.getHooks('onTaskFinish');
      * console.log(hooks);
      * ```
      * @param hookType - The type of hook to retrieve (e.g., 'onTaskFinish', 'onWorkflowError').
      * @returns An array of hook functions associated with the specified type, or `undefined` if no hooks are registered.
      */
     getHooks(hookType: THookType): Array<(context: any, error?: Error) => Promise<void>> | undefined;
}
