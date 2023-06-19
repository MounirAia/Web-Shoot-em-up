import { Sprite } from '../../../Sprite.js';
import InfoMirrorShield from '../../../../StatsJSON/SpriteInfo/Skills/InfoMirrorShield.js';
import { ServiceLocator } from '../../../../ServiceLocator.js';
import { IServiceImageLoader } from '../../../../ImageLoader.js';
import { CANVA_SCALEX, CANVA_SCALEY, canvas } from '../../../../ScreenConstant.js';
import { IServicePlayer } from '../../../Player.js';
import {
    ISpriteWithDamage,
    ISpriteWithSpeed,
    ISpriteWithTarget,
    ISpriteWithUpdateAndDraw,
} from '../../../SpriteAttributes.js';
import { IGeneratedSprite, IServiceGeneratedSpritesManager } from '../../../GeneratedSpriteManager.js';
import { RectangleHitbox, CollideScenario, CreateHitboxesWithInfoFile } from '../../../SpriteHitbox.js';
import { IEnemy } from '../../../Enemies/IEnemy.js';
import { IServiceWaveManager } from '../../../../WaveManager/WaveManager.js';
import { IServiceCollideManager } from '../../../CollideManager.js';

class MirrorShieldPortal extends Sprite {
    private offsetXOnPlayer: number;
    private offsetYOnPlayer: number;
    private static potentialMirrorPositions: { X: number; Y: number }[] = [];
    private baseTimeGenerating;
    private currentTimeGenerating;

    constructor(parameters: { spriteShiftPositionOnMirror: { X: number; Y: number } }) {
        super(
            ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').GetImage('images/Skills/Mirror/Portal.png'),
            InfoMirrorShield.Portal.Meta.TileDimensions.Width,
            InfoMirrorShield.Portal.Meta.TileDimensions.Height,
            0,
            0,
            InfoMirrorShield.Portal.Meta.SpriteShiftPosition.X,
            InfoMirrorShield.Portal.Meta.SpriteShiftPosition.Y,
            CANVA_SCALEX,
            CANVA_SCALEY,
            InfoMirrorShield.Portal.Meta.RealDimension.Short.Width,
            InfoMirrorShield.Portal.Meta.RealDimension.Short.Height,
        );

        this.initializePotentialPositions();

        const { spriteShiftPositionOnMirror } = parameters;

        const { x: playerX, y: playerY } = ServiceLocator.GetService<IServicePlayer>('Player').Coordinate();
        this.X = playerX;
        this.Y = playerY;

        const { X: mirrorOffsetXOnPlayer, Y: mirrorOffsetYOnPlayer } =
            InfoMirrorShield.Level3.Meta.SpriteShiftPositionOnPlayer;
        const { X: portalOffsetXOnMirror, Y: portalOffsetYOnMirror } = spriteShiftPositionOnMirror;

        this.offsetXOnPlayer = mirrorOffsetXOnPlayer + portalOffsetXOnMirror;
        this.offsetYOnPlayer = mirrorOffsetYOnPlayer + portalOffsetYOnMirror;

        this.baseTimeGenerating = 6 / 60;
        this.currentTimeGenerating = this.baseTimeGenerating;

        const { Idle, Detaching, Attaching, Disappearing, Generating, Spawning } = InfoMirrorShield.Portal.Animations;

        this.AddAnimation('idle', Idle.Frames, Idle.FrameLengthInTime);
        this.AddAnimation('attaching', Attaching.Frames, Attaching.FrameLengthInTime, undefined, () => {
            const { Width, Height } = InfoMirrorShield.Portal.Meta.RealDimension.Short;
            this.Width = Width;
            this.Height = Height;

            this.PlayAnimation('idle');
        });
        this.AddAnimation('disappearing', Disappearing.Frames, Disappearing.FrameLengthInTime, undefined, () => {
            MirrorShieldPortal.potentialMirrorPositions.push({ X: this.X, Y: this.Y });
            this.PlayAnimation('attaching');
        });
        this.AddAnimation('generating', Generating.Frames, Generating.FrameLengthInTime, () => {
            const { Width, Height } = InfoMirrorShield.Portal.Meta.RealDimension.Long;
            this.Width = Width;
            this.Height = Height;
        });
        this.AddAnimation('spawning', Spawning.Frames, Spawning.FrameLengthInTime, undefined, () => {
            this.PlayAnimation('generating', true);
        });
        this.AddAnimation('detaching', Detaching.Frames, Detaching.FrameLengthInTime, undefined, () => {
            const { X, Y } = this.getRandomPotentialPortalPosition();
            this.X = X;
            this.Y = Y;
            this.PlayAnimation('spawning');
        });

        this.PlayAnimation('idle');
    }

