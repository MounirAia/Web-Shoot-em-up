import { ServiceLocator } from './ServiceLocator.js';

type AvailableScenes = '' | 'Game' | 'InGameMenu' | 'MainMenu' | 'GameOver';

export interface IServiceSceneManager {
    PlayScene(scene: AvailableScenes): void;
    CurrentScene: AvailableScenes;
}

export class SceneManager implements IServiceSceneManager {
    private currentScene: AvailableScenes = '';

    constructor() {
        ServiceLocator.AddService('SceneManager', this);
    }

    public PlayScene(scene: AvailableScenes) {
        this.currentScene = scene;
    }

    public get CurrentScene(): AvailableScenes {
        return this.currentScene;
    }
}

export function LoadSceneManager() {
    new SceneManager(); // Add itself as a service
}
