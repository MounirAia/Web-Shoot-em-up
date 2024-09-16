import { IServiceEventManager } from '../EventManager';
import { CANVA_SCALEX, CANVA_SCALEY } from '../ScreenConstant';
import { ServiceLocator } from '../ServiceLocator';

class Shockwave {
    private playerX: number;
    private playerY: number;

    private baseRadius: number;
    private maxRadius: number;
    private radius: number;
    private speedRadius: number;

    private explosionOpacity: number;
    private speedOpacity: number;
    private baseOpacity: number;

    private shockwaveColor: string;

    constructor(parameters: { playerX: number; playerY: number }) {
        const { playerX, playerY } = parameters;
        this.playerX = playerX;
        this.playerY = playerY;

        this.baseRadius = 50 * CANVA_SCALEX;
        this.maxRadius = 200 * CANVA_SCALEX;
        this.speedRadius = 12 * CANVA_SCALEX;
        this.radius = this.baseRadius;

        this.baseOpacity = 0.5;
        this.explosionOpacity = this.baseOpacity;
        const numberFrameForRadiusReachMax = (this.maxRadius - this.baseRadius) / this.speedRadius;
        this.speedOpacity = this.explosionOpacity / numberFrameForRadiusReachMax;
        this.shockwaveColor = '#C0C0C0';

        ServiceLocator.GetService<IServiceEventManager>('EventManager').Notify('player shockwave');
    }

    public Update(dt: number) {
        if (this.radius < this.maxRadius) {
            this.radius = this.radius + this.speedRadius;
            this.explosionOpacity = this.explosionOpacity - this.speedOpacity;
            if (this.explosionOpacity < 0) {
                this.explosionOpacity = 0;
            }
        }
    }

    public Draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        // Begin a new path to draw the circle
        ctx.beginPath();

        // Use the arc method to create the circle
        ctx.arc(this.playerX + 15 * CANVA_SCALEX, this.playerY + 6 * CANVA_SCALEY, this.radius, 0, 2 * Math.PI);

        // Set transparency (globalAlpha ranges from 0.0 to 1.0)
        ctx.globalAlpha = this.explosionOpacity;

        // Set the fill color to white
        ctx.fillStyle = this.shockwaveColor; // White color fill

        // Fill the circle with the transparent white color
        ctx.fill();

        ctx.restore();
    }

    public GetIsActived(): boolean {
        if (this.radius < this.maxRadius) {
            return true;
        }
        return false;
    }
}

export class PlayerShockwaveController {
    private shockwaves: Shockwave[];

    constructor() {
        this.shockwaves = [];
    }

    public Update(dt: number) {
        for (let i = this.shockwaves.length - 1; i >= 0; i--) {
            const shockwave = this.shockwaves[i];

            shockwave.Update(dt);
            if (!shockwave.GetIsActived()) {
                this.shockwaves.splice(i, 1);
            }
        }
    }

    public Draw(ctx: CanvasRenderingContext2D) {
        this.shockwaves.forEach((shockwave) => {
            shockwave.Draw(ctx);
        });
    }

    public AddShockwave(parameters: { playerX: number; playerY: number }) {
        const { playerX, playerY } = parameters;
        this.shockwaves.push(new Shockwave({ playerX: playerX, playerY: playerY }));
    }
}
