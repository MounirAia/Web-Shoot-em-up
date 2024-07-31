import { GetSpriteStaticInformation } from '../../../../SpriteStaticInformation/SpriteStaticInformationManager.js';
import { Sprite } from '../../../Sprite.js';
import { PossibleSkillLevel } from '../../Skills.js';
import { EffectCosmetic } from './EffectCosmetic.js';

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

export class EffectConfigurationFactory {
    private playerEffectSkillLevel: PossibleSkillLevel;
    private playerX: number;
    private playerY: number;

    constructor(parameters: { playerEffectSkillLevel: PossibleSkillLevel; playerX: number; playerY: number }) {
        const { playerEffectSkillLevel, playerX, playerY } = parameters;
        this.playerEffectSkillLevel = playerEffectSkillLevel;
        this.playerX = playerX;
        this.playerY = playerY;
    }

    public GetConfig(): EffectConfiguration {
        let effectConfig: Sprite[] = [];
        effectConfig = this.getEffectConfiguration(this.playerEffectSkillLevel);

        return new EffectConfiguration(effectConfig);
    }

    private getEffectConfiguration(skillLevel: number): Sprite[] {
        const effectConfig: Sprite[] = [];
        const { Level1, Level2, Level3 } = GetSpriteStaticInformation({ sprite: 'Player' }).spriteInfo.EffectCosmetic;
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
            effectConfig.push(
                new EffectCosmetic({ X: this.playerX, Y: this.playerY, offsetXOnPlayer: X, offsetYOnPlayer: Y }),
            );
        });

        return effectConfig;
    }
}
