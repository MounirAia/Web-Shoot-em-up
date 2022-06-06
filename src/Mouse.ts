import { canvas } from './ScreenConstant.js';

export class Mouse {
    private static x: number = 0;
    private static y: number = 0;
    private static isPressed: boolean = false;

    public static get X(): number {
        return this.x;
    }

    public static set X(value: number) {
        this.x = value;
    }

    public static get Y(): number {
        return this.y;
    }

    public static set Y(value: number) {
        this.y = value;
    }

    public static get IsPressed() {
        return this.isPressed;
    }

    public static set IsPressed(value: boolean) {
        this.isPressed = value;
    }
}

canvas.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;

    Mouse.X = clientX - canvas.offsetLeft;
    Mouse.Y = clientY - canvas.offsetTop;
});

canvas.addEventListener('mouseup', (e) => {
    if (e.button === 0) Mouse.IsPressed = false;
});

canvas.addEventListener('mousedown', (e) => {
    if (e.button === 0) Mouse.IsPressed = true;
});
