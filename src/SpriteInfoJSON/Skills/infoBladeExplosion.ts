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
    SelectSkill: {
        Level1: {
            Meta: {
                TileDimensions: {
                    Width: 16,
                    Height: 16,
                },
                RealDimension: {
                    Width: 11 * CANVA_SCALEX,
                    Height: 12 * CANVA_SCALEY,
                },
                SpriteShiftPosition: {
                    X: -3 * CANVA_SCALEX,
                    Y: -2 * CANVA_SCALEY,
                },
                Description: 'Blades slice through enemies. Sharp action!',
                MoreDescription:
                    'When an enemy is destroyed, it generates 2 blades that go through enemies, dealing consistent damage.',
            },
        },
        Level2: {
            Meta: {
                TileDimensions: {
                    Width: 16,
                    Height: 16,
                },
                RealDimension: {
                    Width: 14 * CANVA_SCALEX,
                    Height: 16 * CANVA_SCALEY,
                },
                SpriteShiftPosition: {
                    X: -1 * CANVA_SCALEX,
                    Y: -0 * CANVA_SCALEY,
                },
                Description: 'Size matters!',
                MoreDescription: 'When an enemy is destroyed, it generates 2 larger blades that go through enemies.',
            },
        },
        Level3: {
            Meta: {
                TileDimensions: {
                    Width: 16,
                    Height: 16,
                },
                RealDimension: {
                    Width: 14 * CANVA_SCALEX,
                    Height: 14 * CANVA_SCALEY,
                },
                SpriteShiftPosition: {
                    X: -1 * CANVA_SCALEX,
                    Y: -1 * CANVA_SCALEY,
                },
                Description: 'Boomerang blades! Double trouble!',
                MoreDescription:
                    'When an enemy is destroyed, it generates 2 big blades with a boomerang effect, covering longer distances. Each enemy destroyed by the spinning blades boosts their damage.',
            },
        },
    },
};

export default Info;
