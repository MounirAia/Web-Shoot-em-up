import { IServiceImageLoader } from '../../../ImageLoader.js';
import { CANVA_SCALEX, CANVA_SCALEY } from '../../../ScreenConstant.js';
import { ServiceLocator } from '../../../ServiceLocator.js';
import { IServiceWaveManager } from '../../../WaveManager/WaveManager.js';
import { RectangleHitbox, CreateHitboxes } from '../../InterfaceBehaviour/ISpriteWithHitboxes.js';
import { Sprite } from '../../Sprite.js';
import { IEnemy } from '../IEnemy.js';

export class TrapezeEnemy extends Sprite implements IEnemy {
    Hitboxes: RectangleHitbox[];
    constructor(x: number = 0, y: number = 0) {
        const imgTrapeze = ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').GetImage(
            'images/Enemies/Trapeze/Trapeze.png',
        );
        const frameWidth = 32;
        const frameHeight = 32;
        const scaleX = CANVA_SCALEX;
        const scaleY = CANVA_SCALEY;
        super(imgTrapeze, frameWidth, frameHeight, x, y, 6 * CANVA_SCALEX, 7 * CANVA_SCALEY, scaleX, scaleY);

        this.Hitboxes = CreateHitboxes(this.X, this.Y, [
            {
                offsetX: 5,
                offsetY: 6 * CANVA_SCALEY,
                width: 10 * CANVA_SCALEX,
                height: 7 * CANVA_SCALEY,
            },
            {
                offsetX: 15 * CANVA_SCALEX,
                offsetY: 7 * CANVA_SCALEY,
                width: 3 * CANVA_SCALEX,
                height: 6 * CANVA_SCALEY,
            },
            {
                offsetX: 0 * CANVA_SCALEX,
                offsetY: 11,
                width: 1 * CANVA_SCALEX,
                height: 2 * CANVA_SCALEY,
            },
            {
                offsetX: 1 * CANVA_SCALEX,
                offsetY: 10 * CANVA_SCALEY,
                width: 1 * CANVA_SCALEX,
                height: 3 * CANVA_SCALEY,
            },
            {
                offsetX: 2 * CANVA_SCALEX,
                offsetY: 9 * CANVA_SCALEY,
                width: 1 * CANVA_SCALEX,
                height: 4 * CANVA_SCALEY,
            },
            {
                offsetX: 3 * CANVA_SCALEX,
                offsetY: 8 * CANVA_SCALEY,
                width: 1 * CANVA_SCALEX,
                height: 5 * CANVA_SCALEY,
            },
            {
                offsetX: 4 * CANVA_SCALEX,
                offsetY: 7 * CANVA_SCALEY,
                width: 1 * CANVA_SCALEX,
                height: 6 * CANVA_SCALEY,
            },
            {
                offsetX: 6 * CANVA_SCALEX,
                offsetY: 0 * CANVA_SCALEY,
                width: 5 * CANVA_SCALEX,
                height: 6 * CANVA_SCALEY,
            },
        ]);

        this.AddAnimation('idle', [0], 1);
        this.AddAnimation('damaged', [1], 1);
        this.AddAnimation('shooting', [2, 3, 4, 5, 6], 0.1);
        this.AddAnimation('destroyed', [7, 8, 9, 10, 11], 0.05);
        this.PlayAnimation('idle', true);
    }

    UpdateHitboxes(dt: number): void {
        this.Hitboxes.forEach((hitbox) => {
            hitbox.SpriteX = this.X;
            hitbox.SpriteY = this.Y;
        });
    }

    public Update(dt: number): void {
        super.Update(dt);
        this.UpdateHitboxes(dt);
        this.X -= 50 * dt;

        if (this.X < -this.Width || (this.CurrentAnimationName === 'destroyed' && this.IsAnimationFinished)) {
            ServiceLocator.GetService<IServiceWaveManager>('WaveManager').RemoveEnemy(this);
        }
    }
}
