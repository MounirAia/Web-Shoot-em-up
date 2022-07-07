import { IMovableSprite } from '../InterfaceBehaviour/IMovableSprite.js';
import { ISpriteWithHitboxes } from '../InterfaceBehaviour/ISpriteWithHitboxes.js';
import { Sprite } from '../Sprite.js';

export interface IEnemy extends Sprite, ISpriteWithHitboxes, IMovableSprite {
    readonly HorizontalShootingPosition: number;
}
