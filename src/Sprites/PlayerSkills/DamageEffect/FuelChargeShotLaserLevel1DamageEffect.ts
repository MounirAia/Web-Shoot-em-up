import { IEnemy } from '../../Enemies/IEnemy.js';
import { DamageEffectFunctionReturnType, DamageEffectOptions, IDamageEffect } from './IDamageEffect.js';

export class FuelChargeShotLaserLevel1DamageEffect implements IDamageEffect {
    private resistanceStatDebuf: number;
    private moneyValueGained: number;
    private static readonly timeDurationEffect = 1;
    private readonly enemyTouched: IEnemy[];

    constructor(parameters: { resistanceStatDebuf: number; moneyValueGained: number }) {
        const { resistanceStatDebuf, moneyValueGained } = parameters;
        this.resistanceStatDebuf = resistanceStatDebuf;
        this.moneyValueGained = moneyValueGained;
        this.enemyTouched = [];
    }

    get DamageType(): DamageEffectOptions {
        return 'FuelChargeShotLaserLevel1';
    }

    public Effect(parameters: {
        target: IEnemy;
        baseDamage: number;
        targetResistanceStat?: number;
    }): DamageEffectFunctionReturnType {
        const { target } = parameters;

        // Verify if the target was not already touched by the laser
        if (this.enemyTouched.indexOf(target) === -1) {
            let remainingEffectTime = FuelChargeShotLaserLevel1DamageEffect.timeDurationEffect;

            let effectIsApplied = false;

            // make the laser can tag an enemy only once
            this.enemyTouched.push(target);

            const effectMethod = (dt: number): { isFinished: boolean } => {
                // Apply the effect only once
                if (!effectIsApplied) {
                    // Add a debuf on the target
                    target.DamageResistancesController.AddDamageResistance({
                        resistanceType: 'BaseDamage',
                        resistanceStat: this.resistanceStatDebuf,
                    });

                    target.MoneyValue = target.MoneyValue + this.moneyValueGained;
                    effectIsApplied = true;

                    target.StatesController.PlayState({
                        stateName: 'onFuelChargeShot',
                        duration: FuelChargeShotLaserLevel1DamageEffect.timeDurationEffect,
                    });
                }

                remainingEffectTime -= dt;

                if (remainingEffectTime <= 0) return { isFinished: true };

                return { isFinished: false };
            };

            const clearStateMethod = () => {
                target.DamageResistancesController.RemoveDamageResistance({
                    resistanceType: 'BaseDamage',
                    resistanceStat: this.resistanceStatDebuf,
                });
                target.MoneyValue = target.MoneyValue - this.moneyValueGained;
            };

            return { effect: effectMethod, clearStateMethod };
        }
        return {};
    }
}
