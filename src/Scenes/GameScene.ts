import { UnloadEventManager } from '../EventManager';
import { IServiceImageLoader } from '../ImageLoader';
import { Keyboard } from '../Keyboard';
import { IScene, IServiceSceneManager } from '../SceneManager';
import { CANVA_SCALEX, CANVA_SCALEY, canvas } from '../ScreenConstant';
import { ServiceLocator } from '../ServiceLocator';
import {
    DrawGeneratedSpritesManager,
    UnloadGeneratedSpritesManager,
    UpdateGeneratedSpritesManager,
} from '../Sprites/GeneratedSpriteManager';
import { DrawPlayer, IServicePlayer, UnloadPlayer, UpdatePlayer } from '../Sprites/Player';
import { Sprite } from '../Sprites/Sprite';
import { IServiceUtilManager } from '../UtilManager';
import { DrawWaveManager, IServiceWaveManager, UnloadWaveManager, UpdateWaveManager } from '../WaveManager/WaveManager';
import { BaseField } from './BaseUserInterface/BaseField';
import { FieldSkillFactory } from './BaseUserInterface/FieldSkill';
import { FieldWithText } from './BaseUserInterface/FieldWithText';
import { UIManager } from './BaseUserInterface/UIManager';

class CityBackground extends Sprite {
    private speed: number;
    constructor(parameters: { image: HTMLImageElement; x: number; y: number; speed: number }) {
        const { image, x, y, speed } = parameters;
        super(image, 155, 15, x, y, 0, 0, CANVA_SCALEX, CANVA_SCALEY);
        this.speed = speed;
    }

    Update(dt: number): void {
        this.X -= this.speed;
    }

    public setX(x: number): void {
        this.X = x;
    }
}

class CityBackgroundManager {
    private citiesImages: CityBackground[];
    private cityPadding = 3 * CANVA_SCALEX; // right padding for the city
    constructor() {
        this.citiesImages = [];
        const initialX = this.cityPadding;
        let x = initialX;
        for (let i = 0; i < 4; i++) {
            let image: HTMLImageElement;
            if (i % 2 === 0) {
                image = ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').GetImage(
                    'images/GameScene/BackgroundBuilding_1.png',
                );
            } else {
                image = ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').GetImage(
                    'images/GameScene/BackgroundBuilding_2.png',
                );
            }
            this.citiesImages.push(
                new CityBackground({
                    image,
                    x: x,
                    y: 0,
                    speed: ServiceLocator.GetService<IServiceUtilManager>(
                        'UtilManager',
                    ).GetSpeedItTakesToCoverHalfTheScreenWidth({
                        framesItTakes: 300,
                    }),
                }),
            );
            x = initialX + (i + 1) * 158 * CANVA_SCALEX;
        }
    }

    public Update(dt: number): void {
        let shiftFirstBackground = false;
        for (let i = 0; i < this.citiesImages.length; i++) {
            this.citiesImages[i].Update(dt);
            if (i === 0) {
                if (this.citiesImages[i].X < -this.citiesImages[i].Width) {
                    shiftFirstBackground = true;
                }
            }
        }

        if (shiftFirstBackground) {
            const lastCity = this.citiesImages[this.citiesImages.length - 1];
            this.citiesImages[0].setX(lastCity.X + lastCity.Width + this.cityPadding);
            const city = this.citiesImages.shift();
            this.citiesImages.push(city!);
        }
    }

    public Draw(ctx: CanvasRenderingContext2D): void {
        this.drawBackground(ctx);
        this.citiesImages.forEach((city) => {
            city.Draw(ctx);
        });
    }

    private drawBackground(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = '#B09F9E';
        ctx.fillRect(0, 0, canvas.width, 16 * CANVA_SCALEY);

        const lineWidth = (3 / 4) * CANVA_SCALEX;

        ctx.lineWidth = lineWidth;
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.moveTo(0, (15 + lineWidth / 6) * CANVA_SCALEY);
        ctx.lineTo(canvas.width, (15 + lineWidth / 6) * CANVA_SCALEY);
        ctx.stroke();
    }
}

class UserStateUI {
    private roundNumber: FieldWithText;
    private money: FieldWithText;
    private playerSpecialSkillLevel: number;
    private playerEffectSkillLevel: number;
    private playerSupportSkillLevel: number;

    private specialSkillFrame: BaseField | undefined;
    private effectSkillFrame: BaseField | undefined;
    private supportSkillFrame: BaseField | undefined;

