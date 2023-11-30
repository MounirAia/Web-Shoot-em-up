import { ServiceLocator } from '../../../ServiceLocator.js';
import { FuelChargeShotLaserConstant } from '../../../StatsJSON/Skills/Support/FuelChargeShot/FuelChargeShotConstant.js';
import { FuelChargeShotDamage } from '../../../StatsJSON/Skills/Support/FuelChargeShot/FuelChargeShotDamage.js';
import { IServiceWaveManager } from '../../../WaveManager/WaveManager.js';
import { IEnemy } from '../../Enemies/IEnemy.js';
import { IServicePlayer } from '../../Player.js';
import { DamageEffectFunctionReturnType, DamageEffectOptions, IDamageEffect } from './IDamageEffect.js';

export class FuelChargeShotLaserLevel1DamageEffect implements IDamageEffect {
    private resistanceStatDebuf: number;
    private moneyValueGainedStat: number;
    private static readonly timeDurationEffect = FuelChargeShotLaserConstant[0]['Effect Length (s)'];
    private readonly enemyTouched: IEnemy[];

    constructor(parameters: { resistanceStatDebuf: number; moneyValueGainedStat: number }) {
        const { resistanceStatDebuf, moneyValueGainedStat } = parameters;
        this.resistanceStatDebuf = resistanceStatDebuf;
        this.moneyValueGainedStat = moneyValueGainedStat / 100;
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
            const moneyValueGained = target.MoneyValue * this.moneyValueGainedStat;
            target.MoneyValue += moneyValueGained;

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
                target.MoneyValue -= moneyValueGained;
            };

            return { effect: effectMethod, clearStateMethod };
        }
        return {};
    }
}

export class FuelChargeShotLaserLevel2DamageEffect implements IDamageEffect {
    private static readonly timeDurationEffect = FuelChargeShotLaserConstant[1]['Effect Length (s)'];
    private static probabilityOfParalyze: number;
    private readonly enemyTouched: IEnemy[];
    private readonly fuelChargeShotLaserLevel1DamageEffect: FuelChargeShotLaserLevel1DamageEffect;

    constructor(parameters: { resistanceStatDebuf: number; moneyValueGainedStat: number }) {
        const { resistanceStatDebuf, moneyValueGainedStat } = parameters;
        this.fuelChargeShotLaserLevel1DamageEffect = new FuelChargeShotLaserLevel1DamageEffect({
            resistanceStatDebuf,
            moneyValueGainedStat,
        });
        this.enemyTouched = [];

        const damageInfo = FuelChargeShotDamage[ServiceLocator.GetService<IServicePlayer>('Player').NumberOfBoosts];
        FuelChargeShotLaserLevel2DamageEffect.probabilityOfParalyze =
            damageInfo['Laser Level 2 Paralyze Probability (%)'] / 100;
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
            // make the laser can tag an enemy only once
            this.enemyTouched.push(target);

            // get the effect of the level1 damage effect
            const level1Effect = this.fuelChargeShotLaserLevel1DamageEffect.Effect({
                target,
                baseDamage,
                targetResistanceStat,
            });

            let remainingEffectTime = FuelChargeShotLaserLevel2DamageEffect.timeDurationEffect;

            const applyParalyze = Math.random() <= FuelChargeShotLaserLevel2DamageEffect.probabilityOfParalyze;

            // Play the idle animation of the monster to paralyze the enemy
            if (applyParalyze) {
                ServiceLocator.GetService<IServiceWaveManager>('WaveManager').ParalyzeEnemy({ target });
            }

            const effectMethod = (dt: number): { isFinished: boolean } => {
                // apply the effect of the level1 damage effect
                level1Effect.effect?.(dt);

                if (applyParalyze) {
                    ServiceLocator.GetService<IServiceWaveManager>('WaveManager').ParalyzeEnemy({ target });
                }

                remainingEffectTime -= dt;

                if (remainingEffectTime <= 0) return { isFinished: true };

                return { isFinished: false };
            };

            const clearStateMethod = () => {
                level1Effect.clearStateMethod?.();

                if (applyParalyze) {
                    // play the shooting animation of the enemy
                    ServiceLocator.GetService<IServiceWaveManager>('WaveManager').StopParalyzeEnemy({ target });
                }
            };

            return { effect: effectMethod, clearStateMethod };
        }
        return {};
    }
}

export class FuelChargeShotLaserLevel3DamageEffect implements IDamageEffect {
    private static readonly timeDurationEffect = FuelChargeShotLaserConstant[2]['Effect Length (s)'];
    private readonly enemyTouched: IEnemy[];
    private readonly fuelChargeShotLaserLevel2DamageEffect: FuelChargeShotLaserLevel2DamageEffect;
    private readonly explosiveResistanceDebuf: number;
    private readonly energyResistanceDebuf: number;

    constructor(parameters: {
        resistanceStatDebuf: number;
        moneyValueGainedStat: number;
        explosiveResistanceDebuf: number;
        energyResistanceDebuf: number;
    }) {
        const { resistanceStatDebuf, moneyValueGainedStat, explosiveResistanceDebuf, energyResistanceDebuf } =
            parameters;
        this.fuelChargeShotLaserLevel2DamageEffect = new FuelChargeShotLaserLevel2DamageEffect({
            resistanceStatDebuf,
            moneyValueGainedStat,
        });
        this.enemyTouched = [];

        this.explosiveResistanceDebuf = explosiveResistanceDebuf;
        this.energyResistanceDebuf = energyResistanceDebuf;
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
            // make the laser can tag an enemy only once
            this.enemyTouched.push(target);

            // get the effect of the level2 damage effect
            const level2Effect = this.fuelChargeShotLaserLevel2DamageEffect.Effect({
                target,
                baseDamage,
                targetResistanceStat,
            });

            target.DamageResistancesController.AddDamageResistance({
                resistanceType: 'Explosive',
                resistanceStat: this.explosiveResistanceDebuf,
            });

            target.DamageResistancesController.AddDamageResistance({
                resistanceType: 'Energy',
                resistanceStat: this.energyResistanceDebuf,
            });

            let remainingEffectTime = FuelChargeShotLaserLevel3DamageEffect.timeDurationEffect;

            const effectMethod = (dt: number): { isFinished: boolean } => {
                // get the effect of the level2 damage effect
                level2Effect.effect?.(dt);

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
            };

            return { effect: effectMethod, clearStateMethod };
        }
        return {};
    }
}
