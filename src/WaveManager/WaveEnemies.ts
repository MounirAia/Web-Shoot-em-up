import { canvas, CANVA_SCALEX } from '../ScreenConstant.js';
import { BigDiamondEnemy } from '../Sprites/Enemies/Diamond/BigDiamondEnemy.js';
import { IEnemy } from '../Sprites/Enemies/IEnemy.js';
import { ISpriteWithHitboxes } from '../Sprites/InterfaceBehaviour/ISpriteWithHitboxes.js';

const horizontalEnnemyShootingPositionShift = 125 * CANVA_SCALEX;
const enemiesShootingPosition: number[] = [
    canvas.width - horizontalEnnemyShootingPositionShift,
    canvas.width - horizontalEnnemyShootingPositionShift + 20 * CANVA_SCALEX,
    canvas.width - horizontalEnnemyShootingPositionShift + 40 * CANVA_SCALEX,
    canvas.width - horizontalEnnemyShootingPositionShift + 60 * CANVA_SCALEX,
];

export class WaveEnemies {
    private listEnemies: Map<IEnemy, IEnemy>;
    private readonly numberSpawns;

    constructor(numberEnemy: number, numberSpawns: number) {
        this.listEnemies = new Map<IEnemy, IEnemy>();
        this.numberSpawns = numberSpawns;
        let currentNumberEnemy = 0;
        let x = canvas.width;
        const verticalShift = canvas.height / this.numberSpawns; // vertical padding in columns
        let y = 0;
        let spawnWhenToStop = enemiesShootingPosition[0];
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

    public PlayEnemyAnimation(enemy: IEnemy, animationName: string, loop = false) {
        this.listEnemies.get(enemy)?.PlayAnimation(animationName, loop);
    }

    public GetEnemyAnimationName(enemy: IEnemy) {
        return this.listEnemies.get(enemy)?.CurrentAnimationName;
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

// Have to set a max number of enemies in a wave
// A wave should only be equal to 1 column
// Each column should be locked at a certain point and enemies should start shooting

// Essentially an enemy waves will have preset spawns, where the enemies will stop moving when
// they hit this spawn (probably store this inside the enemy object)

// I also need to regulate the number of enemies that can spawn and how they will
// be separated (also must be displayed well)

// The wave manager will be running infinitely and will not need constructor parameters

// first create the round chart
// then display infinitely wave of enemies
// then change the settings for an enemy wave
// then stop the enemy spawns
