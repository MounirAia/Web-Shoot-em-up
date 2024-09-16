import { IServiceEventManager } from '../EventManager';
import { IServiceImageLoader } from '../ImageLoader.js';
import { IServiceKeyboardManager } from '../Keyboard.js';
import { IServiceSceneManager } from '../SceneManager.js';
import { CANVA_SCALEX, CANVA_SCALEY, canvas } from '../ScreenConstant.js';
import { ServiceLocator } from '../ServiceLocator.js';
import { RegularPlayerBullet } from './PlayerSkills/PlayerBullet.js';
import { IServiceGeneratedSpritesManager } from './GeneratedSpriteManager';
import { ISkill, PossibleSkillLevel, PossibleSkillName, SkillFactory, SkillsTypeName } from './PlayerSkills/Skills.js';
import {
    EffectConfiguration,
    EffectConfigurationFactory,
} from './PlayerSkills/Upgrade/Effect/EffectConfigurationFactory.js';
import {
    CannonConfiguration,
    CannonConfigurationFactory,
} from './PlayerSkills/Upgrade/Special/CannonConfigurationFactory.js';
import {
    SupportConfiguration,
    SupportConfigurationFactory,
} from './PlayerSkills/Upgrade/Support/SupportConfigurationFactory.js';
import { Sprite } from './Sprite.js';
import { ISpriteWithDamage, ISpriteWithHealth, ISpriteWithSpeed } from './SpriteAttributes.js';
import { CollideScenario, CreateHitboxesWithInfoFile, ISpriteWithHitboxes, RectangleHitbox } from './SpriteHitbox.js';
import { IServiceUtilManager } from '../UtilManager';
import { GetSpriteStaticInformation } from '../SpriteStaticInformation/SpriteStaticInformationManager.js';
import { IServiceWaveManager } from '../WaveManager/WaveManager.js';
import { PlayerShockwaveController } from './PlayerShockwaveController.js';

const InfoPlayer = GetSpriteStaticInformation({ sprite: 'Player' }).spriteInfo;
const PlayerStats = GetSpriteStaticInformation({ sprite: 'Player' }).stats;

export interface IServicePlayer {
    Coordinate(): { x: number; y: number };
    PlayCollideMethod(collideScenario: CollideScenario, param?: unknown): void;
    MakeTransactionOnWallet(value: number): void;
    IsInvulnerable(): boolean;
    SetSkill(parameters: { skillType: SkillsTypeName; skillName: PossibleSkillName }): void; // Set the skill for the player, but do not update the player skills yet with the real object
    GetSkillLevel: (parameters: { skillType: SkillsTypeName }) => PossibleSkillLevel;
    UpgradeSkillLevel(parameters: { skillType: SkillsTypeName }): void; // Update a specific skill level
    UpgradeBoost(): void;
    GetIsMaxNumberBoostAttained(): boolean;
    GetIsMaxLevelReachedForSpecificSkillType(parameters: { skillType: SkillsTypeName }): boolean;
    GetCurrentEnergyPoints: () => number;
    GetMaxEnergyEnergyPoints: () => number;
    GetEnergyZone: () => 'safe' | 'medium' | 'danger';
    MaxHealth: number;
    CurrentHealth: number;
    MoneyInWallet: number;
    NumberOfBoosts: number;
    SpecialSkillLevel: PossibleSkillLevel;
    SpecialSkillName: PossibleSkillName | undefined;
    EffectSkillLevel: PossibleSkillLevel;
    EffectSkillName: PossibleSkillName | undefined;
    SupportSkillLevel: PossibleSkillLevel;
    SupportSkillName: PossibleSkillName | undefined;
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

    private shockwaveControler: PlayerShockwaveController;
    private maxEnergyPoints: number;
    private currentEnergyPoints: number;

    private moneyInWallet: number;
    private specialSkillLevel: PossibleSkillLevel;
    private effectSkillLevel: PossibleSkillLevel;
    private supportSkillLevel: PossibleSkillLevel;

    // makes player invulnerable, ex:when collide with enemies
    private invulnerabilityTimePeriod: number;

    // Manage shooting rate of the player
    private baseTimeBeforeNextShootInSeconds: number;
    private currentTimeBeforeNextRegularShoot: number;
    private currentTimeBeforeNextSpecialShoot: number;

    private specialSkillChosen: PossibleSkillName;
    private effectSkillChosen: PossibleSkillName;
    private supportSkillChosen: PossibleSkillName;
    private currentSkill: Map<SkillsTypeName, ISkill>;

