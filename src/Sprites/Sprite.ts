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

    /* Animation properties */
    private animationList: {
        [key: string]: {
            frames: number[];
            framesLengthInTime: number;
            beforePlayingAnimation?: () => void;
            afterPlayingAnimation?: () => void;
        };
    } = {};
    private currentAnimationName = '';
    private currentFrame = 0;
    private currentFrameTimer = 1;
    private doesAnimationLoop = false;
    private isAnimationFinished = false;

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
    }

    public AddAnimation(
        key: string,
        frames: number[],
        framesLengthInTime = 1,
        beforePlayingAnimation?: () => void,
        afterPlayingAnimation?: () => void,
    ) {
        this.animationList[key] = { frames, framesLengthInTime, beforePlayingAnimation, afterPlayingAnimation };
    }

    public PlayAnimation(animation: string, loop = false) {
        const animationObject = this.animationList[animation];
        if (animationObject) {
            if (this.CurrentAnimationName !== animation) {
                if (animationObject.beforePlayingAnimation) animationObject.beforePlayingAnimation();

                this.currentAnimationName = animation;
                this.currentFrame = 0;
                this.currentFrameTimer = animationObject.framesLengthInTime;
                this.doesAnimationLoop = loop;
                this.isAnimationFinished = false;
            }
        }
    }

    public Update(dt: number) {
        if (this.CurrentAnimationName && !this.isAnimationFinished) {
            const animationObject = this.animationList[this.CurrentAnimationName];
            const animationLength = animationObject.frames.length - 1;
            if (this.doesAnimationLoop && this.currentFrame === animationLength) {
                this.currentFrame = 0;
                if (animationObject.afterPlayingAnimation) animationObject.afterPlayingAnimation();
            } else {
                this.currentFrameTimer -= dt;
                if (this.currentFrameTimer <= 0) {
                    this.currentFrame++;
                    this.currentFrameTimer = animationObject.framesLengthInTime;
                    if (this.currentFrame >= animationLength + 1) {
                        this.currentFrame--;
                        this.isAnimationFinished = true;

                        if (animationObject.afterPlayingAnimation) animationObject.afterPlayingAnimation();
                    }
                }
            }
        }
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
            x - spriteXOffset,
            y - spriteYOffset,
            scaleX * frameWidth,
            scaleY * frameHeight,
        );
    }

    private get numberFramesPerLine(): number {
        return this.image.width / this.frameWidth;
    }

    private get frameNumber(): number {
        if (this.CurrentAnimationName) return this.animationList[this.CurrentAnimationName].frames[this.currentFrame];
        return 0;
    }

    protected get IsAnimationFinished(): boolean {
        return this.isAnimationFinished;
    }

    public get CurrentAnimationName(): string {
        return this.currentAnimationName;
    }

    protected get Width(): number {
        return this.frameWidth * this.scaleX;
    }

    protected get Height(): number {
        return this.frameHeight * this.scaleY;
    }
}
