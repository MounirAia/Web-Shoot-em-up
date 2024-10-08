import { IServiceImageLoader } from '../../../../ImageLoader.js';
import { CANVA_SCALEX, CANVA_SCALEY } from '../../../../ScreenConstant.js';
import { ServiceLocator } from '../../../../ServiceLocator.js';
import { IServiceCollideManager } from '../../../CollideManager.js';
import { IGeneratedSprite, IServiceGeneratedSpritesManager } from '../../../GeneratedSpriteManager.js';
import { IServicePlayer } from '../../../Player.js';
import { Sprite } from '../../../Sprite.js';
import { ISpriteWithDamage, ISpriteWithHealth } from '../../../SpriteAttributes.js';
import {
    CollideScenario,
    CreateHitboxesWithInfoFile,
    ISpriteWithHitboxes,
    RectangleHitbox,
} from '../../../SpriteHitbox.js';
import { ISkill, PossibleSkillName, SkillsTypeName } from '../../Skills.js';
import { MirrorShieldPortals } from './MirrorShieldPortal.js';
import { MirrorShieldThunderBeam } from './MirrorShieldThunderBeam.js';
import { GetSpriteStaticInformation } from '../../../../SpriteStaticInformation/SpriteStaticInformationManager.js';

const InfoMirrorShield = GetSpriteStaticInformation({ sprite: 'Mirror' }).spriteInfo;
const MirrorShieldConstant = GetSpriteStaticInformation({ sprite: 'Mirror' }).constant.Mirror;

class MirrorShieldLevel1 extends Sprite implements ISpriteWithHitboxes, IGeneratedSprite, ISpriteWithHealth {
    BaseHealth: number;
    CurrentHealth: number;
    CurrentHitbox: RectangleHitbox[];
    Collide: Map<CollideScenario, (param?: unknown) => void>;
    Generator: 'player' | 'enemy';
    Category: 'projectile' | 'nonProjectile';
    private offsetXOnPlayer: number;
    private offsetYOnPlayer: number;
    private baseTimeToRespawn: number;
    private currentTimeToRespawn: number;
    constructor() {
        super(
            ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').GetImage(
                'images/Skills/Mirror/MirrorLevel1.png',
            ),
            InfoMirrorShield.Level1.Meta.TileDimensions.Width,
            InfoMirrorShield.Level1.Meta.TileDimensions.Height,
            0,
            0,
            InfoMirrorShield.Level1.Meta.SpriteShiftPosition.X,
            InfoMirrorShield.Level1.Meta.SpriteShiftPosition.Y,
            CANVA_SCALEX,
            CANVA_SCALEY,
            InfoMirrorShield.Level1.Meta.RealDimension.Width,
            InfoMirrorShield.Level1.Meta.RealDimension.Height,
        );
        const { x: playerX, y: playerY } = ServiceLocator.GetService<IServicePlayer>('Player').Coordinate();
        this.X = playerX;
        this.Y = playerY;
        this.Generator = 'player';
        this.Category = 'nonProjectile';
        this.BaseHealth =
            ServiceLocator.GetService<IServicePlayer>('Player').MaxHealth *
            MirrorShieldConstant[0]['Mirror Health Player Health Ratio'];
        this.CurrentHealth = this.BaseHealth;

        const defaultHitbox = CreateHitboxesWithInfoFile(this.X, this.Y, [...InfoMirrorShield.Level1.Hitbox]);
        this.CurrentHitbox = defaultHitbox;

        this.offsetXOnPlayer = InfoMirrorShield.Level1.Meta.SpriteShiftPositionOnPlayer.X;
        this.offsetYOnPlayer = InfoMirrorShield.Level1.Meta.SpriteShiftPositionOnPlayer.Y;
        this.baseTimeToRespawn = MirrorShieldConstant[0]['Respawn Time (s)'];
        this.currentTimeToRespawn = 0;

