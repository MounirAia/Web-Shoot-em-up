import { PlayerProjectileDamageEffectController } from './PlayerProjectileDamageEffectsController.js';
import { SpriteAnimationsController } from './SpriteAnimationsController.js';
import { SpriteDamageResistancesController } from './SpriteDamageResistancesController.js';
import { SpriteStatesController } from './SpriteStatesController.js';

export interface ISpriteWithUpdateAndDraw {
    Update: (dt: number) => void;
    Draw: (ctx: CanvasRenderingContext2D) => void;
}

export interface ISpriteWithStateController {
    StatesController: SpriteStatesController;
}

export interface ISpriteWithAnimationController {
    AnimationsController: SpriteAnimationsController;
}

export interface ISpriteWithDamage {
    Damage: number;
}

export interface ISpriteWithDamageEffects {
    DamageEffectsController: PlayerProjectileDamageEffectController;
}

export interface ISpriteWithDamageResistance {
    DamageResistancesController: SpriteDamageResistancesController;
}

// if a sprite has a stat that can influence the damage he does
export interface ISpriteWithDamageUpgrades {
    DamageUpgrades: number[];
}

export interface ISpriteWithHealth {
    BaseHealth: number;
    MaxHealth?: number;
    CurrentHealth: number;
}
export interface ISpriteWithHealthUpgrades {
    HealthUpgrades: number[];
}

export interface ISpriteWithAttackSpeed {
    BaseAttackSpeed: number;
    AttackSpeed: number;
    CanShootRegular?: boolean;
}
export interface ISpriteWithAttackSpeedUpgrades {
    AttackSpeedUpgrades: number[];
}

// Make a sprite movable, by enforcing it to have a speed (pixel/second)
export interface ISpriteWithSpeed {
    BaseSpeed: number;
}

export interface ISpriteWithTarget {
    TargetAngle: number;
    XSpeed: number;
    YSpeed: number;
}
