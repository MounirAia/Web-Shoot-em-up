import { IServiceImageLoader } from '../../ImageLoader.js';
import { Keyboard } from '../../Keyboard.js';
import { CANVA_SCALEX, CANVA_SCALEY } from '../../ScreenConstant.js';
import { ServiceLocator } from '../../ServiceLocator.js';
import { IServiceWaveManager } from '../../WaveManager/WaveManager.js';
import { Sprite } from '../Sprite.js';
import { IEnemy } from './IEnemy.js';

export class TriangleEnemy extends Sprite implements IEnemy {
    constructor(x: number = 0, y: number = 0) {
        const imgTriangle = ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').GetImage(
            'images/Enemies/BigDiamond/BigDiamondAnimation.png',
        );
        const frameWidth = 32;
        const frameHeight = 32;
        const scaleX = CANVA_SCALEX;
        const scaleY = CANVA_SCALEY;
        super(imgTriangle, frameWidth, frameHeight, x, y, scaleX, scaleY);
        this.AddAnimation('idle', [0]);
        this.AddAnimation('shooting', [1, 2, 3]);
        this.AddAnimation('damaged', [4]);
        this.AddAnimation('destroyed', [5, 6, 7, 8, 9, 10, 11]);
        this.PlayAnimation('destroyed', 0.1, true);
    }

    public Update(dt: number): void {
        super.Update(dt);
        if (this.X < -this.Width) {
            ServiceLocator.GetService<IServiceWaveManager>('WaveManager').RemoveEnemy(this);
        }

        if (Keyboard.d.IsPressed) {
            this.PlayAnimation('destroyed', 0.1, false);
        }

        if (Keyboard.f.IsPressed) {
            this.PlayAnimation('damaged', 0.1, false);
        }

        if (Keyboard.g.IsPressed) {
            this.PlayAnimation('idle', 0.1, false);
        }
    }
}
