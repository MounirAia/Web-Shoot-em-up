import { Sprite } from './Sprite.js';
import { ServiceLocator } from '../ServiceLocator.js';
import { IServiceImageLoader } from '../ImageLoader.js';

export interface IServicePlayer {
    Coordinate(): { x: number; y: number };
}

export class Player extends Sprite implements IServicePlayer {
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
        this.AddAnimation('idle', [0, 1, 2, 3, 4, 5, 6, 7, 8]);
    }

    public Update(dt: number): void {
        super.Update(dt);
        this.PlayAnimation('idle', 0.1, false);
    }

    public Coordinate(): { x: number; y: number } {
        return { x: this.X, y: this.Y };
    }
}

let player: Player;
export function LoadPlayer() {
    const imgPlayer = ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').GetImage('images/player.png');
    const frameWidth = 30;
    const frameHeight = 16;
    const x = 250;
    const y = 250;
    const scaleX = 3;
    const scaleY = 3;
    player = new Player(imgPlayer, frameWidth, frameHeight, x, y, scaleX, scaleY);

    ServiceLocator.AddService('Player', player);
}

export function UpdatePlayer(dt: number) {
    player.Update(dt);
}

export function DrawPlayer(ctx: CanvasRenderingContext2D) {
    player.Draw(ctx);
}
