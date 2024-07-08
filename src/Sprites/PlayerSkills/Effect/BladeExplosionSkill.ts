import { IServiceEventManager } from '../../../EventManager.js';
import { IServiceImageLoader } from '../../../ImageLoader.js';
import { CANVA_SCALEX, CANVA_SCALEY, FRAME_RATE, canvas } from '../../../ScreenConstant.js';
import { ServiceLocator } from '../../../ServiceLocator.js';
import { BladeConstant } from '../../../StatsJSON/Skills/Effect/Blade/BladeConstant.js';
import { BladeDamageStats } from '../../../StatsJSON/Skills/Effect/Blade/BladeDamage.js';
import { IServiceUtilManager } from '../../../UtilManager.js';
import { IServiceWaveManager } from '../../../WaveManager/WaveManager.js';
import { IServiceCollideManager } from '../../CollideManager.js';
import { IGeneratedSprite, IServiceGeneratedSpritesManager } from '../../GeneratedSpriteManager.js';
import { IServicePlayer } from '../../Player.js';
import { PlayerProjectileDamageEffectController } from '../../PlayerProjectileDamageEffectsController.js';
import { Sprite } from '../../Sprite.js';
import { ISpriteWithDamage, ISpriteWithDamageEffects, ISpriteWithSpeed } from '../../SpriteAttributes.js';
import { CollideScenario, CreateHitboxes, ISpriteWithHitboxes, RectangleHitbox } from '../../SpriteHitbox.js';
import { EnergyDamageEffect } from '../DamageEffect/EnergyDamageEffect.js';
import { PossibleSkillName } from '../Skills';
import { ISkill, SkillsTypeName } from '../Skills.js';

class BladeLevel1
    extends Sprite
    implements ISpriteWithHitboxes, ISpriteWithSpeed, IGeneratedSprite, ISpriteWithDamage, ISpriteWithDamageEffects
{
    CurrentHitbox: RectangleHitbox[];
    Generator: 'player' | 'enemy';
    Category: 'projectile' | 'nonProjectile';
    Damage: number;
    DamageEffectsController: PlayerProjectileDamageEffectController;
    Collide: Map<CollideScenario, (param?: unknown) => void>;
    BaseSpeed: number;
    private readonly direction: 'upper-diagonal' | 'down-diagonal';
    private readonly baseTimeBeforeBladeCanHit: number;
    private timeLeftBeforeBladeCanHit: number;

    constructor(x: number, y: number, direction: 'upper-diagonal' | 'down-diagonal') {
        super(
            ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').GetImage(
                'images/Skills/Blade/BladeLevel1.png',
            ),
            9,
            9,
            x,
            y,
            -3 * CANVA_SCALEX,
            -3 * CANVA_SCALEY,
            CANVA_SCALEX,
            CANVA_SCALEY,
        );
        this.Generator = 'player';
        this.Category = 'projectile';

        const damageInfo = BladeDamageStats[ServiceLocator.GetService<IServicePlayer>('Player').NumberOfBoosts];
        this.Damage = damageInfo['Blade L1 Damage'];
        this.DamageEffectsController = new PlayerProjectileDamageEffectController({ baseDamage: this.Damage });
        this.DamageEffectsController.AddDamageEffects({
            damageEffectName: 'Energy',
            damageEffectObject: new EnergyDamageEffect({
                probabilityOfCriticalHit: damageInfo['Energy Stat (%)'],
            }),
        });

        this.BaseSpeed = ServiceLocator.GetService<IServiceUtilManager>(
            'UtilManager',
        ).GetSpeedItTakesToCoverHalfTheScreenWidth({
            framesItTakes: BladeConstant[0]['Projectile Speed'],
        });
        this.BaseSpeed = this.BaseSpeed / Math.sqrt(2);

        this.direction = direction;
        this.baseTimeBeforeBladeCanHit = FRAME_RATE / (FRAME_RATE * BladeConstant[0]['Hit Rate Per Second']);
        this.timeLeftBeforeBladeCanHit = 0;
        this.CurrentHitbox = CreateHitboxes(this.X, this.Y, [
            {
                offsetX: 0 * CANVA_SCALEX,
                offsetY: 0 * CANVA_SCALEY,
                width: 3 * CANVA_SCALEX,
                height: 3 * CANVA_SCALEY,
            },
        ]);

        this.AnimationsController.AddAnimation({ animation: 'spin', frames: [0, 1, 2, 3], framesLengthInTime: 0.05 });
        this.AnimationsController.PlayAnimation({ animation: 'spin', loop: true });

        this.Collide = new Map();

        this.Collide.set('WithEnemy', () => {
            this.resetBladeCanHitTimer();
        });
    }

    UpdateHitboxes(dt: number) {
        this.CurrentHitbox.forEach((hitbox) => {
            hitbox.SpriteX = this.X;
            hitbox.SpriteY = this.Y;
        });
    }

    public Update(dt: number): void {
        super.Update(dt);
        this.X += this.BaseSpeed;
        if (this.direction === 'upper-diagonal') {
            this.Y -= this.BaseSpeed;
        } else if (this.direction === 'down-diagonal') {
            this.Y += this.BaseSpeed;
        }

        this.UpdateHitboxes(dt);

        if (this.X > canvas.width || this.X < 0 || this.Y > canvas.height || this.Y < 0) {
            ServiceLocator.GetService<IServiceGeneratedSpritesManager>('GeneratedSpritesManager').RemoveSprite(this);
        }

        this.timeLeftBeforeBladeCanHit -= dt;
        if (this.CanBladeHit) {
            const collideManager = ServiceLocator.GetService<IServiceCollideManager>('CollideManager');
            collideManager.HandleWhenPlayerProjectileCollideWithEnemies(this);
        }
    }

    get CanBladeHit(): boolean {
        if (this.timeLeftBeforeBladeCanHit <= 0) {
            return true;
        }
        return false;
    }

    private resetBladeCanHitTimer() {
        this.timeLeftBeforeBladeCanHit = this.baseTimeBeforeBladeCanHit;
    }
}

