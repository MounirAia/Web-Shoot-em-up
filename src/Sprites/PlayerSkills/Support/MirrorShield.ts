import { Sprite } from '../../Sprite.js';
import { ISkill, PossibleSkillName, SkillsTypeName } from '../Skills.js';
import InfoMirrorShield from '../../../StatsJSON/SpriteInfo/Skills/InfoMirrorShield.js';
import { ServiceLocator } from '../../../ServiceLocator.js';
import { IServiceImageLoader } from '../../../ImageLoader.js';
import { CANVA_SCALEX, CANVA_SCALEY } from '../../../ScreenConstant.js';
import { ISpriteWithHealth, ISpriteWithDamage } from '../../SpriteAttributes.js';
import { IGeneratedSprite, IServiceGeneratedSpritesManager } from '../../GeneratedSpriteManager.js';
import {
    CollideScenario,
    CreateHitboxesWithInfoFile,
    ISpriteWithHitboxes,
    RectangleHitbox,
} from '../../SpriteHitbox.js';
import { IServicePlayer } from '../../Player.js';
import { IServiceCollideManager } from '../../CollideManager.js';
import { IServiceWaveManager } from '../../../WaveManager/WaveManager.js';
import { canvas, FRAME_RATE } from '../../../ScreenConstant.js';

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
        let { x: playerX, y: playerY } = ServiceLocator.GetService<IServicePlayer>('Player').Coordinate();
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

        this.AddAnimation('destroyed', Destroyed.Frames, Destroyed.FrameLengthInTime, () => {
            this.CurrentHitbox = RectangleHitbox.NoHitbox;
            this.currentTimeToRespawn = this.baseTimeToRespawn;
        });
        this.AddAnimation('spawning', Spawning.Frames, Spawning.FrameLengthInTime, undefined, () => {
            this.CurrentHitbox = defaultHitbox;
            this.PlayAnimation('damaged');
        });
        this.AddAnimation('damaged', Damaged.Frames, Damaged.FrameLengthInTime, undefined, () => {
            this.PlayAnimation('destroyed');
        });
        this.PlayAnimation('damaged');

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
                    this.PlayManuallyNextFrame();
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
        if (this.CurrentAnimationName === 'destroyed') {
            this.currentTimeToRespawn -= dt;
            if (this.currentTimeToRespawn <= 0) {
                this.PlayAnimation('spawning');
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
        let { x: playerX, y: playerY } = ServiceLocator.GetService<IServicePlayer>('Player').Coordinate();
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

        this.AddAnimation('destroyed', Destroyed.Frames, Destroyed.FrameLengthInTime, () => {
            this.CurrentHitbox = RectangleHitbox.NoHitbox;
            this.currentTimeToRespawn = this.baseTimeToRespawn;
        });
        this.AddAnimation('spawning', Spawning.Frames, Spawning.FrameLengthInTime, undefined, () => {
            this.CurrentHitbox = defaultHitbox;
            this.PlayAnimation('damaged');
        });
        this.AddAnimation('damaged', Damaged.Frames, Damaged.FrameLengthInTime, undefined, () => {
            this.PlayAnimation('destroyed');
        });
        this.PlayAnimation('damaged');

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
                    this.PlayManuallyNextFrame();
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
        if (this.CurrentAnimationName === 'destroyed') {
            this.currentTimeToRespawn -= dt;
            if (this.currentTimeToRespawn <= 0) {
                this.PlayAnimation('spawning');
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

class MirrorShieldThunderBeam implements IGeneratedSprite, ISpriteWithDamage {
    Generator: 'player' | 'enemy';
    Category: 'projectile' | 'nonProjectile';
    CurrentHitbox: RectangleHitbox[];
    Collide: Map<CollideScenario, (param?: unknown) => void>;
    Damage: number;

    private startingPoint: { x: number; y: number };
    private endPoint: { x: number; y: number };
    private setOfKeyPoints: { x: number; y: number }[];
    private readonly verticalRange = 30;
    private readonly potentialPartitionNumbers = [1 / 2, 1 / 4, 1 / 5];
    private readonly lineWidth = 3;
    private currentDisappearTimer = 1 / FRAME_RATE;
    constructor(params: { startingPoint: { x: number; y: number } }) {
        const { startingPoint } = params;
        this.startingPoint = startingPoint;
        const endPoint = ServiceLocator.GetService<IServiceWaveManager>('WaveManager').GetPositionOfARandomEnemy();
        this.endPoint = endPoint ? endPoint : { x: canvas.width, y: canvas.height / 2 };
        this.setOfKeyPoints = [];

        this.generateKeyPoints();

        this.Damage = 10;
        this.Generator = 'player';
        this.Category = 'projectile';
        this.CurrentHitbox = [
            new RectangleHitbox(this.endPoint.x, this.endPoint.y, 0, 0, this.lineWidth, this.lineWidth),
        ];
        this.Collide = new Map();
        this.Collide.set('WithEnemy', () => {
            ServiceLocator.GetService<IServiceGeneratedSpritesManager>('GeneratedSpritesManager').RemoveSprite(this);
        });
    }

    UpdateHitboxes(dt: number) {}

    public Update(dt: number) {
        this.currentDisappearTimer -= dt;
        if (this.currentDisappearTimer < 0) {
            ServiceLocator.GetService<IServiceGeneratedSpritesManager>('GeneratedSpritesManager').RemoveSprite(this);
        }

        const collideManager = ServiceLocator.GetService<IServiceCollideManager>('CollideManager');
        collideManager.HandleWhenPlayerProjectileCollideWithEnemies(this);
    }

    public Draw(ctx: CanvasRenderingContext2D) {
        let { x: x0, y: y0 } = this.startingPoint;

        ctx.lineWidth = this.lineWidth;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        this.setOfKeyPoints.forEach(({ x, y }) => {
            ctx.lineTo(x, y);
        });
        ctx.stroke();
    }

    private generateKeyPoints() {
        const dx = this.endPoint.x - this.startingPoint.x;
        const dy = this.endPoint.y - this.startingPoint.y;

        const vectorScalingFactor =
            this.potentialPartitionNumbers[Math.floor(Math.random() * this.potentialPartitionNumbers.length)];
        let currentVectorScalingFactor = vectorScalingFactor;

        let directionThunderBeam = Math.random() > 0.5 ? 1 : -1;

        //compute points to generate thunder beam
        while (currentVectorScalingFactor <= 1) {
            const scalledDX = Math.floor(dx * currentVectorScalingFactor + this.startingPoint.x);
            let scalledDY = Math.floor(dy * currentVectorScalingFactor + this.startingPoint.y);

            // adding a random vertical range to create a thunder effect (except at the last point)
            if (currentVectorScalingFactor < 1) {
                scalledDY += directionThunderBeam * Math.floor(Math.random() * this.verticalRange);
            }

            this.setOfKeyPoints.push({ x: scalledDX, y: scalledDY });

            // increase scalling factor
            currentVectorScalingFactor += vectorScalingFactor;
            // inverse thunder beam direction
            directionThunderBeam = -directionThunderBeam;
        }
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
        const mirror = new MirrorShieldLevel2();

        ServiceLocator.GetService<IServiceGeneratedSpritesManager>('GeneratedSpritesManager').AddSprite(mirror);
    }
}
