import { IScene, IServiceSceneManager } from '../SceneManager.js';
import { CANVA_SCALEX, CANVA_SCALEY } from '../ScreenConstant.js';
import { ServiceLocator } from '../ServiceLocator.js';
import { FieldWithText } from './BaseUserInterface/FieldWithText.js';
import { FieldSkillFactory } from './BaseUserInterface/FieldSkill.js';
import { IUIComponent, UIManager } from './BaseUserInterface/UIManager.js';
import { PossibleSkillName, SkillsTypeName } from '../Sprites/PlayerSkills/Skills.js';
import { IServicePlayer } from '../Sprites/Player.js';

export class SelectSkillScene implements IScene {
    private selectSkillSceneUIManager = new UIManager();
    private selectedSkill: Record<
        SkillsTypeName,
        {
            chosenSkill: IUIComponent | undefined;
            skillTree: IUIComponent[] | undefined;
        }
    > = {
        special: {
            chosenSkill: undefined,
            skillTree: undefined,
        },
        effect: {
            chosenSkill: undefined,
            skillTree: undefined,
        },
        support: {
            chosenSkill: undefined,
            skillTree: undefined,
        },
    };

    Load(): void {
        this.loadUI();
    }
    Update(dt: number): void {
        this.selectSkillSceneUIManager.Update(dt);
    }
    Draw(ctx: CanvasRenderingContext2D): void {
        this.selectSkillSceneUIManager.Draw(ctx);
    }
    Unload(): void {
        this.selectSkillSceneUIManager = new UIManager();
    }

    private focusASkill(parameters: {
        skillType: SkillsTypeName;
        skillName: PossibleSkillName;
        chosenSkill: IUIComponent;
        skillTree: IUIComponent[];
    }) {
        // Remove the previous selected skill
        this.selectedSkill[parameters.skillType].chosenSkill?.SetActive(false);
        if (this.selectedSkill[parameters.skillType].skillTree)
            this.selectSkillSceneUIManager.HideComponents(this.selectedSkill[parameters.skillType].skillTree!);

        this.selectedSkill[parameters.skillType].chosenSkill = parameters.chosenSkill;
        this.selectedSkill[parameters.skillType].chosenSkill?.SetActive(true);
        this.selectedSkill[parameters.skillType].skillTree = parameters.skillTree;
        this.selectSkillSceneUIManager.ShowComponents(parameters.skillTree);

        // Select the skill for the player, but do not update the player skills yet with the real object
        ServiceLocator.GetService<IServicePlayer>('Player').SetSkill({
            skillType: parameters.skillType,
            skillName: parameters.skillName,
        });
    }

