import { IEnemy } from '../../Enemies/IEnemy.js';
import { DamageEffectFunctionReturnType, DamageEffectOptions, IDamageEffect } from './IDamageEffect.js';

export class CorrosiveDamageEffect implements IDamageEffect {
    private corrosiveEffectStat: number;
    private static readonly timeDurationEffect = 1;

    constructor(parameters: { corrosiveEffectStat: number }) {
        const { corrosiveEffectStat } = parameters;

        this.corrosiveEffectStat = corrosiveEffectStat;
    }

    public get DamageType(): DamageEffectOptions {
        return 'Corrosive';
    }

    Effect(parameters: {
        target: IEnemy;
        baseDamage: number;
        targetResistanceStat?: number;
    }): DamageEffectFunctionReturnType {
        // Create a method that removes HP to the enemy
        const { target, baseDamage, targetResistanceStat = 0 } = parameters;
        const maxNumberOfTick = 5;
        let currentTick = maxNumberOfTick;

        const intervalTimeBeforeNextTick = CorrosiveDamageEffect.timeDurationEffect / maxNumberOfTick;
        let currentTimeBeforeNextTick = 0;

        const corrosiveStatToApply = (this.corrosiveEffectStat - targetResistanceStat) / 100;

        target.StatesController.PlayState({
            stateName: 'onCorrosion',
            duration: CorrosiveDamageEffect.timeDurationEffect,
        });

        const effectMethod = (dt: number): { isFinished: boolean } => {
            if (currentTick > 0 && target.AnimationsController.CurrentAnimationName !== 'destroyed') {
                if (currentTimeBeforeNextTick <= 0) {
                    const targetCollisionMethod = target.Collide.get('WithProjectile');

                    if (targetCollisionMethod) {
                        const damageToApply = baseDamage + baseDamage * corrosiveStatToApply;
                        targetCollisionMethod(damageToApply);
                    }
                    currentTick = currentTick - 1;

                    currentTimeBeforeNextTick = intervalTimeBeforeNextTick;
                }

                currentTimeBeforeNextTick -= dt;
                return { isFinished: false };
            }

            return { isFinished: true };
        };

        return { effect: effectMethod };
    }
}
