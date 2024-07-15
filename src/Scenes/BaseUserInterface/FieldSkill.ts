import { IServiceImageLoader } from '../../ImageLoader';
import { CANVA_SCALEX, CANVA_SCALEY } from '../../ScreenConstant';
import { ServiceLocator } from '../../ServiceLocator';
import InfoBladeSkill from '../../SpriteInfoJSON/Skills/infoBladeExplosion';
import InfoRocketSkill from '../../SpriteInfoJSON/Skills/infoRocketSkill';
import InfoMirrorSkill from '../../SpriteInfoJSON/Skills/InfoMirrorShield';
import InfoFuelChargeShotSkill from '../../SpriteInfoJSON/Skills/infoFuelChargeShot';
import { Sprite } from '../../Sprites/Sprite';
import { IUIComponent } from './UIManager';
import { BaseField } from './BaseField';
import { FieldWithText } from './FieldWithText';

class SkillImage extends Sprite {
    constructor(parameters: {
        image: HTMLImageElement;
        x: number;
        y: number;
        spriteXOffset: number;
        spriteYOffset: number;
        realWidth?: number;
        realHeight?: number;
        spriteOffsetInContainerX: number;
        spriteOffsetInContainerY: number;
    }) {
        const { image, x, y, spriteXOffset, spriteYOffset, realWidth, realHeight } = parameters;
        super(image, 16, 16, x, y, spriteXOffset, spriteYOffset, CANVA_SCALEX, CANVA_SCALEY, realWidth, realHeight);
        this.X += (22 * CANVA_SCALEX) / 2 - this.Width / 2;
        this.Y += (20 * CANVA_SCALEX) / 2 - this.Height / 2;
    }
}

