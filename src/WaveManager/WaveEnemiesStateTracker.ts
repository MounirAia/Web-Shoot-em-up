import { IEnemy } from '../Sprites/Enemies/IEnemy.js';
import {
    DamageEffectFunctionReturnType,
    DamageEffectOptions,
} from '../Sprites/PlayerSkills/DamageEffect/IDamageEffect.js';

export class WaveEnemiesDamageStateTracker {
    private listEnemiesState: Map<IEnemy, Map<DamageEffectOptions, DamageEffectFunctionReturnType[]>>;
    private static readonly damageEffectsMaximumStack: ReadonlyMap<DamageEffectOptions, number> = new Map([
        ['Corrosive', 2],
    ]);

    constructor() {
        this.listEnemiesState = new Map();
    }

    public Update(dt: number) {
        this.listEnemiesState.forEach((effectFunctionsMap, enemy) => {
            effectFunctionsMap.forEach((effectFunctionsList, effectType) => {
                effectFunctionsList.forEach((effectObject) => {
                    const { effect: effectMethod, clearStateMethod } = effectObject;
                    const { isFinished } = effectMethod(dt);
                    if (isFinished) {
                        this.RemoveState({ target: enemy, effect: effectObject, effectType });

                        if (clearStateMethod) {
                            clearStateMethod();
                        }
                    }
                });
            });
        });
    }

    public AddState(parameters: {
        target: IEnemy;
        effect: DamageEffectFunctionReturnType;
        effectType: DamageEffectOptions;
    }) {
        const { target, effect, effectType } = parameters;
        const currentEffectsMap = this.listEnemiesState.get(target);

        if (currentEffectsMap) {
            const currentEffectArray = currentEffectsMap.get(effectType);
            if (currentEffectArray) {
                const maximumStack = WaveEnemiesDamageStateTracker.damageEffectsMaximumStack.get(effectType);
                currentEffectArray.push(effect);
                if (maximumStack && currentEffectArray.length > maximumStack) {
                    this.RemoveState({ target, effect: currentEffectArray[0], effectType });
                }
            } else {
                currentEffectsMap.set(effectType, [effect]);
            }
        } else {
            this.listEnemiesState.set(target, new Map([[effectType, [effect]]]));
        }
    }

    public RemoveState(parameters: {
        target: IEnemy;
        effect: DamageEffectFunctionReturnType;
        effectType: DamageEffectOptions;
    }) {
        const { target, effect, effectType } = parameters;
        const currentEffectsList = this.listEnemiesState.get(target);

        if (currentEffectsList) {
            const indexToRemove = currentEffectsList.get(effectType)?.indexOf(effect);
            if (indexToRemove !== undefined && indexToRemove > -1) {
                const effectObject = currentEffectsList.get(effectType)?.splice(indexToRemove, 1);
                if (effectObject) {
                    const { clearStateMethod } = effectObject[0];
                    if (clearStateMethod) {
                        clearStateMethod();
                    }
                }
            }
        }
    }
}
