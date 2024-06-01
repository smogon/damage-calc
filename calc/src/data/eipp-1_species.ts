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
  Dragonite: {
    types: ['Dragon', 'Flying'],
    bs: {hp: 91, at: 134, df: 95, sp: 80, sl: 100},
    weightkg: 210,
  },
  Gyarados: {
    types: ['Water', 'Flying'],
    bs: {hp: 95, at: 125, df: 79, sp: 81, sl: 100},
    weightkg: 235,
  },
  Mew: {
    types: ['Psychic'],
    bs: {hp: 100, at: 100, df: 100, sp: 100, sl: 100},
    weightkg: 4,
  },
  Pinsir: {types: ['Bug'], bs: {hp: 65, at: 125, df: 100, sp: 85, sl: 55}, weightkg: 55},
  Slowbro: {
    types: ['Water', 'Psychic'],
    bs: {hp: 95, at: 75, df: 110, sp: 30, sl: 80},
    weightkg: 78.5,
  },
  Snorlax: {
    types: ['Normal'],
    bs: {hp: 160, at: 110, df: 65, sp: 30, sl: 65},
    weightkg: 460,
  },
  Vaporeon: {
    types: ['Water'],
    bs: {hp: 130, at: 65, df: 60, sp: 65, sl: 110},
    weightkg: 29,
  },
  Venusaur: {
    types: ['Grass', 'Poison'],
    bs: {hp: 80, at: 82, df: 83, sp: 80, sl: 100},
    weightkg: 100,
  },
  Zapdos: {
    types: ['Electric', 'Flying'],
    bs: {hp: 90, at: 90, df: 85, sp: 100, sl: 125},
    weightkg: 52.6,
  },
};

const GSC_PATCH: {[name: string]: DeepPartial<SpeciesData>} = {
  // gen 1 pokemon changes
  Dragonite: {bs: {sa: 100, sd: 100}},
  Gyarados: {bs: {sa: 60, sd: 100}},
  Mew: {bs: {sa: 100, sd: 100}, gender: 'N'},
  Pinsir: {bs: {sa: 55, sd: 70}},
  Slowbro: {bs: {sa: 100, sd: 80}},
  Snorlax: {bs: {sa: 65, sd: 110}},
  Vaporeon: {bs: {sa: 110, sd: 95}},
  Venusaur: {bs: {sa: 100, sd: 100}},
  Zapdos: {bs: {sa: 125, sd: 90}, gender: 'N'},
  // gen 2 pokemon
  Heracross: {
    types: ['Bug', 'Fighting'],
    bs: {hp: 80, at: 125, df: 75, sa: 40, sd: 95, sp: 85},
    weightkg: 54,
  },
  Houndoom: {
    types: ['Dark', 'Fire'],
    bs: {hp: 75, at: 90, df: 50, sa: 110, sd: 80, sp: 95},
    weightkg: 35,
  },
  Octillery: {
    types: ['Water'],
    bs: {hp: 75, at: 105, df: 75, sa: 105, sd: 75, sp: 45},
    weightkg: 28.5,
  },
  Porygon2: {
    types: ['Normal'],
    bs: {hp: 85, at: 80, df: 90, sa: 105, sd: 95, sp: 60},
    weightkg: 32.5,
    gender: 'N',
  },
  Scizor: {
    types: ['Bug', 'Steel'],
    bs: {hp: 70, at: 130, df: 100, sa: 55, sd: 80, sp: 65},
    weightkg: 118,
  },
  Shuckle: {
    types: ['Bug', 'Rock'],
    bs: {hp: 20, at: 10, df: 230, sa: 10, sd: 230, sp: 5},
    weightkg: 20.5,
  },
  Togetic: {
    types: ['Normal', 'Flying'],
    bs: {hp: 55, at: 40, df: 85, sa: 80, sd: 105, sp: 40},
    weightkg: 3.2,
  },
};
const GSC: {[name: string]: SpeciesData} = extend(true, {}, RBY, GSC_PATCH);

