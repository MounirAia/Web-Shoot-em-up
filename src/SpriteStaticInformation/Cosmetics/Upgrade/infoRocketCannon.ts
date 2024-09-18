import { CANVA_SCALEX, CANVA_SCALEY } from '../../../ScreenConstant.js';
// The hitbox offset is computed based on the player sprite not the sprite of the cannon.
// Thus it is equal to the spriteshift position of the cannon.
const Info = {
    Level1: {
        Meta: {
            TileDimensions: {
                Width: 9,
                Height: 2,
            },
            RealDimension: {
                Width: 9 * CANVA_SCALEX,
                Height: 2 * CANVA_SCALEY,
            },
            SpriteShiftPosition: {
                X: 0 * CANVA_SCALEX,
                Y: 0 * CANVA_SCALEY,
            },
            SpriteShiftPositionOnPlayer: {
                Cannon1: { X: 25 * CANVA_SCALEX, Y: 4 * CANVA_SCALEY },
            },
        },
        Hitbox: [
            {
                X: 25 * CANVA_SCALEX,
                Y: 4 * CANVA_SCALEY,
                Width: 9 * CANVA_SCALEX,
                Height: 2 * CANVA_SCALEY,
            },
        ],
        Animations: {
            Idle: {
                FrameLengthInTime: Infinity,
                Frames: [0],
            },
        },
    },
    Level2: {
        Meta: {
            TileDimensions: {
                Width: 12,
                Height: 2,
            },
            RealDimension: {
                Width: 12 * CANVA_SCALEX,
                Height: 2 * CANVA_SCALEY,
            },
            SpriteShiftPosition: {
                X: 0 * CANVA_SCALEX,
                Y: 0 * CANVA_SCALEY,
            },
            SpriteShiftPositionOnPlayer: {
                Cannon1: { X: 22 * CANVA_SCALEX, Y: 0 * CANVA_SCALEY },
            },
        },
        Hitbox: [
            {
                X: 22 * CANVA_SCALEX,
                Y: 0 * CANVA_SCALEY,
                Width: 12 * CANVA_SCALEX,
                Height: 2 * CANVA_SCALEY,
            },
        ],
        Animations: {
            Idle: {
                FrameLengthInTime: Infinity,
                Frames: [0],
            },
        },
    },
};

export default Info;
