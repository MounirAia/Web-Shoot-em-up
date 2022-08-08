import { ServiceLocator } from '../ServiceLocator.js';
import { IServiceWaveManager } from '../WaveManager/WaveManager.js';
import { IBullet } from './Bullets/IBullet.js';
import { ISpriteWithHitboxes } from './InterfaceBehaviour/ISpriteWithHitboxes.js';
import { IServicePlayer } from './Player.js';

// put it in InterfaceBehaviour
export type CollideScenario = 'WithBullet' | 'WithPlayer' | 'WithEnemy';

export interface ICollidableSprite {
    Collide: Map<CollideScenario, (param?: unknown) => void>;
}

export interface IServiceCollideManager {
    HandleWhenBulletCollideWithEnemies: (bullet: IBullet & ISpriteWithHitboxes & ICollidableSprite) => void;
    HandleWhenBulletCollideWithPlayer(bullet: IBullet & ISpriteWithHitboxes & ICollidableSprite): void;
}

export class CollideManager implements IServiceCollideManager {
    constructor() {
        ServiceLocator.AddService('CollideManager', this);
    }

    HandleWhenBulletCollideWithEnemies(bullet: IBullet & ISpriteWithHitboxes & ICollidableSprite): void {
        const waveManager = ServiceLocator.GetService<IServiceWaveManager>('WaveManager');
        let isColliding = false;

        for (const [key, enemy] of waveManager.GetListEnemies()) {
            for (const hitbox of enemy.Hitboxes) {
                isColliding = hitbox.CheckCollision(bullet);

                if (isColliding) {
                    const bulletCollisionMethod = bullet.Collide.get('WithEnemy');
                    if (bulletCollisionMethod) bulletCollisionMethod();

                    const enemyCollisionMethod = enemy.Collide.get('WithBullet');
                    if (enemyCollisionMethod) enemyCollisionMethod(bullet);
                }
            }
        }
    }

    HandleWhenBulletCollideWithPlayer(bullet: IBullet & ISpriteWithHitboxes & ICollidableSprite): void {
        for (const hitbox of ServiceLocator.GetService<IServicePlayer>('Player').Hitboxes) {
            if (hitbox.CheckCollision(bullet)) {
                const bulletCollisionMethod = bullet.Collide.get('WithPlayer');
                if (bulletCollisionMethod) bulletCollisionMethod();

                ServiceLocator.GetService<IServicePlayer>('Player').PlayCollideMethod('WithBullet', bullet);
            }
        }
    }
}

export function LoadCollideManager() {
    const collideManager = new CollideManager();
}