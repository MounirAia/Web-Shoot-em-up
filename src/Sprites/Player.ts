import { IServiceEventManager } from '../EventManager';
import { IServiceImageLoader } from '../ImageLoader.js';
import { Keyboard } from '../Keyboard.js';
import { IServiceSceneManager } from '../SceneManager.js';
import { CANVA_SCALEX, CANVA_SCALEY, canvas } from '../ScreenConstant.js';
import { ServiceLocator } from '../ServiceLocator.js';
import InfoPlayer from '../SpriteInfoJSON/Player/infoPlayer.js';
import { RegularPlayerBullet } from './PlayerSkills/PlayerBullet.js';
import { IServiceGeneratedSpritesManager } from './GeneratedSpriteManager';
import { IServiceSkillManager, ISkill, PossibleSkillName, SkillsTypeName } from './PlayerSkills/Skills.js';
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
import { ISpriteWithDamage, ISpriteWithHealth, ISpriteWithSpeed } from './SpriteAttributes.js';
import { CollideScenario, CreateHitboxesWithInfoFile, ISpriteWithHitboxes, RectangleHitbox } from './SpriteHitbox.js';
import { IServiceUtilManager } from '../UtilManager';
import PlayerStats from '../StatsJSON/PlayerStats.js';

export interface IServicePlayer {
    Coordinate(): { x: number; y: number };
    PlayCollideMethod(collideScenario: CollideScenario, param?: unknown): void;
    MakeTransactionOnWallet(value: number): void;
    IsInvulnerable(): boolean;
    SetSkill(parameters: { skillType: SkillsTypeName; skillName: PossibleSkillName }): void; // Set the skill for the player, but do not update the player skills yet with the real object
    UpdateSkill(): void; // Update the player skills with the real object, take into account the updates made with SetSkill
    MaxHealth: number;
    NumberOfBoosts: number;
    SpecialSkillLevel: number;
    SpeciallSkillName: PossibleSkillName | undefined;
    EffectSkillLevel: number;
    SupportSkillLevel: number;
    CurrentHitbox: RectangleHitbox[];
    InvulnerabilityTimePeriod: number;
}

class Player extends Sprite implements IServicePlayer, ISpriteWithSpeed, ISpriteWithHitboxes, ISpriteWithHealth {
    private baseSpeed: number;
    private hitboxes: RectangleHitbox[];
    private playerFrameHitbox: RectangleHitbox[];
    Collide: Map<CollideScenario, (param?: unknown) => void>;

    private numberOfBoosts: number;
    BaseHealth: number;
    private currentHealth: number;

    private moneyInWallet: number;
    private specialSkillLevel: number;
    private effectSkillLevel: number;
    private supportSkillLevel: number;

    // makes player invulnerable, ex:when collide with enemies
    private invulnerabilityTimePeriod: number;

    // Manage shooting rate of the player
    private baseTimeBeforeNextShootInFrames: number;
    private currentTimeBeforeNextRegularShoot: number;
    private currentTimeBeforeNextSpecialShoot: number;

    private specialSkillChosen: PossibleSkillName;
    private effectSkillChosen: PossibleSkillName;
    private supportSkillChosen: PossibleSkillName;
    private currentSkill: Map<SkillsTypeName, ISkill>;

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
        this.numberOfBoosts = 0;

        this.baseSpeed = ServiceLocator.GetService<IServiceUtilManager>(
            'UtilManager',
        ).GetSpeedItTakesToCoverHalfTheScreenWidth({
            framesItTakes:
                PlayerStats[this.NumberOfBoosts]['Speed of the Player (Number Frames to HalfScreen Distance)'],
        });

        this.BaseHealth = PlayerStats[this.NumberOfBoosts]['Base Health'];
        this.currentHealth = this.BaseHealth;
        this.moneyInWallet = 0;
        this.specialSkillLevel = 0;
        this.effectSkillLevel = 0;
        this.supportSkillLevel = 0;
        this.invulnerabilityTimePeriod = PlayerStats[this.NumberOfBoosts]['Invulnerability Time Period (Seconds)'];
        this.baseTimeBeforeNextShootInFrames = 1; // in seconds
        this.currentTimeBeforeNextRegularShoot = 0;
        this.currentTimeBeforeNextSpecialShoot = 0;

        /*
         * Skill setup
         */
        this.currentSkill = new Map();

        // Trigger the 'effect' skill when an enemy is destroyed
        const actionOnEnemyDestroyed = () => {
            this.currentSkill.get('effect')?.Effect();
        };
        ServiceLocator.GetService<IServiceEventManager>('EventManager').Subscribe(
            'enemy destroyed',
            actionOnEnemyDestroyed,
        );

