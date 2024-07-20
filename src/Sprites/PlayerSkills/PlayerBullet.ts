import { IServiceImageLoader } from '../../ImageLoader.js';
import { CANVA_SCALEX, CANVA_SCALEY, canvas } from '../../ScreenConstant.js';
import { ServiceLocator } from '../../ServiceLocator.js';
import { IServiceCollideManager } from '../CollideManager.js';
import { IGeneratedSprite, IServiceGeneratedSpritesManager } from '../GeneratedSpriteManager.js';
import { PlayerProjectileDamageEffectController } from '../PlayerProjectileDamageEffectsController.js';
import { Sprite } from '../Sprite.js';
import { ISpriteWithDamage, ISpriteWithDamageEffects, ISpriteWithSpeed } from '../SpriteAttributes.js';
import { CollideScenario, CreateHitboxesWithInfoFile, ISpriteWithHitboxes, RectangleHitbox } from '../SpriteHitbox.js';
import { IServicePlayer } from '../Player.js';
import { IServiceUtilManager } from '../../UtilManager.js';
import { GetSpriteStaticInformation } from '../../SpriteStaticInformation/SpriteStaticInformationManager.js';

const PlayerBulletDamageStats = GetSpriteStaticInformation({ sprite: 'PlayerBullet' }).stats;
const InfoPlayerBulletSprite = GetSpriteStaticInformation({ sprite: 'PlayerBullet' }).spriteInfo;

export class RegularPlayerBullet
    extends Sprite
    implements ISpriteWithDamage, ISpriteWithSpeed, ISpriteWithHitboxes, IGeneratedSprite, ISpriteWithDamageEffects
{
    Generator: 'player' | 'enemy';
    Category: 'projectile' | 'nonProjectile';
    BaseSpeed: number;
    Damage: number;
    DamageEffectsController: PlayerProjectileDamageEffectController;

    CurrentHitbox: RectangleHitbox[];
    Collide: Map<CollideScenario, (param?: unknown) => void>;

    constructor(x: number, y: number) {
        super(
            ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').GetImage(
                'images/Player/RegularPlayerBullet.png',
            ),
            InfoPlayerBulletSprite.Meta.TileDimensions.Width,
            InfoPlayerBulletSprite.Meta.TileDimensions.Height,
            x + InfoPlayerBulletSprite.Meta.SpriteShiftPositionOnPlayer.X,
            y + InfoPlayerBulletSprite.Meta.SpriteShiftPositionOnPlayer.Y,
            InfoPlayerBulletSprite.Meta.SpriteShiftPosition.X,
            InfoPlayerBulletSprite.Meta.SpriteShiftPosition.Y,
            CANVA_SCALEX,
            CANVA_SCALEY,
            InfoPlayerBulletSprite.Meta.RealDimension.Width,
            InfoPlayerBulletSprite.Meta.RealDimension.Height,
        );

        const damageInfo = PlayerBulletDamageStats[ServiceLocator.GetService<IServicePlayer>('Player').NumberOfBoosts];

        this.Generator = 'player';
        this.Category = 'projectile';
        this.BaseSpeed = ServiceLocator.GetService<IServiceUtilManager>(
            'UtilManager',
        ).GetSpeedItTakesToCoverHalfTheScreenWidth({
            framesItTakes: damageInfo['Projectile Speed'],
        });

        this.Damage = damageInfo['Player Bullet Damage'];
        this.DamageEffectsController = new PlayerProjectileDamageEffectController({ baseDamage: this.Damage });

        this.CurrentHitbox = CreateHitboxesWithInfoFile(this.X, this.Y, [...InfoPlayerBulletSprite.Hitbox]);

        this.AnimationsController.AddAnimation({
            animation: 'idle',
            frames: InfoPlayerBulletSprite.Animations.Idle.Frames,
            framesLengthInTime: InfoPlayerBulletSprite.Animations.Idle.FrameLengthInTime,
        });

        this.AnimationsController.AddAnimation({
            animation: 'destroyed',
            frames: InfoPlayerBulletSprite.Animations.Destroyed.Frames,
            framesLengthInTime: InfoPlayerBulletSprite.Animations.Destroyed.FrameLengthInTime,
            afterPlayingAnimation: () => {
                ServiceLocator.GetService<IServiceGeneratedSpritesManager>('GeneratedSpritesManager').RemoveSprite(
                    this,
                );
            },
        });
        this.AnimationsController.PlayAnimation({ animation: 'idle' });

        this.Collide = new Map();
        this.Collide.set('WithEnemy', () => {
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

        this.X += this.BaseSpeed;
        this.UpdateHitboxes(dt);

        if (this.X > canvas.width || this.X < 0 || this.Y > canvas.height || this.Y < 0) {
            ServiceLocator.GetService<IServiceGeneratedSpritesManager>('GeneratedSpritesManager').RemoveSprite(this);
        }

        if (this.AnimationsController.CurrentAnimationName !== 'destroyed') {
            const collideManager = ServiceLocator.GetService<IServiceCollideManager>('CollideManager');
            collideManager.HandleWhenPlayerProjectileCollideWithEnemies(this);
        }
    }

    public AttackSpeed() {
        return PlayerBulletDamageStats[ServiceLocator.GetService<IServicePlayer>('Player').NumberOfBoosts][
            'Player Bullet Attack Speed'
        ];
    }
}
