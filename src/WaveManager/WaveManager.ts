import { ServiceLocator } from '../ServiceLocator.js';
import { IEnemy } from '../Sprites/Enemies/IEnemy.js';
import {
    DamageEffectFunctionReturnType,
    DamageEffectOptions,
} from '../Sprites/PlayerSkills/DamageEffect/IDamageEffect.js';
import { AvailableAnimation } from '../Sprites/SpriteAnimationsController.js';
import { WaveEnemies } from './WaveEnemies.js';

export interface IServiceWaveManager {
    RemoveEnemy(enemy: IEnemy): void;
    GetListEnemies(): Map<IEnemy, IEnemy>;
    SetLastEnemyDestroyed(enemy: IEnemy): void;
    GetLastEnemyCenterCoordinate(): { x: number; y: number };
    GetARandomEnemy(): IEnemy | undefined;
    GetIfListHasNoEnemyLeft(): boolean;
    AddEnemyDamageState(parameters: {
        target: IEnemy;
        effect: DamageEffectFunctionReturnType;
        effectType: DamageEffectOptions;
    }): void;
    RemoveEnemyDamageState(parameters: {
        target: IEnemy;
        effect: DamageEffectFunctionReturnType;
        effectType: DamageEffectOptions;
    }): void;

    PlayEnemyAnimation(parameters: { target: IEnemy; animationName: AvailableAnimation }): void;
    GetEnemyAnimation(parameters: { target: IEnemy }): AvailableAnimation | undefined;
    ParalyzeEnemy(parameters: { target: IEnemy }): void;
    StopParalyzeEnemy(parameters: { target: IEnemy }): void;

    Round: number;
}

class WaveManager implements IServiceWaveManager {
    private listWaves: WaveEnemies[];
    private currentWave: WaveEnemies | undefined;
    private round = 1;
    private lastEnemyDestroyed: IEnemy | undefined;
    constructor() {
        this.listWaves = this.createWaves();

        this.currentWave = this.listWaves.shift();
        this.lastEnemyDestroyed = undefined;

        ServiceLocator.AddService('WaveManager', this);
    }

    public Update(dt: number) {
        if (this.currentWave === undefined) {
            this.Round += 1;
            this.listWaves = this.createWaves();

            this.currentWave = this.listWaves.shift();

            return;
        }

        this.currentWave.Update(dt);
        if (this.currentWave.HasNoEnemyLeft) {
            this.currentWave = this.listWaves.shift();
        }
    }

    public Draw(ctx: CanvasRenderingContext2D) {
        const { currentWave } = this;
        if (currentWave === undefined) return;

        currentWave.Draw(ctx);
    }

    public RemoveEnemy(enemy: IEnemy): void {
        if (this.currentWave) this.currentWave.RemoveEnemy(enemy);
    }

    public get Round(): number {
        return this.round;
    }

    private set Round(value: number) {
        this.round = value;
    }

    private createWaves(): WaveEnemies[] {
        const roundsChart: {
            minNumberWaves: number;
            maxNumberWaves: number;
            minNumberEnemies: number;
            maxNumberEnemies: number;
        }[] = [
            {
                minNumberWaves: 1,
                maxNumberWaves: 3,
                minNumberEnemies: 12,
                maxNumberEnemies: 20,
            },
            {
                minNumberWaves: 3,
                maxNumberWaves: 6,
                minNumberEnemies: 15,
                maxNumberEnemies: 25,
            },
            {
                minNumberWaves: 5,
                maxNumberWaves: 8,
                minNumberEnemies: 20,
                maxNumberEnemies: 28,
            },
            {
                minNumberWaves: 6,
                maxNumberWaves: 7,
                minNumberEnemies: 25,
                maxNumberEnemies: 32,
            },
            {
                minNumberWaves: 7,
                maxNumberWaves: 8,
                minNumberEnemies: 31,
                maxNumberEnemies: 35,
            },
            {
                minNumberWaves: 9,
                maxNumberWaves: 10,
                minNumberEnemies: 40,
                maxNumberEnemies: 40,
            },
        ];

        let numberWaves = 0;
        const roundTiers = 10; // corespond on when to change the number of waves to spawn (each x rounds)
        let index = Math.floor(this.round / roundTiers);
        if (index > roundsChart.length - 1) {
            index = roundsChart.length - 1;
        }
        const { minNumberWaves, maxNumberWaves } = roundsChart[index];
        numberWaves = Math.round(Math.random() * (maxNumberWaves - minNumberWaves)) + minNumberWaves;
        const waves: WaveEnemies[] = [];

        for (let i = 0; i < numberWaves; i++) {
            const { minNumberEnemies, maxNumberEnemies } = roundsChart[index];
            const numberEnemiesToSpawn =
                Math.round((maxNumberEnemies - minNumberEnemies) * Math.random()) + minNumberEnemies;
            waves.push(new WaveEnemies(numberEnemiesToSpawn));
        }

        return waves;
    }

    GetListEnemies(): Map<IEnemy, IEnemy> {
        if (this.currentWave) {
            return this.currentWave.ListEnemies;
        }

        return new Map<IEnemy, IEnemy>();
    }

    SetLastEnemyDestroyed(enemy: IEnemy): void {
        this.lastEnemyDestroyed = enemy;
    }

    GetLastEnemyCenterCoordinate(): { x: number; y: number } {
        if (this.lastEnemyDestroyed)
            return { x: this.lastEnemyDestroyed?.FrameXCenter, y: this.lastEnemyDestroyed?.FrameYCenter };

        return { x: 0, y: 0 };
    }

    GetARandomEnemy(): IEnemy | undefined {
        return this.currentWave?.RandomEnemy;
    }

    GetIfListHasNoEnemyLeft(): boolean {
        if (this.currentWave) return this.currentWave?.HasNoEnemyLeft;

        return true;
    }

    public AddEnemyDamageState(parameters: {
        target: IEnemy;
        effect: DamageEffectFunctionReturnType;
        effectType: DamageEffectOptions;
    }) {
        this.currentWave?.AddEnemyDamageState(parameters);
    }

    public RemoveEnemyDamageState(parameters: {
        target: IEnemy;
        effect: DamageEffectFunctionReturnType;
        effectType: DamageEffectOptions;
    }) {
        this.currentWave?.RemoveEnemyDamageState(parameters);
    }

    public GetEnemyAnimation(parameters: { target: IEnemy }) {
        return this.currentWave?.GetEnemyAnimation(parameters);
    }

    public PlayEnemyAnimation(parameters: { target: IEnemy; animationName: AvailableAnimation }) {
        this.currentWave?.PlayEnemyAnimation(parameters);
    }

    public ParalyzeEnemy(parameters: { target: IEnemy }) {
        this.currentWave?.ParalyzeEnemy(parameters);
    }

    public StopParalyzeEnemy(parameters: { target: IEnemy }) {
        this.currentWave?.RemoveParalyzeEnemy(parameters);
    }
}

let waveManager: WaveManager;
export function LoadWaveManager(): void {
    waveManager = new WaveManager();
}

export function UpdateWaveManager(dt: number) {
    waveManager.Update(dt);
}

export function DrawWaveManager(ctx: CanvasRenderingContext2D) {
    waveManager.Draw(ctx);
}

export function UnloadWaveManager() {
    LoadWaveManager();
}
