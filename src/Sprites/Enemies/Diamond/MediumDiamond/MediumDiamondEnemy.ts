import { IServiceEventManager } from '../../../../EventManager.js';
import { IServiceImageLoader } from '../../../../ImageLoader.js';
import { CANVA_SCALEX, CANVA_SCALEY } from '../../../../ScreenConstant.js';
import { ServiceLocator } from '../../../../ServiceLocator.js';
import { GetSpriteStaticInformation } from '../../../../SpriteStaticInformation/SpriteStaticInformationManager.js';
import { IServiceUtilManager } from '../../../../UtilManager.js';
import { LaneNumber } from '../../../../WaveManager/WaveEnemies/Lane.js';
import { IServiceWaveManager } from '../../../../WaveManager/WaveManager.js';
import { IServiceCollideManager } from '../../../CollideManager.js';
import { IServicePlayer } from '../../../Player.js';
import { Sprite } from '../../../Sprite.js';
import { ISpriteWithSpeed } from '../../../SpriteAttributes.js';
import { SpriteDamageResistancesController } from '../../../SpriteDamageResistancesController.js';
import { CollideScenario, CreateHitboxesWithInfoFile, RectangleHitbox } from '../../../SpriteHitbox.js';
import { IEnemy } from '../../IEnemy.js';
import MediumDiamondCannon from './MediumDiamondCannon.js';

const InfoMediumDiamond = GetSpriteStaticInformation({ sprite: 'MediumDiamondEnemy' }).spriteInfo;
const ConstantMediumDiamond = GetSpriteStaticInformation({ sprite: 'MediumDiamondEnemy' }).constant;

const scale = 2;
export class MediumDiamondEnemy extends Sprite implements IEnemy, ISpriteWithSpeed {
    private moneyValue: number;

    private laneNumber: LaneNumber;
    frameHitbox: RectangleHitbox[];
    Collide: Map<CollideScenario, (param?: unknown) => void>;
    readonly HorizontalShootingPosition: number;
    BaseSpeed: number;

    DamageResistancesController: SpriteDamageResistancesController;

    private cannon: MediumDiamondCannon;
    private baseHealth: number;
    private currentHealth: number;

    private canShoot: boolean;
    private reachedShootingPosition: boolean;

    constructor(x = 0, y = 0, horizontalShootingPosition: number, laneNumber: LaneNumber) {
        const imgDiamond = ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').GetImage(
            'images/Enemies/Diamond/SmallDiamondFrame.png',
        );
        const frameWidth = InfoMediumDiamond.Meta.TileDimensions.Width;
        const frameHeight = InfoMediumDiamond.Meta.TileDimensions.Height;
        const scaleX = CANVA_SCALEX * scale;
        const scaleY = CANVA_SCALEY * scale;
        super(
            imgDiamond,
            frameWidth,
            frameHeight,
            x,
            y,
            InfoMediumDiamond.Meta.SpriteShiftPosition.X,
            InfoMediumDiamond.Meta.SpriteShiftPosition.Y,
            scaleX,
            scaleY,
            InfoMediumDiamond.Meta.RealDimension.Width,
            InfoMediumDiamond.Meta.RealDimension.Height,
        );

        const roundTier = ServiceLocator.GetService<IServiceWaveManager>('WaveManager').GetRoundTier();
        const DiamondStats = GetSpriteStaticInformation({ sprite: 'MediumDiamondEnemy' }).stats[roundTier - 1];

        this.cannon = new MediumDiamondCannon(this.X, this.Y);

        // center in its spawn, because enemies are spawned in predefined positions
        this.X = this.X - this.Width / 2;
        this.Y = this.Y - this.Height / 2;

        this.laneNumber = laneNumber;
        this.moneyValue = ConstantMediumDiamond['Enemy Reward'];
        this.baseHealth = DiamondStats['Enemies Lifepoints'];
        this.currentHealth = this.baseHealth;

        this.HorizontalShootingPosition = horizontalShootingPosition;
        this.BaseSpeed = ServiceLocator.GetService<IServiceUtilManager>(
            'UtilManager',
        ).GetSpeedItTakesToCoverHalfTheScreenWidth({
            framesItTakes: DiamondStats['Tier 2 Frame Speed (Number Frames to HalfScreen Distance)'],
        });

        this.DamageResistancesController = new SpriteDamageResistancesController();

        this.canShoot = true;
        this.reachedShootingPosition = false;

        /* Hitbox Setup */
        const frameHitbox = CreateHitboxesWithInfoFile(this.X, this.Y, InfoMediumDiamond.Hitbox);
        this.frameHitbox = [...frameHitbox];

