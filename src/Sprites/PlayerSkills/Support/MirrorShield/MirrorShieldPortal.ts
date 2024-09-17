import { IServiceImageLoader } from '../../../../ImageLoader.js';
import { CANVA_SCALEX, CANVA_SCALEY, canvas } from '../../../../ScreenConstant.js';
import { ServiceLocator } from '../../../../ServiceLocator.js';
import { IServiceUtilManager } from '../../../../UtilManager.js';
import { IServiceWaveManager } from '../../../../WaveManager/WaveManager.js';
import { IServiceCollideManager } from '../../../CollideManager.js';
import { IEnemy } from '../../../Enemies/IEnemy.js';
import { IGeneratedSprite, IServiceGeneratedSpritesManager } from '../../../GeneratedSpriteManager.js';
import { IServicePlayer } from '../../../Player.js';
import { PlayerProjectileDamageEffectController } from '../../../PlayerProjectileDamageEffectsController.js';
import { Sprite } from '../../../Sprite.js';
import {
    ISpriteWithDamage,
    ISpriteWithDamageEffects,
    ISpriteWithSpeed,
    ISpriteWithTarget,
    ISpriteWithUpdateAndDraw,
} from '../../../SpriteAttributes.js';
import { CollideScenario, CreateHitboxesWithInfoFile, RectangleHitbox } from '../../../SpriteHitbox.js';
import { ExplosiveDamageEffect } from '../../DamageEffect/ExplosiveDamageEffect.js';
import { GetSpriteStaticInformation } from '../../../../SpriteStaticInformation/SpriteStaticInformationManager.js';

const MirrorShieldConstant = GetSpriteStaticInformation({ sprite: 'Mirror' }).constant.Mirror;
const MirrorShieldExplosiveEntityConstant = GetSpriteStaticInformation({ sprite: 'Mirror' }).constant.ExplosiveEntity;
const MirrorShieldDamage = GetSpriteStaticInformation({ sprite: 'Mirror' }).stats;
const InfoMirrorShield = GetSpriteStaticInformation({ sprite: 'Mirror' }).spriteInfo;

class MirrorShieldPortal extends Sprite {
    private offsetXOnPlayer: number;
    private offsetYOnPlayer: number;
    private static potentialMirrorPositions: { X: number; Y: number }[] = [];
    private numberOfExplosiveEntitiesToSpawnPerSecond: number;
    private remainingNumberOfExplosiveEntitiesToSpawnPerSecond: number;

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
        this.numberOfExplosiveEntitiesToSpawnPerSecond = MirrorShieldConstant[2]['Quantity Explosive Entity / Second'];
        this.remainingNumberOfExplosiveEntitiesToSpawnPerSecond = this.numberOfExplosiveEntitiesToSpawnPerSecond;

        const { Idle, Detaching, Attaching, Disappearing, Generating, Spawning } = InfoMirrorShield.Portal.Animations;

        this.AnimationsController.AddAnimation({
            animation: 'idle',
            frames: Idle.Frames,
            framesLengthInTime: Idle.FrameLengthInTime,
        });
        this.AnimationsController.AddAnimation({
            animation: 'attaching',
            frames: Attaching.Frames,
            framesLengthInTime: Attaching.FrameLengthInTime,
            afterPlayingAnimation: () => {
                const { Width, Height } = InfoMirrorShield.Portal.Meta.RealDimension.Short;
                this.Width = Width;
                this.Height = Height;

                this.AnimationsController.PlayAnimation({ animation: 'idle' });
            },
        });
        this.AnimationsController.AddAnimation({
            animation: 'disappearing',
            frames: Disappearing.Frames,
            framesLengthInTime: Disappearing.FrameLengthInTime,
            afterPlayingAnimation: () => {
                MirrorShieldPortal.potentialMirrorPositions.push({ X: this.X, Y: this.Y });
                this.AnimationsController.PlayAnimation({ animation: 'attaching' });
            },
        });
        this.AnimationsController.AddAnimation({
            animation: 'generating',
            frames: Generating.Frames,
            framesLengthInTime: Generating.FrameLengthInTime,
            beforePlayingAnimation: () => {
                const { Width, Height } = InfoMirrorShield.Portal.Meta.RealDimension.Long;
                this.Width = Width;
                this.Height = Height;
            },
        });
        this.AnimationsController.AddAnimation({
            animation: 'spawning',
            frames: Spawning.Frames,
            framesLengthInTime: Spawning.FrameLengthInTime,
            afterPlayingAnimation: () => {
                this.AnimationsController.PlayAnimation({ animation: 'generating', loop: true });
            },
        });
        this.AnimationsController.AddAnimation({
            animation: 'detaching',
            frames: Detaching.Frames,
            framesLengthInTime: Detaching.FrameLengthInTime,
            afterPlayingAnimation: () => {
                const { X, Y } = this.getRandomPotentialPortalPosition();
                this.X = X;
                this.Y = Y;
                this.AnimationsController.PlayAnimation({ animation: 'spawning' });
            },
        });

