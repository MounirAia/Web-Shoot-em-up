import { IServiceImageLoader } from '../../ImageLoader.js';
import { CANVA_SCALEX, CANVA_SCALEY, canvas } from '../../ScreenConstant.js';
import { ServiceLocator } from '../../ServiceLocator.js';
import { IServiceCollideManager } from '../CollideManager.js';
import { IGeneratedSprite, IServiceGeneratedSpritesManager } from '../GeneratedSpriteManager.js';
import { PlayerProjectileDamageEffectController } from '../PlayerProjectileDamageEffectsController.js';
import { Sprite } from '../Sprite.js';
import { ISpriteWithDamage, ISpriteWithDamageEffects, ISpriteWithSpeed } from '../SpriteAttributes.js';
import { CollideScenario, CreateHitboxes, ISpriteWithHitboxes, RectangleHitbox } from '../SpriteHitbox.js';

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
        this.DamageEffectsController = new PlayerProjectileDamageEffectController({ baseDamage: this.Damage });

        this.CurrentHitbox = CreateHitboxes(this.X, this.Y, [
            {
                offsetX: 0,
                offsetY: 0,
                width: 2 * CANVA_SCALEX,
                height: 2 * CANVA_SCALEY,
            },
        ]);

        this.AnimationsController.AddAnimation({ animation: 'idle', frames: [0], framesLengthInTime: 1 });
        this.AnimationsController.AddAnimation({
            animation: 'destroyed',
            frames: [0, 1, 2, 3, 4],
            framesLengthInTime: 0.03,
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
}
