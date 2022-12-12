const constant = [
    {
        skillName: 'Rocket',
        level: 1,
        skillPrice: 400,
        projectileSpeed: 10,
        cannonType: 'regular',
        numberOfCannon: 1,
    },
    {
        skillName: 'Rocket',
        level: 2,
        skillPrice: 3200,
        projectileSpeed: 10,
        cannonType: 'regular',
        numberOfCannon: 2,
    },
    {
        skillName: 'Rocket',
        level: 3,
        skillPrice: 9600,
        projectileSpeed: 10,
        cannonType: 'regular',
        numberOfCannon: 2,
    },
] as const;

const possibleSkillNameArray = constant.map((skill) => {
    return skill.skillName;
});

export type PossibleSkillName = typeof possibleSkillNameArray[0];

// do the map method for the level of the skill
const possibleLevelArray = constant.map((skill) => {
    return skill.level;
});

export type PossibleSkillLevel = typeof possibleLevelArray[0];

export function GetSkillsConstants(skillName: PossibleSkillName, level: PossibleSkillLevel) {
    const obj = constant.filter((element) => {
        return element.skillName === skillName && element.level === level;
    })[0];
    return obj;
}
