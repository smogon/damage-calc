import * as path from 'path';
import * as fs from 'fs';
import * as util from 'util';

import * as calc from 'calc';
import * as smogon from 'smogon';

import * as missing from './missing.json';

import { Response } from 'node-fetch';
const fetch = require('node-fetch');
const JSON5 = require('json5');

const MISSING = missing as { [id: string]: string };

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
  moves?: string[];
}

interface PokemonSets {
  [pokemon: string]: { [name: string]: PokemonSet };
}

interface Weights {
  pokemon: { [id: string]: number };
  abilities: { [id: string]: number };
  items: { [id: string]: number };
  moves: { [id: string]: number };
}

type Format =
  | 'Ubers'
  | 'OU'
  | 'UU'
  | 'RU'
  | 'NU'
  | 'PU'
  | 'LC'
  | 'Doubles'
  | '1v1'
  | 'ZU'
  | 'CAP'
  | 'BSS'
  | 'BSD'
  | 'LGPE OU'
  | 'AG'
  | 'BH'
  | 'Monotype'
  | 'Random'
  | 'VGC 11'
  | 'VGC 12'
  | 'VGC 14'
  | 'VGC 15'
  | 'VGC 16'
  | 'VGC 17'
  | 'VGC 18'
  | 'VGC 19';

const FORMATS: { [id: string]: Format } = {
  uber: 'Ubers',
  ubers: 'Ubers',
  ou: 'OU',
  overused: 'OU',
  oublitz: 'OU',
  uu: 'UU',
  underused: 'UU',
  ru: 'RU',
  rarelyused: 'RU',
  nu: 'NU',
  neverused: 'NU',
  pu: 'PU',
  lc: 'LC',
  littlecup: 'LC',
  doubles: 'Doubles',
  doublesou: 'Doubles',
  vgc11: 'VGC 11',
  vgc2011: 'VGC 11',
  vgc12: 'VGC 12',
  vgc2012: 'VGC 12',
  vgc14: 'VGC 14',
  vgc2014: 'VGC 14',
  vgc15: 'VGC 15',
  vgc2015: 'VGC 15',
  vgc16: 'VGC 16',
  vgc2016: 'VGC 16',
  vgc17: 'VGC 17',
  vgc2017: 'VGC 17',
  vgc18: 'VGC 18',
  vgc2018: 'VGC 18',
  vgc19: 'VGC 19',
  vgc2019: 'VGC 19',
  vgc19ultraseries: 'VGC 19',
  '1v1': '1v1',
  zu: 'ZU',
  cap: 'CAP',
  bss: 'BSS',
  battlespotsingles: 'BSS',
  bsd: 'BSD',
  battlespotdoubles: 'BSD',
  ag: 'AG',
  anythinggoes: 'AG',
  bh: 'BH',
  balancedhackmons: 'BH',
  lgpeou: 'LGPE OU',
  lgpe: 'LGPE OU',
  monotype: 'Monotype',
  randombattle: 'Random',
};

const PS: { [format: string]: string } = {
  Ubers: 'ubers',
  OU: 'ou',
  UU: 'uu',
  RU: 'ru',
  NU: 'nu',
  PU: 'pu',
  LC: 'lc',
  Doubles: 'doublesou',
  '1v1': '1v1',
  ZU: 'zu',
  CAP: 'cap',
  BSS: 'battlespotsingles',
  BSD: 'battlespotdoubles',
  'LGPE OU': 'letsgoou',
  AG: 'anythinggoes',
  BH: 'balancedhackmons',
  Monotype: 'monotype',
  Random: 'randombattle',
  'VGC 11': 'vgc2011',
  'VGC 12': 'vgc2012',
  'VGC 14': 'vgc2014',
  'VGC 15': 'vgc2015',
  'VGC 16': 'vgc2016',
  'VGC 17': 'vgc2017',
  'VGC 18': 'vgc2018',
  'VGC 19': 'vgc2019ultraseries',
};

const ABILITIES_BY_ID: Array<{ [id: string]: string }> = [];
for (const abilities of calc.ABILITIES) {
  const map: { [id: string]: string } = {};
  for (const a of abilities) {
    map[toID(a)] = a;
  }
  ABILITIES_BY_ID.push(map);
}

