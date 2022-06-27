import { ISpriteWithHitboxes } from '../InterfaceBehaviour/ISpriteWithHitboxes.js';

// Change the way I play animation (no need to specify animation length)
// Make the IEnemy interface extends the Sprite class

export interface IEnemy extends ISpriteWithHitboxes {
    Update(dt: number): void;
    Draw(ctx: CanvasRenderingContext2D): void;
}
