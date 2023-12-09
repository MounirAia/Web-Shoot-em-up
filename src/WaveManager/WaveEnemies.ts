import { canvas } from '../ScreenConstant.js';
import { ServiceLocator } from '../ServiceLocator.js';
import { BigDiamondEnemy } from '../Sprites/Enemies/Diamond/BigDiamondEnemy.js';
import { IEnemy } from '../Sprites/Enemies/IEnemy.js';
import {
    DamageEffectFunctionReturnType,
    DamageEffectOptions,
} from '../Sprites/PlayerSkills/DamageEffect/IDamageEffect.js';
import { AvailableAnimation } from '../Sprites/SpriteAnimationsController.js';
import { IServiceUtilManager } from '../UtilManager.js';
import { WaveEnemiesDamageStateTracker } from './WaveEnemiesStateTracker.js';

export class WaveEnemies {
    private listEnemies: Map<IEnemy, IEnemy>;
    private readonly numberSpawns = 8;
    private readonly maxNumberEnemies = 40;

    private waveEnemiesStateTracker: WaveEnemiesDamageStateTracker;

    constructor(numberEnemies: number) {
        if (numberEnemies > this.maxNumberEnemies) numberEnemies = this.maxNumberEnemies;

        this.listEnemies = new Map<IEnemy, IEnemy>();
        this.createWave(numberEnemies);

        this.waveEnemiesStateTracker = new WaveEnemiesDamageStateTracker();
    }

    private createWave(numberEnemies: number) {
        const verticalGapBetweenMonsters = 60;
        const verticalShift = (canvas.height - this.numberSpawns * verticalGapBetweenMonsters) / 2; // vertical padding in columns
        let currentNumberEnemy = 0;
        let x = canvas.width;
        let y = 0;
        const monsterScreenWidthProportion = canvas.width * (30 / 100);
        const maxNumberShootingSpawn = 5;
        const horizontalGapBetweenMonsters = Math.floor(monsterScreenWidthProportion / maxNumberShootingSpawn);
        let monsterShootingPosition = canvas.width - monsterScreenWidthProportion;

        while (currentNumberEnemy < numberEnemies) {
            for (let index = 0; index < this.numberSpawns; index++) {
                currentNumberEnemy++;

                this.AddEnemy(
                    this.generateEnemy(
                        x,
                        verticalShift + (y % (this.numberSpawns * verticalGapBetweenMonsters)),
                        monsterShootingPosition,
                    ),
                );
                y += verticalGapBetweenMonsters;

                if (currentNumberEnemy >= numberEnemies) {
                    break;
                }
            }
            monsterShootingPosition += horizontalGapBetweenMonsters;
            x += horizontalGapBetweenMonsters;
            y = 0;
        }
    }

    private generateEnemy(x: number, y: number, monsterShootingPosition: number): IEnemy {
        return new BigDiamondEnemy(x, y, monsterShootingPosition);
    }

    public AddEnemy(enemy: IEnemy) {
        this.listEnemies.set(enemy, enemy);
    }

    public RemoveEnemy(enemy: IEnemy) {
        this.listEnemies.delete(enemy);
        this.waveEnemiesStateTracker.RemoveEnemyStateTracker({ enemy });
    }

    public Update(dt: number) {
        this.listEnemies.forEach((enemy) => {
            enemy.Update(dt);
        });

        this.waveEnemiesStateTracker.Update(dt);
    }

    public Draw(ctx: CanvasRenderingContext2D) {
        this.listEnemies.forEach((enemy) => {
            enemy.Draw(ctx);
        });
    }

    public get HasNoEnemyLeft(): boolean {
        return this.listEnemies.size === 0 ? true : false;
    }

    public get ListEnemies(): Map<IEnemy, IEnemy> {
        return this.listEnemies as Map<IEnemy, IEnemy>;
    }

    public get RandomEnemy(): IEnemy | undefined {
        const { GetRandomObjectFromMap } = ServiceLocator.GetService<IServiceUtilManager>('UtilManager');

        const randomEnemy = GetRandomObjectFromMap<IEnemy>({ theMap: this.listEnemies });

        return randomEnemy;
    }

    public AddEnemyDamageState(parameters: {
        target: IEnemy;
        effect: DamageEffectFunctionReturnType;
        effectType: DamageEffectOptions;
    }) {
        this.waveEnemiesStateTracker.AddState(parameters);
    }

    public RemoveEnemyDamageState(parameters: {
        target: IEnemy;
        effect: DamageEffectFunctionReturnType;
        effectType: DamageEffectOptions;
    }) {
        this.waveEnemiesStateTracker.RemoveState(parameters);
    }

    public GetEnemyAnimation(parameters: { target: IEnemy }): AvailableAnimation | undefined {
        const { target } = parameters;
        return this.listEnemies.get(target)?.AnimationsController.CurrentAnimationName;
    }

    public PlayEnemyAnimation(parameters: { target: IEnemy; animationName: AvailableAnimation }) {
        const { target, animationName } = parameters;
        this.listEnemies.get(target)?.AnimationsController.PlayAnimation({ animation: animationName });
    }

    public ParalyzeEnemy(parameters: { target: IEnemy }) {
        const { target } = parameters;

        target.AnimationsController.PlayParalyzedAnimation();
    }

    public RemoveParalyzeEnemy(parameters: { target: IEnemy }) {
        const { target } = parameters;

        target.AnimationsController.StopParalyzedAnimation();
    }
}

// ****************************** Spawn Enemy Manager IDEA ******************************
// class SpawnEnemiesManager {
//     // The enemies spawn takes 40% of the screen width
//     // Refactor how the wave system works and use a 2d matrix 8*8 where each cell represent a spawn for a 15pixels entities
//     // 120px * 120px grid (on base dimension)
//     // padding top to the grid = 20px
//     // padding bottom to the grid = 30px
//     // padding of 1 px between each enemies (up,right,bottom)
//     // Can return the readonly map of enemies spawn through service locator
//     private readonly screenWidthProportion: number;
//     private readonly spawns: number[][];
//     private readonly sizeOfASpawnCell: number;
//     private readonly paddingTop: number;
//     private readonly paddingBottom: number;
//     constructor() {
//         this.screenWidthProportion = (40 / 100) * canvas.width;
//         // Grid: 128px*128px -> base dimension
//         this.spawns = [
//             [1, 1, 1, 1, 1, 1, 1, 1],
//             [1, 1, 1, 1, 1, 1, 1, 1],
//             [1, 1, 1, 1, 1, 1, 1, 1],
//             [1, 1, 1, 1, 1, 1, 1, 1],
//             [1, 1, 1, 1, 1, 1, 1, 1],
//             [1, 1, 1, 1, 1, 1, 1, 1],
//             [1, 1, 1, 1, 1, 1, 1, 1],
//             [1, 1, 1, 1, 1, 1, 1, 1],
//         ];

//         this.sizeOfASpawnCell = this.screenWidthProportion / this.spawns[0].length;
//         this.paddingTop = 20 * CANVA_SCALEY;
//         this.paddingBottom = 30 * CANVA_SCALEY;
//     }
//     // Create method to allocate spawn that are free
//     // Create method to restore spawn on explosion of a
// }
// Must have some sort of queues of enemies that is built before the first enemy of the wave spawns
// Can have some sort of priority queue to balance how many enemies of different tier the player will face
