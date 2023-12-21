import { IServiceEventManager } from '../EventManager';
import { IServiceImageLoader } from '../ImageLoader.js';
import { Keyboard } from '../Keyboard.js';
import { IServiceSceneManager } from '../SceneManager.js';
import { CANVA_SCALEX, CANVA_SCALEY, canvas } from '../ScreenConstant.js';
import { ServiceLocator } from '../ServiceLocator.js';
import InfoPlayer from '../SpriteInfoJSON/Player/infoPlayer.js';
import { RegularPlayerBullet } from './Bullets/PlayerBullet.js';
import { IServiceGeneratedSpritesManager } from './GeneratedSpriteManager';
import { BladeExplosionSkill } from './PlayerSkills/Effect/BladeExplosionSkill.js';
import { ISkill, PossibleSkillName } from './PlayerSkills/Skills.js';
import { RocketSkill } from './PlayerSkills/Special/RocketSkill.js';
import { FuelChargeShotSkill } from './PlayerSkills/Support/FuelChargeShot/FuelChargeShot.js';
import {
    EffectConfiguration,
    IServiceEffectConfigurationGenerator,
} from './PlayerSkills/Upgrade/Effect/IServiceEffectConfiguration.js';
import {
    CannonConfiguration,
    IServiceCannonConfigurationGenerator,
} from './PlayerSkills/Upgrade/Special/IServiceCannonConfigurationGenerator.js';
import {
    IServiceSupportConfigurationGenerator,
    SupportConfiguration,
} from './PlayerSkills/Upgrade/Support/IServiceSupportConfiguration.js';
import { Sprite } from './Sprite.js';
import {
    ISpriteWithAttackSpeed,
    ISpriteWithAttackSpeedUpgrades,
    ISpriteWithDamage,
    ISpriteWithDamageUpgrades,
    ISpriteWithHealth,
    ISpriteWithHealthUpgrades,
    ISpriteWithSpeed,
} from './SpriteAttributes.js';
import { CollideScenario, CreateHitboxesWithInfoFile, ISpriteWithHitboxes, RectangleHitbox } from './SpriteHitbox.js';

export interface IServicePlayer {
    Coordinate(): { x: number; y: number };
    AddDamageUpgrade(upgrade: number): void;
    AddAttackSpeedStats(upgrade: number): void;
    AddHealthUpgrade(upgrade: number): void;
    PlayCollideMethod(collideScenario: CollideScenario, param?: unknown): void;
    MakeTransactionOnWallet(value: number): void;
    IsInvulnerable(): boolean;
    DamageStats: number;
    MaxHealth: number;
    NumberOfBoosts: number;
    NumberOfDamageUpgrade: number;
    SpecialSkillLevel: number;
    SpeciallSkillName: PossibleSkillName | undefined;
    EffectSkillLevel: number;
    SupportSkillLevel: number;
    CurrentHitbox: RectangleHitbox[];
    InvulnerabilityTimePeriod: number;
}

type PlayerSkill = 'effect' | 'special' | 'support';