const ITEMS_BY_ID: Array<{ [id: string]: string }> = [];
for (const items of calc.ITEMS) {
  const map: { [id: string]: string } = {};
  for (const i of items) {
    map[toID(i)] = i;
  }
  ITEMS_BY_ID.push(map);
}

const MOVES_BY_ID: Array<{ [id: string]: string }> = [];
for (const moves of calc.MOVES) {
  const map: { [id: string]: string } = {};
  for (const m of Object.keys(moves)) {
    map[toID(m)] = m;
  }
  MOVES_BY_ID.push(map);
}

const MEGAS: { [mega: string]: string } = {};
for (const item in calc.MEGA_STONES) {
  const species = calc.MEGA_STONES[item];
  if (item.endsWith('ite X') || item.endsWith('ite Y')) {
    MEGAS[`${species}-Mega-${item.charAt(item.length - 1)}`] = item;
  } else {
    MEGAS[`${species}-Mega`] = item;
  }
}

const Formats = new (class {
  fromString(s: string) {
    let format: Format | undefined;
    let gen: calc.Generation | undefined;
    if (s) {
      // BUG: this will break in ~10 years when gen10 gets released...
      if (s.slice(0, 3) === 'gen') {
        gen = Number(s[3]) as calc.Generation;
        format = FORMATS[toID(s.slice(4))];
      } else {
        format = FORMATS[toID(s)];
      }
    }
    if (!gen && format && format.startsWith('VGC')) {
      switch (format) {
        case 'VGC 11':
        case 'VGC 12':
          gen = 5;
          break;
        case 'VGC 14':
        case 'VGC 15':
        case 'VGC 16':
          gen = 6;
          break;
        default:
          gen = 7;
      }
    }
    return { format, gen };
  }
})();

type ID = '' | string & { __isID: true };
function toID(text: any): ID {
  return ('' + text).toLowerCase().replace(/[^a-z0-9]+/g, '') as ID;
}

export async function importAll(dir: string, legacy?: boolean) {
  const date = smogon.Statistics.latest(await request(smogon.Statistics.URL));

  const imports = [];
  for (let gen = 1; gen <= 7; gen++) {
    imports.push(importGen(gen as calc.Generation, date, dir, legacy));
  }

  return Promise.all(imports);
}

async function importGen(gen: calc.Generation, date: string, dir: string, legacy?: boolean) {
  const setsByFormat: { [format: string]: PokemonSets } = {};
  const numByFormat: { [format: string]: number } = {};
  const imports = [];
  for (const pokemon in calc.SPECIES[gen]) {
    imports.push(importSets(pokemon, gen, setsByFormat, numByFormat));
  }
  await Promise.all(imports);

  const statisticsByFormat = new Map<Format, smogon.UsageStatistics | null>();
  const formats = new Set([
    ...Object.keys(numByFormat),
    ...Object.keys(OLD_STATISTICS).map(f => Formats.fromString(f).format!),
  ]) as Set<Format>;
  for (const format of formats) {
    if (!statisticsByFormat.has(format)) {
      const url = getStatisticsURL(date, gen, format);
      const response = await fetch(url);
      if (response.status === 200) {
        statisticsByFormat.set(format, smogon.Statistics.parse(await response.text()));
      } else {
        error(`${url} = ${response.status}`);
      }
    }

    if (numByFormat[format]) {
      const source = `smogon.com/dex/${smogon.Analyses.gen(gen)}`;
      report(gen, format as Format, numByFormat[format], source);
    }
  }

  for (const [format, statistics] of statisticsByFormat.entries()) {
    if (!statistics) continue;
    addUsageBasedSets(gen, format, statistics, setsByFormat);
  }

  if (!legacy) await addThirdPartySets(gen, setsByFormat);

  const weightsByFormat = getWeightsByFormat(statisticsByFormat);
  const sets = legacy
    ? JSON.stringify(toLegacy(gen, setsByFormat))
    : JSON.stringify(setsByFormat, null, 2);
  fs.writeFileSync(path.resolve(dir, `sets/gen${gen}.json`), sets);
  const weights = JSON.stringify(weightsByFormat, null, 2);
  fs.writeFileSync(path.resolve(dir, `weights/gen${gen}.json`), weights);
}

