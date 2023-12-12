import { ServiceLocator } from '../../../../ServiceLocator.js';
import InfoRocketCannon from '../../../../SpriteInfoJSON/Skills/Upgrade/infoRocketCannon.js';
import { IServicePlayer } from '../../../Player.js';
import { AvailableAnimation } from '../../../SpriteAnimationsController.js';
import { CollideScenario, RectangleHitbox } from '../../../SpriteHitbox.js';
import { RocketCannonLevel1 } from './RocketSkill/RocketCannon.js';

// Cannons are attached to the player sprite as an extension, thus the hitbox of the cannons are part of the hitbox of the player
// It is the responsability of the player sprite to call the animation of the cannon

export class CannonConfiguration {
    cannonConfiguration: RocketCannonLevel1[] | undefined;
    constructor(cannonConfiguration: RocketCannonLevel1[] | undefined) {
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
            cannon.AnimationsController.PlayAnimation({ animation: animationName });
        });
    }

    public PlayCollisionMethod(parameters: { collisionScenario: CollideScenario }) {
        const { collisionScenario } = parameters;
        this.cannonConfiguration?.forEach((cannon) => {
            cannon.Collide.get(collisionScenario)?.();
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

        let cannonConfig: RocketCannonLevel1[] | undefined;
        if (playerSpecialSkillName === 'Rocket') {
            cannonConfig = this.getRocketCannonConfiguration(playerSpecialSkillLevel);
            return new CannonConfiguration(cannonConfig);
        }

        return new CannonConfiguration(undefined);
    }

    private getRocketCannonConfiguration(skillLevel: number): RocketCannonLevel1[] | undefined {
        const cannonConfig: RocketCannonLevel1[] = [];
        const { x: playerX, y: playerY } = ServiceLocator.GetService<IServicePlayer>('Player').Coordinate();
        if (skillLevel === 1) {
            const cannon1 = new RocketCannonLevel1({
                X: playerX,
                Y: playerY,
                offsetXOnPlayer: InfoRocketCannon.Level1.Meta.SpriteShiftPositionOnPlayer.Cannon1.X,
                offsetYOnPlayer: InfoRocketCannon.Level1.Meta.SpriteShiftPositionOnPlayer.Cannon1.Y,
            });
            cannonConfig.push(cannon1);
            return cannonConfig;
        } else if (skillLevel == 2 || skillLevel == 3) {
            const cannon1 = new RocketCannonLevel1({
                X: playerX,
                Y: playerY,
                offsetXOnPlayer: InfoRocketCannon.Level2.Meta.SpriteShiftPositionOnPlayer.Cannon1.X,
                offsetYOnPlayer: InfoRocketCannon.Level2.Meta.SpriteShiftPositionOnPlayer.Cannon1.Y,
            });
            const cannon2 = new RocketCannonLevel1({
                X: playerX,
                Y: playerY,
                offsetXOnPlayer: InfoRocketCannon.Level2.Meta.SpriteShiftPositionOnPlayer.Cannon2.X,
                offsetYOnPlayer: InfoRocketCannon.Level2.Meta.SpriteShiftPositionOnPlayer.Cannon2.Y,
            });
            cannonConfig.push(cannon1, cannon2);
            return cannonConfig;
        }

        return undefined;
    }
}

export function LoadCannonConfiguration() {
    const cannonConfigurationGenrator = new CannonConfigurationGenerator();
}
