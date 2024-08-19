import { IServiceKeyboardManager } from '../Keyboard';
import { IScene, IServiceSceneManager } from '../SceneManager';
import { CANVA_SCALEX, CANVA_SCALEY } from '../ScreenConstant';
import { ServiceLocator } from '../ServiceLocator';
import { FieldWithText } from './BaseUserInterface/FieldWithText';
import { UIManager } from './BaseUserInterface/UIManager';

export class InGameMenuScene implements IScene {
    private inGameMenuUiManager: UIManager;
    Load(): void {
        this.loadUI();
    }
    Update(dt: number): void {
        const keyboardManager = ServiceLocator.GetService<IServiceKeyboardManager>('KeyboardManager');
        if (keyboardManager.GetCommandState({ command: 'CloseInGameMenu' }).IsPressed) {
            ServiceLocator.GetService<IServiceSceneManager>('SceneManager').PlaySecondaryScene('None');
        }
        this.inGameMenuUiManager.Update(dt);
    }
    Draw(ctx: CanvasRenderingContext2D): void {
        this.inGameMenuUiManager.Draw(ctx);
    }
    Unload(): void {
        this.inGameMenuUiManager = new UIManager();
    }

    private loadUI() {
        this.inGameMenuUiManager = new UIManager();

        const SceneManager = ServiceLocator.GetService<IServiceSceneManager>('SceneManager');

        // Define the play button
        const widthButton = 41 * CANVA_SCALEX;
        const heightButton = 11 * CANVA_SCALEY;
        /* Resume button */
        const xResumeButton = 139 * CANVA_SCALEX;
        const yResumeButton = 64 * CANVA_SCALEY;
        const resumeButton = new FieldWithText({
            x: xResumeButton,
            y: yResumeButton,
            width: widthButton,
            height: heightButton,
            text: 'RESUME',
            fontSize: UIManager.Typography.button.fontSize,
            fontFamily: UIManager.Typography.button.fontFamily,
            HasHovered: true,
            onClick: () => {
                SceneManager.PlaySecondaryScene('None');
            },
        });

        this.inGameMenuUiManager.AddComponent(resumeButton);

        /* Quit button */
        const xQuitButton = 139 * CANVA_SCALEX;
        const yQuitButton = 85 * CANVA_SCALEY;
        const quitButton = new FieldWithText({
            x: xQuitButton,
            y: yQuitButton,
            width: widthButton,
            height: heightButton,
            text: 'QUIT',
            fontSize: UIManager.Typography.button.fontSize,
            fontFamily: UIManager.Typography.button.fontFamily,
            HasHovered: true,
            onClick: () => {
                SceneManager.PlayMainScene('MainMenu');
            },
        });

        this.inGameMenuUiManager.AddComponent(quitButton);
    }
}
