import { NATURES } from './data/natures';

// TODO: convert to standard notation...
export type Stat = 'hp' | 'at' | 'df' | 'sa' | 'sd' | 'sp' | 'sl';
export interface StatsTable<T> {
  hp: T;
  at: T;
  df: T;
  sa: T;
  sd: T;
  sp: T;
  sl?: T;
}

export const HP: Stat = 'hp';
export const AT: Stat = 'at';
export const DF: Stat = 'df';
export const SA: Stat = 'sa';
export const SD: Stat = 'sd';
export const SP: Stat = 'sp';
export const SL: Stat = 'sl';

const RBY: Stat[] = [HP, AT, DF, SL, SP];
const GSC: Stat[] = [HP, AT, DF, SA, SD, SP];
const ADV: Stat[] = GSC;
const DPP: Stat[] = GSC;
const BW: Stat[] = GSC;
const XY: Stat[] = GSC;
const SM: Stat[] = GSC;

export const STATS: Stat[][] = [[], RBY, GSC, ADV, DPP, BW, XY, SM];

export function displayStat(stat: Stat) {
  switch (stat) {
    case HP:
      return 'HP';
    case AT:
      return 'Atk';
    case DF:
      return 'Def';
    case SA:
      return 'SpA';
    case SD:
      return 'SpD';
    case SP:
      return 'Spe';
    case SL:
      return 'Spc';
    default:
      throw new Error(`unknown stat ${stat}`);
  }
}

// TODO: remove alias
export const toSmogonStat = displayStat;

// TODO: stop exporting
export function calcStatRBYFromDV(stat: Stat, base: number, dv: number, level: number) {
  if (stat === HP) {
    return Math.floor((((base + dv) * 2 + 63) * level) / 100) + level + 10;
  } else {
    return Math.floor((((base + dv) * 2 + 63) * level) / 100) + 5;
  }
}

// TODO: stop exporting
export function calcStatADV(
  stat: Stat,
  base: number,
  iv: number,
  ev: number,
  level: number,
  nature?: string
) {
  if (stat === HP) {
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

export function getHPDV(ivs: { atk: number; def: number; spe: number; spc: number }) {
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

const CALC_STAT = [
  calcStat0,
  calcStatRBY,
  calcStatRBY,
  calcStatADV,
  calcStatADV,
  calcStatADV,
  calcStatADV,
  calcStatADV,
];

export function calcStat(
  gen: 1 | 2 | 3 | 4 | 5 | 6 | 7,
  stat: Stat,
  base: number,
  iv: number,
  ev: number,
  level: number,
  nature?: string
) {
  return CALC_STAT[gen](stat, base, iv, ev, level, nature);
}
