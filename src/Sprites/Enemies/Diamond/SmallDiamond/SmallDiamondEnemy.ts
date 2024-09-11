import { IServiceEventManager } from '../../../../EventManager.js';
import { IServiceImageLoader } from '../../../../ImageLoader.js';
import { CANVA_SCALEX, CANVA_SCALEY } from '../../../../ScreenConstant.js';
import { ServiceLocator } from '../../../../ServiceLocator.js';
import { GetSpriteStaticInformation } from '../../../../SpriteStaticInformation/SpriteStaticInformationManager.js';
import { LaneNumber } from '../../../../WaveManager/WaveEnemies/Lane.js';
import { IServiceWaveManager } from '../../../../WaveManager/WaveManager.js';
import { IServiceCollideManager } from '../../../CollideManager.js';
import { IServicePlayer } from '../../../Player.js';
import { Sprite } from '../../../Sprite.js';
import { ISpriteWithAttackSpeed, ISpriteWithSpeed } from '../../../SpriteAttributes.js';
import { SpriteDamageResistancesController } from '../../../SpriteDamageResistancesController.js';
import { CollideScenario, CreateHitboxesWithInfoFile, RectangleHitbox } from '../../../SpriteHitbox.js';
import { IEnemy } from '../../IEnemy.js';
import SmallDiamondCannon from './SmallDiamondCannon.js';

const InfoSmallDiamond = GetSpriteStaticInformation({ sprite: 'SmallDiamondEnemy' }).spriteInfo;

export class SmallDiamondEnemy extends Sprite implements IEnemy, ISpriteWithSpeed, ISpriteWithAttackSpeed {
    private moneyValue: number;

    private laneNumber: LaneNumber;
    frameHitbox: RectangleHitbox[];
    Collide: Map<CollideScenario, (param?: unknown) => void>;
    readonly HorizontalShootingPosition: number;
    BaseSpeed: number;
    BaseAttackSpeed: number;

    DamageResistancesController: SpriteDamageResistancesController;

    private cannon: SmallDiamondCannon;
    private baseHealth: number;
    private currentHealth: number;

    constructor(x = 0, y = 0, horizontalShootingPosition: number, laneNumber: LaneNumber) {
        const imgDiamond = ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').GetImage(
            'images/Enemies/Diamond/SmallDiamondFrame.png',
        );
        const frameWidth = InfoSmallDiamond.Meta.TileDimensions.Width;
        const frameHeight = InfoSmallDiamond.Meta.TileDimensions.Height;
        const scaleX = CANVA_SCALEX;
        const scaleY = CANVA_SCALEY;
        super(
            imgDiamond,
            frameWidth,
            frameHeight,
            x,
            y,
            InfoSmallDiamond.Meta.SpriteShiftPosition.X,
            InfoSmallDiamond.Meta.SpriteShiftPosition.Y,
            scaleX,
            scaleY,
            InfoSmallDiamond.Meta.RealDimension.Width,
            InfoSmallDiamond.Meta.RealDimension.Height,
        );

        this.cannon = new SmallDiamondCannon(this.X, this.Y);

        // center in its spawn, because enemies are spawned in predefined positions
        this.X = this.X - this.Width / 2;
        this.Y = this.Y - this.Height / 2;

        this.laneNumber = laneNumber;
        this.moneyValue = 20;
        this.baseHealth = 100;
        this.currentHealth = this.baseHealth;

        this.HorizontalShootingPosition = horizontalShootingPosition;
        this.BaseSpeed = 6;
        this.BaseAttackSpeed = 2;

        this.DamageResistancesController = new SpriteDamageResistancesController();

        /* Hitbox Setup */
        const frameHitbox = CreateHitboxesWithInfoFile(this.X, this.Y, InfoSmallDiamond.Hitbox);
        this.frameHitbox = [...frameHitbox];

        this.Collide = new Map();
        this.Collide.set('WithProjectile', (projectileDamage: unknown) => {
            const damage = projectileDamage as number;

            this.StatesController.PlayState({ stateName: 'onHit' });
            this.cannon.PlayCollisionMethod({ collisionScenario: 'WithProjectile' });

            if (damage && typeof damage === 'number') {
                const { floor } = Math;
                const maxNumberHealthSection = Damaged.Frames.length;
                const healthPerSection = floor(this.baseHealth / maxNumberHealthSection);
                const oldHealthSection = Math.ceil(this.currentHealth / healthPerSection);
                this.currentHealth -= damage;
                const currentHealthSection = Math.ceil(this.currentHealth / healthPerSection);
                const numberOfFramesToPlay = oldHealthSection - currentHealthSection;
                for (let i = 0; i < numberOfFramesToPlay; i++) {
                    this.AnimationsController.PlayManuallyNextFrame();
                }
            }

            if (this.currentHealth <= 0) {
                this.AnimationsController.PlayAnimation({ animation: 'destroyed' });
            }
        });

        this.Collide.set('WithPlayer', () => {
            this.AnimationsController.PlayAnimation({ animation: 'destroyed' });
            ServiceLocator.GetService<IServicePlayer>('Player').MakeTransactionOnWallet(this.MoneyValue);
        });

        /* Animation Setup */
        const { Damaged, Destroyed } = InfoSmallDiamond.Animations;

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
            if (this.AnimationsController.CurrentAnimationName !== 'destroyed') {
                this.cannon.AnimationsController.PlayAnimation({ animation: 'shooting', loop: true });
            }
        }

        this.cannon.UpdateCannon({ dt, smallDiamondX: this.X, smallDiamondY: this.Y });

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
    }

    get AttackSpeed(): number {
        return this.BaseAttackSpeed;
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
        return 'Tier1';
    }

    get Lane(): LaneNumber {
        return this.laneNumber;
    }

    get CurrentHitbox(): RectangleHitbox[] {
        return [...this.frameHitbox, ...this.cannon.CurrentHitbox];
    }
}
