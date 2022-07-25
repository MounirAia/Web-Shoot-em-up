export interface IBullet {
    Type: 'player' | 'enemy';
    Update: (dt: number) => void;
    Draw: (ctx: CanvasRenderingContext2D) => void;
    Damage: number;
}

export interface ITargetableBullet {
    BulletAngle: number;
    XSpeed: number;
    YSpeed: number;
}
