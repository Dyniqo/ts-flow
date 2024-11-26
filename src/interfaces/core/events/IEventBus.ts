/**
 * Interface for an event bus system, allowing components to communicate via event-driven mechanisms.
 * Provides methods to emit events, register listeners, remove listeners, and handle one-time events.
 */
export interface IEventBus {

     /**
      * Emits an event, notifying all listeners registered for the specified event type.
      * Example:
      * ```typescript
      * eventBus.emit('taskCompleted', { taskId: '123', status: 'success' });
      * ```
      * @param eventType - A string representing the type of the event.
      * @param payload - The data associated with the event, which can be of any type.
      */
     emit(eventType: string, payload: any): void;

     /**
      * Registers a listener function to be called whenever the specified event type is emitted.
      * Example:
      * ```typescript
      * eventBus.on('taskCompleted', (payload) => {
      *   console.log('Task completed:', payload);
      * });
      * ```
      * @param eventType - A string representing the type of the event to listen for.
      * @param listener - A function to execute when the event is emitted, receiving the event payload.
      */
     on(eventType: string, listener: (payload: any) => void): void;

     /**
      * Removes a listener function for the specified event type.
      * Example:
      * ```typescript
      * eventBus.off('taskCompleted', myListenerFunction);
      * ```
      * @param eventType - A string representing the type of the event.
      * @param listener - The listener function to remove.
      */
     off(eventType: string, listener: (payload: any) => void): void;

     /**
      * Registers a one-time listener for the specified event type.
      * The listener is automatically removed after being called once.
      * Example:
      * ```typescript
      * eventBus.once('taskCompleted', (payload) => {
      *   console.log('This will only log once:', payload);
      * });
      * ```
      * @param eventType - A string representing the type of the event.
      * @param listener - A function to execute when the event is emitted, receiving the event payload.
      */
     once(eventType: string, listener: (payload: any) => void): void;
}
