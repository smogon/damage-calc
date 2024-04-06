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
  Clefable: {
  	types: ['Fairy'],
  	bs: {hp: 95, at: 70, df: 73, sp: 60, sl: 85},
  	weightkg: 40
  },
  Dragonite: {
    types: ['Flying', 'Normal'],
    bs: {hp: 91, at: 134, df: 95, sp: 80, sl: 100},
    weightkg: 210,
  },
  Gyarados: {
    types: ['Ghost', 'Normal'],
    bs: {hp: 95, at: 125, df: 79, sp: 81, sl: 100},
    weightkg: 235,
  },
  Primeape: {
    types: ['Water'],
    bs: {hp: 65, at: 105, df: 60, sp: 95, sl: 60},
    weightkg: 32,
  },
  Scyther: {
    types: ['Poison', 'Normal'],
    bs: {hp: 70, at: 110, df: 80, sp: 105, sl: 55},
    weightkg: 56,
  },
};

const GSC_PATCH: {[name: string]: DeepPartial<SpeciesData>} = {
  // gen 1 pokemon changes
  Clefable: {bs: {sa: 85, sd: 90}},
  Dragonite: {bs: {sa: 100, sd: 100}},
  Gyarados: {bs: {sa: 60, sd: 100}},
  Primeape: {bs: {sa: 60, sd: 70}},
  Scyther: {bs: {sa: 55, sd: 80}, nfe: true},
  // gen 2 pokemon
  Blissey: {
    types: ['Fairy'],
    bs: {hp: 255, at: 10, df: 10, sa: 75, sd: 135, sp: 55},
    weightkg: 46.8,
  },
  Celebi: {
    types: ['Grass', 'Fighting'],
    bs: {hp: 100, at: 100, df: 100, sa: 100, sd: 100, sp: 100},
    weightkg: 5,
    gender: 'N',
  },
  Heracross: {
    types: ['Poison', 'Water'],
    bs: {hp: 80, at: 125, df: 75, sa: 40, sd: 95, sp: 85},
    weightkg: 54,
  },
  Suicune: {
    types: ['Ghost'],
    bs: {hp: 100, at: 75, df: 115, sa: 90, sd: 115, sp: 85},
    weightkg: 187,
    gender: 'N',
  },
  Ursaring: {
    types: ['Fairy'],
    bs: {hp: 90, at: 130, df: 75, sa: 75, sd: 75, sp: 55},
    weightkg: 125.8,
  },
};
const GSC: {[name: string]: SpeciesData} = extend(true, {}, RBY, GSC_PATCH);

const ADV_PATCH: {[name: string]: DeepPartial<SpeciesData>} = {
  // gen 1 pokemon changes
  Clefable: {abilities: {0: 'Cute Charm'}},
  Dragonite: {abilities: {0: 'Inner Focus'}},
  Gyarados: {abilities: {0: 'Intimidate'}},
  Primeape: {abilities: {0: 'Vital Spirit'}},
  Scyther: {abilities: {0: 'Swarm'}},
  // gen 2 pokemon changes
  Blissey: {abilities: {0: 'Natural Cure'}},
  Celebi: {abilities: {0: 'Natural Cure'}},
  Heracross: {abilities: {0: 'Swarm'}},
  Suicune: {abilities: {0: 'Pressure'}},
  Ursaring: {abilities: {0: 'Guts'}},
  // gen 3 pokemon
  Blaziken: {
    types: ['Ground', 'Water'],
    bs: {hp: 80, at: 120, df: 70, sa: 110, sd: 70, sp: 80},
    weightkg: 52,
    abilities: {0: 'Blaze'},
  },
  'Deoxys-Defense': {
    types: ['Grass'],
    bs: {hp: 50, at: 70, df: 160, sa: 70, sd: 160, sp: 90},
    weightkg: 60.8,
    abilities: {0: 'Pressure'},
    gender: 'N',
  },
  Exploud: {
    types: ['Fairy'],
    bs: {hp: 104, at: 91, df: 63, sa: 91, sd: 63, sp: 68},
    weightkg: 84,
    abilities: {0: 'Soundproof'},
  },
  Mightyena: {
    types: ['Dragon'],
    bs: {hp: 70, at: 90, df: 70, sa: 60, sd: 60, sp: 70},
    weightkg: 37,
    abilities: {0: 'Intimidate'},
  },
  Pelipper: {
    types: ['Ghost', 'Normal'],
    bs: {hp: 60, at: 50, df: 100, sa: 85, sd: 70, sp: 65},
    weightkg: 28,
    abilities: {0: 'Keen Eye'},
  },
  Regice: {
    types: ['Electric'],
    bs: {hp: 80, at: 50, df: 100, sa: 100, sd: 200, sp: 50},
    weightkg: 175,
    gender: 'N',
    abilities: {0: 'Clear Body'},
  },
  Sableye: {
    types: ['Dragon', 'Steel'],
    bs: {hp: 50, at: 75, df: 75, sa: 65, sd: 65, sp: 50},
    weightkg: 11,
    abilities: {0: 'Keen Eye'},
  },
  Swalot: {
    types: ['Psychic'],
    bs: {hp: 100, at: 73, df: 83, sa: 73, sd: 83, sp: 55},
    weightkg: 80,
    abilities: {0: 'Liquid Ooze'},
  },
};