const LEGACY: { [format: string]: string } = {
  OU: 'OU',
  UU: 'UU',
  RU: 'RU',
  NU: 'NU',
  PU: 'PU',
  ZU: 'ZU',
  LC: 'LC',
  Ubers: 'Uber',
  AG: 'AG',
  Monotype: 'Monotype',
  Doubles: 'Doubles',
  'VGC 18': 'VGC18',
  BSS: 'Battle Spot Singles',
  BSD: 'Battle Spot Doubles',
  BH: 'BH',
  CAP: 'CAP',
  '1v1': '1v1',
};

const CURRENT_ONLY: Format[] = ['Monotype', 'BH', 'CAP', '1v1'];

function toLegacy(gen: calc.Generation, setsByFormat: { [format: string]: PokemonSets }) {
  const legacy: PokemonSets = {};

  for (const format in LEGACY) {
    const sets = setsByFormat[format];
    if (!sets || (gen < 7 && CURRENT_ONLY.includes(format as Format))) continue;
    for (const pokemon in sets) {
      legacy[pokemon] = legacy[pokemon] || {};
      for (const name in sets[pokemon]) {
        legacy[pokemon][`${LEGACY[format]} ${name}`] = sets[pokemon][name];
      }
    }
  }

  return legacy;
}

async function importSets(
  pokemon: string,
  gen: calc.Generation,
  setsByFormat: { [format: string]: PokemonSets },
  numByFormat: { [format: string]: number }
) {
  const analysesByFormat = await getAnalysesByFormat(pokemon, gen);
  if (!analysesByFormat) return;

  for (const [f, analyses] of analysesByFormat.entries()) {
    const { format } = Formats.fromString(f);
    if (!format) continue;

    let setsForPokemon = setsByFormat[format];
    if (!setsForPokemon) {
      setsForPokemon = {};
      setsByFormat[format] = setsForPokemon;
    }
    let sets = setsForPokemon[pokemon];
    if (!sets) {
      sets = {};
      setsForPokemon[pokemon] = sets;
    }

    for (const analysis of analyses) {
      for (const moveset of analysis.movesets) {
        const set = toPokemonSet(format, pokemon, moveset);
        if (validPokemonSet(gen, format, set)) {
          if (filter(format, pokemon, set)) continue;
          sets[cleanName(moveset.name)] = set;
          numByFormat[format] = (numByFormat[format] || 0) + 1;
        } else {
          invalid(gen, format, pokemon, moveset.name, set);
        }
      }
    }
  }
}

const SMOGON_ALIASES: { [id: string]: string } = {
  darmanitanz: 'Darmanitan-Zen',
  meloettap: 'Meloetta-Pirouette',
  aegislashshield: 'Aegislash',
  pumpkabooaverage: 'Pumpkaboo',
};

async function getAnalysesByFormat(pokemon: string, gen: calc.Generation) {
  const id = toID(pokemon);
  if (id.endsWith('totem')) return undefined;

  pokemon = SMOGON_ALIASES[id] || pokemon;
  const url = smogon.Analyses.url(pokemon, gen);

  const retries = 3;
  const wait = 40;
  const retry = async (attempt = 0): Promise<Map<string, smogon.Analysis[]> | undefined> => {
    try {
      return smogon.Analyses.process(await request(url));
    } catch (err) {
      attempt++;
      if (attempt > retries) throw err;
      const timeout = Math.round(attempt * wait * (1 + Math.random() / 2));
      warn(`Retrying ${url} in ${timeout}ms (${attempt}):`, err);
      return new Promise(resolve => {
        setTimeout(async () => {
          resolve(await retry(attempt++));
        }, timeout);
      });
    }
  };

  const analysesByFormat = retry();
  if (!analysesByFormat) {
    error(`Unable to process analysis: ${url}`);
    return undefined;
  }

  return analysesByFormat;
}

