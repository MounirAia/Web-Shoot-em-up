import { IServiceImageLoader } from '../../../ImageLoader.js';
import { canvas, CANVA_SCALEX, CANVA_SCALEY } from '../../../ScreenConstant.js';
import { ServiceLocator } from '../../../ServiceLocator.js';
import { IServiceBulletManager } from '../../Bullets/BulletManager.js';
import { IBullet } from '../../Bullets/IBullet.js';
import { CollideScenario, ICollidableSprite, IServiceCollideManager } from '../../CollideManager.js';
import { CreateHitboxes, ISpriteWithHitboxes, RectangleHitbox } from '../../InterfaceBehaviour/ISpriteWithHitboxes.js';
import { Sprite } from '../../Sprite.js';
import { SkillsTypeName } from '../Skills.js';
import { IMovableSprite } from '../../InterfaceBehaviour/IMovableSprite.js';
import { IServiceWaveManager } from '../../../WaveManager/WaveManager.js';
import { IServiceEventManager } from '../../../EventManager.js';
import { PossibleSkillName } from '../Skills';
import { IServicePlayer } from '../../Player.js';
import { FRAME_RATE } from '../../../ScreenConstant.js';
import { BladeConstant } from '../../../StatsJSON/Skills/Effect/Blade/BladeConstant.js';
import { BladeDamage } from '../../../StatsJSON/Skills/Effect/Blade/BladeDamage.js';

