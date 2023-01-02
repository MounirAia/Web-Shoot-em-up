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

// remove the action field blade level 3 to check when to delete blade, rather use the name of the animation if equall === disapear or destroyed.
// add the damage increase on enemy destroyed event
class BladeLevel1 extends Sprite implements IBullet, ISpriteWithHitboxes, ICollidableSprite, IMovableSprite {
    CurrentHitbox: RectangleHitbox[];
    Type: 'enemy' | 'player';
    Damage: number;
    Collide: Map<CollideScenario, (param?: unknown) => void>;
    BaseSpeed: number;
    private readonly direction: 'upper-diagonal' | 'down-diagonal';
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
        this.Damage = 0;
        this.BaseSpeed = 10 / Math.sqrt(2);
        this.direction = direction;
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

        const collideManager = ServiceLocator.GetService<IServiceCollideManager>('CollideManager');
        collideManager.HandleWhenBulletCollideWithEnemies(this);
    }
}

class BladeLevel2 extends Sprite implements IBullet, ISpriteWithHitboxes, ICollidableSprite, IMovableSprite {
    CurrentHitbox: RectangleHitbox[];
    Type: 'enemy' | 'player';
    Damage: number;
    Collide: Map<CollideScenario, (param?: unknown) => void>;
    BaseSpeed: number;
    private readonly direction: 'upper-diagonal' | 'down-diagonal';
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
        this.Damage = 0;
        this.BaseSpeed = 10 / Math.sqrt(2);
        this.direction = direction;
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

        const collideManager = ServiceLocator.GetService<IServiceCollideManager>('CollideManager');
        collideManager.HandleWhenBulletCollideWithEnemies(this);
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
        this.Damage = 1;
        this.baseSpeed = 10 / Math.sqrt(2);
        this.direction = direction;
        this.isSpeedReverted = false;
        this.spawnXPosition = this.X;

        const actionOnEnemyDestroyed = () => {
            this.Damage = this.Damage + this.Damage * 0.25;
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

        const collideManager = ServiceLocator.GetService<IServiceCollideManager>('CollideManager');
        collideManager.HandleWhenBulletCollideWithEnemies(this);
    }

    get BaseSpeed(): number {
        return this.isSpeedReverted ? -this.baseSpeed : this.baseSpeed;
    }
}

export class BladeExplosionSkill {
    readonly Type: SkillsTypeName;
    readonly SkillName: string;
    constructor() {
        this.Type = 'effect';
        this.SkillName = 'BladeExplosion';
    }

    public Effect() {
        const { x: enemyX, y: enemyY } =
            ServiceLocator.GetService<IServiceWaveManager>('WaveManager').GetLastEnemyCenterCoordinate();
        const blade1 = new BladeLevel3(enemyX, enemyY, 'upper-diagonal');
        const blade2 = new BladeLevel3(enemyX, enemyY, 'down-diagonal');
        ServiceLocator.GetService<IServiceBulletManager>('BulletManager').AddBullet(blade1);
        ServiceLocator.GetService<IServiceBulletManager>('BulletManager').AddBullet(blade2);
    }
}
