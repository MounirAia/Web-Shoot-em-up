import { Keyboard } from '../Keyboard';
import { IScene, IServiceSceneManager } from '../SceneManager';
import { CANVA_SCALEX, CANVA_SCALEY } from '../ScreenConstant';
import { ServiceLocator } from '../ServiceLocator';
import { IServicePlayer } from '../Sprites/Player';
import { BaseField } from './BaseUserInterface/BaseField';
import { FieldSkillFactory } from './BaseUserInterface/FieldSkill';
import { FieldWithText } from './BaseUserInterface/FieldWithText';
import { IUIComponent, UIManager } from './BaseUserInterface/UIManager';

class BuySkillSection {
    private skillUIManager: UIManager;
    private currentFocusedField: { fieldImage: BaseField; fieldText: IUIComponent[] };

    private focusField(fieldToFocus: { fieldImage: BaseField; fieldText: IUIComponent[] }) {
        this.currentFocusedField.fieldImage.SetActive(false);
        this.skillUIManager.HideComponents(this.currentFocusedField.fieldText);
        this.skillUIManager.ShowComponents(fieldToFocus.fieldText);
        fieldToFocus.fieldImage.SetActive(true);
        this.currentFocusedField = fieldToFocus;
    }

    constructor() {
        this.skillUIManager = new UIManager();
        const skillFactory = new FieldSkillFactory();

        /* Skill Title */
        const specialSkillTitle = new FieldWithText({
            x: 28 * CANVA_SCALEX,
            y: 23 * CANVA_SCALEY,
            width: 64 * CANVA_SCALEX,
            height: 8 * CANVA_SCALEY,
            text: 'SPECIAL',
            fontSize: UIManager.Typography.title.fontSize,
            fontFamily: UIManager.Typography.title.fontFamily,
            leftAlign: true,
        });
        specialSkillTitle.HasBorderOnAllSide = false;
        this.skillUIManager.AddComponent(specialSkillTitle);

        const effectSkillTitle = new FieldWithText({
            x: 28 * CANVA_SCALEX,
            y: 48 * CANVA_SCALEY,
            width: 64 * CANVA_SCALEX,
            height: 8 * CANVA_SCALEY,
            text: 'EFFECT',
            fontSize: UIManager.Typography.title.fontSize,
            fontFamily: UIManager.Typography.title.fontFamily,
            leftAlign: true,
        });
        effectSkillTitle.HasBorderOnAllSide = false;
        this.skillUIManager.AddComponent(effectSkillTitle);

        const supportSkillTitle = new FieldWithText({
            x: 28 * CANVA_SCALEX,
            y: 70 * CANVA_SCALEY,
            width: 64 * CANVA_SCALEX,
            height: 8 * CANVA_SCALEY,
            text: 'SUPPORT',
            fontSize: UIManager.Typography.title.fontSize,
            fontFamily: UIManager.Typography.title.fontFamily,
            leftAlign: true,
        });
        supportSkillTitle.HasBorderOnAllSide = false;
        this.skillUIManager.AddComponent(supportSkillTitle);

        /* Skill Shopping Menu */
        const skillsLevel = [1, 2, 3] as const;

        for (const level of skillsLevel) {
            // Special Skill
            const specialSkill = skillFactory.CreateShoppingFieldSkill({
                skillName: 'Rocket',
                skillLevel: level,
                rowX: 95 * CANVA_SCALEX + (level - 1) * 26 * CANVA_SCALEX,
                rowY: 19 * CANVA_SCALEY,
                onClick: () => {
                    this.focusField({
                        fieldImage: specialSkill.skillImage,
                        fieldText: specialSkill.skillText,
                    });
                },
            });

            this.skillUIManager.AddComponent(specialSkill.skillImage);
            this.skillUIManager.AddComponents(specialSkill.skillText);
            this.skillUIManager.HideComponents(specialSkill.skillText);
            // By default, the first level special skill is focused
            if (level === 1) {
                this.currentFocusedField = { fieldImage: specialSkill.skillImage, fieldText: specialSkill.skillText };
                this.focusField({
                    fieldImage: specialSkill.skillImage,
                    fieldText: specialSkill.skillText,
                });
            }

            // Effect Skill
            const effectSkill = skillFactory.CreateShoppingFieldSkill({
                skillName: 'Blade',
                skillLevel: level,
                rowX: 95 * CANVA_SCALEX + (level - 1) * 26 * CANVA_SCALEX,
                rowY: 43 * CANVA_SCALEY,
                onClick: () => {
                    this.focusField({
                        fieldImage: effectSkill.skillImage,
                        fieldText: effectSkill.skillText,
                    });
                },
            });

            this.skillUIManager.AddComponent(effectSkill.skillImage);
            this.skillUIManager.AddComponents(effectSkill.skillText);
            this.skillUIManager.HideComponents(effectSkill.skillText);

            // Support Skill
            const supportSkill = skillFactory.CreateShoppingFieldSkill({
                skillName: 'MirrorShield',
                skillLevel: level,
                rowX: 95 * CANVA_SCALEX + (level - 1) * 26 * CANVA_SCALEX,
                rowY: 66 * CANVA_SCALEY,
                onClick: () => {
                    this.focusField({
                        fieldImage: supportSkill.skillImage,
                        fieldText: supportSkill.skillText,
                    });
                },
            });

            this.skillUIManager.AddComponent(supportSkill.skillImage);
            this.skillUIManager.AddComponents(supportSkill.skillText);
            this.skillUIManager.HideComponents(supportSkill.skillText);
        }

        /* Player Balance Text */
        const playerBalanceText = new FieldWithText({
            x: 28 * CANVA_SCALEX,
            y: 132 * CANVA_SCALEY,
            width: 50 * CANVA_SCALEX,
            height: 6 * CANVA_SCALEY,
            leftAlign: true,
            text: 'BALANCE:',
            fontSize: UIManager.Typography.button.fontSize,
            fontFamily: UIManager.Typography.button.fontFamily,
        });
        playerBalanceText.HasBorderOnAllSide = false;
        this.skillUIManager.AddComponent(playerBalanceText);

        const playerBalance = ServiceLocator.GetService<IServicePlayer>('Player').MoneyInWallet;
        const playerBalanceValue = new FieldWithText({
            x: 79 * CANVA_SCALEX,
            y: 132 * CANVA_SCALEY,
            width: 50 * CANVA_SCALEX,
            height: 6 * CANVA_SCALEY,
            leftAlign: true,
            text: `${playerBalance}$`,
            fontSize: UIManager.Typography.button.fontSize,
            fontFamily: UIManager.Typography.button.fontFamily,
        });
        playerBalanceValue.HasBorderOnAllSide = false;
        this.skillUIManager.AddComponent(playerBalanceValue);

        /* Price Text */
        const priceText = new FieldWithText({
            x: 28 * CANVA_SCALEX,
            y: 158 * CANVA_SCALEY,
            width: 37 * CANVA_SCALEX,
            height: 6 * CANVA_SCALEY,
            leftAlign: true,
            text: 'PRICE:',
            fontSize: UIManager.Typography.button.fontSize,
            fontFamily: UIManager.Typography.button.fontFamily,
        });
        priceText.HasBorderOnAllSide = false;
        this.skillUIManager.AddComponent(priceText);

        /* Buy Button */
        const buyButton = new FieldWithText({
            x: 124 * CANVA_SCALEX,
            y: 156 * CANVA_SCALEY,
            width: 45 * CANVA_SCALEX,
            height: 10 * CANVA_SCALEY,
            text: 'BUY',
            fontSize: UIManager.Typography.button.fontSize,
            fontFamily: UIManager.Typography.button.fontFamily,
            HasHovered: true,
            onClick: () => {
                console.log('Buy Button Clicked');
            },
        });
        this.skillUIManager.AddComponent(buyButton);

        /* Resume Button */
        const resumeButton = new FieldWithText({
            x: 248 * CANVA_SCALEX,
            y: 156 * CANVA_SCALEY,
            width: 44 * CANVA_SCALEX,
            height: 10 * CANVA_SCALEY,
            text: 'RESUME',
            fontSize: UIManager.Typography.button.fontSize,
            fontFamily: UIManager.Typography.button.fontFamily,
            HasHovered: true,
            onClick: () => {
                ServiceLocator.GetService<IServiceSceneManager>('SceneManager').PlaySecondaryScene('None');
            },
        });
        this.skillUIManager.AddComponent(resumeButton);
    }

