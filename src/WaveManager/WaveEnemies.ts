import { canvas, CANVA_SCALEX } from '../ScreenConstant.js';
import { BigDiamondEnemy } from '../Sprites/Enemies/Diamond/BigDiamondEnemy.js';
import { IEnemy } from '../Sprites/Enemies/IEnemy.js';
import { ISpriteWithHitboxes } from '../Sprites/InterfaceBehaviour/ISpriteWithHitboxes.js';

// have to test this new setting with all the enemies
// have to add randomness in the type of enemies generated (bag method)

export class WaveEnemies {
    private listEnemies: Map<IEnemy, IEnemy>;
    private readonly numberSpawns;
    private readonly maxNumberEnemies = 40;
    constructor(numberEnemies: number) {
        if (numberEnemies > this.maxNumberEnemies) numberEnemies = this.maxNumberEnemies;

        this.listEnemies = new Map<IEnemy, IEnemy>();
        this.numberSpawns = 8;
        const verticalGapBetweenMonsters = 60;
        const verticalShift = (canvas.height - this.numberSpawns * verticalGapBetweenMonsters) / 2; // vertical padding in columns
        let currentNumberEnemy = 0;
        let x = canvas.width;
        let y = 0;

        const monsterScreenWidthProportion = canvas.width * (30 / 100); // how much screen the monsters shooting position take
        const maxNumberShootingSpawn = 5;
        const horizontalGapBetweenMonsters = Math.floor(monsterScreenWidthProportion / maxNumberShootingSpawn);
        let monsterShootingPosition = canvas.width - monsterScreenWidthProportion; // where the monsters will be

        while (currentNumberEnemy < numberEnemies) {
            for (let index = 0; index < this.numberSpawns; index++) {
                currentNumberEnemy++;
                const ennemy = new BigDiamondEnemy(
                    x,
                    verticalShift + (y % (this.numberSpawns * verticalGapBetweenMonsters)),
                    monsterShootingPosition,
                );
                this.AddEnemy(ennemy);
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

// Change setting for an enemy waves to stop in predefined spawns, how many enemies that will be generated and so on
// then stop the enemy spawns
