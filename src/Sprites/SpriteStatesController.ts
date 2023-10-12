type AvailableState = 'default' | 'onHit' | 'onExplosion' | 'onEnergy' | 'onCorrosion' | 'onFuelChargeShot';
type StatePriority = 'high' | 'medium' | 'low';
interface IStateObject {
    statesDuration: number;
    beforePlayingState?: () => void;
    afterPlayingState?: () => void;
}

export class SpriteStatesController {
    private statesList: Map<AvailableState, IStateObject>;
    private currentStateName: AvailableState;
    private currentStates: Map<StatePriority, Map<AvailableState, { currentStateTimer: number }>>;

    private static statesDefaultInfo = new Map<
        AvailableState,
        { color: string; priority: StatePriority; defaultDuration?: number }
    >([
        ['onHit', { color: 'rgba(255,0,0,0.2)', priority: 'medium', defaultDuration: 6 / 60 }],
        ['onExplosion', { color: '	rgba(255, 211, 0,0.4)', priority: 'high', defaultDuration: 6 / 60 }],
        ['onEnergy', { color: 'rgba(39, 144, 197,0.4)', priority: 'high', defaultDuration: 6 / 60 }],
        ['onFuelChargeShot', { color: 'rgba(255,215,0,0.5)', priority: 'high', defaultDuration: 6 / 60 }],
        ['onCorrosion', { color: 'rgba(0,255,0,0.2)', priority: 'low' }],
    ]);

    constructor() {
        this.statesList = new Map();
        this.currentStates = new Map();
        const statePriorities: StatePriority[] = ['high', 'medium', 'low'];
        // initialize each state map in order to keep
        // the applying order of the state in the good order (high,medium,low)
        statePriorities.forEach((state) => {
            this.currentStates.set(state, new Map());
        });

        this.currentStateName = 'default';
    }

    public PlayState(parameters: { stateName: AvailableState; duration?: number }) {
        const { stateName, duration } = parameters;
        const stateDefaultInfo = SpriteStatesController.statesDefaultInfo.get(stateName);
        if (stateDefaultInfo) {
            const { priority, defaultDuration } = stateDefaultInfo;
            let durationToApply = duration ? duration : defaultDuration;
            durationToApply = durationToApply ? durationToApply : 1;

            this.currentStates.get(priority)?.set(stateName, { currentStateTimer: durationToApply });
        }
    }

    public Update(dt: number) {
        let stateToPlay: AvailableState = 'default';
        // reduce the timer for each states that are applied to the sprite
        this.currentStates.forEach((states) => {
            states.forEach((stateStatus, stateName) => {
                if (stateToPlay === 'default') {
                    // play the first state that is available
                    stateToPlay = stateName;
                }
                stateStatus.currentStateTimer -= dt;
                if (stateStatus.currentStateTimer < 0) {
                    states.delete(stateName);
                }
            });
        });

        this.currentStateName = stateToPlay;
    }

    public Draw(
        ctx: CanvasRenderingContext2D,
        rectangleHorizontalPosition: number,
        rectangleVerticalPosition: number,
        rectangleWidth: number,
        rectangleHeight: number,
    ) {
        const stateInfo = SpriteStatesController.statesDefaultInfo.get(this.currentStateName);
        if (stateInfo) {
            const { color } = stateInfo;
            ctx.globalCompositeOperation = 'source-atop';
            ctx.fillStyle = color;
            ctx.fillRect(rectangleHorizontalPosition, rectangleVerticalPosition, rectangleWidth, rectangleHeight);
            ctx.globalCompositeOperation = 'source-over';
        }
    }

    public get CurrentStateName(): AvailableState {
        return this.currentStateName;
    }
}
