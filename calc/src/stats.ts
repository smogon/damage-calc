import {Natures, Generation, StatName} from './data/interface';
import {toID} from './util';

export type Stat = StatName | 'spc';
export type StatsTable<T = number> = {[stat in StatName]: T} & {spc?: T};

const RBY: Stat[] = ['hp', 'atk', 'def', 'spc', 'spe'];
const GSC: Stat[] = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
const ADV: Stat[] = GSC;
const DPP: Stat[] = GSC;
const BW: Stat[] = GSC;
const XY: Stat[] = GSC;
const SM: Stat[] = GSC;
const SS: Stat[] = GSC;

export const STATS: Stat[][] = [[], RBY, GSC, ADV, DPP, BW, XY, SM, SS];

export const Stats = new (class {
  displayStat(stat: Stat) {
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

  shortForm(stat: Stat) {
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

  getHPDV(ivs: {atk: number; def: number; spe: number; spc: number}) {
    return (
      (this.IVToDV(ivs.atk) % 2) * 8 +
      (this.IVToDV(ivs.def) % 2) * 4 +
      (this.IVToDV(ivs.spe) % 2) * 2 +
      (this.IVToDV(ivs.spc) % 2)
    );
  }

  IVToDV(iv: number) {
    return Math.floor(iv / 2);
  }

  DVToIV(dv: number) {
    return dv * 2 + 1;
  }

  calcStat(
    gen: Generation,
    stat: Stat,
    base: number,
    iv: number,
    ev: number,
    level: number,
    nature?: string
  ) {
    if (gen.num < 1 || gen.num > 8) throw new Error(`Invalid generation ${gen.num}`);
    if (gen.num < 3) return this.calcStatRBY(stat, base, iv, level);
    return this.calcStatADV(gen.natures, stat, base, iv, ev, level, nature);
  }

  calcStatADV(
    natures: Natures,
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
      let mods: [Stat?, Stat?] = [undefined, undefined];
      if (nature) {
        const nat = natures.get(toID(nature));
        mods = [nat?.plus, nat?.minus];
      }
      let n: number;
      if (mods) {
        n =
          mods[0] === stat && mods[1] === stat
            ? 1
            : mods[0] === stat
            ? 1.1
            : mods[1] === stat
            ? 0.9
            : 1;
      } else {
        n = 1;
      }

      return Math.floor((Math.floor(((base * 2 + iv + Math.floor(ev / 4)) * level) / 100) + 5) * n);
    }
  }

  calcStatRBY(stat: Stat, base: number, iv: number, level: number) {
    return this.calcStatRBYFromDV(stat, base, this.IVToDV(iv), level);
  }

  calcStatRBYFromDV(stat: Stat, base: number, dv: number, level: number) {
    if (stat === 'hp') {
      return Math.floor((((base + dv) * 2 + 63) * level) / 100) + level + 10;
    } else {
      return Math.floor((((base + dv) * 2 + 63) * level) / 100) + 5;
    }
  }
})();
