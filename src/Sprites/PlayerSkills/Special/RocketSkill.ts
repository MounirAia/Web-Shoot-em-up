import { IServiceImageLoader } from '../../../ImageLoader.js';
import { canvas, CANVA_SCALEX, CANVA_SCALEY } from '../../../ScreenConstant.js';
import { ServiceLocator } from '../../../ServiceLocator.js';
import { IServiceGeneratedSpritesManager, IGeneratedSprite } from '../../GeneratedSpriteManager.js';
import { IServiceCollideManager } from '../../CollideManager.js';
import { ISpriteWithSpeed } from '../../SpriteAttributes.js';
import { CreateHitboxes, ISpriteWithHitboxes, RectangleHitbox, CollideScenario } from '../../SpriteHitbox.js';
import { IServicePlayer } from '../../Player.js';
import { Sprite } from '../../Sprite.js';
import { RocketDamageStats } from '../../../StatsJSON/Skills/Special/Rocket/RocketDamage.js';
import { ISkill, PossibleSkillName } from '../Skills.js';
import { SkillsTypeName } from '../Skills.js';
import { RocketConstant } from '../../../StatsJSON/Skills/Special/Rocket/RocketConstant.js';

export class RocketBulletLevel1 extends Sprite implements ISpriteWithSpeed, ISpriteWithHitboxes, IGeneratedSprite {
    Generator: 'player' | 'enemy';
    Category: 'projectile' | 'nonProjectile';
    BaseSpeed: number;
    Damage: number;
    CurrentHitbox: RectangleHitbox[];
    Collide: Map<CollideScenario, (param?: unknown) => void>;

    constructor(x: number, y: number) {
        super(
            ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').GetImage(
                'images/Skills/Rocket/RocketProjectileLevel1.png',
            ),
            16,
            16,
            x,
            y,
            -6 * CANVA_SCALEX,
            -5 * CANVA_SCALEY,
            CANVA_SCALEX,
            CANVA_SCALEY,
        );
        this.Generator = 'player';
        this.Category = 'projectile';
        this.BaseSpeed = RocketConstant[0].projectileSpeed;
        const playersDamageUpgrade = ServiceLocator.GetService<IServicePlayer>('Player').NumberOfDamageUpgrade;
        this.Damage = RocketDamageStats[playersDamageUpgrade].rocketL1;
        const defaultHitbox = CreateHitboxes(this.X, this.Y, [
            {
                offsetX: 0 * CANVA_SCALEX,
                offsetY: 0 * CANVA_SCALEY,
                width: 1 * CANVA_SCALEX,
                height: 1 * CANVA_SCALEY,
            },
            {
                offsetX: 1 * CANVA_SCALEX,
                offsetY: 1 * CANVA_SCALEY,
                width: 2 * CANVA_SCALEX,
                height: 3 * CANVA_SCALEY,
            },
            {
                offsetX: 0 * CANVA_SCALEX,
                offsetY: 4 * CANVA_SCALEY,
                width: 1 * CANVA_SCALEX,
                height: 1 * CANVA_SCALEY,
            },
        ]);
        const frame1Hitbox = CreateHitboxes(this.X, this.Y, [
            {
                offsetX: -2 * CANVA_SCALEX,
                offsetY: -2 * CANVA_SCALEY,
                width: 7 * CANVA_SCALEX,
                height: 9 * CANVA_SCALEY,
            },
        ]);
        const frame2Hitbox = CreateHitboxes(this.X, this.Y, [
            {
                offsetX: -3 * CANVA_SCALEX,
                offsetY: -3 * CANVA_SCALEY,
                width: 9 * CANVA_SCALEX,
                height: 11 * CANVA_SCALEY,
            },
        ]);

        this.CurrentHitbox = defaultHitbox;
        this.AddAnimation('idle', [0], 1);
        this.AddAnimation(
            'destroyed',
            [0, 1, 2, 3, 4, 5],
            0.03,
            () => {
                this.BaseSpeed /= 2;
            },
            () => {
                ServiceLocator.GetService<IServiceGeneratedSpritesManager>('GeneratedSpritesManager').RemoveSprite(
                    this,
                );
            },
            new Map([
                [
                    1,
                    () => {
                        this.CurrentHitbox = frame1Hitbox;
                        this.Damage = RocketDamageStats[playersDamageUpgrade].radius1L1;
                    },
                ],
                [
                    2,
                    () => {
                        this.CurrentHitbox = frame2Hitbox;
                        this.Damage = RocketDamageStats[playersDamageUpgrade].radius2L1;
                    },
                ],
                [
                    3,
                    () => {
                        // remove hitbox there
                        this.CurrentHitbox = RectangleHitbox.NoHitbox;
                    },
                ],
            ]),
        );
        this.PlayAnimation('idle', false);

