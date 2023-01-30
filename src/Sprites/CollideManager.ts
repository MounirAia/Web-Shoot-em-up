import { ServiceLocator } from '../ServiceLocator.js';
import { IServiceWaveManager } from '../WaveManager/WaveManager.js';
import { ISpriteWithHitboxes } from './SpriteHitbox.js';
import { IServicePlayer } from './Player.js';
import { IServiceGeneratedSpritesManager } from './GeneratedSpriteManager.js';

export interface IServiceCollideManager {
    HandleWhenPlayerNonProjectileCollideWithEnemyProjectiles: (playerNonProjectile: ISpriteWithHitboxes) => void;
    HandleWhenPlayerProjectileCollideWithEnemies: (playerProjectile: ISpriteWithHitboxes) => void;
    HandleWhenEnemyProjectileCollideWithPlayer(enemyProjectile: ISpriteWithHitboxes): void;
    HandleWhenEnemyCollideWithPlayer(enemy: ISpriteWithHitboxes): void;
}

export class CollideManager implements IServiceCollideManager {
    constructor() {
        ServiceLocator.AddService('CollideManager', this);
    }

    HandleWhenPlayerNonProjectileCollideWithEnemyProjectiles(playerNonProjectile: ISpriteWithHitboxes): void {
        const enemyProjectiles =
            ServiceLocator.GetService<IServiceGeneratedSpritesManager>('GeneratedSpritesManager').EnemyProjectiles;
        let isColliding = false;
        for (const [key, enemyProjectile] of enemyProjectiles) {
            for (const hitbox of enemyProjectile.CurrentHitbox) {
                isColliding = hitbox.CheckCollision(playerNonProjectile);

                if (isColliding) {
                    const playerNonProjectileCollisionMethod = playerNonProjectile.Collide.get('WithProjectile');
                    if (playerNonProjectileCollisionMethod) playerNonProjectileCollisionMethod();

                    const enemyProjectileCollisionMethod = enemyProjectile.Collide.get('WithNonProjectile');
                    if (enemyProjectileCollisionMethod) enemyProjectileCollisionMethod(playerNonProjectile);

                    break;
                }
            }
        }
    }

    HandleWhenPlayerProjectileCollideWithEnemies(playerProjectile: ISpriteWithHitboxes): void {
        const waveManager = ServiceLocator.GetService<IServiceWaveManager>('WaveManager');
        let isColliding = false;
        for (const [key, enemy] of waveManager.GetListEnemies()) {
            for (const hitbox of enemy.CurrentHitbox) {
                isColliding = hitbox.CheckCollision(playerProjectile);

                if (isColliding) {
                    const bulletCollisionMethod = playerProjectile.Collide.get('WithEnemy');
                    if (bulletCollisionMethod) bulletCollisionMethod();

                    const enemyCollisionMethod = enemy.Collide.get('WithProjectile');
                    if (enemyCollisionMethod) enemyCollisionMethod(playerProjectile);

                    break;
                }
            }
        }
    }

    HandleWhenEnemyProjectileCollideWithPlayer(enemyProjectile: ISpriteWithHitboxes): void {
        const player = ServiceLocator.GetService<IServicePlayer>('Player');

        if (player.IsInvulnerable()) return;

        for (const hitbox of player.CurrentHitbox) {
            if (hitbox.CheckCollision(enemyProjectile)) {
                const bulletCollisionMethod = enemyProjectile.Collide.get('WithPlayer');
                if (bulletCollisionMethod) bulletCollisionMethod();

                player.PlayCollideMethod('WithProjectile', enemyProjectile);
                break;
            }
        }
    }

    HandleWhenEnemyCollideWithPlayer(enemy: ISpriteWithHitboxes): void {
        const player = ServiceLocator.GetService<IServicePlayer>('Player');

        if (player.IsInvulnerable()) return;

        for (const hitbox of player.CurrentHitbox) {
            if (hitbox.CheckCollision(enemy)) {
                const enemyCollisionMethod = enemy.Collide.get('WithPlayer');
                if (enemyCollisionMethod) enemyCollisionMethod();

                player.PlayCollideMethod('WithEnemy', enemy);
                break;
            }
        }
    }
}

export function LoadCollideManager() {
    const collideManager = new CollideManager();
}
