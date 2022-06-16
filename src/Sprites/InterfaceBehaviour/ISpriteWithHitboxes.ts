export interface ISpriteWithHitboxes {
    readonly Hitboxes: RectangleHitbox[];
    UpdateHitboxes?: (dt: number) => void;
}

export class RectangleHitbox {
    public spriteX: number;
    public spriteY: number;
    private offsetX: number;
    private offsetY: number;
    private width: number;
    private height: number;

    constructor(spriteX: number, spriteY: number, offsetX: number, offsetY: number, width: number, height: number) {
        this.spriteX = spriteX;
        this.spriteY = spriteY;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.width = width;
        this.height = height;
    }

    public checkIfBoxOverlap(x: number, y: number, width: number, height: number) {
        const boxIsInWidth = this.x <= x + width && x <= this.x + this.width;
        const boxIsInHeight = this.y <= y + height && y <= this.y + this.height;
        return boxIsInWidth && boxIsInHeight;
    }

    public CheckCollision(spriteWithHitBox: ISpriteWithHitboxes): boolean {
        spriteWithHitBox.Hitboxes.forEach((shape) => {
            if (this.checkIfBoxOverlap(shape.x, shape.y, shape.width, shape.height)) return true;
        });
        return false;
    }

    private get x(): number {
        return this.spriteX + this.offsetX;
    }
    private get y(): number {
        return this.spriteY + this.offsetY;
    }
}

export function CreateHitboxes(
    spriteX: number,
    spriteY: number,
    additionalHitboxesInfo: { offsetX: number; offsetY: number; width: number; height: number }[],
): RectangleHitbox[] {
    let hitboxes: RectangleHitbox[] = [];

    additionalHitboxesInfo.forEach(({ offsetX, offsetY, width, height }) => {
        hitboxes.push(new RectangleHitbox(spriteX, spriteY, offsetX, offsetY, width, height));
    });

    return hitboxes;
}
