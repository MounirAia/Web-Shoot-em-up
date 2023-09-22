import { ISpriteWithStateController } from '../../SpriteAttributes.js';
import { DamageEffectOptions, IDamageEffect } from './IDamageEffect.js';

export class ExplosiveDamageEffect implements IDamageEffect {
    private baseDamage: number;
    private explosiveEffectStat: number;

    constructor(parameters: { baseDamage: number; explosiveEffectStat: number }) {
        const { baseDamage, explosiveEffectStat } = parameters;
        this.baseDamage = baseDamage;
        this.explosiveEffectStat = explosiveEffectStat;
    }

    public get DamageType(): DamageEffectOptions {
        return 'Explosive';
    }

    public Damage(parameters: { target: ISpriteWithStateController; targetResistanceStat?: number }): number {
        const { target, targetResistanceStat = 0 } = parameters;
        target.StatesController.PlayState({ stateName: 'onExplosion' });
        console.log('Stat: ', this.explosiveEffectStat);
        return this.baseDamage * (Math.max(0, this.explosiveEffectStat - targetResistanceStat) / 100);
    }
}
