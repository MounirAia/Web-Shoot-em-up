import { MainMenuScene } from './Scenes/MainMenuScene.js';
import { GameScene } from './Scenes/GameScene.js';
import { SelectSkillScene } from './Scenes/SelectSkillScene.js';
import { ServiceLocator } from './ServiceLocator.js';
import { InGameMenuScene } from './Scenes/InGameMenuScene.js';

type AvailableScenes = 'Game' | 'MainMenu' | 'SelectSkill' | 'GameOver';
type AvailableSecondaryScenes = 'None' | 'InGameMenu' | 'ShoppingMenu';

export interface IServiceSceneManager {
    PlayMainScene(scene: AvailableScenes): void;
    PlaySecondaryScene(scene: AvailableSecondaryScenes): void;
}

export interface IScene {
    Load(): void;
    Update(dt: number): void;
    Draw(ctx: CanvasRenderingContext2D): void;
    Unload(): void;
}

export class SceneManager implements IServiceSceneManager {
    private currentMainScene: IScene | undefined;
    private currentSecondaryScene: IScene | undefined;

    constructor() {
        ServiceLocator.AddService('SceneManager', this);
    }

    public PlayMainScene(scene: AvailableScenes) {
        this.PlaySecondaryScene('None'); // Unload the secondary scene

        this.currentMainScene?.Unload();
        this.currentMainScene = this.createMainScene(scene);
        this.currentMainScene?.Load();
    }

    public PlaySecondaryScene(scene: AvailableSecondaryScenes) {
        this.currentSecondaryScene?.Unload();
        this.currentSecondaryScene = this.createSecondaryScene(scene);
        this.currentSecondaryScene?.Load();
    }

    public Update(dt: number) {
        if (!this.currentSecondaryScene) {
            // only update the main scene if there is no secondary scene
            this.currentMainScene?.Update(dt);
        }
        this.currentSecondaryScene?.Update(dt);
    }

    public Draw(ctx: CanvasRenderingContext2D) {
        if (this.currentSecondaryScene) {
            this.applyBlurToScene((ctx: CanvasRenderingContext2D) => {
                this.currentMainScene?.Draw(ctx);
            }, ctx);
        } else {
            this.currentMainScene?.Draw(ctx);
        }
        this.currentSecondaryScene?.Draw(ctx);
    }

    private createMainScene(scene: AvailableScenes): IScene {
        switch (scene) {
            case 'Game':
                return new GameScene();
            case 'MainMenu':
                return new MainMenuScene();
            case 'SelectSkill':
                return new SelectSkillScene();
            case 'GameOver':
            // return new GameOverScene();
            default:
                return new MainMenuScene();
        }
    }

    private createSecondaryScene(scene: AvailableSecondaryScenes): IScene | undefined {
        switch (scene) {
            case 'InGameMenu':
                return new InGameMenuScene();
            case 'ShoppingMenu':
            // return new ShoppingMenuScene();
            case 'None':
            default:
                return undefined;
        }
    }

    private applyBlurToScene(drawScene: (ctx: CanvasRenderingContext2D) => void, ctx: CanvasRenderingContext2D) {
        ctx.filter = 'blur(2px)';
        drawScene(ctx);
        ctx.filter = 'none';
    }
}

let sceneManager: SceneManager;

export function LoadSceneManager() {
    sceneManager = new SceneManager(); // Add itself as a service
    sceneManager.PlayMainScene('MainMenu');
}

export function UpdateSceneManager(dt: number) {
    sceneManager.Update(dt);
}

export function DrawSceneManager(ctx: CanvasRenderingContext2D) {
    sceneManager.Draw(ctx);
}