const ADV: {[name: string]: SpeciesData} = extend(true, {}, GSC, ADV_PATCH);

const DPP_PATCH: {[name: string]: DeepPartial<SpeciesData>} = {
  Ambipom: {
    types: ['Fairy'],
    bs: {hp: 75, at: 100, df: 66, sa: 60, sd: 66, sp: 115},
    weightkg: 20.3,
    abilities: {0: 'Technician'},
  },
  Glaceon: {
    types: ['Electric'],
    bs: {hp: 65, at: 60, df: 110, sa: 130, sd: 95, sp: 65},
    weightkg: 25.9,
    abilities: {0: 'Snow Cloak'},
  },
  'Porygon-Z': {
    types: ['Fairy'],
    bs: {hp: 85, at: 80, df: 70, sa: 135, sd: 75, sp: 90},
    weightkg: 34,
    gender: 'N',
    abilities: {0: 'Adaptability'},
  },
  Regigigas: {
    types: ['Fairy'],
    bs: {hp: 110, at: 160, df: 110, sa: 80, sd: 110, sp: 100},
    weightkg: 420,
    abilities: {0: 'Slow Start'},
    gender: 'N',
  },
  Spiritomb: {
    types: ['Steel', 'Dragon'],
    bs: {hp: 50, at: 92, df: 108, sa: 92, sd: 108, sp: 35},
    weightkg: 108,
    abilities: {0: 'Pressure'},
  },
};

const DPP: {[name: string]: SpeciesData} = extend(true, {}, ADV, DPP_PATCH);

