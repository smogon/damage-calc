import * as I from '../data/interface';
export interface MoveData {
    readonly name?: string;
    readonly bp: number;
    readonly type: I.TypeName;
    readonly category?: I.MoveCategory;
    readonly hasSecondaryEffect?: boolean;
    readonly isSpread?: boolean | 'allAdjacent';
    readonly makesContact?: boolean;
    readonly hasRecoil?: I.MoveRecoil;
    readonly alwaysCrit?: boolean;
    readonly givesHealth?: boolean;
    readonly percentHealed?: number;
    readonly ignoresBurn?: boolean;
    readonly isPunch?: boolean;
    readonly isBite?: boolean;
    readonly isBullet?: boolean;
    readonly isSound?: boolean;
    readonly isPulse?: boolean;
    readonly hasPriority?: boolean;
    readonly dropsStats?: number;
    readonly ignoresDefenseBoosts?: boolean;
    readonly dealsPhysicalDamage?: boolean;
    readonly bypassesProtect?: boolean;
    readonly isZ?: boolean;
    readonly isMax?: boolean;
    readonly usesHighestAttackStat?: boolean;
    readonly zp?: number;
    readonly maxPower?: number;
    readonly isMultiHit?: boolean;
    readonly isTwoHit?: boolean;
}
export declare const MOVES: {
    [name: string]: MoveData;
}[];
export declare class Moves implements I.Moves {
    private readonly gen;
    constructor(gen: I.GenerationNum);
    get(id: I.ID): Move;
    [Symbol.iterator](): Generator<Move, void, unknown>;
}
declare class Move implements I.Move {
    readonly kind: 'Move';
    readonly id: I.ID;
    readonly name: I.MoveName;
    readonly bp: number;
    readonly type: I.TypeName;
    readonly category?: I.MoveCategory;
    readonly hasSecondaryEffect?: boolean;
    readonly isSpread?: boolean | 'allAdjacent';
    readonly makesContact?: boolean;
    readonly hasRecoil?: I.MoveRecoil;
    readonly alwaysCrit?: boolean;
    readonly givesHealth?: boolean;
    readonly percentHealed?: number;
    readonly ignoresBurn?: boolean;
    readonly isPunch?: boolean;
    readonly isBite?: boolean;
    readonly isBullet?: boolean;
    readonly isSound?: boolean;
    readonly isPulse?: boolean;
    readonly hasPriority?: boolean;
    readonly dropsStats?: number;
    readonly ignoresDefenseBoosts?: boolean;
    readonly dealsPhysicalDamage?: boolean;
    readonly bypassesProtect?: boolean;
    readonly isZ?: boolean;
    readonly isMax?: boolean;
    readonly usesHighestAttackStat?: boolean;
    readonly zp?: number;
    readonly maxPower?: number;
    readonly isMultiHit?: boolean;
    readonly isTwoHit?: boolean;
    constructor(name: string, data: MoveData);
}
export {};
