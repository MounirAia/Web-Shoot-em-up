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

    constructor(listWaves: WaveEnemies[]) {
        this.listWaves = listWaves;

        this.currentWave = this.listWaves.shift();

        ServiceLocator.AddService('WaveManager', this);
    }

    public Update(dt: number) {
        const { currentWave } = this;
        if (currentWave === undefined) return;

        currentWave.Update(dt);

        if (currentWave.HasNoEnemyLeft) {
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
}
