import { ISpriteWithHitboxes } from '../InterfaceBehaviour/ISpriteWithHitboxes.js';
import { Sprite } from '../Sprite.js';

// Change the way I play animation (no need to specify animation length)
// Make the IEnemy interface extends the Sprite class

export interface IEnemy extends Sprite, ISpriteWithHitboxes {}
