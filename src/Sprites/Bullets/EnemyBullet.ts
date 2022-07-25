import { IServiceImageLoader } from '../../ImageLoader.js';
import { canvas, CANVA_SCALEX, CANVA_SCALEY } from '../../ScreenConstant.js';
import { ServiceLocator } from '../../ServiceLocator.js';
import { IServiceWaveManager } from '../../WaveManager/WaveManager.js';
import { IMovableSprite } from '../InterfaceBehaviour/IMovableSprite.js';
import { ISpriteWithHitboxes, RectangleHitbox, CreateHitboxes } from '../InterfaceBehaviour/ISpriteWithHitboxes.js';
import { IServicePlayer } from '../Player.js';
import { Sprite } from '../Sprite.js';
import { IServiceBulletManager } from './BulletManager.js';
import { IBullet, ITargetableBullet } from './IBullet.js';

export class EnemyBullet extends Sprite implements IBullet, ITargetableBullet, IMovableSprite, ISpriteWithHitboxes {
    Type: 'player' | 'enemy' = 'enemy';
    BaseSpeed: number;
    Damage: number;
    Hitboxes: RectangleHitbox[];

    XSpeed: number;
    YSpeed: number;

    constructor(x: number, y: number) {
        super(
            ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').GetImage('images/Enemies/EnemiesBullet.png'),
            8,
            8,
            x,
            y,
            3 * CANVA_SCALEX,
            3 * CANVA_SCALEY,
            CANVA_SCALEX,
            CANVA_SCALEY,
        );

        this.AddAnimation('idle', [0], 1);
        this.AddAnimation('destroyed', [0, 1, 2, 3, 4], 0.03);
        this.PlayAnimation('idle', false);

        this.BaseSpeed = 3;
        this.Damage = 3;

        this.XSpeed = Math.cos(this.BulletAngle) * this.BaseSpeed;
        this.YSpeed = Math.sin(this.BulletAngle) * this.BaseSpeed;

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

        this.X -= this.XSpeed;
        this.Y -= this.YSpeed;

        if (this.X > canvas.width || this.X < 0 || this.Y > canvas.height || this.Y < 0) {
            ServiceLocator.GetService<IServiceBulletManager>('BulletManager').RemoveBullet(this);
        }

        if (this.CurrentAnimationName !== 'destroyed') {
            const isColliding =
                ServiceLocator.GetService<IServiceWaveManager>('WaveManager').VerifyCollisionWithPlayer(this);

            if (isColliding) {
                this.PlayAnimation('destroyed', false);
            }
        } else {
            if (this.IsAnimationFinished) {
                ServiceLocator.GetService<IServiceBulletManager>('BulletManager').RemoveBullet(this);
            }
        }
    }

    get BulletAngle(): number {
        const { x: playerX, y: playerY } = ServiceLocator.GetService<IServicePlayer>('Player').Coordinate();
        const distX = this.X - playerX;
        const distY = this.Y - playerY;
        return Math.atan2(distY, distX);
    }
}
