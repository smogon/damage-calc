import * as path from 'path';
import * as fs from 'fs';

import * as ps from '@pokemon-showdown/sets';
import * as calc from 'calc';
import * as tiers from './tiers.json';

const TIERS = tiers as {[gen: number]: {[id: string]: Format}};

// TODO: Migrate sets to calc.StatsTable
interface StatsTable<T> {
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
  ivs?: Partial<StatsTable<number>>;
  evs?: Partial<StatsTable<number>>;
  moves: string[];
}

interface PokemonSets {
  [pokemon: string]: { [name: string]: PokemonSet };
}

type Format = keyof typeof FORMATS;

const FORMATS: { [format: string]: string } = {
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
  'VGC18': 'vgc2018',
  'Battle Spot Singles': 'battlespotsingles',
  'Battle Spot Doubles': 'battlespotdoubles',
  BH: 'balancedhackmons',
  CAP: 'cap',
  '1v1': '1v1',
};

const CURRENT_ONLY: Format[] = ['Monotype', 'BH', 'CAP', '1v1'];

const GENS = ['RBY', 'GSC', 'ADV', 'DPP', 'BW', 'XY', 'SM'];
const USAGE = ['OU', 'UU', 'RU', 'NU', 'PU', 'ZU', 'Uber', 'LC', 'Doubles'];

export async function importAll(dir: string) {
  for (let gen = 1; gen <= 7; gen++) {
    const setsByPokemon: PokemonSets = {};

    for (const pokemon of Object.keys(calc.SPECIES[gen]).sort()) {
      for (const format in FORMATS) {
        const data = await ps.forFormat(`gen${gen}${FORMATS[format]}`);
        if (!data || !data.sets || (gen < 7 && CURRENT_ONLY.includes(format as Format))) continue;
        const smogon = data.sets['smogon.com/dex'];
        if (smogon && smogon[pokemon]) {
          setsByPokemon[pokemon] = setsByPokemon[pokemon] || {};
          for (const name in smogon[pokemon]) {
            setsByPokemon[pokemon][`${FORMATS[format]}|${format} ${name}`] = toCalc(smogon[pokemon][name]);
          }
        } else {
          const eligible =
            (gen <= 3 && format === 'UU') ||
            (gen >= 2 && gen <= 4 && format === 'NU') ||
            (gen === 7 && USAGE.includes(format));

          if (!eligible) continue;

          const usage = data.sets['smogon.com/stats'];
          if (usage && usage[pokemon]) {
            setsByPokemon[pokemon] = setsByPokemon[pokemon] || {};
            for (const name in usage[pokemon]) {
              setsByPokemon[pokemon][`${FORMATS[format]}|${format} ${name}`] = toCalc(usage[pokemon][name]);
            }
          }
        }
      }

      const sets = setsByPokemon[pokemon];
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

    const comment = '/* AUTOMATICALLY GENERATED, DO NOT EDIT! */';
    const sets = JSON.stringify(setsByPokemon, null, 2); // FIXME
    const js = `${comment}\nvar SETDEX_${GENS[gen - 1]} = ${sets};`;
    fs.writeFileSync(path.resolve(dir, `sets/gen${gen}.js`), js);
  }
}

type ID = '' | string & { __isID: true };
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

function toStatsTable(stats: ps.DeepPartial<ps.StatsTable<number>>): StatsTable<number> {
  const s: Partial<StatsTable<number>> = {};

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
