import { CANVA_SCALEX, CANVA_SCALEY, FRAME_RATE } from '../../ScreenConstant.js';

const Info = {
    Meta: {
        TileDimensions: {
            Width: 8,
            Height: 8,
        },
        RealDimension: {
            Width: 2 * CANVA_SCALEX,
            Height: 2 * CANVA_SCALEY,
        },
        SpriteShiftPosition: {
            X: -3 * CANVA_SCALEX,
            Y: -3 * CANVA_SCALEY,
        },
    },
    Hitbox: [{ X: 0, Y: 0, Width: 2 * CANVA_SCALEX, Height: 2 * CANVA_SCALEY }],
    Animations: {
        Idle: {
            FrameLengthInTime: Infinity,
            Frames: [0],
        },
        Destroyed: {
            FrameLengthInTime: 2 * (1 / FRAME_RATE),
            Frames: [0, 1, 2, 3, 4],
        },
    },
};

export default Info;
