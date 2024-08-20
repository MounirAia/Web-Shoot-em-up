import { IServiceSceneManager } from './SceneManager';
import { ServiceLocator } from './ServiceLocator';
import { IServiceWaveManager } from './WaveManager/WaveManager';

export interface IGameStatManager {
    GetTimePlayerHasSurvived(): string;
    HasPlayerWon(): { hasWon: boolean; round: number };
}

// Manages the gme stats related to if the player wins or loses the game
// how many rounds the player survived, how long the player survived, etc.
export class GameStatManager implements IGameStatManager {
    private timePlayerSurvived: number;
    private winningRound: number;

    constructor() {
        this.timePlayerSurvived = 0;
        this.winningRound = 100;
        ServiceLocator.AddService('GameStatManager', this);
    }

    public Update(dt: number) {
        this.timePlayerSurvived = Math.round((this.timePlayerSurvived + dt) * 100) / 100;
        const waveManager = ServiceLocator.GetService<IServiceWaveManager>('WaveManager');
        // if the player has survived 100 rounds (thus reached 101 round), then the player has won the game
        if (waveManager.Round > this.winningRound) {
            ServiceLocator.GetService<IServiceSceneManager>('SceneManager').PlayMainScene('GameOver');
        }
    }

    public GetTimePlayerHasSurvived(): string {
        return this.formatTime({ seconds: this.timePlayerSurvived });
    }

    public HasPlayerWon(): { hasWon: boolean; round: number } {
        const waveManager = ServiceLocator.GetService<IServiceWaveManager>('WaveManager');
        const round = waveManager.Round;
        if (round > this.winningRound) {
            return { hasWon: true, round };
        }
        return { hasWon: false, round };
    }

    private formatTime(parameters: { seconds: number }): string {
        const { seconds } = parameters;
        const date = new Date(0);
        date.setSeconds(seconds);

        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        const secs = String(date.getUTCSeconds()).padStart(2, '0');

        return `${hours}:${minutes}:${secs}`;
    }
}

let gameStatManager: GameStatManager;

export function LoadGameStatManager() {
    gameStatManager = new GameStatManager();
}

export function UpdateGameStatManager(dt: number) {
    gameStatManager.Update(dt);
}
