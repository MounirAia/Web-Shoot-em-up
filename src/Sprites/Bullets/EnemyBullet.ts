import { IServiceImageLoader } from '../../ImageLoader.js';
import { CANVA_SCALEX, CANVA_SCALEY, canvas } from '../../ScreenConstant.js';
import { ServiceLocator } from '../../ServiceLocator.js';
import { IServiceCollideManager } from '../CollideManager.js';
import { IGeneratedSprite, IServiceGeneratedSpritesManager } from '../GeneratedSpriteManager.js';
import { IServicePlayer } from '../Player.js';
import { Sprite } from '../Sprite.js';
import { DamageEffectOptions, ISpriteWithDamage, ISpriteWithSpeed, ISpriteWithTarget } from '../SpriteAttributes.js';
import { CollideScenario, CreateHitboxes, ISpriteWithHitboxes, RectangleHitbox } from '../SpriteHitbox.js';

export class EnemyBullet
    extends Sprite
    implements ISpriteWithTarget, ISpriteWithDamage, ISpriteWithSpeed, ISpriteWithHitboxes, IGeneratedSprite
{
    Generator: 'player' | 'enemy';
    Category: 'projectile' | 'nonProjectile';
    BaseSpeed: number;
    Damage: number;
    PrimaryEffect: DamageEffectOptions;
    SecondaryEffect: DamageEffectOptions;
    PrimaryEffectStat: number;
    SecondaryEffectStat: number;

    CurrentHitbox: RectangleHitbox[];
    Collide: Map<CollideScenario, (param?: unknown) => void>;

    XSpeed: number;
    YSpeed: number;

    constructor(x: number, y: number) {
        super(
            ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').GetImage('images/Enemies/EnemiesBullet.png'),
            8,
            8,
            x,
            y,
            -3 * CANVA_SCALEX,
            -3 * CANVA_SCALEY,
            CANVA_SCALEX,
            CANVA_SCALEY,
        );
        this.Generator = 'enemy';
        this.Category = 'projectile';
        this.AnimationsController.AddAnimation({ animation: 'idle', frames: [0], framesLengthInTime: 1 });
        this.AnimationsController.AddAnimation({
            animation: 'destroyed',
            frames: [0, 1, 2, 3, 4],
            framesLengthInTime: 0.03,
            beforePlayingAnimation: () => {
                this.CurrentHitbox = RectangleHitbox.NoHitbox;
            },
            afterPlayingAnimation: () => {
                ServiceLocator.GetService<IServiceGeneratedSpritesManager>('GeneratedSpritesManager').RemoveSprite(
                    this,
                );
            },
        });
        this.AnimationsController.PlayAnimation({ animation: 'idle' });

        this.BaseSpeed = 3;
        this.Damage = 3;
        this.PrimaryEffect = '';
        this.PrimaryEffectStat = 0;
        this.SecondaryEffect = '';
        this.SecondaryEffectStat = 0;

        this.XSpeed = Math.cos(this.TargetAngle) * this.BaseSpeed;
        this.YSpeed = Math.sin(this.TargetAngle) * this.BaseSpeed;

        this.CurrentHitbox = CreateHitboxes(this.X, this.Y, [
            {
                offsetX: 0,
                offsetY: 0,
                width: 2 * CANVA_SCALEX,
                height: 2 * CANVA_SCALEY,
            },
        ]);

        this.Collide = new Map();
        this.Collide.set('WithPlayer', () => {
            this.AnimationsController.PlayAnimation({ animation: 'destroyed' });
        });

        this.Collide.set('WithNonProjectile', () => {
            this.AnimationsController.PlayAnimation({ animation: 'destroyed' });
        });
    }

    UpdateHitboxes(dt: number) {
        this.CurrentHitbox.forEach((hitbox) => {
            hitbox.SpriteX = this.X;
            hitbox.SpriteY = this.Y;
        });
    }

    public Update(dt: number) {
        super.Update(dt);
        this.X -= this.XSpeed;
        this.Y -= this.YSpeed;
        this.UpdateHitboxes(dt);

        if (this.X > canvas.width || this.X < 0 || this.Y > canvas.height || this.Y < 0) {
            ServiceLocator.GetService<IServiceGeneratedSpritesManager>('GeneratedSpritesManager').RemoveSprite(this);
        }

        if (this.AnimationsController.CurrentAnimationName !== 'destroyed') {
            ServiceLocator.GetService<IServiceCollideManager>(
                'CollideManager',
            ).HandleWhenEnemyProjectileCollideWithPlayer(this);
        }
    }

    get TargetAngle(): number {
        const { x: playerX, y: playerY } = ServiceLocator.GetService<IServicePlayer>('Player').Coordinate();
        const distX = this.X - playerX;
        const distY = this.Y - playerY;
        return Math.atan2(distY, distX);
    }
}