class FieldSkillImage extends BaseField {
    private image: SkillImage;
    constructor(parameters: {
        x: number;
        y: number;
        HasHover?: boolean;
        imagePath: string;
        spriteXOffset: number;
        spriteYOffset: number;
        realWidth?: number;
        realHeight?: number;
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
            realWidth,
            realHeight,
        } = parameters;
        super(x, y, 22 * CANVA_SCALEX, 20 * CANVA_SCALEY, HasHover, onClick);
        this.image = new SkillImage({
            image: ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').GetImage(imagePath),
            x: x,
            y: y,
            spriteXOffset: spriteXOffset,
            spriteYOffset: spriteYOffset,
            realWidth: realWidth,
            realHeight: realHeight,
            spriteOffsetInContainerX: this.Width / 2,
            spriteOffsetInContainerY: this.Height / 2,
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
        realWidth?: number;
        realHeight?: number;
        onClick?: () => void;
        text: string;
    }) {
        const { x, y, HasHover, imagePath, spriteXOffset, spriteYOffset, realWidth, realHeight, onClick, text } =
            parameters;
        this.image = new FieldSkillImage({
            x: x,
            y: y,
            HasHover: HasHover,
            imagePath: imagePath,
            spriteXOffset: spriteXOffset,
            spriteYOffset: spriteYOffset,
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
            fontSize: 3.2 * CANVA_SCALEX,
            fontFamily: 'pixel',
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
    realWidth: number;
    realHeight: number;
    description: string;
}

// Define a type for skill level
type SkillLevel = 1 | 2 | 3; // Add more levels as needed
export type SkillName = 'Rocket' | 'Blade' | 'Mirror' | 'FuelChargeShot'; // Add more skills as needed

const skillMetadata: Record<SkillName, Record<SkillLevel, SkillMetadata>> = {
    Rocket: {
        1: {
            imagePath: 'images/Skills/Rocket/RocketLevel1.png',
            spriteXOffset: InfoRocketSkill.SelectSkill.Level1.Meta.SpriteShiftPosition.X,
            spriteYOffset: InfoRocketSkill.SelectSkill.Level1.Meta.SpriteShiftPosition.Y,
            realWidth: InfoRocketSkill.SelectSkill.Level1.Meta.RealDimension.Width,
            realHeight: InfoRocketSkill.SelectSkill.Level1.Meta.RealDimension.Height,
            description: InfoRocketSkill.SelectSkill.Level1.Meta.Description,
        },
        2: {
            imagePath: 'images/Skills/Rocket/RocketLevel2.png',
            spriteXOffset: InfoRocketSkill.SelectSkill.Level2.Meta.SpriteShiftPosition.X,
            spriteYOffset: InfoRocketSkill.SelectSkill.Level2.Meta.SpriteShiftPosition.Y,
            realWidth: InfoRocketSkill.SelectSkill.Level2.Meta.RealDimension.Width,
            realHeight: InfoRocketSkill.SelectSkill.Level2.Meta.RealDimension.Height,
            description: InfoRocketSkill.SelectSkill.Level2.Meta.Description,
        },
        3: {
            imagePath: 'images/Skills/Rocket/RocketLevel3.png',
            spriteXOffset: InfoRocketSkill.SelectSkill.Level3.Meta.SpriteShiftPosition.X,
            spriteYOffset: InfoRocketSkill.SelectSkill.Level3.Meta.SpriteShiftPosition.Y,
            realWidth: InfoRocketSkill.SelectSkill.Level3.Meta.RealDimension.Width,
            realHeight: InfoRocketSkill.SelectSkill.Level3.Meta.RealDimension.Height,
            description: InfoRocketSkill.SelectSkill.Level3.Meta.Description,
        },
    },
    Blade: {
        1: {
            imagePath: 'images/Skills/Blade/Blade-Level1.png',
            spriteXOffset: InfoBladeSkill.SelectSkill.Level1.Meta.SpriteShiftPosition.X,
            spriteYOffset: InfoBladeSkill.SelectSkill.Level1.Meta.SpriteShiftPosition.Y,
            realWidth: InfoBladeSkill.SelectSkill.Level1.Meta.RealDimension.Width,
            realHeight: InfoBladeSkill.SelectSkill.Level1.Meta.RealDimension.Height,
            description: InfoBladeSkill.SelectSkill.Level1.Meta.Description,
        },
        2: {
            imagePath: 'images/Skills/Blade/Blade-Level2.png',
            spriteXOffset: InfoBladeSkill.SelectSkill.Level2.Meta.SpriteShiftPosition.X,
            spriteYOffset: InfoBladeSkill.SelectSkill.Level2.Meta.SpriteShiftPosition.Y,
            realWidth: InfoBladeSkill.SelectSkill.Level2.Meta.RealDimension.Width,
            realHeight: InfoBladeSkill.SelectSkill.Level2.Meta.RealDimension.Height,
            description: InfoBladeSkill.SelectSkill.Level2.Meta.Description,
        },
        3: {
            imagePath: 'images/Skills/Blade/Blade-Level3.png',
            spriteXOffset: InfoBladeSkill.SelectSkill.Level3.Meta.SpriteShiftPosition.X,
            spriteYOffset: InfoBladeSkill.SelectSkill.Level3.Meta.SpriteShiftPosition.Y,
            realWidth: InfoBladeSkill.SelectSkill.Level3.Meta.RealDimension.Width,
            realHeight: InfoBladeSkill.SelectSkill.Level3.Meta.RealDimension.Height,
            description: InfoBladeSkill.SelectSkill.Level3.Meta.Description,
        },
    },
    Mirror: {
        1: {
            imagePath: 'images/Skills/Mirror/Mirror-1.png',
            spriteXOffset: InfoMirrorSkill.SelectSkill.Level1.Meta.SpriteShiftPosition.X,
            spriteYOffset: InfoMirrorSkill.SelectSkill.Level1.Meta.SpriteShiftPosition.Y,
            realWidth: InfoMirrorSkill.SelectSkill.Level1.Meta.RealDimension.Width,
            realHeight: InfoMirrorSkill.SelectSkill.Level1.Meta.RealDimension.Height,
            description: InfoMirrorSkill.SelectSkill.Level1.Meta.Description,
        },
        2: {
            imagePath: 'images/Skills/Mirror/Mirror-2.png',
            spriteXOffset: InfoMirrorSkill.SelectSkill.Level2.Meta.SpriteShiftPosition.X,
            spriteYOffset: InfoMirrorSkill.SelectSkill.Level2.Meta.SpriteShiftPosition.Y,
            realWidth: InfoMirrorSkill.SelectSkill.Level2.Meta.RealDimension.Width,
            realHeight: InfoMirrorSkill.SelectSkill.Level2.Meta.RealDimension.Height,
            description: InfoMirrorSkill.SelectSkill.Level2.Meta.Description,
        },
        3: {
            imagePath: 'images/Skills/Mirror/Mirror-3.png',
            spriteXOffset: InfoMirrorSkill.SelectSkill.Level3.Meta.SpriteShiftPosition.X,
            spriteYOffset: InfoMirrorSkill.SelectSkill.Level3.Meta.SpriteShiftPosition.Y,
            realWidth: InfoMirrorSkill.SelectSkill.Level3.Meta.RealDimension.Width,
            realHeight: InfoMirrorSkill.SelectSkill.Level3.Meta.RealDimension.Height,
            description: InfoMirrorSkill.SelectSkill.Level3.Meta.Description,
        },
    },
    FuelChargeShot: {
        1: {
            imagePath: 'images/Skills/FuelChargeShot/FuelChargeShotLevel1.png',
            spriteXOffset: InfoFuelChargeShotSkill.SelectSkill.Level1.Meta.SpriteShiftPosition.X,
            spriteYOffset: InfoFuelChargeShotSkill.SelectSkill.Level1.Meta.SpriteShiftPosition.Y,
            realWidth: InfoFuelChargeShotSkill.SelectSkill.Level1.Meta.RealDimension.Width,
            realHeight: InfoFuelChargeShotSkill.SelectSkill.Level1.Meta.RealDimension.Height,
            description: InfoFuelChargeShotSkill.SelectSkill.Level1.Meta.Description,
        },
        2: {
            imagePath: 'images/Skills/FuelChargeShot/FuelChargeShotLevel2.png',
            spriteXOffset: InfoFuelChargeShotSkill.SelectSkill.Level2.Meta.SpriteShiftPosition.X,
            spriteYOffset: InfoFuelChargeShotSkill.SelectSkill.Level2.Meta.SpriteShiftPosition.Y,
            realWidth: InfoFuelChargeShotSkill.SelectSkill.Level2.Meta.RealDimension.Width,
            realHeight: InfoFuelChargeShotSkill.SelectSkill.Level2.Meta.RealDimension.Height,
            description: InfoFuelChargeShotSkill.SelectSkill.Level2.Meta.Description,
        },
        3: {
            imagePath: 'images/Skills/FuelChargeShot/FuelChargeShotLevel3.png',
            spriteXOffset: InfoFuelChargeShotSkill.SelectSkill.Level3.Meta.SpriteShiftPosition.X,
            spriteYOffset: InfoFuelChargeShotSkill.SelectSkill.Level3.Meta.SpriteShiftPosition.Y,
            realWidth: InfoFuelChargeShotSkill.SelectSkill.Level3.Meta.RealDimension.Width,
            realHeight: InfoFuelChargeShotSkill.SelectSkill.Level3.Meta.RealDimension.Height,
            description: InfoFuelChargeShotSkill.SelectSkill.Level3.Meta.Description,
        },
    },
};

export class FieldSkillFactory {
    public static CreateFieldSkill(parameters: {
        x: number;
        y: number;
        HasHover?: boolean;
        skillName: SkillName;
        skillLevel: SkillLevel;
        onClick?: () => void;
    }): FieldSkillImage {
        const { x, y, HasHover, skillName, skillLevel, onClick } = parameters;
        const metadata = skillMetadata[skillName][skillLevel];
        return new FieldSkillImage({
            x: x,
            y: y,
            HasHover: HasHover,
            imagePath: metadata.imagePath,
            spriteXOffset: metadata.spriteXOffset,
            spriteYOffset: metadata.spriteYOffset,
            realWidth: metadata.realWidth,
            realHeight: metadata.realHeight,
            onClick: onClick,
        });
    }

    public static CreateFieldSkillWithText(parameters: {
        x: number;
        y: number;
        HasHover?: boolean;
        skillName: SkillName;
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
            onClick: onClick,
            text: metadata.description,
        });
    }

    public static CreateColumnFiledSkillWithText(parameters: {
        skillName: SkillName;
        columnX: number;
        columnY: number;
    }) {
        const skillsLevel = [1, 2, 3] as SkillLevel[];
        return skillsLevel.map((level, i) =>
            FieldSkillFactory.CreateFieldSkillWithText({
                x: parameters.columnX,
                y: parameters.columnY + i * 23 * CANVA_SCALEY,
                skillName: parameters.skillName,
                skillLevel: level,
                HasHover: false,
            }),
        );
    }
}
