import { IServiceImageLoader } from '../../ImageLoader';
import { CANVA_SCALEX, CANVA_SCALEY } from '../../ScreenConstant';
import { ServiceLocator } from '../../ServiceLocator';
import InfoBladeSkill from '../../SpriteInfoJSON/Skills/infoBladeExplosion';
import InfoRocketSkill from '../../SpriteInfoJSON/Skills/infoRocketSkill';
import InfoMirrorSkill from '../../SpriteInfoJSON/Skills/InfoMirrorShield';
import InfoFuelChargeShotSkill from '../../SpriteInfoJSON/Skills/infoFuelChargeShot';
import { IUIComponent, UIManager } from './UIManager';
import { BaseField } from './BaseField';
import { FieldWithText } from './FieldWithText';
import { PossibleSkillName } from '../../Sprites/PlayerSkills/Skills';
import { StaticImage } from './StaticImage';
import { DamageEffectOptions } from '../../Sprites/PlayerSkills/DamageEffect/IDamageEffect';
import { RocketConstant } from '../../StatsJSON/Skills/Special/Rocket/RocketConstant';
import { BladeConstant } from '../../StatsJSON/Skills/Effect/Blade/BladeConstant';
import { MirrorShieldConstant } from '../../StatsJSON/Skills/Support/MirrorShield/MirrorShieldConstant';
import { FuelChargeShotLaserConstant } from '../../StatsJSON/Skills/Support/FuelChargeShot/FuelChargeShotConstant';

class FieldSkillImage extends BaseField {
    private image: StaticImage;
    constructor(parameters: {
        imagePath: string;
        x: number;
        y: number;
        frameWidth: number;
        frameHeight: number;
        spriteXOffset: number;
        spriteYOffset: number;
        realWidth?: number;
        realHeight?: number;
        HasHover?: boolean;
        onClick?: () => void;
    }) {
        const {
            x,
            y,
            HasHover = true,
            imagePath,
            onClick,
            spriteXOffset,
            spriteYOffset,
            frameWidth,
            frameHeight,
            realWidth,
            realHeight,
        } = parameters;
        super(x, y, 22 * CANVA_SCALEX, 20 * CANVA_SCALEY, HasHover, onClick);

        this.image = new StaticImage({
            image: ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').GetImage(imagePath),
            x: x,
            y: y,
            frameWidth: frameWidth,
            frameHeight: frameHeight,
            spriteXOffset: spriteXOffset,
            spriteYOffset: spriteYOffset,
            realWidth: realWidth,
            realHeight: realHeight,
            spriteOffsetInContainerX: this.Width / 2 - (realWidth || frameWidth) / 2,
            spriteOffsetInContainerY: this.Height / 2 - (realHeight || frameHeight) / 2,
        });
    }

    Draw(ctx: CanvasRenderingContext2D) {
        super.Draw(ctx);
        this.image.Draw(ctx);
        if ((this.IsHovered && this.HasHover) || (this.HasHover && this.GetActive())) {
            ctx.strokeStyle = '#B09F9E';
            ctx.strokeRect(this.X, this.Y, this.Width, this.Height);
        } else {
            ctx.strokeStyle = 'black';
        }
    }
}

class FieldDamageEffectType extends BaseField {
    private image: StaticImage;
    constructor(parameters: { imagePath: string; x: number; y: number }) {
        const { x, y, imagePath } = parameters;
        const scaleX = Math.floor(CANVA_SCALEX / 2);
        const scaleY = Math.floor(CANVA_SCALEY / 2);
        super(x, y, 8 * scaleX, 8 * scaleY);
        const realWidth = 8 * scaleX;
        const realHeight = 8 * scaleY;
        this.image = new StaticImage({
            image: ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').GetImage(imagePath),
            x: x,
            y: y,
            frameWidth: 8,
            frameHeight: 8,
            spriteXOffset: 0,
            spriteYOffset: 0,
            realWidth: realWidth,
            realHeight: realHeight,
            spriteOffsetInContainerX: this.Width / 2 - realWidth / 2,
            spriteOffsetInContainerY: this.Height / 2 - realHeight / 2,
            scaleX: scaleX,
            scaleY: scaleY,
        });

        this.HasBorderOnAllSide = false;
    }