        this.Collide = new Map();
        this.Collide.set('WithProjectile', (projectileDamage: unknown) => {
            const damage = projectileDamage as number;
            this.StatesController.PlayState({ stateName: 'onHit' });
            this.cannon.PlayCollisionMethod({ collisionScenario: 'WithProjectile' });

            if (damage && typeof damage === 'number') {
                const maxNumberHealthSection = Damaged.Frames.length;
                const healthPerSection = this.baseHealth / maxNumberHealthSection;
                const oldHealthSection = Math.ceil(this.currentHealth / healthPerSection);
                this.currentHealth -= damage;
                const currentHealthSection = Math.ceil(this.currentHealth / healthPerSection);
                const numberOfFramesToPlay = oldHealthSection - currentHealthSection;
                for (let i = 0; i < numberOfFramesToPlay; i++) {
                    this.AnimationsController.PlayManuallyNextFrame();
                }
            }
        });

        this.Collide.set('WithPlayer', () => {
            this.AnimationsController.PlayAnimation({ animation: 'destroyed' });
            ServiceLocator.GetService<IServicePlayer>('Player').MakeTransactionOnWallet(this.MoneyValue);
        });

        /* Animation Setup */
        const { Damaged, Destroyed } = InfoMediumDiamond.Animations;

        this.AnimationsController.AddAnimation({
            animation: 'destroyed',
            frames: Destroyed.Frames,
            framesLengthInTime: Destroyed.FrameLengthInTime,
            beforePlayingAnimation: () => {
                this.removeEnemyFromGameFlow();
                this.cannon.AnimationsController.PlayAnimation({ animation: 'destroyed' });

                ServiceLocator.GetService<IServiceEventManager>('EventManager').Notify('enemy destroyed', () => {
                    ServiceLocator.GetService<IServiceWaveManager>('WaveManager').SetLastEnemyDestroyed(this);
                });
                ServiceLocator.GetService<IServicePlayer>('Player').MakeTransactionOnWallet(this.MoneyValue);
            },
            afterPlayingAnimation: () => {
                ServiceLocator.GetService<IServiceWaveManager>('WaveManager').RemoveEnemy(this);
            },
        });

        this.AnimationsController.AddAnimation({
            animation: 'damaged',
            frames: Damaged.Frames,
            framesLengthInTime: Damaged.FrameLengthInTime,
            afterPlayingAnimation: () => {
                this.AnimationsController.PlayAnimation({ animation: 'destroyed' });
            },
        });

        this.AnimationsController.PlayAnimation({ animation: 'damaged' });
    }

    UpdateHitboxes(dt: number): void {
        // only update the frame hitbox, the cannon hitbox is updated in the cannon class
        this.frameHitbox.forEach((hitbox) => {
            hitbox.SpriteX = this.X;
            hitbox.SpriteY = this.Y;
        });
    }

    Update(dt: number): void {
        super.Update(dt);

        if (this.X >= this.HorizontalShootingPosition) {
            this.X -= this.BaseSpeed;
        } else {
            this.reachedShootingPosition = true;
            if (this.canShoot) {
                this.EnableShooting();
            }
        }

        this.cannon.UpdateCannon({ dt, mediumDiamondX: this.X, mediumDiamondY: this.Y });

        this.UpdateHitboxes(dt);

        if (this.X < -this.Width) {
            ServiceLocator.GetService<IServiceWaveManager>('WaveManager').RemoveEnemy(this);
            return;
        }

        // Shooting flow of the enemy
        if (this.AnimationsController.CurrentAnimationName !== 'destroyed') {
            ServiceLocator.GetService<IServiceCollideManager>('CollideManager').HandleWhenEnemyCollideWithPlayer(this);
        }
    }

    Draw(ctx: CanvasRenderingContext2D): void {
        super.Draw(ctx);
        this.cannon.Draw(ctx);

        this.CurrentHitbox.forEach((hitbox) => {
            hitbox.TestHitboxDrawing(ctx);
        });
    }

    EnableShooting(): void {
        this.canShoot = true;
        if (
            !this.reachedShootingPosition ||
            this.AnimationsController.CurrentAnimationName === 'destroyed' ||
            this.cannon.AnimationsController.CurrentAnimationName === 'shooting'
        ) {
            return;
        }
        this.cannon.AnimationsController.PlayAnimation({ animation: 'shooting', loop: true });
    }

    DisableShooting(): void {
        this.canShoot = false;
        if (!this.reachedShootingPosition || this.cannon.AnimationsController.CurrentAnimationName !== 'shooting')
            return;
        this.cannon.AnimationsController.PlayAnimation({ animation: 'idle' });
    }

    ReachedShootingPosition(): boolean {
        return this.reachedShootingPosition;
    }

    private removeEnemyFromGameFlow(): void {
        // make the enemy uncollidable
        this.frameHitbox = [];
    }

    get MoneyValue(): number {
        return this.moneyValue;
    }

    set MoneyValue(value: number) {
        this.moneyValue = value;
    }

    get Tier(): 'Tier1' | 'Tier2' | 'Tier3' {
        return 'Tier2';
    }

    get Lane(): LaneNumber {
        return this.laneNumber;
    }

    get CurrentHitbox(): RectangleHitbox[] {
        return [...this.frameHitbox, ...this.cannon.CurrentHitbox];
    }
}
