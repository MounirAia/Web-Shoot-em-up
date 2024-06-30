export type PossibleSkillName = 'Rocket' | 'Blade' | 'MirrorShield' | 'FuelChargeShot';
export type SkillsTypeName = 'special' | 'support' | 'effect';

export interface ISkill {
    Type: SkillsTypeName;
    SkillName: PossibleSkillName;
    Effect: () => void;
    AttackSpeed?: () => void;
}
