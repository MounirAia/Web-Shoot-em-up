import { GetSpriteStaticInformation } from '../../../../SpriteStaticInformation/SpriteStaticInformationManager.js';
import { Sprite } from '../../../Sprite.js';
import { PossibleSkillLevel } from '../../Skills.js';
import { SupportCosmetic } from './SupportCosmetic.js';

export class SupportConfiguration {
    supportConfiguration: Sprite[];
    constructor(supportConfiguration: Sprite[]) {
        this.supportConfiguration = supportConfiguration;
    }

    public Update(dt: number) {
        this.supportConfiguration?.forEach((support) => {
            support.Update(dt);
        });
    }

    public Draw(ctx: CanvasRenderingContext2D) {
        this.supportConfiguration.forEach((support) => {
            support.Draw(ctx);
        });
    }
}

export class SupportConfigurationFactory {
    private playerSupportSkillLevel: PossibleSkillLevel;
    private playerX: number;
    private playerY: number;

    constructor(parameters: { playerSupportSkillLevel: PossibleSkillLevel; playerX: number; playerY: number }) {
        const { playerSupportSkillLevel, playerX, playerY } = parameters;
        this.playerSupportSkillLevel = playerSupportSkillLevel;
        this.playerX = playerX;
        this.playerY = playerY;
    }

    public GetConfig(): SupportConfiguration {
        let supportConfig: Sprite[] = [];
        supportConfig = this.getSupportConfiguration(this.playerSupportSkillLevel);

        return new SupportConfiguration(supportConfig);
    }

    private getSupportConfiguration(skillLevel: number): Sprite[] {
        const supportConfig: Sprite[] = [];
        const { Level1, Level2, Level3 } = GetSpriteStaticInformation({ sprite: 'Player' }).spriteInfo.SupportCosmetic;
        const spriteShiftPositionArray: typeof Level1.SpriteShiftPositionOnPlayer = [];
        if (skillLevel == 1) {
            spriteShiftPositionArray.push(...Level1.SpriteShiftPositionOnPlayer);
        } else if (skillLevel == 2) {
            spriteShiftPositionArray.push(...Level2.SpriteShiftPositionOnPlayer);
        } else if (skillLevel == 3) {
            spriteShiftPositionArray.push(...Level3.SpriteShiftPositionOnPlayer);
        }

        spriteShiftPositionArray.forEach((spriteShiftPosition) => {
            const { X, Y } = spriteShiftPosition;
            supportConfig.push(
                new SupportCosmetic({ X: this.playerX, Y: this.playerY, offsetXOnPlayer: X, offsetYOnPlayer: Y }),
            );
        });

        return supportConfig;
    }
}
