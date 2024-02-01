import * as I from './interface';
import {toID, extend, DeepPartial, assignWithout} from '../util';

export interface SpeciesData {
  readonly types: [I.TypeName] | [I.TypeName, I.TypeName];
  // TODO: replace with baseStats
  readonly bs: {
    hp: number;
    at: number;
    df: number;
    sa?: number;
    sd?: number;
    sp: number;
    sl?: number;
  };
  readonly weightkg: number; // weight
  readonly nfe?: boolean;
  readonly gender?: I.GenderName;
  readonly otherFormes?: string[];
  readonly baseSpecies?: string;
  readonly abilities?: {0: string}; // ability
}

const RBY: {[name: string]: SpeciesData} = {
  Zubat: {
    types: ['Poison', 'Flying'],
    bs: {hp: 40, at: 45, df: 35, sp: 55, sl: 40},
    weightkg: 7.5,
    nfe: true,
  },
};

const GSC_PATCH: {[name: string]: DeepPartial<SpeciesData>} = {
  // gen 1 pokemon changes
  Zubat: {bs: {sa: 30, sd: 40}},
  // gen 2 pokemon
  Ampharos: {
    types: ['Electric'],
    bs: {hp: 90, at: 75, df: 75, sa: 115, sd: 90, sp: 55},
    weightkg: 61.5,
  },
};
const GSC: {[name: string]: SpeciesData} = extend(true, {}, RBY, GSC_PATCH);

const ADV_PATCH: {[name: string]: DeepPartial<SpeciesData>} = {
  // gen 1 pokemon changes
  Zubat: {abilities: {0: 'Inner Focus'}},
  // gen 2 pokemon changes
  Ampharos: {abilities: {0: 'Static'}},
  // gen 3 pokemon
  Absol: {
    types: ['Dark'],
    bs: {hp: 65, at: 130, df: 60, sa: 75, sd: 60, sp: 75},
    weightkg: 47,
    abilities: {0: 'Pressure'},
  },
};

const ADV: {[name: string]: SpeciesData} = extend(true, {}, GSC, ADV_PATCH);

const DPP_PATCH: {[name: string]: DeepPartial<SpeciesData>} = {
  Giratina: {
    types: ['Ghost', 'Dragon'],
    bs: {hp: 150, at: 100, df: 120, sa: 100, sd: 120, sp: 90},
    weightkg: 750,
    gender: 'N',
    otherFormes: ['Giratina-Origin'],
    abilities: {0: 'Pressure'},
  },
  'Giratina-Origin': {
    types: ['Ghost', 'Dragon'],
    bs: {hp: 150, at: 120, df: 100, sa: 120, sd: 100, sp: 90},
    weightkg: 650,
    gender: 'N',
    abilities: {0: 'Levitate'},
    baseSpecies: 'Giratina',
  },
};

const DPP: {[name: string]: SpeciesData} = extend(true, {}, ADV, DPP_PATCH);

const BW_PATCH: {[name: string]: DeepPartial<SpeciesData>} = {
  Accelgor: {
    types: ['Bug'],
    bs: {hp: 80, at: 70, df: 40, sa: 100, sd: 60, sp: 145},
    weightkg: 25.3,
    abilities: {0: 'Hydration'},
  },
};

const BW: {[name: string]: SpeciesData} = extend(true, {}, DPP, BW_PATCH);

// @ts-ignore readonly

const XY_PATCH: {[name: string]: DeepPartial<SpeciesData>} = {
  Absol: {otherFormes: ['Absol-Mega']},
  'Absol-Mega': {
    types: ['Dark'],
    bs: {hp: 65, at: 150, df: 60, sa: 115, sd: 60, sp: 115},
    weightkg: 49,
    abilities: {0: 'Magic Bounce'},
    baseSpecies: 'Absol',
  },
};

const XY: {[name: string]: SpeciesData} = extend(true, {}, BW, XY_PATCH);