    Update(dt: number) {
        super.Update(dt);
        const { x: playerX, y: playerY } = ServiceLocator.GetService<IServicePlayer>('Player').Coordinate();
        if (this.CurrentAnimationName === 'idle' || this.CurrentAnimationName === 'attaching') {
            this.X = playerX + this.offsetXOnPlayer;
            this.Y = playerY + this.offsetYOnPlayer;
        } else if (this.CurrentAnimationName === 'generating') {
            this.generatesExplosiveEntity();
            this.currentTimeGenerating -= dt;
            if (this.currentTimeGenerating <= 0) {
                this.PlayAnimation('disappearing');
                this.currentTimeGenerating = this.baseTimeGenerating;
            }
        }
    }

    private initializePotentialPositions() {
        // initialize positions only for the first portal
        if (MirrorShieldPortal.potentialMirrorPositions.length === 0) {
            const padding = 120; // to avoid portal to touch the edge of the screen
            const horizontalSpawningZone = Math.floor(canvas.width / 3);
            const verticalSpawningZone = canvas.height - padding;
            const horizontalStep = horizontalSpawningZone / 3;
            const verticalStep = verticalSpawningZone / 5;

            for (
                let horizontalPosition = padding;
                horizontalPosition < horizontalSpawningZone;
                horizontalPosition += horizontalStep
            ) {
                for (
                    let verticalPosition = padding;
                    verticalPosition < verticalSpawningZone;
                    verticalPosition += verticalStep
                ) {
                    MirrorShieldPortal.potentialMirrorPositions.push({ X: horizontalPosition, Y: verticalPosition });
                }
            }
        }
    }

    private getRandomPotentialPortalPosition(): { X: number; Y: number } {
        // get a random spawning position for the portal
        const randomIndex = Math.floor(Math.random() * MirrorShieldPortal.potentialMirrorPositions.length);
        const position = MirrorShieldPortal.potentialMirrorPositions[randomIndex];
        MirrorShieldPortal.potentialMirrorPositions.splice(randomIndex, 1);
        return position;
    }

    private generatesExplosiveEntity() {
        const randomYDistance = this.Y + Math.floor(Math.random() * this.Height);
        const explosiveEntity = new PortalExplosiveEntity({ X: this.X + this.Width / 2, Y: randomYDistance });
        ServiceLocator.GetService<IServiceGeneratedSpritesManager>('GeneratedSpritesManager').AddSprite(
            explosiveEntity,
        );
    }
}

