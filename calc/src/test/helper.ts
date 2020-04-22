import * as I from '../data/interface';
import {calculate, Pokemon, Move} from '../index';
import {DeepPartial} from '../util';
import {State} from '../state';
import {Field, Side} from '../field';

declare global {
  namespace jest {
    interface Matchers<R, T> {
      toBeRange(a: number, b: number): R;
    }
  }
}

/* global expect */
expect.extend({
  toBeRange(received: number[], floor: number, ceiling: number) {
    const a = received[0];
    const b = received[received.length - 1];
    const pass = a === floor && b === ceiling;
    if (pass) {
      return {
        message: () => `expected range (${a}, ${b}) not to be within range (${floor}, ${ceiling})`,
        pass,
      };
    } else {
      return {
        message: () => `expected range (${a}, ${b}) to be within range (${floor}, ${ceiling})`,
        pass,
      };
    }
  },
});

const calc = (gen: I.GenerationNum) => (
  attacker: Pokemon,
  defender: Pokemon,
  move: Move,
  field?: Field
) => calculate(gen, attacker, defender, move, field);

const move = (gen: I.GenerationNum) => (
  name: string,
  options: DeepPartial<Omit<State.Move, 'ability' | 'item' | 'species'>> & {
    ability?: string;
    item?: string;
    species?: string;
  } = {}
) => new Move(gen, name, options as any);

const pokemon = (gen: I.GenerationNum) => (
  name: string,
  options: DeepPartial<Omit<State.Pokemon, 'ability' | 'item' | 'nature' | 'moves'>> & {
    ability?: string;
    item?: string;
    nature?: string;
    moves?: string[];
  } = {}
) => new Pokemon(gen, name, options as any);

const field = (field: DeepPartial<State.Field> = {}) => new Field(field);

const side = (side: DeepPartial<State.Side> = {}) => new Side(side);

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
