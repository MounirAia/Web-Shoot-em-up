import { ServiceLocator } from './ServiceLocator.js';

type possibleEvent = 'enemy destroyed' | 'player shockwave';
type action = () => void;

export interface IServiceEventManager {
    Subscribe(event: possibleEvent, actionToAdd: action): void;
    Unsubscribe(event: possibleEvent, actionToDelete: action): void;
    Notify(event: possibleEvent, actionToDoBeforeNotifying?: () => void): void;
}

class EventManager implements IServiceEventManager {
    private events: Map<possibleEvent, action[]>;

    constructor() {
        this.events = new Map();

        ServiceLocator.AddService('EventManager', this);
    }

    Subscribe(event: possibleEvent, actionToAdd: action): void {
        const callbacksForTheEvent = this.events.get(event);
        if (callbacksForTheEvent) {
            callbacksForTheEvent.push(actionToAdd);
        } else {
            this.events.set(event, []);
            this.events.get(event)?.push(actionToAdd);
        }
    }

    Unsubscribe(event: possibleEvent, actionToDelete: action) {
        const callbacksForTheEvent = this.events.get(event);
        if (callbacksForTheEvent) {
            const indexActionToDelete = callbacksForTheEvent.indexOf(actionToDelete);
            const lastActionToExecute = callbacksForTheEvent[callbacksForTheEvent.length - 1];
            callbacksForTheEvent[indexActionToDelete] = lastActionToExecute;
            callbacksForTheEvent.pop();
        }
    }

    Notify(event: possibleEvent, actionToDoBeforeNotifying?: () => void) {
        if (actionToDoBeforeNotifying) {
            actionToDoBeforeNotifying();
        }

        this.events.get(event)?.forEach((action) => {
            action();
        });
    }

    public testQuantity() {
        console.log('Event Manager size: ', this.events.size);
    }
}

let eventManager: EventManager;

export function LoadEventManager() {
    eventManager = new EventManager();
}

export function UnloadEventManager() {
    LoadEventManager();
}