const ADV_PATCH: {[name: string]: DeepPartial<SpeciesData>} = {
  // gen 1 pokemon changes
  Dragonite: {abilities: {0: 'Inner Focus'}},
  Gyarados: {abilities: {0: 'Intimidate'}},
  Mew: {abilities: {0: 'Synchronize'}},
  Pinsir: {abilities: {0: 'Hyper Cutter'}},
  Slowbro: {abilities: {0: 'Oblivious'}},
  Snorlax: {abilities: {0: 'Immunity'}},
  Vaporeon: {abilities: {0: 'Water Absorb'}},
  Venusaur: {abilities: {0: 'Overgrow'}},
  Zapdos: {abilities: {0: 'Pressure'}},
  // gen 2 pokemon changes
  Heracross: {abilities: {0: 'Swarm'}},
  Houndoom: {abilities: {0: 'Early Bird'}},
  Octillery: {abilities: {0: 'Suction Cups'}},
  Porygon2: {abilities: {0: 'Trace'}},
  Scizor: {abilities: {0: 'Swarm'}},
  Shuckle: {abilities: {0: 'Sturdy'}},
  Togetic: {abilities: {0: 'Hustle'}},
  // gen 3 pokemon
  Altaria: {
    types: ['Dragon', 'Flying'],
    bs: {hp: 75, at: 70, df: 90, sa: 70, sd: 105, sp: 80},
    weightkg: 20.6,
    abilities: {0: 'Natural Cure'},
  },
  Armaldo: {
    types: ['Rock', 'Bug'],
    bs: {hp: 75, at: 125, df: 100, sa: 70, sd: 80, sp: 45},
    weightkg: 68.2,
    abilities: {0: 'Battle Armor'},
  },
  Banette: {
    types: ['Ghost'],
    bs: {hp: 64, at: 115, df: 65, sa: 83, sd: 63, sp: 65},
    weightkg: 12.5,
    abilities: {0: 'Insomnia'},
  },
  Blaziken: {
    types: ['Fire', 'Fighting'],
    bs: {hp: 80, at: 120, df: 70, sa: 110, sd: 70, sp: 80},
    weightkg: 52,
    abilities: {0: 'Blaze'},
  },
  'Deoxys-Defense': {
    types: ['Psychic'],
    bs: {hp: 50, at: 70, df: 160, sa: 70, sd: 160, sp: 90},
    weightkg: 60.8,
    abilities: {0: 'Pressure'},
    gender: 'N',
  },
  Gardevoir: {
    types: ['Psychic'],
    bs: {hp: 68, at: 65, df: 65, sa: 125, sd: 115, sp: 80},
    weightkg: 48.4,
    abilities: {0: 'Synchronize'},
  },
  Glalie: {
    types: ['Ice'],
    bs: {hp: 80, at: 80, df: 80, sa: 80, sd: 80, sp: 80},
    weightkg: 256.5,
    abilities: {0: 'Inner Focus'},
  },
  Jirachi: {
    types: ['Steel', 'Psychic'],
    bs: {hp: 100, at: 100, df: 100, sa: 100, sd: 100, sp: 100},
    weightkg: 1.1,
    abilities: {0: 'Serene Grace'},
    gender: 'N',
  },
  Mawile: {
    types: ['Steel'],
    bs: {hp: 50, at: 85, df: 85, sa: 55, sd: 55, sp: 50},
    weightkg: 11.5,
    abilities: {0: 'Hyper Cutter'},
  },
  Metagross: {
    types: ['Steel', 'Psychic'],
    bs: {hp: 80, at: 135, df: 130, sa: 95, sd: 90, sp: 70},
    weightkg: 550,
    gender: 'N',
    abilities: {0: 'Clear Body'},
  },
  Sableye: {
    types: ['Dark', 'Ghost'],
    bs: {hp: 50, at: 75, df: 75, sa: 65, sd: 65, sp: 50},
    weightkg: 11,
    abilities: {0: 'Keen Eye'},
  },
  Sceptile: {
    types: ['Grass'],
    bs: {hp: 70, at: 85, df: 65, sa: 105, sd: 85, sp: 120},
    weightkg: 52.2,
    abilities: {0: 'Overgrow'},
  },
};

const ADV: {[name: string]: SpeciesData} = extend(true, {}, GSC, ADV_PATCH);