        const { Destroyed, Spawning, Damaged } = InfoMirrorShield.Level1.Animations;

        this.AnimationsController.AddAnimation({
            animation: 'destroyed',
            frames: Destroyed.Frames,
            framesLengthInTime: Destroyed.FrameLengthInTime,
            beforePlayingAnimation: () => {
                this.CurrentHitbox = RectangleHitbox.NoHitbox;
                this.currentTimeToRespawn = this.baseTimeToRespawn;
            },
        });
        this.AnimationsController.AddAnimation({
            animation: 'spawning',
            frames: Spawning.Frames,
            framesLengthInTime: Spawning.FrameLengthInTime,
            afterPlayingAnimation: () => {
                this.CurrentHitbox = defaultHitbox;
                this.resetMirrorStats();
                this.AnimationsController.PlayAnimation({ animation: 'damaged' });
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

        this.Collide = new Map();
        this.Collide.set('WithProjectile', (param?: unknown) => {
            this.StatesController.PlayState({ stateName: 'onHit' });

            const projectile = param as ISpriteWithDamage;
            if (projectile?.Damage) {
                const { Damage } = projectile;
                const maxNumberHealthSection = Damaged.Frames.length;
                const healthPerSection = this.BaseHealth / maxNumberHealthSection;
                const oldHealthSection = Math.ceil(this.CurrentHealth / healthPerSection);
                this.CurrentHealth -= Damage;
                const currentHealthSection = Math.ceil(this.CurrentHealth / healthPerSection);
                const numberOfFramesToPlay = oldHealthSection - currentHealthSection;
                for (let i = 0; i < numberOfFramesToPlay; i++) {
                    this.AnimationsController.PlayManuallyNextFrame();
                }
            }
        });
    }

    UpdateHitboxes(dt: number) {
        this.CurrentHitbox.forEach((hitbox) => {
            hitbox.SpriteX = this.X;
            hitbox.SpriteY = this.Y;
        });
    }

    Update(dt: number): void {
        super.Update(dt);
        if (this.AnimationsController.CurrentAnimationName === 'destroyed') {
            this.currentTimeToRespawn -= dt;
            if (this.currentTimeToRespawn <= 0) {
                this.AnimationsController.PlayAnimation({ animation: 'spawning' });
            }
        } else {
            const { x: playerX, y: playerY } = ServiceLocator.GetService<IServicePlayer>('Player').Coordinate();
            this.X = playerX + this.offsetXOnPlayer;
            this.Y = playerY + this.offsetYOnPlayer;
            this.UpdateHitboxes(dt);
            const collideManager = ServiceLocator.GetService<IServiceCollideManager>('CollideManager');
            collideManager.HandleWhenPlayerNonProjectileCollideWithEnemyProjectiles(this);
        }
    }

    private resetMirrorStats() {
        this.CurrentHealth = this.BaseHealth;
    }
}

class MirrorShieldLevel2 extends Sprite implements ISpriteWithHitboxes, IGeneratedSprite, ISpriteWithHealth {
    BaseHealth: number;
    CurrentHealth: number;
    CurrentHitbox: RectangleHitbox[];
    Collide: Map<CollideScenario, (param?: unknown) => void>;
    Generator: 'player' | 'enemy';
    Category: 'projectile' | 'nonProjectile';
    private offsetXOnPlayer: number;
    private offsetYOnPlayer: number;
    private baseTimeToRespawn: number;
    private currentTimeToRespawn: number;
    constructor() {
        super(
            ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').GetImage(
                'images/Skills/Mirror/MirrorLevel2&3.png',
            ),
            InfoMirrorShield.Level2.Meta.TileDimensions.Width,
            InfoMirrorShield.Level2.Meta.TileDimensions.Height,
            0,
            0,
            InfoMirrorShield.Level2.Meta.SpriteShiftPosition.X,
            InfoMirrorShield.Level2.Meta.SpriteShiftPosition.Y,
            CANVA_SCALEX,
            CANVA_SCALEY,
            InfoMirrorShield.Level2.Meta.RealDimension.Width,
            InfoMirrorShield.Level2.Meta.RealDimension.Height,
        );
        const { x: playerX, y: playerY } = ServiceLocator.GetService<IServicePlayer>('Player').Coordinate();
        this.X = playerX;
        this.Y = playerY;
        this.Generator = 'player';
        this.Category = 'nonProjectile';
        this.BaseHealth = this.BaseHealth =
            ServiceLocator.GetService<IServicePlayer>('Player').MaxHealth *
            MirrorShieldConstant[1]['Mirror Health Player Health Ratio'];
        this.CurrentHealth = this.BaseHealth;

        const defaultHitbox = CreateHitboxesWithInfoFile(this.X, this.Y, [...InfoMirrorShield.Level2.Hitbox]);
        this.CurrentHitbox = defaultHitbox;

        this.offsetXOnPlayer = InfoMirrorShield.Level2.Meta.SpriteShiftPositionOnPlayer.X;
        this.offsetYOnPlayer = InfoMirrorShield.Level2.Meta.SpriteShiftPositionOnPlayer.Y;
        this.baseTimeToRespawn = MirrorShieldConstant[1]['Respawn Time (s)'];
        this.currentTimeToRespawn = 0;

        const { Destroyed, Spawning, Damaged } = InfoMirrorShield.Level2.Animations;

        this.AnimationsController.AddAnimation({
            animation: 'destroyed',
            frames: Destroyed.Frames,
            framesLengthInTime: Destroyed.FrameLengthInTime,
            beforePlayingAnimation: () => {
                this.CurrentHitbox = RectangleHitbox.NoHitbox;
                this.currentTimeToRespawn = this.baseTimeToRespawn;
            },
        });
        this.AnimationsController.AddAnimation({
            animation: 'spawning',
            frames: Spawning.Frames,
            framesLengthInTime: Spawning.FrameLengthInTime,
            afterPlayingAnimation: () => {
                this.CurrentHitbox = defaultHitbox;
                this.resetMirrorStats();
                this.AnimationsController.PlayAnimation({ animation: 'damaged' });
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

        this.Collide = new Map();
        this.Collide.set('WithProjectile', (param?: unknown) => {
            this.StatesController.PlayState({ stateName: 'onHit' });

            const projectile = param as ISpriteWithDamage;
            if (projectile?.Damage) {
                const { Damage } = projectile;
                const maxNumberHealthSection = Damaged.Frames.length;
                const healthPerSection = this.BaseHealth / maxNumberHealthSection;
                const oldHealthSection = Math.ceil(this.CurrentHealth / healthPerSection);
                this.CurrentHealth -= Damage;
                const currentHealthSection = Math.ceil(this.CurrentHealth / healthPerSection);
                const numberOfFramesToPlay = oldHealthSection - currentHealthSection;
                for (let i = 0; i < numberOfFramesToPlay; i++) {
                    this.AnimationsController.PlayManuallyNextFrame();
                }
            }

            ServiceLocator.GetService<IServiceGeneratedSpritesManager>('GeneratedSpritesManager').AddSprite(
                new MirrorShieldThunderBeam({
                    startingPoint: { x: this.FrameXCenter, y: this.FrameYCenter },
                }),
            );
        });
    }

    UpdateHitboxes(dt: number) {
        this.CurrentHitbox.forEach((hitbox) => {
            hitbox.SpriteX = this.X;
            hitbox.SpriteY = this.Y;
        });
    }

    Update(dt: number): void {
        super.Update(dt);
        if (this.AnimationsController.CurrentAnimationName === 'destroyed') {
            this.currentTimeToRespawn -= dt;
            if (this.currentTimeToRespawn <= 0) {
                this.AnimationsController.PlayAnimation({ animation: 'spawning' });
            }
        } else {
            const { x: playerX, y: playerY } = ServiceLocator.GetService<IServicePlayer>('Player').Coordinate();
            this.X = playerX + this.offsetXOnPlayer;
            this.Y = playerY + this.offsetYOnPlayer;
            this.UpdateHitboxes(dt);
            const collideManager = ServiceLocator.GetService<IServiceCollideManager>('CollideManager');
            collideManager.HandleWhenPlayerNonProjectileCollideWithEnemyProjectiles(this);
        }
    }

    private resetMirrorStats() {
        this.CurrentHealth = this.BaseHealth;
    }
}

class MirrorShieldLevel3 extends Sprite implements ISpriteWithHitboxes, IGeneratedSprite, ISpriteWithHealth {
    BaseHealth: number;
    CurrentHealth: number;
    CurrentHitbox: RectangleHitbox[];
    Collide: Map<CollideScenario, (param?: unknown) => void>;
    Generator: 'player' | 'enemy';
    Category: 'projectile' | 'nonProjectile';
    private offsetXOnPlayer: number;
    private offsetYOnPlayer: number;
    private baseTimeToRespawn: number;
    private currentTimeToRespawn: number;
    private portalsContainer: MirrorShieldPortals;
    constructor() {
        super(
            ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').GetImage(
                'images/Skills/Mirror/MirrorLevel2&3.png',
            ),
            InfoMirrorShield.Level3.Meta.TileDimensions.Width,
            InfoMirrorShield.Level3.Meta.TileDimensions.Height,
            0,
            0,
            InfoMirrorShield.Level3.Meta.SpriteShiftPosition.X,
            InfoMirrorShield.Level3.Meta.SpriteShiftPosition.Y,
            CANVA_SCALEX,
            CANVA_SCALEY,
            InfoMirrorShield.Level3.Meta.RealDimension.Width,
            InfoMirrorShield.Level3.Meta.RealDimension.Height,
        );
        const { x: playerX, y: playerY } = ServiceLocator.GetService<IServicePlayer>('Player').Coordinate();
        this.X = playerX;
        this.Y = playerY;
        this.Generator = 'player';
        this.Category = 'nonProjectile';
        this.BaseHealth = this.BaseHealth =
            ServiceLocator.GetService<IServicePlayer>('Player').MaxHealth *
            MirrorShieldConstant[2]['Mirror Health Player Health Ratio'];
        this.CurrentHealth = this.BaseHealth;

        const defaultHitbox = CreateHitboxesWithInfoFile(this.X, this.Y, [...InfoMirrorShield.Level3.Hitbox]);
        this.CurrentHitbox = defaultHitbox;

        this.offsetXOnPlayer = InfoMirrorShield.Level3.Meta.SpriteShiftPositionOnPlayer.X;
        this.offsetYOnPlayer = InfoMirrorShield.Level3.Meta.SpriteShiftPositionOnPlayer.Y;

        this.baseTimeToRespawn = MirrorShieldConstant[2]['Respawn Time (s)'];
        this.currentTimeToRespawn = 0;

        this.portalsContainer = new MirrorShieldPortals();

        const { Destroyed, Spawning, Damaged } = InfoMirrorShield.Level3.Animations;

        this.AnimationsController.AddAnimation({
            animation: 'destroyed',
            frames: Destroyed.Frames,
            framesLengthInTime: Destroyed.FrameLengthInTime,
            beforePlayingAnimation: () => {
                this.CurrentHitbox = RectangleHitbox.NoHitbox;
                this.currentTimeToRespawn = this.baseTimeToRespawn;
            },
        });
        this.AnimationsController.AddAnimation({
            animation: 'spawning',
            frames: Spawning.Frames,
            framesLengthInTime: Spawning.FrameLengthInTime,
            afterPlayingAnimation: () => {
                this.CurrentHitbox = defaultHitbox;
                this.resetMirrorStats();
                this.AnimationsController.PlayAnimation({ animation: 'damaged' });
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

        this.Collide = new Map();
        this.Collide.set('WithProjectile', (param?: unknown) => {
            this.StatesController.PlayState({ stateName: 'onHit' });

            const projectile = param as ISpriteWithDamage;
            if (projectile?.Damage) {
                const { Damage } = projectile;
                const maxNumberHealthSection = Damaged.Frames.length;
                const healthPerSection = this.BaseHealth / maxNumberHealthSection;
                const oldHealthSection = Math.ceil(this.CurrentHealth / healthPerSection);
                this.CurrentHealth -= Damage;
                const currentHealthSection = Math.ceil(this.CurrentHealth / healthPerSection);
                const numberOfFramesToPlay = oldHealthSection - currentHealthSection;
                for (let i = 0; i < numberOfFramesToPlay; i++) {
                    this.AnimationsController.PlayManuallyNextFrame();
                }
            }

            ServiceLocator.GetService<IServiceGeneratedSpritesManager>('GeneratedSpritesManager').AddSprite(
                new MirrorShieldThunderBeam({
                    startingPoint: { x: this.FrameXCenter, y: this.FrameYCenter },
                }),
            );
        });
    }
    UpdateHitboxes(dt: number) {
        this.CurrentHitbox.forEach((hitbox) => {
            hitbox.SpriteX = this.X;
            hitbox.SpriteY = this.Y;
        });
    }

    Update(dt: number): void {
        super.Update(dt);
        if (this.AnimationsController.CurrentAnimationName === 'destroyed') {
            this.currentTimeToRespawn -= dt;
            if (this.currentTimeToRespawn <= 0) {
                this.AnimationsController.PlayAnimation({ animation: 'spawning' });
            }
        } else {
            const { x: playerX, y: playerY } = ServiceLocator.GetService<IServicePlayer>('Player').Coordinate();
            this.X = playerX + this.offsetXOnPlayer;
            this.Y = playerY + this.offsetYOnPlayer;
            this.UpdateHitboxes(dt);
            const collideManager = ServiceLocator.GetService<IServiceCollideManager>('CollideManager');
            collideManager.HandleWhenPlayerNonProjectileCollideWithEnemyProjectiles(this);
        }
        this.portalsContainer.Update(dt);
    }

    Draw(ctx: CanvasRenderingContext2D): void {
        super.Draw(ctx);

        this.portalsContainer.Draw(ctx);
    }

    private resetMirrorStats() {
        this.CurrentHealth = this.BaseHealth;
    }
}

export class MirrorShieldSkill implements ISkill {
    Type: SkillsTypeName;
    SkillName: PossibleSkillName;
    refMirrorSprite: IGeneratedSprite | undefined;
    constructor() {
        this.Type = 'support';
        this.SkillName = 'MirrorShield';
        this.refMirrorSprite = undefined;
    }

    Effect() {
        const skillLevel = ServiceLocator.GetService<IServicePlayer>('Player').SupportSkillLevel;

        let mirror: IGeneratedSprite | undefined;

        if (skillLevel === 1) {
            mirror = new MirrorShieldLevel1();
        } else if (skillLevel === 2) {
            mirror = new MirrorShieldLevel2();
        } else if (skillLevel === 3) {
            mirror = new MirrorShieldLevel3();
        }

        if (mirror) {
            this.refMirrorSprite = mirror;
            ServiceLocator.GetService<IServiceGeneratedSpritesManager>('GeneratedSpritesManager').AddSprite(mirror);
        }
    }

    ClearSkillSprite() {
        if (this.refMirrorSprite) {
            ServiceLocator.GetService<IServiceGeneratedSpritesManager>('GeneratedSpritesManager').RemoveSprite(
                this.refMirrorSprite,
            );
        }
    }
}
