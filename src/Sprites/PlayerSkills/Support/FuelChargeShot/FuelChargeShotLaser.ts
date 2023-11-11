import { IServiceImageLoader } from '../../../../ImageLoader.js';
import { CANVA_SCALEX, CANVA_SCALEY, canvas } from '../../../../ScreenConstant.js';
import { ServiceLocator } from '../../../../ServiceLocator.js';
import InfoFuelChargeShot from '../../../../StatsJSON/SpriteInfo/Skills/infoFuelChargeShot.js';
import { IServiceCollideManager } from '../../../CollideManager.js';
import { IGeneratedSprite, IServiceGeneratedSpritesManager } from '../../../GeneratedSpriteManager.js';
import { PlayerProjectileDamageEffectController } from '../../../PlayerProjectileDamageEffectsController.js';
import { Sprite } from '../../../Sprite.js';
import { ISpriteWithDamage, ISpriteWithDamageEffects, ISpriteWithSpeed } from '../../../SpriteAttributes.js';
import { CollideScenario, CreateHitboxesWithInfoFile, RectangleHitbox } from '../../../SpriteHitbox.js';
import { CorrosiveDamageEffect } from '../../DamageEffect/CorrosiveDamageEffect.js';
import {
    FuelChargeShotLaserLevel1DamageEffect,
    FuelChargeShotLaserLevel2DamageEffect,
    FuelChargeShotLaserLevel3DamageEffect,
} from '../../DamageEffect/FuelChargeShotLaserDamageEffect.js';

export class FuelChargeShotLaserLevel1
    extends Sprite
    implements ISpriteWithSpeed, IGeneratedSprite, ISpriteWithDamage, ISpriteWithDamageEffects
{
    BaseSpeed: number;
    CurrentHitbox: RectangleHitbox[];
    Collide: Map<CollideScenario, (param?: unknown) => void>;
    Generator: 'player' | 'enemy';
    Category: 'projectile' | 'nonProjectile';
    Damage: number;
    DamageEffectsController: PlayerProjectileDamageEffectController;

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

        this.Damage = 0;
        this.DamageEffectsController = new PlayerProjectileDamageEffectController({ baseDamage: this.Damage });
        this.DamageEffectsController.AddDamageEffects({
            damageEffectName: 'FuelChargeShotLaserLevel1',
            damageEffectObject: new FuelChargeShotLaserLevel1DamageEffect({
                resistanceStatDebuf: -100,
                moneyValueGained: 100,
            }),
        });

        this.CurrentHitbox = CreateHitboxesWithInfoFile(this.X, this.Y, [...InfoFuelChargeShot.Level1.Laser.Hitbox]);

        const { Idle } = InfoFuelChargeShot.Level1.Laser.Animations;
        this.AnimationsController.AddAnimation({
            animation: 'idle',
            frames: Idle.Frames,
            framesLengthInTime: Idle.FrameLengthInTime,
        });

        this.Collide = new Map();

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

        ServiceLocator.GetService<IServiceCollideManager>(
            'CollideManager',
        ).HandleWhenPlayerProjectileCollideWithEnemies(this);

        const { width: canvasWidth, height: canvasHeight } = canvas;
        if (this.X < 0 || this.X > canvasWidth || this.Y < 0 || this.Y > canvasHeight) {
            ServiceLocator.GetService<IServiceGeneratedSpritesManager>('GeneratedSpritesManager').RemoveSprite(this);
        }

        this.UpdateHitboxes(dt);
    }
}

