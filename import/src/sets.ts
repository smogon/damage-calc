import * as path from 'path';
import * as fs from 'fs';

import * as ps from '@smogon/sets';
import * as calc from 'calc';
import * as tiers from './tiers.json';
const toID = calc.toID;

// prettier-ignore
const TIERS = [
  'LC', 'NFE', 'UU', 'OU', 'Uber', 'NU', 'NUBL', 'UUBL', 'CAP', 'LC Uber', 'CAP LC',
  'CAP NFE', 'RU', 'RUBL', 'PU', '(PU)', 'PUBL', '(OU)', 'AG', '(Uber)', 'Illegal',
] as const;
type Tier = typeof TIERS[number];

const TO_TIER = tiers as {[gen: number]: {[id: string]: Tier}};

const STATS = ['hp', 'at', 'df', 'sa', 'sd', 'sp'] as const;
type Stat = typeof STATS[number];

// TODO: Migrate sets to calc.StatsTable
type StatsTable<T = number> = {[k in Stat]?: T};

interface PokemonSet {
  level: number;
  ability?: string;
  item?: string;
  nature?: string;
  ivs?: Partial<StatsTable>;
  evs?: Partial<StatsTable>;
  moves: string[];
}

interface PokemonSets {
  [pokemon: string]: {[name: string]: PokemonSet};
}

type RandomPokemonOptions = Exclude<PokemonSet, 'ability' | 'item'> & {
  abilities?: string[];
  items?: string[];
};

const FORMATS: {[format: string]: string} = {
  OU: 'ou',
  UU: 'uu',
  RU: 'ru',
  NU: 'nu',
  PU: 'pu',
  ZU: 'zu',
  LC: 'lc',
  Uber: 'ubers',
  AG: 'anythinggoes',
  Monotype: 'monotype',
  Doubles: 'doublesou',
  VGC18: 'vgc2018',
  'Battle Spot Singles': 'battlespotsingles',
  'Battle Spot Doubles': 'battlespotdoubles',
  'Battle Stadium Singles': 'battlestadiumsingles',
  BH: 'balancedhackmons',
  CAP: 'cap',
  '1v1': '1v1',
};

type Format = keyof typeof FORMATS;

const TO_FORMAT: {[tier in Tier]?: Format} = {
  Uber: 'Ubers',
  'CAP LC': 'CAP',
  'CAP NFE': 'CAP',
  UUBL: 'OU',
  NUBL: 'RU',
  'LC Uber': 'LC',
  RUBL: 'UU',
  PUBL: 'NU',
  '(PU)': 'ZU',
  '(OU)': 'OU',
};

const RECENT_ONLY: Format[] = ['Monotype', 'BH', 'CAP', '1v1'];

const GENS = ['RBY', 'GSC', 'ADV', 'DPP', 'BW', 'XY', 'SM', 'SS'];
const USAGE = ['OU', 'UU', 'RU', 'NU', 'PU', 'ZU', 'Uber', 'LC', 'Doubles'];

export async function importSets(dir: string) {
  for (let g = 1; g <= 8; g++) {
    const gen = g as ps.GenerationNum;
    const setsByPokemon: PokemonSets = {};

    for (const pokemon of Object.keys(calc.SPECIES[gen]).sort()) {
      await importSetsForPokemon(pokemon, gen, setsByPokemon);
      let sets = setsByPokemon[pokemon];
      // If we can't find any sets for Gen 8 yet, just copy the Gen 7 sets instead...
      if (!sets && gen === 8) {
        await importSetsForPokemon(pokemon, 7, setsByPokemon);
        sets = setsByPokemon[pokemon];
      }
      if (sets) {
        const sorted = Object.keys(sets);
        const tier = TO_TIER[gen][toID(pokemon)];
        const format = TO_FORMAT[tier] || tier;
        if (format) {
          sorted.sort((a: string, b: string) => {
            const formatA = a.split('|')[0] === format;
            const formatB = b.split('|')[0] === format;
            if (formatA === formatB) return 0;
            if (formatA) return -1;
            return formatB ? 1 : 0;
          });
        }

        setsByPokemon[pokemon] = {};
        for (const name of sorted) {
          setsByPokemon[pokemon][name.slice(name.indexOf('|') + 1)] = sets[name];
        }
      }
    }

    const comment = (from: string) => `/* AUTOMATICALLY GENERATED FROM ${from}, DO NOT EDIT! */`;
    fs.writeFileSync(path.resolve(dir, `sets/gen${gen}.js`),
      `${comment('@smogon/sets')}\n` +
      `var SETDEX_${GENS[gen - 1]} = ${JSON.stringify(setsByPokemon)};\n`);
  }
}

async function importSetsForPokemon(
  pokemon: string,
  gen: ps.GenerationNum,
  setsByPokemon: PokemonSets
) {
  for (const format in FORMATS) {
    const data = await ps.forFormat(`gen${gen}${FORMATS[format]}`);
    if (!data || (gen < 7 && RECENT_ONLY.includes(format as Format))) continue;
    const forme = toForme(pokemon);
    const smogon = data['dex'];
    if (smogon?.[forme]) {
      setsByPokemon[pokemon] = setsByPokemon[pokemon] || {};
      for (const name in smogon[forme]) {
        setsByPokemon[pokemon][`${FORMATS[format]}|${format} ${name}`] = toCalc(
          smogon[forme][name]
        );
      }
    } else {
      const eligible =
        (gen <= 3 && format === 'UU') ||
        (gen >= 2 && gen <= 4 && format === 'NU') ||
        (gen === 8 && USAGE.includes(format));

      if (!eligible) continue;

      const usage = data['stats'];
      if (usage?.[forme]) {
        setsByPokemon[pokemon] = setsByPokemon[pokemon] || {};
        for (const name in usage[forme]) {
          setsByPokemon[pokemon][`${FORMATS[format]}|${format} ${name}`] = toCalc(
            usage[forme][name]
          );
        }
      }
    }
  }
}

const FORMES: {[name: string]: string} = {
  'Aegislash-Blade': 'Aegislash',
  'Aegislash-Shield': 'Aegislash',
  'Wishiwashi-School': 'Wishiwashi',
  'Minior-Meteor': 'Minior',
  'Darmanitan-Galar-Zen': 'Darmanitan-Galar',
  'Sirfetch’d': 'Sirfetch\'d',
  'Keldeo-Resolute': 'Keldeo',
};

// TODO handle Gmax
function toForme(pokemon: string) {
  if (pokemon.endsWith('-Totem')) return pokemon.slice(0, -6);
  if (pokemon.endsWith('-Gmax')) return pokemon.slice(0, -5);
  return FORMES[pokemon] || pokemon;
}

function toCalc(set: ps.DeepPartial<ps.PokemonSet>): PokemonSet {
  return {
    level: set.level || 100,
    ability: set.ability, // TODO fixed?
    item: set.item,
    nature: set.nature,
    ivs: set.ivs && toStatsTable(set.ivs),
    evs: set.evs && toStatsTable(set.evs),
    moves: set.moves || [],
  };
}

function toStatsTable(stats: ps.DeepPartial<ps.StatsTable>): StatsTable {
  const s: Partial<StatsTable> = {};

  let stat: keyof ps.StatsTable;
  for (stat in stats) {
    const val = stats[stat];
    s[shortForm(stat)] = val;
  }

  return s;
}

function shortForm(stat: keyof ps.StatsTable) {
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
  default:
    throw new TypeError('spc unsupported');
  }
}
