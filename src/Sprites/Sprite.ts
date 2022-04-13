export abstract class Sprite {
    private readonly image: HTMLImageElement;
    private readonly frameWidth: number;
    private readonly frameHeight: number;
    protected x: number;
    protected y: number;
    protected scaleX: number;
    protected scaleY: number;

    private animationList: { [key: string]: number[] } = {};
    private currentAnimationName = '';
    private currentFrame = 0;
    private frameLengthInTime = 1;
    private currentFrameTimer = this.frameLengthInTime;
    private doesAnimationLoop = false;
    private isAnimationFinished = false;
    constructor(
        image: HTMLImageElement,
        frameWidth: number,
        frameHeight: number,
        x: number = 0,
        y: number = 0,
        scaleX: number = 1,
        scaleY: number = 1,
    ) {
        this.image = image;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.x = x;
        this.y = y;
        this.scaleX = scaleX;
        this.scaleY = scaleY;
    }

    public addAnimation(key: string, frames: number[]) {
        this.animationList[key] = frames;
    }

    public playAnimation(animation: string, framesLengthInTime = 1, loop = false) {
        if (!animation) {
            this.currentAnimationName = animation;
        } else if (this.currentAnimationName !== animation) {
            this.currentAnimationName = animation;
            this.currentFrame = this.animationList[this.currentAnimationName][0];
            this.frameLengthInTime = framesLengthInTime;
            this.currentFrameTimer = this.frameLengthInTime;
            this.doesAnimationLoop = loop;
            this.isAnimationFinished = false;
        }
    }

    public update(dt: number) {
        if (this.currentAnimationName) {
            this.currentFrameTimer -= dt;
            if (this.currentFrameTimer <= 0) {
                this.currentFrame++;
                this.currentFrameTimer = this.frameLengthInTime;
                if (this.currentFrame >= this.animationList[this.currentAnimationName].length) {
                    if (!this.doesAnimationLoop) {
                        this.currentFrame--;
                        this.playAnimation('');
                        this.isAnimationFinished = true;
                    } else {
                        this.currentFrame = 0;
                    }
                }
            }
        }
    }

    public draw(ctx: CanvasRenderingContext2D) {
        const { image, currentFrame, frameWidth, frameHeight, x, y, scaleX, scaleY } = this;

        const xFramePosition = frameWidth * (currentFrame % this.numberFramesPerLine);
        const yFramePosition = frameHeight * Math.floor(currentFrame / this.numberFramesPerLine);
        ctx.drawImage(
            image,
            xFramePosition,
            yFramePosition,
            frameWidth,
            frameHeight,
            x,
            y,
            scaleX * frameWidth,
            scaleY * frameHeight,
        );
    }

    private get numberFramesPerLine(): number {
        return this.image.width / this.frameWidth;
    }

    private get numberLinesInImage(): number {
        return this.image.height / this.frameHeight;
    }

    public get IsAnimationFinished(): boolean {
        return this.isAnimationFinished;
    }
}
