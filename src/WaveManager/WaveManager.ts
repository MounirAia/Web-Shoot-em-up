import { IServiceEventManager } from '../EventManager.js';
import { ServiceLocator } from '../ServiceLocator.js';
import { IEnemy } from '../Sprites/Enemies/IEnemy.js';
import {
    DamageEffectFunctionReturnType,
    DamageEffectOptions,
} from '../Sprites/PlayerSkills/DamageEffect/IDamageEffect.js';
import { AvailableAnimation } from '../Sprites/SpriteAnimationsController.js';
import { WaveEnemies } from './WaveEnemies/WaveEnemies.js';

export interface IServiceWaveManager {
    RemoveEnemy(enemy: IEnemy): void;
    GetListEnemies(): Map<IEnemy, IEnemy>;
    SetLastEnemyDestroyed(enemy: IEnemy): void;
    GetLastEnemyCenterCoordinate(): { x: number; y: number };
    GetLastEnemyEnergyValue(): number;
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
    GetRoundTier(): number;

    Round: number;
}

class WaveManager implements IServiceWaveManager {
    private listWaves: WaveEnemies[];
    private currentWave: WaveEnemies | undefined;
    private round: number;
    private roundTierLength: number;
    private lastEnemyDestroyed: IEnemy | undefined;
    constructor() {
        this.round = 1;
        this.roundTierLength = 4;
        ServiceLocator.AddService('WaveManager', this);

        this.listWaves = this.createWaves();

        this.currentWave = this.listWaves.shift();
        this.lastEnemyDestroyed = undefined;
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
        if (value > this.round) {
            ServiceLocator.GetService<IServiceEventManager>('EventManager').Notify('round ended');
        }
        this.round = value;
    }

    private createWaves(): WaveEnemies[] {
        return [new WaveEnemies(this.Round)];
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

    GetLastEnemyEnergyValue(): number {
        const lastEnemy = this.lastEnemyDestroyed;

        if (!lastEnemy) return 0;

        return lastEnemy.GetEnergyValue();
    }

    GetARandomEnemy(): IEnemy | undefined {
        return this.currentWave?.RandomEnemy;
    }

    GetIfListHasNoEnemyLeft(): boolean {
        if (this.currentWave) return this.currentWave?.HasNoEnemyLeft;

        return true;
    }

    GetRoundTier(): number {
        const roundTier = Math.ceil(this.Round / this.roundTierLength);
        const maxRoundTier = 25;
        if (roundTier > maxRoundTier) return maxRoundTier;

        return roundTier;
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

    public testQuantity() {
        console.log('Wave Manager size: ', this.listWaves.length);
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
