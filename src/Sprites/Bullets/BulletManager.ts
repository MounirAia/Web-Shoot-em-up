import { ServiceLocator } from '../../ServiceLocator.js';
import { IBullet } from './IBullet.js';

// Start adding bullet for the player

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
        this.bulletsList.player.forEach((playerBullet) => {
            playerBullet.Update(dt);
        });

        this.bulletsList.enemy.forEach((enemyBullet) => {
            enemyBullet.Update(dt);
        });
    }

    public Draw(ctx: CanvasRenderingContext2D): void {
        this.bulletsList.player.forEach((playerBullet) => {
            playerBullet.Draw(ctx);
        });

        this.bulletsList.enemy.forEach((enemyBullet) => {
            enemyBullet.Draw(ctx);
        });
    }

    public AddBullet(bullet: IBullet): void {
        this.bulletsList[bullet.type].push(bullet);
    }

    public RemoveBullet(bullet: IBullet): void {
        const index = this.bulletsList[bullet.type].indexOf(bullet);
        if (index > -1) {
            this.bulletsList[bullet.type].splice(index, 1);
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