const DPP_PATCH: {[name: string]: DeepPartial<SpeciesData>} = {

  Porygon2: {nfe: true},
  Togetic: {nfe: true},
  Cresselia: {
    types: ['Psychic'],
    bs: {hp: 120, at: 70, df: 120, sa: 75, sd: 130, sp: 85},
    weightkg: 85.6,
    abilities: {0: 'Levitate'},
  },
  Heatran: {
    types: ['Fire', 'Steel'],
    bs: {hp: 91, at: 90, df: 106, sa: 130, sd: 106, sp: 77},
    weightkg: 430,
    abilities: {0: 'Flash Fire'},
  },
  Lucario: {
    types: ['Fighting', 'Steel'],
    bs: {hp: 70, at: 110, df: 70, sa: 115, sd: 70, sp: 90},
    weightkg: 54,
    abilities: {0: 'Steadfast'},
  },
  Manaphy: {
    types: ['Water'],
    bs: {hp: 100, at: 100, df: 100, sa: 100, sd: 100, sp: 100},
    weightkg: 1.4,
    abilities: {0: 'Hydration'},
    gender: 'N',
  },
  'Rotom-Wash': {
    types: ['Electric', 'Ghost'],
    bs: {hp: 50, at: 65, df: 107, sa: 105, sd: 107, sp: 86},
    weightkg: 0.3,
    abilities: {0: 'Levitate'},
    gender: 'N',
  },
  Vespiquen: {
    types: ['Bug', 'Flying'],
    bs: {hp: 70, at: 80, df: 102, sa: 80, sd: 102, sp: 40},
    weightkg: 38.5,
    abilities: {0: 'Pressure'},
  },
};

const DPP: {[name: string]: SpeciesData} = extend(true, {}, ADV, DPP_PATCH);

const BW_PATCH: {[name: string]: DeepPartial<SpeciesData>} = {
  'Rotom-Wash': {types: ['Electric', 'Water']},
  Chandelure: {
    types: ['Ghost', 'Fire'],
    bs: {hp: 60, at: 55, df: 90, sa: 145, sd: 90, sp: 80},
    weightkg: 34.3,
    abilities: {0: 'Flash Fire'},
  },
  Cofagrigus: {
    types: ['Ghost'],
    bs: {hp: 58, at: 50, df: 145, sa: 95, sd: 105, sp: 30},
    weightkg: 76.5,
    abilities: {0: 'Mummy'},
  },
  Landorus: {
    types: ['Ground', 'Flying'],
    bs: {hp: 89, at: 125, df: 90, sa: 115, sd: 80, sp: 101},
    weightkg: 68,
    abilities: {0: 'Sand Force'},
  },
  Scolipede: {
    types: ['Bug', 'Poison'],
    bs: {hp: 60, at: 90, df: 89, sa: 55, sd: 69, sp: 112},
    weightkg: 200.5,
    abilities: {0: 'Poison Point'},
  },
  Thundurus: {
    types: ['Electric', 'Flying'],
    bs: {hp: 79, at: 115, df: 70, sa: 125, sd: 80, sp: 111},
    weightkg: 61,
    abilities: {0: 'Prankster'},
  },
  'Tornadus-Therian': {
    types: ['Flying'],
    bs: {hp: 79, at: 100, df: 80, sa: 110, sd: 90, sp: 121},
    weightkg: 63,
    abilities: {0: 'Regenerator'},
  },
  Victini: {
    types: ['Psychic', 'Fire'],
    bs: {hp: 100, at: 100, df: 100, sa: 100, sd: 100, sp: 100},
    weightkg: 4,
    abilities: {0: 'Victory Star'},
    gender: 'N',
  },
  Volcarona: {
    types: ['Bug', 'Fire'],
    bs: {hp: 85, at: 60, df: 65, sa: 135, sd: 105, sp: 100},
    weightkg: 46,
    abilities: {0: 'Flame Body'},
  },
};

const BW: {[name: string]: SpeciesData} = extend(true, {}, DPP, BW_PATCH);

// @ts-ignore readonly

