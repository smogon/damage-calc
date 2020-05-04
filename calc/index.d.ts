import { State } from './state';
import * as I from './data/interface';
import * as A from './adaptable';
export declare function calculate(gen: I.GenerationNum | I.Generation, attacker: A.Pokemon, defender: A.Pokemon, move: A.Move, field?: A.Field): A.Result;
export declare class Move extends A.Move {
    constructor(gen: I.GenerationNum | I.Generation, name: string, options?: Partial<Omit<State.Move, 'ability' | 'item' | 'species'>> & {
        ability?: string;
        item?: string;
        species?: string;
    });
}
export declare class Pokemon extends A.Pokemon {
    constructor(gen: I.GenerationNum | I.Generation, name: string, options?: Partial<Omit<State.Pokemon, 'ability' | 'item' | 'nature' | 'moves'>> & {
        ability?: string;
        item?: string;
        nature?: string;
        moves?: string[];
        curHP?: number;
        ivs?: Partial<I.StatsTable> & {
            spc?: number;
        };
        evs?: Partial<I.StatsTable> & {
            spc?: number;
        };
        boosts?: Partial<I.StatsTable> & {
            spc?: number;
        };
    });
    static getForme(gen: I.GenerationNum | I.Generation, speciesName: string, item?: string, moveName?: string): string;
}
export declare function calcStat(gen: I.GenerationNum | I.Generation, stat: I.StatName | 'spc', base: number, iv: number, ev: number, level: number, nature?: string): number;
export { Field, Side } from './field';
export { Result } from './result';
export { GenerationNum, StatsTable, StatName } from './data/interface';
export { Generations } from './data/index';
export { toID } from './util';
export { State } from './state';
export { ABILITIES } from './data/abilities';
export { ITEMS, MEGA_STONES } from './data/items';
export { MOVES } from './data/moves';
export { SPECIES } from './data/species';
export { NATURES } from './data/natures';
export { TYPE_CHART } from './data/types';
export { STATS, Stats } from './stats';
