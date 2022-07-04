import { ServiceLocator } from '../ServiceLocator.js';
import { IEnemy } from '../Sprites/Enemies/IEnemy.js';
import { ISpriteWithHitboxes } from '../Sprites/InterfaceBehaviour/ISpriteWithHitboxes.js';
import { WaveEnemies } from './WaveEnemies.js';

export interface IServiceWaveManager {
    RemoveEnemy(enemy: IEnemy): void;
    VerifyCollisionWithEnemies(sprite: ISpriteWithHitboxes): {
        isColliding: boolean;
        enemy: IEnemy | undefined;
    };
    PlayEnemyAnimation(enemy: IEnemy, animationName: string, loop: boolean): void;
    GetEnemyAnimationName(enemy: IEnemy): string | undefined;
}

export class WaveManager implements IServiceWaveManager {
    private listWaves: WaveEnemies[];
    private currentWave: WaveEnemies | undefined;
    private round: number = 1;
    constructor() {
        this.listWaves = this.createWaves();

        this.currentWave = this.listWaves.shift();

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

    public VerifyCollisionWithEnemies(sprite: ISpriteWithHitboxes): {
        isColliding: boolean;
        enemy: IEnemy | undefined;
    } {
        if (this.currentWave) {
            return this.currentWave.VerifyCollisionWithEnemies(sprite);
        }
        return { isColliding: false, enemy: undefined };
    }

    public PlayEnemyAnimation(enemy: IEnemy, animationName: string, loop = false): void {
        if (this.currentWave) {
            this.currentWave.PlayEnemyAnimation(enemy, animationName, loop);
        }
    }

    public GetEnemyAnimationName(enemy: IEnemy) {
        if (this.currentWave) {
            return this.currentWave.GetEnemyAnimationName(enemy);
        }
    }

    public get Round(): number {
        return this.round;
    }

    private set Round(value: number) {
        this.round = value;
    }

    private createWaves(): WaveEnemies[] {
        const roundsChart: { minNumberWaves: number; maxNumberWaves: number }[] = [
            {
                minNumberWaves: 1,
                maxNumberWaves: 3,
            },
            {
                minNumberWaves: 3,
                maxNumberWaves: 6,
            },
            {
                minNumberWaves: 5,
                maxNumberWaves: 8,
            },
            {
                minNumberWaves: 6,
                maxNumberWaves: 7,
            },
            {
                minNumberWaves: 7,
                maxNumberWaves: 8,
            },
            {
                minNumberWaves: 9,
                maxNumberWaves: 10,
            },
        ];

        let numberWaves = 0;
        let roundTiers = 10; // corsspond on when to change the number of waves to spawn (each x rounds)
        let index = Math.floor(this.round / roundTiers);
        if (index > roundsChart.length - 1) {
            index = roundsChart.length - 1;
        }
        numberWaves = Math.floor(Math.random() * roundsChart[index].maxNumberWaves) + 1;
        if (numberWaves < roundsChart[index].minNumberWaves) numberWaves = roundsChart[index].minNumberWaves;

        let waves: WaveEnemies[] = [];

        for (let i = 0; i < numberWaves; i++) {
            waves.push(new WaveEnemies(30, 14));
        }

        return waves;
    }
}