const XY_PATCH: {[name: string]: DeepPartial<SpeciesData>} = {
  Altaria: {otherFormes: ['Altaria-Mega']},
  Banette: {otherFormes: ['Banette-Mega']},
  Blaziken: {otherFormes: ['Blaziken-Mega']},
  Gardevoir: {types: ['Psychic', 'Fairy'], otherFormes: ['Gardevoir-Mega']},
  Glalie: {otherFormes: ['Glalie-Mega']},
  Houndoom: {otherFormes: ['Houndoom-Mega']},
  Lucario: {otherFormes: ['Lucario-Mega']},
  Mawile: {types: ['Steel', 'Fairy'], otherFormes: ['Mawile-Mega']},
  Pinsir: {otherFormes: ['Pinsir-Mega']},
  Sceptile: {otherFormes: ['Sceptile-Mega']},
  Scolipede: {bs: {at: 100}},
  Slowbro: {otherFormes: ['Slowbro-Mega']},
  Togetic: {types: ['Fairy', 'Flying']},
  Venusaur: {otherFormes: ['Venusaur-Mega']},
  Avalugg: {
    types: ['Ice'],
    bs: {hp: 95, at: 117, df: 184, sa: 44, sd: 46, sp: 28},
    weightkg: 505,
    abilities: {0: 'Own Tempo'},
  },
  Dragalge: {
    types: ['Poison', 'Dragon'],
    bs: {hp: 65, at: 75, df: 90, sa: 97, sd: 123, sp: 44},
    weightkg: 81.5,
    abilities: {0: 'Poison Point'},
  },
  'Altaria-Mega': {
    types: ['Dragon', 'Fairy'],
    bs: {hp: 75, at: 110, df: 110, sa: 110, sd: 105, sp: 80},
    weightkg: 20.6,
    abilities: {0: 'Pixilate'},
    baseSpecies: 'Altaria',
  },
  'Banette-Mega': {
    types: ['Ghost'],
    bs: {hp: 64, at: 165, df: 75, sa: 93, sd: 83, sp: 75},
    weightkg: 13,
    abilities: {0: 'Prankster'},
    baseSpecies: 'Banette',
  },
  'Blaziken-Mega': {
    types: ['Fire', 'Fighting'],
    bs: {hp: 80, at: 160, df: 80, sa: 130, sd: 80, sp: 100},
    weightkg: 52,
    abilities: {0: 'Speed Boost'},
    baseSpecies: 'Blaziken',
  },
  'Gardevoir-Mega': {
    types: ['Psychic', 'Fairy'],
    bs: {hp: 68, at: 85, df: 65, sa: 165, sd: 135, sp: 100},
    weightkg: 48.4,
    abilities: {0: 'Pixilate'},
    baseSpecies: 'Gardevoir',
  },
  'Glalie-Mega': {
    types: ['Ice'],
    bs: {hp: 80, at: 120, df: 80, sa: 120, sd: 80, sp: 100},
    weightkg: 350.2,
    abilities: {0: 'Refrigerate'},
    baseSpecies: 'Glalie',
  },
  'Houndoom-Mega': {
    types: ['Dark', 'Fire'],
    bs: {hp: 75, at: 90, df: 90, sa: 140, sd: 90, sp: 115},
    weightkg: 49.5,
    abilities: {0: 'Solar Power'},
    baseSpecies: 'Houndoom',
  },
  'Lucario-Mega': {
    types: ['Fighting', 'Steel'],
    bs: {hp: 70, at: 145, df: 88, sa: 140, sd: 70, sp: 112},
    weightkg: 57.5,
    abilities: {0: 'Adaptability'},
    baseSpecies: 'Lucario',
  },
  'Mawile-Mega': {
    types: ['Steel', 'Fairy'],
    bs: {hp: 50, at: 105, df: 125, sa: 55, sd: 95, sp: 50},
    weightkg: 23.5,
    abilities: {0: 'Huge Power'},
    baseSpecies: 'Mawile',
  },
  'Pinsir-Mega': {
    types: ['Bug', 'Flying'],
    bs: {hp: 65, at: 155, df: 120, sa: 65, sd: 90, sp: 105},
    weightkg: 59,
    abilities: {0: 'Aerilate'},
    baseSpecies: 'Pinsir',
  },
  'Sceptile-Mega': {
    types: ['Grass', 'Dragon'],
    bs: {hp: 70, at: 110, df: 75, sa: 145, sd: 85, sp: 145},
    weightkg: 55.2,
    abilities: {0: 'Lightning Rod'},
    baseSpecies: 'Sceptile',
  },
  'Slowbro-Mega': {
    types: ['Water', 'Psychic'],
    bs: {hp: 95, at: 75, df: 180, sa: 130, sd: 80, sp: 30},
    weightkg: 120,
    abilities: {0: 'Shell Armor'},
    baseSpecies: 'Slowbro',
  },
  'Venusaur-Mega': {
    types: ['Grass', 'Poison'],
    bs: {hp: 80, at: 100, df: 123, sa: 122, sd: 120, sp: 80},
    weightkg: 155.5,
    abilities: {0: 'Thick Fat'},
    baseSpecies: 'Venusaur',
  },
  Sylveon: {
    types: ['Fairy'],
    bs: {hp: 95, at: 65, df: 65, sa: 110, sd: 130, sp: 60},
    weightkg: 23.5,
    abilities: {0: 'Cute Charm'},
  },
};

