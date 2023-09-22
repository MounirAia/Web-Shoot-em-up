import { IServiceImageLoader } from '../../../ImageLoader.js';
import { CANVA_SCALEX, CANVA_SCALEY } from '../../../ScreenConstant.js';
import { ServiceLocator } from '../../../ServiceLocator.js';
import { IServiceWaveManager } from '../../../WaveManager/WaveManager.js';
import { Sprite } from '../../Sprite.js';
import { CollideScenario, CreateHitboxes, RectangleHitbox } from '../../SpriteHitbox.js';
import { IEnemy } from '../IEnemy.js';

export class TriangleEnemy extends Sprite implements IEnemy {
    CurrentHitbox: RectangleHitbox[];
    readonly HorizontalShootingPosition: number;
    BaseSpeed: number;

    Collide: Map<CollideScenario, (param?: unknown) => void>;

    constructor(x = 0, y = 0, horizontalShootingPosition: number) {
        const imgTriangle = ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').GetImage(
            'images/Enemies/Triangle/Triangle.png',
        );
        const frameWidth = 16;
        const frameHeight = 16;
        const scaleX = CANVA_SCALEX;
        const scaleY = CANVA_SCALEY;
        super(imgTriangle, frameWidth, frameHeight, x, y, -2 * CANVA_SCALEX, -3 * CANVA_SCALEY, scaleX, scaleY);

        this.HorizontalShootingPosition = horizontalShootingPosition;
        this.BaseSpeed = 350;

        this.CurrentHitbox = CreateHitboxes(this.X, this.Y, [
            {
                offsetX: 0,
                offsetY: 1 * CANVA_SCALEY,
                width: 3 * CANVA_SCALEX,
                height: 6 * CANVA_SCALEY,
            },
            {
                offsetX: 4 * CANVA_SCALEX,
                offsetY: 1 * CANVA_SCALEY,
                width: 1 * CANVA_SCALEX,
                height: 6 * CANVA_SCALEY,
            },
            {
                offsetX: 4 * CANVA_SCALEX,
                offsetY: 0,
                width: 3 * CANVA_SCALEX,
                height: 8 * CANVA_SCALEY,
            },
        ]);
        this.Collide = new Map();
        this.AnimationsController.AddAnimation({ animation: 'idle', frames: [0], framesLengthInTime: 1 });
        this.AnimationsController.AddAnimation({ animation: 'damaged', frames: [1], framesLengthInTime: 1 });
        this.AnimationsController.AddAnimation({
            animation: 'destroyed',
            frames: [2, 3, 4, 5, 6],
            framesLengthInTime: 0.05,
        });
        this.AnimationsController.PlayAnimation({ animation: 'idle' });
    }

    UpdateHitboxes(dt: number): void {
        this.CurrentHitbox.forEach((hitbox) => {
            hitbox.SpriteX = this.X;
            hitbox.SpriteY = this.Y;
        });
    }

    public Update(dt: number): void {
        super.Update(dt);
        this.UpdateHitboxes(dt);
        if (this.X >= this.HorizontalShootingPosition) this.X -= this.BaseSpeed * dt;

        if (
            this.X < -this.Width ||
            (this.AnimationsController.CurrentAnimationName === 'destroyed' &&
                this.AnimationsController.IsAnimationFinished)
        ) {
            ServiceLocator.GetService<IServiceWaveManager>('WaveManager').RemoveEnemy(this);
        }
    }

    get MoneyValue(): number {
        return 1;
    }
}
