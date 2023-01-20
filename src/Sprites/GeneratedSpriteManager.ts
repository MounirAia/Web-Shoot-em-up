import { ServiceLocator } from '../ServiceLocator.js';
import { Sprite } from './Sprite.js';

export interface IServiceGeneratedSpritesManager {
    AddSprite: (sprite: Sprite) => void;
    RemoveSprite: (sprite: Sprite) => void;
}
class GeneratedSpritesManager implements IServiceGeneratedSpritesManager {
    private generatedSpritesList: Sprite[];

    constructor() {
        this.generatedSpritesList = [];
        ServiceLocator.AddService('GeneratedSpritesManager', this);
    }

    public Update(dt: number) {
        // Loop from end to begining to avoid skipping sprites Update/Draw when sprites gets deleted
        for (let i = this.generatedSpritesList.length - 1; i >= 0; --i) {
            this.generatedSpritesList[i].Update(dt);
        }
    }

    public Draw(ctx: CanvasRenderingContext2D): void {
        for (let i = this.generatedSpritesList.length - 1; i >= 0; --i) {
            this.generatedSpritesList[i].Draw(ctx);
        }
    }

    public AddSprite(sprite: Sprite): void {
        this.generatedSpritesList.push(sprite);
    }

    public RemoveSprite(sprite: Sprite): void {
        const indexElementToDelete = this.generatedSpritesList.indexOf(sprite);
        if (indexElementToDelete > -1) {
            const lastElementArray = this.generatedSpritesList.slice(-1)[0];
            this.generatedSpritesList[indexElementToDelete] = lastElementArray; // replace the element to delete by the last one
            this.generatedSpritesList.pop(); // delete the duplicate version
        }
    }
}

let bulletManager: GeneratedSpritesManager;

export function LoadBulletManager() {
    bulletManager = new GeneratedSpritesManager();
}

export function UpdateBulletManager(dt: number) {
    bulletManager.Update(dt);
}

export function DrawBulletManager(ctx: CanvasRenderingContext2D) {
    bulletManager.Draw(ctx);
}
