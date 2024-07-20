import SpriteInfoRocketCannon from './Cosmetics/Upgrade/infoRocketCannon';
import SpriteInfoEffectIcons from './Cosmetics/infoEffectIcons';
import PlayerStats from './Player/PlayerStats';
import SpriteInfoPlayer from './Player/infoPlayer';
import { BladeConstant } from './Skills/Effect/Blade/BladeConstant';
import { BladeDamageStats } from './Skills/Effect/Blade/BladeDamage';
import SpriteInfoBlade from './Skills/Effect/Blade/infoBladeExplosion';
import PlayerBulletDamageStats from './Skills/PlayerBullet/PlayerBulletDamage';
import SpriteInfoBullet from './Skills/PlayerBullet/infoPlayerBullet';
import { RocketConstant } from './Skills/Special/Rocket/RocketConstant';
import RocketDamageStats from './Skills/Special/Rocket/RocketDamage';
import SpriteInfoRocket from './Skills/Special/Rocket/infoRocketSkill';
import {
    FuelChargeShotFrameConstant,
    FuelChargeShotLaserConstant,
} from './Skills/Support/FuelChargeShot/FuelChargeShotConstant';
import { FuelChargeShotDamage as FuelChargeShotDamageStats } from './Skills/Support/FuelChargeShot/FuelChargeShotDamage';
import SpriteInfoFuelChargeShot from './Skills/Support/FuelChargeShot/infoFuelChargeShot';
import SpriteInfoMirror from './Skills/Support/MirrorShield/infoMirrorShield';
import {
    MirrorShieldConstant,
    MirrorShieldThunderBeamConstant,
    MirrorShieldExplosiveEntityConstant,
} from './Skills/Support/MirrorShield/MirrorShieldConstant';
import { MirrorShieldDamage as MirrorShieldDamageStats } from './Skills/Support/MirrorShield/MirrorShieldDamage';

// Define the structure of the infos object
const infos = {
    Player: {
        stats: PlayerStats,
        spriteInfo: SpriteInfoPlayer,
        constant: undefined,
    },
    PlayerBullet: {
        stats: PlayerBulletDamageStats,
        spriteInfo: SpriteInfoBullet,
        constant: undefined,
    },
    Rocket: {
        stats: RocketDamageStats,
        constant: RocketConstant,
        spriteInfo: SpriteInfoRocket,
    },
    RocketCannonCosmetic: {
        stats: undefined,
        spriteInfo: SpriteInfoRocketCannon,
        constant: undefined,
    },
    Blade: {
        stats: BladeDamageStats,
        spriteInfo: SpriteInfoBlade,
        constant: BladeConstant,
    },
    Mirror: {
        stats: MirrorShieldDamageStats,
        spriteInfo: SpriteInfoMirror,
        constant: {
            Mirror: MirrorShieldConstant,
            ThunderBeam: MirrorShieldThunderBeamConstant,
            ExplosiveEntity: MirrorShieldExplosiveEntityConstant,
        },
    },
    FuelChargeShot: {
        stats: FuelChargeShotDamageStats,
        spriteInfo: SpriteInfoFuelChargeShot,
        constant: {
            FuelChargeShotFrame: FuelChargeShotFrameConstant,
            FuelChargeShotLaser: FuelChargeShotLaserConstant,
        },
    },
    EffectIcons: {
        stats: undefined,
        spriteInfo: SpriteInfoEffectIcons,
        constant: undefined,
    },
};

// Derive a type from the 'infos' object
type InfosType = typeof infos;

// Use keyof to get a union of keys from InfosType ('Player' | 'Rocket')
type InfosKey = keyof InfosType;

// Create a type mapping for each key to its corresponding info type
type InfoType<K extends InfosKey> = InfosType[K];

// Not implemented as a service, because I need to access the information statically
export function GetSpriteStaticInformation<K extends InfosKey>(parameters: { sprite: K }): InfoType<K> {
    const { sprite } = parameters;
    return infos[sprite];
}
