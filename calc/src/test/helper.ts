import * as I from '../data/interface';
import {calculate, Pokemon, Move} from '../index';
import {State} from '../state';
import {Field, Side} from '../field';

const calc = (gen: I.GenerationNum) => (
  attacker: Pokemon,
  defender: Pokemon,
  move: Move,
  field?: Field
) => calculate(gen, attacker, defender, move, field);

const move = (gen: I.GenerationNum) => (
  name: string,
  options: Partial<Omit<State.Move, 'ability' | 'item' | 'species'>> & {
    ability?: string;
    item?: string;
    species?: string;
  } = {}
) => new Move(gen, name, options as any);

const pokemon = (gen: I.GenerationNum) => (
  name: string,
  options: Partial<Omit<State.Pokemon, 'ability' | 'item' | 'nature' | 'moves'>> & {
    ability?: string;
    item?: string;
    nature?: string;
    moves?: string[];
    curHP?: number;
    ivs?: Partial<I.StatsTable> & {spc?: number};
    evs?: Partial<I.StatsTable> & {spc?: number};
    boosts?: Partial<I.StatsTable> & {spc?: number};
  } = {}
) => new Pokemon(gen, name, options as any);

const field = (field: Partial<State.Field> = {}) => new Field(field);

const side = (side: State.Side = {}) => new Side(side);

interface Gen {
  gen: I.GenerationNum;
  calculate: ReturnType<typeof calc>;
  Pokemon: ReturnType<typeof pokemon>;
  Move: ReturnType<typeof move>;
  Field: typeof field;
  Side: typeof side;
}

export function inGen(gen: I.GenerationNum, fn: (gen: Gen) => void) {
  fn({
    gen,
    calculate: calc(gen),
    Move: move(gen),
    Pokemon: pokemon(gen),
    Field: field,
    Side: side,
  });
}

export function inGens(from: I.GenerationNum, to: I.GenerationNum, fn: (gen: Gen) => void) {
  for (let gen = from; gen <= to; gen++) {
    inGen(gen, fn);
  }
}