    private cannonConfiguration?: CannonConfiguration;
    private effectConfiguration?: EffectConfiguration;
    private supportConfiguration?: SupportConfiguration;

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
        this.shockwaveControler = new PlayerShockwaveController();
        this.maxEnergyPoints = 100;
        this.currentEnergyPoints = 0;
        this.moneyInWallet = 10000;
        this.specialSkillLevel = 0;
        this.effectSkillLevel = 0;
        this.supportSkillLevel = 0;
        this.invulnerabilityTimePeriod = PlayerStats[this.NumberOfBoosts]['Invulnerability Time Period (Seconds)'];
        this.baseTimeBeforeNextShootInSeconds = 1; // in seconds
        this.currentTimeBeforeNextRegularShoot = 0;
        this.currentTimeBeforeNextSpecialShoot = 0;

        /*
         * Skill setup
         */
        this.currentSkill = new Map();

        // Trigger the 'effect' skill when an enemy is destroyed
        const triggerEffectSkillOnEnemyDestroyed = () => {
            this.currentSkill.get('effect')?.Effect();
        };
        ServiceLocator.GetService<IServiceEventManager>('EventManager').Subscribe(
            'enemy destroyed',
            triggerEffectSkillOnEnemyDestroyed,
        );

        const fillEnergyPointsOnEnemyDestroyed = () => {
            const lastEnemyDestroyedEnergyPoints =
                ServiceLocator.GetService<IServiceWaveManager>('WaveManager').GetLastEnemyEnergyValue();
            this.addEnergyPoints(lastEnemyDestroyedEnergyPoints);
        };
        ServiceLocator.GetService<IServiceEventManager>('EventManager').Subscribe(
            'enemy destroyed',
            fillEnergyPointsOnEnemyDestroyed,
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
                    triggerEffectSkillOnEnemyDestroyed,
                );
                ServiceLocator.GetService<IServiceEventManager>('EventManager').Unsubscribe(
                    'enemy destroyed',
                    fillEnergyPointsOnEnemyDestroyed,
                );
            },
        });

        this.Collide = new Map();

        this.Collide.set('WithProjectile', (bullet: unknown) => {
            this.StatesController.PlayState({ stateName: 'onHit' });
            this.cannonConfiguration?.PlayCollisionMethod({ collisionScenario: 'WithProjectile' });

            const myBullet = bullet as ISpriteWithDamage;
            this.CurrentHealth -= myBullet.Damage;
        });

        this.Collide.set('WithEnemy', (enemy: unknown) => {
            this.StatesController.PlayState({ stateName: 'onInvulnerable', duration: this.invulnerabilityTimePeriod });
            this.cannonConfiguration?.PlayCollisionMethod({ collisionScenario: 'WithEnemy' });

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
        // Check if player do not go outside the viewport. Consider only the frame hitbox of the player. ignore the cannon hitbox.
        for (const hitbox of this.playerFrameHitbox) {
            isOutsideLeftScreen =
                isOutsideLeftScreen ||
                hitbox.CheckIfBoxOverlap(this.getScreenLimit('left'), 0, canvas.width, canvas.height);

            isOutsideTopScreen =
                isOutsideTopScreen ||
                hitbox.CheckIfBoxOverlap(0, this.getScreenLimit('top'), canvas.width, (3 / 4) * CANVA_SCALEX);

            isOutsideRightScreen =
                isOutsideRightScreen ||
                hitbox.CheckIfBoxOverlap(this.getScreenLimit('right'), 0, canvas.width, canvas.height);

            isOutsideBottomScreen =
                isOutsideBottomScreen ||
                hitbox.CheckIfBoxOverlap(0, this.getScreenLimit('bottom'), canvas.width, canvas.height);
        }

        const keyboardManager = ServiceLocator.GetService<IServiceKeyboardManager>('KeyboardManager');
        if (keyboardManager.GetCommandState({ command: 'MoveLeft' }).IsDown) {
            if (!isOutsideLeftScreen) this.X -= this.BaseSpeed;
            else this.X = this.getResetPositionOnScreenLimit('left');
        }
        if (keyboardManager.GetCommandState({ command: 'MoveUp' }).IsDown) {
            if (!isOutsideTopScreen) this.Y -= this.BaseSpeed;
            else this.getResetPositionOnScreenLimit('top');
        }
        if (keyboardManager.GetCommandState({ command: 'MoveRight' }).IsDown) {
            if (!isOutsideRightScreen) this.X += this.BaseSpeed;
            else this.X = this.getResetPositionOnScreenLimit('right');
        }
        if (keyboardManager.GetCommandState({ command: 'MoveDown' }).IsDown) {
            if (!isOutsideBottomScreen) this.Y += this.BaseSpeed;
            else this.Y = this.getResetPositionOnScreenLimit('bottom');
        }

        this.cannonConfiguration?.Update(dt);
        this.effectConfiguration?.Update(dt);
        this.supportConfiguration?.Update(dt);
        this.shockwaveControler.Update(dt);

        this.UpdateHitboxes(dt);

        if (keyboardManager.GetCommandState({ command: 'PlayerShoot' }).IsDown && this.CanShootRegular) {
            const bullet = new RegularPlayerBullet(this.X, this.Y);
            ServiceLocator.GetService<IServiceGeneratedSpritesManager>('GeneratedSpritesManager').AddSprite(bullet);
        } else {
            if (this.currentTimeBeforeNextRegularShoot >= 0) {
                const bulletAS = new RegularPlayerBullet(this.X, this.Y).AttackSpeed() * dt; // The attack speed is computed as shoot per second
                this.currentTimeBeforeNextRegularShoot -= bulletAS;
            }
        }

        if (keyboardManager.GetCommandState({ command: 'PlayerShoot' }).IsDown && this.CanShootSpecial) {
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
        this.shockwaveControler.Draw(ctx);
        super.Draw(ctx);
        this.cannonConfiguration?.Draw(ctx);
        this.effectConfiguration?.Draw(ctx);
        this.supportConfiguration?.Draw(ctx);
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
        this.moneyInWallet = Math.round(this.moneyInWallet);

        if (this.moneyInWallet < 0) {
            this.moneyInWallet = 0;
        }
    }

    IsInvulnerable(): boolean {
        return this.StatesController.GetIfInTheStateOf({ stateName: 'onInvulnerable' });
    }

    SetSkill(parameters: { skillType: SkillsTypeName; skillName: PossibleSkillName }) {
        const { skillType, skillName } = parameters;
        const skillFactory = new SkillFactory();

        if (skillType === 'special') {
            this.specialSkillChosen = skillName;

            const specialSkill = skillFactory.GetSkill({
                skillName: this.specialSkillChosen,
                playerOldSkill: this.currentSkill.get('special'),
            });
            this.setSpecialSkill({ skill: specialSkill });
        } else if (skillType === 'effect') {
            this.effectSkillChosen = skillName;

            const effectSkill = skillFactory.GetSkill({
                skillName: this.effectSkillChosen,
                playerOldSkill: this.currentSkill.get('effect'),
            });
            this.setEffectSkill({ skill: effectSkill });
        } else if (skillType === 'support') {
            this.supportSkillChosen = skillName;

            const supportSkill = skillFactory.GetSkill({
                skillName: this.supportSkillChosen,
                playerOldSkill: this.currentSkill.get('support'),
            });
            this.setSupportSkill({ skill: supportSkill });
        }
    }

    UpgradeSkillLevel(parameters: { skillType: SkillsTypeName }): void {
        const { skillType } = parameters;
        if (skillType === 'special') {
            this.specialSkillLevel++;
            this.SetSkill({ skillType: 'special', skillName: this.SpecialSkillName! });
        } else if (skillType === 'effect') {
            this.effectSkillLevel++;
            this.SetSkill({ skillType: 'effect', skillName: this.EffectSkillName! });
        } else if (skillType === 'support') {
            this.supportSkillLevel++;
            this.SetSkill({ skillType: 'support', skillName: this.SupportSkillName! });
        }
    }

    GetSkillLevel(parameters: { skillType: SkillsTypeName }): PossibleSkillLevel {
        const { skillType } = parameters;
        if (skillType === 'special') {
            return this.SpecialSkillLevel;
        } else if (skillType === 'effect') {
            return this.EffectSkillLevel;
        } else if (skillType === 'support') {
            return this.SupportSkillLevel;
        }
        return 0;
    }

    private setSpecialSkill(parameters: { skill: ISkill }): void {
        const { skill } = parameters;
        this.currentSkill.set('special', skill);
        /* Update Special Skill */
        const cannonConfigurationFactory = new CannonConfigurationFactory({
            playerSpecialSkillName: this.SpecialSkillName,
            playerSpecialSkillLevel: this.SpecialSkillLevel,
            playerX: this.X,
            playerY: this.Y,
        });
        this.cannonConfiguration = cannonConfigurationFactory.GetConfig();

        // the hitboxe of the player consist of his hitbox and the hitbox of the cannons attached to it
        this.hitboxes = [...this.playerFrameHitbox, ...this.cannonConfiguration.CurrentHitboxes];
    }

    private setEffectSkill(parameters: { skill: ISkill }): void {
        const { skill } = parameters;
        this.currentSkill.set('effect', skill);
        /* Update Effect Skill */
        const effectConfigurationFactory = new EffectConfigurationFactory({
            playerEffectSkillLevel: this.EffectSkillLevel,
            playerX: this.X,
            playerY: this.Y,
        });
        this.effectConfiguration = effectConfigurationFactory.GetConfig();
    }

    private setSupportSkill(parameters: { skill: ISkill }): void {
        const { skill } = parameters;
        this.currentSkill.set('support', skill);
        /* Update Support Skill */
        this.currentSkill.get('support')?.Effect();
        const supportConfigurationFactory = new SupportConfigurationFactory({
            playerSupportSkillLevel: this.SupportSkillLevel,
            playerX: this.X,
            playerY: this.Y,
        });
        this.supportConfiguration = supportConfigurationFactory.GetConfig();
    }

    UpgradeBoost(): void {
        this.NumberOfBoosts++;

        this.updatePlayerStatsOnBoost();
    }

    GetIsMaxNumberBoostAttained(): boolean {
        return (
            this.NumberOfBoosts >=
            GetSpriteStaticInformation({ sprite: 'PlayerBoost' }).constant['Max Number of Boosts']
        );
    }

    GetIsMaxLevelReachedForSpecificSkillType(parameters: { skillType: SkillsTypeName }): boolean {
        const { skillType } = parameters;
        if (skillType === 'special') {
            return this.SpecialSkillLevel > 2;
        } else if (skillType === 'effect') {
            return this.EffectSkillLevel > 2;
        } else if (skillType === 'support') {
            return this.SupportSkillLevel > 2;
        }
        return false;
    }

    GetCurrentEnergyPoints() {
        const energy = this.currentEnergyPoints;
        if (energy < 0) {
            return 0;
        } else if (energy > this.maxEnergyPoints) {
            return this.maxEnergyPoints;
        }

        return energy;
    }

    GetMaxEnergyEnergyPoints() {
        return this.maxEnergyPoints;
    }

    GetEnergyZone() {
        const x = this.X;

        if (x < 107 * CANVA_SCALEX) {
            return 'safe';
        } else if (x < 171 * CANVA_SCALEX) {
            return 'medium';
        } else {
            return 'danger';
        }
    }

    private addEnergyPoints(value: number) {
        this.currentEnergyPoints += value;
        if (this.currentEnergyPoints < 0) {
            this.currentEnergyPoints = 0;
        } else if (this.currentEnergyPoints >= this.maxEnergyPoints) {
            this.currentEnergyPoints = 0;
            this.shockwaveControler.AddShockwave({ playerX: this.X, playerY: this.Y });
        }
    }

    get CurrentHitbox(): RectangleHitbox[] {
        return this.hitboxes;
    }

    public get BaseSpeed(): number {
        const keyboardManager = ServiceLocator.GetService<IServiceKeyboardManager>('KeyboardManager');
        const moveLeft = keyboardManager.GetCommandState({ command: 'MoveLeft' }).IsDown;
        const moveRight = keyboardManager.GetCommandState({ command: 'MoveRight' }).IsDown;
        const moveUp = keyboardManager.GetCommandState({ command: 'MoveUp' }).IsDown;
        const moveDown = keyboardManager.GetCommandState({ command: 'MoveDown' }).IsDown;

        if ((moveLeft || moveRight) && (moveUp || moveDown)) {
            return this.baseSpeed / Math.sqrt(2); // to avoid faster movement when player goes in diagonal
        }
        return this.baseSpeed;
    }

    private set BaseSpeed(value: number) {
        this.baseSpeed = value;
    }

    get MoneyInWallet(): number {
        return this.moneyInWallet;
    }

    get NumberOfBoosts(): number {
        const maxNumberOfBoosts = GetSpriteStaticInformation({ sprite: 'PlayerBoost' }).constant[
            'Max Number of Boosts'
        ];
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
        this.CurrentHealth = this.BaseHealth; // reset the health to the base health
        this.BaseSpeed = ServiceLocator.GetService<IServiceUtilManager>(
            'UtilManager',
        ).GetSpeedItTakesToCoverHalfTheScreenWidth({
            framesItTakes: PlayerStats[numberOfBoosts]['Speed of the Player (Number Frames to HalfScreen Distance)'],
        });
        this.invulnerabilityTimePeriod = PlayerStats[numberOfBoosts]['Invulnerability Time Period (Seconds)'];
    }

    private getScreenLimit(direction: 'left' | 'right' | 'top' | 'bottom'): number {
        const canvasWidth = canvas.width;

        const resetPlayerOnLeftScreenLimit = -(canvasWidth - 1);
        const resetPlayerOnRightScreenLimit = canvasWidth - 1;
        const resetPlayerOnTopScreenLimit = 15 * CANVA_SCALEX + ((3 / 4) * CANVA_SCALEX) / 6;
        const resetPlayerOnBottomScreenLimit = (155 - (1 * CANVA_SCALEX) / 2) * CANVA_SCALEY;

        switch (direction) {
            case 'left':
                return resetPlayerOnLeftScreenLimit;
            case 'right':
                return resetPlayerOnRightScreenLimit;
            case 'top':
                return resetPlayerOnTopScreenLimit;
            case 'bottom':
                return resetPlayerOnBottomScreenLimit;
            default:
                return 0;
        }
    }

    private getResetPositionOnScreenLimit(direction: string): number {
        let resetPlayerOnTopScreenLimit = 15 * CANVA_SCALEX + (3 / 4) * CANVA_SCALEX;
        let resetPlayerOnRightScreenLimit = canvas.width - this.Width;
        let resetPlayerOnBottomScreenLimit = (155 - (1 * CANVA_SCALEX) / 4) * CANVA_SCALEY - this.Height;
        let resetPlayerOnLeftScreenLimit = 0;

        switch (direction) {
            case 'left':
                return resetPlayerOnLeftScreenLimit;
            case 'right':
                return resetPlayerOnRightScreenLimit;
            case 'top':
                return resetPlayerOnTopScreenLimit;
            case 'bottom':
                return resetPlayerOnBottomScreenLimit;
            default:
                return 0;
        }
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
            ServiceLocator.GetService<IServiceSceneManager>('SceneManager').PlayMainScene('GameOver');
        }
    }

    public get CanShootRegular(): boolean {
        if (this.currentTimeBeforeNextRegularShoot <= 0) {
            this.currentTimeBeforeNextRegularShoot = this.baseTimeBeforeNextShootInSeconds;
            return true;
        }

        return false;
    }

    public get CanShootSpecial(): boolean {
        if (this.currentTimeBeforeNextSpecialShoot <= 0) {
            this.currentTimeBeforeNextSpecialShoot = this.baseTimeBeforeNextShootInSeconds;
            return true;
        }

        return false;
    }

    get SpecialSkillLevel(): PossibleSkillLevel {
        if (this.specialSkillLevel > 3) {
            return 3;
        }
        return this.specialSkillLevel;
    }

    get SpecialSkillName(): PossibleSkillName | undefined {
        return this.currentSkill.get('special')?.SkillName;
    }

    get EffectSkillLevel(): PossibleSkillLevel {
        if (this.effectSkillLevel > 3) {
            return 3;
        }
        return this.effectSkillLevel;
    }

    get EffectSkillName(): PossibleSkillName | undefined {
        return this.currentSkill.get('effect')?.SkillName;
    }

    get SupportSkillLevel(): PossibleSkillLevel {
        if (this.supportSkillLevel > 3) {
            return 3;
        }
        return this.supportSkillLevel;
    }

    get SupportSkillName(): PossibleSkillName | undefined {
        return this.currentSkill.get('support')?.SkillName;
    }

    get InvulnerabilityTimePeriod(): number {
        return this.invulnerabilityTimePeriod;
    }
}

let player: Player;
export function LoadPlayer() {
    const imgPlayer =
        ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').GetImage('images/Player/Player.png');

    const x = 60 * CANVA_SCALEX;
    const y = 60 * CANVA_SCALEY;

    player = new Player(imgPlayer, x, y);
}

export function UpdatePlayer(dt: number) {
    player.Update(dt);
}

export function DrawPlayer(ctx: CanvasRenderingContext2D) {
    player.Draw(ctx);
}

export function UnloadPlayer() {
    LoadPlayer();
}
