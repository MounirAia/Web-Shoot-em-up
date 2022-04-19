import { ServiceLocator } from './ServiceLocator.js';

export interface IServiceImageLoader {
    GetImage(imagePath: string): HTMLImageElement;
    IsGameReady(): boolean;
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

    public GetImage(imagePath: string): HTMLImageElement {
        return this.listImages[imagePath];
    }

    public IsGameReady(): boolean {
        return ImageLoader.isGameReady;
    }
}

export function LoadImageLoader() {
    // load images
    const assets: string[] = [];
    assets.push('images/player.png');
    assets.push('images/galaxy.png');
    const imageLoader: ImageLoader = new ImageLoader(assets);

    ServiceLocator.AddService('ImageLoader', imageLoader);
}
