import { IEnemy } from '../../Enemies/IEnemy.js';
import { DamageEffectFunctionReturnType, DamageEffectOptions, IDamageEffect } from './IDamageEffect.js';

export class CorrosiveDamageEffect implements IDamageEffect {
    private static readonly timeDurationEffect = 1;
    private static readonly maxNumberOfTick = 5;
    private readonly enemyTouched: IEnemy[];
    private damageToApplyForWholeEffect;

    constructor(parameters: { damageToApplyForWholeEffect: number }) {
        const { damageToApplyForWholeEffect } = parameters;

        this.damageToApplyForWholeEffect = damageToApplyForWholeEffect;
        this.enemyTouched = [];
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
        const { target, targetResistanceStat = 0 } = parameters;

        if (this.enemyTouched.indexOf(target) === -1) {
            // make the corrosive effect of a specific projectile can only be applied once to an entity
            this.enemyTouched.push(target);

            let currentTick = CorrosiveDamageEffect.maxNumberOfTick;

            const intervalTimeBeforeNextTick =
                CorrosiveDamageEffect.timeDurationEffect / CorrosiveDamageEffect.maxNumberOfTick;
            let currentTimeBeforeNextTick = 0;

            this.damageToApplyForWholeEffect =
                this.damageToApplyForWholeEffect - (targetResistanceStat / 100) * this.damageToApplyForWholeEffect;

            target.StatesController.PlayState({
                stateName: 'onCorrosion',
                duration: CorrosiveDamageEffect.timeDurationEffect,
            });

            const damageToApplyPerTick = this.damageToApplyForWholeEffect / CorrosiveDamageEffect.maxNumberOfTick;

            const effectMethod = (dt: number): { isFinished: boolean } => {
                if (currentTick > 0 && target.AnimationsController.CurrentAnimationName !== 'destroyed') {
                    if (currentTimeBeforeNextTick <= 0) {
                        const targetCollisionMethod = target.Collide.get('WithProjectile');

                        if (targetCollisionMethod) {
                            targetCollisionMethod(damageToApplyPerTick);
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

        return {};
    }
}
