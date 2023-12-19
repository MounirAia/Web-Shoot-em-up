import { ServiceLocator } from '../../../../ServiceLocator.js';
import InfoRocketCannon from '../../../../SpriteInfoJSON/Skills/Upgrade/infoRocketCannon.js';
import { IServicePlayer } from '../../../Player.js';
import { Sprite } from '../../../Sprite.js';
import { AvailableAnimation } from '../../../SpriteAnimationsController.js';
import { CollideScenario, ISpriteWithHitboxes, RectangleHitbox } from '../../../SpriteHitbox.js';
import { RocketCannonLevel1, RocketCannonLevel2, RocketCannonLevel3 } from './RocketSkill/RocketCannon.js';

// Cannons are attached to the player sprite as an extension, thus the hitbox of the cannons are part of the hitbox of the player
// It is the responsability of the player sprite to call the animation of the cannon

export class CannonConfiguration {
    cannonConfiguration: (Sprite & ISpriteWithHitboxes)[];
    constructor(cannonConfiguration: (Sprite & ISpriteWithHitboxes)[]) {
        this.cannonConfiguration = cannonConfiguration;
    }

    public Update(dt: number) {
        this.cannonConfiguration?.forEach((cannon) => {
            cannon.Update(dt);
        });
    }

    public Draw(ctx: CanvasRenderingContext2D) {
        this.cannonConfiguration.forEach((cannon) => {
            cannon.Draw(ctx);
        });
    }

    public PlayAnimation(animationName: AvailableAnimation) {
        this.cannonConfiguration.forEach((cannon) => {
            cannon.AnimationsController.PlayAnimation({ animation: animationName });
        });
    }

    public PlayCollisionMethod(parameters: { collisionScenario: CollideScenario }) {
        const { collisionScenario } = parameters;
        this.cannonConfiguration.forEach((cannon) => {
            cannon.Collide.get(collisionScenario)?.();
        });
    }

    public get CurrentHitboxes(): RectangleHitbox[] {
        const currentHitboxes = this.cannonConfiguration.reduce((acc, cannon) => {
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
            return new CannonConfiguration([]);
        }

        let cannonConfig = [];
        if (playerSpecialSkillName === 'Rocket') {
            cannonConfig = this.getRocketCannonConfiguration(playerSpecialSkillLevel);
            return new CannonConfiguration(cannonConfig);
        }

        return new CannonConfiguration([]);
    }

    private getRocketCannonConfiguration(skillLevel: number): (Sprite & ISpriteWithHitboxes)[] {
        const cannonConfig = [];
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
        } else if (skillLevel == 2) {
            const cannon1 = new RocketCannonLevel2({
                X: playerX,
                Y: playerY,
                offsetXOnPlayer: InfoRocketCannon.Level2.Meta.SpriteShiftPositionOnPlayer.Cannon1.X,
                offsetYOnPlayer: InfoRocketCannon.Level2.Meta.SpriteShiftPositionOnPlayer.Cannon1.Y,
                direction: 'up',
            });
            const cannon2 = new RocketCannonLevel2({
                X: playerX,
                Y: playerY,
                offsetXOnPlayer: InfoRocketCannon.Level2.Meta.SpriteShiftPositionOnPlayer.Cannon2.X,
                offsetYOnPlayer: InfoRocketCannon.Level2.Meta.SpriteShiftPositionOnPlayer.Cannon2.Y,
                direction: 'down',
            });
            cannonConfig.push(cannon1, cannon2);
            return cannonConfig;
        } else if (skillLevel == 3) {
            const cannon1 = new RocketCannonLevel3({
                X: playerX,
                Y: playerY,
                offsetXOnPlayer: InfoRocketCannon.Level3.Meta.SpriteShiftPositionOnPlayer.Cannon1.X,
                offsetYOnPlayer: InfoRocketCannon.Level3.Meta.SpriteShiftPositionOnPlayer.Cannon1.Y,
                direction: 'up',
            });
            const cannon2 = new RocketCannonLevel3({
                X: playerX,
                Y: playerY,
                offsetXOnPlayer: InfoRocketCannon.Level3.Meta.SpriteShiftPositionOnPlayer.Cannon2.X,
                offsetYOnPlayer: InfoRocketCannon.Level3.Meta.SpriteShiftPositionOnPlayer.Cannon2.Y,
                direction: 'down',
            });
            cannonConfig.push(cannon1, cannon2);
            return cannonConfig;
        }

        return [];
    }
}

export function LoadCannonConfiguration() {
    const cannonConfigurationGenerator = new CannonConfigurationGenerator();
}
