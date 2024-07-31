import { ServiceLocator } from '../../../../ServiceLocator.js';
import { GetSpriteStaticInformation } from '../../../../SpriteStaticInformation/SpriteStaticInformationManager.js';
import { IServicePlayer } from '../../../Player.js';
import { Sprite } from '../../../Sprite.js';
import { AvailableAnimation } from '../../../SpriteAnimationsController.js';
import { CollideScenario, ISpriteWithHitboxes, RectangleHitbox } from '../../../SpriteHitbox.js';
import { PossibleSkillLevel, PossibleSkillName } from '../../Skills.js';
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

export class CannonConfigurationFactory {
    private playerSpecialSkillName?: PossibleSkillName;
    private playerSpecialSkillLevel: PossibleSkillLevel;
    private playerX: number;
    private playerY: number;

    constructor(parameters: {
        playerSpecialSkillName?: PossibleSkillName;
        playerSpecialSkillLevel: PossibleSkillLevel;
        playerX: number;
        playerY: number;
    }) {
        const { playerSpecialSkillName, playerSpecialSkillLevel, playerX, playerY } = parameters;
        this.playerSpecialSkillName = playerSpecialSkillName;
        this.playerSpecialSkillLevel = playerSpecialSkillLevel;
        this.playerX = playerX;
        this.playerY = playerY;
    }

    public GetConfig(): CannonConfiguration {
        if (!this.playerSpecialSkillName || this.playerSpecialSkillLevel === 0) {
            return new CannonConfiguration([]);
        }

        let cannonConfig: (Sprite & ISpriteWithHitboxes)[] = [];
        if (this.playerSpecialSkillName === 'Rocket') {
            cannonConfig = this.getRocketCannonConfiguration(this.playerSpecialSkillLevel);
            return new CannonConfiguration(cannonConfig);
        }

        return new CannonConfiguration([]);
    }

    private getRocketCannonConfiguration(skillLevel: number): (Sprite & ISpriteWithHitboxes)[] {
        const { Level1, Level2, Level3 } = GetSpriteStaticInformation({ sprite: 'RocketCannonCosmetic' }).spriteInfo;
        if (skillLevel === 1) {
            const cannonConfig: RocketCannonLevel1[] = [];
            const cannon1 = new RocketCannonLevel1({
                X: this.playerX,
                Y: this.playerY,
                offsetXOnPlayer: Level1.Meta.SpriteShiftPositionOnPlayer.Cannon1.X,
                offsetYOnPlayer: Level1.Meta.SpriteShiftPositionOnPlayer.Cannon1.Y,
            });
            cannonConfig.push(cannon1);
            return cannonConfig;
        } else if (skillLevel == 2) {
            const cannonConfig: RocketCannonLevel2[] = [];
            const cannon1 = new RocketCannonLevel2({
                X: this.playerX,
                Y: this.playerY,
                offsetXOnPlayer: Level2.Meta.SpriteShiftPositionOnPlayer.Cannon1.X,
                offsetYOnPlayer: Level2.Meta.SpriteShiftPositionOnPlayer.Cannon1.Y,
                direction: 'up',
            });
            const cannon2 = new RocketCannonLevel2({
                X: this.playerX,
                Y: this.playerY,
                offsetXOnPlayer: Level2.Meta.SpriteShiftPositionOnPlayer.Cannon2.X,
                offsetYOnPlayer: Level2.Meta.SpriteShiftPositionOnPlayer.Cannon2.Y,
                direction: 'down',
            });
            cannonConfig.push(cannon1, cannon2);
            return cannonConfig;
        } else if (skillLevel == 3) {
            const cannonConfig: RocketCannonLevel3[] = [];
            const cannon1 = new RocketCannonLevel3({
                X: this.playerX,
                Y: this.playerY,
                offsetXOnPlayer: Level3.Meta.SpriteShiftPositionOnPlayer.Cannon1.X,
                offsetYOnPlayer: Level3.Meta.SpriteShiftPositionOnPlayer.Cannon1.Y,
                direction: 'up',
            });
            const cannon2 = new RocketCannonLevel3({
                X: this.playerX,
                Y: this.playerY,
                offsetXOnPlayer: Level3.Meta.SpriteShiftPositionOnPlayer.Cannon2.X,
                offsetYOnPlayer: Level3.Meta.SpriteShiftPositionOnPlayer.Cannon2.Y,
                direction: 'down',
            });
            cannonConfig.push(cannon1, cannon2);
            return cannonConfig;
        }

        return [];
    }
}
