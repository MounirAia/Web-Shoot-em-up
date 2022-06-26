import { IServiceImageLoader } from '../../ImageLoader.js';
import { canvas, CANVA_SCALEX, CANVA_SCALEY } from '../../ScreenConstant.js';
import { ServiceLocator } from '../../ServiceLocator.js';
import { IServiceWaveManager } from '../../WaveManager/WaveManager.js';
import { ISpriteWithHitboxes, RectangleHitbox, CreateHitboxes } from '../InterfaceBehaviour/ISpriteWithHitboxes.js';
import { Sprite } from '../Sprite.js';
import { IServiceBulletManager } from './BulletManager.js';
import { IBullet } from './IBullet.js';

export class RegularPlayerBullet extends Sprite implements IBullet, ISpriteWithHitboxes {
    Type: 'player' | 'enemy' = 'player';
    BaseSpeed: number = 10;
    Damage: number = 3;
    Hitboxes: RectangleHitbox[];
    constructor(x: number, y: number) {
        super(
            ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').GetImage(
                'images/Player/RegularPlayerBullet.png',
            ),
            8,
            8,
            x,
            y,
            3 * CANVA_SCALEX,
            3 * CANVA_SCALEY,
            CANVA_SCALEX,
            CANVA_SCALEY,
        );

        this.AddAnimation('idle', [0]);
        this.AddAnimation('destroyed', [0, 1, 2, 3, 4]);
        this.PlayAnimation('idle', 0.1, false);

        this.Hitboxes = CreateHitboxes(this.X, this.Y, [
            {
                offsetX: 0,
                offsetY: 0,
                width: 2 * CANVA_SCALEX,
                height: 2 * CANVA_SCALEY,
            },
        ]);
    }

    UpdateHitboxes(dt: number) {
        this.Hitboxes.forEach((hitbox) => {
            hitbox.SpriteX = this.X;
            hitbox.SpriteY = this.Y;
        });
    }

    public Update(dt: number) {
        super.Update(dt);
        this.UpdateHitboxes(dt);

        this.X += this.BaseSpeed;

        if (this.X > canvas.width) {
            ServiceLocator.GetService<IServiceBulletManager>('BulletManager').RemoveBullet(this);
        }

        if (this.CurrentAnimationName !== 'destroyed') {
            let { isColliding, enemy } =
                ServiceLocator.GetService<IServiceWaveManager>('WaveManager').VerifyCollisionWithEnemies(this);
            if (isColliding) {
                this.PlayAnimation('destroyed', 0.03, false);
                ServiceLocator.GetService<IServiceWaveManager>('WaveManager').RemoveEnemy(enemy!);
            }
        } else {
            if (this.IsAnimationFinished) {
                ServiceLocator.GetService<IServiceBulletManager>('BulletManager').RemoveBullet(this);
            }
        }
    }
}

// remove bullet when destroy animation is finished
// Document how bullet affect enemies
