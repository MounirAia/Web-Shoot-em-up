import { EnemyTier } from '../Enemies/IEnemy.js';
import { IGeneratedSprite } from '../GeneratedSpriteManager.js';
import { SmallEnemyBullet } from './SmallEnemyBullet.js';
import { MediumEnemyBullet } from './MediumEnemyBullet.js';
import { BigEnemyBullet } from './BigEnemyBullet.js';

export class EnemyBulletGenerator {
    private cannonX: number;
    private cannonY: number;
    constructor(parameters: { cannonX: number; cannonY: number }) {
        const { cannonX, cannonY } = parameters;
        this.cannonX = cannonX;
        this.cannonY = cannonY;
    }

    public GenerateBullet(parameters: { enemyTier: EnemyTier }): IGeneratedSprite[] {
        const { enemyTier } = parameters;

        if (enemyTier === 'Tier1') {
            const bullet = new SmallEnemyBullet({ x: this.cannonX, y: this.cannonY });
            return [bullet];
        } else if (enemyTier === 'Tier2') {
            const bullet = new MediumEnemyBullet({
                x: this.cannonX,
                y: this.cannonY,
                angleOffsetInRadian: this.degreesToRadians(10),
            });

            const bullet2 = new MediumEnemyBullet({
                x: this.cannonX,
                y: this.cannonY,
                angleOffsetInRadian: this.degreesToRadians(-10),
            });

            return [bullet, bullet2];
        } else if (enemyTier === 'Tier3') {
            const bullet = new BigEnemyBullet({ x: this.cannonX, y: this.cannonY });
            const bullet2 = new BigEnemyBullet({
                x: this.cannonX,
                y: this.cannonY,
                angleOffsetInRadian: this.degreesToRadians(10),
            });

            const bullet3 = new BigEnemyBullet({
                x: this.cannonX,
                y: this.cannonY,
                angleOffsetInRadian: this.degreesToRadians(-10),
            });

            return [bullet, bullet2, bullet3];
        }

        return [];
    }

    private degreesToRadians(degrees: number): number {
        return degrees * (Math.PI / 180);
    }
}
