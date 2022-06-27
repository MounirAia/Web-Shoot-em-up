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
    private animationList: { [key: string]: { frames: number[]; framesLengthInTime: number } } = {};
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

    public AddAnimation(key: string, frames: number[], framesLengthInTime = 1) {
        this.animationList[key] = { frames, framesLengthInTime };
    }

    public PlayAnimation(animation: string, loop = false) {
        if (this.CurrentAnimationName !== animation) {
            this.currentAnimationName = animation;
            this.currentFrame = 0;
            this.currentFrameTimer = this.animationList[this.currentAnimationName].framesLengthInTime;
            this.doesAnimationLoop = loop;
            this.isAnimationFinished = false;
        }
    }

    public Update(dt: number) {
        if (this.CurrentAnimationName && !this.isAnimationFinished) {
            this.currentFrameTimer -= dt;
            if (this.currentFrameTimer <= 0) {
                this.currentFrame++;
                this.currentFrameTimer = this.animationList[this.CurrentAnimationName].framesLengthInTime;
                if (this.currentFrame >= this.animationList[this.CurrentAnimationName].frames.length) {
                    if (!this.doesAnimationLoop) {
                        this.currentFrame--;
                        this.isAnimationFinished = true;
                    } else {
                        this.currentFrame = 0;
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
