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

export class SpriteAnimationsController {
    private animationList: Map<AvailableAnimation, IAnimationObject>;
    private currentAnimationName: AvailableAnimation;
    private currentFrame;
    private currentFrameTimer;
    private doesAnimationLoop;

    // For Paralyzed animation
    private animationInfoWhenParalyzed: {
        animationName: AvailableAnimation;
        timeLeftFrameTimerBeforeParalyzed: number;
    };
    private isParalyzed;

    constructor() {
        this.animationList = new Map();
        this.currentAnimationName = '';
        this.currentFrame = 0;
        this.currentFrameTimer = 1;
        this.doesAnimationLoop = false;

        this.animationInfoWhenParalyzed = {
            animationName: '',
            timeLeftFrameTimerBeforeParalyzed: 0,
        };
        this.isParalyzed = false;
    }

    public AddAnimation(parameters: { animation: AvailableAnimation } & IAnimationObject) {
        const {
            animation: key,
            frames,
            framesLengthInTime = 1,
            beforePlayingAnimation,
            afterPlayingAnimation,
            methodToPlayOnSpecificFrames,
        } = parameters;

        this.animationList.set(key, {
            frames,
            framesLengthInTime,
            beforePlayingAnimation,
            afterPlayingAnimation,
            methodToPlayOnSpecificFrames,
        });
    }

    public PlayAnimation(parameters: { animation: AvailableAnimation; loop?: boolean }) {
        const { animation, loop = false } = parameters;
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
                if (this.IsAnimationFinished) {
                    if (afterPlayingAnimation) afterPlayingAnimation();
                } else {
                    this.currentFrame++;
                }
            }
        }
    }

    public PlayParalyzedAnimation() {
        if (!this.isParalyzed) {
            this.animationInfoWhenParalyzed.animationName = this.currentAnimationName;
            this.animationInfoWhenParalyzed.timeLeftFrameTimerBeforeParalyzed = this.currentFrameTimer;

            this.currentFrameTimer = Infinity;

            this.isParalyzed = true;
        }
    }

    public StopParalyzedAnimation() {
        if (this.isParalyzed) {
            if (this.animationInfoWhenParalyzed.animationName === this.currentAnimationName) {
                this.currentFrameTimer = this.animationInfoWhenParalyzed.timeLeftFrameTimerBeforeParalyzed;
            }
            this.isParalyzed = false;
        }
    }

    public Update(dt: number) {
        if (this.CurrentAnimationName) {
            if (this.currentAnimationObject) {
                const { framesLengthInTime, afterPlayingAnimation, methodToPlayOnSpecificFrames } =
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
    }

    public Draw(
        ctx: CanvasRenderingContext2D,
        parameters: {
            image: HTMLImageElement;
            frameWidth: number;
            frameHeight: number;
            X: number;
            Y: number;
            spriteXOffset: number;
            spriteYOffset: number;
            scaleX: number;
            scaleY: number;
            numberFramesPerLine: number;
        },
    ) {
        const {
            image,
            frameWidth,
            frameHeight,
            X: x,
            Y: y,
            spriteXOffset,
            spriteYOffset,
            scaleX,
            scaleY,
            numberFramesPerLine,
        } = parameters;

        const xFramePosition = frameWidth * (this.frameNumber % numberFramesPerLine);
        const yFramePosition = frameHeight * Math.floor(this.frameNumber / numberFramesPerLine);
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
    }

    public get CurrentAnimationName(): AvailableAnimation {
        return this.currentAnimationName;
    }

    public get IsAnimationFinished(): boolean {
        if (this.currentAnimationObject) {
            const animationLength = this.currentAnimationObject.frames.length - 1;

            if (this.currentFrame >= animationLength) {
                return true;
            }
            return false;
        }
        return true;
    }

    private get currentAnimationObject(): IAnimationObject | undefined {
        const animationObject = this.animationList.get(this.CurrentAnimationName);
        return animationObject;
    }

    private get frameNumber(): number {
        const animationObject = this.currentAnimationObject;
        if (animationObject) {
            if (this.IsAnimationFinished) return animationObject.frames.slice(-1)[0];
            return animationObject.frames[this.currentFrame];
        }

        return 0;
    }
}
