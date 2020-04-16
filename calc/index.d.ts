import { Stat, StatsTable } from './stats';
import { Status } from './pokemon';
import * as I from './data/interface';
import * as A from './adaptable';
export declare function calculate(gen: I.GenerationNum | I.Generation, attacker: A.Pokemon, defender: A.Pokemon, move: A.Move, field?: A.Field): any;
export declare class Move extends A.Move {
    constructor(gen: I.GenerationNum | I.Generation, name: string, options?: {
        ability?: string;
        item?: string;
        species?: string;
        useZ?: boolean;
        useMax?: boolean;
        isCrit?: boolean;
        hits?: number;
        usedTimes?: number;
        metronomeCount?: number;
        overrides?: Partial<I.Move>;
    });
}
export declare class Pokemon extends A.Pokemon {
    constructor(gen: I.GenerationNum | I.Generation, name: string, options?: {
        level?: number;
        ability?: string;
        abilityOn?: boolean;
        isDynamaxed?: boolean;
        item?: string;
        gender?: I.GenderName;
        nature?: string;
        ivs?: Partial<StatsTable>;
        evs?: Partial<StatsTable>;
        boosts?: Partial<StatsTable>;
        curHP?: number;
        status?: Status;
        toxicCounter?: number;
        moves?: string[];
        overrides?: Partial<I.Specie>;
    });
    static getForme(gen: I.GenerationNum | I.Generation, speciesName: string, item?: string, moveName?: string): string;
}
export declare function calcStat(gen: I.GenerationNum | I.Generation, stat: Stat, base: number, iv: number, ev: number, level: number, nature?: string): number;
export { Field, Side } from './field';
export { Result } from './result';
export { GenerationNum } from './data/interface';
export { Generations } from './data/index';
export { toID } from './util';
export { ABILITIES } from './data/abilities';
export { ITEMS, MEGA_STONES } from './data/items';
export { MOVES } from './data/moves';
export { SPECIES } from './data/species';
export { NATURES } from './data/natures';
export { TYPE_CHART } from './data/types';
export { STATS, StatsTable, Stats, Stat } from './stats';
