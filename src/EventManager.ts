import { ServiceLocator } from './ServiceLocator.js';

type possibleEvent = 'enemy destroyed';
type action = () => void;

export interface IServiceEventManager {
    Subscribe(event: possibleEvent, actionToAdd: action): void;
    Notify(event: possibleEvent, actionToDoBeforeNotifying?: () => void): void;
}

class EventManager implements IServiceEventManager {
    private events: Map<possibleEvent, action[]>;

    constructor() {
        this.events = new Map();

        ServiceLocator.AddService('EventManager', this);
    }

    Subscribe(event: possibleEvent, actionToAdd: action) {
        const callbacksForTheEvent = this.events.get(event);
        if (callbacksForTheEvent) {
            callbacksForTheEvent.push(actionToAdd);
        } else {
            this.events.set(event, []);
            this.events.get(event)?.push(actionToAdd);
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
}

export function LoadEventManager() {
    new EventManager();
}
