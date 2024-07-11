import { IServiceImageLoader } from '../ImageLoader.js';
import { IServiceSceneManager } from '../SceneManager.js';
import { canvas, CANVA_SCALEX, CANVA_SCALEY } from '../ScreenConstant.js';
import { ServiceLocator } from '../ServiceLocator.js';
import { FieldWithText } from '../UserInterface/Field.js';

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

    const widthOptionButton = 41 * CANVA_SCALEX;
    const heightOptionButton = 11 * CANVA_SCALEY;
    const xOptionButton = 139 * CANVA_SCALEX; //canvas.width / 2 - widthPlayButton / 2;
    const yOptionButton = 88 * CANVA_SCALEY; //canvas.height / 2 + heightPlayButton / 2;
    optionButton = new FieldWithText(
        xOptionButton,
        yOptionButton,
        widthOptionButton,
        heightOptionButton,
        'OPTION',
        6 * CANVA_SCALEX,
        fontFamily,
        true,
    );

    bigShipImage = ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').GetImage(
        'images/MenuScene/player-ship.png',
    );

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
    // // To debug draw the center of the canva
    // ctx.beginPath();
    // ctx.moveTo(canvas.width / 2, 0);
    // ctx.lineTo(canvas.width / 2, canvas.height);
    // ctx.stroke();
    // ctx.beginPath();
    // ctx.moveTo(0, canvas.height / 2);
    // ctx.lineTo(canvas.width, canvas.height / 2);
    // ctx.stroke();
    // Draw image, with scaled coordinate and scaled dimension
    ctx.drawImage(
        bigShipImage!,
        10 * CANVA_SCALEX,
        59 * CANVA_SCALEY,
        CANVA_SCALEX * bigShipImage!.width,
        CANVA_SCALEY * bigShipImage!.height,
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