    Draw(ctx: CanvasRenderingContext2D) {
        super.Draw(ctx);
        this.image.Draw(ctx);
    }
}

class FieldDamageEffectTypeWithText implements IUIComponent {
    private image: FieldDamageEffectType;
    private text: FieldWithText;

    constructor(parameters: {
        x: number;
        y: number;
        imagePath: string;
        effectRank: 'primaryEffect' | 'secondaryEffect';
    }) {
        const { x, y, imagePath, effectRank } = parameters;
        const text = effectRank === 'primaryEffect' ? 'Primary Effect:' : 'Secondary Effect:';
        const textWidth = effectRank === 'primaryEffect' ? 48 * CANVA_SCALEX : 56 * CANVA_SCALEX;
        this.text = new FieldWithText({
            x: x,
            y: y,
            width: textWidth,
            height: 4 * CANVA_SCALEY,
            text: text,
            fontSize: UIManager.Typography.description.fontSize,
            fontFamily: UIManager.Typography.description.fontFamily,
            leftAlign: true,
        });
        this.text.HasBorderOnAllSide = false;

        this.image = new FieldDamageEffectType({
            imagePath: imagePath,
            x: x + textWidth,
            y: y - 0.5 * CANVA_SCALEY,
        });
    }

    GetVisibility(): boolean {
        return this.image.GetVisibility() && this.text.GetVisibility();
    }

    SetVisibility(visible: boolean): void {
        this.image.SetVisibility(visible);
        this.text.SetVisibility(visible);
    }

    SetActive(active: boolean): void {
        this.image.SetActive(active);
        this.text.SetActive(active);
    }

    Update(dt: number) {
        this.image.Update(dt);
        this.text.Update(dt);
    }

    Draw(ctx: CanvasRenderingContext2D) {
        this.image.Draw(ctx);
        this.text.Draw(ctx);
    }
}

class FieldSkillImageAndText implements IUIComponent {
    private image: FieldSkillImage;
    private text: FieldWithText;

    constructor(parameters: {
        x: number;
        y: number;
        HasHover?: boolean;
        imagePath: string;
        spriteXOffset: number;
        spriteYOffset: number;
        frameWidth: number;
        frameHeight: number;
        realWidth?: number;
        realHeight?: number;
        onClick?: () => void;
        text: string;
    }) {
        const {
            x,
            y,
            HasHover,
            imagePath,
            spriteXOffset,
            spriteYOffset,
            frameWidth,
            frameHeight,
            realWidth,
            realHeight,
            onClick,
            text,
        } = parameters;
        this.image = new FieldSkillImage({
            x: x,
            y: y,
            HasHover: HasHover,
            imagePath: imagePath,
            spriteXOffset: spriteXOffset,
            spriteYOffset: spriteYOffset,
            frameWidth: frameWidth,
            frameHeight: frameHeight,
            realWidth: realWidth,
            realHeight: realHeight,
            onClick: onClick,
        });
        this.text = new FieldWithText({
            x: this.image.GetX() + 28 * CANVA_SCALEX,
            y: y,
            width: 66 * CANVA_SCALEX,
            height: this.image.GetHeight(),
            text: text,
            fontSize: UIManager.Typography.description.fontSize,
            fontFamily: UIManager.Typography.description.fontFamily,
            leftAlign: true,
        });
        this.text.HasBorderOnAllSide = false;
    }

    GetVisibility(): boolean {
        return this.image.GetVisibility() && this.text.GetVisibility();
    }

    SetVisibility(visible: boolean): void {
        this.image.SetVisibility(visible);
        this.text.SetVisibility(visible);
    }

    SetActive(active: boolean): void {
        this.image.SetActive(active);
        this.text.SetActive(active);
    }

    Update(dt: number) {
        this.image.Update(dt);
        this.text.Update(dt);
    }

    Draw(ctx: CanvasRenderingContext2D) {
        this.image.Draw(ctx);
        this.text.Draw(ctx);
    }
}

// Define a type for skill metadata
interface SkillMetadata {
    imagePath: string;
    spriteXOffset: number;
    spriteYOffset: number;
    frameWidth: number;
    frameHeight: number;
    realWidth: number;
    realHeight: number;
    description: string;
    primaryEffect: DamageEffectOptions | null;
    secondaryEffect: DamageEffectOptions | null;
}