function cleanName(name: string) {
  return name.replace(/"/g, `'`);
}

function filter(format: Format, pokemon: string, set: PokemonSet) {
  const hasMove = (m: string) => set.moves && set.moves.includes(m);
  if (format === 'BH') return false;
  if (MEGAS[pokemon] && MEGAS[pokemon] !== set.item) return true;
  if (pokemon === 'Groudon-Primal' && set.item !== 'Red Orb') return true;
  if (pokemon === 'Kyogre-Primal' && set.item !== 'Blue Orb') return true;
  if (pokemon === 'Necrozma-Ultra' && set.item !== 'Ultranecrozium Z') return true;
  if (pokemon === 'Greninja-Ash' && set.ability !== 'Battle Bond') return true;
  if (pokemon === 'Zygarde-Complete' && set.ability !== 'Power Construct') return true;
  if (pokemon === 'Darmanitan-Z' && set.ability !== 'Zen Mode') return true;
  if (pokemon === 'Meloetta-P' && !hasMove('Relic Song')) return true;
  return pokemon === 'Rayquaza-Mega' && (format === 'Ubers' || !hasMove('Dragon Ascent'));
}

const THIRD_PARTY_SOURCES: {
  [site: string]: { url: string; files: { [format: string]: string } };
} = {
  'damagecalc.trainertower.com': {
    url: 'https://raw.githubusercontent.com/jake-white/VGC-Damage-Calculator/gh-pages/script_res/',
    files: {
      gen6battlespotsingles: 'setdex_globalLink.js',
      gen6vgc2016: 'setdex_nuggetBridge.js',
      gen7vgc2017: 'setdex_tt2017.js',
      gen7vgc2018: 'setdex_tt2018.js',
      gen7vgc2019ultraseries: 'setdex_tt2019.js',
    },
  },
  'cantsay.github.io': {
    url: 'https://raw.githubusercontent.com/cantsay/cantsay.github.io/master/_scripts/',
    files: {
      gen7lgpeou: 'setdex_LG_sets.js',
      gen7bssfactory: 'setdex_factory_sets.js',
      gen5battlespotsingles: 'setdex_gen5_sets.js',
      gen6battlespotsingles: 'setdex_gen6_sets.js',
      gen7battlespotsingles: 'setdex_gen6_sets.js',
    },
  },
  'randbatscalc.github.io': {
    url: 'https://raw.githubusercontent.com/RandbatsCalc/randbatscalc.github.io/master/_scripts/',
    files: {
      gen7randombattle: 'setdex_gen7_sets.js',
    },
  },
};

const THIRD_PARTY_ALIASES: { [id: string]: string } = {
  aegislash: 'Aegislash-Blade',
  castformrainy: 'Castform',
  castformsnowy: 'Castform',
  castformsunny: 'Castform',
  deoxysa: 'Deoxys-Attack',
  deoxysd: 'Deoxys-Defense',
  deoxyss: 'Deoxys-Speed',
  floettee: 'Floette-Eternal',
  giratinao: 'Giratina-Origin',
  gourgeistaverage: 'Gourgeist',
  kyuremb: 'Kyurem-Black',
  kyuremw: 'Kyurem-White',
  landorust: 'Landorus-Therian',
  lycanrocday: 'Lycanroc',
  lycanrocnight: 'Lycanroc-Midnight',
  meloettapirouette: 'Meloetta-P',
  meowstic: 'Meowstic-M',
  oricorioelectric: 'Oricorio-Pom-Pom',
  oricoriofire: 'Oricorio',
  oricorioghost: 'Oricorio-Sensu',
  oricoriopsychic: "Oricorio-Pa'u",
  pumpkabooaverage: 'Pumpkaboo',
  rotomc: 'Rotom-Mow',
  rotomf: 'Rotom-Frost',
  rotomh: 'Rotom-Heat',
  rotoms: 'Rotom-Fan',
  rotomw: 'Rotom-Wash',
  shaymins: 'Shaymin-Sky',
  thundurust: 'Thundurus-Therian',
  tornadust: 'Tornadus-Therian',
  wishiwashisolo: 'Wishiwashi',
  wormadamg: 'Wormadam-Sandy',
  wormadams: 'Wormadam-Trash',
};

async function addThirdPartySets(
  gen: calc.Generation,
  setsByFormat: { [format: string]: PokemonSets }
) {
  for (const site in THIRD_PARTY_SOURCES) {
    const source = THIRD_PARTY_SOURCES[site];
    for (const f in source.files) {
      const { format, gen: g } = Formats.fromString(f);
      if (!format || gen !== g) continue;
      const file = source.files[f];
      const raw = await request(`${source.url}${file}`);
      const match = raw.match(/var.*?=.*?({.*})/s);
      if (!match) {
        error(`Could not find sets: ${site}/${file}`);
        continue;
      }
      const json = JSON5.parse(match[1]) as PokemonSets;
      let sets = setsByFormat[format];
      if (!sets) {
        sets = {};
        setsByFormat[format] = sets;
      }
      let num = 0;
      for (let pokemon in json) {
        pokemon = THIRD_PARTY_ALIASES[toID(pokemon)] || pokemon;
        if (!calc.SPECIES[gen][pokemon]) {
          error(`Pokemon ${pokemon} does not exist in generation ${gen}`);
          continue;
        }
        sets[pokemon] = sets[pokemon] || {};
        for (const name in json[pokemon]) {
          const set = fixThirdParty(format, pokemon, json[pokemon][name]);
          if (validPokemonSet(gen, format, set)) {
            if (filter(format, pokemon, set)) continue;
            sets[pokemon][cleanName(name)] = set;
            num++;
          } else {
            invalid(gen, format, pokemon, name, set);
          }
        }
      }
      report(gen, format, num, `${site}/${file}`);
    }
  }
}

function fixThirdParty(format: Format, pokemon: string, set: PokemonSet) {
  set.ability = fixedAbility(format, pokemon) || set.ability;
  if (set.ivs) {
    let iv: keyof StatsTable<number>;
    for (iv in set.ivs) {
      set.ivs[iv] = Number(set.ivs[iv]);
    }
  }
  if (set.evs) {
    let ev: keyof StatsTable<number>;
    for (ev in set.evs) {
      set.evs[ev] = Number(set.evs[ev]);
    }
  }
  return set;
}

const OLD_STATISTICS: { [key: string]: string } = {
  gen1uu: 'http://www.smogon.com/stats/2017-12/chaos/gen1uu-1500.json',
  gen2uu: 'http://www.smogon.com/stats/2016-08/chaos/gen2uu-1500.json',
  gen2nu: 'http://www.smogon.com/stats/2018-11/chaos/gen2nu-1500.json',
  gen3uu: 'http://www.smogon.com/stats/2016-11/chaos/gen3uu-1500.json',
  gen3nu: 'http://www.smogon.com/stats/2016-09/chaos/gen3nu-1500.json',
  gen4nu: 'http://www.smogon.com/stats/2016-10/chaos/gen4nu-1500.json',
};

function getStatisticsURL(date: string, gen: calc.Generation, format: Format) {
  const f = `gen${gen}${PS[format]}`;
  return OLD_STATISTICS[f] || smogon.Statistics.url(date, f);
}

function validPokemonSet(gen: calc.Generation, format: Format, set: PokemonSet) {
  const empty = (s: string | undefined) => s === undefined || s === '';
  if (typeof set.level !== 'number' || set.level < 1 || set.level > 100) {
    return false;
  }
  const a = set.ability;
  if (!empty(a) && (ABILITIES_BY_ID[gen][toID(a)] || MISSING[toID(a)]) !== a) {
    return false;
  }
  const i = set.item;
  if (!empty(i) && (ITEMS_BY_ID[gen][toID(i)] || MISSING[toID(i)]) !== i) {
    return false;
  }
  if (Array.isArray(set.moves)) {
    for (const move of set.moves) {
      if (!empty(move) && (MOVES_BY_ID[gen][toID(move)] || MISSING[toID(move)]) !== move) {
        return false;
      }
    }
  } else if (format !== 'Random') {
    return false;
  }
  if (!empty(set.nature) && !calc.NATURES[set.nature!]) {
    return false;
  }
  if (set.ivs) {
    let iv: keyof StatsTable<number>;
    for (iv in set.ivs) {
      if (!SHORT_STATS.includes(iv)) return false;
      if (typeof set.ivs[iv] !== 'number' || set.ivs[iv]! < 0 || set.ivs[iv]! > 31) return false;
    }
  }
  if (set.evs) {
    let ev: keyof StatsTable<number>;
    for (ev in set.evs) {
      if (!SHORT_STATS.includes(ev)) return false;
      if (typeof set.evs[ev] !== 'number' || set.evs[ev]! < 0 || set.evs[ev]! > 255) return false;
    }
  }
  return true;
}

function toPokemonSet(format: Format, pokemon: string, set: smogon.Moveset) {
  return {
    level: set.level || defaultLevel(format),
    moves: set.moveslots.map(ms => ms[0]),
    ability: fixedAbility(format, pokemon) || set.abilities[0],
    item: set.items[0] === 'No Item' ? '' : set.items[0],
    nature: set.natures[0],
    ivs: toStatsTable(set.ivconfigs[0], 31),
    evs: toStatsTable(set.evconfigs[0]),
  };
}

function defaultLevel(format: Format) {
  if (format === 'LC') return 5;
  if (format === 'BSS' || format === 'BSD' || format.startsWith('VGC')) return 50;
  return 100;
}

function fixedAbility(format: Format, pokemon: string) {
  if (format === 'BH') return undefined;
  if (pokemon === 'Groudon-Primal') return 'Desolate Land';
  if (pokemon === 'Kyogre-Primal') return 'Primordial Sea';
  if (pokemon === 'Rayquaza-Mega') return 'Delta Stream';
  if (pokemon === 'Necrozma-Ultra') return 'Neuroforce';
  return MEGAS[pokemon] && calc.SPECIES[7][pokemon].ab;
}

function toStatsTable(stats?: smogon.StatsTable<number>, elide = 0) {
  if (!stats) return undefined;

  const s: Partial<StatsTable<number>> = {};
  let stat: keyof smogon.StatsTable<number>;
  for (stat in stats) {
    const val = stats[stat];
    if (val !== elide) s[shortForm(stat)] = val;
  }
  return s;
}

function shortForm(stat: calc.Stat) {
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
      throw new TypeError('spc unsupported');
  }
}

