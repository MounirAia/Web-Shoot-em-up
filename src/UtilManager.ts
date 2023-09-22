import { canvas } from './ScreenConstant.js';
import { ServiceLocator } from './ServiceLocator.js';

export interface IServiceUtilManager {
    GetRandomObjectFromMap<T>(parameters: { theMap: Map<unknown, unknown> }): T | undefined;
    GetSpeedItTakesToCoverHalfTheScreenWidth: (parameters: { framesItTakes: number }) => number;
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

    // Used to compute speed of any projectile and make it adapatable to the screen dimension
    GetSpeedItTakesToCoverHalfTheScreenWidth(parameters: { framesItTakes: number }) {
        const { framesItTakes } = parameters;
        if (framesItTakes > 0) {
            return canvas.width / 2 / framesItTakes;
        }
        return 0;
    }
}

export function LoadUtilManager() {
    new UtilManager();
}
