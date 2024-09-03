import { IGameStatManager, UpdateGameStatManager } from '../GameStatManager';
import { IServiceImageLoader } from '../ImageLoader';
import { IServiceKeyboardManager } from '../Keyboard';
import { IScene, IServiceSceneManager } from '../SceneManager';
import { CANVA_SCALEX, CANVA_SCALEY, canvas, FRAME_RATE } from '../ScreenConstant';
import { ServiceLocator } from '../ServiceLocator';
import { DrawGeneratedSpritesManager, UpdateGeneratedSpritesManager } from '../Sprites/GeneratedSpriteManager';
import { DrawPlayer, IServicePlayer, UpdatePlayer } from '../Sprites/Player';
import { PossibleSkillLevel, SkillsTypeName } from '../Sprites/PlayerSkills/Skills';
import { Sprite } from '../Sprites/Sprite';
import { GetSpriteStaticInformation } from '../SpriteStaticInformation/SpriteStaticInformationManager';
import { IServiceUtilManager } from '../UtilManager';
import { DrawWaveManager, IServiceWaveManager, UpdateWaveManager } from '../WaveManager/WaveManager';
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

class InGameTimer {
    private timerField: FieldWithText;
    constructor() {
        const gameStatManager = ServiceLocator.GetService<IGameStatManager>('GameStatManager');
        const timePlayerSurvived = gameStatManager.GetTimePlayerHasSurvived();
        this.timerField = new FieldWithText({
            x: 3 * CANVA_SCALEX,
            y: 20 * CANVA_SCALEY,
            width: 75 * CANVA_SCALEX,
            height: 10 * CANVA_SCALEY,
            text: timePlayerSurvived,
            leftAlign: true,
            fontSize: UIManager.Typography.title.fontSize,
            fontFamily: UIManager.Typography.title.fontFamily,
        });
        this.timerField.HasBorderOnAllSide = false;
    }

    public Update(dt: number): void {
        const gameStatManager = ServiceLocator.GetService<IGameStatManager>('GameStatManager');
        const timePlayerSurvived = gameStatManager.GetTimePlayerHasSurvived();
        this.timerField.SetText(timePlayerSurvived);
    }

    public Draw(ctx: CanvasRenderingContext2D): void {
        this.timerField.Draw(ctx);
    }
}

class Particle {
    private x: number;
    private y: number;
    private width: number;
    private height: number;
    private speed: number;

    constructor(parameters: { x: number; y: number; width: number; height: number; speed: number }) {
        const { x, y, width, height, speed } = parameters;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
    }

    public Update(dt: number): void {
        this.x -= this.speed;
    }

    public Draw(ctx: CanvasRenderingContext2D): void {
        ctx.rect(this.x, this.y, this.width, this.height);
    }

    public GetX(): number {
        return this.x;
    }

    public GetY(): number {
        return this.y;
    }

    public GetIfParticleIsOutsideViewScreen(): boolean {
        // TODO: Need to cover the case if the particle is outside from the right side of the screen because it was ejected from the screen by the shockwave

        if (this.x + this.width < 0 || this.y < 0 || this.y + this.height > canvas.height) {
            return true;
        }

        return false;
    }
}

class ParticleManager {
    private particles: Particle[];
    private particlesIndexToRemove: number[];
    private particleWidth: number;
    private particleHeight: number;
    private particleSpeed: number;
    private particleColor: string;

    private timeRemainingBeforeNewParticles: number;
    private baseTimeBeforeNewParticles: number;

    constructor() {
        this.particles = [];
        this.particlesIndexToRemove = [];
        this.particleWidth = 1 * CANVA_SCALEX;
        this.particleHeight = 1 * CANVA_SCALEY;
        this.particleSpeed = ServiceLocator.GetService<IServiceUtilManager>(
            'UtilManager',
        ).GetSpeedItTakesToCoverHalfTheScreenWidth({
            framesItTakes: 500,
        });
        this.particleColor = '#959595';

        const dt = 1 / FRAME_RATE;
        this.baseTimeBeforeNewParticles = (this.particleWidth * dt) / this.particleSpeed;
        this.timeRemainingBeforeNewParticles = this.baseTimeBeforeNewParticles;

        const lines = Math.floor((320 * CANVA_SCALEX) / this.particleWidth);

        for (let i = 0; i < lines; i++) {
            this.generateParticlesOnALine({ x: i * this.particleWidth });
        }
    }

