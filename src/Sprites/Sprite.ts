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
    | 'spin';

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
    protected X: number;
    protected Y: number;
    private readonly spriteXOffset: number;
    private readonly spriteYOffset: number;
    private scaleX: number;
    private scaleY: number;
    private readonly realWidth: number | undefined;
    private readonly realHeight: number | undefined;

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
        x: number = 0,
        y: number = 0,
        spriteXOffset: number = 0,
        spriteYOffset: number = 0,
        scaleX: number = 1,
        scaleY: number = 1,
        realWidth: number | undefined = undefined,
        realHeight: number | undefined = undefined,
    ) {
        this.image = image;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.X = x;
        this.Y = y;
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
        framesLengthInTime: number = 1,
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
        if (this.CurrentAnimationName && !this.IsAnimationFinished) {
            if (this.currentAnimationObject) {
                const { frames, framesLengthInTime, afterPlayingAnimation, methodToPlayOnSpecificFrames } =
                    this.currentAnimationObject;
                const animationLength = frames.length - 1;
                if (framesLengthInTime != Infinity) {
                    if (this.doesAnimationLoop && this.currentFrame === animationLength) {
                        this.currentFrame = 0;
                        if (afterPlayingAnimation) afterPlayingAnimation(); // play the first method at first frame
                    } else {
                        this.currentFrameTimer -= dt;
                        if (this.currentFrameTimer <= 0) {
                            this.currentFrame++;
                            this.currentFrameTimer = framesLengthInTime;

                            const methodToPlayOnSpecificFrame = methodToPlayOnSpecificFrames?.get(this.frameNumber);
                            if (methodToPlayOnSpecificFrame) {
                                methodToPlayOnSpecificFrame();
                            }

                            if (this.IsAnimationFinished) {
                                this.currentFrame--;
                                if (afterPlayingAnimation) afterPlayingAnimation();
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

    private get numberFramesPerLine(): number {
        return this.image.width / this.frameWidth;
    }

    private get frameNumber(): number {
        const animationObject = this.currentAnimationObject;
        if (animationObject) return animationObject.frames[this.currentFrame];

        return 0;
    }

    private get currentAnimationObject(): IAnimationObject | undefined {
        const animationObject = this.animationList.get(this.CurrentAnimationName);
        return animationObject;
    }

    protected get IsAnimationFinished(): boolean {
        if (this.currentAnimationObject) {
            if (this.currentFrame >= this.currentAnimationObject.frames.length) {
                return true;
            }
            return false;
        }
        return true;
    }

    public get CurrentAnimationName(): AvailableAnimation {
        return this.currentAnimationName;
    }

    protected get Width(): number {
        if (this.realWidth) return this.realWidth;
        return this.frameWidth * this.scaleX;
    }

    protected get Height(): number {
        if (this.realHeight) return this.realHeight;
        return this.frameHeight * this.scaleY;
    }

    public get FrameXCenter(): number {
        return this.X + this.spriteXOffset + this.Width / 2;
    }

    public get FrameYCenter(): number {
        return this.Y + this.spriteYOffset + this.Height / 2;
    }

    public get StatesController(): SpriteStateController {
        return this.statesController;
    }
}
