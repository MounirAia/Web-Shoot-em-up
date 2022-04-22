export interface IEnemy {
    Update(dt: number): void;
    Draw(ctx: CanvasRenderingContext2D): void;
}
