import * as path from 'path';
import * as fs from 'fs';

import * as ps from '@pokemon-showdown/sets';
import * as calc from 'calc';
import * as tiers from './tiers.json';

const TIERS = tiers as {[gen: number]: {[id: string]: Format}};

// TODO: Migrate sets to calc.StatsTable
interface StatsTable<T = number> {
  hp?: T;
  at?: T;
  df?: T;
  sa?: T;
  sd?: T;
  sp?: T;
}

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

type Format = keyof typeof FORMATS;

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
  BH: 'balancedhackmons',
  CAP: 'cap',
  '1v1': '1v1',
};

const RECENT_ONLY: Format[] = ['Monotype', 'BH', 'CAP', '1v1'];

const GENS = ['RBY', 'GSC', 'ADV', 'DPP', 'BW', 'XY', 'SM', 'SS'];
const USAGE = ['OU', 'UU', 'RU', 'NU', 'PU', 'ZU', 'Uber', 'LC', 'Doubles'];

export async function importSets(dir: string) {
  for (let gen = 1; gen <= 8; gen++) {
    const setsByPokemon: PokemonSets = {};

    for (const pokemon of Object.keys(calc.SPECIES[gen]).sort()) {
      await importSetsForPokemon(pokemon, gen as ps.Generation, setsByPokemon);
      let sets = setsByPokemon[pokemon];
      // If we can't find any sets for Gen 8 yet, just copy the Gen 7 sets instead...
      if (!sets && gen === 8) {
        await importSetsForPokemon(pokemon, 7, setsByPokemon);
        sets = setsByPokemon[pokemon];
      }
      if (!sets) continue;

      const sorted = Object.keys(sets);
      const format = TIERS[gen][toID(pokemon)];
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

    const comment = '/* AUTOMATICALLY GENERATED FROM @pokemon-showdown/sets, DO NOT EDIT! */';
    const sets = JSON.stringify(setsByPokemon);
    const js = `${comment}\nvar SETDEX_${GENS[gen - 1]} = ${sets};`;
    fs.writeFileSync(path.resolve(dir, `sets/gen${gen}.js`), js);
  }
}

async function importSetsForPokemon(
  pokemon: string,
  gen: ps.Generation,
  setsByPokemon: PokemonSets
) {
  for (const format in FORMATS) {
    const data = await ps.forFormat(`gen${gen}${FORMATS[format]}`);
    if (!data || (gen < 7 && RECENT_ONLY.includes(format as Format))) continue;
    const forme = toForme(pokemon);
    const smogon = data['smogon.com/dex'];
    if (smogon && smogon[forme]) {
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

      const usage = data['smogon.com/stats'];
      if (usage && usage[forme]) {
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
};

function toForme(pokemon: string) {
  if (pokemon.endsWith('-Totem')) return pokemon.slice(0, -6);
  return FORMES[pokemon] || pokemon;
}

type ID = '' | (string & {__isID: true});
function toID(text: any): ID {
  return ('' + text).toLowerCase().replace(/[^a-z0-9]+/g, '') as ID;
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

function toStatsTable(stats: ps.DeepPartial<ps.StatsTable<number>>): StatsTable {
  const s: Partial<StatsTable> = {};

  let stat: keyof ps.StatsTable<number>;
  for (stat in stats) {
    const val = stats[stat];
    s[shortForm(stat)] = val;
  }

  return s;
}

function shortForm(stat: keyof ps.StatsTable<number>) {
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
