export type PossibleSkillName = 'Rocket' | 'Blade';
export type SkillsTypeName = 'special' | 'support' | 'effect';

export interface ISkill {
    Type: SkillsTypeName;
    SkillName: PossibleSkillName;
    Effect: () => void;
}
