import { IServiceSceneManager } from '../SceneManager.js';
import { CANVA_SCALEX, CANVA_SCALEY } from '../ScreenConstant.js';
import { ServiceLocator } from '../ServiceLocator.js';
import { FieldWithText } from './BaseUserInterface/FieldWithText.js';
import { FieldSkillFactory } from './BaseUserInterface/FieldSkill.js';
import { IUIComponent, UIManager } from './BaseUserInterface/UIManager.js';
import { PossibleSkillName, SkillsTypeName } from '../Sprites/PlayerSkills/Skills.js';
import { IServicePlayer } from '../Sprites/Player.js';

const selectSkillSceneUIManager = new UIManager();
const selectedSkill: Record<
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

function focusASkill(parameters: {
    skillType: SkillsTypeName;
    skillName: PossibleSkillName;
    chosenSkill: IUIComponent;
    skillTree: IUIComponent[];
}) {
    // Remove the previous selected skill
    selectedSkill[parameters.skillType].chosenSkill?.SetActive(false);
    if (selectedSkill[parameters.skillType].skillTree)
        selectSkillSceneUIManager.HideComponents(selectedSkill[parameters.skillType].skillTree!);

    selectedSkill[parameters.skillType].chosenSkill = parameters.chosenSkill;
    selectedSkill[parameters.skillType].chosenSkill?.SetActive(true);
    selectedSkill[parameters.skillType].skillTree = parameters.skillTree;
    selectSkillSceneUIManager.ShowComponents(parameters.skillTree);

    // Select the skill for the player, but do not update the player skills yet with the real object
    ServiceLocator.GetService<IServicePlayer>('Player').SetSkill({
        skillType: parameters.skillType,
        skillName: parameters.skillName,
    });
}

export function LoadSelectSkillScene() {
    const SceneManager = ServiceLocator.GetService<IServiceSceneManager>('SceneManager');

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

    selectSkillSceneUIManager.AddComponent(selectSkillTitle);

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

    selectSkillSceneUIManager.AddComponent(selectSkillEvolutionTitle);

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
            SceneManager.PlayScene('Game');
        },
    });

    selectSkillSceneUIManager.AddComponent(selectSkillPlayButton);

    /**
     * SKILL DESCRIPTION SECTION
     */
    const rocketSkillColumnDescription = FieldSkillFactory.CreateColumnFieldSkillWithText({
        skillName: 'Rocket',
        columnX: 6 * CANVA_SCALEX,
        columnY: 98 * CANVA_SCALEY,
    });
    selectSkillSceneUIManager.HideComponents(rocketSkillColumnDescription);
    selectSkillSceneUIManager.AddComponents(rocketSkillColumnDescription);

    const bladeSkillColumnDescription = FieldSkillFactory.CreateColumnFieldSkillWithText({
        skillName: 'Blade',
        columnX: 113 * CANVA_SCALEX,
        columnY: 98 * CANVA_SCALEY,
    });

    selectSkillSceneUIManager.HideComponents(bladeSkillColumnDescription);
    selectSkillSceneUIManager.AddComponents(bladeSkillColumnDescription);

    const mirrorSkillColumnDescription = FieldSkillFactory.CreateColumnFieldSkillWithText({
        skillName: 'MirrorShield',
        columnX: 228 * CANVA_SCALEX,
        columnY: 98 * CANVA_SCALEY,
    });

    selectSkillSceneUIManager.HideComponents(mirrorSkillColumnDescription);
    selectSkillSceneUIManager.AddComponents(mirrorSkillColumnDescription);

    const fuelChargeShotSkillColumnDescription = FieldSkillFactory.CreateColumnFieldSkillWithText({
        skillName: 'FuelChargeShot',
        columnX: 228 * CANVA_SCALEX,
        columnY: 98 * CANVA_SCALEY,
    });

    selectSkillSceneUIManager.HideComponents(fuelChargeShotSkillColumnDescription);
    selectSkillSceneUIManager.AddComponents(fuelChargeShotSkillColumnDescription);

    /**
     * SELECT SKILL SECTION
     */
    const selectRocketSkill = FieldSkillFactory.CreateFieldSkill({
        x: 6 * CANVA_SCALEX,
        y: 28 * CANVA_SCALEY,
        skillName: 'Rocket',
        skillLevel: 1,
        onClick: () => {
            focusASkill({
                skillType: 'special',
                skillName: 'Rocket',
                chosenSkill: selectRocketSkill,
                skillTree: rocketSkillColumnDescription,
            });
        },
    });

    const selectBladeSkill = FieldSkillFactory.CreateFieldSkill({
        x: 113 * CANVA_SCALEX,
        y: 28 * CANVA_SCALEY,
        skillName: 'Blade',
        skillLevel: 1,
        onClick: () => {
            focusASkill({
                skillType: 'effect',
                skillName: 'Blade',
                chosenSkill: selectBladeSkill,
                skillTree: bladeSkillColumnDescription,
            });
        },
    });

    const selectMirrorSkill = FieldSkillFactory.CreateFieldSkill({
        x: 228 * CANVA_SCALEX,
        y: 28 * CANVA_SCALEY,
        skillName: 'MirrorShield',
        skillLevel: 1,
        onClick: () => {
            focusASkill({
                skillType: 'support',
                skillName: 'MirrorShield',
                chosenSkill: selectMirrorSkill,
                skillTree: mirrorSkillColumnDescription,
            });
        },
    });
    const selectFuelChargeShotSkill = FieldSkillFactory.CreateFieldSkill({
        x: 256 * CANVA_SCALEX,
        y: 28 * CANVA_SCALEY,
        skillName: 'FuelChargeShot',
        skillLevel: 1,
        onClick: () => {
            focusASkill({
                skillType: 'support',
                skillName: 'FuelChargeShot',
                chosenSkill: selectFuelChargeShotSkill,
                skillTree: fuelChargeShotSkillColumnDescription,
            });
        },
    });

    selectSkillSceneUIManager.AddComponent(selectBladeSkill);
    selectSkillSceneUIManager.AddComponent(selectRocketSkill);
    selectSkillSceneUIManager.AddComponent(selectMirrorSkill);
    selectSkillSceneUIManager.AddComponent(selectFuelChargeShotSkill);

    /**
     * Default selected skill
     */
    focusASkill({
        skillType: 'special',
        skillName: 'Rocket',
        chosenSkill: selectRocketSkill,
        skillTree: rocketSkillColumnDescription,
    });

    focusASkill({
        skillType: 'effect',
        skillName: 'Blade',
        chosenSkill: selectBladeSkill,
        skillTree: bladeSkillColumnDescription,
    });

    focusASkill({
        skillType: 'support',
        skillName: 'MirrorShield',
        chosenSkill: selectMirrorSkill,
        skillTree: mirrorSkillColumnDescription,
    });
}

export function UpdateSelectSkillScene(dt: number) {
    selectSkillSceneUIManager.Update(dt);
}

export function DrawSelectSkillScene(ctx: CanvasRenderingContext2D) {
    selectSkillSceneUIManager.Draw(ctx);
}