const BW_PATCH: {[name: string]: DeepPartial<SpeciesData>} = {
  Braviary: {
    types: ['Fairy', 'Normal'],
    bs: {hp: 100, at: 123, df: 75, sa: 57, sd: 75, sp: 80},
    weightkg: 41,
    abilities: {0: 'Keen Eye'},
  },
  Cofagrigus: {
    types: ['Steel'],
    bs: {hp: 58, at: 50, df: 145, sa: 95, sd: 105, sp: 30},
    weightkg: 76.5,
    abilities: {0: 'Mummy'},
  },
  Jellicent: {
    types: ['Ghost', 'Steel'],
    bs: {hp: 100, at: 60, df: 70, sa: 85, sd: 105, sp: 60},
    weightkg: 135,
    abilities: {0: 'Water Absorb'},
  },
  Klinklang: {
    types: ['Rock'],
    bs: {hp: 60, at: 100, df: 115, sa: 70, sd: 85, sp: 90},
    weightkg: 81,
    gender: 'N',
    abilities: {0: 'Plus'},
  },
  Kyurem: {
    types: ['Flying', 'Electric'],
    bs: {hp: 125, at: 130, df: 90, sa: 130, sd: 90, sp: 95},
    weightkg: 325,
    abilities: {0: 'Pressure'},
    gender: 'N',
  },
  Meloetta: {
    types: ['Fairy', 'Grass'],
    bs: {hp: 100, at: 77, df: 77, sa: 128, sd: 128, sp: 90},
    weightkg: 6.5,
    abilities: {0: 'Serene Grace'},
    otherFormes: ['Meloetta-Pirouette'],
    gender: 'N',
  },
  'Meloetta-Pirouette': {
    types: ['Fairy', 'Water'],
    bs: {hp: 100, at: 128, df: 90, sa: 77, sd: 77, sp: 128},
    weightkg: 6.5,
    abilities: {0: 'Serene Grace'},
    baseSpecies: 'Meloetta',
    gender: 'N',
  },
  Mienshao: {
    types: ['Water'],
    bs: {hp: 65, at: 125, df: 60, sa: 95, sd: 60, sp: 105},
    weightkg: 35.5,
    abilities: {0: 'Inner Focus'},
  },
  Musharna: {
    types: ['Grass'],
    bs: {hp: 116, at: 55, df: 85, sa: 107, sd: 95, sp: 29},
    weightkg: 60.5,
    abilities: {0: 'Forewarn'},
  },
  Scolipede: {
    types: ['Poison', 'Psychic'],
    bs: {hp: 60, at: 90, df: 89, sa: 55, sd: 69, sp: 112},
    weightkg: 200.5,
    abilities: {0: 'Poison Point'},
  },
  Whimsicott: {
    types: ['Fighting'],
    bs: {hp: 60, at: 67, df: 85, sa: 77, sd: 75, sp: 116},
    weightkg: 6.6,
    abilities: {0: 'Prankster'},
  },
};

const BW: {[name: string]: SpeciesData} = extend(true, {}, DPP, BW_PATCH);

// @ts-ignore readonly

const XY_PATCH: {[name: string]: DeepPartial<SpeciesData>} = {
  Clefable: {types: ['Fire'], bs: {sa: 95}},
  Exploud: {bs: {sd: 73}},
  Scolipede: {bs: {at: 100}},
  Whimsicott: {types: ['Fighting', 'Fire']},
  Aurorus: {
    types: ['Ice', 'Electric'],
    bs: {hp: 123, at: 77, df: 72, sa: 99, sd: 92, sp: 58},
    weightkg: 225,
    abilities: {0: 'Refrigerate'},
  },
  Sylveon: {
    types: ['Fire'],
    bs: {hp: 95, at: 65, df: 65, sa: 110, sd: 130, sp: 60},
    weightkg: 23.5,
    abilities: {0: 'Cute Charm'},
  },
};

const XY: {[name: string]: SpeciesData} = extend(true, {}, BW, XY_PATCH);

