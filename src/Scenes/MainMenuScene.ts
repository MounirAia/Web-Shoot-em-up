import { LoadEventManager } from '../EventManager.js';
import { LoadGameStatManager } from '../GameStatManager.js';
import { IScene, IServiceSceneManager } from '../SceneManager.js';
import { CANVA_SCALEX, CANVA_SCALEY } from '../ScreenConstant.js';
import { ServiceLocator } from '../ServiceLocator.js';
import { LoadGeneratedSpritesManager } from '../Sprites/GeneratedSpriteManager.js';
import { LoadPlayer } from '../Sprites/Player.js';
import { LoadWaveManager } from '../WaveManager/WaveManager.js';
import { FieldWithText } from './BaseUserInterface/FieldWithText.js';
import { UIManager } from './BaseUserInterface/UIManager.js';

export class MainMenuScene implements IScene {
    private mainMenuUiManager: UIManager;
    Load() {
        // Load the services that should be reseted when the game is restarted
        LoadEventManager();
        LoadGeneratedSpritesManager();
        LoadWaveManager();
        LoadGameStatManager();
        LoadPlayer();

        this.loadUI();
    }

    Update(dt: number) {
        this.mainMenuUiManager.Update(dt);
    }

    Draw(ctx: CanvasRenderingContext2D) {
        this.mainMenuUiManager.Draw(ctx);
    }

    Unload(): void {}

    private loadUI() {
        this.mainMenuUiManager = new UIManager();

        const SceneManager = ServiceLocator.GetService<IServiceSceneManager>('SceneManager');

        // Define the title of the menu
        const widthTitle = 136 * CANVA_SCALEX;
        const heightTitle = 9 * CANVA_SCALEY;
        const xTitle = 92 * CANVA_SCALEX; // canvas.width / 2 - widthPlayButton / 2;
        const yTitle = 18 * CANVA_SCALEY; // canvas.height / 2 - heightPlayButton - heightPlayButton / 2;
        const mainMenuTitle = new FieldWithText({
            x: xTitle,
            y: yTitle,
            width: widthTitle,
            height: heightTitle,
            text: "Web Shoot'em UP",
            fontSize: UIManager.Typography.title.fontSize,
            fontFamily: UIManager.Typography.title.fontFamily,
        });
        mainMenuTitle.HasBorderOnAllSide = false;
        mainMenuTitle.HasBottomBorder = true;

        this.mainMenuUiManager.AddComponent(mainMenuTitle);

        // Define the play button
        const widthPlayButton = 41 * CANVA_SCALEX;
        const heightPlayButton = 11 * CANVA_SCALEY;
        const xPlayButton = 139 * CANVA_SCALEX; //canvas.width / 2 - widthPlayButton / 2;
        const yPlayButton = 84 * CANVA_SCALEY; //canvas.height / 2 - heightPlayButton - heightPlayButton / 2;
        const mainMenuPlayButton = new FieldWithText({
            x: xPlayButton,
            y: yPlayButton,
            width: widthPlayButton,
            height: heightPlayButton,
            text: 'PLAY',
            fontSize: UIManager.Typography.button.fontSize,
            fontFamily: UIManager.Typography.button.fontFamily,
            HasHovered: true,
            onClick: () => {
                SceneManager.PlayMainScene('SelectSkill');
            },
        });

        this.mainMenuUiManager.AddComponent(mainMenuPlayButton);
    }
}
