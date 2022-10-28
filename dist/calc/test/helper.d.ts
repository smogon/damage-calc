import * as I from '../data/interface';
import { Pokemon, Move, Result } from '../index';
import { State } from '../state';
import { Field, Side } from '../field';
declare const calc: (gen: I.GenerationNum) => (attacker: Pokemon, defender: Pokemon, move: Move, field?: Field | undefined) => Result;
declare const move: (gen: I.GenerationNum) => (name: string, options?: Partial<Omit<State.Move, 'ability' | 'item' | 'species'>> & {
    ability?: string;
    item?: string;
    species?: string;
}) => Move;
declare const pokemon: (gen: I.GenerationNum) => (name: string, options?: Partial<Omit<State.Pokemon, 'ability' | 'item' | 'nature' | 'moves'>> & {
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
}) => Pokemon;
declare const field: (field?: Partial<State.Field>) => Field;
declare const side: (side?: State.Side) => Side;
interface Gen {
    gen: I.GenerationNum;
    calculate: ReturnType<typeof calc>;
    Pokemon: ReturnType<typeof pokemon>;
    Move: ReturnType<typeof move>;
    Field: typeof field;
    Side: typeof side;
}
export declare function inGen(gen: I.GenerationNum, fn: (gen: Gen) => void): void;
export declare function inGens(from: I.GenerationNum, to: I.GenerationNum, fn: (gen: Gen) => void): void;
export declare function tests(name: string, fn: (gen: Gen) => void, type?: 'skip' | 'only'): void;
export declare function tests(name: string, from: I.GenerationNum, fn: (gen: Gen) => void, type?: 'skip' | 'only'): void;
export declare function tests(name: string, from: I.GenerationNum, to: I.GenerationNum, fn: (gen: Gen) => void, type?: 'skip' | 'only'): void;
declare global {
    namespace jest {
        interface Matchers<R, T> {
            toMatch(gen: I.GenerationNum, notation?: '%' | 'px' | ResultDiff, diff?: ResultDiff): R;
        }
    }
}
declare type ResultDiff = Partial<Record<I.GenerationNum, Partial<ResultBreakdown>>>;
interface ResultBreakdown {
    range: [number, number];
    desc: string;
    result: string;
}
export {};