export class FuelChargeShotLaserLevel2
    extends Sprite
    implements ISpriteWithSpeed, IGeneratedSprite, ISpriteWithDamage, ISpriteWithDamageEffects
{
    BaseSpeed: number;
    CurrentHitbox: RectangleHitbox[];
    Collide: Map<CollideScenario, (param?: unknown) => void>;
    Generator: 'player' | 'enemy';
    Category: 'projectile' | 'nonProjectile';
    Damage: number;
    DamageEffectsController: PlayerProjectileDamageEffectController;

    constructor(parameters: { X: number; Y: number }) {
        const { X, Y } = parameters;
        super(
            ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').GetImage(
                'images/Skills/FuelChargeShot/LaserLevel2.png',
            ),
            InfoFuelChargeShot.Level2.Laser.Meta.TileDimensions.Width,
            InfoFuelChargeShot.Level2.Laser.Meta.TileDimensions.Height,
            X,
            Y,
            InfoFuelChargeShot.Level2.Laser.Meta.SpriteShiftPosition.X,
            InfoFuelChargeShot.Level2.Laser.Meta.SpriteShiftPosition.Y,
            CANVA_SCALEX,
            CANVA_SCALEY,
            InfoFuelChargeShot.Level2.Laser.Meta.RealDimension.Width,
            InfoFuelChargeShot.Level2.Laser.Meta.RealDimension.Height,
        );

        this.BaseSpeed = 10;

        this.Generator = 'player';
        this.Category = 'projectile';

        this.Damage = 0;
        this.DamageEffectsController = new PlayerProjectileDamageEffectController({ baseDamage: this.Damage });
        this.DamageEffectsController.AddDamageEffects({
            damageEffectName: 'FuelChargeShotLaserLevel2',
            damageEffectObject: new FuelChargeShotLaserLevel2DamageEffect({
                resistanceStatDebuf: -100,
                moneyValueGained: 100,
            }),
        });

        this.CurrentHitbox = CreateHitboxesWithInfoFile(this.X, this.Y, [...InfoFuelChargeShot.Level2.Laser.Hitbox]);

        this.Collide = new Map();

        const { Idle } = InfoFuelChargeShot.Level2.Laser.Animations;
        this.AnimationsController.AddAnimation({
            animation: 'idle',
            frames: Idle.Frames,
            framesLengthInTime: Idle.FrameLengthInTime,
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
        this.UpdateHitboxes(dt);

        ServiceLocator.GetService<IServiceCollideManager>(
            'CollideManager',
        ).HandleWhenPlayerProjectileCollideWithEnemies(this);

        const { width: canvasWidth, height: canvasHeight } = canvas;
        if (this.X < 0 || this.X > canvasWidth || this.Y < 0 || this.Y > canvasHeight) {
            ServiceLocator.GetService<IServiceGeneratedSpritesManager>('GeneratedSpritesManager').RemoveSprite(this);
        }
    }
}

export class FuelChargeShotLaserLevel3
    extends Sprite
    implements ISpriteWithSpeed, IGeneratedSprite, ISpriteWithDamage, ISpriteWithDamageEffects
{
    BaseSpeed: number;
    CurrentHitbox: RectangleHitbox[];
    Collide: Map<CollideScenario, (param?: unknown) => void>;
    Generator: 'player' | 'enemy';
    Category: 'projectile' | 'nonProjectile';
    Damage: number;
    private readonly baseTimeBeforeLaserCanHit: number;
    private timeLeftBeforeLaserCanHit: number;
    DamageEffectsController: PlayerProjectileDamageEffectController;
    constructor(parameters: { X: number; Y: number }) {
        const { X, Y } = parameters;
        super(
            ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').GetImage(
                'images/Skills/FuelChargeShot/LaserLevel3.png',
            ),
            InfoFuelChargeShot.Level3.Laser.Meta.TileDimensions.Width,
            InfoFuelChargeShot.Level3.Laser.Meta.TileDimensions.Height,
            X,
            Y,
            InfoFuelChargeShot.Level3.Laser.Meta.SpriteShiftPosition.X,
            InfoFuelChargeShot.Level3.Laser.Meta.SpriteShiftPosition.Y,
            CANVA_SCALEX,
            CANVA_SCALEY,
            InfoFuelChargeShot.Level3.Laser.Meta.RealDimension.Width,
            InfoFuelChargeShot.Level3.Laser.Meta.RealDimension.Height,
        );

        this.BaseSpeed = 10;

        this.Generator = 'player';
        this.Category = 'projectile';

        this.Damage = 10;
        // the laser can hit 6 times per second
        this.baseTimeBeforeLaserCanHit = 1 / 6;
        this.timeLeftBeforeLaserCanHit = 0;

        this.DamageEffectsController = new PlayerProjectileDamageEffectController({ baseDamage: this.Damage });

        this.DamageEffectsController.AddDamageEffects({
            damageEffectName: 'FuelChargeShotLaserLevel3',
            damageEffectObject: new FuelChargeShotLaserLevel3DamageEffect({
                resistanceStatDebuf: -100,
                moneyValueGained: 100,
                explosiveResistanceDebuf: -40,
                energyResistanceDebuf: -30,
                corrosiveResistanceDebuf: -20,
            }),
        });

        this.DamageEffectsController.AddDamageEffects({
            damageEffectName: 'Corrosive',
            damageEffectObject: new CorrosiveDamageEffect({
                corrosiveEffectStat: 100,
            }),
        });

        this.CurrentHitbox = CreateHitboxesWithInfoFile(this.X, this.Y, [...InfoFuelChargeShot.Level3.Laser.Hitbox]);

        this.Collide = new Map();

        this.Collide.set('WithEnemy', () => {
            this.timeLeftBeforeLaserCanHit = this.baseTimeBeforeLaserCanHit;
        });

        const { Idle } = InfoFuelChargeShot.Level3.Laser.Animations;
        this.AnimationsController.AddAnimation({
            animation: 'idle',
            frames: Idle.Frames,
            framesLengthInTime: Idle.FrameLengthInTime,
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
        this.UpdateHitboxes(dt);

        if (this.timeLeftBeforeLaserCanHit <= 0) {
            ServiceLocator.GetService<IServiceCollideManager>(
                'CollideManager',
            ).HandleWhenPlayerProjectileCollideWithEnemies(this);
        } else {
            this.timeLeftBeforeLaserCanHit -= dt;
        }

        const { width: canvasWidth, height: canvasHeight } = canvas;
        if (this.X < 0 || this.X > canvasWidth || this.Y < 0 || this.Y > canvasHeight) {
            ServiceLocator.GetService<IServiceGeneratedSpritesManager>('GeneratedSpritesManager').RemoveSprite(this);
        }
    }
}
