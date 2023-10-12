import { IServiceImageLoader } from '../../../../ImageLoader.js';
import { CANVA_SCALEX, CANVA_SCALEY, canvas } from '../../../../ScreenConstant.js';
import { ServiceLocator } from '../../../../ServiceLocator.js';
import InfoFuelChargeShot from '../../../../StatsJSON/SpriteInfo/Skills/infoFuelChargeShot.js';
import { IServiceWaveManager } from '../../../../WaveManager/WaveManager.js';
import { IGeneratedSprite, IServiceGeneratedSpritesManager } from '../../../GeneratedSpriteManager.js';
import { IServicePlayer } from '../../../Player.js';
import { Sprite } from '../../../Sprite.js';
import { CollideScenario, RectangleHitbox } from '../../../SpriteHitbox.js';
import { ISkill, PossibleSkillName, SkillsTypeName } from '../../Skills.js';
import { FuelChargeShotLaserLevel1 } from './FuelChargeShotLaser.js';

class FuelChargeShotLevel1 extends Sprite implements IGeneratedSprite {
    Generator: 'player' | 'enemy';
    Category: 'projectile' | 'nonProjectile';
    CurrentHitbox: RectangleHitbox[];
    Collide: Map<CollideScenario, (param?: unknown) => void>;

    constructor() {
        super(
            ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').GetImage(
                'images/Skills/FuelChargeShot/FrameLevel1.png',
            ),
            InfoFuelChargeShot.Level1.Frame.Meta.TileDimensions.Width,
            InfoFuelChargeShot.Level1.Frame.Meta.TileDimensions.Height,
            0,
            0,
            InfoFuelChargeShot.Level1.Frame.Meta.SpriteShiftPosition.X,
            InfoFuelChargeShot.Level1.Frame.Meta.SpriteShiftPosition.Y,
            CANVA_SCALEX,
            CANVA_SCALEY,
            InfoFuelChargeShot.Level1.Frame.Meta.RealDimension.Width,
            InfoFuelChargeShot.Level1.Frame.Meta.RealDimension.Height,
        );

        const { X, Y } = this.frameSpawn();
        this.X = X;
        this.Y = Y;

        this.Generator = 'player';
        this.Category = 'nonProjectile';
        this.CurrentHitbox = RectangleHitbox.NoHitbox;
        this.Collide = new Map();

        const { Destroyed, Spawning, Generating } = InfoFuelChargeShot.Level1.Frame.Animations;

        this.AnimationsController.AddAnimation({
            animation: 'spawning',
            frames: Spawning.Frames,
            framesLengthInTime: Spawning.FrameLengthInTime,
            afterPlayingAnimation: () => {
                this.AnimationsController.PlayAnimation({ animation: 'generating' });
            },
        });

        this.AnimationsController.AddAnimation({
            animation: 'generating',
            frames: Generating.Frames,
            framesLengthInTime: Generating.FrameLengthInTime,
            afterPlayingAnimation: () => {
                this.AnimationsController.PlayAnimation({ animation: 'destroyed' });
            },
        });

        this.AnimationsController.AddAnimation({
            animation: 'destroyed',
            frames: Destroyed.Frames,
            framesLengthInTime: Destroyed.FrameLengthInTime,
            beforePlayingAnimation: () => {
                const { X: offsetXOnFrame, Y: offsetYOnFrame } =
                    InfoFuelChargeShot.Level1.Laser.Meta.SpriteShiftPositionOnFrame;
                ServiceLocator.GetService<IServiceGeneratedSpritesManager>('GeneratedSpritesManager').AddSprite(
                    new FuelChargeShotLaserLevel1({ X: this.X + offsetXOnFrame, Y: this.Y + offsetYOnFrame }),
                );
            },
            afterPlayingAnimation: () => {
                const { X, Y } = this.frameSpawn();
                this.X = X;
                this.Y = Y;

                this.AnimationsController.PlayAnimation({ animation: 'spawning' });
            },
        });

        this.AnimationsController.PlayAnimation({ animation: 'spawning' });
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    UpdateHitboxes(dt: number) {}

    private frameSpawn(): { X: number; Y: number } {
        const screenWidthProportion = 50 / 100;
        const X = Math.random() * (canvas.width * screenWidthProportion);
        const Y =
            ServiceLocator.GetService<IServiceWaveManager>('WaveManager').GetARandomEnemy()?.Y || canvas.height / 2;
        return { X, Y };
    }
}

export class FuelChargeShotSkill implements ISkill {
    Type: SkillsTypeName;
    SkillName: PossibleSkillName;

    constructor() {
        this.Type = 'support';
        this.SkillName = 'FuelChargeShot';
    }

    Effect() {
        const skillLevel = ServiceLocator.GetService<IServicePlayer>('Player').SupportSkillLevel;

        const cannon: IGeneratedSprite | undefined = new FuelChargeShotLevel1();

        if (skillLevel === 1) {
        } else if (skillLevel === 2) {
        } else if (skillLevel === 3) {
        }

        if (cannon) {
            ServiceLocator.GetService<IServiceGeneratedSpritesManager>('GeneratedSpritesManager').AddSprite(cannon);
        }
    }
}
