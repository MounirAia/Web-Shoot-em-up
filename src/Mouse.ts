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
        if (this.isPressed) {
            this.isPressed = false;
            return true;
        }
        return this.isPressed;
    }

    public static set IsPressed(value: boolean) {
        this.isPressed = value;
    }
}

canvas.addEventListener('mousemove', (e) => {
    const { pageX, pageY } = e;

    const x = pageX - canvas.offsetLeft;
    const y = pageY - canvas.offsetTop;
    Mouse.X = x;
    Mouse.Y = y;

    Mouse.IsPressed = false;
});

canvas.addEventListener('mouseup', (e) => {
    if (e.button === 0) Mouse.IsPressed = false;
});

canvas.addEventListener('mousedown', (e) => {
    if (e.button === 0) Mouse.IsPressed = true;
});

/* Prevent Mouse Scrolling When the Game is Focused */
// Function to prevent scrolling
function preventScroll(event) {
    event.preventDefault(); // Prevent the default scroll behavior
}

// Enable scroll prevention on canvas click
canvas.addEventListener('click', () => {
    document.addEventListener('wheel', preventScroll, { passive: false });
});

// Re-enable scrolling only when clicking outside the canvas
document.addEventListener('click', (event) => {
    if (!canvas.contains(event.target as Node)) {
        document.removeEventListener('wheel', preventScroll);
    }
});
