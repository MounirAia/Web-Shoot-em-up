import { IServiceImageLoader } from '../../ImageLoader.js';
import { ServiceLocator } from '../../ServiceLocator.js';
import { IServiceWaveEnemies } from '../../WaveManager/WaveEnemies.js';
import { Sprite } from '../Sprite.js';
import { IEnemy } from './IEnemy.js';

export class TriangleEnemy extends Sprite implements IEnemy {
    constructor(x: number = 0, y: number = 0) {
        const imgTriangle =
            ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').GetImage('images/enemyred.png');
        const frameWidth = 24;
        const frameHeight = 24;
        const scaleX = 2;
        const scaleY = 2;
        super(imgTriangle, frameWidth, frameHeight, x, y, scaleX, scaleY);
        this.AddAnimation('idle', [0, 1, 2, 3, 4, 5]);
        this.PlayAnimation('idle', 0.1, true);
    }

    public Update(dt: number): void {
        super.Update(dt);
        this.X -= 200 * dt;

        if (this.X < -this.Width) {
            console.log(this.Width);
            ServiceLocator.GetService<IServiceWaveEnemies>('Wave').RemoveEnemy(this);
        }
    }
}

let triangleEnemy: TriangleEnemy;
export function LoadTriangleEnemy() {
    const x = 800;
    const y = 250;

    triangleEnemy = new TriangleEnemy(x, y);
}

export function UpdateTriangleEnemy(dt: number) {
    //triangleEnemy.Update(dt);
}

export function DrawTriangleEnemy(ctx: CanvasRenderingContext2D) {
    // triangleEnemy.Draw(ctx);
}
