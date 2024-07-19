import { CANVA_SCALEX } from '../../ScreenConstant.js';
import { BaseField } from './BaseField.js';

export class FieldWithText extends BaseField {
    private text: string;
    private fontSize: number;
    private fontFamily: string;
    private leftAlign: boolean;
    constructor(parameters: {
        x: number;
        y: number;
        width: number;
        height: number;
        text: string;
        fontSize: number;
        fontFamily: string;
        HasHovered?: boolean;
        onClick?: () => void;
        leftAlign?: boolean;
    }) {
        const { x, y, width, height, text, fontSize, fontFamily, HasHovered, onClick, leftAlign } = parameters;
        super(x, y, width, height, HasHovered, onClick);
        this.text = text;
        this.fontSize = fontSize || 8 * CANVA_SCALEX;
        this.fontFamily = fontFamily || 'serif';
        this.leftAlign = leftAlign || false;
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

        // Align the text based on the container not the text itself
        if (this.leftAlign) {
            const linesToDraw = this.wrapTextInContainer({ ctx });
            const lineHeight = this.fontSize * 1.5;
            linesToDraw.forEach((line, index) => {
                ctx.fillText(line, this.X, this.Y + textHeight + index * lineHeight);
            });
        } else {
            ctx.fillText(this.text!, this.X + (this.Width - textWidth) / 2, this.Y + this.Height / 2 + textHeight / 2);
        }
    }

    private wrapTextInContainer(parameters: { ctx: CanvasRenderingContext2D }) {
        const words = this.text.split(' ');
        let line = '';
        let linesToDraw: string[] = [];
        linesToDraw.push(line);
        for (const word of words) {
            let currentLine = linesToDraw[linesToDraw.length - 1] + ' ' + word;
            currentLine = currentLine.trim();
            const currentLineMetric = parameters.ctx.measureText(currentLine);
            const lineWidth = currentLineMetric.width;

            if (lineWidth < this.Width) {
                linesToDraw[linesToDraw.length - 1] = currentLine;
            } else {
                line = word;
                linesToDraw.push(line);
            }
        }

        return linesToDraw;
    }
}
