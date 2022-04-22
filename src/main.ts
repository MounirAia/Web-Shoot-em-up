import { LoadImageLoader, IServiceImageLoader } from './ImageLoader.js';
import { DrawGalaxyMap, LoadGalaxyMap, UpdateGalaxyMap } from './Map/Galaxy.js';
import { ServiceLocator } from './ServiceLocator.js';
import { LoadTriangleEnemy, UpdateTriangleEnemy, DrawTriangleEnemy } from './Sprites/Enemies/TriangleEnemy.js';
import { LoadPlayer, UpdatePlayer, DrawPlayer } from './Sprites/Player.js';
import { WaveEnemies } from './WaveManager/WaveEnemies.js';

export const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

let wave: WaveEnemies;

function load() {
    LoadImageLoader();
    LoadGalaxyMap();
    LoadPlayer();
    LoadTriangleEnemy();
    wave = new WaveEnemies(30, 14);
}

function update(dt: number) {
    if (!ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').IsGameReady()) return;

    UpdateGalaxyMap(dt);
    UpdatePlayer(dt);
    UpdateTriangleEnemy(dt);
    wave.Update(dt);
}
function draw(ctx: CanvasRenderingContext2D) {
    if (!ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').IsGameReady()) return;
    DrawGalaxyMap(ctx);
    DrawPlayer(ctx);
    DrawTriangleEnemy(ctx);
    wave.Draw(ctx);
}

// ****************************************** Init Game Loop ***************************************
let previousTimestamp = 0;
export const FRAME_RATE = 60;
const deltaTime = 1000 / FRAME_RATE; // 60 fps game
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
