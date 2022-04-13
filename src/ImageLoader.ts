import { ServiceLocator } from './ServiceLocator.js';

export interface IServiceImageLoader {
    getImage(imagePath: string): HTMLImageElement;
    isGameReady(): boolean;
}

class ImageLoader implements IServiceImageLoader {
    private static isGameReady = false;
    private listImages: { [key: string]: HTMLImageElement };
    private numberImagesLoaded: number = 0;

    constructor(imagesPath: string[]) {
        this.listImages = {};
        for (const imagePath of imagesPath) {
            this.listImages[imagePath] = new Image();
            this.listImages[imagePath].src = imagePath;
            this.listImages[imagePath].onload = () => {
                this.numberImagesLoaded++;
                if (this.numberImagesLoaded === imagesPath.length) ImageLoader.isGameReady = true;
            };
        }
    }

    public getImage(imagePath: string): HTMLImageElement {
        return this.listImages[imagePath];
    }

    public isGameReady(): boolean {
        return ImageLoader.isGameReady;
    }
}

export function loadImageLoader() {
    // load images
    const assets: string[] = [];
    assets.push('images/cardBack_blue1.png');
    assets.push('images/cardBack_blue2.png');
    assets.push('images/cardBack_blue3.png');
    assets.push('images/cardBack_blue4.png');
    assets.push('images/cardBack_blue5.png');
    assets.push('images/cardBack_green1.png');
    assets.push('images/cardBack_green2.png');
    assets.push('images/cardBack_green3.png');
    assets.push('images/cardBack_green4.png');
    assets.push('images/cardBack_green5.png');
    assets.push('images/cardHearts10.png');
    assets.push('images/cardHearts3.png');
    assets.push('images/cardHearts4.png');
    assets.push('images/cardHearts5.png');
    assets.push('images/cardHearts6.png');
    assets.push('images/cardHearts7.png');
    assets.push('images/cardHearts8.png');
    assets.push('images/cardHearts9.png');
    assets.push('images/cardHeartsA.png');
    assets.push('images/cardHeartsJ.png');
    assets.push('images/cardSpades10.png');
    assets.push('images/cardSpadesA.png');
    assets.push('images/cardSpadesJ.png');
    assets.push('images/cardSpadesK.png');
    assets.push('images/cardSpadesQ.png');
    assets.push('images/player.png');
    const imageLoader: ImageLoader = new ImageLoader(assets);

    ServiceLocator.addService('ImageLoader', imageLoader);
}
