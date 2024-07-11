import { canvas } from './ScreenConstant.js';
import { ServiceLocator } from './ServiceLocator.js';

export interface IServiceUtilManager {
    GetRandomObjectFromMap<T>(parameters: { theMap: Map<unknown, unknown> }): T | undefined;
    GetSpeedItTakesToCoverHalfTheScreenWidth: (parameters: { framesItTakes: number }) => number;
    DrawCenterOfCanvas(ctx: CanvasRenderingContext2D): void;
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

    DrawCenterOfCanvas(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
    }
}

export function LoadUtilManager() {
    new UtilManager();
}
