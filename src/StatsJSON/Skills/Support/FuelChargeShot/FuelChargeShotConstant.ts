export const FuelChargeShotFrameConstant = [
    {
        'Skill Name': 'Fuel Charge Shot',
        Level: 1,
        'Skill Price': 1000,
        'Number of Frame To Spawn': 1,
        'Shooting Rate (s)': 0,
        'Primary Skill': '',
        'Secondary Skill': '',
    },
    {
        'Skill Name': 'Fuel Charge Shot',
        Level: 2,
        'Skill Price': 6300,
        'Number of Frame To Spawn': 1,
        'Shooting Rate (s)': 0,
        'Primary Skill': '',
        'Secondary Skill': '',
    },
    {
        'Skill Name': 'Fuel Charge Shot',
        Level: 3,
        'Skill Price': 20000,
        'Number of Frame To Spawn': 1,
        'Shooting Rate (s)': 0,
        'Primary Skill': '',
        'Secondary Skill': '',
    },
] as const;

export const FuelChargeShotLaserConstant = [
    {
        Level: 1,
        'Projectile Speed': 45,
        'Effect Length (s)': 1,
        'Maximum Number of Stack Effect': 3,
        'Primary Skill': 'FuelChargeShotLaserLevel1',
        'Secondary Skill': '',
    },
    {
        Level: 2,
        'Projectile Speed': 45,
        'Effect Length (s)': 2,
        'Maximum Number of Stack Effect': 3,
        'Primary Skill': 'FuelChargeShotLaserLevel2',
        'Secondary Skill': '',
    },
    {
        Level: 3,
        'Projectile Speed': 45,
        'Effect Length (s)': 2.5,
        'Maximum Number of Stack Effect': 3,
        'Primary Skill': 'FuelChargeShotLaserLevel3',
        'Secondary Skill': 'Corrosive',
    },
] as const;
