import { DamageEffectOptions } from './PlayerSkills/DamageEffect/IDamageEffect.js';

export class SpriteDamageResistancesController {
    private damageResistances: Map<DamageEffectOptions, number[]>;

    constructor() {
        this.damageResistances = new Map();
    }

    public AddDamageResistance(parameters: { resistanceType: DamageEffectOptions; resistanceStat: number }) {
        const { resistanceType, resistanceStat } = parameters;
        const resistances = this.damageResistances.get(resistanceType);
        if (resistances) {
            resistances.push(resistanceStat);
        } else {
            this.damageResistances.set(resistanceType, [resistanceStat]);
        }
    }

    public GetDamageResistance(parameters: { resistanceType: DamageEffectOptions }) {
        const { resistanceType } = parameters;
        const resistances = this.damageResistances.get(resistanceType);
        if (resistances) {
            return resistances.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        }

        return 0;
    }
}
