import { CANVA_SCALEX, CANVA_SCALEY, FRAME_RATE } from '../../ScreenConstant.js';

const Info = {
    Level1: {
        Meta: {
            TileDimensions: {
                Width: 9,
                Height: 9,
            },
            RealDimension: {
                Width: 3 * CANVA_SCALEX,
                Height: 3 * CANVA_SCALEY,
            },
            SpriteShiftPosition: {
                X: -3 * CANVA_SCALEX,
                Y: -3 * CANVA_SCALEY,
            },
        },
        Hitbox: [
            {
                X: 0 * CANVA_SCALEX,
                Y: 0 * CANVA_SCALEY,
                Width: 3 * CANVA_SCALEX,
                Height: 3 * CANVA_SCALEY,
            },
        ],
        Animations: {
            Spin: {
                FrameLengthInTime: 3 * (1 / FRAME_RATE),
                Frames: [0, 1, 2, 3],
            },
        },
    },
    Level2: {
        Meta: {
            TileDimensions: {
                Width: 9,
                Height: 9,
            },
            RealDimension: {
                Width: 9 * CANVA_SCALEX,
                Height: 9 * CANVA_SCALEY,
            },
            SpriteShiftPosition: {
                X: 0 * CANVA_SCALEX,
                Y: 0 * CANVA_SCALEX,
            },
        },
        Hitbox: [
            {
                X: 0 * CANVA_SCALEX,
                Y: 0 * CANVA_SCALEY,
                Width: 9 * CANVA_SCALEX,
                Height: 9 * CANVA_SCALEY,
            },
        ],
        Animations: {
            Spin: {
                FrameLengthInTime: 3 * (1 / FRAME_RATE),
                Frames: [0, 1, 2, 3],
            },
        },
    },
    Level3: {
        Meta: {
            TileDimensions: {
                Width: 9,
                Height: 9,
            },
            RealDimension: {
                Width: 9 * CANVA_SCALEX,
                Height: 9 * CANVA_SCALEY,
            },
            SpriteShiftPosition: {
                X: 0 * CANVA_SCALEX,
                Y: 0 * CANVA_SCALEX,
            },
        },
        Hitbox: [
            {
                X: 0 * CANVA_SCALEX,
                Y: 0 * CANVA_SCALEY,
                Width: 9 * CANVA_SCALEX,
                Height: 9 * CANVA_SCALEY,
            },
        ],
        Animations: {
            Spin: {
                FrameLengthInTime: 3 * (1 / FRAME_RATE),
                Frames: [0, 1, 2, 3],
            },
            Destroyed: {
                FrameLengthInTime: 3 * (1 / FRAME_RATE),
                Frames: [4, 5],
            },
        },
    },
};

export default Info;
