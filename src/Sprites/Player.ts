import { Sprite } from './Sprite.js';
import { ServiceLocator } from '../ServiceLocator.js';
import { IServiceImageLoader } from '../ImageLoader.js';

export class Player extends Sprite {
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
    }
}

let player: Player;
export function loadPlayer() {
    const imgPlayer = ServiceLocator.getService<IServiceImageLoader>('ImageLoader').getImage('images/player.png');
    player = new Player(imgPlayer, 30, 16, 250, 250, 3, 3);

    player.addAnimation('idle', [0, 1, 2, 3, 4, 5, 6, 7, 8]);
    player.playAnimation('idle', 0.1);
}

export function updatePlayer(dt: number) {
    player.update(dt);
}

export function drawPlayer(ctx: CanvasRenderingContext2D) {
    player.draw(ctx);
}
