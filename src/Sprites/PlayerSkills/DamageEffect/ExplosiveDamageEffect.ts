import { IEnemy } from '../../Enemies/IEnemy.js';
import { DamageEffectOptions, IDamageEffect } from './IDamageEffect.js';

export class ExplosiveDamageEffect implements IDamageEffect {
    private explosiveEffectStat: number;

    constructor(parameters: { explosiveEffectStat: number }) {
        const { explosiveEffectStat } = parameters;

        this.explosiveEffectStat = explosiveEffectStat;
    }

    public get DamageType(): DamageEffectOptions {
        return 'Explosive';
    }

    public Damage(parameters: { target: IEnemy; baseDamage: number; targetResistanceStat?: number }): number {
        const { target, baseDamage, targetResistanceStat = 0 } = parameters;
        target.StatesController.PlayState({ stateName: 'onExplosion' });
        console.log('Stat: ', this.explosiveEffectStat);
        return baseDamage * (Math.max(0, this.explosiveEffectStat - targetResistanceStat) / 100);
    }
}