// Define a type for skill level
type SkillLevel = 1 | 2 | 3; // Add more levels as needed

const skillMetadata: Record<PossibleSkillName, Record<SkillLevel, SkillMetadata>> = {
    Rocket: {
        1: {
            imagePath: 'images/Skills/Rocket/RocketLevel1.png',
            spriteXOffset: InfoRocketSkill.SelectSkill.Level1.Meta.SpriteShiftPosition.X,
            spriteYOffset: InfoRocketSkill.SelectSkill.Level1.Meta.SpriteShiftPosition.Y,
            frameWidth: InfoRocketSkill.SelectSkill.Level1.Meta.TileDimensions.Width,
            frameHeight: InfoRocketSkill.SelectSkill.Level1.Meta.TileDimensions.Height,
            realWidth: InfoRocketSkill.SelectSkill.Level1.Meta.RealDimension.Width,
            realHeight: InfoRocketSkill.SelectSkill.Level1.Meta.RealDimension.Height,
            description: InfoRocketSkill.SelectSkill.Level1.Meta.Description,
            primaryEffect: RocketConstant[0]['Primary Skill'],
            secondaryEffect: RocketConstant[0]['Secondary Skill'],
        },
        2: {
            imagePath: 'images/Skills/Rocket/RocketLevel2.png',
            spriteXOffset: InfoRocketSkill.SelectSkill.Level2.Meta.SpriteShiftPosition.X,
            spriteYOffset: InfoRocketSkill.SelectSkill.Level2.Meta.SpriteShiftPosition.Y,
            frameWidth: InfoRocketSkill.SelectSkill.Level2.Meta.TileDimensions.Width,
            frameHeight: InfoRocketSkill.SelectSkill.Level2.Meta.TileDimensions.Height,
            realWidth: InfoRocketSkill.SelectSkill.Level2.Meta.RealDimension.Width,
            realHeight: InfoRocketSkill.SelectSkill.Level2.Meta.RealDimension.Height,
            description: InfoRocketSkill.SelectSkill.Level2.Meta.Description,
            primaryEffect: RocketConstant[1]['Primary Skill'],
            secondaryEffect: RocketConstant[1]['Secondary Skill'],
        },
        3: {
            imagePath: 'images/Skills/Rocket/RocketLevel3.png',
            spriteXOffset: InfoRocketSkill.SelectSkill.Level3.Meta.SpriteShiftPosition.X,
            spriteYOffset: InfoRocketSkill.SelectSkill.Level3.Meta.SpriteShiftPosition.Y,
            frameWidth: InfoRocketSkill.SelectSkill.Level3.Meta.TileDimensions.Width,
            frameHeight: InfoRocketSkill.SelectSkill.Level3.Meta.TileDimensions.Height,
            realWidth: InfoRocketSkill.SelectSkill.Level3.Meta.RealDimension.Width,
            realHeight: InfoRocketSkill.SelectSkill.Level3.Meta.RealDimension.Height,
            description: InfoRocketSkill.SelectSkill.Level3.Meta.Description,
            primaryEffect: RocketConstant[2]['Primary Skill'],
            secondaryEffect: RocketConstant[2]['Secondary Skill'],
        },
    },
    Blade: {
        1: {
            imagePath: 'images/Skills/Blade/Blade-Level1.png',
            spriteXOffset: InfoBladeSkill.SelectSkill.Level1.Meta.SpriteShiftPosition.X,
            spriteYOffset: InfoBladeSkill.SelectSkill.Level1.Meta.SpriteShiftPosition.Y,
            frameWidth: InfoBladeSkill.SelectSkill.Level1.Meta.TileDimensions.Width,
            frameHeight: InfoBladeSkill.SelectSkill.Level1.Meta.TileDimensions.Height,
            realWidth: InfoBladeSkill.SelectSkill.Level1.Meta.RealDimension.Width,
            realHeight: InfoBladeSkill.SelectSkill.Level1.Meta.RealDimension.Height,
            description: InfoBladeSkill.SelectSkill.Level1.Meta.Description,
            primaryEffect: BladeConstant[0]['Primary Skill'],
            secondaryEffect: BladeConstant[0]['Secondary Skill'],
        },
        2: {
            imagePath: 'images/Skills/Blade/Blade-Level2.png',
            spriteXOffset: InfoBladeSkill.SelectSkill.Level2.Meta.SpriteShiftPosition.X,
            spriteYOffset: InfoBladeSkill.SelectSkill.Level2.Meta.SpriteShiftPosition.Y,
            frameWidth: InfoBladeSkill.SelectSkill.Level2.Meta.TileDimensions.Width,
            frameHeight: InfoBladeSkill.SelectSkill.Level2.Meta.TileDimensions.Height,
            realWidth: InfoBladeSkill.SelectSkill.Level2.Meta.RealDimension.Width,
            realHeight: InfoBladeSkill.SelectSkill.Level2.Meta.RealDimension.Height,
            description: InfoBladeSkill.SelectSkill.Level2.Meta.Description,
            primaryEffect: BladeConstant[1]['Primary Skill'],
            secondaryEffect: BladeConstant[1]['Secondary Skill'],
        },
        3: {
            imagePath: 'images/Skills/Blade/Blade-Level3.png',
            spriteXOffset: InfoBladeSkill.SelectSkill.Level3.Meta.SpriteShiftPosition.X,
            spriteYOffset: InfoBladeSkill.SelectSkill.Level3.Meta.SpriteShiftPosition.Y,
            frameWidth: InfoBladeSkill.SelectSkill.Level3.Meta.TileDimensions.Width,
            frameHeight: InfoBladeSkill.SelectSkill.Level3.Meta.TileDimensions.Height,
            realWidth: InfoBladeSkill.SelectSkill.Level3.Meta.RealDimension.Width,
            realHeight: InfoBladeSkill.SelectSkill.Level3.Meta.RealDimension.Height,
            description: InfoBladeSkill.SelectSkill.Level3.Meta.Description,
            primaryEffect: BladeConstant[2]['Primary Skill'],
            secondaryEffect: BladeConstant[2]['Secondary Skill'],
        },
    },
    MirrorShield: {
        1: {
            imagePath: 'images/Skills/Mirror/Mirror-1.png',
            spriteXOffset: InfoMirrorSkill.SelectSkill.Level1.Meta.SpriteShiftPosition.X,
            spriteYOffset: InfoMirrorSkill.SelectSkill.Level1.Meta.SpriteShiftPosition.Y,
            frameWidth: InfoMirrorSkill.SelectSkill.Level1.Meta.TileDimensions.Width,
            frameHeight: InfoMirrorSkill.SelectSkill.Level1.Meta.TileDimensions.Height,
            realWidth: InfoMirrorSkill.SelectSkill.Level1.Meta.RealDimension.Width,
            realHeight: InfoMirrorSkill.SelectSkill.Level1.Meta.RealDimension.Height,
            description: InfoMirrorSkill.SelectSkill.Level1.Meta.Description,
            primaryEffect: MirrorShieldConstant[0]['Primary Skill'],
            secondaryEffect: MirrorShieldConstant[0]['Secondary Skill'],
        },
        2: {
            imagePath: 'images/Skills/Mirror/Mirror-2.png',
            spriteXOffset: InfoMirrorSkill.SelectSkill.Level2.Meta.SpriteShiftPosition.X,
            spriteYOffset: InfoMirrorSkill.SelectSkill.Level2.Meta.SpriteShiftPosition.Y,
            frameWidth: InfoMirrorSkill.SelectSkill.Level2.Meta.TileDimensions.Width,
            frameHeight: InfoMirrorSkill.SelectSkill.Level2.Meta.TileDimensions.Height,
            realWidth: InfoMirrorSkill.SelectSkill.Level2.Meta.RealDimension.Width,
            realHeight: InfoMirrorSkill.SelectSkill.Level2.Meta.RealDimension.Height,
            description: InfoMirrorSkill.SelectSkill.Level2.Meta.Description,
            primaryEffect: MirrorShieldConstant[1]['Primary Skill'],
            secondaryEffect: MirrorShieldConstant[1]['Secondary Skill'],
        },
        3: {
            imagePath: 'images/Skills/Mirror/Mirror-3.png',
            spriteXOffset: InfoMirrorSkill.SelectSkill.Level3.Meta.SpriteShiftPosition.X,
            spriteYOffset: InfoMirrorSkill.SelectSkill.Level3.Meta.SpriteShiftPosition.Y,
            frameWidth: InfoMirrorSkill.SelectSkill.Level3.Meta.TileDimensions.Width,
            frameHeight: InfoMirrorSkill.SelectSkill.Level3.Meta.TileDimensions.Height,
            realWidth: InfoMirrorSkill.SelectSkill.Level3.Meta.RealDimension.Width,
            realHeight: InfoMirrorSkill.SelectSkill.Level3.Meta.RealDimension.Height,
            description: InfoMirrorSkill.SelectSkill.Level3.Meta.Description,
            primaryEffect: MirrorShieldConstant[2]['Primary Skill'],
            secondaryEffect: MirrorShieldConstant[2]['Secondary Skill'],
        },
    },
    FuelChargeShot: {
        1: {
            imagePath: 'images/Skills/FuelChargeShot/FuelChargeShotLevel1.png',
            spriteXOffset: InfoFuelChargeShotSkill.SelectSkill.Level1.Meta.SpriteShiftPosition.X,
            spriteYOffset: InfoFuelChargeShotSkill.SelectSkill.Level1.Meta.SpriteShiftPosition.Y,
            frameWidth: InfoFuelChargeShotSkill.SelectSkill.Level1.Meta.TileDimensions.Width,
            frameHeight: InfoFuelChargeShotSkill.SelectSkill.Level1.Meta.TileDimensions.Height,
            realWidth: InfoFuelChargeShotSkill.SelectSkill.Level1.Meta.RealDimension.Width,
            realHeight: InfoFuelChargeShotSkill.SelectSkill.Level1.Meta.RealDimension.Height,
            description: InfoFuelChargeShotSkill.SelectSkill.Level1.Meta.Description,
            primaryEffect: FuelChargeShotLaserConstant[0]['Primary Skill'],
            secondaryEffect: FuelChargeShotLaserConstant[0]['Secondary Skill'],
        },
        2: {
            imagePath: 'images/Skills/FuelChargeShot/FuelChargeShotLevel2.png',
            spriteXOffset: InfoFuelChargeShotSkill.SelectSkill.Level2.Meta.SpriteShiftPosition.X,
            spriteYOffset: InfoFuelChargeShotSkill.SelectSkill.Level2.Meta.SpriteShiftPosition.Y,
            frameWidth: InfoFuelChargeShotSkill.SelectSkill.Level2.Meta.TileDimensions.Width,
            frameHeight: InfoFuelChargeShotSkill.SelectSkill.Level2.Meta.TileDimensions.Height,
            realWidth: InfoFuelChargeShotSkill.SelectSkill.Level2.Meta.RealDimension.Width,
            realHeight: InfoFuelChargeShotSkill.SelectSkill.Level2.Meta.RealDimension.Height,
            description: InfoFuelChargeShotSkill.SelectSkill.Level2.Meta.Description,
            primaryEffect: FuelChargeShotLaserConstant[1]['Primary Skill'],
            secondaryEffect: FuelChargeShotLaserConstant[1]['Secondary Skill'],
        },
        3: {
            imagePath: 'images/Skills/FuelChargeShot/FuelChargeShotLevel3.png',
            spriteXOffset: InfoFuelChargeShotSkill.SelectSkill.Level3.Meta.SpriteShiftPosition.X,
            spriteYOffset: InfoFuelChargeShotSkill.SelectSkill.Level3.Meta.SpriteShiftPosition.Y,
            frameWidth: InfoFuelChargeShotSkill.SelectSkill.Level3.Meta.TileDimensions.Width,
            frameHeight: InfoFuelChargeShotSkill.SelectSkill.Level3.Meta.TileDimensions.Height,
            realWidth: InfoFuelChargeShotSkill.SelectSkill.Level3.Meta.RealDimension.Width,
            realHeight: InfoFuelChargeShotSkill.SelectSkill.Level3.Meta.RealDimension.Height,
            description: InfoFuelChargeShotSkill.SelectSkill.Level3.Meta.Description,
            primaryEffect: FuelChargeShotLaserConstant[2]['Primary Skill'],
            secondaryEffect: FuelChargeShotLaserConstant[2]['Secondary Skill'],
        },
    },
};