class BladeLevel2
    extends Sprite
    implements ISpriteWithHitboxes, ISpriteWithSpeed, IGeneratedSprite, ISpriteWithDamage, ISpriteWithDamageEffects
{
    CurrentHitbox: RectangleHitbox[];
    Generator: 'player' | 'enemy';
    Category: 'projectile' | 'nonProjectile';
    Damage: number;
    DamageEffectsController: PlayerProjectileDamageEffectController;
    Collide: Map<CollideScenario, (param?: unknown) => void>;
    BaseSpeed: number;
    private readonly direction: 'upper-diagonal' | 'down-diagonal';
    private readonly baseTimeBeforeBladeCanHit: number;
    private timeLeftBeforeBladeCanHit: number;

    constructor(x: number, y: number, direction: 'upper-diagonal' | 'down-diagonal') {
        super(
            ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').GetImage(
                'images/Skills/Blade/BladeLevel2&3.png',
            ),
            9,
            9,
            x,
            y,
            -0 * CANVA_SCALEX,
            -0 * CANVA_SCALEY,
            CANVA_SCALEX,
            CANVA_SCALEY,
        );
        this.Generator = 'player';
        this.Category = 'projectile';

        const damageInfo = BladeDamageStats[ServiceLocator.GetService<IServicePlayer>('Player').NumberOfBoosts];
        this.Damage = damageInfo['Blade L2 Damage'];
        this.DamageEffectsController = new PlayerProjectileDamageEffectController({ baseDamage: this.Damage });
        this.DamageEffectsController.AddDamageEffects({
            damageEffectName: 'Energy',
            damageEffectObject: new EnergyDamageEffect({
                probabilityOfCriticalHit: damageInfo['Energy Stat (%)'],
            }),
        });

        this.BaseSpeed = ServiceLocator.GetService<IServiceUtilManager>(
            'UtilManager',
        ).GetSpeedItTakesToCoverHalfTheScreenWidth({
            framesItTakes: BladeConstant[1]['Projectile Speed'],
        });
        this.BaseSpeed = this.BaseSpeed / Math.sqrt(2);

        this.direction = direction;
        this.baseTimeBeforeBladeCanHit = FRAME_RATE / (FRAME_RATE * BladeConstant[1]['Hit Rate Per Second']);
        this.timeLeftBeforeBladeCanHit = 0;
        this.CurrentHitbox = CreateHitboxes(this.X, this.Y, [
            {
                offsetX: 0 * CANVA_SCALEX,
                offsetY: 0 * CANVA_SCALEY,
                width: 9 * CANVA_SCALEX,
                height: 9 * CANVA_SCALEY,
            },
        ]);

        this.AnimationsController.AddAnimation({ animation: 'spin', frames: [0, 1, 2, 3], framesLengthInTime: 0.05 });
        this.AnimationsController.PlayAnimation({ animation: 'spin', loop: true });

        this.Collide = new Map();

        this.Collide.set('WithEnemy', () => {
            this.resetBladeCanHitTimer();
        });
    }

    UpdateHitboxes(dt: number) {
        this.CurrentHitbox.forEach((hitbox) => {
            hitbox.SpriteX = this.X;
            hitbox.SpriteY = this.Y;
        });
    }

    public Update(dt: number): void {
        super.Update(dt);
        this.X += this.BaseSpeed;
        if (this.direction === 'upper-diagonal') {
            this.Y -= this.BaseSpeed;
        } else if (this.direction === 'down-diagonal') {
            this.Y += this.BaseSpeed;
        }
        this.UpdateHitboxes(dt);

        if (this.X > canvas.width || this.X < 0 || this.Y > canvas.height || this.Y < 0) {
            ServiceLocator.GetService<IServiceGeneratedSpritesManager>('GeneratedSpritesManager').RemoveSprite(this);
        }

        this.timeLeftBeforeBladeCanHit -= dt;
        if (this.CanBladeHit) {
            const collideManager = ServiceLocator.GetService<IServiceCollideManager>('CollideManager');
            collideManager.HandleWhenPlayerProjectileCollideWithEnemies(this);
        }
    }

    get CanBladeHit(): boolean {
        if (this.timeLeftBeforeBladeCanHit <= 0) {
            return true;
        }
        return false;
    }

    private resetBladeCanHitTimer() {
        this.timeLeftBeforeBladeCanHit = this.baseTimeBeforeBladeCanHit;
    }
}

