import { canvas, CANVA_SCALEX } from '../ScreenConstant.js';
import { ICollidableSprite } from '../Sprites/CollideManager.js';
import { CircleEnemy } from '../Sprites/Enemies/Circle/CircleEnemy.js';
import { BigDiamondEnemy } from '../Sprites/Enemies/Diamond/BigDiamondEnemy.js';
import { IEnemy } from '../Sprites/Enemies/IEnemy.js';
import { RectangleEnemy } from '../Sprites/Enemies/Rectangle/RectangleEnemy.js';
import { TrapezeEnemy } from '../Sprites/Enemies/Trapeze/TrapezeEnemy.js';
import { TriangleEnemy } from '../Sprites/Enemies/Triangle/TriangleEnemy.js';
import { ISpriteWithHitboxes } from '../Sprites/InterfaceBehaviour/ISpriteWithHitboxes.js';

function generateRandomNumberArray(max: number): number[] {
    const indicesMonster: number[] = [];
    // fill the array
    for (let index = 0; index < max; index++) {
        indicesMonster.push(index);
    }
    // shuffle the array
    let tmp,
        current,
        top = indicesMonster.length;
    if (top)
        while (--top) {
            current = Math.floor(Math.random() * (top + 1));
            tmp = indicesMonster[current];
            indicesMonster[current] = indicesMonster[top];
            indicesMonster[top] = tmp;
        }
    return indicesMonster;
}

export class WaveEnemies {
    private listEnemies: Map<IEnemy, IEnemy>;
    private readonly numberSpawns = 8;
    private readonly maxNumberEnemies = 40;
    private readonly numberTypeOfRegularEnemies = 5;
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
        const monsterScreenWidthProportion = canvas.width * (30 / 100); // how much screen the monsters shooting position take
        const maxNumberShootingSpawn = 5;
        const horizontalGapBetweenMonsters = Math.floor(monsterScreenWidthProportion / maxNumberShootingSpawn);
        let monsterShootingPosition = canvas.width - monsterScreenWidthProportion; // where the monsters will be
        let randomIndicesMonster = generateRandomNumberArray(this.numberTypeOfRegularEnemies);
        while (currentNumberEnemy < numberEnemies) {
            for (let index = 0; index < this.numberSpawns; index++) {
                currentNumberEnemy++;

                if (!randomIndicesMonster.length)
                    randomIndicesMonster = generateRandomNumberArray(this.numberTypeOfRegularEnemies);

                this.AddEnemy(
                    this.generateEnemy(
                        randomIndicesMonster.pop()!,
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

    private generateEnemy(index: number, x: number, y: number, monsterShootingPosition: number): IEnemy {
        return new BigDiamondEnemy(x, y, monsterShootingPosition);
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

    public get ListEnemies(): Map<IEnemy, ISpriteWithHitboxes & ICollidableSprite> {
        return this.listEnemies as Map<IEnemy, ISpriteWithHitboxes & ICollidableSprite>;
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

// Change setting for an enemy waves to stop in predefined spawns, how many enemies that will be generated and so on
// then stop the enemy spawns

// random enemies generation is made like so:
// you have 5 enemies type, each 5 enemies batch you
// spawn them randomly.If you have 12 enemies to spawn you do (the number 5 correspond to the number of enemies type)
// 12 - 5 = 7 (you spawn 5 enemies randomly), 7 - 5 = 2 (you spawn 5 enemies randomly)
// 2 -2 (you spawn 2 enemies randomly)
