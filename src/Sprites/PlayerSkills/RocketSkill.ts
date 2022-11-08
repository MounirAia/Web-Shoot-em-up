import { IServiceImageLoader } from '../../ImageLoader.js';
import { canvas, CANVA_SCALEX, CANVA_SCALEY } from '../../ScreenConstant.js';
import { ServiceLocator } from '../../ServiceLocator.js';
import { IServiceBulletManager } from '../Bullets/BulletManager.js';
import { IBullet } from '../Bullets/IBullet.js';
import { CollideScenario, ICollidableSprite, IServiceCollideManager } from '../CollideManager.js';
import { IMovableSprite } from '../InterfaceBehaviour/IMovableSprite.js';
import { CreateHitboxes, ISpriteWithHitboxes, RectangleHitbox } from '../InterfaceBehaviour/ISpriteWithHitboxes.js';
import { IServicePlayer } from '../Player.js';
import { Sprite } from '../Sprite.js';

// based on the level of the skills you call the good private effect method
// I will need an Upgrade method, that add a level to the rocket skill
// I will need to update the collision system to handle special collision based on the frame of the sprite
// I will need to change the type of the possible type of a skills in the rocket skill class
// I will have to remove the rocket skills from the player class (preventing of forgeting it)
// From that start deriving a common interface for a skill to follow (Will probably be finalized when I will implement the 3 types of skills)
// How to manage the shooting rate of a special skill (when player press space bar shoot?)
// How can the service locator be useful for managing the different skills

export class RocketBulletLevel1
    extends Sprite
    implements IBullet, IMovableSprite, ISpriteWithHitboxes, ICollidableSprite
{
    Type: 'player' | 'enemy' = 'player';
    BaseSpeed: number = 10;
    Damage: number = 3;
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
            6 * CANVA_SCALEX,
            5 * CANVA_SCALEY,
            CANVA_SCALEX,
            CANVA_SCALEY,
        );
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
                ServiceLocator.GetService<IServiceBulletManager>('BulletManager').RemoveBullet(this);
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
                        this.CurrentHitbox = frame2Hitbox;
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

        if (this.X > canvas.width || this.X < 0 || this.Y > canvas.height || this.Y < 0) {
            ServiceLocator.GetService<IServiceBulletManager>('BulletManager').RemoveBullet(this);
        }

        const collideManager = ServiceLocator.GetService<IServiceCollideManager>('CollideManager');
        collideManager.HandleWhenBulletCollideWithEnemies(this);

        this.UpdateHitboxes(dt);
    }

    public Draw(ctx: CanvasRenderingContext2D): void {
        super.Draw(ctx);
    }
}

export class RocketBulletLevel2
    extends Sprite
    implements IBullet, IMovableSprite, ISpriteWithHitboxes, ICollidableSprite
{
    Type: 'player' | 'enemy' = 'player';
    BaseSpeed: number = 10;
    Damage: number = 3;
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
            5 * CANVA_SCALEX,
            6 * CANVA_SCALEY,
            CANVA_SCALEX,
            CANVA_SCALEY,
        );

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
                ServiceLocator.GetService<IServiceBulletManager>('BulletManager').RemoveBullet(this);
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
                        this.CurrentHitbox = frame2Hitbox;
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

        if (this.X > canvas.width || this.X < 0 || this.Y > canvas.height || this.Y < 0) {
            ServiceLocator.GetService<IServiceBulletManager>('BulletManager').RemoveBullet(this);
        }

        const collideManager = ServiceLocator.GetService<IServiceCollideManager>('CollideManager');
        collideManager.HandleWhenBulletCollideWithEnemies(this);

        this.UpdateHitboxes(dt);
    }

    public Draw(ctx: CanvasRenderingContext2D): void {
        super.Draw(ctx);
    }
}
class RocketSubBullet extends Sprite implements IBullet, IMovableSprite, ISpriteWithHitboxes, ICollidableSprite {
    Type: 'player' | 'enemy' = 'player';
    BaseSpeed: number;
    Damage: number = 3;
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
            6 * CANVA_SCALEX,
            7 * CANVA_SCALEY,
            CANVA_SCALEX,
            CANVA_SCALEY,
        );

        this.BaseSpeed = direction === 'up' ? -10 : 10;

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
                ServiceLocator.GetService<IServiceBulletManager>('BulletManager').RemoveBullet(this);
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

        if (this.X > canvas.width || this.X < 0 || this.Y > canvas.height || this.Y < 0) {
            ServiceLocator.GetService<IServiceBulletManager>('BulletManager').RemoveBullet(this);
        }

        const collideManager = ServiceLocator.GetService<IServiceCollideManager>('CollideManager');
        collideManager.HandleWhenBulletCollideWithEnemies(this);

        this.UpdateHitboxes(dt);
    }

    public Draw(ctx: CanvasRenderingContext2D): void {
        super.Draw(ctx);
    }
}

export class RocketBulletLevel3
    extends Sprite
    implements IBullet, IMovableSprite, ISpriteWithHitboxes, ICollidableSprite
{
    Type: 'player' | 'enemy' = 'player';
    BaseSpeed: number = 10;
    Damage: number = 3;
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
            4 * CANVA_SCALEX,
            5 * CANVA_SCALEY,
            CANVA_SCALEX,
            CANVA_SCALEY,
        );

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
                ServiceLocator.GetService<IServiceBulletManager>('BulletManager').RemoveBullet(this);
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
                        this.CurrentHitbox = frame2Hitbox;
                        const upSubBullet = new RocketSubBullet(this.X + 3 * CANVA_SCALEX, this.Y, 'up');
                        const downSubBullet = new RocketSubBullet(
                            this.X + 3 * CANVA_SCALEX,
                            this.Y + 4 * CANVA_SCALEY,
                            'down',
                        );
                        ServiceLocator.GetService<IServiceBulletManager>('BulletManager').AddBullet(upSubBullet);
                        ServiceLocator.GetService<IServiceBulletManager>('BulletManager').AddBullet(downSubBullet);
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

        if (this.X > canvas.width || this.X < 0 || this.Y > canvas.height || this.Y < 0) {
            ServiceLocator.GetService<IServiceBulletManager>('BulletManager').RemoveBullet(this);
        }

        const collideManager = ServiceLocator.GetService<IServiceCollideManager>('CollideManager');
        collideManager.HandleWhenBulletCollideWithEnemies(this);

        this.UpdateHitboxes(dt);
    }

    public Draw(ctx: CanvasRenderingContext2D): void {
        super.Draw(ctx);
    }
}

type SkillsTypeName = 'special' | 'support' | 'effect';

export class RocketSkill {
    Type: SkillsTypeName;

    constructor() {
        this.Type = 'special';
    }

    public Effect() {
        let { x, y } = ServiceLocator.GetService<IServicePlayer>('Player').Coordinate();

        const rocket = new RocketBulletLevel3(x + 24 * CANVA_SCALEX, y - 4 * CANVA_SCALEY);
        ServiceLocator.GetService<IServiceBulletManager>('BulletManager').AddBullet(rocket);
    }
}
