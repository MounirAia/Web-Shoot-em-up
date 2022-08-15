import { Sprite } from './Sprite.js';
import { ServiceLocator } from '../ServiceLocator.js';
import { IServiceImageLoader } from '../ImageLoader.js';
import { canvas, CANVA_SCALEX, CANVA_SCALEY } from '../ScreenConstant.js';
import { Keyboard } from '../Keyboard.js';
import { IMovableSprite } from './InterfaceBehaviour/IMovableSprite.js';
import { CreateHitboxes, ISpriteWithHitboxes, RectangleHitbox } from './InterfaceBehaviour/ISpriteWithHitboxes.js';
import { IServiceBulletManager } from './Bullets/BulletManager.js';
import { RegularPlayerBullet } from './Bullets/PlayerBullet.js';
import {
    ISpriteWithAttackSpeedUpgrades,
    ISpriteWithBaseAttackSpeed,
    ISpriteWithBaseHealth,
    ISpriteWithDamageUpgrades,
    ISpriteWithHealthUpgrades,
} from './InterfaceBehaviour/ISpriteWithStats.js';
import { CollideScenario, ICollidableSprite } from './CollideManager.js';
import { IBullet } from './Bullets/IBullet.js';
import { IServiceSceneManager } from '../SceneManager.js';

export interface IServicePlayer {
    Coordinate(): { x: number; y: number };
    AddDamageUpgrade(upgrade: number): void;
    AddAttackSpeedStats(upgrade: number): void;
    AddHealthUpgrade(upgrade: number): void;
    PlayCollideMethod(collideScenario: CollideScenario, param?: unknown): void;
    MakeTransactionOnWallet(value: number): void;
    IsInvulnerable(): boolean;
    DamageStats: number;
    Hitboxes: RectangleHitbox[];
}

export class Player
    extends Sprite
    implements
        IServicePlayer,
        IMovableSprite,
        ISpriteWithHitboxes,
        ICollidableSprite,
        ISpriteWithDamageUpgrades,
        ISpriteWithBaseHealth,
        ISpriteWithHealthUpgrades,
        ISpriteWithBaseAttackSpeed,
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

    // makes player invulnerable, ex:when collide with enemies
    private readonly invulnerabilityTimePeriod: number;

    // Manage shooting rate of the player
    private baseTimeBeforeNextShoot: number;
    private currentTimeBeforeNextShoot: number;

    constructor(
        image: HTMLImageElement,
        frameWidth: number,
        frameHeight: number,
        x: number = 0,
        y: number = 0,
        spriteXOffset: number = 0,
        spriteYOffset: number = 0,
        scaleX: number = 1,
        scaleY: number = 1,
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
        this.invulnerabilityTimePeriod = 1;
        this.baseTimeBeforeNextShoot = 30;
        this.currentTimeBeforeNextShoot = 0;

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

        this.AddAnimation('idle', [0], 1);
        this.AddAnimation('damaged', [1], 0.1, undefined, () => {
            this.PlayAnimation('idle');
        });
        this.AddAnimation('invulnerable', [1, 0, 1, 0, 1], this.invulnerabilityTimePeriod / 5, undefined, () => {
            this.PlayAnimation('idle');
        });
        this.AddAnimation('destroyed', [2, 3, 4, 5, 6, 7, 8, 9], 0.1, () => {
            this.removePlayerFromGameFlow();
        });

        this.Collide = new Map();

        this.Collide.set('WithBullet', (bullet: unknown) => {
            this.PlayAnimation('damaged', false);

            const myBullet = bullet as IBullet;
            this.CurrentHealth -= myBullet.Damage;
        });

        this.Collide.set('WithEnemy', (enemy: unknown) => {
            this.PlayAnimation('invulnerable', false);

            this.CurrentHealth -= this.MaxHealth * 0.5;
        });

        this.PlayAnimation('idle', false);
    }

    public UpdateHitboxes(dt: number): void {
        this.Hitboxes.forEach((hitbox) => {
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
        for (const hitbox of this.Hitboxes) {
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

        if (Keyboard.Space.IsDown && this.CanShoot) {
            const bullet = new RegularPlayerBullet(this.X + 34 * CANVA_SCALEX, this.Y + 8 * CANVA_SCALEY);
            ServiceLocator.GetService<IServiceBulletManager>('BulletManager').AddBullet(bullet);
        } else {
            if (this.currentTimeBeforeNextShoot >= 0) {
                this.currentTimeBeforeNextShoot -= this.AttackSpeed;
            }
        }

        this.UpdateHitboxes(dt);
    }

    Coordinate(): { x: number; y: number } {
        return { x: this.X, y: this.Y };
    }

    get Hitboxes(): RectangleHitbox[] {
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
            this.PlayAnimation('destroyed');
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

    IsInvulnerable(): boolean {
        return this.CurrentAnimationName === 'invulnerable';
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
    player = new Player(imgPlayer, frameWidth, frameHeight, x, y, 18 * CANVA_SCALEX, 25 * CANVA_SCALEY, scaleX, scaleY);
}

export function UpdatePlayer(dt: number) {
    player.Update(dt);
}

export function DrawPlayer(ctx: CanvasRenderingContext2D) {
    player.Draw(ctx);
}