class PortalExplosiveEntity
    extends Sprite
    implements ISpriteWithSpeed, ISpriteWithTarget, IGeneratedSprite, ISpriteWithDamage
{
    BaseSpeed: number;
    CurrentHitbox: RectangleHitbox[];
    Collide: Map<CollideScenario, (param?: unknown) => void>;
    Generator: 'player' | 'enemy';
    Category: 'projectile' | 'nonProjectile';
    Damage: number;

    private target: IEnemy | undefined;
    private targetAngle: number;
    private screenLimitToFindTarget: number;

    constructor(parameters: { X: number; Y: number }) {
        const { X, Y } = parameters;
        super(
            ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').GetImage(
                'images/Skills/Mirror/ExplosiveEntity.png',
            ),
            InfoMirrorShield.ExplosiveEntity.Meta.TileDimensions.Width,
            InfoMirrorShield.ExplosiveEntity.Meta.TileDimensions.Height,
            X,
            Y,
            InfoMirrorShield.ExplosiveEntity.Meta.SpriteShiftPosition.X,
            InfoMirrorShield.ExplosiveEntity.Meta.SpriteShiftPosition.Y,
            CANVA_SCALEX,
            CANVA_SCALEY,
            InfoMirrorShield.ExplosiveEntity.Meta.RealDimension.Width,
            InfoMirrorShield.ExplosiveEntity.Meta.RealDimension.Height,
        );

        this.BaseSpeed = 10;
        this.CurrentHitbox = CreateHitboxesWithInfoFile(this.X, this.Y, [...InfoMirrorShield.ExplosiveEntity.Hitbox]);

        const { Idle, Destroyed } = InfoMirrorShield.ExplosiveEntity.Animations;
        this.AddAnimation('idle', Idle.Frames, Idle.FrameLengthInTime);

        this.AddAnimation('destroyed', Destroyed.Frames, Destroyed.FrameLengthInTime, undefined, () => {
            ServiceLocator.GetService<IServiceGeneratedSpritesManager>('GeneratedSpritesManager').RemoveSprite(this);
        });

        this.Collide = new Map();
        this.Collide.set('WithEnemy', () => {
            this.PlayAnimation('destroyed');
        });
        this.Generator = 'player';
        this.Category = 'projectile';
        this.Damage = 10;

        this.target = ServiceLocator.GetService<IServiceWaveManager>('WaveManager').GetARandomEnemy();
        this.targetAngle = Math.PI;
        const { width: canvasWidth } = canvas;
        this.screenLimitToFindTarget = (2 / 3) * canvasWidth;
    }

    UpdateHitboxes(dt: number) {
        this.CurrentHitbox.forEach((hitbox) => {
            hitbox.SpriteX = this.X;
            hitbox.SpriteY = this.Y;
        });
    }

    Update(dt: number) {
        super.Update(dt);
        this.X -= this.XSpeed;
        this.Y -= this.YSpeed;

        if (this.CurrentAnimationName !== 'destroyed') {
            ServiceLocator.GetService<IServiceCollideManager>(
                'CollideManager',
            ).HandleWhenPlayerProjectileCollideWithEnemies(this);
        }

        const { width: canvasWidth, height: canvasHeight } = canvas;
        if (this.X < 0 || this.X > canvasWidth || this.Y < 0 || this.Y > canvasHeight) {
            ServiceLocator.GetService<IServiceGeneratedSpritesManager>('GeneratedSpritesManager').RemoveSprite(this);
        }

        this.UpdateHitboxes(dt);
    }

    Draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(this.X + this.Width, this.Y + this.Height / 2);
        ctx.rotate(this.TargetAngle - Math.PI);
        ctx.translate(-(this.X + this.Width), -(this.Y + this.Height / 2));
        super.Draw(ctx);
        ctx.restore();
    }

    get TargetAngle(): number {
        if (this.target && this.target.CurrentAnimationName !== 'destroyed') {
            const { FrameXCenter: enemyX, FrameYCenter: enemyY } = this.target;
            const distX = this.X - enemyX;
            const distY = this.Y - enemyY;
            this.targetAngle = Math.atan2(distY, distX);
            return this.targetAngle;
        }

        if (this.X <= this.screenLimitToFindTarget) {
            this.target = ServiceLocator.GetService<IServiceWaveManager>('WaveManager').GetARandomEnemy();
        }

        return this.targetAngle;
    }

    get XSpeed(): number {
        if (this.CurrentAnimationName === 'destroyed') return 0;
        return Math.cos(this.TargetAngle) * this.BaseSpeed;
    }

    get YSpeed(): number {
        if (this.CurrentAnimationName === 'destroyed') return 0;
        return Math.sin(this.TargetAngle) * this.BaseSpeed;
    }
}

export class MirrorShieldPortals implements ISpriteWithUpdateAndDraw {
    private portals: MirrorShieldPortal[];
    private baseTimeMirrorDetaching: number;
    private currentTimeMirrorDetaching: number;

    constructor() {
        this.portals = [];
        InfoMirrorShield.Portal.Meta.SpriteShiftPositionOnMirror.forEach((shift) => {
            this.portals.push(new MirrorShieldPortal({ spriteShiftPositionOnMirror: shift }));
        });

        this.baseTimeMirrorDetaching = 1;
        this.currentTimeMirrorDetaching = this.baseTimeMirrorDetaching;
    }

    Update(dt: number) {
        this.currentTimeMirrorDetaching -= dt;

        if (this.currentTimeMirrorDetaching < 0 && this.portals.length > 0) {
            this.currentTimeMirrorDetaching = this.baseTimeMirrorDetaching;
            this.detachMirrors();
        }

        this.portals.forEach((portal) => {
            portal.Update(dt);
        });
    }

    Draw(ctx: CanvasRenderingContext2D) {
        this.portals.forEach((portal) => {
            portal.Draw(ctx);
        });
    }

    private detachMirrors() {
        const attachedPortals = this.portals.filter((portal) => portal.CurrentAnimationName === 'idle');
        const randomQuantityOfMirrorToDetach = Math.floor(Math.random() * attachedPortals.length);
        for (let i = 0; i < randomQuantityOfMirrorToDetach; i++) {
            const randomIndex = Math.floor(Math.random() * attachedPortals.length);
            const portal = attachedPortals[randomIndex];
            if (portal) {
                portal.PlayAnimation('detaching');
            }
        }
    }
}
