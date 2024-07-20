import { IServiceImageLoader } from '../../../../ImageLoader.js';
import { CANVA_SCALEX, CANVA_SCALEY } from '../../../../ScreenConstant.js';
import { ServiceLocator } from '../../../../ServiceLocator.js';
import { GetSpriteStaticInformation } from '../../../../SpriteStaticInformation/SpriteStaticInformationManager.js';
import { IServicePlayer } from '../../../Player.js';
import { Sprite } from '../../../Sprite.js';

const InfoPlayer = GetSpriteStaticInformation({ sprite: 'Player' }).spriteInfo;
export class SupportCosmetic extends Sprite {
    private offsetXOnPlayer: number;
    private offsetYOnPlayer: number;

    constructor(parameters: { X: number; Y: number; offsetXOnPlayer: number; offsetYOnPlayer: number }) {
        const { X, Y, offsetXOnPlayer, offsetYOnPlayer } = parameters;
        super(
            ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').GetImage(
                'images/Skills/Upgrade/SupportEvolution.png',
            ),
            InfoPlayer.Meta.TileDimensions.Width,
            InfoPlayer.Meta.TileDimensions.Height,
            X,
            Y,
            InfoPlayer.SupportCosmetic.Meta.SpriteShiftPosition.X,
            InfoPlayer.SupportCosmetic.Meta.SpriteShiftPosition.Y,
            CANVA_SCALEX,
            CANVA_SCALEY,
        );

        this.offsetXOnPlayer = offsetXOnPlayer;
        this.offsetYOnPlayer = offsetYOnPlayer;
    }

    Update(dt: number) {
        super.Update(dt);
        const { x: playerX, y: playerY } = ServiceLocator.GetService<IServicePlayer>('Player').Coordinate();
        this.X = playerX + this.offsetXOnPlayer;
        this.Y = playerY + this.offsetYOnPlayer;
    }
}
