import { ImageLoader } from './ImageLoader.js';
const canvas = document.querySelector('#canvas') as HTMLCanvasElement;

let imageLoader: ImageLoader;

export function load() {
    // load images
    const assets: string[] = [];
    assets.push('images/cardBack_blue1.png');
    assets.push('images/cardBack_blue2.png');
    assets.push('images/cardBack_blue3.png');
    assets.push('images/cardBack_blue4.png');
    assets.push('images/cardBack_blue5.png');
    assets.push('images/cardBack_green1.png');
    assets.push('images/cardBack_green2.png');
    assets.push('images/cardBack_green3.png');
    assets.push('images/cardBack_green4.png');
    assets.push('images/cardBack_green5.png');
    assets.push('images/cardHearts10.png');
    assets.push('images/cardHearts3.png');
    assets.push('images/cardHearts4.png');
    assets.push('images/cardHearts5.png');
    assets.push('images/cardHearts6.png');
    assets.push('images/cardHearts7.png');
    assets.push('images/cardHearts8.png');
    assets.push('images/cardHearts9.png');
    assets.push('images/cardHeartsA.png');
    assets.push('images/cardHeartsJ.png');
    assets.push('images/cardSpades10.png');
    assets.push('images/cardSpadesA.png');
    assets.push('images/cardSpadesJ.png');
    assets.push('images/cardSpadesK.png');
    assets.push('images/cardSpadesQ.png');

    imageLoader = new ImageLoader(assets);
}

let rect = {
    x: 10,
    y: 10,
    speed: 5 * 60,
};

export function update(dt: number) {
    if (!ImageLoader.IsGameReady) return;

    if (rect.x + 100 >= canvas.width || rect.x <= 0) {
        rect.speed = -rect.speed;
    }

    rect.x = rect.x + rect.speed * dt;
}

export function draw(ctx: CanvasRenderingContext2D) {
    if (!ImageLoader.IsGameReady) return;

    ctx.fillStyle = 'green';
    ctx.fillRect(rect.x, rect.y, 100, 100);
    ctx.fillStyle = 'black';
    ctx.drawImage(imageLoader.getImage('images/cardBack_green1.png'), 0, 0);
}
