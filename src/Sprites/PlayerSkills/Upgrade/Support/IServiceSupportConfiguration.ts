import { ServiceLocator } from '../../../../ServiceLocator.js';
import { GetSpriteStaticInformation } from '../../../../SpriteStaticInformation/SpriteStaticInformationManager.js';
import { IServicePlayer } from '../../../Player.js';
import { Sprite } from '../../../Sprite.js';
import { SupportCosmetic } from './SupportCosmetic.js';
const InfoPlayer = GetSpriteStaticInformation({ sprite: 'Player' }).spriteInfo;

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

export interface IServiceSupportConfigurationGenerator {
    GetConfig: () => SupportConfiguration;
}
class SupportConfigurationGenerator implements IServiceSupportConfigurationGenerator {
    constructor() {
        ServiceLocator.AddService('SupportConfigurationGenerator', this);
    }

    public GetConfig(): SupportConfiguration {
        const playerSupportSkillLevel = ServiceLocator.GetService<IServicePlayer>('Player').SupportSkillLevel;

        let supportConfig = [];
        supportConfig = this.getSupportConfiguration(playerSupportSkillLevel);

        return new SupportConfiguration(supportConfig);
    }

    private getSupportConfiguration(skillLevel: number): Sprite[] {
        const supportConfig: Sprite[] = [];
        const { x: playerX, y: playerY } = ServiceLocator.GetService<IServicePlayer>('Player').Coordinate();
        const spriteShiftPositionArray = [];
        if (skillLevel == 1) {
            spriteShiftPositionArray.push(...InfoPlayer.SupportCosmetic.Level1.SpriteShiftPositionOnPlayer);
        } else if (skillLevel == 2) {
            spriteShiftPositionArray.push(...InfoPlayer.SupportCosmetic.Level2.SpriteShiftPositionOnPlayer);
        } else if (skillLevel == 3) {
            spriteShiftPositionArray.push(...InfoPlayer.SupportCosmetic.Level3.SpriteShiftPositionOnPlayer);
        }

        spriteShiftPositionArray.forEach((spriteShiftPosition) => {
            const { X, Y } = spriteShiftPosition;
            supportConfig.push(new SupportCosmetic({ X: playerX, Y: playerY, offsetXOnPlayer: X, offsetYOnPlayer: Y }));
        });

        return supportConfig;
    }
}

export function LoadSupportConfiguration() {
    const supportConfigurationGenerator = new SupportConfigurationGenerator();
}
