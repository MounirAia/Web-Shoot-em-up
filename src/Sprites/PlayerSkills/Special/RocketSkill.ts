import { IServiceImageLoader } from '../../../ImageLoader.js';
import { CANVA_SCALEX, CANVA_SCALEY, canvas } from '../../../ScreenConstant.js';
import { ServiceLocator } from '../../../ServiceLocator.js';
import { RocketConstant } from '../../../StatsJSON/Skills/Special/Rocket/RocketConstant.js';
import { RocketDamageStats } from '../../../StatsJSON/Skills/Special/Rocket/RocketDamage.js';
import { IServiceUtilManager } from '../../../UtilManager.js';
import { IServiceCollideManager } from '../../CollideManager.js';
import { IGeneratedSprite, IServiceGeneratedSpritesManager } from '../../GeneratedSpriteManager.js';
import { IServicePlayer } from '../../Player.js';
import { PlayerProjectileDamageEffectController } from '../../PlayerProjectileDamageEffectsController.js';
import { Sprite } from '../../Sprite.js';
import { ISpriteWithDamage, ISpriteWithDamageEffects, ISpriteWithSpeed } from '../../SpriteAttributes.js';
import {
    CollideScenario,
    CreateHitboxesWithInfoFile,
    ISpriteWithHitboxes,
    RectangleHitbox,
} from '../../SpriteHitbox.js';
import { ExplosiveDamageEffect } from '../DamageEffect/ExplosiveDamageEffect.js';
import { ISkill, PossibleSkillName, SkillsTypeName } from '../Skills.js';
import InfoRocketSkillSprite from '../../../SpriteInfoJSON/Skills/infoRocketSkill.js';

