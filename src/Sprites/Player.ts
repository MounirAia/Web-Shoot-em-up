import { Sprite } from './Sprite.js';
import { ServiceLocator } from '../ServiceLocator.js';
import { IServiceImageLoader } from '../ImageLoader.js';
import { canvas, CANVA_SCALEX, CANVA_SCALEY } from '../ScreenConstant.js';
import { Keyboard } from '../Keyboard.js';
import { CreateHitboxes, ISpriteWithHitboxes, CollideScenario, RectangleHitbox } from './SpriteHitbox.js';
import { IServiceGeneratedSpritesManager } from './GeneratedSpriteManager.js';
import { RegularPlayerBullet } from './Bullets/PlayerBullet.js';
import {
    ISpriteWithAttackSpeedUpgrades,
    ISpriteWithAttackSpeed,
    ISpriteWithHealth,
    ISpriteWithDamageUpgrades,
    ISpriteWithHealthUpgrades,
    ISpriteWithSpeed,
    ISpriteWithDamage,
} from './SpriteAttributes.js';
import { IServiceSceneManager } from '../SceneManager.js';
import { RocketSkill } from './PlayerSkills/Special/RocketSkill.js';
import { ISkill, PossibleSkillName } from './PlayerSkills/Skills';
import { CannonConfiguration, IServiceCannonConfigurationGenerator } from './PlayerSkills/Upgrade/RegularCannon.js';
import { BladeExplosionSkill } from './PlayerSkills/Effect/BladeExplosionSkill.js';
import { IServiceEventManager } from '../EventManager';
import { MirrorShieldSkill } from './PlayerSkills/Support/MirrorShield/MirrorShield.js';
export interface IServicePlayer {
    Coordinate(): { x: number; y: number };
    AddDamageUpgrade(upgrade: number): void;
    AddAttackSpeedStats(upgrade: number): void;
    AddHealthUpgrade(upgrade: number): void;
    PlayCollideMethod(collideScenario: CollideScenario, param?: unknown): void;
    MakeTransactionOnWallet(value: number): void;
    IsInvulnerable(): boolean;
    DamageStats: number;
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