function addUsageBasedSets(
  gen: calc.Generation,
  format: Format,
  statistics: smogon.UsageStatistics,
  setsByFormat: { [format: string]: PokemonSets }
) {
  const tiers = ['OU', 'UU', 'RU', 'NU', 'PU', 'ZU', 'Ubers', 'LC', 'Doubles'];
  const eligible =
    (gen <= 3 && format === 'UU') ||
    (gen >= 2 && gen <= 4 && format === 'NU') ||
    (gen === 7 && tiers.includes(format));

  if (!eligible) return;

  let sets = setsByFormat[format];
  if (!sets) {
    sets = {};
    setsByFormat[format] = sets;
  }

  const threshold = format === 'Ubers' || format === 'Doubles' ? 0.03 : 0.01;
  let num = 0;
  for (const pokemon in statistics.data) {
    const stats = statistics.data[pokemon];
    if (stats.usage >= threshold && !sets[pokemon]) {
      const set: PokemonSet = {
        level: defaultLevel(format),
        moves: (top(stats.Moves, 4) as string[]).map(m => MOVES_BY_ID[gen][m] || MISSING[m] || ''),
      };
      if (gen >= 2) {
        const id = top(stats.Items) as string;
        set.item = ITEMS_BY_ID[gen][id] || MISSING[id] || '';
      }
      if (gen >= 3) {
        const id = top(stats.Abilities) as string;
        set.ability =
          fixedAbility(format, pokemon) || ABILITIES_BY_ID[gen][id] || MISSING[id] || '';
        const { nature, evs } = fromSpread(top(stats.Spreads) as string);
        set.nature = nature;
        set.evs = evs;
      }
      // NOTE: we shouldn't really need to check validity or filter here
      if (validPokemonSet(gen, format, set)) {
        if (filter(format, pokemon, set)) continue;
        sets[pokemon] = { 'Showdown Usage': set };
        num++;
      } else {
        invalid(gen, format, pokemon, 'Showdown Usage', set);
      }
    }
  }
  report(gen, format, num, `smogon.com/stats/gen${gen}${PS[format]}`);
}

