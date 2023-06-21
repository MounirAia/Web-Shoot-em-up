import { ServiceLocator } from '../../../../ServiceLocator.js';
import { ISpriteWithDamage } from '../../../SpriteAttributes.js';
import { IGeneratedSprite, IServiceGeneratedSpritesManager } from '../../../GeneratedSpriteManager.js';
import { CollideScenario, RectangleHitbox } from '../../../SpriteHitbox.js';
import { IServiceCollideManager } from '../../../CollideManager.js';
import { IServiceWaveManager } from '../../../../WaveManager/WaveManager.js';
import { canvas, FRAME_RATE } from '../../../../ScreenConstant.js';

export class MirrorShieldThunderBeam implements IGeneratedSprite, ISpriteWithDamage {
    Generator: 'player' | 'enemy';
    Category: 'projectile' | 'nonProjectile';
    CurrentHitbox: RectangleHitbox[];
    Collide: Map<CollideScenario, (param?: unknown) => void>;
    Damage: number;

    private startingPoint: { x: number; y: number };
    private endPoint: { x: number; y: number };
    private setOfKeyPoints: { x: number; y: number }[];
    private readonly verticalRange = 30;
    private readonly potentialPartitionNumbers = [1 / 2, 1 / 4, 1 / 5];
    private readonly lineWidth = 3;
    private currentDisappearTimer = 1 / FRAME_RATE;
    constructor(params: { startingPoint: { x: number; y: number } }) {
        const { startingPoint } = params;
        this.startingPoint = startingPoint;
        const randomEnemy = ServiceLocator.GetService<IServiceWaveManager>('WaveManager').GetARandomEnemy();
        this.endPoint = randomEnemy
            ? { x: randomEnemy.FrameXCenter, y: randomEnemy.FrameYCenter }
            : { x: canvas.width, y: canvas.height / 2 };
        this.setOfKeyPoints = [];

        this.generateKeyPoints();

        this.Damage = 10;
        this.Generator = 'player';
        this.Category = 'projectile';
        this.CurrentHitbox = [
            new RectangleHitbox(this.endPoint.x, this.endPoint.y, 0, 0, this.lineWidth, this.lineWidth),
        ];
        this.Collide = new Map();
        this.Collide.set('WithEnemy', () => {
            ServiceLocator.GetService<IServiceGeneratedSpritesManager>('GeneratedSpritesManager').RemoveSprite(this);
        });
    }

    UpdateHitboxes(dt: number) {}

    public Update(dt: number) {
        this.currentDisappearTimer -= dt;
        if (this.currentDisappearTimer < 0) {
            ServiceLocator.GetService<IServiceGeneratedSpritesManager>('GeneratedSpritesManager').RemoveSprite(this);
        }

        const collideManager = ServiceLocator.GetService<IServiceCollideManager>('CollideManager');
        collideManager.HandleWhenPlayerProjectileCollideWithEnemies(this);
    }

    public Draw(ctx: CanvasRenderingContext2D) {
        const { x: x0, y: y0 } = this.startingPoint;

        ctx.lineWidth = this.lineWidth;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        this.setOfKeyPoints.forEach(({ x, y }) => {
            ctx.lineTo(x, y);
        });
        ctx.stroke();
    }

    private generateKeyPoints() {
        const dx = this.endPoint.x - this.startingPoint.x;
        const dy = this.endPoint.y - this.startingPoint.y;

        const vectorScalingFactor =
            this.potentialPartitionNumbers[Math.floor(Math.random() * this.potentialPartitionNumbers.length)];
        let currentVectorScalingFactor = vectorScalingFactor;

        let directionThunderBeam = Math.random() > 0.5 ? 1 : -1;

        //compute points to generate thunder beam
        while (currentVectorScalingFactor <= 1) {
            const scalledDX = Math.floor(dx * currentVectorScalingFactor + this.startingPoint.x);
            let scalledDY = Math.floor(dy * currentVectorScalingFactor + this.startingPoint.y);

            // adding a random vertical range to create a thunder effect (except at the last point)
            if (currentVectorScalingFactor < 1) {
                scalledDY += directionThunderBeam * Math.floor(Math.random() * this.verticalRange);
            }

            this.setOfKeyPoints.push({ x: scalledDX, y: scalledDY });

            // increase scalling factor
            currentVectorScalingFactor += vectorScalingFactor;
            // inverse thunder beam direction
            directionThunderBeam = -directionThunderBeam;
        }
    }
}