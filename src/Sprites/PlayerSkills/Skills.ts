import { BladeExplosionSkill } from './Effect/BladeExplosionSkill';
import { RocketSkill } from './Special/RocketSkill';
import { FuelChargeShotSkill } from './Support/FuelChargeShot/FuelChargeShot';
import { MirrorShieldSkill } from './Support/MirrorShield/MirrorShield';

export type PossibleSkillName = 'Rocket' | 'Blade' | 'MirrorShield' | 'FuelChargeShot';
export type PossibleSkillLevel = 0 | 1 | 2 | 3;
export type SkillsTypeName = 'special' | 'support' | 'effect';

export interface ISkill {
    Type: SkillsTypeName;
    SkillName: PossibleSkillName;
    Effect: () => void;
    AttackSpeed?: () => void;
    ClearSkillSprite?: () => void;
}

export class SkillFactory {
    constructor() {}

    GetSkill(parameters: { skillName: PossibleSkillName; playerOldSkill: ISkill | undefined }): ISkill {
        const { skillName, playerOldSkill } = parameters;

        if (playerOldSkill) {
            // Before generating a new skill, clear the old skill sprite
            playerOldSkill.ClearSkillSprite?.();
        }

        switch (skillName) {
            case 'Rocket':
                return new RocketSkill();
            case 'Blade':
                return new BladeExplosionSkill();
            case 'MirrorShield':
                return new MirrorShieldSkill();
            case 'FuelChargeShot':
                return new FuelChargeShotSkill();
        }
    }
}
