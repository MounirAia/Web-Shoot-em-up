import { CANVA_SCALEX, CANVA_SCALEY, FRAME_RATE } from '../../ScreenConstant.js';

const Info = {
    Level1: {
        Meta: {
            TileDimensions: {
                Width: 16,
                Height: 16,
            },
            RealDimension: {
                Width: 3 * CANVA_SCALEX,
                Height: 5 * CANVA_SCALEY,
            },
            SpriteShiftPosition: {
                X: -6 * CANVA_SCALEX,
                Y: -5 * CANVA_SCALEY,
            },
            SpriteShiftPositionOnPlayer: {
                Up: { X: 19 * CANVA_SCALEX, Y: -5 * CANVA_SCALEY },
            },
        },
        Hitbox: {
            Frame0: [
                { Width: 1 * CANVA_SCALEX, Height: 1 * CANVA_SCALEY, X: 0 * CANVA_SCALEX, Y: -1 * CANVA_SCALEY },
                { Width: 2 * CANVA_SCALEX, Height: 3 * CANVA_SCALEY, X: 1 * CANVA_SCALEX, Y: 0 * CANVA_SCALEY },
                { Width: 1 * CANVA_SCALEX, Height: 1 * CANVA_SCALEY, X: 0 * CANVA_SCALEX, Y: 3 * CANVA_SCALEY },
            ],
            Frame1: [{ Width: 7 * CANVA_SCALEX, Height: 9 * CANVA_SCALEY, X: -2 * CANVA_SCALEX, Y: -3 * CANVA_SCALEY }],
            Frame2: [
                { Width: 9 * CANVA_SCALEX, Height: 11 * CANVA_SCALEY, X: -3 * CANVA_SCALEX, Y: -4 * CANVA_SCALEY },
            ],
        },
        Animations: {
            Idle: {
                FrameLengthInTime: 1,
                Frames: [0],
            },
            Destroyed: {
                FrameLengthInTime: 1 / FRAME_RATE,
                Frames: [0, 1, 2, 3, 4, 5],
            },
        },
    },
    Level2: {
        Meta: {
            TileDimensions: {
                Width: 16,
                Height: 16,
            },
            RealDimension: {
                Width: 6 * CANVA_SCALEX,
                Height: 3 * CANVA_SCALEY,
            },
            SpriteShiftPosition: {
                X: -5 * CANVA_SCALEX,
                Y: -6 * CANVA_SCALEX,
            },
            SpriteShiftPositionOnPlayer: {
                Up: { X: 19 * CANVA_SCALEX, Y: -5 * CANVA_SCALEY },
                Down: { X: 19 * CANVA_SCALEX, Y: 12 * CANVA_SCALEY },
            },
        },
        Hitbox: {
            Frame0: [
                { Width: 1 * CANVA_SCALEX, Height: 1 * CANVA_SCALEY, X: -1 * CANVA_SCALEX, Y: 2 * CANVA_SCALEY },
                { Width: 4 * CANVA_SCALEX, Height: 3 * CANVA_SCALEY, X: 0 * CANVA_SCALEX, Y: 1 * CANVA_SCALEY },
                { Width: 1 * CANVA_SCALEX, Height: 1 * CANVA_SCALEY, X: 4 * CANVA_SCALEX, Y: 2 * CANVA_SCALEY },
            ],
            Frame1: [
                { Width: 12 * CANVA_SCALEX, Height: 13 * CANVA_SCALEY, X: -4 * CANVA_SCALEX, Y: -4 * CANVA_SCALEY },
            ],
            Frame2: [
                { Width: 14 * CANVA_SCALEX, Height: 15 * CANVA_SCALEY, X: -5 * CANVA_SCALEX, Y: -5 * CANVA_SCALEY },
            ],
        },
        Animations: {
            Idle: {
                FrameLengthInTime: 1,
                Frames: [0],
            },
            Destroyed: {
                FrameLengthInTime: 1 / FRAME_RATE,
                Frames: [0, 1, 2, 3, 4],
            },
        },
    },
    Level3: {
        Meta: {
            TileDimensions: {
                Width: 16,
                Height: 16,
            },
            RealDimension: {
                Width: 9 * CANVA_SCALEX,
                Height: 4 * CANVA_SCALEY,
            },
            SpriteShiftPosition: {
                X: -4 * CANVA_SCALEX,
                Y: -6 * CANVA_SCALEY,
            },
            SpriteShiftPositionOnPlayer: {
                Up: { X: 19 * CANVA_SCALEX, Y: -5 * CANVA_SCALEY },
                Down: { X: 19 * CANVA_SCALEX, Y: 12 * CANVA_SCALEY },
            },
        },
        Hitbox: {
            Frame0: [
                { Width: 1 * CANVA_SCALEX, Height: 2 * CANVA_SCALEY, X: 0 * CANVA_SCALEX, Y: 1 * CANVA_SCALEY },
                { Width: 5 * CANVA_SCALEX, Height: 1 * CANVA_SCALEY, X: 2 * CANVA_SCALEX, Y: -1 * CANVA_SCALEY },
                { Width: 7 * CANVA_SCALEX, Height: 4 * CANVA_SCALEY, X: 1 * CANVA_SCALEX, Y: 0 * CANVA_SCALEY },
                { Width: 5 * CANVA_SCALEX, Height: 1 * CANVA_SCALEY, X: 2 * CANVA_SCALEX, Y: 4 * CANVA_SCALEY },
                { Width: 1 * CANVA_SCALEX, Height: 2 * CANVA_SCALEY, X: 8 * CANVA_SCALEX, Y: 1 * CANVA_SCALEY },
            ],
            Frame1: [
                { Width: 15 * CANVA_SCALEX, Height: 13 * CANVA_SCALEY, X: -3 * CANVA_SCALEX, Y: -4 * CANVA_SCALEY },
            ],
            Frame2: [
                { Width: 16 * CANVA_SCALEX, Height: 16 * CANVA_SCALEY, X: -4 * CANVA_SCALEX, Y: -6 * CANVA_SCALEY },
            ],
        },
        Animations: {
            Idle: {
                FrameLengthInTime: 1,
                Frames: [0],
            },
            Destroyed: {
                FrameLengthInTime: 1 / FRAME_RATE,
                Frames: [0, 1, 2, 3, 4, 5],
            },
        },
    },
    SubProjectile: {
        Meta: {
            TileDimensions: {
                Width: 16,
                Height: 16,
            },
            RealDimension: {
                Width: 3 * CANVA_SCALEX,
                Height: 2 * CANVA_SCALEY,
            },
            SpriteShiftPosition: {
                X: -6 * CANVA_SCALEX,
                Y: -7 * CANVA_SCALEY,
            },
            SpriteSpawnPosition: {
                Projectile1: {
                    X: 3 * CANVA_SCALEX,
                    Y: 0 * CANVA_SCALEY,
                },
                Projectile2: {
                    X: 3 * CANVA_SCALEX,
                    Y: 4 * CANVA_SCALEY,
                },
            },
        },
        Hitbox: {
            Frame0: [{ Width: 3 * CANVA_SCALEX, Height: 2 * CANVA_SCALEY, X: 0 * CANVA_SCALEX, Y: 0 * CANVA_SCALEX }],
        },
        Animations: {
            Idle: {
                FrameLengthInTime: 1,
                Frames: [0],
            },
            Destroyed: {
                FrameLengthInTime: 1 / FRAME_RATE,
                Frames: [0, 1, 2, 3, 4],
            },
        },
    },
};

export default Info;
