import { loadImageLoader, IImageLoader } from './ImageLoader.js';
import ServiceLocator from './ServiceLocator.js';
const canvas = document.querySelector('#canvas') as HTMLCanvasElement;

export function load() {
    loadImageLoader();
}

let rect = {
    x: 10,
    y: 10,
    speed: 5 * 60,
};

export function update(dt: number) {
    if (!ServiceLocator.getService<IImageLoader>('ImageLoader').isGameReady()) return;

    if (rect.x + 100 >= canvas.width || rect.x <= 0) {
        rect.speed = -rect.speed;
    }

    rect.x = rect.x + rect.speed * dt;
}

export function draw(ctx: CanvasRenderingContext2D) {
    if (!ServiceLocator.getService<IImageLoader>('ImageLoader').isGameReady()) return;

    ctx.fillStyle = 'green';
    ctx.fillRect(rect.x, rect.y, 100, 100);
    ctx.fillStyle = 'black';
    ctx.drawImage(ServiceLocator.getService<IImageLoader>('ImageLoader').getImage('images/cardBack_green1.png'), 0, 0);
}
