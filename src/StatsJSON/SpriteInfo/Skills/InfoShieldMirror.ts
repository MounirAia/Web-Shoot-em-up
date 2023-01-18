const Info = {
    Level1: {
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
                X: 27,
                Y: 20,
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
                Frames: [10],
            },
            Damaged: {
                FrameLengthInTime: 1,
                Frames: [0, 1, 2, 3],
            },
            Destroyed: {
                FrameLengthInTime: 0.1,
                Frames: [4, 5, 6, 7],
            },
            Spawning: {
                FrameLengthInTime: 0.05,
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
                Width: 8,
                Height: 24,
            },
            SpriteShiftPosition: {
                X: 27,
                Y: 20,
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
                X: 27,
                Y: 20,
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
                X: 2,
                Y: 2,
            },
            SpriteShiftPositionOnMirror: [
                {
                    X: 2,
                    Y: -5,
                },
                {
                    X: 5,
                    Y: -2,
                },
                {
                    X: 7,
                    Y: 2,
                },
                {
                    X: 7,
                    Y: 7,
                },
                {
                    X: 7,
                    Y: 12,
                },
                {
                    X: 7,
                    Y: 17,
                },
                {
                    X: 5,
                    Y: 21,
                },
                {
                    X: 2,
                    Y: 23,
                },
                {
                    X: -1,
                    Y: 21,
                },
                {
                    X: -3,
                    Y: 17,
                },
                {
                    X: -3,
                    Y: 12,
                },
                {
                    X: -3,
                    Y: 7,
                },
                {
                    X: -3,
                    Y: 2,
                },
                {
                    X: -1,
                    Y: -2,
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
} as const;

export default Info;