        this.Collide = new Map();
        this.Collide.set('WithEnemy', () => {
            this.PlayAnimation('destroyed');
        });
    }

    UpdateHitboxes(dt: number) {
        this.CurrentHitbox.forEach((hitbox) => {
            hitbox.SpriteX = this.X;
            hitbox.SpriteY = this.Y;
        });
    }

    public Update(dt: number) {
        super.Update(dt);
        this.X += this.BaseSpeed;
        this.UpdateHitboxes(dt);

        if (this.X > canvas.width || this.X < 0 || this.Y > canvas.height || this.Y < 0) {
            ServiceLocator.GetService<IServiceGeneratedSpritesManager>('GeneratedSpritesManager').RemoveSprite(this);
        }

        const collideManager = ServiceLocator.GetService<IServiceCollideManager>('CollideManager');
        collideManager.HandleWhenPlayerProjectileCollideWithEnemies(this);
    }

    public Draw(ctx: CanvasRenderingContext2D): void {
        super.Draw(ctx);
    }
}

export class RocketBulletLevel2 extends Sprite implements ISpriteWithSpeed, ISpriteWithHitboxes, IGeneratedSprite {
    Generator: 'player' | 'enemy';
    Category: 'projectile' | 'nonProjectile';
    BaseSpeed: number;
    Damage: number;
    CurrentHitbox: RectangleHitbox[];
    Collide: Map<CollideScenario, (param?: unknown) => void>;

    constructor(x: number, y: number) {
        super(
            ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').GetImage(
                'images/Skills/Rocket/RocketProjectileLevel2.png',
            ),
            16,
            16,
            x,
            y,
            -5 * CANVA_SCALEX,
            -6 * CANVA_SCALEY,
            CANVA_SCALEX,
            CANVA_SCALEY,
        );
        this.Generator = 'player';
        this.Category = 'projectile';
        this.BaseSpeed = RocketConstant[1].projectileSpeed;
        const playersDamageUpgrade = ServiceLocator.GetService<IServicePlayer>('Player').NumberOfDamageUpgrade;
        this.Damage = RocketDamageStats[playersDamageUpgrade].rocketL2;
        const defaultHitbox = CreateHitboxes(this.X, this.Y, [
            {
                offsetX: 0 * CANVA_SCALEX,
                offsetY: 1 * CANVA_SCALEY,
                width: 1 * CANVA_SCALEX,
                height: 1 * CANVA_SCALEY,
            },
            {
                offsetX: 1 * CANVA_SCALEX,
                offsetY: 0 * CANVA_SCALEY,
                width: 4 * CANVA_SCALEX,
                height: 3 * CANVA_SCALEY,
            },
            {
                offsetX: 5 * CANVA_SCALEX,
                offsetY: 1 * CANVA_SCALEY,
                width: 1 * CANVA_SCALEX,
                height: 1 * CANVA_SCALEY,
            },
        ]);
        const frame1Hitbox = CreateHitboxes(this.X, this.Y, [
            {
                offsetX: -3 * CANVA_SCALEX,
                offsetY: -5 * CANVA_SCALEY,
                width: 12 * CANVA_SCALEX,
                height: 13 * CANVA_SCALEY,
            },
        ]);
        const frame2Hitbox = CreateHitboxes(this.X, this.Y, [
            {
                offsetX: -4 * CANVA_SCALEX,
                offsetY: -6 * CANVA_SCALEY,
                width: 14 * CANVA_SCALEX,
                height: 15 * CANVA_SCALEY,
            },
        ]);
        this.CurrentHitbox = defaultHitbox;

