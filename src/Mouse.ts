import { canvas } from './main.js';

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
    Mouse.IsPressed = false;
    console.log(Mouse.IsPressed);
});

canvas.addEventListener('mousedown', (e) => {
    Mouse.IsPressed = true;
    console.log(Mouse.IsPressed);
});
