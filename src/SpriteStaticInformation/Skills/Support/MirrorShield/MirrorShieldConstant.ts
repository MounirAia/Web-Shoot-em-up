export const MirrorShieldConstant = [
    {
        'Skill Name': 'Mirror Shield',
        Level: 1,
        'Skill Price': 1000,
        'Respawn Time (s)': 3,
        'Mirror Health Player Health Ratio': 1,
        'Primary Skill': '',
        'Secondary Skill': '',
    },
    {
        'Skill Name': 'Mirror Shield',
        Level: 2,
        'Skill Price': 6300,
        'Respawn Time (s)': 3,
        'Mirror Health Player Health Ratio': 1.5,
        'Primary Skill': 'Energy',
        'Secondary Skill': '',
    },
    {
        'Skill Name': 'Mirror Shield',
        Level: 3,
        'Skill Price': 20000,
        'Respawn Time (s)': 2.5,
        'Mirror Health Player Health Ratio': 2,
        'Quantity Explosive Entity / Second': 3,
        'Portal Detachment Cooldown (s)': 3,
        'Primary Skill': 'Energy',
        'Secondary Skill': 'Explosive',
    },
] as const;

export const MirrorShieldThunderBeamConstant = [
    {
        'Primary Skill': 'Energy',
        'Secondary Skill': '',
    },
] as const;

export const MirrorShieldExplosiveEntityConstant = [
    {
        'Projectile Speed': 45,
        'Primary Skill': 'Explosive',
        'Secondary Skill': '',
    },
] as const;
