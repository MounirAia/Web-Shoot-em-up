import { IServiceImageLoader } from '../../../../ImageLoader';
import { CANVA_SCALEX, CANVA_SCALEY } from '../../../../ScreenConstant';
import { ServiceLocator } from '../../../../ServiceLocator';
import { GetSpriteStaticInformation } from '../../../../SpriteStaticInformation/SpriteStaticInformationManager';
import { IServiceWaveManager } from '../../../../WaveManager/WaveManager';
import { EnemyBulletGenerator } from '../../../Bullets/EnemyBulletGenerator';
import { IServiceGeneratedSpritesManager } from '../../../GeneratedSpriteManager';
import { Sprite } from '../../../Sprite';
import {
    CollideScenario,
    CreateHitboxesWithInfoFile,
    ISpriteWithHitboxes,
    RectangleHitbox,
} from '../../../SpriteHitbox';

const InfoCannon = GetSpriteStaticInformation({ sprite: 'BigDiamondEnemy' }).spriteInfo.Cannon;

const scale = 3;
export default class BigDiamondCannon extends Sprite implements ISpriteWithHitboxes {
    CurrentHitbox: RectangleHitbox[];
    Collide: Map<CollideScenario, (param?: unknown) => void>;
    private attackSpeed: number; // computed as shoot per second

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
            CANVA_SCALEX * scale,
            CANVA_SCALEY * scale,
            InfoCannon.Meta.RealDimension.Width,
            InfoCannon.Meta.RealDimension.Height,
        );

        const roundTier = ServiceLocator.GetService<IServiceWaveManager>('WaveManager').GetRoundTier();
        const DiamondStats = GetSpriteStaticInformation({ sprite: 'BigDiamondEnemy' }).stats[roundTier - 1];

        this.X += InfoCannon.OffsetOnFrame.X;
        this.Y += InfoCannon.OffsetOnFrame.Y;
        this.attackSpeed = DiamondStats['Attack Speed'];

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

        const timeTakenFor1Shoot = 1 / this.attackSpeed;
        const timeTakenFor1ShootingAnimationFrame = timeTakenFor1Shoot / Shooting.Frames.length;

        this.AnimationsController.AddAnimation({
            animation: 'shooting',
            frames: Shooting.Frames,
            framesLengthInTime: timeTakenFor1ShootingAnimationFrame,
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
                const enemyBulletGenerator = new EnemyBulletGenerator({
                    cannonX: this.X,
                    cannonY: this.Y,
                });
                const bullets = enemyBulletGenerator.GenerateBullet({
                    enemyTier: 'Tier3',
                });

                bullets.forEach((bullet) => {
                    ServiceLocator.GetService<IServiceGeneratedSpritesManager>('GeneratedSpritesManager').AddSprite(
                        bullet,
                    );
                });
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

    public UpdateCannon(parameters: { dt: number; bigDiamondX: number; bigDiamondY: number }): void {
        const { dt, bigDiamondX, bigDiamondY } = parameters;
        this.Update(dt);
        this.X = bigDiamondX + InfoCannon.OffsetOnFrame.X;
        this.Y = bigDiamondY + InfoCannon.OffsetOnFrame.Y;
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
