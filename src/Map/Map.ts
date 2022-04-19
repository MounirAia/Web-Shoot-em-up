import { FRAME_RATE } from '../main.js';

export abstract class Map {
    private horizontalSpeed: number;
    protected background: HTMLImageElement;
    protected readonly scaleX: number;
    protected readonly scaleY: number;
    protected x: number;
    protected y: number;

    constructor(
        horizontalSpeed: number,
        background: HTMLImageElement,
        x: number = 0,
        y: number = 0,
        scaleX: number = 1,
        scaleY: number = 1,
    ) {
        this.horizontalSpeed = horizontalSpeed;
        this.background = background;
        this.x = x;
        this.y = y;
        this.scaleX = scaleX;
        this.scaleY = scaleY;
    }

    abstract Update(dt: number): void;

    abstract Draw(ctx: CanvasRenderingContext2D): void;

    protected get HorizontalSpeed(): number {
        return this.horizontalSpeed * FRAME_RATE;
    }

    protected set HorizontalSpeed(value: number) {
        this.horizontalSpeed = value;
    }
}
