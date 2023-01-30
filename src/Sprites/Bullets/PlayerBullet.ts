import { IServiceImageLoader } from '../../ImageLoader.js';
import { canvas, CANVA_SCALEX, CANVA_SCALEY } from '../../ScreenConstant.js';
import { ServiceLocator } from '../../ServiceLocator.js';
import { IServiceCollideManager } from '../CollideManager.js';
import { ISpriteWithSpeed } from '../SpriteAttributes.js';
import { ISpriteWithHitboxes, RectangleHitbox, CreateHitboxes, CollideScenario } from '../SpriteHitbox.js';
import { Sprite } from '../Sprite.js';
import { IServiceGeneratedSpritesManager, IGeneratedSprite } from '../GeneratedSpriteManager.js';

export class RegularPlayerBullet extends Sprite implements ISpriteWithSpeed, ISpriteWithHitboxes, IGeneratedSprite {
    Generator: 'player' | 'enemy';
    Category: 'projectile' | 'nonProjectile';
    BaseSpeed: number;
    Damage: number;
    CurrentHitbox: RectangleHitbox[];
    Collide: Map<CollideScenario, (param?: unknown) => void>;

    constructor(x: number, y: number) {
        super(
            ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').GetImage(
                'images/Player/RegularPlayerBullet.png',
            ),
            8,
            8,
            x,
            y,
            -3 * CANVA_SCALEX,
            -3 * CANVA_SCALEY,
            CANVA_SCALEX,
            CANVA_SCALEY,
        );
        this.Generator = 'player';
        this.Category = 'projectile';
        this.BaseSpeed = 10;
        this.Damage = 3;
        this.CurrentHitbox = CreateHitboxes(this.X, this.Y, [
            {
                offsetX: 0,
                offsetY: 0,
                width: 2 * CANVA_SCALEX,
                height: 2 * CANVA_SCALEY,
            },
        ]);

        this.AddAnimation('idle', [0], 1);
        this.AddAnimation('destroyed', [0, 1, 2, 3, 4], 0.03, undefined, () => {
            ServiceLocator.GetService<IServiceGeneratedSpritesManager>('GeneratedSpritesManager').RemoveSprite(this);
        });
        this.PlayAnimation('idle', false);

        this.Collide = new Map();
        this.Collide.set('WithEnemy', () => {
            this.PlayAnimation('destroyed');
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
        this.UpdateHitboxes(dt);

        this.X += this.BaseSpeed;

        if (this.X > canvas.width || this.X < 0 || this.Y > canvas.height || this.Y < 0) {
            ServiceLocator.GetService<IServiceGeneratedSpritesManager>('GeneratedSpritesManager').RemoveSprite(this);
        }

        if (this.CurrentAnimationName !== 'destroyed') {
            const collideManager = ServiceLocator.GetService<IServiceCollideManager>('CollideManager');
            collideManager.HandleWhenPlayerProjectileCollideWithEnemies(this);
        }
    }
}
