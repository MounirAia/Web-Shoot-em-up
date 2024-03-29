export type CollideScenario = 'WithProjectile' | 'WithNonProjectile' | 'WithPlayer' | 'WithEnemy';

export interface ISpriteWithHitboxes {
    CurrentHitbox: RectangleHitbox[];
    UpdateHitboxes?: (dt: number) => void;
    Collide: Map<CollideScenario, (param?: unknown) => void>;
}

export class RectangleHitbox {
    public SpriteX: number;
    public SpriteY: number;
    private offsetX: number;
    private offsetY: number;
    private width: number;
    private height: number;
    public static readonly NoHitbox: [] = [];
    constructor(spriteX: number, spriteY: number, offsetX: number, offsetY: number, width: number, height: number) {
        this.SpriteX = spriteX;
        this.SpriteY = spriteY;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.width = width;
        this.height = height;
    }

    public CheckIfBoxOverlap(x: number, y: number, width: number, height: number) {
        const boxIsInWidth = this.x < x + width && x < this.x + this.width;
        const boxIsInHeight = this.y < y + height && y < this.y + this.height;
        return boxIsInWidth && boxIsInHeight;
    }

    public CheckCollision(spriteWithHitBox: ISpriteWithHitboxes): boolean {
        for (const hitbox of spriteWithHitBox.CurrentHitbox) {
            if (this.CheckIfBoxOverlap(hitbox.x, hitbox.y, hitbox.width, hitbox.height)) return true;
        }
        return false;
    }

    private get x(): number {
        return this.SpriteX + this.offsetX;
    }
    private get y(): number {
        return this.SpriteY + this.offsetY;
    }

    // Only there to test hitbox visually
    public TestHitboxDrawing(ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = 'purple';
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.strokeStyle = 'black';
    }
}

export function CreateHitboxes(
    spriteX: number,
    spriteY: number,
    additionalHitboxesInfo: {
        readonly offsetX: number;
        readonly offsetY: number;
        readonly width: number;
        readonly height: number;
    }[],
): RectangleHitbox[] {
    const hitboxes: RectangleHitbox[] = [];

    additionalHitboxesInfo.forEach(({ offsetX, offsetY, width, height }) => {
        hitboxes.push(new RectangleHitbox(spriteX, spriteY, offsetX, offsetY, width, height));
    });

    return hitboxes;
}

export function CreateHitboxesWithInfoFile(
    spriteX: number,
    spriteY: number,
    hitboxArray: { X: number; Y: number; Width: number; Height: number }[],
) {
    const hitboxes: RectangleHitbox[] = [];
    hitboxArray.forEach(({ X, Y, Width, Height }) => {
        hitboxes.push(new RectangleHitbox(spriteX, spriteY, X, Y, Width, Height));
    });

    return hitboxes;
}
