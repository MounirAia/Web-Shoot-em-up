export interface ISpriteWithHitboxes {
    CurrentHitbox: RectangleHitbox[];
    UpdateHitboxes?: (dt: number) => void;
    HitboxesByFrame?: HitboxesByFrame;
}

export class RectangleHitbox {
    public SpriteX: number;
    public SpriteY: number;
    private offsetX: number;
    private offsetY: number;
    private width: number;
    private height: number;

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
    }
}

type keyForHitboxesByFrame = number | 'noHitbox' | 'default';
export class HitboxesByFrame {
    private hitboxesMap: Map<keyForHitboxesByFrame, RectangleHitbox[]>;

    constructor() {
        this.hitboxesMap = new Map();
        this.hitboxesMap.set('noHitbox', []); // useful to remove a sprite from the flow of the game
    }

    public SetHitboxes(frame: keyForHitboxesByFrame, hitboxes: RectangleHitbox[]) {
        this.hitboxesMap.set(frame, hitboxes);
    }

    public GetHitboxes(frame: keyForHitboxesByFrame): RectangleHitbox[] {
        const hitbox = this.hitboxesMap.get(frame);
        if (hitbox) {
            return hitbox;
        }

        return this.hitboxesMap.get('noHitbox')!;
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
