import { ISpriteWithAnimationController, ISpriteWithStateController } from '../../SpriteAttributes.js';
import { ISpriteWithHitboxes } from '../../SpriteHitbox.js';

export type DamageEffectOptions = 'Explosive' | 'Energy' | 'Corrosive' | '';

export type DamageEffectFunctionReturnType = (dt: number) => { isFinished: boolean };

export interface IDamageEffect {
    Damage?: (parameters: { target: ISpriteWithStateController; targetResistanceStat?: number }) => number;
    Effect?: (parameters: {
        target: ISpriteWithStateController & ISpriteWithHitboxes & ISpriteWithAnimationController;
        targetResistanceStat?: number;
    }) => DamageEffectFunctionReturnType;
    DamageType: DamageEffectOptions;
}