class Player
    extends Sprite
    implements
        IServicePlayer,
        ISpriteWithSpeed,
        ISpriteWithHitboxes,
        ISpriteWithDamageUpgrades,
        ISpriteWithHealth,
        ISpriteWithHealthUpgrades,
        ISpriteWithAttackSpeed,
        ISpriteWithAttackSpeedUpgrades
{
    private baseSpeed: number;
    private hitboxes: RectangleHitbox[];
    Collide: Map<CollideScenario, (param?: unknown) => void>;

    private numberOfBoosts: number;
    DamageUpgrades: number[];
    HealthUpgrades: number[];
    BaseHealth: number;
    private currentHealth: number;
    AttackSpeedUpgrades: number[];
    BaseAttackSpeed: number;

    private moneyInWallet: number;
    private specialSkillLevel: number;
    private effectSkillLevel: number;
    private supportSkillLevel: number;

    // makes player invulnerable, ex:when collide with enemies
    private readonly invulnerabilityTimePeriod: number;

    // Manage shooting rate of the player
    private baseTimeBeforeNextShoot: number;
    private currentTimeBeforeNextShoot: number;

    private currentSkill: Map<PlayerSkill, ISkill>;

    private cannonConfiguration: CannonConfiguration;
    private effectConfiguration: EffectConfiguration;
    private supportConfiguration: SupportConfiguration;

    constructor(
        image: HTMLImageElement,

        x = 0,
        y = 0,
    ) {
        super(
            image,
            InfoPlayer.Meta.TileDimensions.Width,
            InfoPlayer.Meta.TileDimensions.Height,
            x,
            y,
            InfoPlayer.Meta.SpriteShiftPosition.X,
            InfoPlayer.Meta.SpriteShiftPosition.Y,
            CANVA_SCALEX,
            CANVA_SCALEY,
            InfoPlayer.Meta.RealDimension.Width,
            InfoPlayer.Meta.RealDimension.Height,
        );
        ServiceLocator.AddService('Player', this);

        this.baseSpeed = 5;
        this.numberOfBoosts = 0;
        this.DamageUpgrades = [];
        this.HealthUpgrades = [];
        this.BaseHealth = 100;
        this.currentHealth = this.BaseHealth;
        this.AttackSpeedUpgrades = [];
        this.BaseAttackSpeed = 3;
        this.moneyInWallet = 0;
        this.specialSkillLevel = 0;
        this.effectSkillLevel = 0;
        this.supportSkillLevel = 3;
        this.invulnerabilityTimePeriod = 1;
        this.baseTimeBeforeNextShoot = 30;
        this.currentTimeBeforeNextShoot = 0;

        // Skill setup
        this.currentSkill = new Map();
        this.currentSkill.set('special', new RocketSkill());
        this.cannonConfiguration =
            ServiceLocator.GetService<IServiceCannonConfigurationGenerator>('CannonConfigurationGenerator').GetConfig();
        this.effectConfiguration =
            ServiceLocator.GetService<IServiceEffectConfigurationGenerator>('EffectConfigurationGenerator').GetConfig();
        this.supportConfiguration = ServiceLocator.GetService<IServiceSupportConfigurationGenerator>(
            'SupportConfigurationGenerator',
        ).GetConfig();

        this.currentSkill.set('effect', new BladeExplosionSkill());
        const actionOnEnemyDestroyed = () => {
            this.currentSkill.get('effect')?.Effect();
        };
        ServiceLocator.GetService<IServiceEventManager>('EventManager').Subscribe(
            'enemy destroyed',
            actionOnEnemyDestroyed,
        );

        this.currentSkill.set('support', new FuelChargeShotSkill());
        this.currentSkill.get('support')?.Effect();

        this.hitboxes = CreateHitboxesWithInfoFile(this.X, this.Y, InfoPlayer.Hitbox);

        // the hitboxe of the player consist of his hitbox and the hitbox of the cannons attached to it
        this.hitboxes = [...this.hitboxes, ...this.cannonConfiguration.CurrentHitboxes];

        const { Idle, Destroyed } = InfoPlayer.Animations;
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
                this.removePlayerFromGameFlow();
                ServiceLocator.GetService<IServiceEventManager>('EventManager').Unsubscribe(
                    'enemy destroyed',
                    actionOnEnemyDestroyed,
                );
            },
        });

        this.Collide = new Map();

        this.Collide.set('WithProjectile', (bullet: unknown) => {
            this.StatesController.PlayState({ stateName: 'onHit' });
            this.cannonConfiguration.PlayCollisionMethod({ collisionScenario: 'WithProjectile' });

            const myBullet = bullet as ISpriteWithDamage;
            this.CurrentHealth -= myBullet.Damage;
        });

        this.Collide.set('WithEnemy', (enemy: unknown) => {
            this.StatesController.PlayState({ stateName: 'onInvulnerable', duration: this.invulnerabilityTimePeriod });
            this.cannonConfiguration.PlayCollisionMethod({ collisionScenario: 'WithEnemy' });

            this.CurrentHealth -= this.MaxHealth * 0.5;
        });

        this.AnimationsController.PlayAnimation({ animation: 'idle' });
    }

    public UpdateHitboxes(dt: number): void {
        this.CurrentHitbox.forEach((hitbox) => {
            hitbox.SpriteX = this.X;
            hitbox.SpriteY = this.Y;
        });
    }

    public Update(dt: number): void {
        super.Update(dt);
        // Check if player do not go outside the viewport
        let isOutsideLeftScreen = false;
        let isOutsideTopScreen = false;
        let isOutsideRightScreen = false;
        let isOutsideBottomScreen = false;
        for (const hitbox of this.CurrentHitbox) {
            isOutsideLeftScreen =
                isOutsideLeftScreen || hitbox.CheckIfBoxOverlap(-canvas.width, 0, canvas.width, canvas.height);
            isOutsideTopScreen =
                isOutsideTopScreen || hitbox.CheckIfBoxOverlap(0, -canvas.height, canvas.width, canvas.height);
            isOutsideRightScreen =
                isOutsideRightScreen || hitbox.CheckIfBoxOverlap(canvas.width, 0, canvas.width, canvas.height);
            isOutsideBottomScreen =
                isOutsideBottomScreen || hitbox.CheckIfBoxOverlap(0, canvas.height, canvas.width, canvas.height);
        }

        if (Keyboard.a.IsDown) {
            if (!isOutsideLeftScreen) this.X -= this.BaseSpeed;
        }
        if (Keyboard.w.IsDown) {
            if (!isOutsideTopScreen) this.Y -= this.BaseSpeed;
        }
        if (Keyboard.d.IsDown) {
            if (!isOutsideRightScreen) this.X += this.BaseSpeed;
        }
        if (Keyboard.s.IsDown) {
            if (!isOutsideBottomScreen) this.Y += this.BaseSpeed;
        }

        this.cannonConfiguration.Update(dt);
        this.effectConfiguration.Update(dt);
        this.supportConfiguration.Update(dt);

        this.UpdateHitboxes(dt);

        if (Keyboard.Space.IsDown && this.CanShoot) {
            const bulletXOffset = 34 * CANVA_SCALEX;
            const bulletYOffset = 8 * CANVA_SCALEY;
            const bullet = new RegularPlayerBullet(this.X + bulletXOffset, this.Y + bulletYOffset);
            ServiceLocator.GetService<IServiceGeneratedSpritesManager>('GeneratedSpritesManager').AddSprite(bullet);

            this.currentSkill.get('special')?.Effect();
        } else {
            if (this.currentTimeBeforeNextShoot >= 0) {
                this.currentTimeBeforeNextShoot -= this.AttackSpeed;
            }
        }
    }

    private removePlayerFromGameFlow() {
        this.hitboxes = [];
    }

    Draw(ctx: CanvasRenderingContext2D) {
        super.Draw(ctx);
        this.cannonConfiguration.Draw(ctx);
        this.effectConfiguration.Draw(ctx);
        this.supportConfiguration.Draw(ctx);
    }

    Coordinate(): { x: number; y: number } {
        return { x: this.X, y: this.Y };
    }

    AddDamageUpgrade(upgrade: number): void {
        if (upgrade > 0) this.DamageUpgrades.push(upgrade);
    }

    AddHealthUpgrade(upgrade: number): void {
        if (upgrade > 0) this.HealthUpgrades.push(upgrade);
    }

    AddAttackSpeedStats(upgrade: number): void {
        if (upgrade > 0) this.AttackSpeedUpgrades.push(upgrade);
    }

    PlayCollideMethod(collideScenario: CollideScenario, param?: unknown): void {
        const collideMethod = this.Collide.get(collideScenario);
        if (collideMethod) {
            collideMethod(param);
        }
    }

    MakeTransactionOnWallet(value: number): void {
        this.moneyInWallet += value;

        if (this.moneyInWallet < 0) {
            this.moneyInWallet = 0;
        }
    }

    IsInvulnerable(): boolean {
        return this.StatesController.GetIfInTheStateOf({ stateName: 'onInvulnerable' });
    }

    get CurrentHitbox(): RectangleHitbox[] {
        return this.hitboxes;
    }

    public get BaseSpeed(): number {
        if ((Keyboard.a.IsDown || Keyboard.d.IsDown) && (Keyboard.w.IsDown || Keyboard.s.IsDown)) {
            return this.baseSpeed / Math.sqrt(2); // to avoid faster movement when player goes in diagonal
        }
        return this.baseSpeed;
    }

    private set BaseSpeed(value: number) {
        this.baseSpeed = value;
    }

    get NumberOfBoosts(): number {
        const maxNumberOfBoosts = 25;
        if (this.numberOfBoosts > maxNumberOfBoosts) return maxNumberOfBoosts;
        if (this.numberOfBoosts < 0) return 0;

        return this.numberOfBoosts;
    }

    private set NumberOfBoosts(value: number) {
        this.numberOfBoosts = value;
    }

    get DamageStats(): number {
        return this.DamageUpgrades.reduce((total, damage) => {
            return total + damage;
        }, 1);
    }

    get NumberOfDamageUpgrade(): number {
        return this.DamageUpgrades.length;
    }

    private get healthStats(): number {
        return this.HealthUpgrades.reduce((total, health) => {
            return total + health;
        }, 1);
    }

    get MaxHealth(): number {
        return this.BaseHealth * this.healthStats;
    }
    get CurrentHealth(): number {
        return this.currentHealth;
    }
    set CurrentHealth(value: number) {
        if (value >= this.MaxHealth) {
            this.currentHealth = this.MaxHealth;
        } else {
            this.currentHealth = value;
        }

        if (this.currentHealth <= 0) {
            this.currentHealth = 0;
            this.AnimationsController.PlayAnimation({ animation: 'destroyed' });
            ServiceLocator.GetService<IServiceSceneManager>('SceneManager').PlayScene('GameOver');
        }
    }

    get AttackSpeedStats(): number {
        return this.AttackSpeedUpgrades.reduce((total, attackSpeed) => {
            return total + attackSpeed;
        }, 1);
    }
    get AttackSpeed(): number {
        return this.BaseAttackSpeed * this.AttackSpeedStats;
    }

    public get CanShoot(): boolean {
        if (this.currentTimeBeforeNextShoot <= 0) {
            this.currentTimeBeforeNextShoot = this.baseTimeBeforeNextShoot;
            return true;
        }

        return false;
    }

    get SpecialSkillLevel(): number {
        return this.specialSkillLevel;
    }

    get SpeciallSkillName(): PossibleSkillName | undefined {
        return this.currentSkill.get('special')?.SkillName;
    }

    get EffectSkillLevel(): number {
        return this.effectSkillLevel;
    }

    get SupportSkillLevel(): number {
        return this.supportSkillLevel;
    }

    get InvulnerabilityTimePeriod(): number {
        return this.invulnerabilityTimePeriod;
    }
}

let player: Player;
export function LoadPlayer() {
    const imgPlayer =
        ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').GetImage('images/Player/player.png');

    const x = 250;
    const y = 250;

    player = new Player(imgPlayer, x, y);
}

export function UpdatePlayer(dt: number) {
    player.Update(dt);
}

export function DrawPlayer(ctx: CanvasRenderingContext2D) {
    player.Draw(ctx);
}
