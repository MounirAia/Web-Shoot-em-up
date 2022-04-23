import { ServiceLocator } from './ServiceLocator.js';

type Scenes = '' | 'Game';

export interface IServiceSceneManager {
    PlayScene(scene: Scenes): void;
    CurrentScene: Scenes;
}

export class SceneManager implements IServiceSceneManager {
    private currentScene: Scenes = '';

    constructor() {
        ServiceLocator.AddService('SceneManager', this);
    }

    public PlayScene(scene: Scenes) {
        this.currentScene = scene;
    }

    public get CurrentScene(): Scenes {
        return this.currentScene;
    }
}

export function LoadSceneManager() {
    new SceneManager(); // Add itself as a service
}
