import { IServiceEventManager } from '../../../EventManager.js';
import { IServiceImageLoader } from '../../../ImageLoader.js';
import { CANVA_SCALEX, CANVA_SCALEY } from '../../../ScreenConstant.js';
import { ServiceLocator } from '../../../ServiceLocator.js';
import { IServiceWaveManager } from '../../../WaveManager/WaveManager.js';
import { EnemyBullet } from '../../Bullets/EnemyBullet.js';
import { IServiceCollideManager } from '../../CollideManager.js';
import { IServiceGeneratedSpritesManager } from '../../GeneratedSpriteManager.js';
import { IServicePlayer } from '../../Player.js';
import { Sprite } from '../../Sprite.js';
import { ISpriteWithAttackSpeed, ISpriteWithSpeed } from '../../SpriteAttributes.js';
import { SpriteDamageResistancesController } from '../../SpriteDamageResistancesController.js';
import { CollideScenario, CreateHitboxes, RectangleHitbox } from '../../SpriteHitbox.js';
import { IEnemy } from '../IEnemy.js';

export class BigDiamondEnemy extends Sprite implements IEnemy, ISpriteWithSpeed, ISpriteWithAttackSpeed {
    private moneyValue: number;

    CurrentHitbox: RectangleHitbox[];
    Collide: Map<CollideScenario, (param?: unknown) => void>;
    readonly HorizontalShootingPosition: number;
    BaseSpeed: number;
    BaseAttackSpeed: number;

    DamageResistancesController: SpriteDamageResistancesController;

    constructor(x = 0, y = 0, horizontalShootingPosition: number) {
        const imgDiamond = ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').GetImage(
            'images/Enemies/Diamond/BigDiamond/BigDiamond.png',
        );
        const frameWidth = 32;
        const frameHeight = 32;
        const scaleX = CANVA_SCALEX;
        const scaleY = CANVA_SCALEY;
        super(imgDiamond, frameWidth, frameHeight, x, y, -8 * CANVA_SCALEX, -9 * CANVA_SCALEY, scaleX, scaleY);

        this.moneyValue = 5;

        this.HorizontalShootingPosition = horizontalShootingPosition;
        this.BaseSpeed = 350;
        this.BaseAttackSpeed = 2;

        this.DamageResistancesController = new SpriteDamageResistancesController();

        this.CurrentHitbox = CreateHitboxes(this.X, this.Y, [
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

        this.AnimationsController.AddAnimation({ animation: 'idle', frames: [0], framesLengthInTime: 1 });
        this.AnimationsController.AddAnimation({ animation: 'damaged', frames: [4], framesLengthInTime: 1 });
        this.AnimationsController.AddAnimation({
            animation: 'shooting',
            frames: [1, 2, 3],
            framesLengthInTime: 3 / this.AttackSpeed,
            afterPlayingAnimation: () => {
                const bullet = new EnemyBullet(this.X - 2 * CANVA_SCALEX, this.Y + 6 * CANVA_SCALEY);
                ServiceLocator.GetService<IServiceGeneratedSpritesManager>('GeneratedSpritesManager').AddSprite(bullet);
            },
        });
        this.AnimationsController.AddAnimation({
            animation: 'destroyed',
            frames: [5, 6, 7, 8, 9, 10, 11],
            framesLengthInTime: 0.05,
            beforePlayingAnimation: () => {
                this.removeEnemyFromGameFlow();
                ServiceLocator.GetService<IServiceEventManager>('EventManager').Notify('enemy destroyed', () => {
                    ServiceLocator.GetService<IServiceWaveManager>('WaveManager').SetLastEnemyDestroyed(this);
                });
                ServiceLocator.GetService<IServicePlayer>('Player').MakeTransactionOnWallet(this.MoneyValue);
            },
            afterPlayingAnimation: () => {
                ServiceLocator.GetService<IServiceWaveManager>('WaveManager').RemoveEnemy(this);
            },
        });

        this.Collide = new Map();
        this.Collide.set('WithProjectile', (projectileDamage: unknown) => {
            const damage = projectileDamage as number;

            this.StatesController.PlayState({ stateName: 'onHit' });
            this.AnimationsController.PlayAnimation({ animation: 'destroyed' });
        });

        this.Collide.set('WithPlayer', () => {
            this.AnimationsController.PlayAnimation({ animation: 'destroyed' });

            ServiceLocator.GetService<IServicePlayer>('Player').MakeTransactionOnWallet(this.MoneyValue);
        });

        this.AnimationsController.PlayAnimation({ animation: 'idle', loop: true });
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

        if (this.X >= this.HorizontalShootingPosition) {
            this.X -= this.BaseSpeed * dt;
            return;
        }

        if (this.X < -this.Width) {
            ServiceLocator.GetService<IServiceWaveManager>('WaveManager').RemoveEnemy(this);
            return;
        }

        // Shooting flow of the enemy
        if (this.AnimationsController.CurrentAnimationName !== 'destroyed') {
            this.AnimationsController.PlayAnimation({ animation: 'shooting', loop: true });

            ServiceLocator.GetService<IServiceCollideManager>('CollideManager').HandleWhenEnemyCollideWithPlayer(this);
        }
    }

    get AttackSpeed(): number {
        return this.BaseAttackSpeed;
    }

    private removeEnemyFromGameFlow(): void {
        // make the enemy uncollidable
        this.CurrentHitbox = [];
    }

    get MoneyValue(): number {
        return this.moneyValue;
    }

    set MoneyValue(value: number) {
        this.moneyValue = value;
    }
}
