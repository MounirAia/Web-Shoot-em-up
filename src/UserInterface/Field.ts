import { Mouse } from '../Mouse.js';
import { CANVA_SCALEX } from '../ScreenConstant.js';

export class BlankField {
    protected X: number;
    protected Y: number;
    protected Width: number;
    protected Height: number;
    protected HasHover: boolean;

    public LineWidth: number = 3;
    public HasBorderOnAllSide: boolean = true;
    public HasTopBorder?: boolean;
    public HasRightBorder?: boolean;
    public HasBottomBorder?: boolean;
    public HasLeftBorder?: boolean;
    private onClick?: () => void;

    constructor(x: number, y: number, width: number, height: number, HasHover: boolean = false, onClick?: () => void) {
        this.X = x;
        this.Y = y;
        this.Width = width;
        this.Height = height;
        this.HasHover = HasHover;
        this.onClick = onClick;
    }

    public get IsHovered(): boolean {
        const mouseIsInWidth = Mouse.X >= this.X && Mouse.X <= this.X + this.Width;
        const mouseIsInHeight = Mouse.Y >= this.Y && Mouse.Y <= this.Y + this.Height;
        const mouseIsInBoudingBox = mouseIsInWidth && mouseIsInHeight;
        if (mouseIsInBoudingBox) return true;

        return false;
    }

    public Update(dt: number) {
        if (this.IsHovered && this.onClick && Mouse.IsPressed) {
            this.onClick();
        }
    }

    public Draw(ctx: CanvasRenderingContext2D) {
        ctx.lineWidth = this.LineWidth;
        ctx.fillStyle = 'black';
        if (this.HasBorderOnAllSide) {
            ctx.strokeRect(this.X, this.Y, this.Width, this.Height);
        } else {
            ctx.beginPath();
            if (this.HasTopBorder) {
                ctx.moveTo(this.X, this.Y);
                ctx.lineTo(this.X + this.Width, this.Y);
                ctx.stroke();
            }
            if (this.HasRightBorder) {
                ctx.moveTo(this.X + this.Width, this.Y);
                ctx.lineTo(this.X + this.Width, this.Y + this.Height);
                ctx.stroke();
            }
            if (this.HasBottomBorder) {
                ctx.moveTo(this.X, this.Y + this.Height);
                ctx.lineTo(this.X + this.Width, this.Y + this.Height);
                ctx.stroke();
            }
            if (this.HasLeftBorder) {
                ctx.moveTo(this.X, this.Y);
                ctx.lineTo(this.X, this.Y + this.Height);
                ctx.stroke();
            }
        }
    }
}

export class FieldWithText extends BlankField {
    private text: string;
    private fontSize: number;
    private fontFamily: string;
    constructor(
        x: number,
        y: number,
        width: number,
        height: number,
        text: string,
        fontSize: number = 8 * CANVA_SCALEX,
        fontFamily: string = 'serif',
        HasHovered?: boolean,
        onClick?: () => void,
    ) {
        super(x, y, width, height, HasHovered, onClick);
        this.text = text;
        this.fontSize = fontSize;
        this.fontFamily = fontFamily;
    }

    Draw(ctx: CanvasRenderingContext2D) {
        super.Draw(ctx);
        if (this.IsHovered && this.HasHover) {
            ctx.fillStyle = 'black';
            ctx.fillRect(this.X, this.Y, this.Width, this.Height);
            ctx.fillStyle = 'white';
        } else {
            ctx.fillStyle = 'black';
        }
        /* Text drawing */
        const fontSize = this.fontSize;
        ctx.font = `${fontSize}px ${this.fontFamily}`;
        // draw text to the center of the field box
        const textMetric = ctx.measureText(this.text!);
        const textWidth = textMetric.width;
        const textHeight = textMetric.actualBoundingBoxAscent - textMetric.actualBoundingBoxDescent;
        ctx.fillText(this.text!, this.X + (this.Width - textWidth) / 2, this.Y + this.Height / 2 + textHeight / 2);
    }
}
