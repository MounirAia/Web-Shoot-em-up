import { CANVA_SCALEX, CANVA_SCALEY } from '../../ScreenConstant.js';

const Info = {
    Meta: {
        TileDimensions: {
            Width: 64,
            Height: 64,
        },
        RealDimension: {
            Width: 34 * CANVA_SCALEX,
            Height: 12 * CANVA_SCALEY,
        },
        SpriteShiftPosition: {
            X: -18 * CANVA_SCALEX,
            Y: -25 * CANVA_SCALEY,
        },
    },
    Hitbox: [
        {
            X: 0,
            Y: 0,
            Width: 22 * CANVA_SCALEX,
            Height: 12 * CANVA_SCALEY,
        },
        {
            X: 22 * CANVA_SCALEX,
            Y: 1 * CANVA_SCALEY,
            Width: 1 * CANVA_SCALEX,
            Height: 11 * CANVA_SCALEY,
        },
        {
            X: 23 * CANVA_SCALEX,
            Y: 2 * CANVA_SCALEY,
            Width: 1 * CANVA_SCALEX,
            Height: 10 * CANVA_SCALEY,
        },
        {
            X: 24 * CANVA_SCALEX,
            Y: 3 * CANVA_SCALEY,
            Width: 1 * CANVA_SCALEX,
            Height: 9 * CANVA_SCALEY,
        },
        {
            X: 25 * CANVA_SCALEX,
            Y: 4 * CANVA_SCALEY,
            Width: 1 * CANVA_SCALEX,
            Height: 8 * CANVA_SCALEY,
        },
        {
            X: 26 * CANVA_SCALEX,
            Y: 5 * CANVA_SCALEY,
            Width: 1 * CANVA_SCALEX,
            Height: 7 * CANVA_SCALEY,
        },
        {
            X: 27 * CANVA_SCALEX,
            Y: 6 * CANVA_SCALEY,
            Width: 1 * CANVA_SCALEX,
            Height: 6 * CANVA_SCALEY,
        },
        {
            X: 28 * CANVA_SCALEX,
            Y: 7 * CANVA_SCALEY,
            Width: 6 * CANVA_SCALEX,
            Height: 4 * CANVA_SCALEY,
        },
    ],
    Animations: {
        Idle: {
            FrameLengthInTime: Infinity,
            Frames: [0],
        },
        Destroyed: {
            FrameLengthInTime: 3 / 60,
            Frames: [2, 3, 4, 5, 6, 7, 8, 9],
        },
    },
};

export default Info;
