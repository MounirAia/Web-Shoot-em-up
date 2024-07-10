import { ServiceLocator } from '../ServiceLocator.js';
import { IServiceWaveManager } from '../WaveManager/WaveManager.js';
import { IEnemy } from './Enemies/IEnemy.js';
import { DamageEffectOptions, IDamageEffect } from './PlayerSkills/DamageEffect/IDamageEffect.js';

// Manage the damage effect of the player projectile
// used in the collide manager and is present in all the projectile of the player
export class PlayerProjectileDamageEffectController {
    private damageEffects: Map<DamageEffectOptions, IDamageEffect>;
    private baseDamage: number;
    constructor(parameters: { baseDamage: number }) {
        const { baseDamage } = parameters;
        this.damageEffects = new Map();
        this.baseDamage = baseDamage;
    }

    public AddDamageEffects(parameters: { damageEffectName: DamageEffectOptions; damageEffectObject: IDamageEffect }) {
        const { damageEffectName, damageEffectObject } = parameters;
        this.damageEffects.set(damageEffectName, damageEffectObject);
    }

    // Apply damage effect and get on hit damage to apply on a target
    public ApplyShortAndLongTermDamageEffect(parameters: { target: IEnemy }): number {
        const { target } = parameters;
        // First apply baseDamage resistance of the enemies to the projectile baseDamage. (base damage are used to compute other damage effect)
        const baseDamage = this.applyBaseDamageResistance({ target });

        // Compute ShortTermDamage
        const damageToReturn = this.computeShortDamageEffect({ projectileDamage: baseDamage, target });

        // Compute longTerm Damage
        this.applyLongTermDamageEffect({ projectileDamage: baseDamage, target });

        return damageToReturn;
    }

    public SetBaseDamage(value: number) {
        this.baseDamage = value;
    }

    private computeShortDamageEffect(parameters: { projectileDamage: number; target: IEnemy }): number {
        const { target, projectileDamage } = parameters;
        // Compute the remaining damage using the baseDamage of the projectile as a starting point
        let damage = projectileDamage;

        this.damageEffects.forEach((damageEffectObject, damageEffectName) => {
            // get resistance of the enemy if he has resistance for the damage effect
            const targetResistanceStat = target.DamageResistancesController.GetDamageResistance({
                resistanceType: damageEffectName,
            });

            // Short Term Damage Effect
            if (damageEffectObject.Damage) {
                const effectDamage = damageEffectObject.Damage({
                    target: target,
                    targetResistanceStat,
                    baseDamage: projectileDamage,
                });
                damage += effectDamage;
            }
        });

        return damage;
    }

    private applyLongTermDamageEffect(parameters: { target: IEnemy; projectileDamage: number }) {
        const { target, projectileDamage } = parameters;
        this.damageEffects.forEach((damageEffectObject, damageEffectName) => {
            const { DamageType } = damageEffectObject;

            // need to apply resistance if there are resistances
            const targetResistanceStat = target.DamageResistancesController.GetDamageResistance({
                resistanceType: damageEffectName,
            });
            // Long Term Damage Effect
            if (damageEffectObject.Effect) {
                // get the long term effect of the damage effect
                const effect = damageEffectObject.Effect({
                    target: target,
                    targetResistanceStat,
                    baseDamage: projectileDamage,
                });

                // apply the damage effect to the enemy state
                ServiceLocator.GetService<IServiceWaveManager>('WaveManager').AddEnemyDamageState({
                    target: target,
                    effect,
                    effectType: DamageType,
                });
            }
        });
    }

    private applyBaseDamageResistance(parameters: { target: IEnemy }): number {
        const { target } = parameters;
        let damage = this.baseDamage;

        const targetResistanceStat = target.DamageResistancesController.GetDamageResistance({
            resistanceType: 'BaseDamage',
        });

        const damageToApply = damage - damage * (targetResistanceStat / 100);

        if (damageToApply <= 0) {
            damage = 0;
        } else {
            damage = damageToApply;
        }

        return damage;
    }
}
