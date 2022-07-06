import { IServiceImageLoader } from '../../../ImageLoader.js';
import { CANVA_SCALEX, CANVA_SCALEY } from '../../../ScreenConstant.js';
import { ServiceLocator } from '../../../ServiceLocator.js';
import { IServiceWaveManager } from '../../../WaveManager/WaveManager.js';
import { RectangleHitbox, CreateHitboxes } from '../../InterfaceBehaviour/ISpriteWithHitboxes.js';
import { Sprite } from '../../Sprite.js';
import { IEnemy } from '../IEnemy.js';

export class RectangleEnemy extends Sprite implements IEnemy {
    Hitboxes: RectangleHitbox[];
    readonly HorizontalShootingPosition: number;
    constructor(x: number = 0, y: number = 0, horizontalShootingPosition: number) {
        const imgRectangle = ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').GetImage(
            'images/Enemies/Rectangle/Rectangle.png',
        );
        const frameWidth = 32;
        const frameHeight = 32;
        const scaleX = CANVA_SCALEX;
        const scaleY = CANVA_SCALEY;
        super(imgRectangle, frameWidth, frameHeight, x, y, 7 * CANVA_SCALEX, 11 * CANVA_SCALEY, scaleX, scaleY);
        this.HorizontalShootingPosition = horizontalShootingPosition;
        this.Hitboxes = CreateHitboxes(this.X, this.Y, [
            {
                offsetX: 0,
                offsetY: 4 * CANVA_SCALEY,
                width: 4 * CANVA_SCALEX,
                height: 4 * CANVA_SCALEY,
            },
            {
                offsetX: 4 * CANVA_SCALEX,
                offsetY: 0 * CANVA_SCALEY,
                width: 9 * CANVA_SCALEX,
                height: 10 * CANVA_SCALEY,
            },
        ]);

        this.AddAnimation('idle', [0], 1);
        this.AddAnimation('damaged', [1], 1);
        this.AddAnimation('shooting', [2, 3, 4, 5, 6], 0.1);
        this.AddAnimation('destroyed', [7, 8, 9, 10, 11, 12], 0.05);
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
