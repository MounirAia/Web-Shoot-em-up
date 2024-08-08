import { CANVA_SCALEX, CANVA_SCALEY } from '../../../../ScreenConstant.js';

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
    Portal: {
        Meta: {
            TileDimensions: {
                Width: 32,
                Height: 32,
            },
            RealDimension: {
                Short: {
                    Width: 4 * CANVA_SCALEX,
                    Height: 5 * CANVA_SCALEY,
                },
                Long: {
                    Width: 4 * CANVA_SCALEX,
                    Height: 24 * CANVA_SCALEY,
                },
            },
            SpriteShiftPosition: {
                X: -4 * CANVA_SCALEX,
                Y: -4 * CANVA_SCALEY,
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
                FrameLengthInTime: Infinity,
                Frames: [0],
            },
            Detaching: {
                FrameLengthInTime: 6 / 60,
                Frames: [1, 2, 3],
            },
            Attaching: {
                FrameLengthInTime: 6 / 60,
                Frames: [4, 5, 0],
            },
            Spawning: {
                FrameLengthInTime: 3 / 60,
                Frames: [6, 7, 8, 9, 10, 11, 12, 13, 14],
            },
            Generating: {
                FrameLengthInTime: 6 / 60,
                Frames: [15, 16, 17],
            },
            Disappearing: {
                FrameLengthInTime: 3 / 60,
                Frames: [14, 13, 12, 11, 10, 1, 2, 3],
            },
        },
    },
    ExplosiveEntity: {
        Meta: {
            TileDimensions: {
                Width: 8,
                Height: 8,
            },
            RealDimension: {
                Width: 6 * CANVA_SCALEX,
                Height: 5 * CANVA_SCALEY,
            },
            SpriteShiftPosition: {
                X: -1 * CANVA_SCALEX,
                Y: -1 * CANVA_SCALEY,
            },
        },
        Hitbox: [
            {
                X: 0,
                Y: 0,
                Width: 6 * CANVA_SCALEX,
                Height: 5 * CANVA_SCALEY,
            },
        ],
        Animations: {
            Idle: {
                FrameLengthInTime: Infinity,
                Frames: [0],
            },
            Destroyed: {
                FrameLengthInTime: 3 / 60,
                Frames: [1, 2, 3],
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
                    Width: 12 * CANVA_SCALEX,
                    Height: 14 * CANVA_SCALEY,
                },
                SpriteShiftPosition: {
                    X: -3 * CANVA_SCALEX,
                    Y: -1 * CANVA_SCALEY,
                },
                Description: 'Mirror shield! Reflective and protective!',
                MoreDescription:
                    "A mirror spawns in front of the player, acting as a shield against enemies' projectiles. When destroyed, it goes on cooldown.",
            },
        },
        Level2: {
            Meta: {
                TileDimensions: {
                    Width: 16,
                    Height: 16,
                },
                RealDimension: {
                    Width: 12 * CANVA_SCALEX,
                    Height: 14 * CANVA_SCALEY,
                },
                SpriteShiftPosition: {
                    X: -3 * CANVA_SCALEX,
                    Y: -1 * CANVA_SCALEY,
                },
                Description: 'Mirror zaps enemies! Shockingly good!',
                MoreDescription:
                    'The mirror generates a thunder beam towards enemies upon being hit, inflicting damage.',
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
                    Height: 16 * CANVA_SCALEY,
                },
                SpriteShiftPosition: {
                    X: -1 * CANVA_SCALEX,
                    Y: -0 * CANVA_SCALEY,
                },
                Description: 'Mirror zaps and portals! Explosive fun!',
                MoreDescription:
                    'The mirror has tiny portals attached to it. After a few seconds, the portals disappear randomly, releasing small projectiles that target enemies and explode, causing damage.',
            },
        },
    },
};

export default Info;
