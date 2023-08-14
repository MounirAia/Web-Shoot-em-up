type AvailableState = 'default' | 'onHit';

interface IStateObject {
    statesDuration: number;
    beforePlayingState?: () => void;
    afterPlayingState?: () => void;
}

export class SpriteStatesController {
    private statesList: Map<AvailableState, IStateObject>;
    private currentStateName: AvailableState;
    private currentStateTimer: number;
    private static colorScheme = new Map<AvailableState, string>([['onHit', 'rgba(255,0,0,0.5)']]);
    constructor() {
        this.statesList = new Map();
        this.currentStateName = 'default';
        this.currentStateTimer = 0;
    }

    public AddState(
        stateName: AvailableState,
        { statesDuration, beforePlayingState, afterPlayingState }: IStateObject,
    ) {
        this.statesList.set(stateName, { statesDuration, beforePlayingState, afterPlayingState });
    }

    private playDefaultState() {
        this.currentStateName = 'default';
    }

    public PlayState(stateName: AvailableState) {
        if (this.CurrentStateName !== stateName) {
            this.currentStateName = stateName;
            const stateObject = this.currentStateObject;
            if (stateObject) {
                const { statesDuration, beforePlayingState } = stateObject;
                this.currentStateTimer = statesDuration;
                if (beforePlayingState) beforePlayingState();
            } else {
                // reset the state to none if there is no state to play with the given stateName
                this.playDefaultState();
            }
        }
    }

    public Update(dt: number) {
        if (this.CurrentStateName !== 'default' && this.currentStateObject) {
            this.currentStateTimer -= dt;
            if (this.currentStateTimer <= 0) {
                const { afterPlayingState } = this.currentStateObject;
                if (afterPlayingState) afterPlayingState();
                this.playDefaultState();
            }
        }
    }

    public Draw(
        ctx: CanvasRenderingContext2D,
        rectangleHorizontalPosition: number,
        rectangleVerticalPosition: number,
        rectangleWidth: number,
        rectangleHeight: number,
    ) {
        const color = SpriteStatesController.colorScheme.get(this.currentStateName);
        if (color) {
            ctx.globalCompositeOperation = 'source-atop';
            ctx.fillStyle = color;
            ctx.fillRect(rectangleHorizontalPosition, rectangleVerticalPosition, rectangleWidth, rectangleHeight);
            ctx.globalCompositeOperation = 'source-over';
        }
    }

    public get CurrentStateName(): AvailableState {
        return this.currentStateName;
    }

    private get currentStateObject(): IStateObject | undefined {
        const stateObject = this.statesList.get(this.CurrentStateName);
        return stateObject;
    }
}
