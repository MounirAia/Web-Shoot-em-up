import { IServiceImageLoader } from '../../../../ImageLoader';
import { CANVA_SCALEX, CANVA_SCALEY } from '../../../../ScreenConstant';
import { ServiceLocator } from '../../../../ServiceLocator';
import { GetSpriteStaticInformation } from '../../../../SpriteStaticInformation/SpriteStaticInformationManager';
import { EnemyBullet } from '../../../Bullets/EnemyBullet';
import { IServiceGeneratedSpritesManager } from '../../../GeneratedSpriteManager';
import { Sprite } from '../../../Sprite';
import {
    CollideScenario,
    CreateHitboxesWithInfoFile,
    ISpriteWithHitboxes,
    RectangleHitbox,
} from '../../../SpriteHitbox';

const InfoCannon = GetSpriteStaticInformation({ sprite: 'SmallDiamondEnemy' }).spriteInfo.Cannon;

export default class SmallDiamondCannon extends Sprite implements ISpriteWithHitboxes {
    CurrentHitbox: RectangleHitbox[];
    Collide: Map<CollideScenario, (param?: unknown) => void>;

    constructor(x = 0, y = 0) {
        super(
            ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').GetImage(
                'images/Enemies/Diamond/SmallDiamondCannon.png',
            ),
            InfoCannon.Meta.TileDimensions.Width,
            InfoCannon.Meta.TileDimensions.Height,
            x,
            y,
            InfoCannon.Meta.SpriteShiftPosition.X,
            InfoCannon.Meta.SpriteShiftPosition.Y,
            CANVA_SCALEX,
            CANVA_SCALEY,
            InfoCannon.Meta.RealDimension.Width,
            InfoCannon.Meta.RealDimension.Height,
        );

        this.X += InfoCannon.OffsetOnFrame.X;
        this.Y += InfoCannon.OffsetOnFrame.Y;

        /* Hitbox */
        const Frame0Hitbox = CreateHitboxesWithInfoFile(this.X, this.Y, InfoCannon.Hitbox.Frame0);
        const Frame1Hitbox = CreateHitboxesWithInfoFile(this.X, this.Y, InfoCannon.Hitbox.Frame1);
        const Frame2Hitbox = CreateHitboxesWithInfoFile(this.X, this.Y, InfoCannon.Hitbox.Frame2);
        const Frame3Hitbox = CreateHitboxesWithInfoFile(this.X, this.Y, InfoCannon.Hitbox.Frame3);
        const Frame4Hitbox = CreateHitboxesWithInfoFile(this.X, this.Y, InfoCannon.Hitbox.Frame4);

        this.CurrentHitbox = [...Frame0Hitbox];

        this.Collide = new Map();

        this.Collide.set('WithProjectile', () => {
            this.StatesController.PlayState({ stateName: 'onHit' });
        });

        this.Collide.set('WithPlayer', () => {
            this.StatesController.PlayState({ stateName: 'onHit' });
            this.AnimationsController.PlayAnimation({ animation: 'destroyed' });
        });

        /* Animation */
        const { Idle, Destroyed, Shooting } = InfoCannon.Animations;
        this.AnimationsController.AddAnimation({
            animation: 'idle',
            frames: Idle.Frames,
            framesLengthInTime: Idle.FrameLengthInTime,
        });

        this.AnimationsController.AddAnimation({
            animation: 'destroyed',
            frames: Destroyed.Frames,
            framesLengthInTime: Destroyed.FrameLengthInTime,
            beforePlayingAnimation: () => {
                this.CurrentHitbox = RectangleHitbox.NoHitbox;
            },
        });

        this.AnimationsController.AddAnimation({
            animation: 'shooting',
            frames: Shooting.Frames,
            framesLengthInTime: Shooting.FrameLengthInTime,
            methodToPlayOnSpecificFrames: new Map([
                [
                    0,
                    () => {
                        this.CurrentHitbox = Frame0Hitbox;
                    },
                ],
                [
                    1,
                    () => {
                        this.CurrentHitbox = Frame1Hitbox;
                    },
                ],
                [
                    2,
                    () => {
                        this.CurrentHitbox = Frame2Hitbox;
                    },
                ],
                [
                    3,
                    () => {
                        this.CurrentHitbox = Frame3Hitbox;
                    },
                ],
                [
                    4,
                    () => {
                        this.CurrentHitbox = Frame4Hitbox;
                    },
                ],
            ]),
            afterPlayingAnimation: () => {
                const bullet = new EnemyBullet(this.X, this.Y);
                ServiceLocator.GetService<IServiceGeneratedSpritesManager>('GeneratedSpritesManager').AddSprite(bullet);
            },
        });

        this.AnimationsController.PlayAnimation({ animation: 'idle' });
    }

    UpdateHitboxes(dt: number) {
        this.CurrentHitbox.forEach((hitbox) => {
            hitbox.SpriteX = this.X;
            hitbox.SpriteY = this.Y;
        });
    }

    public UpdateCannon(parameters: { dt: number; smallDiamondX: number; smallDiamondY: number }): void {
        const { dt, smallDiamondX, smallDiamondY } = parameters;
        this.Update(dt);
        this.X = smallDiamondX + InfoCannon.OffsetOnFrame.X;
        this.Y = smallDiamondY + InfoCannon.OffsetOnFrame.Y;
        this.UpdateHitboxes(dt);
    }

    Update(dt: number): void {
        super.Update(dt);
    }

    public PlayCollisionMethod(parameters: { collisionScenario: CollideScenario; param?: unknown }) {
        const { collisionScenario } = parameters;
        this.Collide.get(collisionScenario)?.(parameters.param);
    }
}
