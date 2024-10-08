import { CANVA_SCALEX, CANVA_SCALEY, canvas } from '../../ScreenConstant.js';
import { ServiceLocator } from '../../ServiceLocator.js';
import { EnemyTier, IEnemy } from '../../Sprites/Enemies/IEnemy.js';
import {
    DamageEffectFunctionReturnType,
    DamageEffectOptions,
} from '../../Sprites/PlayerSkills/DamageEffect/IDamageEffect.js';
import { AvailableAnimation } from '../../Sprites/SpriteAnimationsController.js';
import { IServiceUtilManager } from '../../UtilManager.js';
import { WaveEnemiesDamageStateTracker } from '../WaveEnemiesStateTracker.js';
import { Lane, LaneNumber } from './Lane.js';
import RoundStats from './RoundStats.js';

export class WaveEnemies {
    // Current Enemy Visible
    private listEnemies: Map<EnemyTier, Map<IEnemy, IEnemy>>;

    /* New Wave System */
    private readonly numberOfEnemiesToSpawn: Map<EnemyTier, number>;
    private laneManager: Map<LaneNumber, Lane>;
    private horizontalDelayStep: number;

    private waveEnemiesStateTracker: WaveEnemiesDamageStateTracker;

    /* Wave Shooting Management */
    private baseShootingTimePeriodInSecond: number;
    private currentShootingTimeInSecond: number;
    private maxNumberOfLaneThatCanShoot: number;
    private baseShootingCooldown: number;
    private currentShootingCooldown: number;
    private waveIsInCooldown: boolean;

    constructor(round: number) {
        // Lane Manager
        const unshuffledLanes: LaneNumber[] = [1, 2, 3, 4];
        const cycles = Math.floor(Math.random() * unshuffledLanes.length) + 2;
        const lanes: LaneNumber[] = circularArrayShuffle(unshuffledLanes, cycles);
        this.laneManager = new Map<LaneNumber, Lane>(lanes.map((lane) => [lane, new Lane({ laneNumber: lane })]));
        this.horizontalDelayStep = 80 * CANVA_SCALEX;

        // set the horizontal delay for the lanes
        let index = 0;
        this.laneManager.forEach((laneManager) => {
            const horizontalDelay = this.horizontalDelayStep * index;
            laneManager.SetHorizontalDelay(horizontalDelay);
            index++;
        });

        // Initialize the number of enemies to spawn per tier
        this.numberOfEnemiesToSpawn = this.getEnemyTierToSpawn(round);

        // Initialize the list of enemies that are spawned
        this.listEnemies = new Map<EnemyTier, Map<IEnemy, IEnemy>>();
        this.listEnemies.set('Tier1', new Map<IEnemy, IEnemy>());
        this.listEnemies.set('Tier2', new Map<IEnemy, IEnemy>());
        this.listEnemies.set('Tier3', new Map<IEnemy, IEnemy>());

        this.fillLanes({ tresholdBeforeRefill: 0 });

        // Reset horizontal delay for all lanes
        this.laneManager.forEach((laneManager) => {
            laneManager?.ResetHorizontalDelay();
        });

        this.waveEnemiesStateTracker = new WaveEnemiesDamageStateTracker();

        /* Wave Shooting Management */
        this.baseShootingTimePeriodInSecond = 10;
        this.currentShootingTimeInSecond = this.baseShootingTimePeriodInSecond;
        this.maxNumberOfLaneThatCanShoot = Math.floor(this.laneManager.size / 2);
        this.baseShootingCooldown = (1 / 10) * this.baseShootingTimePeriodInSecond;
        this.currentShootingCooldown = 0;
        this.waveIsInCooldown = false;

        this.enableAndDisableShootingOnLanes();
    }

    private AddEnemy(...enemies: IEnemy[]) {
        enemies.forEach((enemy) => {
            this.numberOfEnemiesToSpawn.set(enemy.Tier, this.numberOfEnemiesToSpawn.get(enemy.Tier)! - 1);
            this.listEnemies.get(enemy.Tier)?.set(enemy, enemy);
        });
    }

    public RemoveEnemy(enemy: IEnemy) {
        // 1) Free the spawn position
        this.laneManager.get(enemy.Lane)?.FreeSpawnPosition({ enemy });
        // 2) Remove the enemy from the list of current visible enemies
        this.listEnemies.get(enemy.Tier)?.delete(enemy);
        // 3) Remove the enemy from the state tracker
        this.waveEnemiesStateTracker.RemoveEnemyStateTracker({ enemy });
        // 4) Refill the lane
        this.fillLanes({ tresholdBeforeRefill: 6 });
    }

