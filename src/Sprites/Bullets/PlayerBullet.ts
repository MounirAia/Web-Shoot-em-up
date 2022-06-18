import { IServiceImageLoader } from '../../ImageLoader.js';
import { canvas, CANVA_SCALEX, CANVA_SCALEY } from '../../ScreenConstant.js';
import { ServiceLocator } from '../../ServiceLocator.js';
import { Sprite } from '../Sprite.js';
import { IServiceBulletManager } from './BulletManager.js';
import { IBullet } from './IBullet.js';

export class RegularPlayerBullet extends Sprite implements IBullet {
    type: 'player' | 'enemy' = 'player';
    BaseSpeed: number = 10;
    constructor(x: number, y: number) {
        super(
            ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').GetImage(
                'images/Player/RegularPlayerBullet.png',
            ),
            8,
            8,
            x,
            y,
            CANVA_SCALEX,
            CANVA_SCALEY,
        );

        this.AddAnimation('idle', [0]);
        this.AddAnimation('destroyed', [0, 1, 2, 3, 4]);
        this.PlayAnimation('idle', 0.1, false);
    }

    public Update(dt: number) {
        super.Update(dt);
        this.X += this.BaseSpeed;

        if (this.X > canvas.width) {
            ServiceLocator.GetService<IServiceBulletManager>('BulletManager').RemoveBullet(this);
        }
    }
}
