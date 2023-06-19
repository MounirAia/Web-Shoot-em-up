import { SpriteStateController } from './SpriteState.js';

export type AvailableAnimation =
    | ''
    | 'idle'
    | 'damaged'
    | 'onHit'
    | 'spawning'
    | 'invulnerable'
    | 'destroyed'
    | 'shooting'
    | 'spin'
    | 'detaching'
    | 'attaching'
    | 'disappearing'
    | 'generating';

interface IAnimationObject {
    frames: number[];
    framesLengthInTime: number;
    beforePlayingAnimation?: () => void;
    afterPlayingAnimation?: () => void;
    methodToPlayOnSpecificFrames?: Map<number, () => void>;
}

export abstract class Sprite {
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
    private animationList: Map<AvailableAnimation, IAnimationObject>;
    private currentAnimationName: AvailableAnimation;
    private currentFrame;
    private currentFrameTimer;
    private doesAnimationLoop;

    /* State properties */
    private readonly statesController: SpriteStateController;

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

        this.animationList = new Map();
        this.currentAnimationName = '';
        this.currentFrame = 0;
        this.currentFrameTimer = 1;
        this.doesAnimationLoop = false;

        this.statesController = new SpriteStateController();
    }

    public AddAnimation(
        key: AvailableAnimation,
        frames: number[],
        framesLengthInTime = 1,
        beforePlayingAnimation?: () => void,
        afterPlayingAnimation?: () => void,
        methodToPlayOnSpecificFrames?: Map<number, () => void>,
    ) {
        this.animationList.set(key, {
            frames,
            framesLengthInTime,
            beforePlayingAnimation,
            afterPlayingAnimation,
            methodToPlayOnSpecificFrames,
        });
    }

    public PlayAnimation(animation: AvailableAnimation, loop = false) {
        const animationObject = this.animationList.get(animation);

        if (animationObject) {
            if (this.CurrentAnimationName !== animation) {
                if (animationObject.beforePlayingAnimation) animationObject.beforePlayingAnimation();

                this.currentAnimationName = animation;
                this.currentFrame = 0;
                if (animationObject.framesLengthInTime != Infinity) {
                    this.currentFrameTimer = animationObject.framesLengthInTime;
                }
                this.doesAnimationLoop = loop;
            }
        }
    }

    public PlayManuallyNextFrame() {
        if (this.currentAnimationObject) {
            const { framesLengthInTime, afterPlayingAnimation } = this.currentAnimationObject;
            if (framesLengthInTime == Infinity) {
                if (!this.IsAnimationFinished) {
                    this.currentFrame++;

                    if (this.IsAnimationFinished) {
                        if (afterPlayingAnimation) afterPlayingAnimation();
                    }
                }
            }
        }
    }

    public Update(dt: number) {
        if (this.CurrentAnimationName) {
            if (this.currentAnimationObject) {
                const { frames, framesLengthInTime, afterPlayingAnimation, methodToPlayOnSpecificFrames } =
                    this.currentAnimationObject;
                if (framesLengthInTime != Infinity) {
                    if (this.doesAnimationLoop && this.IsAnimationFinished) {
                        this.currentFrame = 0;
                        if (afterPlayingAnimation) afterPlayingAnimation(); // play the first method at first frame
                    } else {
                        if (!this.IsAnimationFinished) {
                            this.currentFrameTimer -= dt;
                            if (this.currentFrameTimer <= 0) {
                                this.currentFrame++;
                                this.currentFrameTimer = framesLengthInTime;

                                const methodToPlayOnSpecificFrame = methodToPlayOnSpecificFrames?.get(this.frameNumber);
                                if (methodToPlayOnSpecificFrame) {
                                    methodToPlayOnSpecificFrame();
                                }

                                if (this.IsAnimationFinished && !this.doesAnimationLoop) {
                                    if (afterPlayingAnimation) {
                                        afterPlayingAnimation();
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        this.StatesController.Update(dt);
    }

    public Draw(ctx: CanvasRenderingContext2D) {
        const { image, frameWidth, frameHeight, X: x, Y: y, spriteXOffset, spriteYOffset, scaleX, scaleY } = this;

        const xFramePosition = frameWidth * (this.frameNumber % this.numberFramesPerLine);
        const yFramePosition = frameHeight * Math.floor(this.frameNumber / this.numberFramesPerLine);
        ctx.drawImage(
            image,
            xFramePosition,
            yFramePosition,
            frameWidth,
            frameHeight,
            x + spriteXOffset,
            y + spriteYOffset,
            scaleX * frameWidth,
            scaleY * frameHeight,
        );

        this.StatesController.Draw(ctx, x, y, this.Width, this.Height);
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

    private get frameNumber(): number {
        const animationObject = this.currentAnimationObject;
        if (animationObject) {
            if (this.IsAnimationFinished) return animationObject.frames.slice(-1)[0];
            return animationObject.frames[this.currentFrame];
        }

        return 0;
    }

    private get currentAnimationObject(): IAnimationObject | undefined {
        const animationObject = this.animationList.get(this.CurrentAnimationName);
        return animationObject;
    }

    protected get IsAnimationFinished(): boolean {
        if (this.currentAnimationObject) {
            const animationLenght = this.currentAnimationObject.frames.length - 1;

            if (this.currentFrame >= animationLenght) {
                return true;
            }
            return false;
        }
        return true;
    }

    public get CurrentAnimationName(): AvailableAnimation {
        return this.currentAnimationName;
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

    public get StatesController(): SpriteStateController {
        return this.statesController;
    }
}