    public Update(dt: number) {
        if (this.currentShootingTimeInSecond > 0) this.currentShootingTimeInSecond -= dt;

        if (this.currentShootingCooldown > 0) this.currentShootingCooldown -= dt;

        if (!this.waveIsInCooldown && this.currentShootingTimeInSecond <= 0) {
            this.currentShootingCooldown = this.baseShootingCooldown;
            this.waveIsInCooldown = true;
            this.disableShootingOnAllLanes();
        }

        if (this.waveIsInCooldown && this.currentShootingCooldown <= 0) {
            this.currentShootingTimeInSecond = this.baseShootingTimePeriodInSecond;
            this.waveIsInCooldown = false;
            this.enableAndDisableShootingOnLanes();
        }

        this.listEnemies.forEach((enemyTierList) => {
            enemyTierList.forEach((enemy) => {
                enemy.Update(dt);
            });
        });

        this.waveEnemiesStateTracker.Update(dt);
    }

    public Draw(ctx: CanvasRenderingContext2D) {
        this.listEnemies.get('Tier3')?.forEach((enemy) => {
            enemy.Draw(ctx);
        });

        this.listEnemies.get('Tier2')?.forEach((enemy) => {
            enemy.Draw(ctx);
        });

        this.listEnemies.get('Tier1')?.forEach((enemy) => {
            enemy.Draw(ctx);
        });
    }

    public get HasNoEnemyLeft(): boolean {
        let hasNoEnemyLeft = true;
        // Current Enemy Visible is empty
        this.listEnemies.forEach((enemyTierList) => {
            if (enemyTierList.size > 0) {
                hasNoEnemyLeft = false;
            }
        });

        // No more enemies to spawn
        this.numberOfEnemiesToSpawn.forEach((size) => {
            if (size > 0) {
                hasNoEnemyLeft = false;
            }
        });

        return hasNoEnemyLeft;
    }

    public get ListEnemies(): Map<IEnemy, IEnemy> {
        const enemies = new Map<IEnemy, IEnemy>();

        this.listEnemies.forEach((enemyTierList) => {
            enemyTierList.forEach((enemy) => {
                enemies.set(enemy, enemy);
            });
        });

        return enemies;
    }

    public get RandomEnemy(): IEnemy | undefined {
        const { GetRandomObjectFromMap } = ServiceLocator.GetService<IServiceUtilManager>('UtilManager');
        const enemyMap = new Map<IEnemy, IEnemy>();

        this.listEnemies.forEach((enemyTierList) => {
            enemyTierList.forEach((enemy) => {
                enemyMap.set(enemy, enemy);
            });
        });

        const randomEnemy = GetRandomObjectFromMap<IEnemy>({ theMap: enemyMap });

        return randomEnemy;
    }

    public AddEnemyDamageState(parameters: {
        target: IEnemy;
        effect: DamageEffectFunctionReturnType;
        effectType: DamageEffectOptions;
    }) {
        this.waveEnemiesStateTracker.AddState(parameters);
    }

    public RemoveEnemyDamageState(parameters: {
        target: IEnemy;
        effect: DamageEffectFunctionReturnType;
        effectType: DamageEffectOptions;
    }) {
        this.waveEnemiesStateTracker.RemoveState(parameters);
    }

    public GetEnemyAnimation(parameters: { target: IEnemy }): AvailableAnimation | undefined {
        const { target } = parameters;
        return this.listEnemies.get(target.Tier)?.get(target)?.AnimationsController.CurrentAnimationName;
    }

    public PlayEnemyAnimation(parameters: { target: IEnemy; animationName: AvailableAnimation }) {
        const { target, animationName } = parameters;
        this.listEnemies
            .get(target.Tier)
            ?.get(target)
            ?.AnimationsController.PlayAnimation({ animation: animationName });
    }

    public ParalyzeEnemy(parameters: { target: IEnemy }) {
        const { target } = parameters;

        target.ApplyParalyzeEnemy();
    }

    public RemoveParalyzeEnemy(parameters: { target: IEnemy }) {
        const { target } = parameters;

        target.RemoveParalyzeEnemy();
    }