const STATS: calc.Stat[] = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
const SHORT_STATS: Array<keyof StatsTable<number>> = ['hp', 'at', 'df', 'sa', 'sd', 'sp'];

function fromSpread(spread: string) {
  const [nature, revs] = spread.split(':');
  const evs: Partial<StatsTable<number>> = {};
  for (const [i, rev] of revs.split('/').entries()) {
    const ev = Number(rev);
    if (ev) evs[shortForm(STATS[i])] = ev;
  }
  return { nature, evs };
}

function top(weighted: { [key: string]: number }, n = 1): string | string[] | undefined {
  if (n === 0) return undefined;
  // Optimize the common case with an linear algorithm instead of log-linear
  if (n === 1) {
    let max = undefined;
    for (const key in weighted) {
      if (!max || weighted[max] < weighted[key]) max = key;
    }
    return max;
  }
  return Object.entries(weighted)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(x => x[0]);
}

function getWeightsByFormat(statisticsByFormat: Map<Format, smogon.UsageStatistics | null>) {
  const weightsByFormat: { [format: string]: Weights } = {};
  for (const [format, statistics] of statisticsByFormat.entries()) {
    if (!statistics) continue;
    const pokemon: { [name: string]: number } = {};
    const abilities: { [name: string]: number } = {};
    const items: { [name: string]: number } = {};
    const moves: { [name: string]: number } = {};

    for (const species in statistics.data) {
      const stats = statistics.data[species];
      pokemon[species] = stats.usage;
      updateWeights(abilities, stats.Abilities, stats.usage);
      updateWeights(items, stats.Items, stats.usage);
      updateWeights(moves, stats.Moves, stats.usage, 4);
    }

    const transform = (obj: { [name: string]: number }) => {
      const sorted = Object.entries(obj).sort(([, a], [, b]) => b - a);
      const o: { [id: string]: number } = {};
      for (const [i, [k, v]] of sorted.entries()) {
        o[toID(k)] = i + 1;
      }
      return o;
    };

    weightsByFormat[format] = {
      pokemon: transform(pokemon),
      abilities: transform(abilities),
      items: transform(items),
      moves: transform(moves),
    };
  }
  return weightsByFormat;
}

