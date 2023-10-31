import { ServiceLocator } from '../../../ServiceLocator.js';
import { IServiceWaveManager } from '../../../WaveManager/WaveManager.js';
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

            target.DamageResistancesController.AddDamageResistance({
                resistanceType: 'BaseDamage',
                resistanceStat: this.resistanceStatDebuf,
            });

            target.MoneyValue = target.MoneyValue + this.moneyValueGained;

            target.StatesController.PlayState({
                stateName: 'onFuelChargeShot',
                duration: FuelChargeShotLaserLevel1DamageEffect.timeDurationEffect,
            });

            // make the laser can tag an enemy only once
            this.enemyTouched.push(target);

            const effectMethod = (dt: number): { isFinished: boolean } => {
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

export class FuelChargeShotLaserLevel2DamageEffect implements IDamageEffect {
    private static readonly timeDurationEffect = 1;
    private readonly enemyTouched: IEnemy[];
    private readonly fuelChargeShotLaserLevel1DamageEffect: FuelChargeShotLaserLevel1DamageEffect;
    constructor(parameters: { resistanceStatDebuf: number; moneyValueGained: number }) {
        const { resistanceStatDebuf, moneyValueGained } = parameters;
        this.fuelChargeShotLaserLevel1DamageEffect = new FuelChargeShotLaserLevel1DamageEffect({
            resistanceStatDebuf,
            moneyValueGained,
        });
        this.enemyTouched = [];
    }

    get DamageType(): DamageEffectOptions {
        return 'FuelChargeShotLaserLevel2';
    }

    public Effect(parameters: {
        target: IEnemy;
        baseDamage: number;
        targetResistanceStat?: number;
    }): DamageEffectFunctionReturnType {
        const { target, baseDamage, targetResistanceStat } = parameters;

        // Verify if the target was not already touched by the laser
        if (this.enemyTouched.indexOf(target) === -1) {
            // get the effect of the level1 damage effect
            const level1Effect = this.fuelChargeShotLaserLevel1DamageEffect.Effect({
                target,
                baseDamage,
                targetResistanceStat,
            });

            let remainingEffectTime = FuelChargeShotLaserLevel2DamageEffect.timeDurationEffect;

            // Play the idle animation of the monster to paralyze the enemy
            ServiceLocator.GetService<IServiceWaveManager>('WaveManager').PlayEnemyAnimation({
                target,
                animationName: 'idle',
            });

            let effectIsApplied = false;

            // make the laser can tag an enemy only once
            this.enemyTouched.push(target);

            const effectMethod = (dt: number): { isFinished: boolean } => {
                if (!effectIsApplied) {
                    // get the effect of the level1 damage effect
                    level1Effect.effect?.(dt);
                    effectIsApplied = true;
                }

                const currentTargetAnimation = ServiceLocator.GetService<IServiceWaveManager>(
                    'WaveManager',
                ).GetEnemyAnimation({ target });
                if (currentTargetAnimation && currentTargetAnimation !== 'idle') {
                    // Play the idle animation of the monster to paralyze the enemy
                    ServiceLocator.GetService<IServiceWaveManager>('WaveManager').PlayEnemyAnimation({
                        target,
                        animationName: 'idle',
                    });
                }

                remainingEffectTime -= dt;

                if (remainingEffectTime <= 0) return { isFinished: true };

                return { isFinished: false };
            };

            const clearStateMethod = () => {
                level1Effect.clearStateMethod?.();

                // play the shooting animation of the enemy
                ServiceLocator.GetService<IServiceWaveManager>('WaveManager').PlayEnemyAnimation({
                    target,
                    animationName: 'shooting',
                });
            };

            return { effect: effectMethod, clearStateMethod };
        }
        return {};
    }
}

export class FuelChargeShotLaserLevel3DamageEffect implements IDamageEffect {
    private static readonly timeDurationEffect = 1;
    private readonly enemyTouched: IEnemy[];
    private readonly fuelChargeShotLaserLevel2DamageEffect: FuelChargeShotLaserLevel2DamageEffect;
    private readonly explosiveResistanceDebuf: number;
    private readonly energyResistanceDebuf: number;
    private readonly corrosiveResistanceDebuf: number;

    constructor(parameters: {
        resistanceStatDebuf: number;
        moneyValueGained: number;
        explosiveResistanceDebuf: number;
        energyResistanceDebuf: number;
        corrosiveResistanceDebuf: number;
    }) {
        const {
            resistanceStatDebuf,
            moneyValueGained,
            explosiveResistanceDebuf,
            energyResistanceDebuf,
            corrosiveResistanceDebuf,
        } = parameters;
        this.fuelChargeShotLaserLevel2DamageEffect = new FuelChargeShotLaserLevel2DamageEffect({
            resistanceStatDebuf,
            moneyValueGained,
        });
        this.enemyTouched = [];

        this.explosiveResistanceDebuf = explosiveResistanceDebuf;
        this.energyResistanceDebuf = energyResistanceDebuf;
        this.corrosiveResistanceDebuf = corrosiveResistanceDebuf;
    }

    get DamageType(): DamageEffectOptions {
        return 'FuelChargeShotLaserLevel3';
    }

    public Effect(parameters: {
        target: IEnemy;
        baseDamage: number;
        targetResistanceStat?: number;
    }): DamageEffectFunctionReturnType {
        const { target, baseDamage, targetResistanceStat } = parameters;

        // Verify if the target was not already touched by the laser
        if (this.enemyTouched.indexOf(target) === -1) {
            // get the effect of the level1 damage effect
            const level2Effect = this.fuelChargeShotLaserLevel2DamageEffect.Effect({
                target,
                baseDamage,
                targetResistanceStat,
            });

            let remainingEffectTime = FuelChargeShotLaserLevel3DamageEffect.timeDurationEffect;

            let effectIsApplied = false;

            // make the laser can tag an enemy only once
            this.enemyTouched.push(target);

            const effectMethod = (dt: number): { isFinished: boolean } => {
                if (!effectIsApplied) {
                    // get the effect of the level1 damage effect
                    level2Effect.effect?.(dt);

                    target.DamageResistancesController.AddDamageResistance({
                        resistanceType: 'Explosive',
                        resistanceStat: this.explosiveResistanceDebuf,
                    });

                    target.DamageResistancesController.AddDamageResistance({
                        resistanceType: 'Energy',
                        resistanceStat: this.energyResistanceDebuf,
                    });

                    target.DamageResistancesController.AddDamageResistance({
                        resistanceType: 'Corrosive',
                        resistanceStat: this.corrosiveResistanceDebuf,
                    });

                    effectIsApplied = true;
                }

                remainingEffectTime -= dt;

                if (remainingEffectTime <= 0) return { isFinished: true };

                return { isFinished: false };
            };

            const clearStateMethod = () => {
                level2Effect.clearStateMethod?.();

                target.DamageResistancesController.RemoveDamageResistance({
                    resistanceType: 'Explosive',
                    resistanceStat: this.explosiveResistanceDebuf,
                });

                target.DamageResistancesController.RemoveDamageResistance({
                    resistanceType: 'Energy',
                    resistanceStat: this.energyResistanceDebuf,
                });

                target.DamageResistancesController.RemoveDamageResistance({
                    resistanceType: 'Corrosive',
                    resistanceStat: this.corrosiveResistanceDebuf,
                });
            };

            return { effect: effectMethod, clearStateMethod };
        }
        return {};
    }
}
