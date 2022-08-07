import { ICollidableSprite } from '../CollideManager.js';
import { ISpriteWithHitboxes } from '../InterfaceBehaviour/ISpriteWithHitboxes.js';
import { Sprite } from '../Sprite.js';

export interface IEnemy extends Sprite, ISpriteWithHitboxes, ICollidableSprite {
    readonly HorizontalShootingPosition: number;
}
