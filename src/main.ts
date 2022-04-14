import { LoadImageLoader, IServiceImageLoader } from './ImageLoader.js';
import { ServiceLocator } from './ServiceLocator.js';
import { LoadPlayer, UpdatePlayer, DrawPlayer } from './Sprites/Player.js';

const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

function load() {
    LoadImageLoader();
    LoadPlayer();
}

function update(dt: number) {
    if (!ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').IsGameReady()) return;

    UpdatePlayer(dt);
}
function draw(ctx: CanvasRenderingContext2D) {
    if (!ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').IsGameReady()) return;

    DrawPlayer(ctx);
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
    ctx.imageSmoothingEnabled = false;
    load();
    requestAnimationFrame(run);
}

init();