    public Update(dt: number) {
        this.skillUIManager.Update(dt);
    }

    public Draw(ctx: CanvasRenderingContext2D) {
        this.skillUIManager.Draw(ctx);
    }
}

class ShoppingMenuFrame {
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

        /* Skill Description */
        const skillDescriptionX = 172 * CANVA_SCALEX;
        const skillDescriptionY = 19 * CANVA_SCALEY;
        const skillDescriptionWidth = 120 * CANVA_SCALEX;
        const skillDescriptionHeight = 119 * CANVA_SCALEY;

        ctx.strokeRect(skillDescriptionX, skillDescriptionY, skillDescriptionWidth, skillDescriptionHeight);
    }
}

export class ShoppingMenuScene implements IScene {
    private shoppingMenuFrame: ShoppingMenuFrame;
    private buySkillSection: BuySkillSection;

    constructor() {}

    Load(): void {
        this.shoppingMenuFrame = new ShoppingMenuFrame();
        this.buySkillSection = new BuySkillSection();
    }

    Update(dt: number): void {
        this.buySkillSection.Update(dt);
        if (Keyboard.h.IsPressed) {
            ServiceLocator.GetService<IServiceSceneManager>('SceneManager').PlaySecondaryScene('None');
        }
    }
    Draw(ctx: CanvasRenderingContext2D): void {
        this.shoppingMenuFrame.Draw(ctx);
        this.buySkillSection.Draw(ctx);
    }
    Unload(): void {}
}
