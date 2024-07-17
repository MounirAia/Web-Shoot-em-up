import { CANVA_SCALEX } from '../../ScreenConstant';

export interface IUIComponent {
    Update(dt: number): void;
    Draw(ctx: CanvasRenderingContext2D): void;
    GetVisibility(): boolean;
    SetVisibility(visible: boolean): void;
    SetActive(active: boolean): void;
}

export class UIManager {
    private components: IUIComponent[] = [];
    public static readonly Typography = {
        title: {
            fontSize: 9 * CANVA_SCALEX,
            fontFamily: 'pixel',
        },
        button: {
            fontSize: 6 * CANVA_SCALEX,
            fontFamily: 'pixel',
        },
        description: {
            fontSize: 3.2 * CANVA_SCALEX,
            fontFamily: 'pixel',
        },
    };

    public AddComponent(component: IUIComponent): void {
        this.components.push(component);
    }

    public AddComponents(components: IUIComponent[]): void {
        this.components.push(...components);
    }

    public RemoveComponent(component: IUIComponent): void {
        const index = this.components.indexOf(component);
        if (index > -1) {
            this.components.splice(index, 1);
        }
    }

    public RemoveComponents(components: IUIComponent[]): void {
        components.forEach((component) => {
            const index = this.components.indexOf(component);
            if (index > -1) {
                this.components.splice(index, 1);
            }
        });
    }

    public ShowComponents(component: IUIComponent[]): void {
        component.forEach((component) => {
            component.SetVisibility(true);
        });
    }

    public HideComponents(components: IUIComponent[]): void {
        components.forEach((component) => {
            component.SetVisibility(false);
        });
    }

    public Update(dt: number): void {
        this.components.forEach((component) => {
            if (component.GetVisibility()) {
                component.Update(dt);
            }
        });
    }

    public Draw(ctx: CanvasRenderingContext2D): void {
        this.components.forEach((component) => {
            if (component.GetVisibility()) {
                ctx.save();

                component.Draw(ctx);

                ctx.restore();
            }
        });
    }
}