const SM_PATCH: {[name: string]: DeepPartial<SpeciesData>} = {
  Zeraora: {
    types: ['Electric'],
    bs: {hp: 88, at: 112, df: 75, sa: 102, sd: 80, sp: 143},
    weightkg: 44.5,
    abilities: {0: 'Volt Absorb'},
    gender: 'N',
  },
};

const SM: {[name: string]: SpeciesData} = extend(true, {}, XY, SM_PATCH);

const SS_PATCH: {[name: string]: DeepPartial<SpeciesData>} = {
  Applin: {
    types: ['Grass', 'Dragon'],
    bs: {hp: 40, at: 40, df: 80, sa: 40, sd: 40, sp: 20},
    weightkg: 0.5,
    abilities: {0: 'Ripen'},
    nfe: true,
  },
};

const SS: {[name: string]: SpeciesData} = extend(true, {}, SM, SS_PATCH);

const SV_PATCH: {[name: string]: DeepPartial<SpeciesData>} = {
  'Test-Mon': {
    types: ['Normal', 'Ghost'],
    bs: {hp: 60, at: 60, df: 60, sa: 60, sd: 60, sp: 60},
    weightkg: 60,
    abilities: {0: 'Normalize'},
  },
  Amphacott: {
    types: ['Electric', 'Fairy'],
    bs: {hp: 80, at: 69, df: 85, sa: 102, sd: 85, sp: 95},
    weightkg: 34,
    abilities: {0: 'Static'},
  },
  Amphawear: {
    types: ['Electric', 'Fighting'],
    bs: {hp: 100, at: 108, df: 81, sa: 95, sd: 80, sp: 58},
    weightkg: 98.2,
    abilities: {0: 'Static'},
  },
  Amphawrath: {
    types: ['Electric', 'Fighting'],
    bs: {hp: 90, at: 88, df: 91, sa: 100, sd: 90, sp: 65},
    weightkg: 57.7,
    abilities: {0: 'Static'},
  },
  Auronite: {
    types: ['Rock', 'Flying'],
    bs: {hp: 112, at: 115, df: 87, sa: 99, sd: 94, sp: 72},
    weightkg: 217.5,
    abilities: {0: 'Refigerate'},
  },
  Azumachomp: {
    types: ['Water', 'Ground'],
    bs: {hp: 102, at: 103, df: 90, sa: 66, sd: 81, sp: 84},
    weightkg: 61.7,
    abilities: {0: 'Thick Fat'},
  },
  Blastzor: {
    types: ['Water', 'Steel'],
    bs: {hp: 76, at: 114, df: 100, sa: 75, sd: 96, sp: 69},
    weightkg: 101.7,
    abilities: {0: 'Torrent'},
  },
  Blazsire: {
    types: ['Fire', 'Ground'],
    bs: {hp: 85, at: 96, df: 80, sa: 95, sd: 68, sp: 50},
    weightkg: 63.5,
    abilities: {0: 'Blaze'},
  },
  'Chandelgon-Z': {
    types: ['Ghost', 'Normal'],
    bs: {hp: 68, at: 71, df: 76, sa: 141, sd: 85, sp: 86},
    weightkg: 34.1,
    abilities: {0: 'Flash Fire'},
  },
  Chandelzor: {
    types: ['Ghost', 'Steel'],
    bs: {hp: 63, at: 105, df: 96, sa: 115, sd: 86, sp: 70},
    weightkg: 76.1,
    abilities: {0: 'Flash Fire'},
  },
  Clefthorn: {
    types: ['Fairy', 'Steel'],
    bs: {hp: 88, at: 86, df: 111, sa: 81, sd: 98, sp: 33},
    weightkg: 75,
    abilities: {0: 'Cute Charm'},
  },
  Electrmega: {
    types: ['Electric', 'Flying'],
    bs: {hp: 68, at: 67, df: 80, sa: 92, sd: 72, sp: 113},
    weightkg: 59,
    abilities: {0: 'Soundproof'},
    gender: 'N',
  },
  Empobat: {
    types: ['Water', 'Flying'],
    bs: {hp: 84, at: 88, df: 82, sa: 97, sd: 94, sp: 106},
    weightkg: 79.7,
    abilities: {0: 'Torrent'},
  },
  Genrorus: {
    types: ['Ghost', 'Ice'],
    bs: {hp: 81, at: 73, df: 68, sa: 119, sd: 80, sp: 75},
    weightkg: 132.7,
    abilities: {0: 'Cursed Body'},
  },
  Honchdrio: {
    types: ['Dark', 'Flying'],
    bs: {hp: 86, at: 115, df: 64, sa: 90, sd: 54, sp: 97},
    weightkg: 56.2,
    abilities: {0: 'Insomnia'},
  },
  Jicune: {
    types: ['Steel', 'Water'],
    bs: {hp: 100, at: 83, df: 110, sa: 96, sd: 105, sp: 90},
    weightkg: 94,
    abilities: {0: 'Serene Grace'},
    gender: 'N',
  },
  Jiniclus: {
    types: ['Steel', 'Psychic'],
    bs: {hp: 103, at: 76, df: 83, sa: 108, sd: 95, sp: 53},
    weightkg: 10.6,
    abilities: {0: 'Serene Grace'},
    gender: 'N',
  },
  Jisir: {
    types: ['Steel', 'Bug'],
    bs: {hp: 88, at: 116, df: 100, sa: 85, sd: 90, sp: 90},
    weightkg: 28,
    abilities: {0: 'Serene Grace'},
    gender: 'N',
  },
  Klinkzor: {
    types: ['Steel', 'Bug'],
    bs: {hp: 63, at: 120, df: 105, sa: 65, sd: 83, sp: 73},
    weightkg: 99.5,
    abilities: {0: 'Plus'},
    gender: 'N',
  },
  Kyusharp: {
    types: ['Dragon', 'Steel'],
    bs: {hp: 105, at: 126, df: 96, sa: 106, sd: 83, sp: 78},
    weightkg: 197.5,
    abilities: {0: 'Pressure'},
    gender: 'N',
  },
  Latioefki: {
    types: ['Dragon', 'Fairy'],
    bs: {hp: 72, at: 83, df: 87, sa: 113, sd: 102, sp: 86},
    weightkg: 31.5,
    abilities: {0: 'Levitate'},
  },
  Latiolosion: {
    types: ['Dragon', 'Fire'],
    bs: {hp: 79, at: 86, df: 78, sa: 123, sd: 101, sp: 103},
    weightkg: 69.7,
    abilities: {0: 'Levitate'},
  },
  Lickichomp: {
    types: ['Normal', 'Ground'],
    bs: {hp: 109, at: 115, df: 95, sa: 80, sd: 91, sp: 84},
    weightkg: 117.5,
    abilities: {0: 'Own Tempo'},
  },
  Lucatile: {
    types: ['Fighting', 'Grass'],
    bs: {hp: 70, at: 93, df: 66, sa: 11, sd: 75, sp: 110},
    weightkg: 53.1,
    abilities: {0: 'Steadfast'},
  },
  Magross: {
    types: ['Fire', 'Psychic'],
    bs: {hp: 66, at: 106, df: 126, sa: 91, sd: 83, sp: 56},
    weightkg: 330,
    abilities: {0: 'Magma Armor'},
  },
  'Poryvoir-Monika': {
    types: ['Normal', 'Fairy'],
    bs: {hp: 79, at: 70, df: 66, sa: 131, sd: 88, sp: 83},
    weightkg: 41.2,
    abilities: {0: 'Adaptability'},
    gender: 'N',
  },
  Necrogross: {
    types: ['Psychic', 'Steel'],
    bs: {hp: 91, at: 125, df: 120, sa: 116, sd: 89, sp: 73},
    weightkg: 390,
    abilities: {0: 'Prism Armor'},
    gender: 'N',
  },
  'Oridreigon-Sensu': {
    types: ['Ghost', 'Dragon'],
    bs: {hp: 80, at: 93, df: 83, sa: 107, sd: 76, sp: 96},
    weightkg: 81.7,
    abilities: {0: 'Dancer'},
  },
  Pikaking: {
    types: ['Electric', 'Ground'],
    bs: {hp: 50, at: 86, df: 64, sa: 61, sd: 58, sp: 86},
    weightkg: 34,
    abilities: {0: 'Static'},
  },
  Poryllery: {
    types: ['Normal', 'Water'],
    bs: {hp: 81, at: 96, df: 73, sa: 125, sd: 75, sp: 60},
    weightkg: 31.2,
    abilities: {0: 'Adaptability'},
    gender: 'N',
  },
  Rampdactyl: {
    types: ['Rock', 'Flying'],
    bs: {hp: 91, at: 125, df: 63, sa: 63, sd: 58, sp: 106},
    weightkg: 80.7,
    abilities: {0: 'Mold Breaker'},
  },
  Regiapex: {
    types: ['Steel', 'Water'],
    bs: {hp: 70, at: 67, df: 151, sa: 67, sd: 147, sp: 40},
    weightkg: 109.7,
    abilities: {0: 'Clear Body'},
    gender: 'N'
  },
  Slowcott: {
    types: ['Water', 'Fairy'],
    bs: {hp: 83, at: 69, df: 83, sa: 92, sd: 98, sp: 87},
    weightkg: 43,
    abilities: {0: 'Oblivious'},
  },
  Snorgross: {
    types: ['Normal', 'Psychic'],
    bs: {hp: 133, at: 126, df: 108, sa: 75, sd: 103, sp: 56},
    weightkg: 505,
    abilities: {0: 'Immunity'},
  },
  Snorblade: {
    types: ['Normal', 'Ghost'],
    bs: {hp: 126, at: 110, df: 121, sa: 58, sd: 89, sp: 33},
    weightkg: 232.2,
    abilities: {0: 'Immunity'},
  },
  Snorler: {
    types: ['Normal', 'Water'],
    bs: {hp: 125, at: 123, df: 98, sa: 60, sd: 90, sp: 60},
    weightkg: 260,
    abilities: {0: 'Immunity'},
  },
  Togeking: {
    types: ['Fairy', 'Ground'],
    bs: {hp: 83, at: 84, df: 83, sa: 108, sd: 101, sp: 83},
    weightkg: 50,
    abilities: {0: 'Hustle'},
  },
  Togelurk: {
    types: ['Fairy', 'Ghost'],
    bs: {hp: 86, at: 99, df: 85, sa: 98, sd: 103, sp: 63},
    weightkg: 184,
    abilities: {0: 'Hustle'},
  },
  Togemega: {
    types: ['Fairy', 'Flying'],
    bs: {hp: 85, at: 67, df: 89, sa: 118, sd: 95, sp: 90},
    weightkg: 44.7,
    abilities: {0: 'Hustle'},
  },
  Togezone: {
    types: ['Fairy', 'Steel'],
    bs: {hp: 80, at: 63, df: 108, sa: 123, sd: 106, sp: 66},
    weightkg: 109,
    abilities: {0: 'Hustle'},
  },
  Traplous: {
    types: ['Ground', 'Dragon'],
    bs: {hp: 54, at: 90, df: 61, sa: 51, sd: 53, sp: 42},
    weightkg: 32.5,
    abilities: {0: 'Hyper Cutter'},
    nfe: true,
  },
  Umbzing: {
    types: ['Dark', 'Poison'],
    bs: {hp: 85, at: 81, df: 116, sa: 68, sd: 110, sp: 61},
    weightkg: 18.2,
    abilities: {0: 'Synchronize'},
  },
  Unthorn: {
    types: ['Psychic', 'Steel'],
    bs: {hp: 56, at: 86, df: 103, sa: 66, sd: 70, sp: 29},
    weightkg: 57.5,
    abilities: {0: 'Levitate'},
    gender: 'N',
  },
  Weedily: {
    types: ['Poison', 'Grass'],
    bs: {hp: 72, at: 84, df: 104, sa: 83, sd: 82, sp: 48},
    weightkg: 34.9,
    abilities: {0: 'Levitate'},
  },
  Wigglycott: {
    types: ['Normal', 'Fairy'],
    bs: {hp: 113, at: 68, df: 71, sa: 82, sd: 58, sp: 92},
    weightkg: 9.3,
    abilities: {0: 'Cute Charm'},
  },
};

