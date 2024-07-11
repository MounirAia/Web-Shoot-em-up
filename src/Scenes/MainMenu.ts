import { IServiceImageLoader } from '../ImageLoader.js';
import { IServiceSceneManager } from '../SceneManager.js';
import { canvas, CANVA_SCALEX, CANVA_SCALEY } from '../ScreenConstant.js';
import { ServiceLocator } from '../ServiceLocator.js';
import { FieldWithText } from '../UserInterface/Field.js';
import { IServiceUtilManager } from '../UtilManager.js';

let title: FieldWithText;
let playButton: undefined | FieldWithText;
let optionButton: FieldWithText | undefined;
let bigShipImage: HTMLImageElement | undefined;
let manyEnemies: HTMLImageElement | undefined;

/* Change it during refactor of ImageLoader to AssetManager */

export function LoadMainMenu() {
    const SceneManager = ServiceLocator.GetService<IServiceSceneManager>('SceneManager');
    const widthTitle = 136 * CANVA_SCALEX;
    const heightTitle = 9 * CANVA_SCALEY;
    const xTitle = 92 * CANVA_SCALEX; // canvas.width / 2 - widthPlayButton / 2;
    const yTitle = 18 * CANVA_SCALEY; // canvas.height / 2 - heightPlayButton - heightPlayButton / 2;
    const fontFamily = 'pixel';
    title = new FieldWithText(xTitle, yTitle, widthTitle, heightTitle, "WEB SHOOT'EM UP", 9 * CANVA_SCALEX, fontFamily);
    title.HasBorderOnAllSide = false;
    title.HasBottomBorder = true;

    const widthPlayButton = 41 * CANVA_SCALEX;
    const heightPlayButton = 11 * CANVA_SCALEY;
    const xPlayButton = 139 * CANVA_SCALEX; //canvas.width / 2 - widthPlayButton / 2;
    const yPlayButton = 69 * CANVA_SCALEY; //canvas.height / 2 - heightPlayButton - heightPlayButton / 2;
    playButton = new FieldWithText(
        xPlayButton,
        yPlayButton,
        widthPlayButton,
        heightPlayButton,
        'PLAY',
        6 * CANVA_SCALEX,
        fontFamily,
        true,
        () => {
            SceneManager.PlayScene('Game');
        },
    );

    bigShipImage =
        ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').GetImage('images/MenuScene/Player.png');

    manyEnemies = ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').GetImage(
        'images/MenuScene/many-enemies.png',
    );
}

export function UpdateMainMenu(dt: number) {
    playButton?.Update(dt);
}

export function DrawMainMenu(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.fillStyle = '#CCCCCC';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    title?.Draw(ctx);
    playButton?.Draw(ctx);
    optionButton?.Draw(ctx);

    // Draw image, with scaled coordinate and scaled dimension
    const shipScaleX = 2 * CANVA_SCALEX;
    const shipScaleY = 2 * CANVA_SCALEY;
    console.log(bigShipImage!.width / 2);
    ctx.drawImage(
        bigShipImage!,
        canvas.width / 2 - (bigShipImage!.width / 2) * shipScaleX - 100 * CANVA_SCALEX,
        canvas.height / 2 - (bigShipImage!.height / 2) * shipScaleY,
        shipScaleX * bigShipImage!.width,
        shipScaleY * bigShipImage!.height,
    );

    ctx.drawImage(
        manyEnemies!,
        230 * CANVA_SCALEX,
        48 * CANVA_SCALEY,
        CANVA_SCALEX * manyEnemies!.width,
        CANVA_SCALEY * manyEnemies!.height,
    );
    ctx.restore();
}
