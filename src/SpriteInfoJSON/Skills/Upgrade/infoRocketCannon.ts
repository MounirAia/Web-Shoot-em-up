import { CANVA_SCALEX, CANVA_SCALEY } from '../../../ScreenConstant';

const Info = {
    Level1: {
        Meta: {
            TileDimensions: {
                Width: 8,
                Height: 8,
            },
            RealDimension: {
                Width: 3 * CANVA_SCALEX,
                Height: 5 * CANVA_SCALEY,
            },
            SpriteShiftPosition: {
                X: -3 * CANVA_SCALEX,
                Y: -1 * CANVA_SCALEY,
            },
            SpriteShiftPositionOnPlayer: {
                Cannon1: { X: 19 * CANVA_SCALEX, Y: -5 * CANVA_SCALEY },
            },
        },
        Hitbox: [
            {
                X: 0,
                Y: 0,
                Width: 3 * CANVA_SCALEX,
                Height: 5 * CANVA_SCALEY,
            },
        ],
        Animations: {
            Idle: {
                FrameLengthInTime: 1,
                Frames: [0],
            },
            Destroyed: {
                FrameLengthInTime: 6 / 60,
                Frames: [1, 2, 3],
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
                Width: 8 * CANVA_SCALEX,
                Height: 6 * CANVA_SCALEY,
            },
            SpriteShiftPosition: {
                X: -4 * CANVA_SCALEX,
                Y: -5 * CANVA_SCALEY,
            },
            SpriteShiftPositionOnPlayer: {
                Cannon1: { X: 14 * CANVA_SCALEX, Y: -6 * CANVA_SCALEY },
                Cannon2: { X: 14 * CANVA_SCALEX, Y: 12 * CANVA_SCALEY },
            },
        },
        Hitbox: [
            {
                X: 0,
                Y: 0,
                Width: 8 * CANVA_SCALEX,
                Height: 6 * CANVA_SCALEY,
            },
        ],
        Animations: {
            Idle: {
                FrameLengthInTime: 1,
                Frames: [0],
            },
            Destroyed: {
                FrameLengthInTime: 6 / 60,
                Frames: [1, 2, 3, 4],
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
                Width: 7 * CANVA_SCALEX,
                Height: 7 * CANVA_SCALEY,
            },
            SpriteShiftPosition: {
                X: -5 * CANVA_SCALEX,
                Y: -5 * CANVA_SCALEY,
            },
            SpriteShiftPositionOnPlayer: {
                Cannon1: { X: 14 * CANVA_SCALEX, Y: -7 * CANVA_SCALEY },
                Cannon2: { X: 14 * CANVA_SCALEX, Y: 12 * CANVA_SCALEX },
            },
        },
        Hitbox: [
            {
                X: 0,
                Y: 0,
                Width: 7 * CANVA_SCALEX,
                Height: 7 * CANVA_SCALEY,
            },
        ],
        Animations: {
            Idle: {
                FrameLengthInTime: 1,
                Frames: [0],
            },
            Destroyed: {
                FrameLengthInTime: 0.1,
                Frames: [1, 2, 3, 4],
            },
        },
    },
} as const;

export default Info;
