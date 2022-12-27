import { IServiceImageLoader } from '../ImageLoader.js';
import { canvas } from '../ScreenConstant.js';
import { ServiceLocator } from '../ServiceLocator.js';
import { Map } from './Map.js';

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
    const horizontalSpeed = 1;
    const x = 0;
    const y = 0;
    const scaleX = 4;
    const scaleY = 4;
    galaxyMap = new Galaxy(horizontalSpeed, x, y, scaleX, scaleY);
}

export function UpdateGalaxyMap(dt: number) {
    galaxyMap.Update(dt);
}

export function DrawGalaxyMap(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.fillStyle = '#CCCCCC';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
}