    private loadUI() {
        const SceneManager = ServiceLocator.GetService<IServiceSceneManager>('SceneManager');
        const fieldSkillFactory = new FieldSkillFactory();
        // Define the Choose Skill title
        const widthTitle = 120 * CANVA_SCALEX;
        const heightTitle = 9 * CANVA_SCALEY;
        const xTitle = 6 * CANVA_SCALEX; // canvas.width / 2 - widthPlayButton / 2;
        const yTitle = 10 * CANVA_SCALEY; // canvas.height / 2 - heightPlayButton - heightPlayButton / 2;
        const selectSkillTitle = new FieldWithText({
            x: xTitle,
            y: yTitle,
            width: widthTitle,
            height: heightTitle,
            text: 'Choose Skills',
            fontSize: UIManager.Typography.title.fontSize,
            fontFamily: UIManager.Typography.title.fontFamily,
        });
        selectSkillTitle.HasBorderOnAllSide = false;
        selectSkillTitle.HasBottomBorder = true;

        this.selectSkillSceneUIManager.AddComponent(selectSkillTitle);

        // Define the Evolution title
        const widthEvolutionTitle = 88 * CANVA_SCALEX;
        const heightEvolutionTitle = 9 * CANVA_SCALEY;
        const xEvolutionTitle = 6 * CANVA_SCALEX; // canvas.width / 2 - widthPlayButton / 2;
        const yEvolutionTitle = 77 * CANVA_SCALEY; // canvas.height / 2 - heightPlayButton - heightPlayButton / 2;
        const selectSkillEvolutionTitle = new FieldWithText({
            x: xEvolutionTitle,
            y: yEvolutionTitle,
            width: widthEvolutionTitle,
            height: heightEvolutionTitle,
            text: 'Evolution',
            fontSize: UIManager.Typography.title.fontSize,
            fontFamily: UIManager.Typography.title.fontFamily,
        });
        selectSkillEvolutionTitle.HasBorderOnAllSide = false;
        selectSkillEvolutionTitle.HasBottomBorder = true;

        this.selectSkillSceneUIManager.AddComponent(selectSkillEvolutionTitle);

        // Define the play button
        const widthPlayButton = 41 * CANVA_SCALEX;
        const heightPlayButton = 11 * CANVA_SCALEY;
        const xPlayButton = 273 * CANVA_SCALEX; //canvas.width / 2 - widthPlayButton / 2;
        const yPlayButton = 10 * CANVA_SCALEY; //canvas.height / 2 - heightPlayButton - heightPlayButton / 2;
        const selectSkillPlayButton = new FieldWithText({
            x: xPlayButton,
            y: yPlayButton,
            width: widthPlayButton,
            height: heightPlayButton,
            text: 'PLAY',
            fontSize: UIManager.Typography.button.fontSize,
            fontFamily: UIManager.Typography.button.fontFamily,
            HasHovered: true,
            onClick: () => {
                // Update the player skill with the real object, so trigger any side effect of choosing a skill
                ServiceLocator.GetService<IServicePlayer>('Player').UpdateSkill();
                SceneManager.PlayMainScene('Game');
            },
        });

        this.selectSkillSceneUIManager.AddComponent(selectSkillPlayButton);

        /**
         * SKILL DESCRIPTION SECTION
         */
        const rocketSkillColumnDescription = fieldSkillFactory.CreateColumnFieldSkillWithText({
            skillName: 'Rocket',
            columnX: 6 * CANVA_SCALEX,
            columnY: 98 * CANVA_SCALEY,
        });
        this.selectSkillSceneUIManager.HideComponents(rocketSkillColumnDescription);
        this.selectSkillSceneUIManager.AddComponents(rocketSkillColumnDescription);

        const bladeSkillColumnDescription = fieldSkillFactory.CreateColumnFieldSkillWithText({
            skillName: 'Blade',
            columnX: 113 * CANVA_SCALEX,
            columnY: 98 * CANVA_SCALEY,
        });

        this.selectSkillSceneUIManager.HideComponents(bladeSkillColumnDescription);
        this.selectSkillSceneUIManager.AddComponents(bladeSkillColumnDescription);

        const mirrorSkillColumnDescription = fieldSkillFactory.CreateColumnFieldSkillWithText({
            skillName: 'MirrorShield',
            columnX: 228 * CANVA_SCALEX,
            columnY: 98 * CANVA_SCALEY,
        });

        this.selectSkillSceneUIManager.HideComponents(mirrorSkillColumnDescription);
        this.selectSkillSceneUIManager.AddComponents(mirrorSkillColumnDescription);

        const fuelChargeShotSkillColumnDescription = fieldSkillFactory.CreateColumnFieldSkillWithText({
            skillName: 'FuelChargeShot',
            columnX: 228 * CANVA_SCALEX,
            columnY: 98 * CANVA_SCALEY,
        });

        this.selectSkillSceneUIManager.HideComponents(fuelChargeShotSkillColumnDescription);
        this.selectSkillSceneUIManager.AddComponents(fuelChargeShotSkillColumnDescription);

        /**
         * SELECT SKILL SECTION
         */
        const selectRocketSkill = fieldSkillFactory.CreateFieldSkill({
            x: 6 * CANVA_SCALEX,
            y: 28 * CANVA_SCALEY,
            skillName: 'Rocket',
            skillLevel: 1,
            onClick: () => {
                this.focusASkill({
                    skillType: 'special',
                    skillName: 'Rocket',
                    chosenSkill: selectRocketSkill,
                    skillTree: rocketSkillColumnDescription,
                });
            },
        });

        const selectBladeSkill = fieldSkillFactory.CreateFieldSkill({
            x: 113 * CANVA_SCALEX,
            y: 28 * CANVA_SCALEY,
            skillName: 'Blade',
            skillLevel: 1,
            onClick: () => {
                this.focusASkill({
                    skillType: 'effect',
                    skillName: 'Blade',
                    chosenSkill: selectBladeSkill,
                    skillTree: bladeSkillColumnDescription,
                });
            },
        });

        const selectMirrorSkill = fieldSkillFactory.CreateFieldSkill({
            x: 228 * CANVA_SCALEX,
            y: 28 * CANVA_SCALEY,
            skillName: 'MirrorShield',
            skillLevel: 1,
            onClick: () => {
                this.focusASkill({
                    skillType: 'support',
                    skillName: 'MirrorShield',
                    chosenSkill: selectMirrorSkill,
                    skillTree: mirrorSkillColumnDescription,
                });
            },
        });
        const selectFuelChargeShotSkill = fieldSkillFactory.CreateFieldSkill({
            x: 256 * CANVA_SCALEX,
            y: 28 * CANVA_SCALEY,
            skillName: 'FuelChargeShot',
            skillLevel: 1,
            onClick: () => {
                this.focusASkill({
                    skillType: 'support',
                    skillName: 'FuelChargeShot',
                    chosenSkill: selectFuelChargeShotSkill,
                    skillTree: fuelChargeShotSkillColumnDescription,
                });
            },
        });

        this.selectSkillSceneUIManager.AddComponent(selectBladeSkill);
        this.selectSkillSceneUIManager.AddComponent(selectRocketSkill);
        this.selectSkillSceneUIManager.AddComponent(selectMirrorSkill);
        this.selectSkillSceneUIManager.AddComponent(selectFuelChargeShotSkill);

        /**
         * Default selected skill
         */
        this.focusASkill({
            skillType: 'special',
            skillName: 'Rocket',
            chosenSkill: selectRocketSkill,
            skillTree: rocketSkillColumnDescription,
        });

        this.focusASkill({
            skillType: 'effect',
            skillName: 'Blade',
            chosenSkill: selectBladeSkill,
            skillTree: bladeSkillColumnDescription,
        });

        this.focusASkill({
            skillType: 'support',
            skillName: 'MirrorShield',
            chosenSkill: selectMirrorSkill,
            skillTree: mirrorSkillColumnDescription,
        });
    }
}
