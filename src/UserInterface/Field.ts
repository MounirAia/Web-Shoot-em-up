import { Mouse } from '../Mouse.js';
import { CANVA_SCALEX } from '../ScreenConstant.js';

// Continue Field class
export class Field {
    private x: number;
    private y: number;
    private width: number;
    private height: number;
    private text?: string;
    private hovered?: () => void;

    constructor(x: number, y: number, width: number, height: number, text?: string, hovered?: () => void) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.text = text;
        this.hovered = hovered;
    }

    public get IsHovered(): boolean {
        const mouseIsInWidth = Mouse.X >= this.x && Mouse.X <= this.x + this.width;
        const mouseIsInHeight = Mouse.Y >= this.y && Mouse.Y <= this.y + this.height;
        const mouseIsInBoudingBox = mouseIsInWidth && mouseIsInHeight;
        if (mouseIsInBoudingBox) return true;

        return false;
    }

    public Update(dt: number) {
        if (this.IsHovered && this.hovered) {
            this.hovered();
        }
    }

    public Draw(ctx: CanvasRenderingContext2D) {
        ctx.strokeRect(this.x, this.y, this.width, this.height);

        /* Text drawing */
        ctx.fillStyle = 'black';
        const fontSize = 8 * CANVA_SCALEX;
        ctx.font = `${fontSize}px serif`;
        const textMetric = ctx.measureText(this.text!);
        const textWidth = textMetric.width;
        const textHeight = textMetric.actualBoundingBoxAscent - textMetric.actualBoundingBoxDescent;
        ctx.fillText(this.text!, this.x + (this.width - textWidth) / 2, this.y + this.height / 2 + textHeight / 2);
    }
}