    constructor(
        image: HTMLImageElement,
        frameWidth: number,
        frameHeight: number,
        x = 0,
        y = 0,
        spriteXOffset = 0,
        spriteYOffset = 0,
        scaleX = 1,
        scaleY = 1,
    ) {
        super(image, frameWidth, frameHeight, x, y, spriteXOffset, spriteYOffset, scaleX, scaleY);
        ServiceLocator.AddService('Player', this);

        this.baseSpeed = 5;
        this.DamageUpgrades = [];
        this.HealthUpgrades = [];
        this.BaseHealth = 100;
        this.currentHealth = this.BaseHealth;
        this.AttackSpeedUpgrades = [];
        this.BaseAttackSpeed = 3;
        this.moneyInWallet = 0;
        this.specialSkillLevel = 0;
        this.effectSkillLevel = 0;
        this.supportSkillLevel = 0;
        this.invulnerabilityTimePeriod = 1;
        this.baseTimeBeforeNextShoot = 30;
        this.currentTimeBeforeNextShoot = 0;

        // Skill setup
        this.currentSkill = new Map();
        this.currentSkill.set('special', new RocketSkill());
        this.cannonConfiguration =
            ServiceLocator.GetService<IServiceCannonConfigurationGenerator>('CannonConfigurationGenerator').GetConfig();

        this.currentSkill.set('effect', new BladeExplosionSkill());
        const actionOnEnemyDestroyed = () => {
            this.currentSkill.get('effect')?.Effect();
        };
        ServiceLocator.GetService<IServiceEventManager>('EventManager').Subscribe(
            'enemy destroyed',
            actionOnEnemyDestroyed,
        );

        this.currentSkill.set('support', new MirrorShieldSkill());
        this.currentSkill.get('support')?.Effect();

        this.hitboxes = CreateHitboxes(this.X, this.Y, [
            {
                offsetX: 0,
                offsetY: 0,
                width: 22 * CANVA_SCALEX,
                height: 12 * CANVA_SCALEY,
            },
            {
                offsetX: 22 * CANVA_SCALEX,
                offsetY: 1 * CANVA_SCALEY,
                width: 1 * CANVA_SCALEX,
                height: 11 * CANVA_SCALEY,
            },
            {
                offsetX: 23 * CANVA_SCALEX,
                offsetY: 2 * CANVA_SCALEY,
                width: 1 * CANVA_SCALEX,
                height: 10 * CANVA_SCALEY,
            },
            {
                offsetX: 24 * CANVA_SCALEX,
                offsetY: 3 * CANVA_SCALEY,
                width: 1 * CANVA_SCALEX,
                height: 9 * CANVA_SCALEY,
            },
            {
                offsetX: 25 * CANVA_SCALEX,
                offsetY: 4 * CANVA_SCALEY,
                width: 1 * CANVA_SCALEX,
                height: 8 * CANVA_SCALEY,
            },
            {
                offsetX: 26 * CANVA_SCALEX,
                offsetY: 5 * CANVA_SCALEY,
                width: 1 * CANVA_SCALEX,
                height: 7 * CANVA_SCALEY,
            },
            {
                offsetX: 27 * CANVA_SCALEX,
                offsetY: 6 * CANVA_SCALEY,
                width: 1 * CANVA_SCALEX,
                height: 6 * CANVA_SCALEY,
            },
            {
                offsetX: 28 * CANVA_SCALEX,
                offsetY: 7 * CANVA_SCALEY,
                width: 6 * CANVA_SCALEX,
                height: 4 * CANVA_SCALEY,
            },
        ]);

        this.hitboxes = [...this.hitboxes, ...this.cannonConfiguration.CurrentHitboxes];

        this.AnimationsController.AddAnimation({ animation: 'idle', frames: [0], framesLengthInTime: 1 });
        this.AnimationsController.AddAnimation({
            animation: 'damaged',
            frames: [1, 0],
            framesLengthInTime: 0.1,
            beforePlayingAnimation: () => {
                this.cannonConfiguration.PlayAnimation('damaged');
            },
            afterPlayingAnimation: () => {
                this.AnimationsController.PlayAnimation({ animation: 'idle' });
            },
        });
        this.AnimationsController.AddAnimation({
            animation: 'invulnerable',
            frames: [1, 0, 1, 0, 1],
            framesLengthInTime: this.invulnerabilityTimePeriod / 5,
            beforePlayingAnimation: () => {
                this.cannonConfiguration.PlayAnimation('invulnerable');
            },
            afterPlayingAnimation: () => {
                this.AnimationsController.PlayAnimation({ animation: 'idle' });
            },
        });
        this.AnimationsController.AddAnimation({
            animation: 'destroyed',
            frames: [2, 3, 4, 5, 6, 7, 8, 9],
            framesLengthInTime: 0.1,
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
            this.AnimationsController.PlayAnimation({ animation: 'damaged' });

            const myBullet = bullet as ISpriteWithDamage;
            this.CurrentHealth -= myBullet.Damage;
        });

        this.Collide.set('WithEnemy', (enemy: unknown) => {
            this.AnimationsController.PlayAnimation({ animation: 'invulnerable' });

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
        this.UpdateHitboxes(dt);
        this.cannonConfiguration.Update(dt);

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

    Draw(ctx: CanvasRenderingContext2D) {
        super.Draw(ctx);
        this.cannonConfiguration.Draw(ctx);
    }

    Coordinate(): { x: number; y: number } {
        return { x: this.X, y: this.Y };
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

    get DamageStats(): number {
        return this.DamageUpgrades.reduce((total, damage) => {
            return total + damage;
        }, 1);
    }
    AddDamageUpgrade(upgrade: number): void {
        if (upgrade > 0) this.DamageUpgrades.push(upgrade);
    }
    get NumberOfDamageUpgrade(): number {
        return this.DamageUpgrades.length;
    }

    AddHealthUpgrade(upgrade: number): void {
        if (upgrade > 0) this.HealthUpgrades.push(upgrade);
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
    AddAttackSpeedStats(upgrade: number): void {
        if (upgrade > 0) this.AttackSpeedUpgrades.push(upgrade);
    }

    public get CanShoot(): boolean {
        if (this.currentTimeBeforeNextShoot <= 0) {
            this.currentTimeBeforeNextShoot = this.baseTimeBeforeNextShoot;
            return true;
        }

        return false;
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

    IsInvulnerable(): boolean {
        return this.AnimationsController.CurrentAnimationName === 'invulnerable';
    }

    get InvulnerabilityTimePeriod(): number {
        return this.invulnerabilityTimePeriod;
    }

    private removePlayerFromGameFlow() {
        this.hitboxes = [];
    }
}

let player: Player;
export function LoadPlayer() {
    const imgPlayer =
        ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').GetImage('images/Player/player.png');
    const frameWidth = 64;
    const frameHeight = 64;
    const x = 250;
    const y = 250;
    const scaleX = CANVA_SCALEX;
    const scaleY = CANVA_SCALEY;
    player = new Player(
        imgPlayer,
        frameWidth,
        frameHeight,
        x,
        y,
        -18 * CANVA_SCALEX,
        -25 * CANVA_SCALEY,
        scaleX,
        scaleY,
    );
}

export function UpdatePlayer(dt: number) {
    player.Update(dt);
}

export function DrawPlayer(ctx: CanvasRenderingContext2D) {
    player.Draw(ctx);
}
