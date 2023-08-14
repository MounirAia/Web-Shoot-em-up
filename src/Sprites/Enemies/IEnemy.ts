import { ISpriteWithHitboxes } from '../SpriteHitbox.js';
import { Sprite } from '../Sprite.js';

export interface IEnemy extends Sprite, ISpriteWithHitboxes {
    readonly HorizontalShootingPosition: number;
    MoneyValue: number;
}
