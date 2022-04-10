import { loadImageLoader, IImageLoader } from './ImageLoader.js';
import ServiceLocator from './ServiceLocator.js';

const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

function load() {
    loadImageLoader();
}

let rect = {
    x: 10,
    y: 10,
    speed: 5 * 60,
};

function update(dt: number) {
    if (!ServiceLocator.getService<IImageLoader>('ImageLoader').isGameReady()) return;

    if (rect.x + 100 >= canvas.width || rect.x <= 0) {
        rect.speed = -rect.speed;
    }

    rect.x = rect.x + rect.speed * dt;
}

function draw(ctx: CanvasRenderingContext2D) {
    if (!ServiceLocator.getService<IImageLoader>('ImageLoader').isGameReady()) return;

    ctx.fillStyle = 'green';
    ctx.fillRect(rect.x, rect.y, 100, 100);
    ctx.fillStyle = 'black';
    ctx.drawImage(ServiceLocator.getService<IImageLoader>('ImageLoader').getImage('images/cardBack_green4.png'), 0, 0);
}

// ****************************************** Init Game Loop ***************************************
let previousTimestamp = 0;
const deltaTime = 1000 / 60; // 60 fps game
let timeToUpdate = 0;
// game loop function
function run(timestamp: number) {
    // accumulated time to update between 2 frames
    timeToUpdate += timestamp - previousTimestamp;

    while (timeToUpdate >= deltaTime) {
        update(deltaTime / 1000); // divide by 1000, because I want to work in second not millisecond
        timeToUpdate -= deltaTime;
    }
    previousTimestamp = timestamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw(ctx);

    requestAnimationFrame(run);
}

function init() {
    load();
    requestAnimationFrame(run);
}

init();
