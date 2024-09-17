import { IServiceEventManager } from '../../EventManager.js';
import { IServiceImageLoader } from '../../ImageLoader.js';
import { CANVA_SCALEX, CANVA_SCALEY, canvas } from '../../ScreenConstant.js';
import { ServiceLocator } from '../../ServiceLocator.js';
import { GetSpriteStaticInformation } from '../../SpriteStaticInformation/SpriteStaticInformationManager.js';
import { IServiceUtilManager } from '../../UtilManager.js';
import { IServiceWaveManager } from '../../WaveManager/WaveManager.js';
import { IServiceCollideManager } from '../CollideManager.js';
import { IGeneratedSprite, IServiceGeneratedSpritesManager } from '../GeneratedSpriteManager.js';
import { IServicePlayer } from '../Player.js';
import { Sprite } from '../Sprite.js';
import { ISpriteWithDamage, ISpriteWithSpeed, ISpriteWithTarget } from '../SpriteAttributes.js';
import { CollideScenario, CreateHitboxesWithInfoFile, ISpriteWithHitboxes, RectangleHitbox } from '../SpriteHitbox.js';

const InfoEnemyBullet = GetSpriteStaticInformation({ sprite: 'MediumDiamondEnemy' }).spriteInfo.Bullet;
const scale = 2;
export class MediumEnemyBullet
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

    private angleOffsetInRadian: number;

    constructor(parameters: { x: number; y: number; angleOffsetInRadian?: number }) {
        const { x, y, angleOffsetInRadian = 0 } = parameters;
        super(
            ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').GetImage('images/Enemies/EnemyBullet.png'),
            InfoEnemyBullet.Meta.TileDimensions.Width,
            InfoEnemyBullet.Meta.TileDimensions.Height,
            x + InfoEnemyBullet.OffsetOnCannon.X,
            y + InfoEnemyBullet.OffsetOnCannon.Y,
            InfoEnemyBullet.Meta.SpriteShiftPosition.X,
            InfoEnemyBullet.Meta.SpriteShiftPosition.Y,
            CANVA_SCALEX * scale,
            CANVA_SCALEY * scale,
            InfoEnemyBullet.Meta.RealDimension.Width,
            InfoEnemyBullet.Meta.RealDimension.Height,
        );

        const roundTier = ServiceLocator.GetService<IServiceWaveManager>('WaveManager').GetRoundTier();
        const BulletStats = GetSpriteStaticInformation({ sprite: 'MediumDiamondEnemy' }).stats[roundTier - 1];

        this.Generator = 'enemy';
        this.Category = 'projectile';
        this.BaseSpeed = ServiceLocator.GetService<IServiceUtilManager>(
            'UtilManager',
        ).GetSpeedItTakesToCoverHalfTheScreenWidth({
            framesItTakes: BulletStats['Bullet Speed (Number Frames to Cover HalfScreen Distance)'],
        });
        const playerMaxHealth = ServiceLocator.GetService<IServicePlayer>('Player').MaxHealth;
        this.Damage = playerMaxHealth / BulletStats['Number of Shots Needed To Destroy Player'];

        this.angleOffsetInRadian = angleOffsetInRadian;
        this.XSpeed = Math.cos(this.TargetAngle) * this.BaseSpeed;
        this.YSpeed = Math.sin(this.TargetAngle) * this.BaseSpeed;

        /* Event */
        const onPlayerShockwave = () => {
            this.AnimationsController.PlayAnimation({ animation: 'destroyed' });
        };

        ServiceLocator.GetService<IServiceEventManager>('EventManager').Subscribe(
            'player shockwave',
            onPlayerShockwave,
        );

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
                ServiceLocator.GetService<IServiceEventManager>('EventManager').Unsubscribe(
                    'player shockwave',
                    onPlayerShockwave,
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
        return Math.atan2(distY, distX) + this.angleOffsetInRadian;
    }
}
