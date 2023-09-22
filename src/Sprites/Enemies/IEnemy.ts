import { Sprite } from '../Sprite.js';
import { ISpriteWithHitboxes } from '../SpriteHitbox.js';

export interface IEnemy extends Sprite, ISpriteWithHitboxes {
    readonly HorizontalShootingPosition: number;
    MoneyValue: number;
}