    constructor() {
        const currentRoundNumber = ServiceLocator.GetService<IServiceWaveManager>('WaveManager').Round;
        this.roundNumber = new FieldWithText({
            x: 189 * CANVA_SCALEX,
            y: 161 * CANVA_SCALEY,
            width: 36 * CANVA_SCALEX,
            height: 12 * CANVA_SCALEY,
            text: currentRoundNumber.toString(),
            fontSize: UIManager.Typography.InGameUI.fontSize,
            fontFamily: UIManager.Typography.InGameUI.fontFamily,
        });
        this.roundNumber.HasBorderOnAllSide = false;

        this.money = new FieldWithText({
            x: 234 * CANVA_SCALEX,
            y: 161 * CANVA_SCALEY,
            width: 85 * CANVA_SCALEX,
            height: 12 * CANVA_SCALEY,
            text: '0$',
            fontSize: UIManager.Typography.InGameUI.fontSize,
            fontFamily: UIManager.Typography.InGameUI.fontFamily,
            leftAlign: true,
        });

        this.money.HasBorderOnAllSide = false;

        this.playerSpecialSkillLevel = 0;
        this.playerEffectSkillLevel = 0;
        this.playerSupportSkillLevel = 0;

        this.specialSkillFrame = undefined;

        this.effectSkillFrame = undefined;

        this.supportSkillFrame = undefined;
    }

    public Update(dt: number): void {
        this.updateSkillFrame();
    }

    private updateSkillFrame(): void {
        const playerSpecialSkillLevel = ServiceLocator.GetService<IServicePlayer>('Player').SpecialSkillLevel;
        const playerEffectSkillLevel = ServiceLocator.GetService<IServicePlayer>('Player').EffectSkillLevel;
        const playerSupportSkillLevel = ServiceLocator.GetService<IServicePlayer>('Player').SupportSkillLevel;

        if (playerSpecialSkillLevel > 0 && this.playerSpecialSkillLevel !== playerSpecialSkillLevel) {
            const playerSpecialSkillName = ServiceLocator.GetService<IServicePlayer>('Player').SpecialSkillName!;
            this.playerSpecialSkillLevel = playerSpecialSkillLevel;
            const fieldSkillFactory = new FieldSkillFactory();
            this.specialSkillFrame = fieldSkillFactory.CreateFieldSkill({
                skillName: playerSpecialSkillName,
                skillLevel: playerSpecialSkillLevel as 1 | 2 | 3,
                x: 61 * CANVA_SCALEX,
                y: 158 * CANVA_SCALEY,
                HasHover: false,
            });
        }

        if (playerEffectSkillLevel > 0 && this.playerEffectSkillLevel !== playerEffectSkillLevel) {
            const playerEffectSkillName = ServiceLocator.GetService<IServicePlayer>('Player').EffectSkillName!;
            this.playerEffectSkillLevel = playerEffectSkillLevel;
            const fieldSkillFactory = new FieldSkillFactory();
            this.effectSkillFrame = fieldSkillFactory.CreateFieldSkill({
                skillName: playerEffectSkillName,
                skillLevel: playerEffectSkillLevel as 1 | 2 | 3,
                x: 91 * CANVA_SCALEX,
                y: 158 * CANVA_SCALEY,
                HasHover: false,
            });
        }

        if (playerSupportSkillLevel > 0 && this.playerSupportSkillLevel !== playerSupportSkillLevel) {
            const playerSupportSkillName = ServiceLocator.GetService<IServicePlayer>('Player').SupportSkillName!;
            this.playerSupportSkillLevel = playerSupportSkillLevel;
            const fieldSkillFactory = new FieldSkillFactory();
            this.supportSkillFrame = fieldSkillFactory.CreateFieldSkill({
                skillName: playerSupportSkillName,
                skillLevel: playerSupportSkillLevel as 1 | 2 | 3,
                x: 122 * CANVA_SCALEX,
                y: 158 * CANVA_SCALEY,
                HasHover: false,
            });
        }
    }

    public Draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = '#B09F9E';
        ctx.fillRect(0, 155 * CANVA_SCALEY, canvas.width, 25 * CANVA_SCALEY);

        const lineWidth = 1 * CANVA_SCALEX;

        ctx.beginPath();

        this.drawFrame({ ctx, lineWidth });
        this.drawHealthBar({ ctx, lineWidth });
        this.drawSkillFrame({ ctx, lineWidth });
        this.drawBoost({ ctx, lineWidth });

