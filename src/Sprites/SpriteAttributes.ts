// generally used for bullets
export interface ISpriteWithDamage {
    Damage: number;
}
// if a sprite has a stat that can influence the damage he does
export interface ISpriteWithDamageUpgrades {
    DamageUpgrades: number[];
}

export interface ISpriteWithHealth {
    BaseHealth: number;
    MaxHealth: number;
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
