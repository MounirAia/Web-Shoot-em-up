import { canvas, FRAME_RATE } from './ScreenConstant.js';
import { Keyboard } from './Keyboard.js';
import {} from './Mouse.js';
import { LoadImageLoader, IServiceImageLoader } from './ImageLoader.js';
import { DrawGalaxyMap, LoadGalaxyMap, UpdateGalaxyMap } from './Map/Galaxy.js';
import { IServiceSceneManager, LoadSceneManager } from './SceneManager.js';
import { ServiceLocator } from './ServiceLocator.js';
import { LoadPlayer, UpdatePlayer, DrawPlayer } from './Sprites/Player.js';
import { WaveEnemies } from './WaveManager/WaveEnemies.js';
import { WaveManager } from './WaveManager/WaveManager.js';
import { DrawMainMenu, LoadMainMenu, UpdateMainMenu } from './Scenes/MainMenu.js';
import { TriangleEnemy } from './Sprites/Enemies/TriangleEnemy.js';

const ctx = canvas.getContext('2d')!;

let waveManager: WaveManager;

let testSprite: TriangleEnemy | undefined;

function load() {
    LoadImageLoader();
    LoadSceneManager();
    LoadGalaxyMap();
    LoadPlayer();
    LoadMainMenu();
    waveManager = new WaveManager([new WaveEnemies(30, 14), new WaveEnemies(22, 14), new WaveEnemies(14, 14)]);

    testSprite = new TriangleEnemy(150, 150);

    ServiceLocator.GetService<IServiceSceneManager>('SceneManager').PlayScene('MainMenu');
}

function update(dt: number) {
    if (!ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').IsGameReady()) return;

    testSprite?.Update(dt);
}
function draw(ctx: CanvasRenderingContext2D) {
    if (!ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').IsGameReady()) return;

    ctx.save();
    ctx.fillStyle = '#CCCCCC';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    testSprite?.Draw(ctx);
}

// ****************************************** Init Game Loop ***************************************
let previousTimestamp = 0;
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
