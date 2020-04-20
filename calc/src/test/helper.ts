import {StatsTable} from '../stats';
import {Status} from '../pokemon';
import * as I from '../data/interface';
import {calculate, Pokemon, Move} from '../index';
import {Field, GameType, Terrain, Weather, Side} from '../field';

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
  options: {
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
  } = {}
) => new Move(gen, name, options);

const pokemon = (gen: I.GenerationNum) => (
  name: string,
  options: {
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
  } = {}
) => new Pokemon(gen, name, options);

const field = (
  field: {
    gameType?: GameType;
    weather?: Weather;
    terrain?: Terrain;
    isGravity?: boolean;
    attackerSide?: Partial<Side>;
    defenderSide?: Partial<Side>;
  } = {}
) => new Field(field);

const side = (side: {
  spikes?: number;
  steelsurge?: boolean;
  isSR?: boolean;
  isReflect?: boolean;
  isLightScreen?: boolean;
  isProtected?: boolean;
  isSeeded?: boolean;
  isForesight?: boolean;
  isTailwind?: boolean;
  isHelpingHand?: boolean;
  isFriendGuard?: boolean;
  isAuroraVeil?: boolean;
  isBattery?: boolean;
  isSwitching?: boolean;
}) => new Side(side);

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
