import { SpriteAnimationsController } from './SpriteAnimationsController.js';
import { ISpriteWithAnimationController, ISpriteWithStateController } from './SpriteAttributes.js';
import { SpriteStatesController } from './SpriteStatesController.js';

export abstract class Sprite implements ISpriteWithAnimationController, ISpriteWithStateController {
    /* Image properties */
    private readonly image: HTMLImageElement;
    private readonly frameWidth: number;
    private readonly frameHeight: number;
    private x: number;
    private y: number;
    private readonly spriteXOffset: number;
    private readonly spriteYOffset: number;
    private scaleX: number;
    private scaleY: number;
    private realWidth: number | undefined;
    private realHeight: number | undefined;

    /* Animation properties */
    private readonly animationsController: SpriteAnimationsController;

    /* State properties */
    private readonly statesController: SpriteStatesController;

    constructor(
        image: HTMLImageElement,
        frameWidth: number,
        frameHeight: number,
        x = 0,
        y = 0,
        spriteXOffset = 0,
        spriteYOffset = 0,
        scaleX = 1,
        scaleY = 1,
        realWidth: number | undefined = undefined,
        realHeight: number | undefined = undefined,
    ) {
        this.image = image;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.x = x;
        this.y = y;
        this.spriteXOffset = spriteXOffset;
        this.spriteYOffset = spriteYOffset;
        this.scaleX = scaleX;
        this.scaleY = scaleY;
        this.realWidth = realWidth;
        this.realHeight = realHeight;

        this.animationsController = new SpriteAnimationsController();
        this.statesController = new SpriteStatesController();
    }

    public Update(dt: number) {
        this.AnimationsController.Update(dt);
        this.StatesController.Update(dt);
    }

    public Draw(ctx: CanvasRenderingContext2D) {
        const { image, frameWidth, frameHeight, X, Y, spriteXOffset, spriteYOffset, scaleX, scaleY } = this;
        this.AnimationsController.Draw(ctx, {
            image,
            frameWidth,
            frameHeight,
            X,
            Y,
            spriteXOffset,
            spriteYOffset,
            scaleX,
            scaleY,
            numberFramesPerLine: this.numberFramesPerLine,
        });

        this.StatesController.Draw(ctx, X, Y, this.Width, this.Height);
    }

    protected drawRectangleAroundSprite(ctx: CanvasRenderingContext2D) {
        // Draw the purple outline rectangle
        ctx.strokeStyle = 'purple'; // Set the stroke color to purple
        ctx.lineWidth = 1; // Set the line width

        ctx.strokeRect(this.X, this.Y, this.Width, this.Height); // Draw the outline rectangle
    }

    public get ImagePath(): string {
        return new URL(this.image.src).pathname.slice(1);
    }

    public get FrameWidth(): number {
        return this.frameWidth;
    }

    public get FrameHeight(): number {
        return this.frameHeight;
    }

    public get SpriteShiftPositionX(): number {
        return this.spriteXOffset;
    }

    public get SpriteShiftPositionY(): number {
        return this.spriteYOffset;
    }

    public get ScaleX(): number {
        return this.scaleX;
    }

    public get ScaleY(): number {
        return this.scaleY;
    }

    private get numberFramesPerLine(): number {
        return this.image.width / this.frameWidth;
    }

    public get Width(): number {
        if (this.realWidth) return this.realWidth;
        return this.frameWidth * this.scaleX;
    }

    protected set Width(width: number) {
        this.realWidth = width;
    }

    public get Height(): number {
        if (this.realHeight) return this.realHeight;
        return this.frameHeight * this.scaleY;
    }

    protected set Height(height: number) {
        this.realHeight = height;
    }

    public get X(): number {
        return this.x;
    }

    protected set X(value: number) {
        this.x = value;
    }
    public get Y(): number {
        return this.y;
    }

    protected set Y(value: number) {
        this.y = value;
    }

    public get FrameXCenter(): number {
        if (this.realWidth) {
            return this.X + this.Width / 2;
        }

        return this.X + this.spriteXOffset + this.Width / 2;
    }

    public get FrameYCenter(): number {
        if (this.realHeight) {
            return this.Y + this.Height / 2;
        }
        return this.Y + this.spriteYOffset + this.Height / 2;
    }

    public get StatesController(): SpriteStatesController {
        return this.statesController;
    }

    public get AnimationsController(): SpriteAnimationsController {
        return this.animationsController;
    }
}
