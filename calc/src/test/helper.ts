/* eslint-env jest */

import * as I from '../data/interface';
import {calculate, Pokemon, Move, Result} from '../index';
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

export function tests(name: string, fn: (gen: Gen) => void, type?: 'skip' | 'only'): void;
export function tests(
  name: string,
  from: I.GenerationNum,
  fn: (gen: Gen) => void,
  type?: 'skip' | 'only'
): void;
export function tests(
  name: string,
  from: I.GenerationNum,
  to: I.GenerationNum,
  fn: (gen: Gen) => void,
  type?: 'skip' | 'only'
): void;
export function tests(...args: any[]) {
  const name = args[0];
  let from: I.GenerationNum;
  let to: I.GenerationNum;
  let fn: (gen: Gen) => void;
  let type: 'skip' | 'only' | undefined = undefined;
  if (typeof args[1] !== 'number') {
    from = 1;
    to = 9;
    fn = args[1];
    type = args[2];
  } else if (typeof args[2] !== 'number') {
    from = args[1] as I.GenerationNum ?? 1;
    to = 9;
    fn = args[2];
    type = args[3];
  } else {
    from = args[1] as I.GenerationNum ?? 1;
    to = args[2] as I.GenerationNum ?? 8;
    fn = args[3];
    type = args[4];
  }

  inGens(from, to, gen => {
    const n = `${name} (gen ${gen.gen})`;
    if (type === 'skip') {
      test.skip(n, () => fn!(gen));
    } else if (type === 'only') {
      test.only(n, () => fn!(gen));
    } else {
      test(n, () => fn!(gen));
    }
  });
}

declare global {
  namespace jest {
    interface Matchers<R, T> {
      toMatch(gen: I.GenerationNum, notation?: '%' | 'px' | ResultDiff, diff?: ResultDiff): R;
    }
  }
}

type ResultDiff = Partial<Record<I.GenerationNum, Partial<ResultBreakdown>>>;
interface ResultBreakdown {
  range: [number, number];
  desc: string;
  result: string;
}

expect.extend({
  toMatch(
    received: Result,
    gen: I.GenerationNum,
    notation?: '%' | 'px' | ResultDiff,
    diff?: ResultDiff
  ) {
    if (typeof notation !== 'string') {
      diff = notation;
      notation = '%';
    }
    if (!diff) throw new Error('toMatch called with no diff!');

    const breakdowns = Object.entries(diff).sort() as [string, ResultBreakdown][];
    const expected = {range: undefined! as [number, number], desc: '', result: ''};
    for (const [g, {range, desc, result}] of breakdowns) {
      if (Number(g) > gen) break;
      if (range) expected.range = range;
      if (desc) expected.desc = desc;
      if (result) expected.result = result;
    }

    if (!(expected.range || expected.desc || expected.result)) {
      throw new Error(`toMatch called with empty diff: ${diff}`);
    }

    if (expected.range) {
      if (this.isNot) {
        expect(received.range()).not.toEqual(expected.range);
      } else {
        expect(received.range()).toEqual(expected.range);
      }
    }
    if (expected.desc) {
      const r = received.fullDesc(notation).split(': ')[0];
      if (this.isNot) {
        expect(r).not.toEqual(expected.desc);
      } else {
        expect(r).toEqual(expected.desc);
      }
    }
    if (expected.result) {
      const post = received.fullDesc(notation).split(': ')[1];
      const r = `(${post.split('(')[1]}`;
      if (this.isNot) {
        expect(r).not.toEqual(expected.result);
      } else {
        expect(r).toEqual(expected.result);
      }
    }

    return {pass: !this.isNot, message: () => ''};
  },
});