        this.AddAnimation('idle', [0], 1);
        this.AddAnimation(
            'destroyed',
            [0, 1, 2, 3, 4, 5],
            0.03,
            () => {
                this.BaseSpeed /= 2;
            },
            () => {
                ServiceLocator.GetService<IServiceGeneratedSpritesManager>('GeneratedSpritesManager').RemoveSprite(
                    this,
                );
            },
            new Map([
                [
                    1,
                    () => {
                        this.CurrentHitbox = frame1Hitbox;
                        this.Damage = RocketDamageStats[playersDamageUpgrade].radius1L2;
                    },
                ],
                [
                    2,
                    () => {
                        this.CurrentHitbox = frame2Hitbox;
                        this.Damage = RocketDamageStats[playersDamageUpgrade].radius2L2;
                    },
                ],
                [
                    3,
                    () => {
                        // remove hitbox there
                        this.CurrentHitbox = RectangleHitbox.NoHitbox;
                    },
                ],
            ]),
        );
        this.PlayAnimation('idle', false);

        this.Collide = new Map();
        this.Collide.set('WithEnemy', () => {
            this.PlayAnimation('destroyed');
        });
    }

    UpdateHitboxes(dt: number) {
        this.CurrentHitbox.forEach((hitbox) => {
            hitbox.SpriteX = this.X;
            hitbox.SpriteY = this.Y;
        });
    }

    public Update(dt: number) {
        super.Update(dt);
        this.X += this.BaseSpeed;
        this.UpdateHitboxes(dt);

        if (this.X > canvas.width || this.X < 0 || this.Y > canvas.height || this.Y < 0) {
            ServiceLocator.GetService<IServiceGeneratedSpritesManager>('GeneratedSpritesManager').RemoveSprite(this);
        }

        const collideManager = ServiceLocator.GetService<IServiceCollideManager>('CollideManager');
        collideManager.HandleWhenPlayerProjectileCollideWithEnemies(this);
    }

    public Draw(ctx: CanvasRenderingContext2D): void {
        super.Draw(ctx);
    }
}
class RocketSubBullet extends Sprite implements ISpriteWithSpeed, ISpriteWithHitboxes, IGeneratedSprite {
    Generator: 'player' | 'enemy';
    Category: 'projectile' | 'nonProjectile';
    BaseSpeed: number;
    Damage: number;
    CurrentHitbox: RectangleHitbox[];
    Collide: Map<CollideScenario, (param?: unknown) => void>;

    constructor(x: number, y: number, direction: 'up' | 'down') {
        super(
            ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').GetImage(
                'images/Skills/Rocket/RocketSubProjectileLevel3.png',
            ),
            16,
            16,
            x,
            y,
            -6 * CANVA_SCALEX,
            -7 * CANVA_SCALEY,
            CANVA_SCALEX,
            CANVA_SCALEY,
        );
        this.Generator = 'player';
        this.Category = 'projectile';
        const projectileSpeed = RocketConstant[2].projectileSpeed;
        this.BaseSpeed = direction === 'up' ? -projectileSpeed : projectileSpeed;
        const playersDamageUpgrade = ServiceLocator.GetService<IServicePlayer>('Player').NumberOfDamageUpgrade;
        this.Damage = RocketDamageStats[playersDamageUpgrade].subProjectileL3;
        const defaultHitbox = CreateHitboxes(this.X, this.Y, [
            {
                offsetX: 0 * CANVA_SCALEX,
                offsetY: 0 * CANVA_SCALEY,
                width: 3 * CANVA_SCALEX,
                height: 2 * CANVA_SCALEY,
            },
        ]);
        const frame1Hitbox = CreateHitboxes(this.X, this.Y, [
            {
                offsetX: -2 * CANVA_SCALEX,
                offsetY: -2 * CANVA_SCALEY,
                width: 7 * CANVA_SCALEX,
                height: 7 * CANVA_SCALEY,
            },
        ]);
        this.CurrentHitbox = defaultHitbox;

        this.AddAnimation('idle', [0], 1);
        this.AddAnimation(
            'destroyed',
            [0, 1, 2, 3, 4],
            0.03,
            () => {
                this.BaseSpeed /= 2;
            },
            () => {
                ServiceLocator.GetService<IServiceGeneratedSpritesManager>('GeneratedSpritesManager').RemoveSprite(
                    this,
                );
            },
            new Map([
                [
                    1,
                    () => {
                        this.CurrentHitbox = frame1Hitbox;
                    },
                ],
                [
                    2,
                    () => {
                        this.CurrentHitbox = RectangleHitbox.NoHitbox;
                    },
                ],
            ]),
        );
        this.PlayAnimation('idle', false);