export class FieldSkillFactory {
    public static CreateFieldSkill(parameters: {
        x: number;
        y: number;
        HasHover?: boolean;
        skillName: PossibleSkillName;
        skillLevel: SkillLevel;
        onClick?: () => void;
    }): FieldSkillImage {
        const { x, y, HasHover, skillName, skillLevel, onClick } = parameters;
        const metadata = skillMetadata[skillName][skillLevel];
        return new FieldSkillImage({
            imagePath: metadata.imagePath,
            x: x,
            y: y,
            frameWidth: metadata.frameWidth,
            frameHeight: metadata.frameHeight,
            spriteXOffset: metadata.spriteXOffset,
            spriteYOffset: metadata.spriteYOffset,
            realWidth: metadata.realWidth,
            realHeight: metadata.realHeight,
            HasHover: HasHover,
            onClick: onClick,
        });
    }

    public static CreateFieldSkillWithText(parameters: {
        x: number;
        y: number;
        HasHover?: boolean;
        skillName: PossibleSkillName;
        skillLevel: SkillLevel;
        onClick?: () => void;
    }): FieldSkillImageAndText {
        const { x, y, HasHover, skillName, skillLevel, onClick } = parameters;
        const metadata = skillMetadata[skillName][skillLevel];
        return new FieldSkillImageAndText({
            x: x,
            y: y,
            HasHover: HasHover,
            imagePath: metadata.imagePath,
            spriteXOffset: metadata.spriteXOffset,
            spriteYOffset: metadata.spriteYOffset,
            realWidth: metadata.realWidth,
            realHeight: metadata.realHeight,
            frameWidth: metadata.frameWidth,
            frameHeight: metadata.frameHeight,
            onClick: onClick,
            text: metadata.description,
        });
    }

