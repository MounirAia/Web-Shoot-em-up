import { ServiceLocator } from '../../ServiceLocator.js';
import { IBullet } from './IBullet.js';

export interface IServiceBulletManager {
    AddBullet: (bullet: IBullet) => void;
    RemoveBullet: (bullet: IBullet) => void;
}
class BulletManager implements IServiceBulletManager {
    private bulletsList: { player: IBullet[]; enemy: IBullet[] } = { player: [], enemy: [] };

    constructor() {
        ServiceLocator.AddService('BulletManager', this);
    }

    public Update(dt: number) {
        // Loop from end to begining to avoid skipping projectile Update/Draw when projectiles gets deleted
        for (let i = this.bulletsList.player.length - 1; i >= 0; --i) {
            this.bulletsList.player[i].Update(dt);
        }
        for (let i = this.bulletsList.enemy.length - 1; i >= 0; --i) {
            this.bulletsList.enemy[i].Update(dt);
        }
    }

    public Draw(ctx: CanvasRenderingContext2D): void {
        for (let i = this.bulletsList.player.length - 1; i >= 0; --i) {
            this.bulletsList.player[i].Draw(ctx);
        }

        for (let i = this.bulletsList.enemy.length - 1; i >= 0; --i) {
            this.bulletsList.enemy[i].Draw(ctx);
        }
    }

    public AddBullet(bullet: IBullet): void {
        this.bulletsList[bullet.Type].push(bullet);
    }

    public RemoveBullet(bullet: IBullet): void {
        const indexElementToDelete = this.bulletsList[bullet.Type].indexOf(bullet);
        if (indexElementToDelete > -1) {
            const lastElementArray = this.bulletsList[bullet.Type][this.bulletsList[bullet.Type].length - 1];
            this.bulletsList[bullet.Type][indexElementToDelete] = lastElementArray; // replace the element to delete by the last one
            this.bulletsList[bullet.Type].pop(); // delete the duplicate version
        }
    }
}

let bulletManager: BulletManager;

export function LoadBulletManager() {
    bulletManager = new BulletManager();
}

export function UpdateBulletManager(dt: number) {
    bulletManager.Update(dt);
}

export function DrawBulletManager(ctx: CanvasRenderingContext2D) {
    bulletManager.Draw(ctx);
}
