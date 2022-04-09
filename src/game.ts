const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
export function load() {}

let rect = {
    x: 10,
    y: 10,
    speed: 5 * 60,
};

export function update(dt: number) {
    if (rect.x + 100 >= canvas.width || rect.x <= 0) {
        rect.speed = -rect.speed;
    }

    rect.x = rect.x + rect.speed * dt;
}

export function draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'green';
    ctx.fillRect(rect.x, rect.y, 100, 100);
}