export class RocketBulletLevel1
    extends Sprite
    implements ISpriteWithSpeed, ISpriteWithHitboxes, IGeneratedSprite, ISpriteWithDamage, ISpriteWithDamageEffects
{
    Generator: 'player' | 'enemy';
    Category: 'projectile' | 'nonProjectile';
    BaseSpeed: number;
    Damage: number;
    DamageEffectsController: PlayerProjectileDamageEffectController;
    CurrentHitbox: RectangleHitbox[];
    Collide: Map<CollideScenario, (param?: unknown) => void>;

    constructor(x: number, y: number) {
        super(
            ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').GetImage(
                'images/Skills/Rocket/RocketProjectileLevel1.png',
            ),
            InfoRocketSkillSprite.Level1.Meta.TileDimensions.Width,
            InfoRocketSkillSprite.Level1.Meta.TileDimensions.Height,
            x,
            y,
            InfoRocketSkillSprite.Level1.Meta.SpriteShiftPosition.X,
            InfoRocketSkillSprite.Level1.Meta.SpriteShiftPosition.X,
            CANVA_SCALEX,
            CANVA_SCALEY,
            InfoRocketSkillSprite.Level1.Meta.RealDimension.Width,
            InfoRocketSkillSprite.Level1.Meta.RealDimension.Height,
        );
        this.Generator = 'player';
        this.Category = 'projectile';
        this.BaseSpeed = ServiceLocator.GetService<IServiceUtilManager>(
            'UtilManager',
        ).GetSpeedItTakesToCoverHalfTheScreenWidth({
            framesItTakes: RocketConstant[0]['Projectile Speed'],
        });

        const damageInfo = RocketDamageStats[ServiceLocator.GetService<IServicePlayer>('Player').NumberOfBoosts];

        this.Damage = damageInfo['Rocket L1 Damage'];
        this.DamageEffectsController = new PlayerProjectileDamageEffectController({ baseDamage: this.Damage });
        this.DamageEffectsController.AddDamageEffects({
            damageEffectName: 'Explosive',
            damageEffectObject: new ExplosiveDamageEffect({
                explosiveEffectStat: damageInfo['Explosive Stat (%)'],
            }),
        });

        const defaultHitbox = CreateHitboxesWithInfoFile(this.X, this.Y, [
            ...InfoRocketSkillSprite.Level1.Hitbox.Frame0,
        ]);
        const frame1Hitbox = CreateHitboxesWithInfoFile(this.X, this.Y, [
            ...InfoRocketSkillSprite.Level1.Hitbox.Frame1,
        ]);
        const frame2Hitbox = CreateHitboxesWithInfoFile(this.X, this.Y, [
            ...InfoRocketSkillSprite.Level1.Hitbox.Frame2,
        ]);

        this.CurrentHitbox = defaultHitbox;
        this.AnimationsController.AddAnimation({
            animation: 'idle',
            frames: InfoRocketSkillSprite.Level1.Animations.Idle.Frames,
            framesLengthInTime: InfoRocketSkillSprite.Level1.Animations.Idle.FrameLengthInTime,
        });
        this.AnimationsController.AddAnimation({
            animation: 'destroyed',
            frames: InfoRocketSkillSprite.Level1.Animations.Destroyed.Frames,
            framesLengthInTime: InfoRocketSkillSprite.Level1.Animations.Destroyed.FrameLengthInTime,
            beforePlayingAnimation: () => {
                this.BaseSpeed /= 2;
            },
            afterPlayingAnimation: () => {
                ServiceLocator.GetService<IServiceGeneratedSpritesManager>('GeneratedSpritesManager').RemoveSprite(
                    this,
                );
            },
            methodToPlayOnSpecificFrames: new Map([
                [
                    1,
                    () => {
                        this.CurrentHitbox = frame1Hitbox;
                        this.Damage = damageInfo['Radius 1 L1 Damage'];
                        this.DamageEffectsController = new PlayerProjectileDamageEffectController({
                            baseDamage: this.Damage,
                        });
                    },
                ],
                [
                    2,
                    () => {
                        this.CurrentHitbox = frame2Hitbox;
                        this.Damage = damageInfo['Radius 2 L1 Damage'];
                        this.DamageEffectsController = new PlayerProjectileDamageEffectController({
                            baseDamage: this.Damage,
                        });
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
        });
        this.AnimationsController.PlayAnimation({ animation: 'idle' });

        this.Collide = new Map();
        this.Collide.set('WithEnemy', () => {
            this.AnimationsController.PlayAnimation({ animation: 'destroyed' });
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

export class RocketBulletLevel2
    extends Sprite
    implements ISpriteWithSpeed, ISpriteWithHitboxes, IGeneratedSprite, ISpriteWithDamage, ISpriteWithDamageEffects
{
    Generator: 'player' | 'enemy';
    Category: 'projectile' | 'nonProjectile';
    BaseSpeed: number;
    Damage: number;
    DamageEffectsController: PlayerProjectileDamageEffectController;
    CurrentHitbox: RectangleHitbox[];
    Collide: Map<CollideScenario, (param?: unknown) => void>;

    constructor(x: number, y: number) {
        super(
            ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').GetImage(
                'images/Skills/Rocket/RocketProjectileLevel2.png',
            ),
            InfoRocketSkillSprite.Level2.Meta.TileDimensions.Width,
            InfoRocketSkillSprite.Level2.Meta.TileDimensions.Height,
            x,
            y,
            InfoRocketSkillSprite.Level1.Meta.SpriteShiftPosition.X,
            InfoRocketSkillSprite.Level1.Meta.SpriteShiftPosition.Y,
            CANVA_SCALEX,
            CANVA_SCALEY,
            InfoRocketSkillSprite.Level2.Meta.RealDimension.Width,
            InfoRocketSkillSprite.Level2.Meta.RealDimension.Height,
        );
        this.Generator = 'player';
        this.Category = 'projectile';
        this.BaseSpeed = ServiceLocator.GetService<IServiceUtilManager>(
            'UtilManager',
        ).GetSpeedItTakesToCoverHalfTheScreenWidth({
            framesItTakes: RocketConstant[1]['Projectile Speed'],
        });

        const damageInfo = RocketDamageStats[ServiceLocator.GetService<IServicePlayer>('Player').NumberOfBoosts];
        this.Damage = damageInfo['Rocket L2 Damage'];
        this.DamageEffectsController = new PlayerProjectileDamageEffectController({ baseDamage: this.Damage });
        this.DamageEffectsController.AddDamageEffects({
            damageEffectName: 'Explosive',
            damageEffectObject: new ExplosiveDamageEffect({
                explosiveEffectStat: damageInfo['Explosive Stat (%)'],
            }),
        });
        const defaultHitbox = CreateHitboxesWithInfoFile(this.X, this.Y, [
            ...InfoRocketSkillSprite.Level2.Hitbox.Frame0,
        ]);
        const frame1Hitbox = CreateHitboxesWithInfoFile(this.X, this.Y, [
            ...InfoRocketSkillSprite.Level2.Hitbox.Frame1,
        ]);
        const frame2Hitbox = CreateHitboxesWithInfoFile(this.X, this.Y, [
            ...InfoRocketSkillSprite.Level2.Hitbox.Frame2,
        ]);

        this.CurrentHitbox = defaultHitbox;

        this.AnimationsController.AddAnimation({
            animation: 'idle',
            frames: InfoRocketSkillSprite.Level2.Animations.Idle.Frames,
            framesLengthInTime: InfoRocketSkillSprite.Level2.Animations.Idle.FrameLengthInTime,
        });

        this.AnimationsController.AddAnimation({
            animation: 'destroyed',
            frames: InfoRocketSkillSprite.Level2.Animations.Destroyed.Frames,
            framesLengthInTime: InfoRocketSkillSprite.Level2.Animations.Destroyed.FrameLengthInTime,
            beforePlayingAnimation: () => {
                this.BaseSpeed /= 2;
            },
            afterPlayingAnimation: () => {
                ServiceLocator.GetService<IServiceGeneratedSpritesManager>('GeneratedSpritesManager').RemoveSprite(
                    this,
                );
            },
            methodToPlayOnSpecificFrames: new Map([
                [
                    1,
                    () => {
                        this.CurrentHitbox = frame1Hitbox;
                        this.Damage = damageInfo['Radius 1 L2 Damage'];
                        this.DamageEffectsController = new PlayerProjectileDamageEffectController({
                            baseDamage: this.Damage,
                        });
                    },
                ],
                [
                    2,
                    () => {
                        this.CurrentHitbox = frame2Hitbox;
                        this.Damage = damageInfo['Radius 2 L2 Damage'];
                        this.DamageEffectsController = new PlayerProjectileDamageEffectController({
                            baseDamage: this.Damage,
                        });
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
        });
        this.AnimationsController.PlayAnimation({ animation: 'idle' });

        this.Collide = new Map();
        this.Collide.set('WithEnemy', () => {
            this.AnimationsController.PlayAnimation({ animation: 'destroyed' });
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
class RocketSubBullet
    extends Sprite
    implements ISpriteWithSpeed, ISpriteWithHitboxes, IGeneratedSprite, ISpriteWithDamage, ISpriteWithDamageEffects
{
    Generator: 'player' | 'enemy';
    Category: 'projectile' | 'nonProjectile';
    BaseSpeed: number;
    Damage: number;
    DamageEffectsController: PlayerProjectileDamageEffectController;
    CurrentHitbox: RectangleHitbox[];
    Collide: Map<CollideScenario, (param?: unknown) => void>;

    constructor(x: number, y: number, direction: 'up' | 'down') {
        super(
            ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').GetImage(
                'images/Skills/Rocket/RocketSubProjectileLevel3.png',
            ),
            InfoRocketSkillSprite.SubProjectile.Meta.TileDimensions.Width,
            InfoRocketSkillSprite.SubProjectile.Meta.TileDimensions.Height,
            x,
            y,
            InfoRocketSkillSprite.SubProjectile.Meta.SpriteShiftPosition.X,
            InfoRocketSkillSprite.SubProjectile.Meta.SpriteShiftPosition.Y,
            CANVA_SCALEX,
            CANVA_SCALEY,
            InfoRocketSkillSprite.SubProjectile.Meta.RealDimension.Width,
            InfoRocketSkillSprite.SubProjectile.Meta.RealDimension.Height,
        );
        this.Generator = 'player';
        this.Category = 'projectile';
        const projectileSpeed = ServiceLocator.GetService<IServiceUtilManager>(
            'UtilManager',
        ).GetSpeedItTakesToCoverHalfTheScreenWidth({
            framesItTakes: RocketConstant[2]['Projectile Speed'],
        });

        this.BaseSpeed = direction === 'up' ? -projectileSpeed : projectileSpeed;
        const playersDamageUpgrade = ServiceLocator.GetService<IServicePlayer>('Player').NumberOfDamageUpgrade;
        this.Damage = RocketDamageStats[playersDamageUpgrade]['Sub Projectile L3 Damage'];
        this.DamageEffectsController = new PlayerProjectileDamageEffectController({ baseDamage: this.Damage }); // do not add damage for sub bullet

        const defaultHitbox = CreateHitboxesWithInfoFile(this.X, this.Y, [
            ...InfoRocketSkillSprite.SubProjectile.Hitbox.Frame0,
        ]);
        this.CurrentHitbox = defaultHitbox;

        this.AnimationsController.AddAnimation({
            animation: 'idle',
            frames: InfoRocketSkillSprite.SubProjectile.Animations.Idle.Frames,
            framesLengthInTime: InfoRocketSkillSprite.SubProjectile.Animations.Idle.FrameLengthInTime,
        });
        this.AnimationsController.AddAnimation({
            animation: 'destroyed',
            frames: InfoRocketSkillSprite.SubProjectile.Animations.Destroyed.Frames,
            framesLengthInTime: InfoRocketSkillSprite.SubProjectile.Animations.Destroyed.FrameLengthInTime,
            beforePlayingAnimation: () => {
                this.BaseSpeed /= 2;
            },
            afterPlayingAnimation: () => {
                ServiceLocator.GetService<IServiceGeneratedSpritesManager>('GeneratedSpritesManager').RemoveSprite(
                    this,
                );
            },
            methodToPlayOnSpecificFrames: new Map([
                [
                    1,
                    () => {
                        this.CurrentHitbox = RectangleHitbox.NoHitbox;
                    },
                ],
            ]),
        });
        this.AnimationsController.PlayAnimation({ animation: 'idle' });

        this.Collide = new Map();
        this.Collide.set('WithEnemy', () => {
            this.AnimationsController.PlayAnimation({ animation: 'destroyed' });
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
        this.X += Math.abs(this.BaseSpeed) / 2;
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

export class RocketBulletLevel3
    extends Sprite
    implements ISpriteWithSpeed, ISpriteWithHitboxes, IGeneratedSprite, ISpriteWithDamage, ISpriteWithDamageEffects
{
    Generator: 'player' | 'enemy';
    Category: 'projectile' | 'nonProjectile';
    BaseSpeed: number;
    Damage: number;
    DamageEffectsController: PlayerProjectileDamageEffectController;
    CurrentHitbox: RectangleHitbox[];
    Collide: Map<CollideScenario, (param?: unknown) => void>;

    constructor(x: number, y: number) {
        super(
            ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').GetImage(
                'images/Skills/Rocket/RocketProjectileLevel3.png',
            ),
            InfoRocketSkillSprite.Level3.Meta.TileDimensions.Width,
            InfoRocketSkillSprite.Level3.Meta.TileDimensions.Height,
            x,
            y,
            InfoRocketSkillSprite.Level3.Meta.SpriteShiftPosition.X,
            InfoRocketSkillSprite.Level3.Meta.SpriteShiftPosition.Y,
            CANVA_SCALEX,
            CANVA_SCALEY,
            InfoRocketSkillSprite.Level3.Meta.RealDimension.Width,
            InfoRocketSkillSprite.Level3.Meta.RealDimension.Height,
        );
        this.Generator = 'player';
        this.Category = 'projectile';
        this.BaseSpeed = ServiceLocator.GetService<IServiceUtilManager>(
            'UtilManager',
        ).GetSpeedItTakesToCoverHalfTheScreenWidth({
            framesItTakes: RocketConstant[2]['Projectile Speed'],
        });
        const damageInfo = RocketDamageStats[ServiceLocator.GetService<IServicePlayer>('Player').NumberOfBoosts];
        this.Damage = damageInfo['Rocket L3 Damage'];
        this.DamageEffectsController = new PlayerProjectileDamageEffectController({ baseDamage: this.Damage });
        this.DamageEffectsController.AddDamageEffects({
            damageEffectName: 'Explosive',
            damageEffectObject: new ExplosiveDamageEffect({
                explosiveEffectStat: damageInfo['Explosive Stat (%)'],
            }),
        });

        const defaultHitbox = CreateHitboxesWithInfoFile(this.X, this.Y, [
            ...InfoRocketSkillSprite.Level3.Hitbox.Frame0,
        ]);
        const frame1Hitbox = CreateHitboxesWithInfoFile(this.X, this.Y, [
            ...InfoRocketSkillSprite.Level3.Hitbox.Frame1,
        ]);
        const frame2Hitbox = CreateHitboxesWithInfoFile(this.X, this.Y, [
            ...InfoRocketSkillSprite.Level3.Hitbox.Frame2,
        ]);

        this.CurrentHitbox = defaultHitbox;

        this.AnimationsController.AddAnimation({
            animation: 'idle',
            frames: InfoRocketSkillSprite.Level3.Animations.Idle.Frames,
            framesLengthInTime: InfoRocketSkillSprite.Level3.Animations.Idle.FrameLengthInTime,
        });
        this.AnimationsController.AddAnimation({
            animation: 'destroyed',
            frames: InfoRocketSkillSprite.Level3.Animations.Destroyed.Frames,
            framesLengthInTime: InfoRocketSkillSprite.Level3.Animations.Destroyed.FrameLengthInTime,
            beforePlayingAnimation: () => {
                this.BaseSpeed /= 2;
            },
            afterPlayingAnimation: () => {
                ServiceLocator.GetService<IServiceGeneratedSpritesManager>('GeneratedSpritesManager').RemoveSprite(
                    this,
                );
            },
            methodToPlayOnSpecificFrames: new Map([
                [
                    1,
                    () => {
                        this.CurrentHitbox = frame1Hitbox;
                        this.Damage = damageInfo['Radius 1 L3 Damage'];
                        this.DamageEffectsController = new PlayerProjectileDamageEffectController({
                            baseDamage: this.Damage,
                        });
                    },
                ],
                [
                    2,
                    () => {
                        this.CurrentHitbox = frame2Hitbox;
                        this.Damage = damageInfo['Radius 2 L3 Damage'];
                        this.DamageEffectsController = new PlayerProjectileDamageEffectController({
                            baseDamage: this.Damage,
                        });
                        const { X: upX, Y: upY } =
                            InfoRocketSkillSprite.SubProjectile.Meta.SpriteSpawnPosition.Projectile1;
                        const { X: downX, Y: downY } =
                            InfoRocketSkillSprite.SubProjectile.Meta.SpriteSpawnPosition.Projectile2;
                        const upSubBullet = new RocketSubBullet(this.X + upX, this.Y + upY, 'up');
                        const downSubBullet = new RocketSubBullet(this.X + downX, this.Y + downY, 'down');
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
        });
        this.AnimationsController.PlayAnimation({ animation: 'idle' });

        this.Collide = new Map();
        this.Collide.set('WithEnemy', () => {
            this.AnimationsController.PlayAnimation({ animation: 'destroyed' });
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
        this.SkillName = RocketConstant[0]['Skill Name'];
    }

    public Effect() {
        const { x: playerX, y: playerY } = ServiceLocator.GetService<IServicePlayer>('Player').Coordinate();
        const skillLevel = ServiceLocator.GetService<IServicePlayer>('Player').SpecialSkillLevel;
        const rockets: IGeneratedSprite[] = [];

        if (skillLevel === 1) {
            const { X: upX, Y: upY } = InfoRocketSkillSprite.Level1.Meta.SpriteShiftPositionOnPlayer.Up;
            rockets.push(new RocketBulletLevel1(playerX + upX, playerY + upY));
        } else if (skillLevel === 2) {
            const { X: upX, Y: upY } = InfoRocketSkillSprite.Level2.Meta.SpriteShiftPositionOnPlayer.Up;
            const { X: downX, Y: downY } = InfoRocketSkillSprite.Level2.Meta.SpriteShiftPositionOnPlayer.Down;
            rockets.push(new RocketBulletLevel2(playerX + upX, playerY + upY));
            rockets.push(new RocketBulletLevel2(playerX + downX, playerY + downY));
        } else if (skillLevel === 3) {
            const { X: upX, Y: upY } = InfoRocketSkillSprite.Level2.Meta.SpriteShiftPositionOnPlayer.Up;
            const { X: downX, Y: downY } = InfoRocketSkillSprite.Level2.Meta.SpriteShiftPositionOnPlayer.Down;
            const rocket1 = new RocketBulletLevel3(playerX + upX, playerY + upY);
            const rocket2 = new RocketBulletLevel3(playerX + downX, playerY + downY);
            rockets.push(rocket1, rocket2);
        }

        if (rockets) {
            rockets.forEach((rocket) => {
                ServiceLocator.GetService<IServiceGeneratedSpritesManager>('GeneratedSpritesManager').AddSprite(rocket);
            });
        }
    }
}
