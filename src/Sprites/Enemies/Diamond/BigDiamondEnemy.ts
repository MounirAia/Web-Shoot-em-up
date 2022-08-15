import { IServiceImageLoader } from '../../../ImageLoader.js';
import { CANVA_SCALEX, CANVA_SCALEY } from '../../../ScreenConstant.js';
import { ServiceLocator } from '../../../ServiceLocator.js';
import { IServiceWaveManager } from '../../../WaveManager/WaveManager.js';
import { IServiceBulletManager } from '../../Bullets/BulletManager.js';
import { EnemyBullet } from '../../Bullets/EnemyBullet.js';
import { IBullet } from '../../Bullets/IBullet.js';
import { CollideScenario, IServiceCollideManager } from '../../CollideManager.js';
import { IMovableSprite } from '../../InterfaceBehaviour/IMovableSprite.js';
import { RectangleHitbox, CreateHitboxes } from '../../InterfaceBehaviour/ISpriteWithHitboxes.js';
import { ISpriteWithBaseAttackSpeed } from '../../InterfaceBehaviour/ISpriteWithStats.js';
import { IServicePlayer } from '../../Player.js';
import { Sprite } from '../../Sprite.js';
import { IEnemy } from '../IEnemy.js';

export class BigDiamondEnemy extends Sprite implements IEnemy, IMovableSprite, ISpriteWithBaseAttackSpeed {
    Hitboxes: RectangleHitbox[];
    Collide: Map<CollideScenario, (param?: unknown) => void>;
    readonly HorizontalShootingPosition: number;
    BaseSpeed: number;
    BaseAttackSpeed: number;

    constructor(x: number = 0, y: number = 0, horizontalShootingPosition: number) {
        const imgDiamond = ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').GetImage(
            'images/Enemies/Diamond/BigDiamond/BigDiamond.png',
        );
        const frameWidth = 32;
        const frameHeight = 32;
        const scaleX = CANVA_SCALEX;
        const scaleY = CANVA_SCALEY;
        super(imgDiamond, frameWidth, frameHeight, x, y, 8 * CANVA_SCALEX, 9 * CANVA_SCALEY, scaleX, scaleY);

        this.HorizontalShootingPosition = horizontalShootingPosition;
        this.BaseSpeed = 350;
        this.BaseAttackSpeed = 2;

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
        this.AddAnimation('shooting', [1, 2, 3], 3 / this.AttackSpeed, undefined, () => {
            const bullet = new EnemyBullet(this.X - 2 * CANVA_SCALEX, this.Y + 6 * CANVA_SCALEY);
            ServiceLocator.GetService<IServiceBulletManager>('BulletManager').AddBullet(bullet);
        });
        this.AddAnimation('destroyed', [5, 6, 7, 8, 9, 10, 11], 0.05, () => {
            this.removeEnemyFromGameFlow();
        });

        this.Collide = new Map();
        this.Collide.set('WithBullet', (bullet: unknown) => {
            bullet = bullet as IBullet;

            this.PlayAnimation('destroyed');

            ServiceLocator.GetService<IServicePlayer>('Player').MakeTransactionOnWallet(this.MoneyValue);
        });

        this.Collide.set('WithPlayer', () => {
            this.PlayAnimation('destroyed');

            ServiceLocator.GetService<IServicePlayer>('Player').MakeTransactionOnWallet(this.MoneyValue);
        });

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

        if (this.X >= this.HorizontalShootingPosition) {
            this.X -= this.BaseSpeed * dt;
            return;
        }

        if (this.X < -this.Width || (this.CurrentAnimationName === 'destroyed' && this.IsAnimationFinished)) {
            ServiceLocator.GetService<IServiceWaveManager>('WaveManager').RemoveEnemy(this);
            return;
        }

        // Shooting flow of the enemy
        if (this.CurrentAnimationName !== 'destroyed') {
            this.PlayAnimation('shooting', true);

            ServiceLocator.GetService<IServiceCollideManager>('CollideManager').HandleWhenEnemyCollideWithPlayer(this);
        }
    }

    get AttackSpeed(): number {
        return this.BaseAttackSpeed;
    }

    private removeEnemyFromGameFlow(): void {
        // make the enemy uncollidable
        this.Hitboxes = [];
    }

    get MoneyValue(): number {
        return 5;
    }
}
