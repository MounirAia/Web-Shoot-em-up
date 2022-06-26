import { IMovableSprite } from '../InterfaceBehaviour/IMovableSprite.js';

export interface IBullet extends IMovableSprite {
    Type: 'player' | 'enemy';
    Update: (dt: number) => void;
    Draw: (ctx: CanvasRenderingContext2D) => void;
    Damage: number;
}