    public Update(dt: number): void {
        /* Update the particles and Clean the non visible particles*/
        this.particles.forEach((particle) => {
            particle.Update(dt);
            if (particle.GetIfParticleIsOutsideViewScreen()) {
                this.particlesIndexToRemove.push(this.particles.indexOf(particle));
            }
        });

        this.particlesIndexToRemove.forEach((index) => {
            this.particles.splice(index, 1);
        });

        this.particlesIndexToRemove = [];

        /* Generate new particles */
        this.timeRemainingBeforeNewParticles -= dt;
        if (this.timeRemainingBeforeNewParticles <= 0) {
            this.generateParticlesOnALine({ x: canvas.width });
            this.timeRemainingBeforeNewParticles = this.baseTimeBeforeNewParticles;
        }
    }

    public Draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        this.particles.forEach((particle) => {
            particle.Draw(ctx);
        });
        ctx.fillStyle = this.particleColor;
        ctx.fill();
    }

    private generateParticlesOnALine(parameters: { x: number }) {
        const { x } = parameters;
        const maxParticlesPerLine = 1;
        for (let i = 0; i < maxParticlesPerLine; i++) {
            const particleYOffset = Math.random() * 136 * CANVA_SCALEY;
            this.particles.push(
                new Particle({
                    x,
                    y: 17 * CANVA_SCALEY + particleYOffset,
                    width: this.particleWidth,
                    height: this.particleHeight,
                    speed: this.particleSpeed,
                }),
            );
        }
    }
}

class ShortcutSkillManager {
    private skillPricePerLevel: Map<PossibleSkillLevel, number>;
    private boostPrice: number;

    constructor() {
        /* TEMPORARY */
        const rocketSprite = GetSpriteStaticInformation({ sprite: 'Rocket' });
        const priceSkillLevel1 = rocketSprite.constant[0]['Skill Price'];
        const priceSkillLevel2 = rocketSprite.constant[1]['Skill Price'];
        const priceSkillLevel3 = rocketSprite.constant[2]['Skill Price'];
        this.skillPricePerLevel = new Map([
            [1, priceSkillLevel1],
            [2, priceSkillLevel2],
            [3, priceSkillLevel3],
        ]);

        this.boostPrice = GetSpriteStaticInformation({ sprite: 'PlayerBoost' }).constant['Boost Price'];
    }

    Update(dt: number) {
        const keyboardManager = ServiceLocator.GetService<IServiceKeyboardManager>('KeyboardManager');
        // U for special skill
        if (keyboardManager.GetCommandState({ command: 'UpgradeSpecialSkillInGameShortcut' }).IsPressed) {
            this.quickUpgrade({ fieldType: 'special' });
        }
        // I for effect skill
        if (keyboardManager.GetCommandState({ command: 'UpgradeEffectSkillInGameShortcut' }).IsPressed) {
            this.quickUpgrade({ fieldType: 'effect' });
        }
        // O for support skill
        if (keyboardManager.GetCommandState({ command: 'UpgradeSupportSkillInGameShortcut' }).IsPressed) {
            this.quickUpgrade({ fieldType: 'support' });
        }
        // P for boost
        if (keyboardManager.GetCommandState({ command: 'UpgradeBoostInGameShortcut' }).IsPressed) {
            this.quickUpgrade({ fieldType: 'Boost' });
        }
    }

    private quickUpgrade(parameters: { fieldType: SkillsTypeName | 'Boost' }) {
        const { fieldType } = parameters;

        if (fieldType === 'Boost') {
            this.upgradeBoost();
        } else {
            this.upgradeSkill({ skillType: fieldType });
        }
    }