        this.Collide = new Map();
        this.Collide.set('WithEnemy', () => {
            this.PlayAnimation('destroyed');
        });
    }

    UpdateHitboxes(dt: number) {
        this.CurrentHitbox.forEach((hitbox) => {
            hitbox.SpriteX = this.X;
            hitbox.SpriteY = this.Y;
        });
    }

    public Update(dt: number) {
        super.Update(dt);
        this.Y += this.BaseSpeed;
        this.UpdateHitboxes(dt);

        if (this.X > canvas.width || this.X < 0 || this.Y > canvas.height || this.Y < 0) {
            ServiceLocator.GetService<IServiceGeneratedSpritesManager>('GeneratedSpritesManager').RemoveSprite(this);
        }

        const collideManager = ServiceLocator.GetService<IServiceCollideManager>('CollideManager');
        collideManager.HandleWhenPlayerProjectileCollideWithEnemies(this);
    }

    public Draw(ctx: CanvasRenderingContext2D): void {
        super.Draw(ctx);
    }
}

export class RocketBulletLevel3 extends Sprite implements ISpriteWithSpeed, ISpriteWithHitboxes, IGeneratedSprite {
    Generator: 'player' | 'enemy';
    Category: 'projectile' | 'nonProjectile';
    BaseSpeed: number;
    Damage: number;
    CurrentHitbox: RectangleHitbox[];
    Collide: Map<CollideScenario, (param?: unknown) => void>;

    constructor(x: number, y: number) {
        super(
            ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').GetImage(
                'images/Skills/Rocket/RocketProjectileLevel3.png',
            ),
            16,
            16,
            x,
            y,
            -4 * CANVA_SCALEX,
            -5 * CANVA_SCALEY,
            CANVA_SCALEX,
            CANVA_SCALEY,
        );
        this.Generator = 'player';
        this.Category = 'projectile';
        this.BaseSpeed = RocketConstant[2].projectileSpeed;
        const playersDamageUpgrade = ServiceLocator.GetService<IServicePlayer>('Player').NumberOfDamageUpgrade;
        this.Damage = RocketDamageStats[playersDamageUpgrade].rocketL3;
        const defaultHitbox = CreateHitboxes(this.X, this.Y, [
            {
                offsetX: 0 * CANVA_SCALEX,
                offsetY: 2 * CANVA_SCALEY,
                width: 1 * CANVA_SCALEX,
                height: 2 * CANVA_SCALEY,
            },
            {
                offsetX: 1 * CANVA_SCALEX,
                offsetY: 1 * CANVA_SCALEY,
                width: 1 * CANVA_SCALEX,
                height: 4 * CANVA_SCALEY,
            },
            {
                offsetX: 2 * CANVA_SCALEX,
                offsetY: 0 * CANVA_SCALEY,
                width: 5 * CANVA_SCALEX,
                height: 6 * CANVA_SCALEY,
            },
            {
                offsetX: 7 * CANVA_SCALEX,
                offsetY: 1 * CANVA_SCALEY,
                width: 1 * CANVA_SCALEX,
                height: 4 * CANVA_SCALEY,
            },
            {
                offsetX: 8 * CANVA_SCALEX,
                offsetY: 2 * CANVA_SCALEY,
                width: 1 * CANVA_SCALEX,
                height: 2 * CANVA_SCALEY,
            },
        ]);
        const frame1Hitbox = CreateHitboxes(this.X, this.Y, [
            {
                offsetX: -3 * CANVA_SCALEX,
                offsetY: -2 * CANVA_SCALEY,
                width: 15 * CANVA_SCALEX,
                height: 13 * CANVA_SCALEY,
            },
        ]);
        const frame2Hitbox = CreateHitboxes(this.X, this.Y, [
            {
                offsetX: -4 * CANVA_SCALEX,
                offsetY: -5 * CANVA_SCALEY,
                width: 16 * CANVA_SCALEX,
                height: 16 * CANVA_SCALEY,
            },
        ]);
        this.CurrentHitbox = defaultHitbox;

