import { ServiceLocator } from '../ServiceLocator.js';
import { ISpriteWithUpdateAndDraw } from './SpriteAttributes.js';
import { ISpriteWithHitboxes } from './SpriteHitbox.js';

export interface IGeneratedSprite extends ISpriteWithHitboxes, ISpriteWithUpdateAndDraw {
    Generator: 'player' | 'enemy';
    Category: 'projectile' | 'nonProjectile';
}

export interface IServiceGeneratedSpritesManager {
    AddSprite: (sprite: IGeneratedSprite) => void;
    RemoveSprite: (sprite: IGeneratedSprite) => void;
    EnemyProjectiles: ReadonlyMap<IGeneratedSprite, IGeneratedSprite>;
}

class GeneratedSpritesManager implements IServiceGeneratedSpritesManager {
    private generatedSpritesList: {
        player: {
            projectiles: Map<IGeneratedSprite, IGeneratedSprite>;
            nonProjectiles: Map<IGeneratedSprite, IGeneratedSprite>;
        };
        enemy: {
            projectiles: Map<IGeneratedSprite, IGeneratedSprite>;
            nonProjectiles: Map<IGeneratedSprite, IGeneratedSprite>;
        };
    };

    constructor() {
        this.generatedSpritesList = {
            player: {
                projectiles: new Map(),
                nonProjectiles: new Map(),
            },
            enemy: {
                projectiles: new Map(),
                nonProjectiles: new Map(),
            },
        };
        ServiceLocator.AddService('GeneratedSpritesManager', this);
    }

    public Update(dt: number) {
        objectKeys(this.generatedSpritesList.player).forEach((key) => {
            this.generatedSpritesList.player[key].forEach((sprite) => {
                sprite.Update(dt);
            });
        });
        objectKeys(this.generatedSpritesList.enemy).forEach((key) => {
            this.generatedSpritesList.enemy[key].forEach((sprite) => {
                sprite.Update(dt);
            });
        });
    }

    public Draw(ctx: CanvasRenderingContext2D): void {
        objectKeys(this.generatedSpritesList.player).forEach((key) => {
            this.generatedSpritesList.player[key].forEach((sprite) => {
                sprite.Draw(ctx);
            });
        });
        objectKeys(this.generatedSpritesList.enemy).forEach((key) => {
            this.generatedSpritesList.enemy[key].forEach((sprite) => {
                sprite.Draw(ctx);
            });
        });
    }

    public AddSprite(sprite: IGeneratedSprite): void {
        const { Generator, Category } = sprite;

        if (Category == 'projectile') {
            this.generatedSpritesList[Generator]['projectiles'].set(sprite, sprite);
        } else if (Category == 'nonProjectile') {
            this.generatedSpritesList[Generator]['nonProjectiles'].set(sprite, sprite);
        }
    }

    public RemoveSprite(sprite: IGeneratedSprite): void {
        const { Generator, Category } = sprite;
        let listToRemoveSprite = new Map();

        if (Category == 'projectile') {
            listToRemoveSprite = this.generatedSpritesList[Generator]['projectiles'];
        } else if (Category == 'nonProjectile') {
            listToRemoveSprite = this.generatedSpritesList[Generator]['nonProjectiles'];
        }

        listToRemoveSprite.delete(sprite);
    }

    get EnemyProjectiles(): ReadonlyMap<IGeneratedSprite, IGeneratedSprite> {
        return this.generatedSpritesList.enemy.projectiles;
    }

    public testQuantity() {
        // for testing purpose
        const playerProjectilesSize = this.generatedSpritesList.player.projectiles.size;
        const playerNonProjectilesSize = this.generatedSpritesList.player.nonProjectiles.size;
        const enemyProjectilesSize = this.generatedSpritesList.enemy.projectiles.size;
        const enemyNonProjectilesSize = this.generatedSpritesList.enemy.nonProjectiles.size;

        console.log('playerProjectile', playerProjectilesSize);
        console.log('playerNonProjectile', playerNonProjectilesSize);
        console.log('enemyProjectile', enemyProjectilesSize);
        console.log('enemyNonProjectilesSize', enemyNonProjectilesSize);
    }
}

let bulletManager: GeneratedSpritesManager;

export function LoadGeneratedSpritesManager() {
    bulletManager = new GeneratedSpritesManager();
}

export function UpdateGeneratedSpritesManager(dt: number) {
    bulletManager.Update(dt);
}

export function DrawGeneratedSpritesManager(ctx: CanvasRenderingContext2D) {
    bulletManager.Draw(ctx);
}

export function UnloadGeneratedSpritesManager() {
    LoadGeneratedSpritesManager();
}

// Util function
function objectKeys<T extends Object>(obj: T): (keyof T)[] {
    return Object.keys(obj) as (keyof T)[];
}
