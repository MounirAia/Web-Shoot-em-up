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
import { DrawBulletManager, LoadBulletManager, UpdateBulletManager } from './Sprites/Bullets/BulletManager.js';
import { LoadCollideManager } from './Sprites/CollideManager.js';

const ctx = canvas.getContext('2d')!;

let waveManager: WaveManager;

function load() {
    LoadImageLoader();
    LoadSceneManager();
    LoadGalaxyMap();
    LoadPlayer();
    LoadMainMenu();
    LoadBulletManager();
    LoadCollideManager();
    waveManager = new WaveManager();

    ServiceLocator.GetService<IServiceSceneManager>('SceneManager').PlayScene('Game');
}

function update(dt: number) {
    if (!ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').IsGameReady()) return;

    const SceneManager = ServiceLocator.GetService<IServiceSceneManager>('SceneManager');

    if (SceneManager.CurrentScene === 'Game') {
        UpdateGalaxyMap(dt);
        UpdatePlayer(dt);
        waveManager.Update(dt);
        UpdateBulletManager(dt);

        if (Keyboard.Escape.IsPressed) {
            SceneManager.PlayScene('InGameMenu');
        }
    } else if (SceneManager.CurrentScene === 'InGameMenu') {
        if (Keyboard.Escape.IsPressed) {
            SceneManager.PlayScene('Game');
        }
    } else if (SceneManager.CurrentScene === 'MainMenu') {
        UpdateMainMenu(dt);
    }
}
function draw(ctx: CanvasRenderingContext2D) {
    if (!ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').IsGameReady()) return;

    const SceneManager = ServiceLocator.GetService<IServiceSceneManager>('SceneManager');

    if (SceneManager.CurrentScene === 'Game') {
        DrawGalaxyMap(ctx);
        DrawPlayer(ctx);
        waveManager.Draw(ctx);
        DrawBulletManager(ctx);
    } else if (SceneManager.CurrentScene === 'InGameMenu') {
        DrawGalaxyMap(ctx);
        DrawPlayer(ctx);
        waveManager.Draw(ctx);
    } else if (SceneManager.CurrentScene === 'MainMenu') {
        DrawMainMenu(ctx);
    }
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
