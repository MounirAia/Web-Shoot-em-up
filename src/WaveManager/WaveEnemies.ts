import { canvas } from '../ScreenConstant.js';
import { BigDiamondEnemy } from '../Sprites/Enemies/Diamond/BigDiamondEnemy.js';
import { IEnemy } from '../Sprites/Enemies/IEnemy.js';
import { ISpriteWithHitboxes } from '../Sprites/InterfaceBehaviour/ISpriteWithHitboxes.js';

export class WaveEnemies {
    private listEnemies: Map<IEnemy, IEnemy>;
    private readonly numberSpawns;
    constructor(numberEnemy: number, numberSpawns: number) {
        this.listEnemies = new Map<IEnemy, IEnemy>();
        this.numberSpawns = numberSpawns;
        let currentNumberEnemy = 0;
        let x = canvas.width;
        const verticalShift = canvas.height / this.numberSpawns; // each column is separated by this height
        let y = 0;
        while (currentNumberEnemy < numberEnemy) {
            for (let index = 0; index < this.numberSpawns; index++) {
                currentNumberEnemy++;
                const ennemy = new BigDiamondEnemy(x, verticalShift + (y % 675));
                this.AddEnemy(ennemy);
                y += 45;

                if (currentNumberEnemy >= numberEnemy) break;
            }
            x += 60;
            y = 0;
        }
    }

    public AddEnemy(enemy: IEnemy) {
        this.listEnemies.set(enemy, enemy);
    }

    public RemoveEnemy(enemy: IEnemy) {
        this.listEnemies.delete(enemy);
    }

    public VerifyCollisionWithEnemies(sprite: ISpriteWithHitboxes): {
        isColliding: boolean;
        enemy: IEnemy | undefined;
    } {
        let isColliding = false;
        for (const [key, enemy] of this.listEnemies) {
            for (const hitbox of enemy.Hitboxes) {
                isColliding = hitbox.CheckCollision(sprite);

                if (isColliding) return { isColliding, enemy };
            }
        }

        return { isColliding, enemy: undefined };
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
}
