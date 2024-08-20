import { IGameStatManager } from '../GameStatManager';
import { IScene, IServiceSceneManager } from '../SceneManager';
import { CANVA_SCALEX, CANVA_SCALEY } from '../ScreenConstant';
import { ServiceLocator } from '../ServiceLocator';
import { FieldWithText } from './BaseUserInterface/FieldWithText';
import { UIManager } from './BaseUserInterface/UIManager';

export class GameOverScene implements IScene {
    private gameOverUiManager: UIManager;
    Load(): void {
        this.loadUI();
    }
    Update(dt: number): void {
        this.gameOverUiManager.Update(dt);
    }
    Draw(ctx: CanvasRenderingContext2D): void {
        this.gameOverUiManager.Draw(ctx);
    }
    Unload(): void {}

    private loadUI() {
        this.gameOverUiManager = new UIManager();

        /* Return to Main-Menu Button*/
        const widthReturnButton = 62 * CANVA_SCALEX;
        const heightReturnButton = 10 * CANVA_SCALEY;
        const xReturnButton = 235 * CANVA_SCALEX;
        const yReturnButton = 165 * CANVA_SCALEY;
        const gameOverReturnButton = new FieldWithText({
            x: xReturnButton,
            y: yReturnButton,
            width: widthReturnButton,
            height: heightReturnButton,
            text: 'MAIN-MENU',
            fontSize: UIManager.Typography.button.fontSize,
            fontFamily: UIManager.Typography.button.fontFamily,
            HasHovered: true,
            onClick: () => {
                const SceneManager = ServiceLocator.GetService<IServiceSceneManager>('SceneManager');
                SceneManager.PlayMainScene('MainMenu');
            },
        });
        this.gameOverUiManager.AddComponent(gameOverReturnButton);

        /* Text that show the time the player finished 100 rounds */
        const gameStatManager = ServiceLocator.GetService<IGameStatManager>('GameStatManager');
        const { hasWon, round } = gameStatManager.HasPlayerWon();
        const timePlayerSurvived = gameStatManager.GetTimePlayerHasSurvived();
        if (hasWon) {
            this.UIToShowIfPlayerWin({ uiManager: this.gameOverUiManager, round, timePlayerSurvived });
        } else {
            this.UIToShowIfPlayerLose({ uiManager: this.gameOverUiManager, round, timePlayerSurvived });
        }
    }

    private UIToShowIfPlayerWin(parameters: { uiManager: UIManager; round: number; timePlayerSurvived: string }) {
        /* Text that show the time the player finished 100 rounds */
        const widthTimeText = 255 * CANVA_SCALEX;
        const heightTimeText = 6 * CANVA_SCALEY;
        const xTimeText = 21 * CANVA_SCALEX;
        const yTimeText = 19 * CANVA_SCALEY;
        const gameOverTimeText = new FieldWithText({
            x: xTimeText,
            y: yTimeText,
            width: widthTimeText,
            height: heightTimeText,
            text: `YOU WON, YOU DID A 100 ROUNDS IN: ${parameters.timePlayerSurvived}`,
            fontSize: UIManager.Typography.button.fontSize,
            fontFamily: UIManager.Typography.button.fontFamily,
            leftAlign: true,
        });
        gameOverTimeText.HasBorderOnAllSide = false;
        parameters.uiManager.AddComponent(gameOverTimeText);
    }

    private UIToShowIfPlayerLose(parameters: { uiManager: UIManager; round: number; timePlayerSurvived: string }) {
        /* Text that show how many rounds the player survived */
        const widthTimeText = 215 * CANVA_SCALEX;
        const heightTimeText = 6 * CANVA_SCALEY;
        const xTimeText = 21 * CANVA_SCALEX;
        const yTimeText = 19 * CANVA_SCALEY;
        const gameOverTimeText = new FieldWithText({
            x: xTimeText,
            y: yTimeText,
            width: widthTimeText,
            height: heightTimeText,
            text: `YOU LOST, YOU REACHED ROUND: ${parameters.round}`,
            fontSize: UIManager.Typography.button.fontSize,
            fontFamily: UIManager.Typography.button.fontFamily,
            leftAlign: true,
        });
        gameOverTimeText.HasBorderOnAllSide = false;
        parameters.uiManager.AddComponent(gameOverTimeText);

        /* Text that shows how long the player survived */
        const widthSurvivalTimeText = 215 * CANVA_SCALEX;
        const heightSurvivalTimeText = 6 * CANVA_SCALEY;
        const xSurvivalTimeText = 21 * CANVA_SCALEX;
        const ySurvivalTimeText = 29 * CANVA_SCALEY;

        const gameOverSurvivalTimeText = new FieldWithText({
            x: xSurvivalTimeText,
            y: ySurvivalTimeText,
            width: widthSurvivalTimeText,
            height: heightSurvivalTimeText,
            text: `YOU SURVIVED FOR: ${parameters.timePlayerSurvived}`,
            fontSize: UIManager.Typography.button.fontSize,
            fontFamily: UIManager.Typography.button.fontFamily,
            leftAlign: true,
        });

        gameOverSurvivalTimeText.HasBorderOnAllSide = false;
        parameters.uiManager.AddComponent(gameOverSurvivalTimeText);
    }
}
