import { ISpriteWithHitboxes } from '../InterfaceBehaviour/ISpriteWithHitboxes.js';

export interface IEnemy extends ISpriteWithHitboxes {
    Update(dt: number): void;
    Draw(ctx: CanvasRenderingContext2D): void;
}
