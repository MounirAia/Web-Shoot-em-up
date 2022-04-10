export class ImageLoader {
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

    public static get IsGameReady(): boolean {
        return ImageLoader.isGameReady;
    }
}
