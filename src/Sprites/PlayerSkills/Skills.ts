import { ServiceLocator } from '../../ServiceLocator';
import { BladeExplosionSkill } from './Effect/BladeExplosionSkill';
import { RocketSkill } from './Special/RocketSkill';
import { FuelChargeShotSkill } from './Support/FuelChargeShot/FuelChargeShot';
import { MirrorShieldSkill } from './Support/MirrorShield/MirrorShield';

export type PossibleSkillName = 'Rocket' | 'Blade' | 'MirrorShield' | 'FuelChargeShot';
export type SkillsTypeName = 'special' | 'support' | 'effect';

export interface ISkill {
    Type: SkillsTypeName;
    SkillName: PossibleSkillName;
    Effect: () => void;
    AttackSpeed?: () => void;
}

export interface IServiceSkillManager {
    GetSkill(parameters: { skillName: PossibleSkillName }): ISkill;
}

export class SkillService implements IServiceSkillManager {
    private skills: Record<PossibleSkillName, ISkill> = {
        Rocket: new RocketSkill(),
        Blade: new BladeExplosionSkill(),
        MirrorShield: new MirrorShieldSkill(),
        FuelChargeShot: new FuelChargeShotSkill(),
    };

    constructor() {
        ServiceLocator.AddService('SkillManager', this);
    }

    GetSkill(parameters: { skillName: PossibleSkillName }): ISkill {
        const { skillName } = parameters;
        return this.skills[skillName];
    }
}

export function LoadSkillManager() {
    new SkillService();
}