    private getEnemyTierToSpawn(round: number): Map<EnemyTier, number> {
        const roundTierLengthInRound = 4;
        const roundTier = Math.ceil(round / roundTierLengthInRound);

        const roundStatIndex = roundTier - 1;
        let roundStat = RoundStats[roundStatIndex];
        if (!roundStat) {
            roundStat = RoundStats[RoundStats.length - 1];
        }

        const roundTierProgression = 1 - (roundStat['Last Round'] - round) / roundTierLengthInRound; // you will get something like: 0, 0.25, 0.5, 0.75, 1

        const numberOfEnemiesToSpawn =
            roundStat['Min Enemies per Wave'] +
            (roundStat['Max Enemies per Wave'] - roundStat['Min Enemies per Wave']) * roundTierProgression;

        const numberOfTier1Enemies = Math.round(numberOfEnemiesToSpawn * roundStat['Tier 1 Enemies Proportion']);
        const numberOfTier2Enemies = Math.round(numberOfEnemiesToSpawn * roundStat['Tier 2 Enemies Proportion']);
        const numberOfTier3Enemies = Math.round(numberOfEnemiesToSpawn * roundStat['Tier 3 Enemies Proportion']);

        return new Map<EnemyTier, number>([
            ['Tier1', numberOfTier1Enemies],
            ['Tier2', numberOfTier2Enemies],
            ['Tier3', numberOfTier3Enemies],
        ]);
    }

    private fillLanes(parameters: { tresholdBeforeRefill: number }) {
        const { tresholdBeforeRefill } = parameters;
        this.laneManager.forEach((laneManager, lane) => {
            const remainingEnemies = this.getRandomListRemainingEnemies();
            const enemies = laneManager.FillLane({
                enemyListYouCanGenerate: remainingEnemies,
                tresholdForRefill: tresholdBeforeRefill,
            });

            this.AddEnemy(...enemies);
        });
    }

    private getRandomListRemainingEnemies(): EnemyTier[] {
        const enemyTierList: EnemyTier[] = [];
        for (const [enemyTier, size] of this.numberOfEnemiesToSpawn.entries()) {
            for (let i = 0; i < size; i++) {
                enemyTierList.push(enemyTier);
            }
        }

        return shuffleArray(enemyTierList);
    }

    private enableAndDisableShootingOnLanes() {
        let laneIndexThatAreNotEmpty: LaneNumber[] = [];

        this.laneManager.forEach((laneManager, lane) => {
            if (!laneManager.IsLaneEmpty()) {
                laneIndexThatAreNotEmpty.push(lane);
            }
        });

        laneIndexThatAreNotEmpty = shuffleArray(laneIndexThatAreNotEmpty);

        let numberOfLaneThatCanShoot = this.maxNumberOfLaneThatCanShoot;

        for (const lane of laneIndexThatAreNotEmpty) {
            if (numberOfLaneThatCanShoot <= 0) {
                this.laneManager.get(lane)?.DisableShootingOnLane();
            } else {
                this.laneManager.get(lane)?.EnableShootingOnLane();
                numberOfLaneThatCanShoot--;
            }
        }
    }

    private disableShootingOnAllLanes() {
        this.laneManager.forEach((laneManager) => {
            laneManager.DisableShootingOnLane();
        });
    }

    private testWaveShootingAndCooldown() {
        console.log('---------------------------------------------------------');
        console.log('Current Shooting Time:', this.currentShootingTimeInSecond);
        console.log('Current Shooting Cooldown:', this.currentShootingCooldown);
        console.log('Wave Is In Cooldown:', this.waveIsInCooldown);
    }

    private testList() {
        console.log('---------------------------------------------------------');
        this.listEnemies.forEach((enemyTierList, index) => {
            console.log(`Visible Tier ${index}:`, enemyTierList.size);
        });
        this.numberOfEnemiesToSpawn.forEach((size, index) => {
            console.log(`To Spawn Tier ${index}:`, size);
        });

        this.waveEnemiesStateTracker.TestList();

        this.laneManager.forEach((lane) => {
            lane.TestList();
        });
    }

    private testDrawSpawnLine(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.moveTo(214 * CANVA_SCALEX, 33 * CANVA_SCALEY);
        ctx.lineTo(canvas.width, 33 * CANVA_SCALEY);

        ctx.moveTo(214 * CANVA_SCALEX, 68 * CANVA_SCALEY);
        ctx.lineTo(canvas.width, 68 * CANVA_SCALEY);

        ctx.moveTo(214 * CANVA_SCALEX, 103 * CANVA_SCALEY);
        ctx.lineTo(canvas.width, 103 * CANVA_SCALEY);

        ctx.moveTo(214 * CANVA_SCALEX, 138 * CANVA_SCALEY);
        ctx.lineTo(canvas.width, 138 * CANVA_SCALEY);

        ctx.stroke();
    }
}

function shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function circularArrayShuffle<T>(array: T[], cycles: number): T[] {
    let newArray = [...array];
    for (let i = 0; i < cycles; i++) {
        const firstPart = newArray.slice(0, 1);
        const secondPart = newArray.slice(1);
        newArray = [...secondPart, ...firstPart];
    }

    return newArray;
}
