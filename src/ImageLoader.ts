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
    assets.push('images/player.png');
    const imageLoader: ImageLoader = new ImageLoader(assets);

    ServiceLocator.addService('ImageLoader', imageLoader);
}
