import { IMovableSprite } from '../InterfaceBehaviour/IMovableSprite.js';

export interface IBullet extends IMovableSprite {
    type: 'player' | 'enemy';
    Update: (dt: number) => void;
    Draw: (ctx: CanvasRenderingContext2D) => void;
}
