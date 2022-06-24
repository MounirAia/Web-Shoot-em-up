import { IServiceImageLoader } from '../../ImageLoader.js';
import { ServiceLocator } from '../../ServiceLocator.js';
import { IServiceWaveManager } from '../../WaveManager/WaveManager.js';
import { Sprite } from '../Sprite.js';
import { IEnemy } from './IEnemy.js';

// export class TriangleEnemy extends Sprite implements IEnemy {
//     constructor(x: number = 0, y: number = 0) {
//         const imgTriangle =
//             ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').GetImage('images/enemyred.png');
//         const frameWidth = 24;
//         const frameHeight = 24;
//         const scaleX = 2;
//         const scaleY = 2;
//         super(imgTriangle, frameWidth, frameHeight, x, y, 0, 0, scaleX, scaleY);
//         this.AddAnimation('idle', [0, 1, 2, 3, 4, 5]);
//         this.PlayAnimation('idle', 0.1, true);
//     }

//     public Update(dt: number): void {
//         super.Update(dt);
//         this.X -= 200 * dt;

//         if (this.X < -this.Width) {
//             ServiceLocator.GetService<IServiceWaveManager>('WaveManager').RemoveEnemy(this);
//         }
//     }
// }
