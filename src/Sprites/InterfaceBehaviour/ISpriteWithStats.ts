// generally used for bullets
export interface ISpriteWithBaseDamage {
    BaseDamage: number;
    Damage: number;
}
// if a sprite has a stat that can influence the damage he does
export interface ISpriteWithDamageUpgrades {
    DamageUpgrades: number[];
}

export interface ISpriteWithBaseHealth {
    BaseHealth: number;
    MaxHealth: number;
    CurrentHealth: number;
}
export interface ISpriteWithHealthUpgrades {
    HealthUpgrades: number[];
}

export interface ISpriteWithBaseAttackSpeed {
    BaseAttackSpeed: number;
    AttackSpeed: number;
    CanShoot?: boolean;
}
export interface ISpriteWithAttackSpeedUpgrades {
    AttackSpeedUpgrades: number[];
}
