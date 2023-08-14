export const MirrorShieldConstant = [
    {
        'Skill Name': 'Mirror Shield',
        Level: 1,
        'Skill Price': 1000,
        'Respawn Time (s)': 3,
        'Mirror Health Player Health Ratio': 0.3,
    },
    {
        'Skill Name': 'Mirror Shield',
        Level: 2,
        'Skill Price': 6300,
        'Respawn Time (s)': 3,
        'Mirror Health Player Health Ratio': 0.4,
    },
    {
        'Skill Name': 'Mirror Shield',
        Level: 3,
        'Skill Price': 20000,
        'Respawn Time (s)': 2.5,
        'Mirror Health Player Health Ratio': 0.5,
        'Quantity Explosive Entity / Second': 3,
        'Portal Detachment Cooldown (s)': 3,
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
