import { IServiceImageLoader } from '../../../ImageLoader.js';
import { CANVA_SCALEX, CANVA_SCALEY } from '../../../ScreenConstant.js';
import { ServiceLocator } from '../../../ServiceLocator.js';
import { GetSkillsConstants, PossibleSkillLevel } from '../../../StatsJSON/Skills/Constant.js';
import { CollideScenario, ICollidableSprite } from '../../CollideManager.js';
import { CreateHitboxes, ISpriteWithHitboxes, RectangleHitbox } from '../../InterfaceBehaviour/ISpriteWithHitboxes.js';
import { IServicePlayer } from '../../Player.js';
import { AvailableAnimation, Sprite } from '../../Sprite.js';

class RegularCannon extends Sprite implements ISpriteWithHitboxes, ICollidableSprite {
    CurrentHitbox: RectangleHitbox[];
    private offsetXOnSprite: number;
    private offsetYOnSprite: number;

    Collide: Map<CollideScenario, (param?: unknown) => void>;

    constructor(x: number = 0, y: number = 0, offsetXOnSprite: number, offsetYOnSprite: number) {
        super(
            ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').GetImage('images/Player/Cannon.png'),
            8,
            8,
            x,
            y,
            3 * CANVA_SCALEX,
            1 * CANVA_SCALEY,
            CANVA_SCALEX,
            CANVA_SCALEY,
        );

        this.offsetXOnSprite = offsetXOnSprite;
        this.offsetYOnSprite = offsetYOnSprite;

        this.CurrentHitbox = CreateHitboxes(this.X, this.Y, [
            {
                offsetX: 0 * CANVA_SCALEX,
                offsetY: 0 * CANVA_SCALEY,
                width: 3 * CANVA_SCALEX,
                height: 5 * CANVA_SCALEY,
            },
        ]);

        this.AddAnimation('idle', [0], 1);

        this.AddAnimation('damaged', [1], 0.1, undefined, () => {
            this.PlayAnimation('idle');
        });

        const playerInvulnerabilityTimePeriod =
            ServiceLocator.GetService<IServicePlayer>('Player').InvulnerabilityTimePeriod;
        this.AddAnimation('invulnerable', [1, 0, 1, 0, 1], playerInvulnerabilityTimePeriod / 5, undefined, () => {
            this.PlayAnimation('idle');
        });

        this.Collide = new Map();
        this.Collide.set('WithBullet', () => {
            this.PlayAnimation('damaged');
        });

        this.PlayAnimation('idle');
    }

    UpdateHitboxes(dt: number) {
        this.CurrentHitbox.forEach((hitbox) => {
            hitbox.SpriteX = this.X;
            hitbox.SpriteY = this.Y;
        });
    }

    Update(dt: number) {
        super.Update(dt);

        const { x: playerX, y: playerY } = ServiceLocator.GetService<IServicePlayer>('Player').Coordinate();
        this.X = playerX + this.offsetXOnSprite;
        this.Y = playerY + this.offsetYOnSprite;

        this.UpdateHitboxes(dt);
    }
}

export class CannonConfiguration {
    cannonConfiguration: RegularCannon[] | undefined;
    constructor(cannonConfiguration: RegularCannon[] | undefined) {
        this.cannonConfiguration = cannonConfiguration;
    }

    public Update(dt: number) {
        this.cannonConfiguration?.forEach((cannon) => {
            cannon.Update(dt);
        });
    }

    public Draw(ctx: CanvasRenderingContext2D) {
        this.cannonConfiguration?.forEach((cannon) => {
            cannon.Draw(ctx);
        });
    }

    public PlayAnimation(animationName: AvailableAnimation) {
        this.cannonConfiguration?.forEach((cannon) => {
            cannon.PlayAnimation(animationName);
        });
    }

    public get CurrentHitboxes(): RectangleHitbox[] {
        const currentHitboxes = this.cannonConfiguration?.reduce((acc, cannon) => {
            cannon.CurrentHitbox.forEach((hitbox) => {
                acc.push(hitbox);
            });
            return acc;
        }, [] as RectangleHitbox[]);

        if (currentHitboxes) return currentHitboxes;

        return [];
    }
}

export interface IServiceCannonConfigurationGenerator {
    GetConfig: () => CannonConfiguration;
}
class CannonConfigurationGenerator implements IServiceCannonConfigurationGenerator {
    constructor() {
        ServiceLocator.AddService('CannonConfigurationGenerator', this);
    }

    public GetConfig(): CannonConfiguration {
        const playerSpecialSkillName = ServiceLocator.GetService<IServicePlayer>('Player').SpeciallSkillName;
        const playerSpecialSkillLevel = ServiceLocator.GetService<IServicePlayer>('Player').SpecialSkillLevel;
        if (!playerSpecialSkillName || playerSpecialSkillLevel === 0) {
            return new CannonConfiguration(undefined);
        }

        const cannonType = GetSkillsConstants(playerSpecialSkillName, playerSpecialSkillLevel).cannonType;
        let cannonConfig: RegularCannon[] | undefined;
        if (cannonType === 'regular') {
            cannonConfig = this.getRegularCannonConfiguration(playerSpecialSkillLevel);
            return new CannonConfiguration(cannonConfig);
        }

        return new CannonConfiguration(undefined);
    }

    private getRegularCannonConfiguration(skillLevel: PossibleSkillLevel): RegularCannon[] | undefined {
        const cannonConfig: RegularCannon[] = [];
        const { x: playerX, y: playerY } = ServiceLocator.GetService<IServicePlayer>('Player').Coordinate();
        if (skillLevel === 1) {
            const cannon1 = new RegularCannon(playerX, playerY, 19 * CANVA_SCALEX, CANVA_SCALEY * -5);
            cannonConfig.push(cannon1);
            return cannonConfig;
        } else if (skillLevel >= 2) {
            const cannon1 = new RegularCannon(playerX, playerY, 19 * CANVA_SCALEX, CANVA_SCALEY * -5);
            const cannon2 = new RegularCannon(playerX, playerY, 19 * CANVA_SCALEX, CANVA_SCALEY * 12);
            cannonConfig.push(cannon1, cannon2);
            return cannonConfig;
        }

        return undefined;
    }
}

export function LoadCannonConfiguration() {
    const cannonConfigurationGenrator = new CannonConfigurationGenerator();
}
