import { THookType } from '../../../types';

/**
 * Interface for managing hooks, which are functions that can be registered and executed 
 * at specific points in a workflow or task lifecycle. Hooks can be used to customize 
 * behavior or handle additional logic dynamically.
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
}
