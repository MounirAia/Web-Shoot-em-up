import { LaneNumber } from '../../WaveManager/WaveEnemies/Lane.js';
import { Sprite } from '../Sprite.js';
import { ISpriteWithDamageResistance } from '../SpriteAttributes.js';
import { ISpriteWithHitboxes } from '../SpriteHitbox.js';

export type EnemyTier = 'Tier1' | 'Tier2' | 'Tier3';

export interface IEnemy extends Sprite, ISpriteWithDamageResistance, ISpriteWithHitboxes {
    readonly HorizontalShootingPosition: number;
    MoneyValue: number;
    Tier: EnemyTier;
    Lane: LaneNumber;
    EnableShooting: () => void;
    DisableShooting: () => void;
    ReachedShootingPosition: () => boolean;
    ApplyParalyzeEnemy: () => void;
    RemoveParalyzeEnemy: () => void;
    GetEnergyValue: () => number;
}