        this.playerFrameHitbox = CreateHitboxesWithInfoFile(this.X, this.Y, InfoPlayer.Hitbox);
        this.hitboxes = [...this.playerFrameHitbox];

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

        if (Keyboard.Space.IsDown && this.CanShootRegular) {
            const bullet = new RegularPlayerBullet(this.X, this.Y);
            ServiceLocator.GetService<IServiceGeneratedSpritesManager>('GeneratedSpritesManager').AddSprite(bullet);
        } else {
            if (this.currentTimeBeforeNextRegularShoot >= 0) {
                const bulletAS = new RegularPlayerBullet(this.X, this.Y).AttackSpeed() * dt;
                this.currentTimeBeforeNextRegularShoot -= bulletAS;
            }
        }

        if (Keyboard.Space.IsDown && this.CanShootSpecial) {
            this.currentSkill.get('special')?.Effect();
        } else if (this.currentSkill.get('special')) {
            const specialSkillAS = this.currentSkill.get('special')?.AttackSpeed?.();
            if (this.currentTimeBeforeNextSpecialShoot >= 0 && specialSkillAS) {
                this.currentTimeBeforeNextSpecialShoot -= specialSkillAS * dt;
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

    SetSkill(parameters: { skillType: SkillsTypeName; skillName: PossibleSkillName }) {
        const { skillType, skillName } = parameters;

        if (skillType === 'effect') {
            this.effectSkillChosen = skillName;
        } else if (skillType === 'special') {
            this.specialSkillChosen = skillName;
        } else if (skillType === 'support') {
            this.supportSkillChosen = skillName;
        }
    }

    private setSpecialSkill(parameters: { skill: ISkill }): void {
        const { skill } = parameters;
        this.currentSkill.set('special', skill);
        this.cannonConfiguration =
            ServiceLocator.GetService<IServiceCannonConfigurationGenerator>('CannonConfigurationGenerator').GetConfig();

        // the hitboxe of the player consist of his hitbox and the hitbox of the cannons attached to it
        this.hitboxes = [...this.playerFrameHitbox, ...this.cannonConfiguration.CurrentHitboxes];
    }

    private setEffectSkill(parameters: { skill: ISkill }): void {
        const { skill } = parameters;
        this.currentSkill.set('effect', skill);
        this.effectConfiguration =
            ServiceLocator.GetService<IServiceEffectConfigurationGenerator>('EffectConfigurationGenerator').GetConfig();
    }

    private setSupportSkill(parameters: { skill: ISkill }): void {
        const { skill } = parameters;
        this.currentSkill.set('support', skill);
        this.currentSkill.get('support')?.Effect();
        this.supportConfiguration = ServiceLocator.GetService<IServiceSupportConfigurationGenerator>(
            'SupportConfigurationGenerator',
        ).GetConfig();
    }

    UpdateSkill(): void {
        const specialSkill = ServiceLocator.GetService<IServiceSkillManager>('SkillManager').GetSkill({
            skillName: this.specialSkillChosen,
        });

        this.setSpecialSkill({ skill: specialSkill });

        const effectSkill = ServiceLocator.GetService<IServiceSkillManager>('SkillManager').GetSkill({
            skillName: this.effectSkillChosen,
        });

        this.setEffectSkill({ skill: effectSkill });

        const supportSkill = ServiceLocator.GetService<IServiceSkillManager>('SkillManager').GetSkill({
            skillName: this.supportSkillChosen,
        });

        this.setSupportSkill({ skill: supportSkill });
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

        // Update the player stats based on the number of boosts
        this.updatePlayerStatsOnBoost();
    }

    private updatePlayerStatsOnBoost() {
        const numberOfBoosts = this.NumberOfBoosts;

        this.BaseHealth = PlayerStats[numberOfBoosts]['Base Health'];
        this.BaseSpeed = ServiceLocator.GetService<IServiceUtilManager>(
            'UtilManager',
        ).GetSpeedItTakesToCoverHalfTheScreenWidth({
            framesItTakes: PlayerStats[numberOfBoosts]['Speed of the Player (Number Frames to HalfScreen Distance)'],
        });
        this.invulnerabilityTimePeriod = PlayerStats[numberOfBoosts]['Invulnerability Time Period (Seconds)'];
    }

    get MaxHealth(): number {
        return this.BaseHealth;
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

    public get CanShootRegular(): boolean {
        if (this.currentTimeBeforeNextRegularShoot <= 0) {
            this.currentTimeBeforeNextRegularShoot = this.baseTimeBeforeNextShootInFrames;
            return true;
        }

        return false;
    }

    public get CanShootSpecial(): boolean {
        if (this.currentTimeBeforeNextSpecialShoot <= 0) {
            this.currentTimeBeforeNextSpecialShoot = this.baseTimeBeforeNextShootInFrames;
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
        ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').GetImage('images/Player/Player.png');

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
