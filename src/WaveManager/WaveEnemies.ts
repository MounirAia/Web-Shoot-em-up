import { canvas } from '../ScreenConstant.js';
import { BigDiamondEnemy } from '../Sprites/Enemies/Diamond/BigDiamondEnemy.js';
import { IEnemy } from '../Sprites/Enemies/IEnemy.js';
import { ISpriteWithHitboxes } from '../Sprites/SpriteHitbox.js';
export class WaveEnemies {
    private listEnemies: Map<IEnemy, IEnemy>;
    private readonly numberSpawns = 8;
    private readonly maxNumberEnemies = 40;
    constructor(numberEnemies: number) {
        if (numberEnemies > this.maxNumberEnemies) numberEnemies = this.maxNumberEnemies;

        this.listEnemies = new Map<IEnemy, IEnemy>();
        this.createWave(numberEnemies);
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
    }

    public Update(dt: number) {
        this.listEnemies.forEach((enemy) => {
            enemy.Update(dt);
        });
    }

    public Draw(ctx: CanvasRenderingContext2D) {
        this.listEnemies.forEach((enemy) => {
            enemy.Draw(ctx);
        });
    }

    public get HasNoEnemyLeft(): boolean {
        return this.listEnemies.size === 0 ? true : false;
    }

    public get ListEnemies(): Map<IEnemy, ISpriteWithHitboxes> {
        return this.listEnemies as Map<IEnemy, ISpriteWithHitboxes>;
    }
}