const SM_PATCH: {[name: string]: DeepPartial<SpeciesData>} = {
 Pelipper: {bs: {sa: 95}},
  Bewear: {
    types: ['Fairy', 'Water'],
    bs: {hp: 120, at: 125, df: 80, sa: 55, sd: 60, sp: 60},
    abilities: {0: 'Fluffy'},
    weightkg: 135,
  },
  Marshadow: {
    types: ['Water', 'Steel'],
    bs: {hp: 90, at: 125, df: 80, sa: 90, sd: 90, sp: 125},
    weightkg: 22.2,
    gender: 'N',
    abilities: {0: 'Technician'},
  },
  Melmetal: {
    types: ['Rock'],
    bs: {hp: 135, at: 143, df: 143, sa: 80, sd: 65, sp: 34},
    weightkg: 800,
    gender: 'N',
    abilities: {0: 'Iron Fist'},
  },
  'Raticate-Alola': {
    types: ['Dragon', 'Fairy'],
    bs: {hp: 75, at: 71, df: 70, sa: 40, sd: 80, sp: 77},
    weightkg: 25.5,
    abilities: {0: 'Gluttony'},
  },
  Silvally: {
    types: ['Fairy'],
    bs: {hp: 95, at: 95, df: 95, sa: 95, sd: 95, sp: 95},
    weightkg: 100.5,
    abilities: {0: 'RKS System'},
    gender: 'N',
  },
  Stakataka: {
    types: ['Ice', 'Rock'],
    bs: {hp: 61, at: 131, df: 211, sa: 53, sd: 101, sp: 13},
    weightkg: 820,
    abilities: {0: 'Beast Boost'},
    gender: 'N',
  },
  'Tapu Koko': {
    types: ['Dark', 'Fire'],
    bs: {hp: 70, at: 115, df: 85, sa: 95, sd: 75, sp: 130},
    weightkg: 20.5,
    abilities: {0: 'Electric Surge'},
    gender: 'N',
  },
  'Tapu Lele': {
    types: ['Grass', 'Fire'],
    bs: {hp: 70, at: 85, df: 75, sa: 130, sd: 115, sp: 95},
    weightkg: 18.6,
    abilities: {0: 'Psychic Surge'},
    gender: 'N',
  },
  Toucannon: {
    types: ['Fairy', 'Normal'],
    bs: {hp: 80, at: 120, df: 75, sa: 75, sd: 75, sp: 60},
    weightkg: 26,
    abilities: {0: 'Keen Eye'},
  },
  Turtonator: {
    types: ['Ground', 'Flying'],
    bs: {hp: 60, at: 78, df: 135, sa: 91, sd: 85, sp: 36},
    weightkg: 212,
    abilities: {0: 'Shell Armor'},
  },
  Vikavolt: {
    types: ['Poison', 'Dark'],
    bs: {hp: 77, at: 70, df: 90, sa: 145, sd: 75, sp: 43},
    weightkg: 45,
    abilities: {0: 'Levitate'},
  },
};

const SM: {[name: string]: SpeciesData} = extend(true, {}, XY, SM_PATCH);

const SS_PATCH: {[name: string]: DeepPartial<SpeciesData>} = {
  Dragapult: {
    types: ['Flying', 'Steel'],
    bs: {hp: 88, at: 120, df: 75, sa: 100, sd: 75, sp: 142},
    weightkg: 50,
    abilities: {0: 'Clear Body'},
  },
  Greedent: {
    types: ['Fairy'],
    bs: {hp: 120, at: 95, df: 95, sa: 55, sd: 75, sp: 20},
    weightkg: 6,
    abilities: {0: 'Cheek Pouch'},
  },
  'Mr. Rime': {
    types: ['Electric', 'Grass'],
    bs: {hp: 80, at: 85, df: 75, sa: 110, sd: 100, sp: 70},
    weightkg: 58.2,
    abilities: {0: 'Tangled Feet'},
  },
  'Urshifu-Rapid-Strike': {
    types: ['Water', 'Ghost'],
    bs: {hp: 100, at: 130, df: 100, sa: 63, sd: 60, sp: 97},
    weightkg: 105,
    abilities: {0: 'Unseen Fist'},
  },
  'Zapdos-Galar': {
    types: ['Water', 'Normal'],
    bs: {hp: 90, at: 125, df: 90, sa: 85, sd: 90, sp: 100},
    weightkg: 58.2,
    abilities: {0: 'Defiant'},
    gender: 'N',
  },
};

const SS: {[name: string]: SpeciesData} = extend(true, {}, SM, SS_PATCH);

const PLA_PATCH: {[name: string]: DeepPartial<SpeciesData>} = {
  Ursaring: {nfe: true},
  'Arcanine-Hisui': {
    types: ['Ground', 'Ice'],
    bs: {hp: 95, at: 115, df: 80, sa: 95, sd: 80, sp: 90},
    weightkg: 168,
    abilities: {0: 'Intimidate'},
  },
  Basculegion: {
    types: ['Ghost', 'Steel'],
    bs: {hp: 120, at: 112, df: 65, sa: 80, sd: 75, sp: 78},
    weightkg: 110,
    abilities: {0: 'Swift Swim'},
  },
  Kleavor: {
    types: ['Poison', 'Ice'],
    bs: {hp: 70, at: 135, df: 95, sa: 45, sd: 70, sp: 85},
    weightkg: 89,
    abilities: {0: 'Swarm'},
  },
  'Typhlosion-Hisui': {
    types: ['Ground', 'Steel'],
    bs: {hp: 73, at: 84, df: 78, sa: 119, sd: 85, sp: 95},
    weightkg: 69.8,
    abilities: {0: 'Blaze'},
  },
  'Zoroark-Hisui': {
    types: ['Fairy', 'Steel'],
    bs: {hp: 55, at: 100, df: 60, sa: 125, sd: 60, sp: 110},
    weightkg: 73,
    abilities: {0: 'Illusion'},
  },
};

