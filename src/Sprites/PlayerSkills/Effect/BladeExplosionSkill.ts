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

// Refactor the IBullet interface and all the reference of IBullet to be IProjectile
class BladeLevel1 extends Sprite implements IBullet, ISpriteWithHitboxes, ICollidableSprite, IMovableSprite {
    CurrentHitbox: RectangleHitbox[];
    Type: 'enemy' | 'player';
    Damage: number;
    Collide: Map<CollideScenario, (param?: unknown) => void>;
    BaseSpeed: number;
    private direction: 'upper-diagonal' | 'down-diagonal';
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

        this.AddAnimation('spin', [0, 1, 2, 3], 0.1);
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
        const blade1 = new BladeLevel1(enemyX, enemyY, 'upper-diagonal');
        const blade2 = new BladeLevel1(enemyX, enemyY, 'down-diagonal');
        ServiceLocator.GetService<IServiceBulletManager>('BulletManager').AddBullet(blade1);
        ServiceLocator.GetService<IServiceBulletManager>('BulletManager').AddBullet(blade2);
    }
}
