import {NATURES} from './data/natures';
import {Generation} from './gen';

export type Stat = 'hp' | 'atk' | 'def' | 'spa' | 'spd' | 'spe' | 'spc';
export interface StatsTable<T> {
  hp: T;
  atk: T;
  def: T;
  spa: T;
  spd: T;
  spe: T;
  spc?: T;
}

const RBY: Stat[] = ['hp', 'atk', 'def', 'spc', 'spe'];
const GSC: Stat[] = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
const ADV: Stat[] = GSC;
const DPP: Stat[] = GSC;
const BW: Stat[] = GSC;
const XY: Stat[] = GSC;
const SM: Stat[] = GSC;
const SS: Stat[] = GSC;

export const STATS: Stat[][] = [[], RBY, GSC, ADV, DPP, BW, XY, SM, SS];

export function displayStat(stat: Stat) {
  switch (stat) {
    case 'hp':
      return 'HP';
    case 'atk':
      return 'Atk';
    case 'def':
      return 'Def';
    case 'spa':
      return 'SpA';
    case 'spd':
      return 'SpD';
    case 'spe':
      return 'Spe';
    case 'spc':
      return 'Spc';
    default:
      throw new Error(`unknown stat ${stat}`);
  }
}

function calcStatRBYFromDV(stat: Stat, base: number, dv: number, level: number) {
  if (stat === 'hp') {
    return Math.floor((((base + dv) * 2 + 63) * level) / 100) + level + 10;
  } else {
    return Math.floor((((base + dv) * 2 + 63) * level) / 100) + 5;
  }
}

function calcStatADV(
  stat: Stat,
  base: number,
  iv: number,
  ev: number,
  level: number,
  nature?: string
) {
  if (stat === 'hp') {
    return base === 1
      ? base
      : Math.floor(((base * 2 + iv + Math.floor(ev / 4)) * level) / 100) + level + 10;
  } else {
    const mods: [Stat?, Stat?] = nature ? NATURES[nature] : [undefined, undefined];
    let n: number;
    if (mods) {
      n = mods[0] === stat ? 1.1 : mods[1] === stat ? 0.9 : 1;
    } else {
      n = 1;
    }

    return Math.floor((Math.floor(((base * 2 + iv + Math.floor(ev / 4)) * level) / 100) + 5) * n);
  }
}

function calcStatRBY(
  stat: Stat,
  base: number,
  iv: number,
  ev: number,
  level: number,
  nature?: string
) {
  return calcStatRBYFromDV(stat, base, IVToDV(iv), level);
}

function calcStat0(
  stat: Stat,
  base: number,
  iv: number,
  ev: number,
  level: number,
  nature?: string
) {
  return 0;
}

export function getHPDV(ivs: {atk: number; def: number; spe: number; spc: number}) {
  return (
    (IVToDV(ivs.atk) % 2) * 8 +
    (IVToDV(ivs.def) % 2) * 4 +
    (IVToDV(ivs.spe) % 2) * 2 +
    (IVToDV(ivs.spc) % 2)
  );
}

export function IVToDV(iv: number) {
  return Math.floor(iv / 2);
}

export function DVToIV(dv: number) {
  return dv * 2 + 1;
}

export function shortForm(stat: Stat) {
  switch (stat) {
    case 'hp':
      return 'hp';
    case 'atk':
      return 'at';
    case 'def':
      return 'df';
    case 'spa':
      return 'sa';
    case 'spd':
      return 'sd';
    case 'spe':
      return 'sp';
    case 'spc':
      return 'sl';
  }
}

const CALC_STAT = [
  calcStat0,
  calcStatRBY,
  calcStatRBY,
  calcStatADV,
  calcStatADV,
  calcStatADV,
  calcStatADV,
  calcStatADV,
  calcStatADV,
];

export function calcStat(
  gen: Generation,
  stat: Stat,
  base: number,
  iv: number,
  ev: number,
  level: number,
  nature?: string
) {
  return CALC_STAT[gen](stat, base, iv, ev, level, nature);
}
