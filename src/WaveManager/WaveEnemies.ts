import { canvas } from '../ScreenConstant.js';
import { IEnemy } from '../Sprites/Enemies/IEnemy.js';
import { TriangleEnemy } from '../Sprites/Enemies/TriangleEnemy.js';

export class WaveEnemies {
    private listEnemies: IEnemy[];
    private readonly numberSpawns;
    constructor(numberEnemy: number, numberSpawns: number) {
        this.listEnemies = [];
        this.numberSpawns = numberSpawns;
        let currentNumberEnemy = 0;
        let x = canvas.width;
        const verticalShift = canvas.height / this.numberSpawns; // each column is separated by this height
        let y = 0;
        while (currentNumberEnemy < numberEnemy) {
            for (let index = 0; index < this.numberSpawns; index++) {
                currentNumberEnemy++;
                const ennemy = new TriangleEnemy(x, verticalShift + (y % 675));
                this.AddEnemy(ennemy);
                y += 45;

                if (currentNumberEnemy >= numberEnemy) break;
            }
            x += 60;
            y = 0;
        }
    }

    public AddEnemy(enemy: IEnemy) {
        this.listEnemies.push(enemy);
    }

    public RemoveEnemy(enemy: IEnemy) {
        const index = this.listEnemies.indexOf(enemy);
        if (index > -1) {
            this.listEnemies.splice(index, 1);
        }
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
        return this.listEnemies.length === 0 ? true : false;
    }
}