function updateWeights(
  existing: { [name: string]: number },
  weights: { [name: string]: number },
  usage: number,
  factor = 1
) {
  const totalWeight = Object.values(weights).reduce((acc, v) => acc + v);
  for (const name in weights) {
    const weight = (weights[name] / totalWeight) * factor * usage;
    existing[name] = (existing[name] || 0) + weight;
  }
}

const request = ((limit: number, interval: number, retries: number, wait: number) => {
  const queue = new Map();
  let currentTick = 0;
  let activeCount = 0;

  const retry = async (url: string, attempt = 0): Promise<Response> => {
    try {
      const res = await fetch(url);
      if (res.status >= 500 && res.status < 600 && attempt < retries) {
        throw new Error(res.statusText);
      } else {
        return res;
      }
    } catch (err) {
      attempt++;
      if (attempt > retries) throw err;
      const timeout = Math.round(attempt * wait * (1 + Math.random() / 2));
      warn(`Retrying ${url} in ${timeout}ms (${attempt}):`, err);
      return new Promise(resolve => {
        setTimeout(async () => {
          resolve(await retry(url, attempt++));
        }, timeout);
      });
    }
  };

  const throttled = (url: string) => {
    let timeout: NodeJS.Timeout;
    return new Promise<string>((resolve, reject) => {
      const execute = async () => {
        resolve(await (await retry(url)).text());
        queue.delete(timeout);
      };

      const now = Date.now();

      if (now - currentTick > interval) {
        activeCount = 1;
        currentTick = now;
      } else if (activeCount < limit) {
        activeCount++;
      } else {
        currentTick += interval;
        activeCount = 1;
      }

      timeout = setTimeout(execute, currentTick - now);
      queue.set(timeout, reject);
    });
  };

  return throttled;
})(20, 1000, 3, 40); // 20 QPS, 3 retries after ~(40, 200, 1000) ms

function color(s: any, code: number) {
  return util.format(`\x1b[${code}m%s\x1b[0m`, s);
}

function report(gen: calc.Generation, format: Format, num: number, source: string) {
  console.info(`[Gen ${gen}] ${format}: ${color(num, 33)} ${color(`(${source})`, 90)}`);
}

function invalid(
  gen: calc.Generation,
  format: Format,
  pokemon: string,
  name: string,
  set: PokemonSet
) {
  const title = color(`'[Gen ${gen}] ${format}: ${pokemon} (${name})'`, 91);
  console.error(`Invalid set ${title}: ${color(JSON.stringify(set), 90)}`);
}

function warn(s: string, err: Error) {
  console.warn(`${color(s, 33)} ${color(err.message, 90)}`);
}

function error(s: string) {
  console.error(color(s, 91));
}
