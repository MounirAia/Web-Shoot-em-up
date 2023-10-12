import { Sprite } from '../Sprite.js';
import { ISpriteWithDamageResistance } from '../SpriteAttributes.js';
import { ISpriteWithHitboxes } from '../SpriteHitbox.js';

export interface IEnemy extends Sprite, ISpriteWithDamageResistance, ISpriteWithHitboxes {
    readonly HorizontalShootingPosition: number;
    MoneyValue: number;
}
