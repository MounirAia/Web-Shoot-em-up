/// <reference types="vite/client" />
import { ServiceLocator } from './ServiceLocator.js';

export interface IServiceImageLoader {
    GetImage(imagePath: string): HTMLImageElement;
    IsGameReady(): boolean;
}

class ImageLoader implements IServiceImageLoader {
    private static isGameReady = false;

    private listImages: { [key: string]: HTMLImageElement };

    private numberImagesLoaded = 0;

    constructor(imagesPath: Record<string, string>) {
        this.listImages = {};

        // Loading Images
        const imagesPathEntries = Object.entries(imagesPath);
        for (const [key, imagePath] of imagesPathEntries) {
            this.listImages[key] = new Image();
            this.listImages[key].src = imagePath;
            this.listImages[key].onload = () => {
                this.numberImagesLoaded++;
                if (this.numberImagesLoaded === imagesPathEntries.length) {
                    ImageLoader.isGameReady = true;
                }
            };
        }

        ServiceLocator.AddService('ImageLoader', this);
    }

    public GetImage(imagePath: string): HTMLImageElement {
        return this.listImages[imagePath];
    }

    public IsGameReady(): boolean {
        return ImageLoader.isGameReady;
    }
}

export function LoadImageLoader() {
    // load all the images in the images folder
    const images = import.meta.glob('./assets/images/**/*.png', { eager: true });

    // Create a dictionary of all the images with the path as the key and the image as the value (in the final build the image will be a base64 string)
    // This Image Value in the 'default' key could be a path to the image file in the dist directory, or it could be a base64-encoded data URL if the image is small
    // enough and your Vite configuration allows it.
    const imageAssets = Object.fromEntries(
        Object.entries(images).map(([path, module]: [string, any]) => [path.replace('./assets/', ''), module.default]),
    );

    new ImageLoader(imageAssets); // Load all the assets and add itself as a service
}