class BladeLevel3
    extends Sprite
    implements ISpriteWithHitboxes, ISpriteWithSpeed, IGeneratedSprite, ISpriteWithDamage, ISpriteWithDamageEffects
{
    CurrentHitbox: RectangleHitbox[];
    Generator: 'player' | 'enemy';
    Category: 'projectile' | 'nonProjectile';
    Damage: number;
    DamageEffectsController: PlayerProjectileDamageEffectController;
    Collide: Map<CollideScenario, (param?: unknown) => void>;
    baseSpeed: number;
    private readonly direction: 'upper-diagonal' | 'down-diagonal';
    private isSpeedReverted: boolean;
    private readonly spawnXPosition: number;
    private readonly baseTimeBeforeBladeCanHit: number;
    private timeLeftBeforeBladeCanHit: number;

    constructor(x: number, y: number, direction: 'upper-diagonal' | 'down-diagonal') {
        super(
            ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').GetImage(
                'images/Skills/Blade/BladeLevel2&3.png',
            ),
            9,
            9,
            x,
            y,
            0 * CANVA_SCALEX,
            0 * CANVA_SCALEY,
            CANVA_SCALEX,
            CANVA_SCALEY,
        );
        this.Generator = 'player';
        this.Category = 'projectile';

        const damageInfo = BladeDamageStats[ServiceLocator.GetService<IServicePlayer>('Player').NumberOfBoosts];
        this.Damage = damageInfo['Blade L3 Damage'];
        this.DamageEffectsController = new PlayerProjectileDamageEffectController({ baseDamage: this.Damage });
        this.DamageEffectsController.AddDamageEffects({
            damageEffectName: 'Energy',
            damageEffectObject: new EnergyDamageEffect({
                probabilityOfCriticalHit: damageInfo['Energy Stat (%)'],
            }),
        });

        this.baseSpeed = ServiceLocator.GetService<IServiceUtilManager>(
            'UtilManager',
        ).GetSpeedItTakesToCoverHalfTheScreenWidth({
            framesItTakes: BladeConstant[2]['Projectile Speed'],
        });
        this.baseSpeed = this.baseSpeed / Math.sqrt(2);

        this.direction = direction;
        this.isSpeedReverted = false;
        this.spawnXPosition = this.X;
        this.baseTimeBeforeBladeCanHit = FRAME_RATE / (FRAME_RATE * BladeConstant[2]['Hit Rate Per Second']);
        this.timeLeftBeforeBladeCanHit = 0;

        const actionOnEnemyDestroyed = () => {
            this.Damage = this.Damage * BladeConstant[2]['Damage Increase'];
        };
        ServiceLocator.GetService<IServiceEventManager>('EventManager').Subscribe(
            'enemy destroyed',
            actionOnEnemyDestroyed,
        );

        this.CurrentHitbox = CreateHitboxes(this.X, this.Y, [
            {
                offsetX: 0 * CANVA_SCALEX,
                offsetY: 0 * CANVA_SCALEY,
                width: 9 * CANVA_SCALEX,
                height: 9 * CANVA_SCALEY,
            },
        ]);

        this.AnimationsController.AddAnimation({ animation: 'spin', frames: [0, 1, 2, 3], framesLengthInTime: 0.05 });
        this.AnimationsController.AddAnimation({
            animation: 'destroyed',
            frames: [4, 5],
            framesLengthInTime: 0.05,
            afterPlayingAnimation: () => {
                ServiceLocator.GetService<IServiceEventManager>('EventManager').Unsubscribe(
                    'enemy destroyed',
                    actionOnEnemyDestroyed,
                );
                ServiceLocator.GetService<IServiceGeneratedSpritesManager>('GeneratedSpritesManager').RemoveSprite(
                    this,
                );
            },
        });

        this.AnimationsController.PlayAnimation({ animation: 'spin', loop: true });

        this.Collide = new Map();

        this.Collide.set('WithEnemy', () => {
            this.resetBladeCanHitTimer();
        });
    }

    UpdateHitboxes(dt: number) {
        this.CurrentHitbox.forEach((hitbox) => {
            hitbox.SpriteX = this.X;
            hitbox.SpriteY = this.Y;
        });
    }

    public Update(dt: number): void {
        super.Update(dt);
        this.X += this.BaseSpeed;
        if (this.direction === 'upper-diagonal') {
            this.Y -= this.BaseSpeed;
        } else if (this.direction === 'down-diagonal') {
            this.Y += this.BaseSpeed;
        }
        this.UpdateHitboxes(dt);

        // Apply the boomerang effect if blade hits the edge of the screen
        if (this.X > canvas.width || this.X < 0 || this.Y > canvas.height || this.Y < 0) {
            this.isSpeedReverted = true;
        }

        if (this.isSpeedReverted && this.X <= this.spawnXPosition) {
            this.AnimationsController.PlayAnimation({ animation: 'destroyed' });
        }

        this.timeLeftBeforeBladeCanHit -= dt;
        if (this.CanBladeHit) {
            const collideManager = ServiceLocator.GetService<IServiceCollideManager>('CollideManager');
            collideManager.HandleWhenPlayerProjectileCollideWithEnemies(this);
        }
    }

    get BaseSpeed(): number {
        return this.isSpeedReverted ? -this.baseSpeed : this.baseSpeed;
    }

    get CanBladeHit(): boolean {
        if (this.timeLeftBeforeBladeCanHit <= 0) {
            return true;
        }
        return false;
    }

    private resetBladeCanHitTimer() {
        this.timeLeftBeforeBladeCanHit = this.baseTimeBeforeBladeCanHit;
    }
}

