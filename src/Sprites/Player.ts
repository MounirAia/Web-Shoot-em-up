import { Sprite } from './Sprite.js';
import { ServiceLocator } from '../ServiceLocator.js';
import { IServiceImageLoader } from '../ImageLoader.js';
import { canvas, CANVA_SCALEX, CANVA_SCALEY, FRAME_RATE } from '../ScreenConstant.js';
import { Keyboard } from '../Keyboard.js';
import { IMovableSprite } from './InterfaceBehaviour/IMovableSprite.js';

export interface IServicePlayer {
    Coordinate(): { x: number; y: number };
}
interface Hitbox {
    x: number;
    y: number;
    width: number;
    height: number;
}
export class Player extends Sprite implements IServicePlayer, IMovableSprite {
    private baseSpeed: number = 5;
    private hitbox: Hitbox;
    constructor(
        image: HTMLImageElement,
        frameWidth: number,
        frameHeight: number,
        x: number = 0,
        y: number = 0,
        scaleX: number = 1,
        scaleY: number = 1,
    ) {
        super(image, frameWidth, frameHeight, x, y, scaleX, scaleY);
        this.hitbox = {
            x: 18 * CANVA_SCALEX,
            y: 25 * CANVA_SCALEY,
            width: 35 * CANVA_SCALEX,
            height: 12 * CANVA_SCALEY,
        };
        this.AddAnimation('idle', [0]);
        this.AddAnimation('damaged', [1]);
        this.AddAnimation('destroyed', [2, 3, 4, 5, 6, 7, 8, 9]);

        this.PlayAnimation('idle', 0.1, false);
        ServiceLocator.AddService('Player', this);
    }

    public Update(dt: number): void {
        super.Update(dt);

        if (Keyboard.a.IsDown) {
            if (this.leftTopCorner > 0) this.X -= this.BaseSpeed;
        }
        if (Keyboard.w.IsDown) {
            this.Y -= this.BaseSpeed;
        }
        if (Keyboard.d.IsDown) {
            if (this.rightTopCorner < canvas.width) this.X += this.BaseSpeed;
        }
        if (Keyboard.s.IsDown) {
            this.Y += this.BaseSpeed;
        }
    }

    private get leftTopCorner(): number {
        return this.X + this.hitbox.x;
    }

    private get leftBottomCorner(): number {
        return this.leftTopCorner + this.hitbox.x;
    }
    private get rightTopCorner(): number {
        return this.leftTopCorner + this.hitbox.width;
    }

    public Coordinate(): { x: number; y: number } {
        return { x: this.X, y: this.Y };
    }

    public get BaseSpeed(): number {
        if ((Keyboard.a.IsDown || Keyboard.d.IsDown) && (Keyboard.w.IsDown || Keyboard.s.IsDown)) {
            return this.baseSpeed / Math.sqrt(2); // to avoid faster movement when player goes in diagonal
        }
        return this.baseSpeed;
    }

    private set BaseSpeed(value: number) {
        this.baseSpeed = value;
    }
}

let player: Player;
export function LoadPlayer() {
    const imgPlayer =
        ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').GetImage('images/Player/player.png');
    const frameWidth = 64;
    const frameHeight = 64;
    const x = 250;
    const y = 250;
    const scaleX = CANVA_SCALEX;
    const scaleY = CANVA_SCALEY;
    player = new Player(imgPlayer, frameWidth, frameHeight, x, y, scaleX, scaleY);
}

export function UpdatePlayer(dt: number) {
    player.Update(dt);
}

export function DrawPlayer(ctx: CanvasRenderingContext2D) {
    player.Draw(ctx);
}