const SV: {[name: string]: SpeciesData} = extend(true, {}, SS, SV_PATCH);

delete SV['Zubat'];
delete SV['Ampharos'];
delete SV['Absol'];
delete SV['Absol-Mega'];
delete SV['Giratina'];
delete SV['Giratina-Origin'];
delete SV['Accelgor'];
delete SV['Zeraora'];
delete SV['Applin'];

export const SPECIES = [{}, RBY, GSC, ADV, DPP, BW, XY, SM, SS, SV];

export class Species implements I.Species {
  private readonly gen: I.GenerationNum;

  constructor(gen: I.GenerationNum) {
    this.gen = gen;
  }

  get(id: I.ID) {
    return SPECIES_BY_ID[this.gen][id];
  }

  *[Symbol.iterator]() {
    for (const id in SPECIES_BY_ID[this.gen]) {
      yield this.get(id as I.ID)!;
    }
  }
}

class Specie implements I.Specie {
  readonly kind: 'Species';
  readonly id: I.ID;
  readonly name: I.SpeciesName;
  readonly types!: [I.TypeName] | [I.TypeName, I.TypeName];
  readonly baseStats: Readonly<I.StatsTable>;
  readonly weightkg!: number; // weight
  readonly nfe?: boolean;
  readonly gender?: I.GenderName;
  readonly otherFormes?: I.SpeciesName[];
  readonly baseSpecies?: I.SpeciesName;
  readonly abilities?: {0: I.AbilityName}; // ability

