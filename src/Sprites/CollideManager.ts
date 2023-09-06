import { ServiceLocator } from '../ServiceLocator.js';
import { IServiceWaveManager } from '../WaveManager/WaveManager.js';
import { IServiceGeneratedSpritesManager } from './GeneratedSpriteManager.js';
import { IServicePlayer } from './Player.js';
import { Sprite } from './Sprite.js';
import { DamageEffectOptions, ISpriteWithDamage, ISpriteWithDamageResistance } from './SpriteAttributes.js';
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

                    const bulletDamage = new DamageHelperManager({ projectile: playerProjectile, target: enemy })
                        .Damage;

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
}

export function LoadCollideManager() {
    const collideManager = new CollideManager();
}

class DamageHelperManager {
    projectile: ISpriteWithDamage;
    target: Sprite & ISpriteWithDamageResistance;

    private static criticalDamageMultiplier = 3;

    constructor(parameters: { projectile: unknown; target: unknown }) {
        const { projectile, target } = parameters;
        this.projectile = { ...(projectile as ISpriteWithDamage) };

        this.target = target as Sprite & ISpriteWithDamageResistance;

        this.applyTargetDebuf();
        this.computeProjectileDamage();
    }

    private applyTargetDebuf() {
        if (this.projectile.PrimaryEffect && this.target.EffectDebufName) {
            if (this.projectile.PrimaryEffect === this.target.EffectDebufName) {
                this.projectile.PrimaryEffectStat = Math.max(
                    0,
                    this.projectile.PrimaryEffectStat - this.target.EffectDebufStat,
                );
            } else if (this.projectile.SecondaryEffect === this.target.EffectDebufName) {
                this.projectile.SecondaryEffectStat = Math.max(
                    0,
                    this.projectile.SecondaryEffectStat - this.target.EffectDebufStat,
                );
            }
        }
    }

    private computeProjectileDamage() {
        // compute damage effect
        const primaryDamageStat = this.computeDamageEffectDamage({
            damageEffectName: this.projectile.PrimaryEffect,
            damageEffectState: this.projectile.PrimaryEffectStat,
        });

        const secondaryDamageStat = this.computeDamageEffectDamage({
            damageEffectName: this.projectile.SecondaryEffect,
            damageEffectState: this.projectile.SecondaryEffectStat,
        });

        this.projectile.Damage = this.projectile.Damage + primaryDamageStat + secondaryDamageStat;
    }

    private computeDamageEffectDamage(parameters: {
        damageEffectName: DamageEffectOptions;
        damageEffectState: number;
    }): number {
        const { damageEffectName, damageEffectState } = parameters;
        if (damageEffectName === 'Explosive') {
            return (this.projectile.Damage * damageEffectState) / 100;
        } else if (damageEffectName === 'Energy') {
            const rndNumber = Math.random();
            if (damageEffectState / 100 >= rndNumber) {
                return this.projectile.Damage * (DamageHelperManager.criticalDamageMultiplier - 1);
            }
        } else if (damageEffectName === 'Corrosive') {
            // Need to play the corrosive state
            // this.target.StatesController.PlayState('')
            return 0;
        }

        return 0;
    }

    public get Damage(): number {
        return this.projectile.Damage;
    }
}
