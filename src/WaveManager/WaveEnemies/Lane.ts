import { CANVA_SCALEY, canvas, CANVA_SCALEX } from '../../ScreenConstant';
import { BigDiamondEnemy } from '../../Sprites/Enemies/Diamond/BigDiamondEnemy';
import { MediumDiamondEnemy } from '../../Sprites/Enemies/Diamond/MediumDiamondEnemy';
import { SmallDiamondEnemy } from '../../Sprites/Enemies/Diamond/SmallDiamondEnemy';
import { IEnemy, EnemyTier } from '../../Sprites/Enemies/IEnemy';

type SpawnPosition = { startingX: number; shootingX: number; shootingY: number };
export type LaneNumber = 1 | 2 | 3 | 4;

export class Lane {
    private laneNumber: LaneNumber;
    private maxUnitCostPerLane: number;
    private currentUnitCostPerLane: number;
    private maxEnemiesPerLane: number;
    private spawns: SpawnPosition[];
    private enemySpawnList: Map<IEnemy, SpawnPosition>;
    private enemyTierInfo: Map<EnemyTier, { unitCost: number }>;
    private horizontalDelay: number;

    constructor(parameters: { laneNumber: LaneNumber }) {
        const { laneNumber } = parameters;
        this.laneNumber = laneNumber;
        this.maxUnitCostPerLane = 10;
        this.currentUnitCostPerLane = this.maxUnitCostPerLane;
        this.maxEnemiesPerLane = 7;
        this.enemySpawnList = new Map<IEnemy, SpawnPosition>();

        const yLaneShift = 35 * CANVA_SCALEY * (laneNumber - 1);
        this.spawns = [
            {
                startingX: canvas.width,
                shootingX: 234 * CANVA_SCALEX,
                shootingY: 32 * CANVA_SCALEY + yLaneShift,
            },
            {
                startingX: canvas.width,
                shootingX: 244 * CANVA_SCALEX,
                shootingY: 25 * CANVA_SCALEY + yLaneShift,
            },
            {
                startingX: canvas.width,
                shootingX: 244 * CANVA_SCALEX,
                shootingY: 36 * CANVA_SCALEY + yLaneShift,
            },
            {
                startingX: canvas.width,
                shootingX: 253 * CANVA_SCALEX,
                shootingY: 32 * CANVA_SCALEY + yLaneShift,
            },
            {
                startingX: canvas.width,
                shootingX: 263 * CANVA_SCALEX,
                shootingY: 25 * CANVA_SCALEY + yLaneShift,
            },
            {
                startingX: canvas.width,
                shootingX: 263 * CANVA_SCALEX,
                shootingY: 36 * CANVA_SCALEY + yLaneShift,
            },
            {
                startingX: canvas.width,
                shootingX: 273 * CANVA_SCALEX,
                shootingY: 32 * CANVA_SCALEY + yLaneShift,
            },
        ];

        this.enemyTierInfo = new Map();
        this.enemyTierInfo.set('Tier1', { unitCost: 1 });
        this.enemyTierInfo.set('Tier2', { unitCost: 2 });
        this.enemyTierInfo.set('Tier3', { unitCost: 3 });

        this.horizontalDelay = 0;
    }

    public FillLane(parameters: { enemyListYouCanGenerate: EnemyTier[]; tresholdForRefill: number }): IEnemy[] {
        const { enemyListYouCanGenerate, tresholdForRefill } = parameters;
        const enemyList: IEnemy[] = [];

        // 1) Check if the lane has enough unit cost to spawn the enemy -> I want to spawn enemy by chunks not one by one
        if (this.currentUnitCostPerLane < tresholdForRefill) {
            return enemyList;
        }

        for (const enemyTierInfo of enemyListYouCanGenerate) {
            // 2) Check if the lane has enough space to spawn the enemy
            if (this.getCurrentNumberOfEnemiesOnLane() >= this.maxEnemiesPerLane) {
                break;
            }

            // 3) Check if there is no more spawn position available
            if (this.spawns.length === 0) {
                break;
            }

            // 4) Generate the enemy
            const enemy = this.generateEnemy({ enemyTier: enemyTierInfo });

            // 5) Add the enemy to the spawn list only if the enemy is generated
            if (enemy === undefined) {
                continue;
            }

            // 6) Update the current unit cost per lane
            const unitCost = this.enemyTierInfo.get(enemy.Tier)!.unitCost;

            if (this.currentUnitCostPerLane - unitCost <= 0) {
                continue;
            }

            this.currentUnitCostPerLane -= unitCost;

            // 7) Add to the enemy list to return
            enemyList.push(enemy);
        }

        return enemyList;
    }

    private generateEnemy(parameters: { enemyTier: EnemyTier }): IEnemy | undefined {
        // 1) Get the spawn position
        const spawnPosition = this.getSpawnPosition();

        // 2) If there is no spawn position available, return undefined
        if (spawnPosition === undefined) return undefined;

        // 3) Generate the enemy
        const { enemyTier } = parameters;
        const { startingX, shootingY, shootingX } = spawnPosition;
        let enemy: IEnemy;
        switch (enemyTier) {
            case 'Tier1':
                enemy = new SmallDiamondEnemy(startingX, shootingY, shootingX, this.laneNumber);
                break;
            case 'Tier2':
                enemy = new MediumDiamondEnemy(startingX, shootingY, shootingX, this.laneNumber);
                break;
            case 'Tier3':
                enemy = new BigDiamondEnemy(startingX, shootingY, shootingX, this.laneNumber);
                break;
        }

        // 4) Add the enemy to the spawn list
        this.enemySpawnList.set(enemy, spawnPosition);

        return enemy;
    }

    private getCurrentNumberOfEnemiesOnLane(): number {
        return this.enemySpawnList.size;
    }

    private getSpawnPosition(): SpawnPosition | undefined {
        // return the first spawn position available
        const spawnPosition = this.spawns.shift();

        if (spawnPosition) {
            spawnPosition.startingX += this.horizontalDelay;
        }

        return spawnPosition;
    }

    public SetHorizontalDelay(delay: number) {
        this.horizontalDelay = delay;
    }

    public ResetHorizontalDelay() {
        this.horizontalDelay = 0;
    }

    public FreeSpawnPosition(parameters: { enemy: IEnemy }) {
        const { enemy } = parameters;
        // 1) Add the spawn position back to the list
        this.spawns.push(this.enemySpawnList.get(enemy)!);
        // 2) Add the unit cost back to the lane
        this.currentUnitCostPerLane += this.enemyTierInfo.get(enemy.Tier)!.unitCost;
        // 3) Remove the enemy from the spawn list
        this.enemySpawnList.delete(enemy);
    }

    public TestList() {
        console.log('Spawn Taken - Lane Number:', this.laneNumber, this.enemySpawnList.size);
    }
}
