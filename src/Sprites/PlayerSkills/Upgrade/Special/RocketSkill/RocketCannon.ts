import { IServiceImageLoader } from '../../../../../ImageLoader.js';
import { CANVA_SCALEX, CANVA_SCALEY } from '../../../../../ScreenConstant.js';
import { ServiceLocator } from '../../../../../ServiceLocator.js';
import InfoRocketCannon from '../../../../../SpriteInfoJSON/Skills/Upgrade/infoRocketCannon.js';
import { IServicePlayer } from '../../../../Player.js';
import { Sprite } from '../../../../Sprite.js';
import {
    CollideScenario,
    CreateHitboxesWithInfoFile,
    ISpriteWithHitboxes,
    RectangleHitbox,
} from '../../../../SpriteHitbox.js';

import InfoPlayer from '../../../../../SpriteInfoJSON/Player/infoPlayer.js';

export class RocketCannonLevel1 extends Sprite implements ISpriteWithHitboxes {
    CurrentHitbox: RectangleHitbox[];
    private offsetXOnSprite: number;
    private offsetYOnSprite: number;

    Collide: Map<CollideScenario, (param?: unknown) => void>;

    constructor(parameters: { X: number; Y: number; offsetXOnPlayer: number; offsetYOnPlayer: number }) {
        const { X, Y, offsetXOnPlayer, offsetYOnPlayer } = parameters;
        super(
            ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').GetImage(
                'images/Skills/Upgrade/Rocket/Level1.png',
            ),
            InfoRocketCannon.Level1.Meta.TileDimensions.Width,
            InfoRocketCannon.Level1.Meta.TileDimensions.Height,
            X,
            Y,
            InfoRocketCannon.Level1.Meta.SpriteShiftPosition.X,
            InfoRocketCannon.Level1.Meta.SpriteShiftPosition.Y,
            CANVA_SCALEX,
            CANVA_SCALEY,
            InfoRocketCannon.Level1.Meta.RealDimension.Width,
            InfoRocketCannon.Level1.Meta.RealDimension.Height,
        );

        this.offsetXOnSprite = offsetXOnPlayer;
        this.offsetYOnSprite = offsetYOnPlayer;

        this.CurrentHitbox = CreateHitboxesWithInfoFile(this.X, this.Y, [...InfoRocketCannon.Level1.Hitbox]);

        const { Idle, Destroyed } = InfoRocketCannon.Level1.Animations;
        const { Destroyed: PlayerDestroyed } = InfoPlayer.Animations;

        this.AnimationsController.AddAnimation({
            animation: 'idle',
            frames: Idle.Frames,
            framesLengthInTime: Idle.FrameLengthInTime,
        });

        this.AnimationsController.AddAnimation({
            animation: 'destroyed',
            frames: Destroyed.Frames,
            framesLengthInTime: PlayerDestroyed.FrameLengthInTime,
        });

        this.Collide = new Map();
        this.Collide.set('WithProjectile', () => {
            this.StatesController.PlayState({ stateName: 'onHit' });
        });

        this.Collide.set('WithEnemy', () => {
            const playerInvulnerabilityTimePeriod =
                ServiceLocator.GetService<IServicePlayer>('Player').InvulnerabilityTimePeriod;
            this.StatesController.PlayState({ stateName: 'onInvulnerable', duration: playerInvulnerabilityTimePeriod });
        });

        this.AnimationsController.PlayAnimation({ animation: 'idle' });
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    UpdateHitboxes(dt: number) {}

    Update(dt: number) {
        super.Update(dt);

        const { x: playerX, y: playerY } = ServiceLocator.GetService<IServicePlayer>('Player').Coordinate();
        this.X = playerX + this.offsetXOnSprite;
        this.Y = playerY + this.offsetYOnSprite;
    }

    Draw(ctx: CanvasRenderingContext2D): void {
        super.Draw(ctx);
    }
}

export class RocketCannonLevel2 extends Sprite implements ISpriteWithHitboxes {
    CurrentHitbox: RectangleHitbox[];
    private offsetXOnSprite: number;
    private offsetYOnSprite: number;

    Collide: Map<CollideScenario, (param?: unknown) => void>;

    constructor(parameters: {
        X: number;
        Y: number;
        offsetXOnPlayer: number;
        offsetYOnPlayer: number;
        direction: 'up' | 'down';
    }) {
        const { X, Y, offsetXOnPlayer, offsetYOnPlayer, direction } = parameters;
        super(
            ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').GetImage(
                'images/Skills/Upgrade/Rocket/Level2.png',
            ),
            InfoRocketCannon.Level2.Meta.TileDimensions.Width,
            InfoRocketCannon.Level2.Meta.TileDimensions.Height,
            X,
            Y,
            InfoRocketCannon.Level2.Meta.SpriteShiftPosition.X,
            InfoRocketCannon.Level2.Meta.SpriteShiftPosition.Y,
            CANVA_SCALEX,
            CANVA_SCALEY,
            InfoRocketCannon.Level2.Meta.RealDimension.Width,
            InfoRocketCannon.Level2.Meta.RealDimension.Height,
        );

        this.offsetXOnSprite = offsetXOnPlayer;
        this.offsetYOnSprite = offsetYOnPlayer;

        if (direction === 'up') {
            this.CurrentHitbox = CreateHitboxesWithInfoFile(this.X, this.Y, [
                ...InfoRocketCannon.Level2.Hitbox.Cannon1,
            ]);
        } else {
            this.CurrentHitbox = CreateHitboxesWithInfoFile(this.X, this.Y, [
                ...InfoRocketCannon.Level2.Hitbox.Cannon2,
            ]);
        }