        ctx.stroke();
        this.drawRoundAndMoney({ ctx, lineWidth });
    }

    private drawFrame(parameters: { ctx: CanvasRenderingContext2D; lineWidth: number }): void {
        const { ctx, lineWidth } = parameters;
        const lineWidthCentering = lineWidth / 8;
        const baseY = (155 - lineWidthCentering) * CANVA_SCALEY;

        ctx.lineWidth = lineWidth;
        ctx.fillStyle = 'black';

        ctx.moveTo(0, baseY);
        ctx.lineTo(canvas.width, baseY);

        ctx.moveTo(lineWidthCentering * CANVA_SCALEX, baseY);
        ctx.lineTo(lineWidthCentering * CANVA_SCALEX, canvas.height);

        ctx.moveTo((55 - lineWidthCentering) * CANVA_SCALEX, baseY);
        ctx.lineTo((55 - lineWidthCentering) * CANVA_SCALEX, canvas.height);

        ctx.moveTo((147 - lineWidthCentering) * CANVA_SCALEX, baseY);
        ctx.lineTo((147 - lineWidthCentering) * CANVA_SCALEX, canvas.height);

        ctx.moveTo((185 - lineWidthCentering) * CANVA_SCALEX, baseY);
        ctx.lineTo((185 - lineWidthCentering) * CANVA_SCALEX, canvas.height);

        ctx.moveTo((230 - lineWidthCentering) * CANVA_SCALEX, baseY);
        ctx.lineTo((230 - lineWidthCentering) * CANVA_SCALEX, canvas.height);

        ctx.moveTo(canvas.width - lineWidthCentering * CANVA_SCALEX, baseY);
        ctx.lineTo(canvas.width - lineWidthCentering * CANVA_SCALEX, canvas.height);
    }

    private drawHealthBar(parameters: { ctx: CanvasRenderingContext2D; lineWidth: number }): void {
        const { ctx, lineWidth } = parameters;

        ctx.lineWidth = lineWidth;
        const lineWidthCentering = lineWidth / 8;

        ctx.fillStyle = 'black';

        const playerHealthRatio =
            ServiceLocator.GetService<IServicePlayer>('Player').CurrentHealth /
            ServiceLocator.GetService<IServicePlayer>('Player').MaxHealth;

        ctx.fillStyle = '#BE2633';
        ctx.fillRect(
            (4 - lineWidthCentering) * CANVA_SCALEX,
            (158 - lineWidthCentering) * CANVA_SCALEY,
            48 * CANVA_SCALEX * playerHealthRatio,
            8 * CANVA_SCALEY,
        );

        ctx.strokeRect(
            (3.8 - lineWidthCentering) * CANVA_SCALEX,
            (158 - lineWidthCentering) * CANVA_SCALEY,
            48 * CANVA_SCALEX,
            8 * CANVA_SCALEY,
        );
    }

    private drawSkillFrame(parameters: { ctx: CanvasRenderingContext2D; lineWidth: number }): void {
        const { ctx, lineWidth } = parameters;
        this.specialSkillFrame?.Draw(ctx);
        this.effectSkillFrame?.Draw(ctx);
        this.supportSkillFrame?.Draw(ctx);
    }

    private drawBoost(parameters: { ctx: CanvasRenderingContext2D; lineWidth: number }): void {
        const playerNumberBoost = ServiceLocator.GetService<IServicePlayer>('Player').NumberOfBoosts;

        const { ctx, lineWidth } = parameters;

        // draw 5 boost per line max and there are 5 lines
        const numberOfLines = Math.ceil(playerNumberBoost / 5);
        let numberBoostDrawn = 0;
        for (let line = 0; line < numberOfLines; ++line) {
            if (numberBoostDrawn >= playerNumberBoost) break;
            const y = (157 + line * 4) * CANVA_SCALEY;
            for (let i = 0; i < 5; ++i) {
                if (numberBoostDrawn >= playerNumberBoost) break;
                ctx.fillStyle = 'black';
                ctx.fillRect((150 + i * 7) * CANVA_SCALEX, y, 3 * CANVA_SCALEX, 3 * CANVA_SCALEY);
                numberBoostDrawn++;
            }
        }
    }

    private drawRoundAndMoney(parameters: { ctx: CanvasRenderingContext2D; lineWidth: number }): void {
        const { ctx, lineWidth } = parameters;

        const currentRoundNumber = ServiceLocator.GetService<IServiceWaveManager>('WaveManager').Round;
        this.roundNumber.SetText(currentRoundNumber.toString());
        this.money.SetText(`${ServiceLocator.GetService<IServicePlayer>('Player').MoneyInWallet}$`);

        this.money.Draw(ctx);
        this.roundNumber.Draw(ctx);
    }
}

export class GameScene implements IScene {
    private cityBackgroundManager: CityBackgroundManager;
    private userStateUI: UserStateUI;

    Load() {
        this.loadUI();
    }

    Update(dt: number) {
        UpdateWaveManager(dt);
        UpdatePlayer(dt);
        UpdateGeneratedSpritesManager(dt);
        this.updateUI(dt);
        if (Keyboard.Escape.IsPressed) {
            ServiceLocator.GetService<IServiceSceneManager>('SceneManager').PlaySecondaryScene('InGameMenu');
        }
    }

    Draw(ctx: CanvasRenderingContext2D) {
        this.drawUI(ctx);
        DrawGeneratedSpritesManager(ctx);
        DrawPlayer(ctx);
        DrawWaveManager(ctx);
    }

    Unload(): void {
        UnloadEventManager();
        UnloadGeneratedSpritesManager();
        UnloadWaveManager();
        UnloadPlayer();
    }

    private loadUI() {
        this.cityBackgroundManager = new CityBackgroundManager();
        this.userStateUI = new UserStateUI();
    }

    private updateUI(dt: number) {
        this.cityBackgroundManager.Update(dt);
        this.userStateUI.Update(dt);
    }

    private drawUI(ctx: CanvasRenderingContext2D) {
        this.cityBackgroundManager.Draw(ctx);
        this.userStateUI.Draw(ctx);
    }
}