    private static CreateFieldSkillType(parameters: {
        skillName: PossibleSkillName;
        skillLevel: SkillLevel;
        x: number;
    }): FieldDamageEffectTypeWithText[] {
        const effectRanks = ['primaryEffect', 'secondaryEffect'] as const;
        const { skillName, skillLevel, x } = parameters;
        const toReturn: FieldDamageEffectTypeWithText[] = [];
        for (const [index, effectRank] of effectRanks.entries()) {
            const effectType = skillMetadata[skillName][skillLevel][effectRank];

            let imagePath = '';

            if (!effectType) continue;

            if (effectType === 'Explosive') {
                imagePath = 'images/Skills/EffectIcons/ExplosiveIcon.png';
            } else if (effectType === 'Corrosive') {
                imagePath = 'images/Skills/EffectIcons/CorrosiveIcon.png';
            } else if (effectType === 'Energy') {
                imagePath = 'images/Skills/EffectIcons/EnergyIcon.png';
            } else {
                imagePath = 'images/Skills/EffectIcons/SpecialIcon.png';
            }

            toReturn.push(
                new FieldDamageEffectTypeWithText({
                    imagePath: imagePath,
                    x: x,
                    y: 166 * CANVA_SCALEY + index * 8 * CANVA_SCALEY,
                    effectRank: effectRank,
                }),
            );
        }

        return toReturn;
    }

    public static CreateColumnFieldSkillWithText(parameters: {
        skillName: PossibleSkillName;
        columnX: number;
        columnY: number;
    }): (FieldSkillImageAndText | FieldDamageEffectTypeWithText)[] {
        const skillsLevel = [1, 2, 3] as SkillLevel[];
        const fieldSkillImageAndText = skillsLevel.map((level, i) =>
            FieldSkillFactory.CreateFieldSkillWithText({
                x: parameters.columnX,
                y: parameters.columnY + i * 23 * CANVA_SCALEY,
                skillName: parameters.skillName,
                skillLevel: level,
                HasHover: false,
            }),
        );

        // Primary and Secondary effect information
        const fieldSkillType = FieldSkillFactory.CreateFieldSkillType({
            skillName: parameters.skillName,
            skillLevel: 3,
            x: parameters.columnX,
        });

        return [...fieldSkillImageAndText, ...fieldSkillType];
    }
}
