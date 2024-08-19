import { IServiceKeyboardManager } from '../Keyboard';
import { IScene, IServiceSceneManager } from '../SceneManager';
import { CANVA_SCALEX, CANVA_SCALEY } from '../ScreenConstant';
import { ServiceLocator } from '../ServiceLocator';
import { IServicePlayer } from '../Sprites/Player';
import { PossibleSkillLevel, SkillsTypeName } from '../Sprites/PlayerSkills/Skills';
import { BaseField } from './BaseUserInterface/BaseField';
import { FieldSkillFactory } from './BaseUserInterface/FieldSkill';
import { FieldWithText } from './BaseUserInterface/FieldWithText';
import { IUIComponent, UIManager } from './BaseUserInterface/UIManager';

class BuySkillSection {
    private skillUIManager: UIManager;
    private currentFocusedField: {
        fieldImage: BaseField;
        fieldText: IUIComponent[];
        price: number;
        type: SkillsTypeName | 'boost';
        level?: PossibleSkillLevel;
    };

    constructor() {
        this.skillUIManager = new UIManager();
        const skillFactory = new FieldSkillFactory();
        const player = ServiceLocator.GetService<IServicePlayer>('Player');
        const playerSpecialSkillName = player.SpecialSkillName!;
        const playerEffectSkillName = player.EffectSkillName!;
        const playerSupportSkillName = player.SupportSkillName!;
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
                skillName: playerSpecialSkillName,
                skillLevel: level,
                x: 95 * CANVA_SCALEX + (level - 1) * 26 * CANVA_SCALEX,
                y: 19 * CANVA_SCALEY,
                onClick: () => {
                    this.focusField({
                        fieldImage: specialSkill.skillImage,
                        fieldText: specialSkill.skillText,
                        price: specialSkill.price,
                        type: 'special',
                        level: level,
                    });
                },
            });

            if (player.GetSkillLevel({ skillType: 'special' }) < level) specialSkill.skillImage.SetDisabled(true);

            this.skillUIManager.AddComponent(specialSkill.skillImage);
            this.skillUIManager.AddComponents(specialSkill.skillText);
            this.skillUIManager.HideComponents(specialSkill.skillText);
            // By default, the first level special skill is focused
            if (level === 1) {
                this.currentFocusedField = {
                    fieldImage: specialSkill.skillImage,
                    fieldText: specialSkill.skillText,
                    price: specialSkill.price,
                    type: 'special',
                    level: level,
                };
                this.focusField({
                    fieldImage: specialSkill.skillImage,
                    fieldText: specialSkill.skillText,
                    price: specialSkill.price,
                    type: 'special',
                    level: level,
                });
            }

            // Effect Skill
            const effectSkill = skillFactory.CreateShoppingFieldSkill({
                skillName: playerEffectSkillName,
                skillLevel: level,
                x: 95 * CANVA_SCALEX + (level - 1) * 26 * CANVA_SCALEX,
                y: 43 * CANVA_SCALEY,
                onClick: () => {
                    this.focusField({
                        fieldImage: effectSkill.skillImage,
                        fieldText: effectSkill.skillText,
                        price: effectSkill.price,
                        type: 'effect',
                        level: level,
                    });
                },
            });
            if (player.GetSkillLevel({ skillType: 'effect' }) < level) effectSkill.skillImage.SetDisabled(true);

            this.skillUIManager.AddComponent(effectSkill.skillImage);
            this.skillUIManager.AddComponents(effectSkill.skillText);
            this.skillUIManager.HideComponents(effectSkill.skillText);

            // Support Skill
            const supportSkill = skillFactory.CreateShoppingFieldSkill({
                skillName: playerSupportSkillName,
                skillLevel: level,
                x: 95 * CANVA_SCALEX + (level - 1) * 26 * CANVA_SCALEX,
                y: 66 * CANVA_SCALEY,
                onClick: () => {
                    this.focusField({
                        fieldImage: supportSkill.skillImage,
                        fieldText: supportSkill.skillText,
                        price: supportSkill.price,
                        type: 'support',
                        level: level,
                    });
                },
            });
            if (player.GetSkillLevel({ skillType: 'support' }) < level) supportSkill.skillImage.SetDisabled(true);

            this.skillUIManager.AddComponent(supportSkill.skillImage);
            this.skillUIManager.AddComponents(supportSkill.skillText);
            this.skillUIManager.HideComponents(supportSkill.skillText);
        }
        /* Buy Boost Field */
        const buyBoostTitle = new FieldWithText({
            x: 28 * CANVA_SCALEX,
            y: 96 * CANVA_SCALEY,
            width: 64 * CANVA_SCALEX,
            height: 8 * CANVA_SCALEY,
            text: 'BOOST',
            fontSize: UIManager.Typography.title.fontSize,
            fontFamily: UIManager.Typography.title.fontFamily,
            leftAlign: true,
        });
        buyBoostTitle.HasBorderOnAllSide = false;
        this.skillUIManager.AddComponent(buyBoostTitle);

        const buyBoostField = skillFactory.CreateShoppingBoostFieldSkill({
            x: 95 * CANVA_SCALEX,
            y: 90 * CANVA_SCALEY,
            onClick: () => {
                this.focusField({
                    fieldImage: buyBoostField.skillImage,
                    fieldText: buyBoostField.skillText,
                    price: buyBoostField.price,
                    type: 'boost',
                });
            },
        });
        if (player.GetIsMaxNumberBoostAttained()) buyBoostField.skillImage.SetDisabled(true);

        this.skillUIManager.AddComponent(buyBoostField.skillImage);
        this.skillUIManager.AddComponents(buyBoostField.skillText);
        this.skillUIManager.HideComponents(buyBoostField.skillText);

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
                this.buyField();
                const playerBalance = ServiceLocator.GetService<IServicePlayer>('Player').MoneyInWallet;
                playerBalanceValue.SetText(`${playerBalance}$`);
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

    private focusField(fieldToFocus: {
        fieldImage: BaseField;
        fieldText: IUIComponent[];
        price: number;
        type: SkillsTypeName | 'boost';
        level?: PossibleSkillLevel;
    }) {
        this.currentFocusedField.fieldImage.SetActive(false);
        this.skillUIManager.HideComponents(this.currentFocusedField.fieldText);
        this.skillUIManager.ShowComponents(fieldToFocus.fieldText);
        fieldToFocus.fieldImage.SetActive(true);
        this.currentFocusedField = fieldToFocus;
    }

    private buySkill(parameters: {
        selectedSkillLevel: PossibleSkillLevel;
        selectedSkillPrice: number;
        selectedSkillType: SkillsTypeName;
    }) {
        const { selectedSkillLevel, selectedSkillType, selectedSkillPrice } = parameters;
        const player = ServiceLocator.GetService<IServicePlayer>('Player');
        let playerBalance = player.MoneyInWallet;
        const playerSkillLevel = player.GetSkillLevel({ skillType: selectedSkillType });

        // 1) verify if the player can buy the progression of the skill level
        if (selectedSkillLevel - playerSkillLevel !== 1) return;

        // 2) verify if the player has enough money to buy the skill
        if (playerBalance - selectedSkillPrice < 0) return;

        player.MakeTransactionOnWallet(-selectedSkillPrice);

        player.UpgradeSkillLevel({ skillType: selectedSkillType });
    }

    private buyBoost(parameters: { boostPrice: number }) {
        const { boostPrice } = parameters;
        const player = ServiceLocator.GetService<IServicePlayer>('Player');
        let playerBalance = player.MoneyInWallet;
        // 1) verify if the player has already reached the max number of boost
        if (player.GetIsMaxNumberBoostAttained()) return;

        // 2) verify if the player has enough money to buy the boost
        if (playerBalance - boostPrice < 0) return;
        player.MakeTransactionOnWallet(-boostPrice);
        player.UpgradeBoost();

        // 3) if the player attained the max number of boost after the transaction, disable the boost field
        if (player.GetIsMaxNumberBoostAttained()) return;
    }

    private buyField() {
        const { type, level, price } = this.currentFocusedField;
        const player = ServiceLocator.GetService<IServicePlayer>('Player');
        const oldBalance = player.MoneyInWallet;

        if (type === 'boost') {
            this.buyBoost({ boostPrice: price });
        } else {
            this.buySkill({ selectedSkillLevel: level!, selectedSkillPrice: price, selectedSkillType: type });
        }

        const newBalance = player.MoneyInWallet;
        if (oldBalance !== newBalance) this.currentFocusedField.fieldImage.SetDisabled(false);

        // When the player has reached the max number of boost, disable the boost field
        if (type === 'boost' && player.GetIsMaxNumberBoostAttained())
            this.currentFocusedField.fieldImage.SetDisabled(true);
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
        const keyboardManager = ServiceLocator.GetService<IServiceKeyboardManager>('KeyboardManager');
        if (keyboardManager.GetCommandState({ command: 'CloseShopMenu' }).IsPressed) {
            ServiceLocator.GetService<IServiceSceneManager>('SceneManager').PlaySecondaryScene('None');
        }
    }
    Draw(ctx: CanvasRenderingContext2D): void {
        this.shoppingMenuFrame.Draw(ctx);
        this.buySkillSection.Draw(ctx);
    }
    Unload(): void {}
}
