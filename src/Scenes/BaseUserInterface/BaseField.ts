import { Mouse } from '../../Mouse';
import { CANVA_SCALEX } from '../../ScreenConstant';
import { IUIComponent } from './UIManager';

export class BaseField implements IUIComponent {
    protected X: number;
    protected Y: number;
    protected Width: number;
    protected Height: number;
    protected HasHover: boolean;

    private isVisible: boolean;
    private isActive: boolean;
    private isDisabled: boolean;

    public LineWidth: number = (3 / 4) * CANVA_SCALEX;
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
        this.isVisible = true;
        this.isActive = false; // the field can be activated through different means
        this.isDisabled = false;
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

        if ((this.IsHovered && this.HasHover) || (this.HasHover && this.GetActive())) {
            ctx.strokeStyle = '#B09F9E';
            ctx.strokeRect(this.X, this.Y, this.Width, this.Height);
        } else {
            ctx.strokeStyle = 'black';
        }

        if (this.isDisabled) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
            ctx.fillRect(this.X, this.Y, this.Width, this.Height);
        }
    }

    public SetVisibility(visible: boolean): void {
        this.isVisible = visible;
    }

    public GetVisibility(): boolean {
        return this.isVisible;
    }

    public SetActive(active: boolean): void {
        this.isActive = active;
    }

    public GetActive(): boolean {
        return this.isActive;
    }

    public SetDisabled(disabled: boolean): void {
        this.isDisabled = disabled;
    }

    public GetDisabled(): boolean {
        return this.isDisabled;
    }

    public GetWidth(): number {
        return this.Width;
    }

    public GetHeight(): number {
        return this.Height;
    }

    public GetX(): number {
        return this.X;
    }

    public GetY(): number {
        return this.Y;
    }
}
