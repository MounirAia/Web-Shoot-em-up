import { ServiceLocator } from './ServiceLocator.js';

export interface IServiceUtilManager {
    GetRandomObjectFromMap<T>(parameters: { theMap: Map<unknown, unknown> }): T | undefined;
}

class UtilManager implements IServiceUtilManager {
    constructor() {
        ServiceLocator.AddService('UtilManager', this);
    }

    GetRandomObjectFromMap<T>(parameters: { theMap: Map<unknown, unknown> }): T | undefined {
        const { theMap } = parameters;
        const randomIndex = Math.floor(theMap.size * Math.random());

        let i = 0;
        for (const [key, entity] of theMap) {
            if (i === randomIndex) {
                return entity as T;
            }
            i++;
        }

        return undefined;
    }
}

export function LoadUtilManager() {
    new UtilManager();
}
