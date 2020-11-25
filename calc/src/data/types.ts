import * as I from './interface';
import {toID, extend} from '../util';

export type TypeChart = {
  [type in I.TypeName]?: {[type in I.TypeName]?: number};
};

const RBY: TypeChart = {
  '???': {
    Normal: 1,
    Grass: 1,
    Fire: 1,
    Water: 1,
    Electric: 1,
    Ice: 1,
    Flying: 1,
    Bug: 1,
    Poison: 1,
    Ground: 1,
    Rock: 1,
    Fighting: 1,
    Psychic: 1,
    Ghost: 1,
    Dragon: 1,
  },
  Normal: {
    '???': 1,
    Normal: 1,
    Grass: 1,
    Fire: 1,
    Water: 1,
    Electric: 1,
    Ice: 1,
    Flying: 1,
    Bug: 1,
    Poison: 1,
    Ground: 1,
    Rock: 0.5,
    Fighting: 1,
    Psychic: 1,
    Ghost: 0,
    Dragon: 1,
  },
  Grass: {
    '???': 1,
    Normal: 1,
    Grass: 0.5,
    Fire: 0.5,
    Water: 2,
    Electric: 1,
    Ice: 1,
    Flying: 0.5,
    Bug: 0.5,
    Poison: 0.5,
    Ground: 2,
    Rock: 2,
    Fighting: 1,
    Psychic: 1,
    Ghost: 1,
    Dragon: 0.5,
  },
  Fire: {
    '???': 1,
    Normal: 1,
    Grass: 2,
    Fire: 0.5,
    Water: 0.5,
    Electric: 1,
    Ice: 2,
    Flying: 1,
    Bug: 2,
    Poison: 1,
    Ground: 1,
    Rock: 0.5,
    Fighting: 1,
    Psychic: 1,
    Ghost: 1,
    Dragon: 0.5,
  },
  Water: {
    '???': 1,
    Normal: 1,
    Grass: 0.5,
    Fire: 2,
    Water: 0.5,
    Electric: 1,
    Ice: 1,
    Flying: 1,
    Bug: 1,
    Poison: 1,
    Ground: 2,
    Rock: 2,
    Fighting: 1,
    Psychic: 1,
    Ghost: 1,
    Dragon: 0.5,
  },
  Electric: {
    '???': 1,
    Normal: 1,
    Grass: 0.5,
    Fire: 1,
    Water: 2,
    Electric: 0.5,
    Ice: 1,
    Flying: 2,
    Bug: 1,
    Poison: 1,
    Ground: 0,
    Rock: 1,
    Fighting: 1,
    Psychic: 1,
    Ghost: 1,
    Dragon: 0.5,
  },
  Ice: {
    '???': 1,
    Normal: 1,
    Grass: 2,
    Fire: 1,
    Water: 0.5,
    Electric: 1,
    Ice: 0.5,
    Flying: 2,
    Bug: 1,
    Poison: 1,
    Ground: 2,
    Rock: 1,
    Fighting: 1,
    Psychic: 1,
    Ghost: 1,
    Dragon: 2,
  },
  Flying: {
    '???': 1,
    Normal: 1,
    Grass: 2,
    Fire: 1,
    Water: 1,
    Electric: 0.5,
    Ice: 1,
    Flying: 1,
    Bug: 2,
    Poison: 1,
    Ground: 1,
    Rock: 0.5,
    Fighting: 2,
    Psychic: 1,
    Ghost: 1,
    Dragon: 1,
  },
  Bug: {
    '???': 1,
    Normal: 1,
    Grass: 2,
    Fire: 0.5,
    Water: 1,
    Electric: 1,
    Ice: 1,
    Flying: 0.5,
    Bug: 1,
    Poison: 2,
    Ground: 1,
    Rock: 1,
    Fighting: 0.5,
    Psychic: 2,
    Ghost: 0.5,
    Dragon: 1,
  },
  Poison: {
    '???': 1,
    Normal: 1,
    Grass: 2,
    Fire: 1,
    Water: 1,
    Electric: 1,
    Ice: 1,
    Flying: 1,
    Bug: 2,
    Poison: 0.5,
    Ground: 0.5,
    Rock: 0.5,
    Fighting: 1,
    Psychic: 1,
    Ghost: 0.5,
    Dragon: 1,
  },
  Ground: {
    '???': 1,
    Normal: 1,
    Grass: 0.5,
    Fire: 2,
    Water: 1,
    Electric: 2,
    Ice: 1,
    Flying: 0,
    Bug: 0.5,
    Poison: 2,
    Ground: 1,
    Rock: 2,
    Fighting: 1,
    Psychic: 1,
    Ghost: 1,
    Dragon: 1,
  },
  Rock: {
    '???': 1,
    Normal: 1,
    Grass: 1,
    Fire: 2,
    Water: 1,
    Electric: 1,
    Ice: 2,
    Flying: 2,
    Bug: 2,
    Poison: 1,
    Ground: 0.5,
    Rock: 1,
    Fighting: 0.5,
    Psychic: 1,
    Ghost: 1,
    Dragon: 1,
  },
  Fighting: {
    '???': 1,
    Normal: 2,
    Grass: 1,
    Fire: 1,
    Water: 1,
    Electric: 1,
    Ice: 2,
    Flying: 0.5,
    Bug: 0.5,
    Poison: 0.5,
    Ground: 1,
    Rock: 2,
    Fighting: 1,
    Psychic: 0.5,
    Ghost: 0,
    Dragon: 1,
  },
  Psychic: {
    '???': 1,
    Normal: 1,
    Grass: 1,
    Fire: 1,
    Water: 1,
    Electric: 1,
    Ice: 1,
    Flying: 1,
    Bug: 1,
    Poison: 2,
    Ground: 1,
    Rock: 1,
    Fighting: 2,
    Psychic: 0.5,
    Ghost: 1,
    Dragon: 1,
  },
  Ghost: {
    '???': 1,
    Normal: 0,
    Grass: 1,
    Fire: 1,
    Water: 1,
    Electric: 1,
    Ice: 1,
    Flying: 1,
    Bug: 1,
    Poison: 1,
    Ground: 1,
    Rock: 1,
    Fighting: 1,
    Psychic: 0,
    Ghost: 2,
    Dragon: 1,
  },
  Dragon: {
    '???': 1,
    Normal: 1,
    Grass: 1,
    Fire: 1,
    Water: 1,
    Electric: 1,
    Ice: 1,
    Flying: 1,
    Bug: 1,
    Poison: 1,
    Ground: 1,
    Rock: 1,
    Fighting: 1,
    Psychic: 1,
    Ghost: 1,
    Dragon: 2,
  },
};

