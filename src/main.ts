import { IServiceImageLoader, LoadImageLoader } from './ImageLoader.js';
import { LoadKeyboardManager } from './Keyboard.js';
import {} from './Mouse.js';
import { DrawSceneManager, LoadSceneManager, UpdateSceneManager } from './SceneManager.js';
import { FRAME_RATE, canvas } from './ScreenConstant.js';
import { ServiceLocator } from './ServiceLocator.js';
import { LoadCollideManager } from './Sprites/CollideManager.js';
import { LoadUtilManager } from './UtilManager.js';

const ctx = canvas.getContext('2d')!;
function load() {
    // Load the static services that should be loaded only once
    LoadUtilManager();
    LoadKeyboardManager();
    LoadImageLoader();
    LoadCollideManager();
    LoadSceneManager();
}

function update(dt: number) {
    if (!ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').IsGameReady()) return;

    UpdateSceneManager(dt);
}
function draw(ctx: CanvasRenderingContext2D) {
    if (!ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').IsGameReady()) return;

    DrawSceneManager(ctx);
}

// ****************************************** Init Game Loop ***************************************
let previousTimestamp = 0;
const deltaTime = 1000 / FRAME_RATE; // 60 fps game
let timeToUpdate = 0;
// game loop function
function run(timestamp: number) {
    // accumulated time to update between 2 frames
    timeToUpdate += timestamp - previousTimestamp;
    // for 60 fps screen you have 1 update for 1 draw
    // for 30 fps screen you have 2 updates for 1 draw
    // for 144 fps screen you have around 3 updates for 1 draw
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
