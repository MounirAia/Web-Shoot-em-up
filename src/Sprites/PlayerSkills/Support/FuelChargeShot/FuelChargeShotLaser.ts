import { IServiceImageLoader } from '../../../../ImageLoader.js';
import { CANVA_SCALEX, CANVA_SCALEY, canvas } from '../../../../ScreenConstant.js';
import { ServiceLocator } from '../../../../ServiceLocator.js';
import InfoFuelChargeShot from '../../../../StatsJSON/SpriteInfo/Skills/infoFuelChargeShot.js';
import { IServiceCollideManager } from '../../../CollideManager.js';
import { IGeneratedSprite, IServiceGeneratedSpritesManager } from '../../../GeneratedSpriteManager.js';
import { Sprite } from '../../../Sprite.js';
import { DamageEffectOptions, ISpriteWithDamage, ISpriteWithSpeed } from '../../../SpriteAttributes.js';
import { CollideScenario, CreateHitboxesWithInfoFile, RectangleHitbox } from '../../../SpriteHitbox.js';

export class FuelChargeShotLaserLevel1 extends Sprite implements ISpriteWithSpeed, IGeneratedSprite, ISpriteWithDamage {
    BaseSpeed: number;
    CurrentHitbox: RectangleHitbox[];
    Collide: Map<CollideScenario, (param?: unknown) => void>;
    Generator: 'player' | 'enemy';
    Category: 'projectile' | 'nonProjectile';
    Damage: number;
    PrimaryEffect: DamageEffectOptions;
    SecondaryEffect: DamageEffectOptions;
    PrimaryEffectStat: number;
    SecondaryEffectStat: number;

    constructor(parameters: { X: number; Y: number }) {
        const { X, Y } = parameters;
        super(
            ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').GetImage(
                'images/Skills/FuelChargeShot/LaserLevel1.png',
            ),
            InfoFuelChargeShot.Level1.Laser.Meta.TileDimensions.Width,
            InfoFuelChargeShot.Level1.Laser.Meta.TileDimensions.Height,
            X,
            Y,
            InfoFuelChargeShot.Level1.Laser.Meta.SpriteShiftPosition.X,
            InfoFuelChargeShot.Level1.Laser.Meta.SpriteShiftPosition.Y,
            CANVA_SCALEX,
            CANVA_SCALEY,
            InfoFuelChargeShot.Level1.Laser.Meta.RealDimension.Width,
            InfoFuelChargeShot.Level1.Laser.Meta.RealDimension.Height,
        );

        this.BaseSpeed = 10;

        this.Generator = 'player';
        this.Category = 'projectile';

        this.Damage = 1;
        this.PrimaryEffect = '';
        this.PrimaryEffectStat = 0;
        this.SecondaryEffect = '';
        this.SecondaryEffectStat = 0;

        this.CurrentHitbox = CreateHitboxesWithInfoFile(this.X, this.Y, [...InfoFuelChargeShot.Level1.Laser.Hitbox]);

        const { Idle, Destroyed } = InfoFuelChargeShot.Level1.Laser.Animations;
        this.AnimationsController.AddAnimation({
            animation: 'idle',
            frames: Idle.Frames,
            framesLengthInTime: Idle.FrameLengthInTime,
        });

        this.AnimationsController.AddAnimation({
            animation: 'destroyed',
            frames: Destroyed.Frames,
            framesLengthInTime: Destroyed.FrameLengthInTime,
            afterPlayingAnimation: () => {
                ServiceLocator.GetService<IServiceGeneratedSpritesManager>('GeneratedSpritesManager').RemoveSprite(
                    this,
                );
            },
        });

        this.Collide = new Map();
        this.Collide.set('WithEnemy', () => {
            this.AnimationsController.PlayAnimation({ animation: 'destroyed' });
        });

        this.AnimationsController.PlayAnimation({ animation: 'idle', loop: true });
    }

    UpdateHitboxes(dt: number) {
        this.CurrentHitbox.forEach((hitbox) => {
            hitbox.SpriteX = this.X;
            hitbox.SpriteY = this.Y;
        });
    }

    Update(dt: number) {
        super.Update(dt);
        this.X += this.BaseSpeed;

        if (this.AnimationsController.CurrentAnimationName !== 'destroyed') {
            ServiceLocator.GetService<IServiceCollideManager>(
                'CollideManager',
            ).HandleWhenPlayerProjectileCollideWithEnemies(this);
        }

        const { width: canvasWidth, height: canvasHeight } = canvas;
        if (this.X < 0 || this.X > canvasWidth || this.Y < 0 || this.Y > canvasHeight) {
            ServiceLocator.GetService<IServiceGeneratedSpritesManager>('GeneratedSpritesManager').RemoveSprite(this);
        }

        this.UpdateHitboxes(dt);
    }
}