        const { Idle, Destroyed } = InfoRocketCannon.Level2.Animations;
        const { Destroyed: PlayerDestroyed } = InfoPlayer.Animations;

        this.AnimationsController.AddAnimation({
            animation: 'idle',
            frames: Idle.Frames,
            framesLengthInTime: Idle.FrameLengthInTime,
        });

        this.AnimationsController.AddAnimation({
            animation: 'destroyed',
            frames: Destroyed.Frames,
            framesLengthInTime: PlayerDestroyed.FrameLengthInTime,
        });

        this.Collide = new Map();
        this.Collide.set('WithProjectile', () => {
            this.StatesController.PlayState({ stateName: 'onHit' });
        });

        this.Collide.set('WithEnemy', () => {
            const playerInvulnerabilityTimePeriod =
                ServiceLocator.GetService<IServicePlayer>('Player').InvulnerabilityTimePeriod;
            this.StatesController.PlayState({ stateName: 'onInvulnerable', duration: playerInvulnerabilityTimePeriod });
        });

        this.AnimationsController.PlayAnimation({ animation: 'idle' });
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    UpdateHitboxes(dt: number) {}

    Update(dt: number) {
        super.Update(dt);

        const { x: playerX, y: playerY } = ServiceLocator.GetService<IServicePlayer>('Player').Coordinate();
        this.X = playerX + this.offsetXOnSprite;
        this.Y = playerY + this.offsetYOnSprite;
    }

    Draw(ctx: CanvasRenderingContext2D): void {
        super.Draw(ctx);
    }
}

export class RocketCannonLevel3 extends Sprite implements ISpriteWithHitboxes {
    CurrentHitbox: RectangleHitbox[];
    private offsetXOnSprite: number;
    private offsetYOnSprite: number;
    private direction: 'up' | 'down';

    Collide: Map<CollideScenario, (param?: unknown) => void>;

    constructor(parameters: {
        X: number;
        Y: number;
        offsetXOnPlayer: number;
        offsetYOnPlayer: number;
        direction: 'up' | 'down';
    }) {
        const { X, Y, offsetXOnPlayer, offsetYOnPlayer, direction } = parameters;
        super(
            ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').GetImage(
                'images/Skills/Upgrade/Rocket/Level3.png',
            ),
            InfoRocketCannon.Level3.Meta.TileDimensions.Width,
            InfoRocketCannon.Level3.Meta.TileDimensions.Height,
            X,
            Y,
            InfoRocketCannon.Level3.Meta.SpriteShiftPosition.X,
            InfoRocketCannon.Level3.Meta.SpriteShiftPosition.Y,
            CANVA_SCALEX,
            CANVA_SCALEY,
            InfoRocketCannon.Level3.Meta.RealDimension.Width,
            InfoRocketCannon.Level3.Meta.RealDimension.Height,
        );

        this.offsetXOnSprite = offsetXOnPlayer;
        this.offsetYOnSprite = offsetYOnPlayer;
        this.direction = direction;

        if (this.direction === 'up') {
            this.CurrentHitbox = CreateHitboxesWithInfoFile(this.X, this.Y, [
                ...InfoRocketCannon.Level3.Hitbox.Cannon1,
            ]);
        } else {
            this.offsetYOnSprite = offsetYOnPlayer + InfoRocketCannon.Level3.Meta.RealDimension.Height;
            this.Y = -(Y + this.offsetYOnSprite);
            this.CurrentHitbox = CreateHitboxesWithInfoFile(this.X, this.Y, [
                ...InfoRocketCannon.Level3.Hitbox.Cannon2,
            ]);
        }

        const { Idle, Destroyed } = InfoRocketCannon.Level3.Animations;
        const { Destroyed: PlayerDestroyed } = InfoPlayer.Animations;

        this.AnimationsController.AddAnimation({
            animation: 'idle',
            frames: Idle.Frames,
            framesLengthInTime: Idle.FrameLengthInTime,
        });

        this.AnimationsController.AddAnimation({
            animation: 'destroyed',
            frames: Destroyed.Frames,
            framesLengthInTime: PlayerDestroyed.FrameLengthInTime,
        });

        this.Collide = new Map();
        this.Collide.set('WithProjectile', () => {
            this.StatesController.PlayState({ stateName: 'onHit' });
        });

        this.Collide.set('WithEnemy', () => {
            const playerInvulnerabilityTimePeriod =
                ServiceLocator.GetService<IServicePlayer>('Player').InvulnerabilityTimePeriod;
            this.StatesController.PlayState({ stateName: 'onInvulnerable', duration: playerInvulnerabilityTimePeriod });
        });

        this.AnimationsController.PlayAnimation({ animation: 'idle' });
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    UpdateHitboxes(dt: number) {}

    Update(dt: number) {
        super.Update(dt);

        const { x: playerX, y: playerY } = ServiceLocator.GetService<IServicePlayer>('Player').Coordinate();
        this.X = playerX + this.offsetXOnSprite;
        this.Y = playerY + this.offsetYOnSprite;

        if (this.direction == 'down') {
            this.Y = -this.Y;
        }
    }

    Draw(ctx: CanvasRenderingContext2D): void {
        if (this.direction == 'up') {
            super.Draw(ctx);
        } else {
            ctx.save();
            ctx.scale(1, -1);
            super.Draw(ctx);
            ctx.restore();
        }
    }
}
