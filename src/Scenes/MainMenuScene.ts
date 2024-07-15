import { IServiceSceneManager } from '../SceneManager.js';
import { CANVA_SCALEX, CANVA_SCALEY } from '../ScreenConstant.js';
import { ServiceLocator } from '../ServiceLocator.js';
import { FieldWithText } from './BaseUserInterface/FieldWithText.js';
import { UIManager } from './BaseUserInterface/UIManager.js';

const mainMenuUiManager = new UIManager();

export function LoadMainMenu() {
    const SceneManager = ServiceLocator.GetService<IServiceSceneManager>('SceneManager');
    const fontFamily = 'pixel';

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
        text: "WEB SHOOT'EM UP",
        fontSize: 9 * CANVA_SCALEX,
        fontFamily: fontFamily,
    });
    mainMenuTitle.HasBorderOnAllSide = false;
    mainMenuTitle.HasBottomBorder = true;

    mainMenuUiManager.AddComponent(mainMenuTitle);

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
        fontSize: 6 * CANVA_SCALEX,
        fontFamily: fontFamily,
        HasHovered: true,
        onClick: () => {
            SceneManager.PlayScene('SelectSkill');
        },
    });

    mainMenuUiManager.AddComponent(mainMenuPlayButton);
}

export function UpdateMainMenu(dt: number) {
    mainMenuUiManager.Update(dt);
}

export function DrawMainMenu(ctx: CanvasRenderingContext2D) {
    mainMenuUiManager.Draw(ctx);
}
