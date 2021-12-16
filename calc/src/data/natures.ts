import * as I from './interface';
import {toID} from '../util';

export const NATURES: {[name: string]: [I.StatID, I.StatID]} = {
  Adamant: ['atk', 'spa'],
  Bashful: ['spa', 'spa'],
  Bold: ['def', 'atk'],
  Brave: ['atk', 'spe'],
  Calm: ['spd', 'atk'],
  Careful: ['spd', 'spa'],
  Docile: ['def', 'def'],
  Gentle: ['spd', 'def'],
  Hardy: ['atk', 'atk'],
  Hasty: ['spe', 'def'],
  Impish: ['def', 'spa'],
  Jolly: ['spe', 'spa'],
  Lax: ['def', 'spd'],
  Lonely: ['atk', 'def'],
  Mild: ['spa', 'def'],
  Modest: ['spa', 'atk'],
  Naive: ['spe', 'spd'],
  Naughty: ['atk', 'spd'],
  Quiet: ['spa', 'spe'],
  Quirky: ['spd', 'spd'],
  Rash: ['spa', 'spd'],
  Relaxed: ['def', 'spe'],
  Sassy: ['spd', 'spe'],
  Serious: ['spe', 'spe'],
  Timid: ['spe', 'atk'],
};

export class Natures implements I.Natures {
  get(id: I.ID) {
    return NATURES_BY_ID[id];
  }

  *[Symbol.iterator]() {
    for (const id in NATURES_BY_ID) {
      yield this.get(id as I.ID)!;
    }
  }
}

class Nature implements I.Nature {
  readonly kind: 'Nature';
  readonly id: I.ID;
  readonly name: I.NatureName;
  readonly plus?: I.StatID;
  readonly minus?: I.StatID;

  constructor(name: string, [plus, minus]: [I.StatID, I.StatID]) {
    this.kind = 'Nature';
    this.id = toID(name);
    this.name = name as I.NatureName;
    this.plus = plus;
    this.minus = minus;
  }
}

const NATURES_BY_ID: {[id: string]: Nature} = {};

for (const nature in NATURES) {
  const n = new Nature(nature, NATURES[nature] as [I.StatID, I.StatID]);
  NATURES_BY_ID[n.id] = n;
}
