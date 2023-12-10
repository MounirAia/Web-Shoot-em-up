import { ServiceLocator } from './ServiceLocator.js';

export interface IServiceImageLoader {
    GetImage(imagePath: string): HTMLImageElement;
    IsGameReady(): boolean;
}

class ImageLoader implements IServiceImageLoader {
    private static isGameReady = false;
    private listImages: { [key: string]: HTMLImageElement };
    private numberImagesLoaded = 0;

    constructor(imagesPath: string[]) {
        this.listImages = {};
        for (const imagePath of imagesPath) {
            this.listImages[imagePath] = new Image();
            this.listImages[imagePath].src = imagePath;
            this.listImages[imagePath].onload = () => {
                this.numberImagesLoaded++;
                if (this.numberImagesLoaded === imagesPath.length) ImageLoader.isGameReady = true;
            };

            ServiceLocator.AddService('ImageLoader', this);
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
    assets.push('images/enemyred.png');
    assets.push('images/MenuScene/player-ship.png');
    assets.push('images/MenuScene/many-enemies.png');
    assets.push('images/Player/player.png');
    assets.push('images/Player/RegularPlayerBullet.png');
    assets.push('images/Enemies/Diamond/BigDiamond/BigDiamond.png');
    assets.push('images/Enemies/Triangle/Triangle.png');
    assets.push('images/Enemies/EnemiesBullet.png');
    assets.push('images/Skills/Rocket/RocketProjectileLevel1.png');
    assets.push('images/Skills/Rocket/RocketProjectileLevel2.png');
    assets.push('images/Skills/Rocket/RocketProjectileLevel3.png');
    assets.push('images/Skills/Rocket/RocketSubProjectileLevel3.png');
    assets.push('images/Player/Cannon.png'); // To remove after setup
    assets.push('images/Skills/Upgrade/Rocket/Level1.png');
    assets.push('images/Skills/Upgrade/Rocket/Level2.png');
    assets.push('images/Skills/Upgrade/Rocket/Level3.png');
    assets.push('images/Skills/Blade/BladeLevel1.png');
    assets.push('images/Skills/Blade/BladeLevel2&3.png');
    assets.push('images/Skills/Mirror/MirrorLevel1.png');
    assets.push('images/Skills/Mirror/MirrorLevel2&3.png');
    assets.push('images/Skills/Mirror/Portal.png');
    assets.push('images/Skills/Mirror/ExplosiveEntity.png');
    assets.push('images/Skills/FuelChargeShot/FrameLevel1.png');
    assets.push('images/Skills/FuelChargeShot/LaserLevel1.png');
    assets.push('images/Skills/FuelChargeShot/FrameLevel2.png');
    assets.push('images/Skills/FuelChargeShot/LaserLevel2.png');
    assets.push('images/Skills/FuelChargeShot/FrameLevel3.png');
    assets.push('images/Skills/FuelChargeShot/LaserLevel3.png');

    new ImageLoader(assets); // Load all the assets and add itself as a service
}
