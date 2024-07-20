import { ServiceLocator } from '../../../../ServiceLocator.js';
import { GetSpriteStaticInformation } from '../../../../SpriteStaticInformation/SpriteStaticInformationManager.js';
import { IServicePlayer } from '../../../Player.js';
import { Sprite } from '../../../Sprite.js';
import { EffectCosmetic } from './EffectCosmetic.js';

const InfoPlayer = GetSpriteStaticInformation({ sprite: 'Player' }).spriteInfo;

export class EffectConfiguration {
    effectConfiguration: Sprite[];
    constructor(effectConfiguration: Sprite[]) {
        this.effectConfiguration = effectConfiguration;
    }

    public Update(dt: number) {
        this.effectConfiguration?.forEach((effect) => {
            effect.Update(dt);
        });
    }

    public Draw(ctx: CanvasRenderingContext2D) {
        this.effectConfiguration.forEach((effect) => {
            effect.Draw(ctx);
        });
    }
}

export interface IServiceEffectConfigurationGenerator {
    GetConfig: () => EffectConfiguration;
}
class EffectConfigurationGenerator implements IServiceEffectConfigurationGenerator {
    constructor() {
        ServiceLocator.AddService('EffectConfigurationGenerator', this);
    }

    public GetConfig(): EffectConfiguration {
        const playerEffectSkillLevel = ServiceLocator.GetService<IServicePlayer>('Player').EffectSkillLevel;

        let effectConfig = [];
        effectConfig = this.getEffectConfiguration(playerEffectSkillLevel);

        return new EffectConfiguration(effectConfig);
    }

    private getEffectConfiguration(skillLevel: number): Sprite[] {
        const effectConfig: Sprite[] = [];
        const { x: playerX, y: playerY } = ServiceLocator.GetService<IServicePlayer>('Player').Coordinate();
        const spriteShiftPositionArray = [];
        if (skillLevel == 1) {
            spriteShiftPositionArray.push(...InfoPlayer.EffectCosmetic.Level1.SpriteShiftPositionOnPlayer);
        } else if (skillLevel == 2) {
            spriteShiftPositionArray.push(...InfoPlayer.EffectCosmetic.Level2.SpriteShiftPositionOnPlayer);
        } else if (skillLevel == 3) {
            spriteShiftPositionArray.push(...InfoPlayer.EffectCosmetic.Level3.SpriteShiftPositionOnPlayer);
        }

        spriteShiftPositionArray.forEach((spriteShiftPosition) => {
            const { X, Y } = spriteShiftPosition;
            effectConfig.push(new EffectCosmetic({ X: playerX, Y: playerY, offsetXOnPlayer: X, offsetYOnPlayer: Y }));
        });

        return effectConfig;
    }
}

export function LoadEffectConfiguration() {
    const effectConfigurationGenerator = new EffectConfigurationGenerator();
}
