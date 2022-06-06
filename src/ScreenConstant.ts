export const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
const baseCanvaWidth = 320;
const baseCanvaHeight = 180;
export const CANVA_SCALEX = canvas.width / baseCanvaWidth;
export const CANVA_SCALEY = canvas.height / baseCanvaHeight;
export const FRAME_RATE = 60;
