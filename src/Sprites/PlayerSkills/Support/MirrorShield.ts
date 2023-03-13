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

export class MirrorShieldSkill implements ISkill {
    Type: SkillsTypeName;
    SkillName: PossibleSkillName;

    constructor() {
        this.Type = 'support';
        this.SkillName = 'MirrorShield';
    }

    Effect() {
        const mirror = new MirrorShieldLevel1();

        ServiceLocator.GetService<IServiceGeneratedSpritesManager>('GeneratedSpritesManager').AddSprite(mirror);
    }
}