        this.AddAnimation('idle', [0], 1);
        this.AddAnimation(
            'destroyed',
            [0, 1, 2, 3, 4, 5],
            0.03,
            () => {
                this.BaseSpeed /= 2;
            },
            () => {
                ServiceLocator.GetService<IServiceGeneratedSpritesManager>('GeneratedSpritesManager').RemoveSprite(
                    this,
                );
            },
            new Map([
                [
                    1,
                    () => {
                        this.CurrentHitbox = frame1Hitbox;
                        this.Damage = RocketDamageStats[playersDamageUpgrade].radius1L3;
                    },
                ],
                [
                    2,
                    () => {
                        this.CurrentHitbox = frame2Hitbox;
                        this.Damage = RocketDamageStats[playersDamageUpgrade].radius2L3;
                        const upSubBullet = new RocketSubBullet(this.X + 3 * CANVA_SCALEX, this.Y, 'up');
                        const downSubBullet = new RocketSubBullet(
                            this.X + 3 * CANVA_SCALEX,
                            this.Y + 4 * CANVA_SCALEY,
                            'down',
                        );
                        ServiceLocator.GetService<IServiceGeneratedSpritesManager>('GeneratedSpritesManager').AddSprite(
                            upSubBullet,
                        );
                        ServiceLocator.GetService<IServiceGeneratedSpritesManager>('GeneratedSpritesManager').AddSprite(
                            downSubBullet,
                        );
                    },
                ],
                [
                    3,
                    () => {
                        // remove hitbox there
                        this.CurrentHitbox = RectangleHitbox.NoHitbox;
                    },
                ],
            ]),
        );
        this.PlayAnimation('idle', false);

        this.Collide = new Map();
        this.Collide.set('WithEnemy', () => {
            this.PlayAnimation('destroyed');
        });
    }

    UpdateHitboxes(dt: number) {
        this.CurrentHitbox.forEach((hitbox) => {
            hitbox.SpriteX = this.X;
            hitbox.SpriteY = this.Y;
        });
    }

    public Update(dt: number) {
        super.Update(dt);
        this.X += this.BaseSpeed;
        this.UpdateHitboxes(dt);
        if (this.X > canvas.width || this.X < 0 || this.Y > canvas.height || this.Y < 0) {
            ServiceLocator.GetService<IServiceGeneratedSpritesManager>('GeneratedSpritesManager').RemoveSprite(this);
        }

        const collideManager = ServiceLocator.GetService<IServiceCollideManager>('CollideManager');
        collideManager.HandleWhenPlayerProjectileCollideWithEnemies(this);
    }

    public Draw(ctx: CanvasRenderingContext2D): void {
        super.Draw(ctx);
    }
}

export class RocketSkill implements ISkill {
    readonly Type: SkillsTypeName;
    readonly SkillName: PossibleSkillName;
    constructor() {
        this.Type = 'special';
        this.SkillName = RocketConstant[0].skillName;
    }

    public Effect() {
        let { x: playerX, y: playerY } = ServiceLocator.GetService<IServicePlayer>('Player').Coordinate();
        const skillLevel = ServiceLocator.GetService<IServicePlayer>('Player').SpecialSkillLevel;
        const rockets: IGeneratedSprite[] = [];

        if (skillLevel === 1) {
            rockets.push(new RocketBulletLevel1(playerX + 19 * CANVA_SCALEX, playerY - 5 * CANVA_SCALEY));
        } else if (skillLevel === 2) {
            rockets.push(new RocketBulletLevel2(playerX + 19 * CANVA_SCALEX, playerY - 5 * CANVA_SCALEY));
            rockets.push(new RocketBulletLevel2(playerX + 19 * CANVA_SCALEX, playerY + 12 * CANVA_SCALEY));
        } else if (skillLevel === 3) {
            const rocket1 = new RocketBulletLevel3(playerX + 19 * CANVA_SCALEX, playerY - 5 * CANVA_SCALEY);
            const rocket2 = new RocketBulletLevel3(playerX + 19 * CANVA_SCALEX, playerY + 12 * CANVA_SCALEY);
            rockets.push(rocket1, rocket2);
        }

        if (rockets) {
            rockets.forEach((rocket) => {
                ServiceLocator.GetService<IServiceGeneratedSpritesManager>('GeneratedSpritesManager').AddSprite(rocket);
            });
        }
    }
}