const SV_PATCH: {[name: string]: DeepPartial<SpeciesData>} = {
  Annihilape: {
    types: ['Water', 'Steel'],
    bs: {hp: 110, at: 115, df: 80, sa: 50, sd: 90, sp: 90},
    weightkg: 56,
    abilities: {0: 'Vital Spirit'},
  },
  Baxcalibur: {
    types: ['Flying', 'Electric'],
    bs: {hp: 115, at: 145, df: 92, sa: 75, sd: 86, sp: 87},
    weightkg: 210,
    abilities: {0: 'Thermal Exchange'},
  },
  Ceruledge: {
    types: ['Ground', 'Steel'],
    bs: {hp: 75, at: 125, df: 80, sa: 60, sd: 100, sp: 85},
    weightkg: 62,
    abilities: {0: 'Flash Fire'},
  },
  Cyclizar: {
    types: ['Flying', 'Fairy'],
    bs: {hp: 70, at: 95, df: 65, sa: 85, sd: 65, sp: 121},
    weightkg: 63,
    abilities: {0: 'Shed Skin'},
  },
  'Flutter Mane': {
    types: ['Steel', 'Fire'],
    bs: {hp: 55, at: 55, df: 55, sa: 135, sd: 135, sp: 135},
    weightkg: 4,
    gender: 'N',
    abilities: {0: 'Protosynthesis'},
  },
  'Gouging Fire': {
    types: ['Ground', 'Flying'],
    bs: {hp: 105, at: 115, df: 121, sa: 65, sd: 93, sp: 91},
    weightkg: 590,
    gender: 'N',
    abilities: {0: 'Protosynthesis'},
  },
  'Great Tusk': {
    types: ['Bug', 'Water'],
    bs: {hp: 115, at: 131, df: 131, sa: 53, sd: 53, sp: 87},
    weightkg: 320,
    gender: 'N',
    abilities: {0: 'Protosynthesis'},
  },
  'Iron Hands': {
    types: ['Water', 'Dark'],
    bs: {hp: 154, at: 140, df: 108, sa: 50, sd: 68, sp: 50},
    weightkg: 380.7,
    gender: 'N',
    abilities: {0: 'Quark Drive'},
  },
  'Iron Valiant': {
    types: ['Fire', 'Water'],
    bs: {hp: 74, at: 130, df: 90, sa: 120, sd: 60, sp: 116},
    weightkg: 35,
    gender: 'N',
    abilities: {0: 'Quark Drive'},
  },
  'Ogerpon-Wellspring': {
    types: ['Fighting', 'Ghost'],
    bs: {hp: 80, at: 120, df: 84, sa: 60, sd: 96, sp: 110},
    abilities: {0: 'Water Absorb'},
    weightkg: 39.8,
  },
  'Scream Tail': {
    types: ['Fire', 'Grass'],
    bs: {hp: 115, at: 65, df: 99, sa: 65, sd: 115, sp: 111},
    weightkg: 8,
    gender: 'N',
    abilities: {0: 'Protosynthesis'},
  },
  Skeledirge: {
    types: ['Ground', 'Steel'],
    bs: {hp: 104, at: 75, df: 100, sa: 110, sd: 75, sp: 66},
    weightkg: 326.5,
    abilities: {0: 'Blaze'},
  },
  'Slither Wing': {
    types: ['Poison', 'Water'],
    bs: {hp: 85, at: 135, df: 79, sa: 85, sd: 105, sp: 81},
    weightkg: 92,
    gender: 'N',
    abilities: {0: 'Protosynthesis'},
  },
};

const SV: {[name: string]: SpeciesData} = extend(true, {}, SS, SV_PATCH, PLA_PATCH);

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