export class BladeExplosionSkill implements ISkill {
    readonly Type: SkillsTypeName;
    readonly SkillName: PossibleSkillName;
    constructor() {
        this.Type = 'effect';
        this.SkillName = 'Blade';
    }

    public Effect() {
        const { x: enemyX, y: enemyY } =
            ServiceLocator.GetService<IServiceWaveManager>('WaveManager').GetLastEnemyCenterCoordinate();
        const effectSkillLevel = ServiceLocator.GetService<IServicePlayer>('Player').EffectSkillLevel;

        if (effectSkillLevel === 1) {
            ServiceLocator.GetService<IServiceGeneratedSpritesManager>('GeneratedSpritesManager').AddSprite(
                new BladeLevel1(enemyX, enemyY, 'upper-diagonal'),
            );
            ServiceLocator.GetService<IServiceGeneratedSpritesManager>('GeneratedSpritesManager').AddSprite(
                new BladeLevel1(enemyX, enemyY, 'down-diagonal'),
            );
        } else if (effectSkillLevel === 2) {
            ServiceLocator.GetService<IServiceGeneratedSpritesManager>('GeneratedSpritesManager').AddSprite(
                new BladeLevel2(enemyX, enemyY, 'upper-diagonal'),
            );
            ServiceLocator.GetService<IServiceGeneratedSpritesManager>('GeneratedSpritesManager').AddSprite(
                new BladeLevel2(enemyX, enemyY, 'down-diagonal'),
            );
        } else if (effectSkillLevel === 3) {
            ServiceLocator.GetService<IServiceGeneratedSpritesManager>('GeneratedSpritesManager').AddSprite(
                new BladeLevel3(enemyX, enemyY, 'upper-diagonal'),
            );
            ServiceLocator.GetService<IServiceGeneratedSpritesManager>('GeneratedSpritesManager').AddSprite(
                new BladeLevel3(enemyX, enemyY, 'down-diagonal'),
            );
        }
    }
}