const XY: {[name: string]: SpeciesData} = extend(true, {}, BW, XY_PATCH);

const SM_PATCH: {[name: string]: DeepPartial<SpeciesData>} = {
  Comfey: {
    types: ['Fairy'],
    bs: {hp: 51, at: 52, df: 90, sa: 82, sd: 110, sp: 100},
    weightkg: 0.3,
    abilities: {0: 'Flower Veil'},
  },
  Golisopod: {
    types: ['Bug', 'Water'],
    bs: {hp: 75, at: 125, df: 140, sa: 60, sd: 90, sp: 40},
    weightkg: 108,
    abilities: {0: 'Emergency Exit'},
  },
  Necrozma: {
    types: ['Psychic'],
    bs: {hp: 97, at: 107, df: 101, sa: 127, sd: 89, sp: 79},
    weightkg: 230,
    abilities: {0: 'Prism Armor'},
    gender: 'N',
  },
  Nihilego: {
    types: ['Rock', 'Poison'],
    bs: {hp: 109, at: 53, df: 47, sa: 127, sd: 131, sp: 103},
    weightkg: 55.5,
    abilities: {0: 'Beast Boost'},
    gender: 'N',
  },
  Oranguru: {
    types: ['Normal', 'Psychic'],
    bs: {hp: 90, at: 60, df: 80, sa: 90, sd: 110, sp: 60},
    weightkg: 76,
    abilities: {0: 'Inner Focus'},
  },
  'Tapu Fini': {
    types: ['Water', 'Fairy'],
    bs: {hp: 70, at: 75, df: 115, sa: 95, sd: 130, sp: 85},
    weightkg: 21.2,
    abilities: {0: 'Misty Surge'},
    gender: 'N',
  },
  Turtonator: {
    types: ['Fire', 'Dragon'],
    bs: {hp: 60, at: 78, df: 135, sa: 91, sd: 85, sp: 36},
    weightkg: 212,
    abilities: {0: 'Shell Armor'},
  },
  'Type: Null': {
    types: ['Normal'],
    bs: {hp: 95, at: 95, df: 95, sa: 95, sd: 95, sp: 59},
    weightkg: 120.5,
    abilities: {0: 'Battle Armor'},
    nfe: true,
    gender: 'N',
  },
  'Zygarde-10%': {
    types: ['Dragon', 'Ground'],
    bs: {hp: 54, at: 100, df: 71, sa: 61, sd: 85, sp: 115},
    weightkg: 33.5,
    abilities: {0: 'Aura Break'},
    baseSpecies: 'Zygarde',
    gender: 'N',
  },
};

const SM: {[name: string]: SpeciesData} = extend(true, {}, XY, SM_PATCH);

