import { CANVA_SCALEX, CANVA_SCALEY } from '../../../../ScreenConstant';

const spriteSizeScale = 3;

const Info = {
    Meta: {
        TileDimensions: {
            Width: 32,
            Height: 32,
        },
        RealDimension: {
            Width: 7 * CANVA_SCALEX * spriteSizeScale,
            Height: 14 * CANVA_SCALEY * spriteSizeScale,
        },
        SpriteShiftPosition: {
            X: -13 * CANVA_SCALEX * spriteSizeScale,
            Y: -9 * CANVA_SCALEY * spriteSizeScale,
        },
    },
    Hitbox: [
        {
            X: 0 * CANVA_SCALEX * spriteSizeScale,
            Y: 2 * CANVA_SCALEY * spriteSizeScale,
            Width: 1 * CANVA_SCALEX * spriteSizeScale,
            Height: 10 * CANVA_SCALEY * spriteSizeScale,
        },
        {
            X: 1 * CANVA_SCALEX * spriteSizeScale,
            Y: 0 * CANVA_SCALEY * spriteSizeScale,
            Width: 4 * CANVA_SCALEX * spriteSizeScale,
            Height: 14 * CANVA_SCALEY * spriteSizeScale,
        },
        {
            X: 5 * CANVA_SCALEX * spriteSizeScale,
            Y: 2 * CANVA_SCALEY * spriteSizeScale,
            Width: 1 * CANVA_SCALEX * spriteSizeScale,
            Height: 10 * CANVA_SCALEY * spriteSizeScale,
        },
        {
            X: 6 * CANVA_SCALEX * spriteSizeScale,
            Y: 4 * CANVA_SCALEY * spriteSizeScale,
            Width: 1 * CANVA_SCALEX * spriteSizeScale,
            Height: 6 * CANVA_SCALEY * spriteSizeScale,
        },
    ],
    Animations: {
        Idle: {
            FrameLengthInTime: Infinity,
            Frames: [0],
        },
        Destroyed: {
            FrameLengthInTime: 3 / 60,
            Frames: [4, 5, 6, 7, 8, 9],
        },
        Damaged: {
            FrameLengthInTime: Infinity,
            Frames: [0, 1, 2, 3],
        },
    },
    Cannon: {
        Meta: {
            TileDimensions: {
                Width: 32,
                Height: 32,
            },
            RealDimension: {
                Width: 5 * CANVA_SCALEX * spriteSizeScale,
                Height: 6 * CANVA_SCALEY * spriteSizeScale,
            },
            SpriteShiftPosition: {
                X: -8 * CANVA_SCALEX * spriteSizeScale,
                Y: -13 * CANVA_SCALEY * spriteSizeScale,
            },
        },
        Hitbox: {
            Frame0: [
                {
                    X: 0,
                    Y: 2 * CANVA_SCALEY * spriteSizeScale,
                    Width: 1 * CANVA_SCALEX * spriteSizeScale,
                    Height: 2 * CANVA_SCALEY * spriteSizeScale,
                },
                {
                    X: 1 * CANVA_SCALEX * spriteSizeScale,
                    Y: 1 * CANVA_SCALEY * spriteSizeScale,
                    Width: 1 * CANVA_SCALEX * spriteSizeScale,
                    Height: 4 * CANVA_SCALEY * spriteSizeScale,
                },
                {
                    X: 2 * CANVA_SCALEX * spriteSizeScale,
                    Y: 0 * CANVA_SCALEY * spriteSizeScale,
                    Width: 3 * CANVA_SCALEX * spriteSizeScale,
                    Height: 6 * CANVA_SCALEY * spriteSizeScale,
                },
            ],
            Frame1: [
                {
                    X: 1 * CANVA_SCALEX * spriteSizeScale,
                    Y: 2 * CANVA_SCALEY * spriteSizeScale,
                    Width: 1 * CANVA_SCALEX * spriteSizeScale,
                    Height: 2 * CANVA_SCALEY * spriteSizeScale,
                },
                {
                    X: 2 * CANVA_SCALEX * spriteSizeScale,
                    Y: 1 * CANVA_SCALEY * spriteSizeScale,
                    Width: 1 * CANVA_SCALEX * spriteSizeScale,
                    Height: 4 * CANVA_SCALEY * spriteSizeScale,
                },
                {
                    X: 3 * CANVA_SCALEX * spriteSizeScale,
                    Y: 0 * CANVA_SCALEY * spriteSizeScale,
                    Width: 2 * CANVA_SCALEX * spriteSizeScale,
                    Height: 6 * CANVA_SCALEY * spriteSizeScale,
                },
            ],
            Frame2: [
                {
                    X: 2 * CANVA_SCALEX * spriteSizeScale,
                    Y: 2 * CANVA_SCALEY * spriteSizeScale,
                    Width: 1 * CANVA_SCALEX * spriteSizeScale,
                    Height: 2 * CANVA_SCALEY * spriteSizeScale,
                },
                {
                    X: 3 * CANVA_SCALEX * spriteSizeScale,
                    Y: 0 * CANVA_SCALEY * spriteSizeScale,
                    Width: 2 * CANVA_SCALEX * spriteSizeScale,
                    Height: 6 * CANVA_SCALEY * spriteSizeScale,
                },
            ],
            Frame3: [
                {
                    X: 4 * CANVA_SCALEX * spriteSizeScale,
                    Y: 0 * CANVA_SCALEY * spriteSizeScale,
                    Width: 1 * CANVA_SCALEX * spriteSizeScale,
                    Height: 6 * CANVA_SCALEY * spriteSizeScale,
                },
            ],
            Frame4: [
                {
                    X: 3 * CANVA_SCALEX * spriteSizeScale,
                    Y: 0 * CANVA_SCALEY * spriteSizeScale,
                    Width: 1 * CANVA_SCALEX * spriteSizeScale,
                    Height: 1 * CANVA_SCALEY * spriteSizeScale,
                },
                {
                    X: 3 * CANVA_SCALEX * spriteSizeScale,
                    Y: 5 * CANVA_SCALEY * spriteSizeScale,
                    Width: 1 * CANVA_SCALEX * spriteSizeScale,
                    Height: 1 * CANVA_SCALEY * spriteSizeScale,
                },
                {
                    X: 4 * CANVA_SCALEX * spriteSizeScale,
                    Y: 0 * CANVA_SCALEY * spriteSizeScale,
                    Width: 1 * CANVA_SCALEX * spriteSizeScale,
                    Height: 6 * CANVA_SCALEY * spriteSizeScale,
                },
            ],
        },
        Animations: {
            Idle: {
                FrameLengthInTime: Infinity,
                Frames: [0],
            },
            Shooting: {
                FrameLengthInTime: Infinity,
                Frames: [0, 1, 2, 3, 4],
            },
            Destroyed: {
                FrameLengthInTime: 3 / 60,
                Frames: [5, 6, 7, 8],
            },
        },
        OffsetOnFrame: {
            X: -5 * CANVA_SCALEX * spriteSizeScale,
            Y: 4 * CANVA_SCALEY * spriteSizeScale,
        },
    },
    Bullet: {
        Meta: {
            TileDimensions: {
                Width: 8,
                Height: 8,
            },
            RealDimension: {
                Width: 2 * CANVA_SCALEX * spriteSizeScale,
                Height: 2 * CANVA_SCALEY * spriteSizeScale,
            },
            SpriteShiftPosition: {
                X: -3 * CANVA_SCALEX * spriteSizeScale,
                Y: -3 * CANVA_SCALEY * spriteSizeScale,
            },
        },
        Hitbox: [
            {
                X: 0 * CANVA_SCALEX * spriteSizeScale,
                Y: 0 * CANVA_SCALEY * spriteSizeScale,
                Width: 2 * CANVA_SCALEX * spriteSizeScale,
                Height: 2 * CANVA_SCALEY * spriteSizeScale,
            },
        ],
        Animations: {
            Idle: {
                FrameLengthInTime: Infinity,
                Frames: [0],
            },
            Destroyed: {
                FrameLengthInTime: 1 / 60,
                Frames: [1, 2, 3, 4],
            },
        },
        OffsetOnCannon: {
            X: -2 * CANVA_SCALEX * spriteSizeScale,
            Y: 2 * CANVA_SCALEY * spriteSizeScale,
        },
    },
};

export default Info;
