import { Sprite } from './Sprite.js';
import { ServiceLocator } from '../ServiceLocator.js';
import { IServiceImageLoader } from '../ImageLoader.js';

// use isAnimation finished property to avoid looping in the update of the player
// think on how you will call the load, update and draw

export interface IServicePlayer {}

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
        this.addAnimation('idle', [0, 1, 2, 3, 4, 5, 6, 7, 8]);
    }

    public update(dt: number): void {
        super.update(dt);
        player.playAnimation('idle', 0.1, false);
    }
}

let player: Player;
export function loadPlayer() {
    const imgPlayer = ServiceLocator.getService<IServiceImageLoader>('ImageLoader').getImage('images/player.png');
    player = new Player(imgPlayer, 30, 16, 250, 250, 3, 3);

    ServiceLocator.addService('Player', player);
}

export function updatePlayer(dt: number) {
    player.update(dt);
}

export function drawPlayer(ctx: CanvasRenderingContext2D) {
    player.draw(ctx);
}
