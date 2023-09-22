import { ISpriteWithStateController } from '../../SpriteAttributes.js';
import { DamageEffectOptions, IDamageEffect } from './IDamageEffect.js';

export class EnergyDamageEffect implements IDamageEffect {
    private baseDamage: number;
    private probabilityOfCriticalHit: number;
    private static readonly criticalDamageMultiplier = 3;
    constructor(parameters: { baseDamage: number; probabilityOfCriticalHit: number }) {
        const { baseDamage, probabilityOfCriticalHit } = parameters;
        this.baseDamage = baseDamage;
        this.probabilityOfCriticalHit = probabilityOfCriticalHit;
    }

    public get DamageType(): DamageEffectOptions {
        return 'Energy';
    }

    public Damage(parameters: { target: ISpriteWithStateController; targetResistanceStat?: number }): number {
        const { target, targetResistanceStat = 0 } = parameters;
        const rndNumber = Math.random();
        target.StatesController.PlayState({ stateName: 'onEnergy' });
        if (Math.max(0, this.probabilityOfCriticalHit - targetResistanceStat) / 100 >= rndNumber) {
            return this.baseDamage * (EnergyDamageEffect.criticalDamageMultiplier - 1);
        }
        return 0;
    }
}
