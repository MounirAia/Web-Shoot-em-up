import { CANVA_SCALEX, CANVA_SCALEY } from '../../../ScreenConstant.js';

const Info = {
    Level1: {
        Meta: {
            TileDimensions: {
                Width: 63,
                Height: 64,
            },
            RealDimension: {
                Width: 8 * CANVA_SCALEX,
                Height: 24 * CANVA_SCALEY,
            },
            SpriteShiftPosition: {
                X: -27 * CANVA_SCALEX,
                Y: -20 * CANVA_SCALEY,
            },
            SpriteShiftPositionOnPlayer: {
                X: 38 * CANVA_SCALEX,
                Y: -6 * CANVA_SCALEY,
            },
        },
        Hitbox: [{ X: 0, Y: 0, Width: 8 * CANVA_SCALEX, Height: 24 * CANVA_SCALEY }],
        Animations: {
            Idle: {
                FrameLengthInTime: 1,
                Frames: [0],
            },
            OnHit: {
                FrameLengthInTime: 3 / 60,
                Frames: [10],
            },
            Damaged: {
                FrameLengthInTime: Infinity,
                Frames: [0, 1, 2, 3],
            },
            Destroyed: {
                FrameLengthInTime: 3 / 60,
                Frames: [4, 5, 6, 7],
            },
            Spawning: {
                FrameLengthInTime: 3 / 60,
                Frames: [7, 8, 9, 3, 2, 1, 0],
            },
        },
    },
    Level2: {
        Meta: {
            TileDimensions: {
                Width: 63,
                Height: 64,
            },
            RealDimension: {
                Width: 8 * CANVA_SCALEX,
                Height: 24 * CANVA_SCALEY,
            },
            SpriteShiftPosition: {
                X: -27 * CANVA_SCALEX,
                Y: -20 * CANVA_SCALEY,
            },
            SpriteShiftPositionOnPlayer: {
                X: 38 * CANVA_SCALEX,
                Y: -6 * CANVA_SCALEY,
            },
        },
        Hitbox: [
            {
                X: 0,
                Y: 0,
                Width: 8 * CANVA_SCALEX,
                Height: 24 * CANVA_SCALEY,
            },
        ],
        Animations: {
            Idle: {
                FrameLengthInTime: 1,
                Frames: [0],
            },
            OnHit: {
                FrameLengthInTime: 1,
                Frames: [13],
            },
            Damaged: {
                FrameLengthInTime: Infinity,
                Frames: [0, 1, 2, 3, 4, 5],
            },
            Destroyed: {
                FrameLengthInTime: 0.1,
                Frames: [9, 10, 11, 12],
            },
            Spawning: {
                FrameLengthInTime: 0.05,
                Frames: [8, 7, 6, 5, 4, 3, 2, 1, 0],
            },
        },
    },
    Level3: {
        Meta: {
            TileDimensions: {
                Width: 63,
                Height: 64,
            },
            RealDimension: {
                Width: 8,
                Height: 24,
            },
            SpriteShiftPosition: {
                X: -27 * CANVA_SCALEX,
                Y: -20 * CANVA_SCALEY,
            },
            SpriteShiftPositionOnPlayer: {
                X: 38 * CANVA_SCALEX,
                Y: -6 * CANVA_SCALEY,
            },
        },
        Hitbox: {
            Width: 8,
            Height: 24,
        },
        Animations: {
            Idle: {
                FrameLengthInTime: 1,
                Frames: [0],
            },
            OnHit: {
                FrameLengthInTime: 1,
                Frames: [13],
            },
            Damaged: {
                FrameLengthInTime: 1,
                Frames: [1, 2, 3, 4, 5],
            },
            Destroyed: {
                FrameLengthInTime: 0.1,
                Frames: [9, 10, 11, 12],
            },
            Spawning: {
                FrameLengthInTime: 0.05,
                Frames: [8, 7, 6, 5, 4, 3, 2, 1, 0],
            },
        },
    },
    Portal: {
        Meta: {
            TileDimensions: {
                Width: 8,
                Height: 8,
            },
            RealDimension: {
                Width: 4,
                Height: 5,
            },
            SpriteShiftPosition: {
                X: -2 * CANVA_SCALEX,
                Y: -2 * CANVA_SCALEY,
            },
            SpriteShiftPositionOnMirror: [
                {
                    X: 2 * CANVA_SCALEX,
                    Y: -5 * CANVA_SCALEY,
                },
                {
                    X: 5 * CANVA_SCALEX,
                    Y: -2 * CANVA_SCALEY,
                },
                {
                    X: 7 * CANVA_SCALEX,
                    Y: 2 * CANVA_SCALEY,
                },
                {
                    X: 7 * CANVA_SCALEX,
                    Y: 7 * CANVA_SCALEY,
                },
                {
                    X: 7 * CANVA_SCALEX,
                    Y: 12 * CANVA_SCALEY,
                },
                {
                    X: 7 * CANVA_SCALEX,
                    Y: 17 * CANVA_SCALEY,
                },
                {
                    X: 5 * CANVA_SCALEX,
                    Y: 21 * CANVA_SCALEY,
                },
                {
                    X: 2 * CANVA_SCALEX,
                    Y: 23 * CANVA_SCALEY,
                },
                {
                    X: -1 * CANVA_SCALEX,
                    Y: 21 * CANVA_SCALEY,
                },
                {
                    X: -3 * CANVA_SCALEX,
                    Y: 17 * CANVA_SCALEY,
                },
                {
                    X: -3 * CANVA_SCALEX,
                    Y: 12 * CANVA_SCALEY,
                },
                {
                    X: -3 * CANVA_SCALEX,
                    Y: 7 * CANVA_SCALEY,
                },
                {
                    X: -3 * CANVA_SCALEX,
                    Y: 2 * CANVA_SCALEY,
                },
                {
                    X: -1 * CANVA_SCALEX,
                    Y: -2 * CANVA_SCALEY,
                },
            ],
        },
        Animations: {
            Idle: {
                FrameLengthInTime: 1,
                Frames: [0],
            },
            Detaching: {
                FrameLengthInTime: 0.1,
                Frames: [0, 1, 2, 3],
            },
            Attaching: {
                FrameLengthInTime: 0.05,
                Frames: [9, 10, 0],
            },
            Spawning: {
                FrameLengthInTime: 0.05,
                Frames: [4, 5, 6, 7, 8],
            },
        },
    },
};

export default Info;