const GSC: TypeChart = extend(true, {}, RBY, {
  '???': {Dark: 1, Steel: 1},
  Normal: {Dark: 1, Steel: 0.5},
  Grass: {Dark: 1, Steel: 0.5},
  Fire: {Dark: 1, Steel: 2},
  Water: {Dark: 1, Steel: 1},
  Electric: {Dark: 1, Steel: 1},
  Ice: {Fire: 0.5, Dark: 1, Steel: 0.5},
  Flying: {Dark: 1, Steel: 0.5},
  Bug: {Poison: 0.5, Dark: 2, Steel: 0.5},
  Poison: {Bug: 1, Dark: 1, Steel: 0},
  Ground: {Dark: 1, Steel: 2},
  Rock: {Dark: 1, Steel: 0.5},
  Fighting: {Dark: 2, Steel: 2},
  Psychic: {Dark: 0, Steel: 0.5},
  Ghost: {Psychic: 2, Dark: 0.5, Steel: 0.5},
  Dragon: {Dark: 1, Steel: 0.5},
  Dark: {
    '???': 1,
    Normal: 1,
    Grass: 1,
    Fire: 1,
    Water: 1,
    Electric: 1,
    Ice: 1,
    Flying: 1,
    Bug: 1,
    Poison: 1,
    Ground: 1,
    Rock: 1,
    Fighting: 0.5,
    Psychic: 2,
    Ghost: 2,
    Dragon: 1,
    Dark: 0.5,
    Steel: 0.5,
  },
  Steel: {
    '???': 1,
    Normal: 1,
    Grass: 1,
    Fire: 0.5,
    Water: 0.5,
    Electric: 0.5,
    Ice: 2,
    Flying: 1,
    Bug: 1,
    Poison: 1,
    Ground: 1,
    Rock: 2,
    Fighting: 1,
    Psychic: 1,
    Ghost: 1,
    Dragon: 1,
    Dark: 1,
    Steel: 0.5,
  },
});

const ADV = GSC;

const DPP = GSC;

const BW = GSC;

const XY: TypeChart = extend(true, {}, GSC, {
  '???': {Fairy: 1},
  Normal: {Fairy: 1},
  Grass: {Fairy: 1},
  Fire: {Fairy: 1},
  Water: {Fairy: 1},
  Electric: {Fairy: 1},
  Ice: {Fairy: 1},
  Flying: {Fairy: 1},
  Bug: {Fairy: 0.5},
  Poison: {Fairy: 2},
  Ground: {Fairy: 1},
  Rock: {Fairy: 1},
  Fighting: {Fairy: 0.5},
  Psychic: {Fairy: 1},
  Ghost: {Steel: 1, Fairy: 1},
  Dragon: {Fairy: 0},
  Dark: {Steel: 1, Fairy: 0.5},
  Steel: {Fairy: 2},
  Fairy: {
    '???': 1,
    Normal: 1,
    Grass: 1,
    Fire: 0.5,
    Water: 1,
    Electric: 1,
    Ice: 1,
    Flying: 1,
    Bug: 1,
    Poison: 0.5,
    Ground: 1,
    Rock: 1,
    Fighting: 2,
    Psychic: 1,
    Ghost: 1,
    Dragon: 2,
    Dark: 2,
    Steel: 0.5,
    Fairy: 1,
  },
});

const SM = XY;

const SS = SM;

export const TYPE_CHART = [{}, RBY, GSC, ADV, DPP, BW, XY, SM, SS];

export class Types implements I.Types {
  private readonly gen: I.GenerationNum;

  constructor(gen: I.GenerationNum) {
    this.gen = gen;
  }

  get(id: I.ID) {
    // toID('???') => '', as do many other things, but returning the '???' type seems appropriate :)
    return TYPES_BY_ID[this.gen][id];
  }

  *[Symbol.iterator]() {
    for (const id in TYPES_BY_ID[this.gen]) {
      yield this.get(id as I.ID)!;
    }
  }
}

class Type implements I.Type {
  readonly kind: 'Type';
  readonly id: I.ID;
  readonly name: I.TypeName;
  readonly effectiveness: Readonly<{[type in I.TypeName]?: I.TypeEffectiveness}>;

  constructor(name: string, effectiveness: TypeChart[I.TypeName]) {
    this.kind = 'Type';
    this.id = toID(name);
    this.name = name as I.TypeName;
    this.effectiveness = effectiveness! as {[type in I.TypeName]?: I.TypeEffectiveness};
  }
}

const TYPES_BY_ID: Array<{[id: string]: Type}> = [];

for (const typeChart of TYPE_CHART) {
  const map: {[id: string]: Type} = {};
  for (const type in typeChart) {
    const t = new Type(type, {...typeChart[type as I.TypeName]!});
    map[t.id] = t;
  }
  TYPES_BY_ID.push(map);
}
