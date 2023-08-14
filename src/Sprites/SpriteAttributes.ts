export interface ISpriteWithUpdateAndDraw {
    Update: (dt: number) => void;
    Draw: (ctx: CanvasRenderingContext2D) => void;
}

export type DamageEffectOptions = 'Explosive' | 'Energy' | 'Corrosive' | '';
export interface ISpriteWithDamage {
    Damage: number;
    PrimaryEffect: DamageEffectOptions;
    SecondaryEffect: DamageEffectOptions;
    PrimaryEffectStat: number;
    SecondaryEffectStat: number;
}

export interface ISpriteWithDamageResistance {
    EffectDebufName: DamageEffectOptions;
    EffectDebufStat: number;
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
    CanShoot?: boolean;
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
