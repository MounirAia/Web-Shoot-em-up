import { CANVA_SCALEX, CANVA_SCALEY } from '../../../ScreenConstant.js';

const Info = {
    Level1: {
        Frame: {
            Meta: {
                TileDimensions: {
                    Width: 16,
                    Height: 16,
                },
                RealDimension: {
                    Width: 7 * CANVA_SCALEX,
                    Height: 13 * CANVA_SCALEY,
                },
                SpriteShiftPosition: {
                    X: -6 * CANVA_SCALEX,
                    Y: -8 * CANVA_SCALEY,
                },
            },
            Hitbox: [{}],
            Animations: {
                Spawning: {
                    FrameLengthInTime: 3 / 60,
                    Frames: [0, 1, 2, 3],
                },
                Generating: {
                    FrameLengthInTime: 3 / 60,
                    Frames: [4, 5, 6, 7],
                },
                Destroyed: {
                    FrameLengthInTime: 3 / 60,
                    Frames: [8, 9, 10, 11],
                },
            },
        },
        Laser: {
            Meta: {
                TileDimensions: {
                    Width: 16,
                    Height: 16,
                },
                RealDimension: {
                    Width: 11 * CANVA_SCALEX,
                    Height: 8 * CANVA_SCALEY,
                },
                SpriteShiftPosition: {
                    X: -3 * CANVA_SCALEX,
                    Y: -4 * CANVA_SCALEY,
                },
                SpriteShiftPositionOnFrame: {
                    X: 10 * CANVA_SCALEX,
                    Y: -3 * CANVA_SCALEY,
                },
            },
            Hitbox: [
                {
                    X: 0,
                    Y: 0,
                    Width: 11 * CANVA_SCALEX,
                    Height: 8 * CANVA_SCALEX,
                },
            ],
            Animations: {
                Idle: {
                    FrameLengthInTime: 3 / 60,
                    Frames: [0, 1, 2],
                },
                Destroyed: {
                    FrameLengthInTime: 3 / 60,
                    Frames: [3, 4, 5],
                },
            },
        },
    },
    Level2: {
        Frame: {
            Meta: {
                TileDimensions: {
                    Width: 32,
                    Height: 32,
                },
                RealDimension: {
                    Width: 8 * CANVA_SCALEX,
                    Height: 15 * CANVA_SCALEY,
                },
                SpriteShiftPosition: {
                    X: -11 * CANVA_SCALEX,
                    Y: -14 * CANVA_SCALEY,
                },
            },
            Hitbox: [{}],
            Animations: {
                Spawning: {
                    FrameLengthInTime: 3 / 60,
                    Frames: [0, 1, 2, 3, 4],
                },
                Generating: {
                    FrameLengthInTime: 3 / 60,
                    Frames: [5, 6, 7, 8],
                },
                Destroyed: {
                    FrameLengthInTime: 3 / 60,
                    Frames: [9, 10, 11, 12],
                },
            },
        },
        Laser: {
            Meta: {
                TileDimensions: {
                    Width: 32,
                    Height: 32,
                },
                RealDimension: {
                    Width: 14 * CANVA_SCALEX,
                    Height: 10 * CANVA_SCALEY,
                },
                SpriteShiftPosition: {
                    X: -10 * CANVA_SCALEX,
                    Y: -12 * CANVA_SCALEY,
                },
                SpriteShiftPositionOnFrame: {
                    X: 10 * CANVA_SCALEX,
                    Y: -3 * CANVA_SCALEY,
                },
            },
            Hitbox: [
                {
                    X: 0,
                    Y: 0,
                    Width: 13 * CANVA_SCALEX,
                    Height: 13 * CANVA_SCALEY,
                },
            ],
            Animations: {
                Idle: {
                    FrameLengthInTime: 3 / 60,
                    Frames: [0, 1, 2],
                },
            },
        },
    },
    Level3: {
        Frame: {
            Meta: {
                TileDimensions: {
                    Width: 32,
                    Height: 32,
                },
                RealDimension: {
                    Width: 21 * CANVA_SCALEX,
                    Height: 24 * CANVA_SCALEY,
                },
                SpriteShiftPosition: {
                    X: -12 * CANVA_SCALEX,
                    Y: -12 * CANVA_SCALEY,
                },
            },
            Hitbox: [{}],
            Animations: {
                Spawning: {
                    FrameLengthInTime: 3 / 60,
                    Frames: [0, 1, 2, 3, 4],
                },
                Generating: {
                    FrameLengthInTime: 3 / 60,
                    Frames: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
                },
                Destroyed: {
                    FrameLengthInTime: 3 / 60,
                    Frames: [15, 16, 17, 18, 19],
                },
            },
        },
        Laser: {
            Meta: {
                TileDimensions: {
                    Width: 32,
                    Height: 32,
                },
                RealDimension: {
                    Width: 13 * CANVA_SCALEX,
                    Height: 18 * CANVA_SCALEY,
                },
                SpriteShiftPosition: {
                    X: -10 * CANVA_SCALEX,
                    Y: -14 * CANVA_SCALEY,
                },
                SpriteShiftPositionOnFrame: {
                    X: 17 * CANVA_SCALEX,
                    Y: 2 * CANVA_SCALEY,
                },
            },
            Hitbox: [
                {
                    X: 0,
                    Y: 0,
                    Width: 15 * CANVA_SCALEX,
                    Height: 18 * CANVA_SCALEY,
                },
            ],
            Animations: {
                Idle: {
                    FrameLengthInTime: 3 / 60,
                    Frames: [0, 1, 2, 3],
                },
                Destroyed: {
                    FrameLengthInTime: 3 / 60,
                    Frames: [4, 5, 6, 7, 8, 9, 10],
                },
            },
        },
    },
};

export default Info;
