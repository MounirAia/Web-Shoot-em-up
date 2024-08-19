import { IServiceKeyboardManager } from '../Keyboard';
import { IScene, IServiceSceneManager } from '../SceneManager';
import { CANVA_SCALEX, CANVA_SCALEY } from '../ScreenConstant';
import { ServiceLocator } from '../ServiceLocator';
import { FieldWithText } from './BaseUserInterface/FieldWithText';
import { UIManager } from './BaseUserInterface/UIManager';

class SetOptionsSection {
    private setOptionsSectionManager: UIManager;
    constructor() {
        this.setOptionsSectionManager = new UIManager();

        /* Reset Settings button */
        const resetButton = new FieldWithText({
            x: 54 * CANVA_SCALEX,
            y: 142 * CANVA_SCALEY,
            width: 86 * CANVA_SCALEX,
            height: 10 * CANVA_SCALEY,
            text: 'RESET-SETTINGS',
            fontSize: UIManager.Typography.button.fontSize,
            fontFamily: UIManager.Typography.button.fontFamily,
            HasHovered: true,
        });
        this.setOptionsSectionManager.AddComponent(resetButton);

        /* Confirm button */
        const confirmButton = new FieldWithText({
            x: 216 * CANVA_SCALEX,
            y: 142 * CANVA_SCALEY,
            width: 50 * CANVA_SCALEX,
            height: 10 * CANVA_SCALEY,
            text: 'CONFIRM',
            fontSize: UIManager.Typography.button.fontSize,
            fontFamily: UIManager.Typography.button.fontFamily,
            HasHovered: true,
        });
        this.setOptionsSectionManager.AddComponent(confirmButton);
    }

    public Update(dt: number) {
        this.setOptionsSectionManager.Update(dt);
    }

    public Draw(ctx: CanvasRenderingContext2D) {
        this.setOptionsSectionManager.Draw(ctx);
    }
}

class OptionMenuFrame {
    private lineWidth: number;

    constructor() {
        this.lineWidth = 1 * CANVA_SCALEX;
    }

    public Draw(ctx: CanvasRenderingContext2D) {
        this.drawFrame(ctx);
    }

    private drawFrame(ctx: CanvasRenderingContext2D) {
        /* Main Frame */
        const frameX = 20 * CANVA_SCALEX;
        const frameY = 2 * CANVA_SCALEY;
        const frameWidth = 280 * CANVA_SCALEX;
        const frameHeight = 168 * CANVA_SCALEY;

        ctx.fillStyle = '#B09F9E';
        ctx.fillRect(frameX, frameY, frameWidth, frameHeight);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = this.lineWidth; // You can adjust the line width as needed
        ctx.strokeRect(frameX, frameY, frameWidth, frameHeight);

        /* Line inside the Frame */
        const lineY = 10 * CANVA_SCALEY;
        ctx.beginPath();
        ctx.moveTo(frameX, lineY);
        ctx.lineTo(frameX + frameWidth, lineY);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = this.lineWidth;
        ctx.stroke();

        /* Frame Of Options */
        const frameOptionsX = 36 * CANVA_SCALEX;
        const frameOptionsY = 35 * CANVA_SCALEY;
        const frameOptionsWidth = 248 * CANVA_SCALEX;
        const frameOptionsHeight = 120 * CANVA_SCALEY;

        ctx.strokeRect(frameOptionsX, frameOptionsY, frameOptionsWidth, frameOptionsHeight);
    }
}

export class OptionMenu implements IScene {
    private optionMenuFrame: OptionMenuFrame;
    private setOptionsSection: SetOptionsSection;
    constructor() {}

    Load(): void {
        this.optionMenuFrame = new OptionMenuFrame();
        this.setOptionsSection = new SetOptionsSection();
    }
    Update(dt: number): void {
        const keyboardManager = ServiceLocator.GetService<IServiceKeyboardManager>('KeyboardManager');
        if (keyboardManager.GetCommandState({ command: 'CloseOptionMenu' }).IsPressed) {
            const sceneManager = ServiceLocator.GetService<IServiceSceneManager>('SceneManager');
            sceneManager.PlaySecondaryScene('None');
        }
        this.setOptionsSection.Update(dt);
    }
    Draw(ctx: CanvasRenderingContext2D): void {
        this.optionMenuFrame.Draw(ctx);
        this.setOptionsSection.Draw(ctx);
    }
    Unload(): void {}
}
