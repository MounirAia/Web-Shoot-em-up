import { IServiceImageLoader } from '../../ImageLoader.js';
import { CANVA_SCALEX, CANVA_SCALEY, canvas } from '../../ScreenConstant.js';
import { ServiceLocator } from '../../ServiceLocator.js';
import { GetSpriteStaticInformation } from '../../SpriteStaticInformation/SpriteStaticInformationManager.js';
import { IServiceCollideManager } from '../CollideManager.js';
import { IGeneratedSprite, IServiceGeneratedSpritesManager } from '../GeneratedSpriteManager.js';
import { IServicePlayer } from '../Player.js';
import { Sprite } from '../Sprite.js';
import { ISpriteWithDamage, ISpriteWithSpeed, ISpriteWithTarget } from '../SpriteAttributes.js';
import { CollideScenario, CreateHitboxesWithInfoFile, ISpriteWithHitboxes, RectangleHitbox } from '../SpriteHitbox.js';

const InfoEnemyBullet = GetSpriteStaticInformation({ sprite: 'SmallDiamondEnemy' }).spriteInfo.Bullet;

export class EnemyBullet
    extends Sprite
    implements ISpriteWithTarget, ISpriteWithDamage, ISpriteWithSpeed, ISpriteWithHitboxes, IGeneratedSprite
{
    Generator: 'player' | 'enemy';
    Category: 'projectile' | 'nonProjectile';
    BaseSpeed: number;
    Damage: number;

    CurrentHitbox: RectangleHitbox[];
    Collide: Map<CollideScenario, (param?: unknown) => void>;

    XSpeed: number;
    YSpeed: number;

    constructor(x: number, y: number) {
        super(
            ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').GetImage('images/Enemies/EnemyBullet.png'),
            InfoEnemyBullet.Meta.TileDimensions.Width,
            InfoEnemyBullet.Meta.TileDimensions.Height,
            x + InfoEnemyBullet.OffsetOnCannon.X,
            y + InfoEnemyBullet.OffsetOnCannon.Y,
            InfoEnemyBullet.Meta.SpriteShiftPosition.X,
            InfoEnemyBullet.Meta.SpriteShiftPosition.Y,
            CANVA_SCALEX,
            CANVA_SCALEY,
            InfoEnemyBullet.Meta.RealDimension.Width,
            InfoEnemyBullet.Meta.RealDimension.Height,
        );
        this.Generator = 'enemy';
        this.Category = 'projectile';
        this.BaseSpeed = 3;
        this.Damage = 3;
        this.XSpeed = Math.cos(this.TargetAngle) * this.BaseSpeed;
        this.YSpeed = Math.sin(this.TargetAngle) * this.BaseSpeed;

        /* Animation */
        const { Idle, Destroyed } = InfoEnemyBullet.Animations;
        this.AnimationsController.AddAnimation({
            animation: 'idle',
            frames: Idle.Frames,
            framesLengthInTime: Idle.FrameLengthInTime,
        });
        this.AnimationsController.AddAnimation({
            animation: 'destroyed',
            frames: Destroyed.Frames,
            framesLengthInTime: Destroyed.FrameLengthInTime,
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

        /* Hitbox */
        this.CurrentHitbox = CreateHitboxesWithInfoFile(this.X, this.Y, InfoEnemyBullet.Hitbox);

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

    public Draw(ctx: CanvasRenderingContext2D) {
        super.Draw(ctx);
    }

    get TargetAngle(): number {
        const { x: playerX, y: playerY } = ServiceLocator.GetService<IServicePlayer>('Player').Coordinate();
        const distX = this.X - playerX;
        const distY = this.Y - playerY;
        return Math.atan2(distY, distX);
    }
}
