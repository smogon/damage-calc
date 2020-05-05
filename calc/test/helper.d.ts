import * as I from '../data/interface';
import { Pokemon, Move } from '../index';
import { State } from '../state';
import { Field, Side } from '../field';
declare const calc: (gen: I.GenerationNum) => (attacker: Pokemon, defender: Pokemon, move: Move, field?: Field | undefined) => import("..").Result;
declare const move: (gen: I.GenerationNum) => (name: string, options?: Partial<Pick<State.Move, "name" | "overrides" | "useZ" | "useMax" | "isCrit" | "hits" | "timesUsed" | "timesUsedWithMetronome">> & {
    ability?: string | undefined;
    item?: string | undefined;
    species?: string | undefined;
}) => Move;
declare const pokemon: (gen: I.GenerationNum) => (name: string, options?: Partial<Pick<State.Pokemon, "name" | "level" | "abilityOn" | "isDynamaxed" | "gender" | "ivs" | "evs" | "boosts" | "originalCurHP" | "status" | "toxicCounter" | "overrides">> & {
    ability?: string | undefined;
    item?: string | undefined;
    nature?: string | undefined;
    moves?: string[] | undefined;
    curHP?: number | undefined;
    ivs?: (Partial<I.StatsTable<number>> & {
        spc?: number | undefined;
    }) | undefined;
    evs?: (Partial<I.StatsTable<number>> & {
        spc?: number | undefined;
    }) | undefined;
    boosts?: (Partial<I.StatsTable<number>> & {
        spc?: number | undefined;
    }) | undefined;
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
export {};
