import { Sprite } from '../../../Sprite.js';
import { ISkill, PossibleSkillName, SkillsTypeName } from '../../Skills.js';
import InfoMirrorShield from '../../../../StatsJSON/SpriteInfo/Skills/InfoMirrorShield.js';
import { ServiceLocator } from '../../../../ServiceLocator.js';
import { IServiceImageLoader } from '../../../../ImageLoader.js';
import { CANVA_SCALEX, CANVA_SCALEY } from '../../../../ScreenConstant.js';
import { ISpriteWithHealth, ISpriteWithDamage } from '../../../SpriteAttributes.js';
import { IGeneratedSprite, IServiceGeneratedSpritesManager } from '../../../GeneratedSpriteManager.js';
import {
    CollideScenario,
    CreateHitboxesWithInfoFile,
    ISpriteWithHitboxes,
    RectangleHitbox,
} from '../../../SpriteHitbox.js';
import { IServicePlayer } from '../../../Player.js';
import { IServiceCollideManager } from '../../../CollideManager.js';
import { MirrorShieldThunderBeam } from './MirrorShieldThunderBeam.js';
import { MirrorShieldPortals } from './MirrorShieldPortal.js';

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
        this.BaseHealth = 100;
        this.CurrentHealth = this.BaseHealth;

        const defaultHitbox = CreateHitboxesWithInfoFile(this.X, this.Y, [...InfoMirrorShield.Level1.Hitbox]);
        this.CurrentHitbox = defaultHitbox;

        this.offsetXOnPlayer = InfoMirrorShield.Level1.Meta.SpriteShiftPositionOnPlayer.X;
        this.offsetYOnPlayer = InfoMirrorShield.Level1.Meta.SpriteShiftPositionOnPlayer.Y;
        this.baseTimeToRespawn = 1;
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

        this.StatesController.AddState('onHit', { statesDuration: 0.1 });

        this.Collide = new Map();
        this.Collide.set('WithProjectile', (param?: unknown) => {
            const projectile = param as ISpriteWithDamage;
            if (projectile?.Damage) {
                const { floor } = Math;
                // how many health points there are to a health section of the mirror
                const healthPerSection = floor(this.BaseHealth / Damaged.Frames.length);
                const maxNumberHealthSection = floor(this.BaseHealth / healthPerSection);
                const oldHealthSection = floor(this.CurrentHealth / healthPerSection);
                this.CurrentHealth -= projectile.Damage;
                const currentHealthSection = floor(this.CurrentHealth / healthPerSection);
                if (currentHealthSection < oldHealthSection && oldHealthSection != maxNumberHealthSection) {
                    this.AnimationsController.PlayManuallyNextFrame();
                }
            }
            this.StatesController.PlayState('onHit');
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
        this.BaseHealth = 150;
        this.CurrentHealth = this.BaseHealth;

        const defaultHitbox = CreateHitboxesWithInfoFile(this.X, this.Y, [...InfoMirrorShield.Level2.Hitbox]);
        this.CurrentHitbox = defaultHitbox;

        this.offsetXOnPlayer = InfoMirrorShield.Level2.Meta.SpriteShiftPositionOnPlayer.X;
        this.offsetYOnPlayer = InfoMirrorShield.Level2.Meta.SpriteShiftPositionOnPlayer.Y;
        this.baseTimeToRespawn = 1;
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

        this.StatesController.AddState('onHit', { statesDuration: 0.1 });

        this.Collide = new Map();
        this.Collide.set('WithProjectile', (param?: unknown) => {
            const projectile = param as ISpriteWithDamage;
            if (projectile?.Damage) {
                const { floor } = Math;
                // how many health points there are to a health section of the mirror
                const healthPerSection = floor(this.BaseHealth / Damaged.Frames.length);
                const maxNumberHealthSection = floor(this.BaseHealth / healthPerSection);
                const oldHealthSection = floor(this.CurrentHealth / healthPerSection);
                this.CurrentHealth -= projectile.Damage;
                const currentHealthSection = floor(this.CurrentHealth / healthPerSection);
                if (currentHealthSection < oldHealthSection && oldHealthSection != maxNumberHealthSection) {
                    this.AnimationsController.PlayManuallyNextFrame();
                }
            }
            this.StatesController.PlayState('onHit');
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
        this.BaseHealth = 20;
        this.CurrentHealth = this.BaseHealth;

        const defaultHitbox = CreateHitboxesWithInfoFile(this.X, this.Y, [...InfoMirrorShield.Level3.Hitbox]);
        this.CurrentHitbox = defaultHitbox;

        this.offsetXOnPlayer = InfoMirrorShield.Level3.Meta.SpriteShiftPositionOnPlayer.X;
        this.offsetYOnPlayer = InfoMirrorShield.Level3.Meta.SpriteShiftPositionOnPlayer.Y;

        this.baseTimeToRespawn = 1;
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

        this.StatesController.AddState('onHit', { statesDuration: 0.1 });

        this.Collide = new Map();
        this.Collide.set('WithProjectile', (param?: unknown) => {
            const projectile = param as ISpriteWithDamage;
            if (projectile?.Damage) {
                const { floor } = Math;
                // how many health points there are to a health section of the mirror
                const healthPerSection = floor(this.BaseHealth / Damaged.Frames.length);
                const maxNumberHealthSection = floor(this.BaseHealth / healthPerSection);
                const oldHealthSection = floor(this.CurrentHealth / healthPerSection);
                this.CurrentHealth -= projectile.Damage;
                const currentHealthSection = floor(this.CurrentHealth / healthPerSection);
                if (currentHealthSection < oldHealthSection && oldHealthSection != maxNumberHealthSection) {
                    this.AnimationsController.PlayManuallyNextFrame();
                }
            }
            this.StatesController.PlayState('onHit');
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
}

export class MirrorShieldSkill implements ISkill {
    Type: SkillsTypeName;
    SkillName: PossibleSkillName;

    constructor() {
        this.Type = 'support';
        this.SkillName = 'MirrorShield';
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
            ServiceLocator.GetService<IServiceGeneratedSpritesManager>('GeneratedSpritesManager').AddSprite(mirror);
        }
    }
}