const SS_PATCH: {[name: string]: DeepPartial<SpeciesData>} = {
  Slowbro: {otherFormes: ['Slowbro-Galar', 'Slowbro-Mega']},
  Alcremie: {
    types: ['Fairy'],
    bs: {hp: 65, at: 60, df: 75, sa: 110, sd: 121, sp: 64},
    weightkg: 0.5,
    abilities: {0: 'Sweet Veil'},
    otherFormes: ['Alcremie-Gmax'],
  },
  Corviknight: {
    types: ['Flying', 'Steel'],
    bs: {hp: 98, at: 87, df: 105, sa: 53, sd: 85, sp: 67},
    weightkg: 75,
    abilities: {0: 'Pressure'},
  },
  Dragapult: {
    types: ['Dragon', 'Ghost'],
    bs: {hp: 88, at: 120, df: 75, sa: 100, sd: 75, sp: 142},
    weightkg: 50,
    abilities: {0: 'Clear Body'},
  },
  Inteleon: {
    types: ['Water'],
    bs: {hp: 70, at: 85, df: 65, sa: 125, sd: 65, sp: 120},
    weightkg: 45.2,
    abilities: {0: 'Torrent'},
  },
  Regidrago: {
    types: ['Dragon'],
    bs: {hp: 200, at: 100, df: 50, sa: 100, sd: 50, sp: 80},
    weightkg: 200,
    abilities: {0: 'Dragon\'s Maw'},
    gender: 'N',
  },
  'Slowbro-Galar': {
    types: ['Poison', 'Psychic'],
    bs: {hp: 95, at: 100, df: 95, sa: 100, sd: 70, sp: 30},
    weightkg: 70.5,
    abilities: {0: 'Quick Draw'},
    baseSpecies: 'Slowbro',
  },
};

const SS: {[name: string]: SpeciesData} = extend(true, {}, SM, SS_PATCH);

const PLA_PATCH: {[name: string]: DeepPartial<SpeciesData>} = {
  'Enamorus-Therian': {
    types: ['Fairy', 'Flying'],
    bs: {hp: 74, at: 115, df: 110, sa: 135, sd: 100, sp: 46},
    weightkg: 48,
    abilities: {0: 'Overcoat'},
  },
  'Goodra-Hisui': {
    types: ['Steel', 'Dragon'],
    bs: {hp: 80, at: 100, df: 100, sa: 110, sd: 150, sp: 60},
    weightkg: 334.1,
    abilities: {0: 'Sap Sipper'},
  },
};

const SV_PATCH: {[name: string]: DeepPartial<SpeciesData>} = {
  Cresselia: {bs: {df: 110, sd: 120}},
  Archaludon: {
    types: ['Steel', 'Dragon'],
    bs: {hp: 90, at: 105, df: 130, sa: 125, sd: 65, sp: 85},
    weightkg: 60,
    abilities: {0: 'Stamina'},
  },
  'Chi-Yu': {
    types: ['Dark', 'Fire'],
    bs: {hp: 55, at: 80, df: 80, sa: 135, sd: 120, sp: 100},
    weightkg: 4.9,
    gender: 'N',
    abilities: {0: 'Beads of Ruin'},
  },
  Gholdengo: {
    types: ['Steel', 'Ghost'],
    bs: {hp: 87, at: 60, df: 95, sa: 133, sd: 91, sp: 84},
    weightkg: 30,
    gender: 'N',
    abilities: {0: 'Good as Gold'},
  },
  'Gouging Fire': {
    types: ['Fire', 'Dragon'],
    bs: {hp: 105, at: 115, df: 121, sa: 65, sd: 93, sp: 91},
    weightkg: 590,
    gender: 'N',
    abilities: {0: 'Protosynthesis'},
  },
  'Sinistcha': {
    types: ['Grass', 'Ghost'],
    bs: {hp: 71, at: 60, df: 106, sa: 121, sd: 80, sp: 70},
    weightkg: 2.2,
    abilities: {0: 'Hospitality'},
    gender: 'N',
  },
  'Ursaluna-Bloodmoon': {
    types: ['Ground', 'Normal'],
    bs: {hp: 113, at: 70, df: 120, sa: 135, sd: 65, sp: 52},
    weightkg: 333,
    abilities: {0: 'Mind\'s Eye'},
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