class BladeLevel1 extends Sprite implements IBullet, ISpriteWithHitboxes, ICollidableSprite, IMovableSprite {
    CurrentHitbox: RectangleHitbox[];
    Type: 'enemy' | 'player';
    Damage: number;
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
            3 * CANVA_SCALEX,
            3 * CANVA_SCALEY,
            CANVA_SCALEX,
            CANVA_SCALEY,
        );
        this.Type = 'player';
        const playersDamageUpgrade = ServiceLocator.GetService<IServicePlayer>('Player').NumberOfDamageUpgrade;
        this.Damage = BladeDamage[playersDamageUpgrade].bladeL1;
        this.BaseSpeed = BladeConstant[0].projectileSpeed / Math.sqrt(2);
        this.direction = direction;
        this.baseTimeBeforeBladeCanHit = FRAME_RATE / (FRAME_RATE * BladeConstant[0].hitRatePerSecond);
        this.timeLeftBeforeBladeCanHit = 0;
        this.CurrentHitbox = CreateHitboxes(this.X, this.Y, [
            {
                offsetX: 0 * CANVA_SCALEX,
                offsetY: 0 * CANVA_SCALEY,
                width: 3 * CANVA_SCALEX,
                height: 3 * CANVA_SCALEY,
            },
        ]);

        this.AddAnimation('spin', [0, 1, 2, 3], 0.05);
        this.PlayAnimation('spin', true);

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
            ServiceLocator.GetService<IServiceBulletManager>('BulletManager').RemoveBullet(this);
        }

        this.timeLeftBeforeBladeCanHit -= dt;
        if (this.CanBladeHit) {
            const collideManager = ServiceLocator.GetService<IServiceCollideManager>('CollideManager');
            collideManager.HandleWhenBulletCollideWithEnemies(this);
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

class BladeLevel2 extends Sprite implements IBullet, ISpriteWithHitboxes, ICollidableSprite, IMovableSprite {
    CurrentHitbox: RectangleHitbox[];
    Type: 'enemy' | 'player';
    Damage: number;
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
            0 * CANVA_SCALEX,
            0 * CANVA_SCALEY,
            CANVA_SCALEX,
            CANVA_SCALEY,
        );
        this.Type = 'player';
        const playersDamageUpgrade = ServiceLocator.GetService<IServicePlayer>('Player').NumberOfDamageUpgrade;
        this.Damage = BladeDamage[playersDamageUpgrade].bladeL2;
        this.BaseSpeed = BladeConstant[1].projectileSpeed / Math.sqrt(2);
        this.direction = direction;
        this.baseTimeBeforeBladeCanHit = FRAME_RATE / (FRAME_RATE * BladeConstant[1].hitRatePerSecond);
        this.timeLeftBeforeBladeCanHit = 0;
        this.CurrentHitbox = CreateHitboxes(this.X, this.Y, [
            {
                offsetX: 0 * CANVA_SCALEX,
                offsetY: 0 * CANVA_SCALEY,
                width: 9 * CANVA_SCALEX,
                height: 9 * CANVA_SCALEY,
            },
        ]);

        this.AddAnimation('spin', [0, 1, 2, 3], 0.05);
        this.PlayAnimation('spin', true);

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
            ServiceLocator.GetService<IServiceBulletManager>('BulletManager').RemoveBullet(this);
        }

        this.timeLeftBeforeBladeCanHit -= dt;
        if (this.CanBladeHit) {
            const collideManager = ServiceLocator.GetService<IServiceCollideManager>('CollideManager');
            collideManager.HandleWhenBulletCollideWithEnemies(this);
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

class BladeLevel3 extends Sprite implements IBullet, ISpriteWithHitboxes, ICollidableSprite, IMovableSprite {
    CurrentHitbox: RectangleHitbox[];
    Type: 'enemy' | 'player';
    Damage: number;
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
        this.Type = 'player';
        const playersDamageUpgrade = ServiceLocator.GetService<IServicePlayer>('Player').NumberOfDamageUpgrade;
        this.Damage = BladeDamage[playersDamageUpgrade].bladeL3;
        this.baseSpeed = BladeConstant[2].projectileSpeed / Math.sqrt(2);
        this.direction = direction;
        this.isSpeedReverted = false;
        this.spawnXPosition = this.X;
        this.baseTimeBeforeBladeCanHit = FRAME_RATE / (FRAME_RATE * BladeConstant[2].hitRatePerSecond);
        this.timeLeftBeforeBladeCanHit = 0;

        const actionOnEnemyDestroyed = () => {
            this.Damage = this.Damage * BladeConstant[2].damageIncrease;
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

        this.AddAnimation('spin', [0, 1, 2, 3], 0.05);
        this.AddAnimation('destroyed', [4, 5], 0.05, undefined, () => {
            ServiceLocator.GetService<IServiceEventManager>('EventManager').Unsubscribe(
                'enemy destroyed',
                actionOnEnemyDestroyed,
            );
            ServiceLocator.GetService<IServiceBulletManager>('BulletManager').RemoveBullet(this);
        });

        this.PlayAnimation('spin', true);

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
            this.PlayAnimation('destroyed');
        }

        this.timeLeftBeforeBladeCanHit -= dt;
        if (this.CanBladeHit) {
            const collideManager = ServiceLocator.GetService<IServiceCollideManager>('CollideManager');
            collideManager.HandleWhenBulletCollideWithEnemies(this);
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

export class BladeExplosionSkill {
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
            ServiceLocator.GetService<IServiceBulletManager>('BulletManager').AddBullet(
                new BladeLevel1(enemyX, enemyY, 'upper-diagonal'),
            );
            ServiceLocator.GetService<IServiceBulletManager>('BulletManager').AddBullet(
                new BladeLevel1(enemyX, enemyY, 'down-diagonal'),
            );
        } else if (effectSkillLevel === 2) {
            ServiceLocator.GetService<IServiceBulletManager>('BulletManager').AddBullet(
                new BladeLevel2(enemyX, enemyY, 'upper-diagonal'),
            );
            ServiceLocator.GetService<IServiceBulletManager>('BulletManager').AddBullet(
                new BladeLevel2(enemyX, enemyY, 'down-diagonal'),
            );
        } else if (effectSkillLevel === 3) {
            ServiceLocator.GetService<IServiceBulletManager>('BulletManager').AddBullet(
                new BladeLevel3(enemyX, enemyY, 'upper-diagonal'),
            );
            ServiceLocator.GetService<IServiceBulletManager>('BulletManager').AddBullet(
                new BladeLevel3(enemyX, enemyY, 'down-diagonal'),
            );
        }
    }
}
