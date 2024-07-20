import { IEnemy } from '../Sprites/Enemies/IEnemy.js';
import {
    DamageEffectFunctionReturnType,
    DamageEffectOptions,
} from '../Sprites/PlayerSkills/DamageEffect/IDamageEffect.js';
import { GetSpriteStaticInformation } from '../SpriteStaticInformation/SpriteStaticInformationManager.js';

const FuelChargeShotLaserConstant = GetSpriteStaticInformation({ sprite: 'FuelChargeShot' }).constant
    .FuelChargeShotLaser;

export class WaveEnemiesDamageStateTracker {
    private listEnemiesState: Map<IEnemy, Map<DamageEffectOptions, DamageEffectFunctionReturnType[]>>;
    private static readonly damageEffectsMaximumStack: ReadonlyMap<DamageEffectOptions, number> = new Map([
        ['Corrosive', 2],
        ['FuelChargeShotLaserLevel1', FuelChargeShotLaserConstant[0]['Maximum Number of Stack Effect']],
        ['FuelChargeShotLaserLevel2', FuelChargeShotLaserConstant[1]['Maximum Number of Stack Effect']],
        ['FuelChargeShotLaserLevel3', FuelChargeShotLaserConstant[2]['Maximum Number of Stack Effect']],
    ]);

    constructor() {
        this.listEnemiesState = new Map();
    }

    public Update(dt: number) {
        this.listEnemiesState.forEach((effectFunctionsMap, enemy) => {
            effectFunctionsMap.forEach((effectFunctionsList, effectType) => {
                effectFunctionsList.forEach((effectObject) => {
                    if (effectObject.effect) {
                        const { isFinished } = effectObject.effect(dt);
                        if (isFinished) {
                            this.RemoveState({ target: enemy, effect: effectObject, effectType });
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
            // The target has already a state tracker bind to it
            const currentEffectArray = currentEffectsMap.get(effectType);
            if (currentEffectArray) {
                // the target has already effects with the given effect type bind to it
                const maximumStack = WaveEnemiesDamageStateTracker.damageEffectsMaximumStack.get(effectType);
                // only push an effect if there is an effect to push -> no effect method means empty {} return from the Effect damage effect method
                if (effect.effect) currentEffectArray.push(effect);
                if (maximumStack && currentEffectArray.length > maximumStack) {
                    this.RemoveState({ target, effect: currentEffectArray[0], effectType });
                }
            } else {
                // the target has no effect of the given type bind to it
                currentEffectsMap.set(effectType, [effect]);
            }
        } else {
            // the target has no state tracker bind to, create one first
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
                    if (effectObject[0].clearStateMethod) {
                        effectObject[0].clearStateMethod();
                    }
                }
            }
        }
    }

    public RemoveEnemyStateTracker(parameters: { enemy: IEnemy }) {
        const { enemy } = parameters;
        this.listEnemiesState.delete(enemy);
    }
}