  private static readonly EXCLUDE = new Set(['bs', 'otherFormes']);

  constructor(name: string, data: SpeciesData) {
    this.kind = 'Species';
    this.id = toID(name);
    this.name = name as I.SpeciesName;

    const baseStats: Partial<I.StatsTable> = {};
    baseStats.hp = data.bs.hp;
    baseStats.atk = data.bs.at;
    baseStats.def = data.bs.df;
    baseStats.spa = gen >= 2 ? data.bs.sa : data.bs.sl;
    baseStats.spd = gen >= 2 ? data.bs.sd : data.bs.sl;
    baseStats.spe = data.bs.sp;
    this.baseStats = baseStats as I.StatsTable;
    // Hack for getting Gmax pokemon out of existence in Gen 9+
    if (data.otherFormes) {
      this.otherFormes = data.otherFormes as I.SpeciesName[];
      if (gen >= 9 && !['toxtricity', 'urshifu'].includes(this.id)) {
        this.otherFormes = this.otherFormes.filter(f => !f.endsWith('-Gmax'));
        if (!this.otherFormes.length) this.otherFormes = undefined;
        if (this.otherFormes) this.otherFormes = [...new Set(this.otherFormes)];
      }
    }

    assignWithout(this, data, Specie.EXCLUDE);
  }
}
const SPECIES_BY_ID: Array<{[id: string]: Specie}> = [];

let gen = 0;
for (const species of SPECIES) {
  const map: {[id: string]: Specie} = {};
  for (const specie in species) {
    if (gen >= 2 && species[specie].bs.sl) delete species[specie].bs.sl;
    const m = new Specie(specie, species[specie]);
    map[m.id] = m;
  }
  SPECIES_BY_ID.push(map);
  gen++;
}
