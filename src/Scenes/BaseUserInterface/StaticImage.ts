import { Sprite } from '../../Sprites/Sprite'; // Import the Sprite class
import { CANVA_SCALEX, CANVA_SCALEY } from '../../ScreenConstant';

export class StaticImage extends Sprite {
    constructor(parameters: {
        image: HTMLImageElement;
        x: number;
        y: number;
        frameWidth: number;
        frameHeight: number;
        spriteXOffset: number;
        spriteYOffset: number;
        realWidth?: number;
        realHeight?: number;
        spriteOffsetInContainerX: number;
        spriteOffsetInContainerY: number;
        scaleX?: number;
        scaleY?: number;
    }) {
        const {
            image,
            x,
            y,
            frameWidth,
            frameHeight,
            spriteXOffset,
            spriteYOffset,
            realWidth,
            realHeight,
            spriteOffsetInContainerX,
            spriteOffsetInContainerY,
            scaleX = CANVA_SCALEX,
            scaleY = CANVA_SCALEY,
        } = parameters;
        super(
            image,
            frameWidth,
            frameHeight,
            x,
            y,
            spriteXOffset,
            spriteYOffset,
            scaleX,
            scaleY,
            realWidth,
            realHeight,
        );

        // Center the image in the container
        this.X += spriteOffsetInContainerX;
        this.Y += spriteOffsetInContainerY;
    }
}
