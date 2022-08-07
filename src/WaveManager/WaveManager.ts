import { ServiceLocator } from '../ServiceLocator.js';
import { ICollidableSprite } from '../Sprites/CollideManager.js';
import { IEnemy } from '../Sprites/Enemies/IEnemy.js';
import { ISpriteWithHitboxes } from '../Sprites/InterfaceBehaviour/ISpriteWithHitboxes.js';
import { IServicePlayer } from '../Sprites/Player.js';
import { WaveEnemies } from './WaveEnemies.js';

export interface IServiceWaveManager {
    RemoveEnemy(enemy: IEnemy): void;
    VerifyCollisionWithEnemies(sprite: ISpriteWithHitboxes): {
        isColliding: boolean;
        enemy: IEnemy | undefined;
    };
    VerifyCollisionWithPlayer(sprite: ISpriteWithHitboxes): boolean;
    PlayEnemyAnimation(enemy: IEnemy, animationName: string, loop: boolean): void;
    GetEnemyAnimationName(enemy: IEnemy): string | undefined;
    GetListEnemies(): Map<IEnemy, ISpriteWithHitboxes & ICollidableSprite>;
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

    public VerifyCollisionWithPlayer(sprite: ISpriteWithHitboxes): boolean {
        for (const hitbox of ServiceLocator.GetService<IServicePlayer>('Player').Hitboxes) {
            if (hitbox.CheckCollision(sprite)) return true;
        }

        return false;
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
        let roundTiers = 10; // corespond on when to change the number of waves to spawn (each x rounds)
        let index = Math.floor(this.round / roundTiers);
        if (index > roundsChart.length - 1) {
            index = roundsChart.length - 1;
        }
        const { minNumberWaves, maxNumberWaves } = roundsChart[index];
        numberWaves = Math.round(Math.random() * (maxNumberWaves - minNumberWaves)) + minNumberWaves;
        let waves: WaveEnemies[] = [];

        for (let i = 0; i < numberWaves; i++) {
            const { minNumberEnemies, maxNumberEnemies } = roundsChart[index];
            const numberEnemiesToSpawn =
                Math.round((maxNumberEnemies - minNumberEnemies) * Math.random()) + minNumberEnemies;
            waves.push(new WaveEnemies(numberEnemiesToSpawn));
        }

        return waves;
    }

    GetListEnemies(): Map<IEnemy, ISpriteWithHitboxes & ICollidableSprite> {
        if (this.currentWave) {
            return this.currentWave.ListEnemies;
        }

        return new Map<IEnemy, ISpriteWithHitboxes & ICollidableSprite>();
    }
}
