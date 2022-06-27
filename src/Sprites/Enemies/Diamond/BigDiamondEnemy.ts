import { IServiceImageLoader } from '../../../ImageLoader.js';
import { CANVA_SCALEX, CANVA_SCALEY } from '../../../ScreenConstant.js';
import { ServiceLocator } from '../../../ServiceLocator.js';
import { IServiceWaveManager } from '../../../WaveManager/WaveManager.js';
import { ISpriteWithHitboxes, RectangleHitbox, CreateHitboxes } from '../../InterfaceBehaviour/ISpriteWithHitboxes.js';
import { Sprite } from '../../Sprite.js';
import { IEnemy } from '../IEnemy.js';

export class BigDiamondEnemy extends Sprite implements IEnemy {
    Hitboxes: RectangleHitbox[];
    constructor(x: number = 0, y: number = 0) {
        const imgTriangle = ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').GetImage(
            'images/Enemies/Diamond/BigDiamond/BigDiamond.png',
        );
        const frameWidth = 32;
        const frameHeight = 32;
        const scaleX = CANVA_SCALEX;
        const scaleY = CANVA_SCALEY;
        super(imgTriangle, frameWidth, frameHeight, x, y, 8 * CANVA_SCALEX, 9 * CANVA_SCALEY, scaleX, scaleY);

        this.Hitboxes = CreateHitboxes(this.X, this.Y, [
            {
                offsetX: 0,
                offsetY: 4 * CANVA_SCALEY,
                width: 5 * CANVA_SCALEX,
                height: 6 * CANVA_SCALEY,
            },
            {
                offsetX: 5 * CANVA_SCALEX,
                offsetY: 2 * CANVA_SCALEY,
                width: 1 * CANVA_SCALEX,
                height: 10 * CANVA_SCALEY,
            },
            {
                offsetX: 6 * CANVA_SCALEX,
                offsetY: 0,
                width: 4 * CANVA_SCALEX,
                height: 14 * CANVA_SCALEY,
            },
            {
                offsetX: 10 * CANVA_SCALEX,
                offsetY: 2 * CANVA_SCALEY,
                width: 1 * CANVA_SCALEX,
                height: 10 * CANVA_SCALEY,
            },
            {
                offsetX: 11 * CANVA_SCALEX,
                offsetY: 4 * CANVA_SCALEY,
                width: 1 * CANVA_SCALEX,
                height: 6 * CANVA_SCALEY,
            },
        ]);

        this.AddAnimation('idle', [0], 1);
        this.AddAnimation('damaged', [4], 1);
        this.AddAnimation('shooting', [1, 2, 3], 0.1);
        this.AddAnimation('destroyed', [5, 6, 7, 8, 9, 10, 11], 0.1);
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

        if (this.X < -this.Width) {
            ServiceLocator.GetService<IServiceWaveManager>('WaveManager').RemoveEnemy(this);
        }
    }
}
