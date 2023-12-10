import { IServiceImageLoader } from '../../../../ImageLoader.js';
import { CANVA_SCALEX, CANVA_SCALEY, canvas } from '../../../../ScreenConstant.js';
import { ServiceLocator } from '../../../../ServiceLocator.js';
import InfoFuelChargeShot from '../../../../SpriteInfoJSON/Skills/infoFuelChargeShot.js';
import { FuelChargeShotLaserConstant } from '../../../../StatsJSON/Skills/Support/FuelChargeShot/FuelChargeShotConstant.js';
import { FuelChargeShotDamage } from '../../../../StatsJSON/Skills/Support/FuelChargeShot/FuelChargeShotDamage.js';
import { IServiceUtilManager } from '../../../../UtilManager.js';
import { IServiceCollideManager } from '../../../CollideManager.js';
import { IGeneratedSprite, IServiceGeneratedSpritesManager } from '../../../GeneratedSpriteManager.js';
import { IServicePlayer } from '../../../Player.js';
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

        this.BaseSpeed = ServiceLocator.GetService<IServiceUtilManager>(
            'UtilManager',
        ).GetSpeedItTakesToCoverHalfTheScreenWidth({
            framesItTakes: FuelChargeShotLaserConstant[0]['Projectile Speed'],
        });

        this.Generator = 'player';
        this.Category = 'projectile';

        const damageInfo = FuelChargeShotDamage[ServiceLocator.GetService<IServicePlayer>('Player').NumberOfBoosts];

        this.Damage = damageInfo['Laser Level 1 Base Damage Debuf (%)'];

        this.DamageEffectsController = new PlayerProjectileDamageEffectController({ baseDamage: this.Damage });

        this.DamageEffectsController.AddDamageEffects({
            damageEffectName: FuelChargeShotLaserConstant[0]['Primary Skill'],
            damageEffectObject: new FuelChargeShotLaserLevel1DamageEffect({
                resistanceStatDebuf: -damageInfo['Laser Level 1 Base Damage Debuf (%)'],
                moneyValueGainedStat: damageInfo['Laser Level 1 Money Boost (%)'],
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

        this.BaseSpeed = ServiceLocator.GetService<IServiceUtilManager>(
            'UtilManager',
        ).GetSpeedItTakesToCoverHalfTheScreenWidth({
            framesItTakes: FuelChargeShotLaserConstant[1]['Projectile Speed'],
        });

        this.Generator = 'player';
        this.Category = 'projectile';

        const damageInfo = FuelChargeShotDamage[ServiceLocator.GetService<IServicePlayer>('Player').NumberOfBoosts];

        this.Damage = damageInfo['Laser Level 2 Damage'];
        this.DamageEffectsController = new PlayerProjectileDamageEffectController({ baseDamage: this.Damage });
        this.DamageEffectsController.AddDamageEffects({
            damageEffectName: 'FuelChargeShotLaserLevel2',
            damageEffectObject: new FuelChargeShotLaserLevel2DamageEffect({
                resistanceStatDebuf: -damageInfo['Laser Level 2 Base Damage Debuf (%)'],
                moneyValueGainedStat: damageInfo['Laser Level 2 Money Boost (%)'],
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

        this.BaseSpeed = ServiceLocator.GetService<IServiceUtilManager>(
            'UtilManager',
        ).GetSpeedItTakesToCoverHalfTheScreenWidth({
            framesItTakes: FuelChargeShotLaserConstant[2]['Projectile Speed'],
        });

        this.Generator = 'player';
        this.Category = 'projectile';

        const damageInfo = FuelChargeShotDamage[ServiceLocator.GetService<IServicePlayer>('Player').NumberOfBoosts];

        this.Damage = damageInfo['Laser Level 3 Damage'];

        this.DamageEffectsController = new PlayerProjectileDamageEffectController({ baseDamage: this.Damage });

        this.DamageEffectsController.AddDamageEffects({
            damageEffectName: FuelChargeShotLaserConstant[2]['Primary Skill'],
            damageEffectObject: new FuelChargeShotLaserLevel3DamageEffect({
                resistanceStatDebuf: -damageInfo['Laser Level 3 Base Damage Debuf (%)'],
                moneyValueGainedStat: damageInfo['Laser Level 3 Money Boost (%)'],
                explosiveResistanceDebuf: -damageInfo['Laser Level 3 Explosive Resistance Debuf (%)'],
                energyResistanceDebuf: -damageInfo['Laser Level 3 Energy Resistance Debuf (%)'],
            }),
        });

        this.DamageEffectsController.AddDamageEffects({
            damageEffectName: FuelChargeShotLaserConstant[2]['Secondary Skill'],
            damageEffectObject: new CorrosiveDamageEffect({
                damageToApplyForWholeEffect: damageInfo['Laser Level 3 Corrosive Damage'],
            }),
        });

        this.CurrentHitbox = CreateHitboxesWithInfoFile(this.X, this.Y, [...InfoFuelChargeShot.Level3.Laser.Hitbox]);

        this.Collide = new Map();

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

        ServiceLocator.GetService<IServiceCollideManager>(
            'CollideManager',
        ).HandleWhenPlayerProjectileCollideWithEnemies(this);

        const { width: canvasWidth, height: canvasHeight } = canvas;
        if (this.X < 0 || this.X > canvasWidth || this.Y < 0 || this.Y > canvasHeight) {
            ServiceLocator.GetService<IServiceGeneratedSpritesManager>('GeneratedSpritesManager').RemoveSprite(this);
        }
    }
}
