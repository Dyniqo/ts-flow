import { IEventBus } from '../../interfaces/core/events/IEventBus';
import { EventEmitter } from 'events';

/**
 * A singleton class for managing events using the Node.js EventEmitter.
 * Implements the IEventBus interface to provide methods for emitting, subscribing, and unsubscribing to events.
 */
export class EventBus implements IEventBus {
     /**
      * Singleton instance of the EventBus.
      */
     private static globalInstance: EventBus;

     /**
      * Internal EventEmitter instance used for managing event listeners and emissions.
      */
     private emitter: EventEmitter;

     /**
      * Private constructor to prevent direct instantiation.
      * Use `getGlobalInstance` to access the singleton instance.
      */
     private constructor() {
          this.emitter = new EventEmitter();
     }

     /**
      * Retrieves the global singleton instance of the EventBus.
      * Example:
      * ```typescript
      * const eventBus = EventBus.getGlobalInstance();
      * ```
      * @returns The singleton instance of EventBus.
      */
     public static getGlobalInstance(): EventBus {
          if (!EventBus.globalInstance) {
               EventBus.globalInstance = new EventBus();
          }
          return EventBus.globalInstance;
     }

     /**
      * Emits an event with a given type and payload.
      * All listeners subscribed to the event type will be notified.
      * Example:
      * ```typescript
      * eventBus.emit('userCreated', { userId: 123 });
      * ```
      * @param eventType - The type of event to emit (string).
      * @param payload - The data associated with the event (any type).
      */
     public emit(eventType: string, payload: any): void {
          this.emitter.emit(eventType, payload);
     }

     /**
      * Subscribes a listener function to a specific event type.
      * The listener will be called whenever the event is emitted.
      * Example:
      * ```typescript
      * eventBus.on('userCreated', (data) => {
      *   console.log(`User created with ID: ${data.userId}`);
      * });
      * ```
      * @param eventType - The type of event to listen to (string).
      * @param listener - The function to execute when the event is emitted.
      */
     public on(eventType: string, listener: (payload: any) => void): void {
          this.emitter.on(eventType, listener);
     }

     /**
      * Removes a specific listener from an event type.
      * If the listener is not registered, the method does nothing.
      * Example:
      * ```typescript
      * const listener = (data) => console.log(data);
      * eventBus.on('dataEvent', listener);
      * eventBus.off('dataEvent', listener);
      * ```
      * @param eventType - The type of event to stop listening to (string).
      * @param listener - The listener function to remove.
      */
     public off(eventType: string, listener: (payload: any) => void): void {
          this.emitter.off(eventType, listener);
     }

     /**
      * Subscribes a listener function to a specific event type for a single execution.
      * The listener will be called only the first time the event is emitted, then it will be removed.
      * Example:
      * ```typescript
      * eventBus.once('userCreated', (data) => {
      *   console.log(`User created: ${data.userId}`);
      * });
      * ```
      * @param eventType - The type of event to listen to (string).
      * @param listener - The function to execute when the event is emitted.
      */
     public once(eventType: string, listener: (payload: any) => void): void {
          this.emitter.once(eventType, listener);
     }
}
