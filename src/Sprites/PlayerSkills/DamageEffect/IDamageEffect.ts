import { IEnemy } from '../../Enemies/IEnemy.js';
import { ISpriteWithAnimationController, ISpriteWithStateController } from '../../SpriteAttributes.js';
import { ISpriteWithHitboxes } from '../../SpriteHitbox.js';

export type DamageEffectOptions = 'Explosive' | 'Energy' | 'Corrosive' | 'BaseDamage' | 'FuelChargeShotLaserLevel1';
export type EffectMethodTargetParameters = ISpriteWithStateController &
    ISpriteWithHitboxes &
    ISpriteWithAnimationController;

export type DamageEffectFunctionReturnType = {
    effect: (dt: number) => { isFinished: boolean };
    clearStateMethod?: () => void;
};

export interface IDamageEffect {
    Damage?: (parameters: { target: IEnemy; baseDamage: number; targetResistanceStat?: number }) => number;
    Effect?: (parameters: {
        target: IEnemy;
        baseDamage: number;
        targetResistanceStat?: number;
    }) => DamageEffectFunctionReturnType;
    DamageType: DamageEffectOptions;
}
