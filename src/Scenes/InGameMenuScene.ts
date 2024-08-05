import { Keyboard } from '../Keyboard';
import { IScene, IServiceSceneManager } from '../SceneManager';
import { ServiceLocator } from '../ServiceLocator';

export class InGameMenuScene implements IScene {
    Load(): void {}
    Update(dt: number): void {
        if (Keyboard.Escape.IsPressed) {
            ServiceLocator.GetService<IServiceSceneManager>('SceneManager').PlaySecondaryScene('None');
        }
    }
    Draw(ctx: CanvasRenderingContext2D): void {}
    Unload(): void {}
}