    private upgradeBoost() {
        const player = ServiceLocator.GetService<IServicePlayer>('Player');
        let playerBalance = player.MoneyInWallet;

        // 1) verify if the player has already reached the max number of boost
        if (player.GetIsMaxNumberBoostAttained()) return;

        // 2) verify if the player has enough money to buy the skill
        if (playerBalance - this.boostPrice < 0) return;

        player.MakeTransactionOnWallet(-this.boostPrice);

        player.UpgradeBoost();
    }

    private upgradeSkill(parameters: { skillType: SkillsTypeName }) {
        const { skillType } = parameters;
        const player = ServiceLocator.GetService<IServicePlayer>('Player');
        let playerBalance = player.MoneyInWallet;
        const skillLevel = player.GetSkillLevel({ skillType: skillType });
        const isMaxLevelReach = player.GetIsMaxLevelReachedForSpecificSkillType({ skillType: skillType });

        // 1) Verify if the player did not reach the maximum level for this skill
        if (isMaxLevelReach) return;

        const selectedSkillPrice = this.skillPricePerLevel.get((skillLevel + 1) as PossibleSkillLevel)!;
        // 2) verify if the player has enough money to buy the skill
        if (playerBalance - selectedSkillPrice < 0) return;

        player.MakeTransactionOnWallet(-selectedSkillPrice);

        player.UpgradeSkillLevel({ skillType: skillType });
    }
}

export class GameScene implements IScene {
    private cityBackgroundManager: CityBackgroundManager;
    private particleEffectOnMap: ParticleManager;
    private userStateUI: UserStateUI;
    private timerIsToggled: boolean;
    private inGameTimer: InGameTimer;
    private shortcutSkillManager: ShortcutSkillManager;

    Load() {
        this.timerIsToggled = false;
        this.loadUI();
    }

    Update(dt: number) {
        UpdateGameStatManager(dt);
        UpdateWaveManager(dt);
        UpdatePlayer(dt);
        UpdateGeneratedSpritesManager(dt);
        this.updateUI(dt);
        const keyboardManager = ServiceLocator.GetService<IServiceKeyboardManager>('KeyboardManager');
        if (keyboardManager.GetCommandState({ command: 'OpenInGameMenu' }).IsPressed) {
            ServiceLocator.GetService<IServiceSceneManager>('SceneManager').PlaySecondaryScene('InGameMenu');
        }

        if (keyboardManager.GetCommandState({ command: 'OpenShopMenu' }).IsPressed) {
            ServiceLocator.GetService<IServiceSceneManager>('SceneManager').PlaySecondaryScene('ShoppingMenu');
        }

        if (keyboardManager.GetCommandState({ command: 'ToggleInGameTimer' }).IsPressed) {
            this.timerIsToggled = !this.timerIsToggled;
        }
    }

    Draw(ctx: CanvasRenderingContext2D) {
        this.drawUI(ctx);
        DrawPlayer(ctx);
        DrawWaveManager(ctx);
        DrawGeneratedSpritesManager(ctx);
        if (this.timerIsToggled) {
            this.inGameTimer.Draw(ctx);
        }
    }

    Unload(): void {}

    private loadUI() {
        this.cityBackgroundManager = new CityBackgroundManager();
        this.particleEffectOnMap = new ParticleManager();
        this.userStateUI = new UserStateUI();
        this.inGameTimer = new InGameTimer();
        this.shortcutSkillManager = new ShortcutSkillManager();
    }

    private updateUI(dt: number) {
        this.cityBackgroundManager.Update(dt);
        this.userStateUI.Update(dt);
        this.inGameTimer.Update(dt);
        this.particleEffectOnMap.Update(dt);
        this.shortcutSkillManager.Update(dt);
    }

    private drawUI(ctx: CanvasRenderingContext2D) {
        this.cityBackgroundManager.Draw(ctx);
        this.particleEffectOnMap.Draw(ctx);
        this.userStateUI.Draw(ctx);
    }
}
