import { Sprite } from './Sprite.js';
import { ServiceLocator } from '../ServiceLocator.js';
import { IServiceImageLoader } from '../ImageLoader.js';
import { canvas, CANVA_SCALEX, CANVA_SCALEY } from '../ScreenConstant.js';
import { Keyboard } from '../Keyboard.js';
import { IMovableSprite } from './InterfaceBehaviour/IMovableSprite.js';
import { CreateHitboxes, ISpriteWithHitboxes, RectangleHitbox } from './InterfaceBehaviour/ISpriteWithHitboxes.js';
import { IServiceBulletManager } from './Bullets/BulletManager.js';
import { RegularPlayerBullet } from './Bullets/PlayerBullet.js';

export interface IServicePlayer {
    Coordinate(): { x: number; y: number };
}

export class Player extends Sprite implements IServicePlayer, IMovableSprite, ISpriteWithHitboxes {
    private baseSpeed: number = 5;
    private hitboxes: RectangleHitbox[];

    constructor(
        image: HTMLImageElement,
        frameWidth: number,
        frameHeight: number,
        x: number = 0,
        y: number = 0,
        spriteXOffset: number = 0,
        spriteYOffset: number = 0,
        scaleX: number = 1,
        scaleY: number = 1,
    ) {
        super(image, frameWidth, frameHeight, x, y, spriteXOffset, spriteYOffset, scaleX, scaleY);
        this.hitboxes = CreateHitboxes(this.X, this.Y, [
            {
                offsetX: 0,
                offsetY: 0,
                width: 22 * CANVA_SCALEX,
                height: 12 * CANVA_SCALEY,
            },
            {
                offsetX: 22 * CANVA_SCALEX,
                offsetY: 1 * CANVA_SCALEY,
                width: 1 * CANVA_SCALEX,
                height: 11 * CANVA_SCALEY,
            },
            {
                offsetX: 23 * CANVA_SCALEX,
                offsetY: 2 * CANVA_SCALEY,
                width: 1 * CANVA_SCALEX,
                height: 10 * CANVA_SCALEY,
            },
            {
                offsetX: 24 * CANVA_SCALEX,
                offsetY: 3 * CANVA_SCALEY,
                width: 1 * CANVA_SCALEX,
                height: 9 * CANVA_SCALEY,
            },
            {
                offsetX: 25 * CANVA_SCALEX,
                offsetY: 4 * CANVA_SCALEY,
                width: 1 * CANVA_SCALEX,
                height: 8 * CANVA_SCALEY,
            },
            {
                offsetX: 26 * CANVA_SCALEX,
                offsetY: 5 * CANVA_SCALEY,
                width: 1 * CANVA_SCALEX,
                height: 7 * CANVA_SCALEY,
            },
            {
                offsetX: 27 * CANVA_SCALEX,
                offsetY: 6 * CANVA_SCALEY,
                width: 1 * CANVA_SCALEX,
                height: 6 * CANVA_SCALEY,
            },
            {
                offsetX: 28 * CANVA_SCALEX,
                offsetY: 7 * CANVA_SCALEY,
                width: 6 * CANVA_SCALEX,
                height: 4 * CANVA_SCALEY,
            },
        ]);
        this.AddAnimation('idle', [0]);
        this.AddAnimation('damaged', [1]);
        this.AddAnimation('destroyed', [2, 3, 4, 5, 6, 7, 8, 9]);

        this.PlayAnimation('idle', 0.1, false);
        ServiceLocator.AddService('Player', this);
    }

    public UpdateHitboxes(dt: number): void {
        this.Hitboxes.forEach((hitbox) => {
            hitbox.SpriteX = this.X;
            hitbox.SpriteY = this.Y;
        });
    }

    public Update(dt: number): void {
        super.Update(dt);
        // Check if player do not go outside the viewport
        let isOutsideLeftScreen = false;
        let isOutsideTopScreen = false;
        let isOutsideRightScreen = false;
        let isOutsideBottomScreen = false;
        for (const hitbox of this.Hitboxes) {
            isOutsideLeftScreen =
                isOutsideLeftScreen || hitbox.checkIfBoxOverlap(-canvas.width, 0, canvas.width, canvas.height);
            isOutsideTopScreen =
                isOutsideTopScreen || hitbox.checkIfBoxOverlap(0, -canvas.height, canvas.width, canvas.height);
            isOutsideRightScreen =
                isOutsideRightScreen || hitbox.checkIfBoxOverlap(canvas.width, 0, canvas.width, canvas.height);
            isOutsideBottomScreen =
                isOutsideBottomScreen || hitbox.checkIfBoxOverlap(0, canvas.height, canvas.width, canvas.height);
        }

        if (Keyboard.a.IsDown) {
            if (!isOutsideLeftScreen) this.X -= this.BaseSpeed;
        }
        if (Keyboard.w.IsDown) {
            if (!isOutsideTopScreen) this.Y -= this.BaseSpeed;
        }
        if (Keyboard.d.IsDown) {
            if (!isOutsideRightScreen) this.X += this.BaseSpeed;
        }
        if (Keyboard.s.IsDown) {
            if (!isOutsideBottomScreen) this.Y += this.BaseSpeed;
        }

        if (Keyboard.Space.IsPressed) {
            const bullet = new RegularPlayerBullet(this.X + 34 * CANVA_SCALEX, this.Y + 8 * CANVA_SCALEY);
            ServiceLocator.GetService<IServiceBulletManager>('BulletManager').AddBullet(bullet);
        }

        this.UpdateHitboxes(dt);
    }

    public Coordinate(): { x: number; y: number } {
        return { x: this.X, y: this.Y };
    }

    public get Hitboxes(): RectangleHitbox[] {
        return this.hitboxes;
    }

    public get BaseSpeed(): number {
        if ((Keyboard.a.IsDown || Keyboard.d.IsDown) && (Keyboard.w.IsDown || Keyboard.s.IsDown)) {
            return this.baseSpeed / Math.sqrt(2); // to avoid faster movement when player goes in diagonal
        }
        return this.baseSpeed;
    }

    private set BaseSpeed(value: number) {
        this.baseSpeed = value;
    }
}

let player: Player;
export function LoadPlayer() {
    const imgPlayer =
        ServiceLocator.GetService<IServiceImageLoader>('ImageLoader').GetImage('images/Player/player.png');
    const frameWidth = 64;
    const frameHeight = 64;
    const x = 250;
    const y = 250;
    const scaleX = CANVA_SCALEX;
    const scaleY = CANVA_SCALEY;
    player = new Player(imgPlayer, frameWidth, frameHeight, x, y, 18 * CANVA_SCALEX, 25 * CANVA_SCALEY, scaleX, scaleY);
}

export function UpdatePlayer(dt: number) {
    player.Update(dt);
}

export function DrawPlayer(ctx: CanvasRenderingContext2D) {
    player.Draw(ctx);
}
