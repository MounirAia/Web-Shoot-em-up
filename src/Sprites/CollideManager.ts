import { ServiceLocator } from '../ServiceLocator.js';
import { IServiceWaveManager } from '../WaveManager/WaveManager.js';
import { IEnemy } from './Enemies/IEnemy.js';
import { IServiceGeneratedSpritesManager } from './GeneratedSpriteManager.js';
import { IServicePlayer } from './Player.js';
import { ISpriteWithDamage, ISpriteWithDamageEffects, ISpriteWithDamageResistance } from './SpriteAttributes.js';
import { ISpriteWithHitboxes } from './SpriteHitbox.js';

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
                    if (playerNonProjectileCollisionMethod) playerNonProjectileCollisionMethod(enemyProjectile);

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

                    const bulletDamage = new this.PlayerProjectileCollideWithEnemiesHelper({
                        projectile: playerProjectile,
                        target: enemy,
                    }).Damage;

                    const enemyCollisionMethod = enemy.Collide.get('WithProjectile');
                    if (enemyCollisionMethod) enemyCollisionMethod(bulletDamage);

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

    private PlayerProjectileCollideWithEnemiesHelper = class {
        projectile: ISpriteWithDamage & ISpriteWithDamageEffects;
        target: IEnemy & ISpriteWithDamageResistance;
        damage: number;
        constructor(parameters: { projectile: unknown; target: unknown }) {
            const { projectile, target } = parameters;
            this.projectile = { ...(projectile as ISpriteWithDamage & ISpriteWithDamageEffects) };

            this.target = target as IEnemy & ISpriteWithDamageResistance;

            this.damage = this.projectile.Damage;
            if (this.projectile.DamageEffects) {
                this.applyDamageEffects();
            }
        }

        private applyDamageEffects() {
            this.projectile.DamageEffects.forEach((value, key) => {
                // Short Term Damage Effect
                if (value.Damage) {
                    const effectDamage = value.Damage({
                        target: this.target,
                        targetResistanceStat: this.target.DamageResistances?.get(key),
                    });
                    this.damage += effectDamage;
                }

                // Long Term Damage Effect
                if (value.Effect) {
                    // need to apply resistance if there are resistances
                    const effect = value.Effect({
                        target: this.target,
                        targetResistanceStat: this.target.DamageResistances?.get(key),
                    });
                    ServiceLocator.GetService<IServiceWaveManager>('WaveManager').AddEnemyState({
                        target: this.target,
                        effect,
                        effectType: value.DamageType,
                    });
                }
            });
        }

        public get Damage(): number {
            return this.damage;
        }
    };
}

export function LoadCollideManager() {
    const collideManager = new CollideManager();
}