        this.AnimationsController.PlayAnimation({ animation: 'idle' });
    }

    Update(dt: number) {
        super.Update(dt);
        const { x: playerX, y: playerY } = ServiceLocator.GetService<IServicePlayer>('Player').Coordinate();
        if (
            this.AnimationsController.CurrentAnimationName === 'idle' ||
            this.AnimationsController.CurrentAnimationName === 'attaching'
        ) {
            this.X = playerX + this.offsetXOnPlayer;
            this.Y = playerY + this.offsetYOnPlayer;
        } else if (this.AnimationsController.CurrentAnimationName === 'generating') {
            this.remainingNumberOfExplosiveEntitiesToSpawnPerSecond -= 1;
            this.generatesExplosiveEntity();
            if (this.remainingNumberOfExplosiveEntitiesToSpawnPerSecond <= 0) {
                this.AnimationsController.PlayAnimation({ animation: 'disappearing' });
                this.remainingNumberOfExplosiveEntitiesToSpawnPerSecond =
                    this.numberOfExplosiveEntitiesToSpawnPerSecond;
            }
        }
    }

    private initializePotentialPositions() {
        // initialize positions only for the first portal
        if (MirrorShieldPortal.potentialMirrorPositions.length === 0) {
            const startX = 10 * CANVA_SCALEX;
            const startY = 17 * CANVA_SCALEY;
            const columnStep = 20 * CANVA_SCALEX;
            const rowStep = 20 * CANVA_SCALEY;
            const gridWidth = 180 * CANVA_SCALEX;
            const gridHeight = 138 * CANVA_SCALEY;
            const numberOfColumns = Math.floor(gridWidth / columnStep);
            const numberOfRows = Math.floor(gridHeight / rowStep);

            for (let i = 0; i < numberOfColumns; i++) {
                for (let j = 0; j < numberOfRows; j++) {
                    MirrorShieldPortal.potentialMirrorPositions.push({
                        X: startX + i * columnStep,
                        Y: startY + j * rowStep,
                    });
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
    implements ISpriteWithSpeed, ISpriteWithTarget, IGeneratedSprite, ISpriteWithDamage, ISpriteWithDamageEffects
{
    BaseSpeed: number;
    CurrentHitbox: RectangleHitbox[];
    Collide: Map<CollideScenario, (param?: unknown) => void>;
    Generator: 'player' | 'enemy';
    Category: 'projectile' | 'nonProjectile';
    Damage: number;
    DamageEffectsController: PlayerProjectileDamageEffectController;

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

        this.BaseSpeed = ServiceLocator.GetService<IServiceUtilManager>(
            'UtilManager',
        ).GetSpeedItTakesToCoverHalfTheScreenWidth({
            framesItTakes: MirrorShieldExplosiveEntityConstant[0]['Projectile Speed'],
        });

        this.Generator = 'player';
        this.Category = 'projectile';
        const MirrorShieldDamageInfo =
            MirrorShieldDamage[ServiceLocator.GetService<IServicePlayer>('Player').NumberOfBoosts];
        this.Damage = MirrorShieldDamageInfo['Explosive Entity Damage'];
        this.DamageEffectsController = new PlayerProjectileDamageEffectController({ baseDamage: this.Damage });
        this.DamageEffectsController.AddDamageEffects({
            damageEffectName: MirrorShieldExplosiveEntityConstant[0]['Primary Skill'],
            damageEffectObject: new ExplosiveDamageEffect({
                explosiveEffectStat: MirrorShieldDamageInfo['Explosive Stat (%)'],
            }),
        });

        this.CurrentHitbox = CreateHitboxesWithInfoFile(this.X, this.Y, [...InfoMirrorShield.ExplosiveEntity.Hitbox]);

        const { Idle, Destroyed } = InfoMirrorShield.ExplosiveEntity.Animations;
        this.AnimationsController.AddAnimation({
            animation: 'idle',
            frames: Idle.Frames,
            framesLengthInTime: Idle.FrameLengthInTime,
        });

        this.AnimationsController.AddAnimation({
            animation: 'destroyed',
            frames: Destroyed.Frames,
            framesLengthInTime: Destroyed.FrameLengthInTime,
            afterPlayingAnimation: () => {
                ServiceLocator.GetService<IServiceGeneratedSpritesManager>('GeneratedSpritesManager').RemoveSprite(
                    this,
                );
            },
        });

        this.Collide = new Map();
        this.Collide.set('WithEnemy', () => {
            this.AnimationsController.PlayAnimation({ animation: 'destroyed' });
        });
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

        if (this.AnimationsController.CurrentAnimationName !== 'destroyed') {
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
        if (this.target && this.target.AnimationsController.CurrentAnimationName !== 'destroyed') {
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
        if (this.AnimationsController.CurrentAnimationName === 'destroyed') return 0;
        return Math.cos(this.TargetAngle) * this.BaseSpeed;
    }

    get YSpeed(): number {
        if (this.AnimationsController.CurrentAnimationName === 'destroyed') return 0;
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

        this.baseTimeMirrorDetaching = MirrorShieldConstant[2]['Portal Detachment Cooldown (s)'];
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
        const attachedPortals = this.portals.filter(
            (portal) => portal.AnimationsController.CurrentAnimationName === 'idle',
        );
        const randomQuantityOfMirrorToDetach = Math.floor(Math.random() * attachedPortals.length);
        for (let i = 0; i < randomQuantityOfMirrorToDetach; i++) {
            const randomIndex = Math.floor(Math.random() * attachedPortals.length);
            const portal = attachedPortals[randomIndex];
            if (portal) {
                portal.AnimationsController.PlayAnimation({ animation: 'detaching' });
            }
        }
    }
}
