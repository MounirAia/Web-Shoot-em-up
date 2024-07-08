import { IEnemy } from '../../Enemies/IEnemy.js';
import { DamageEffectOptions, IDamageEffect } from './IDamageEffect.js';

export class EnergyDamageEffect implements IDamageEffect {
    private probabilityOfCriticalHit: number;
    private static readonly criticalDamageMultiplier = 3;
    constructor(parameters: { probabilityOfCriticalHit: number }) {
        const { probabilityOfCriticalHit } = parameters;

        this.probabilityOfCriticalHit = probabilityOfCriticalHit;
    }

    public get DamageType(): DamageEffectOptions {
        return 'Energy';
    }

    public Damage(parameters: { target: IEnemy; baseDamage: number; targetResistanceStat?: number }): number {
        const { target, baseDamage, targetResistanceStat = 0 } = parameters;
        const rndNumber = Math.random();
        if (Math.max(0, this.probabilityOfCriticalHit - targetResistanceStat) / 100 >= rndNumber) {
            target.StatesController.PlayState({ stateName: 'onEnergy' });
            return baseDamage * (EnergyDamageEffect.criticalDamageMultiplier - 1);
        }
        return 0;
    }
}
