import { IServiceImageLoader } from '../ImageLoader.js';
import { ServiceLocator } from '../ServiceLocator.js';
import { Map } from './Map.js';

// Continue video
// Create scene manager

class Galaxy extends Map {
    constructor(horizontalSpeed: number, x?: number, y?: number, scaleX?: number, scaleY?: number) {
        const image = ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').GetImage('images/galaxy.png');

        super(horizontalSpeed, image, x, y, scaleX, scaleY);
    }

    Update(dt: number): void {
        if (this.x <= -this.background.width) {
            this.x = 0;
        }

        this.x -= this.HorizontalSpeed * dt;
    }

    Draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.scale(this.scaleX, this.scaleY);
        ctx.drawImage(this.background, this.x, this.y);
        ctx.drawImage(this.background, this.x + this.background.width, this.y);
        ctx.restore();
    }
}

let galaxyMap: Galaxy;

export function LoadGalaxyMap() {
    galaxyMap = new Galaxy(1, 0, 0, 4, 4);
}

export function UpdateGalaxyMap(dt: number) {
    galaxyMap.Update(dt);
}

export function DrawGalaxyMap(ctx: CanvasRenderingContext2D) {
    galaxyMap.Draw(ctx);
}
