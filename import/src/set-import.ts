// How to run this file:
// npm run compile
// node dist/set-import.js path/to/output

import * as fs from 'fs';

import {
  AbilityName, Generation, GenerationNum, Generations, ID, Item, ItemName, MoveName,
  NatureName, PokemonSet, Specie, SpeciesName, StatID, StatsTable, TypeName,
} from '@pkmn/data';
import {Dex as ModdedDex, Item as PSItem, Species as PSSpecie} from '@pkmn/dex';
import {Dex, Format, TeamValidator} from '@pkmn/sim';
import type {DisplayStatistics, LegacyDisplayUsageStatistics} from '@pkmn/smogon';

interface DexSet {
  moves: MoveName[];
  level?: number;
  ability?: AbilityName[] | AbilityName;
  item?: ItemName[] | ItemName;
  nature?: NatureName[] | NatureName;
  teratypes?: TypeName[] | TypeName;
  evs?: Partial<StatsTable>[] | Partial<StatsTable>;
  ivs?: Partial<StatsTable>[] | Partial<StatsTable>;
}

interface DexSets {
  [specie: string]: {
    [format: string]: {
      [name: string]: DexSet;
    };
  };
}

interface CalcStatsTable {
  hp: number;
  at: number;
  df: number;
  sa: number;
  sd: number;
  sp: number;
}

interface CalcSet {
  moves: string[];
  level?: number;
  ability?: string;
  item?: string;
  nature?: string;
  teraType?: string;
  evs?: Partial<CalcStatsTable>;
  ivs?: Partial<CalcStatsTable>;
}

const VALIDATORS: {[format: string]: TeamValidator} = {};
// These formats don't exist in @pkmn/sim so we make them bypass
// the validator which is the only area that needs the Format object
const UNSUPPORTED: {[format: string]: string} = {
  'gen9almostanyability': '[Gen 9] Almost Any Ability',
};
const SHORT_STAT_FORM: {[stat: string]: keyof CalcStatsTable} =
{'hp': 'hp', 'atk': 'at', 'def': 'df', 'spa': 'sa', 'spd': 'sd', 'spe': 'sp'};
const USELESS_NATURES = ['Bashful', 'Docile', 'Hardy', 'Quirky', 'Serious'];
const CROWNED = {'Zacian-Crowned': 'Behemoth Blade', 'Zamazenta-Crowned': 'Behemoth Bash'};
// These 'rankings' are pulled completely out of my ass
const TIER_RANKINGS: {[tier: string]: number} = {
  ou: 0,
  ubers: 1,
  uu: 2,
  ru: 3,
  nu: 4,
  pu: 5,
  lc: 6,
  doublesou: 7,
  vgc: 8,
  bss: 9,
  monotype: 10,
  nationaldex: 11,
  nationaldexubers: 12,
  nationaldexuu: 13,
  nationaldexru: 14,
  nationaldexmonotype: 15,
  anythinggoes: 16,
  '1v1': 17,
  balancedhackmons: 18,
  purehackmons: 19,
  almostanyability: 20,
  zu: 21,
  cap: 22,
  tradebacksou: 23,
};

function first<T>(v: T[] | T): T {
  return Array.isArray(v) ? v[0] : v;
}

function top(weighted: {[key: string]: number}, n?: 1): string;
function top(weighted: {[key: string]: number}, n?: 0): undefined;
function top(weighted: {[key: string]: number}, n?: number): string[];
function top(weighted: {[key: string]: number}, n = 1): string | string[] | undefined {
  if (n === 0) return undefined;
  // Optimize the more common case with an linear algorithm instead of log-linear
  if (n === 1) {
    let max;
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

function getTierRanking(tier: string): number {
  const isVGC = tier.startsWith('vgc');
  const isBSS = tier.startsWith('battlestadium') || tier.startsWith('battlespot');
  return TIER_RANKINGS[isVGC ? 'vgc' : isBSS ? 'bss' : tier] ?? 100;
}

function toCalcStatsTable(
  stats: Partial<StatsTable>, ignoreVal: number
): Partial<CalcStatsTable> | undefined {
  const calcStatsTable: Partial<CalcStatsTable> = {};
  let isEmpty = true;
  let stat: StatID;
  for (stat in stats) {
    if (stats[stat] === ignoreVal) continue;
    if (stat in SHORT_STAT_FORM) {
      calcStatsTable[SHORT_STAT_FORM[stat]] = stats[stat];
      isEmpty = false;
    }
  }
  return isEmpty ? undefined : calcStatsTable;
}

function getUsageThreshold(formatID: ID, count: number): number {
  // For old metagames with extremely low total battle counts we adjust the thresholds
  if (count < 100) return Infinity;
  if (count < 400) return 0.05;
  // These formats are deemed to have playerbases of lower quality than normal
  return /uber|anythinggoes|doublesou|gen1nu|gen1pu/.test(formatID) ? 0.03 : 0.01;
}

function fromSpread(spread: string): {nature: string; evs: Partial<StatsTable>} {
  const [nature, revs] = spread.split(':');
  const evs: Partial<StatsTable> = {};
  const stats = Dex.stats.ids();
  for (const [i, rev] of revs.split('/').entries()) {
    const ev = Number(rev);
    if (ev) evs[stats[i]] = ev;
  }
  return {nature, evs};
}

function expectedHP(ivs: Partial<StatsTable>) {
  ivs = TeamValidator.fillStats(ivs, 31);
  const atkDV = Math.floor(ivs.atk! / 2);
  const defDV = Math.floor(ivs.def! / 2);
  const speDV = Math.floor(ivs.spe! / 2);
  const spcDV = Math.floor(ivs.spa! / 2);
  return 2 * ((atkDV % 2) * 8 + (defDV % 2) * 4 + (speDV % 2) * 2 + (spcDV % 2));
}

function getLevel(formatID: ID): number {
  if (formatID.includes('lc')) {
    return 5;
  }
  if (formatID.includes('vgc') || formatID.includes('battlestadium')) {
    return 50;
  }
  return 100;
}

function getSpecie(gen: Generation, specieName: SpeciesName): Specie | PSSpecie {
  return gen.species.get(specieName) ?? ModdedDex.forGen(gen.num).species.get(specieName);
}

function toPSFormat(formatID: ID): ID {
  if (formatID === 'gen9vgc2024') {
    return `${formatID}regh` as ID;
  }
  if (formatID === 'gen9battlestadiumsingles') {
    return 'gen9bssregh' as ID;
  }
  return formatID;
}

function dexToPset(
  gen: Generation, formatID: ID, specie: Specie | PSSpecie, dset: DexSet
): PokemonSet {
  const pset: PokemonSet = {
    name: '',
    species: specie.name,
    item: first(dset.item) ?? '',
    ability: first(dset.ability) ?? specie.abilities[0],
    moves: dset.moves.map(first),
    nature: first(dset.nature) ?? '',
    gender: '',
    evs: TeamValidator.fillStats(first(dset.evs) ?? null, gen.num < 3 ? 252 : 0),
    ivs: TeamValidator.fillStats(first(dset.ivs) ?? null, gen.num === 2 ? 30 : 31),
    level: first(dset.level) ?? getLevel(formatID),
    teraType: first(dset.teratypes),
  };
  const hp = pset.moves?.find(m => m.startsWith('Hidden Power'));
  if (!hp) {
    return pset;
  }
  const dex = gen.dex;
  const type = hp.slice(13);
  if (type && dex.getHiddenPower(pset.ivs).type !== type) {
    if (dex.gen >= 7 && pset.level === 100) {
      pset.hpType = type;
    } else if (dex.gen === 2) {
      const dvs = {...dex.types.get(type).HPdvs};
      let stat: StatID;
      for (stat in dvs) {
        dvs[stat]! *= 2;
      }
      pset.ivs = Object.assign(pset.ivs, dvs);
      pset.ivs.hp = expectedHP(pset.ivs);
    } else {
      pset.ivs = Object.assign(pset.ivs, dex.types.get(type).HPivs);
    }
  }
  return pset;
}
function usageToPset(
  gen: Generation, formatID: ID, specieName: SpeciesName, uset: LegacyDisplayUsageStatistics
): PokemonSet {
  const {nature, evs} = fromSpread(top(uset.spreads));
  const item = top(uset.items);
  const ability = top(uset.abilities);
  const teraType = top(uset.teraTypes);
  const pset: PokemonSet = {
    name: '',
    species: specieName,
    item: !item || item === 'Nothing' ? '' : item,
    ability: !ability || ability === 'No Ability' ? '' : ability,
    moves: top(uset.moves, 4).filter(m => m !== 'Nothing'),
    nature,
    teraType: !teraType || teraType === 'Nothing' ? '' : teraType,
    gender: '',
    evs: TeamValidator.fillStats(evs ?? null, gen.num < 3 ? 252 : 0),
    ivs: TeamValidator.fillStats(null, gen.num === 2 ? 30 : 31),
    level: getLevel(formatID),
  };
  const hp = pset.moves?.find(m => m.startsWith('Hidden Power'));
  if (!hp) {
    return pset;
  }
  const dex = gen.dex;
  const type = hp.slice(13);
  if (type && dex.getHiddenPower(pset.ivs).type !== type) {
    if (dex.gen >= 7 && pset.level === 100) {
      pset.hpType = type;
    } else if (dex.gen === 2) {
      const dvs = {...dex.types.get(type).HPdvs};
      let stat: StatID;
      for (stat in dvs) {
        dvs[stat]! *= 2;
      }
      pset.ivs = Object.assign(pset.ivs, dvs);
      pset.ivs.hp = expectedHP(pset.ivs);
    } else {
      pset.ivs = Object.assign(pset.ivs, dex.types.get(type).HPivs);
    }
  }
  return pset;
}

function psetToCalcSet(genNum: GenerationNum, pset: PokemonSet): CalcSet {
  return {
    level: pset.level === 100 ? undefined : pset.level,
    ability: pset.ability || undefined,
    item: pset.item || undefined,
    nature: !pset.nature || USELESS_NATURES.includes(pset.nature) ? undefined : pset.nature,
    teraType: pset.teraType || undefined,
    ivs: toCalcStatsTable(pset.ivs, genNum === 2 ? 30 : 31),
    evs: toCalcStatsTable(pset.evs, genNum > 2 ? 0 : 252),
    moves: pset.moves,
  };
}

function validatePSet(format: Format, pset: PokemonSet, type: 'dex' | 'stats'): boolean {
  let validator = VALIDATORS[format.id];
  if (!validator) {
    validator = VALIDATORS[format.id] = new TeamValidator(format);
  }
  // The validator mutates `pset.species` to remove the '-Crowned'
  const species = pset.species;
  // The validator mutates ability for megas
  const ability = pset.ability;
  let invalid = validator.validateSet(pset, {});
  // The Validator mutates `pset.moves` to rename the battle only crowned moves to ironhead
  if (species in CROWNED) {
    const ironhead = pset.moves.indexOf('ironhead');
    if (ironhead > -1) {
      pset.moves[ironhead] = CROWNED[species as keyof typeof CROWNED];
    }
  }
  pset.ability = ability;
  if (!invalid) return true;
  // Correct invalidations where set is required to be shiny due to an event
  if (invalid.length === 1 && invalid[0].includes('must be shiny')) {
    pset.shiny = true;
    invalid = validator.validateSet(pset, {});
    if (!invalid) return true;
  }
  if (invalid.length === 1 && invalid[0].includes('has exactly 0 EVs - did you forget to EV it?')) {
    pset.evs.hp = 1;
    invalid = validator.validateSet(pset, {});
    if (!invalid) return true;
  }
  // Allow Gen 4 Arceus sets because they're occasionally useful for tournaments
  if (format.id === 'gen4ubers' && invalid.includes(`${pset.name} is banned.`)) {
    return true;
  }
  const title = `${format.name}: ${pset.name}`;
  const details = `${JSON.stringify(pset)} = ${invalid.join(', ')}`;
  console.log(`[${type.toUpperCase()}] Invalid set ${title}: ${details}`);
  return false;
}

function similarFormes(
  pset: PokemonSet,
  specie: Specie | PSSpecie,
  item: Item | PSItem,
  format: Format | null,
  genNum: GenerationNum
): {formes: SpeciesName[]; abilityChange: boolean} {
  const similar: {formes: SpeciesName[]; abilityChange: boolean} = {
    formes: [], abilityChange: false,
  };
  // Check if the item is a Mega Stone because we shouldn't copy over BH megas
  // to the base specie since it starts the battle as the Mega Evolution
  if (specie.isMega && item.megaStone) {
    similar.formes = [specie.baseSpecies];
    similar.abilityChange = true;
    return similar;
  }
  if (specie.name === item.megaEvolves) {
    similar.formes = [item.megaStone!];
    similar.abilityChange = true;
    return similar;
  }
  if (pset.ability === 'Power Construct' && pset.species.startsWith('Zygarde')) {
    similar.formes = ['Zygarde-Complete'] as SpeciesName[];
    return similar;
  }
  if (pset.ability === 'Battle Bond' && pset.species.startsWith('Greninja') &&
    (genNum === 7 || (genNum === 8 && format?.id.includes('nationaldex')))) {
    similar.formes = ['Greninja-Ash'] as SpeciesName[];
    return similar;
  }
  if (pset.species === 'Rayquaza' && format && pset.moves.includes('Dragon Ascent')) {
    const ruleTable = Dex.formats.getRuleTable(format);
    const isMrayAllowed = genNum === 6 || genNum === 7
      ? !ruleTable.has('megarayquazaclause') && !format.banlist.includes('Rayquaza-Mega')
      : format.id.includes('nationaldex') &&
        (!ruleTable.has('megarayquazaclause') && !format.banlist.includes('Rayquaza-Mega'));
    if (isMrayAllowed) {
      similar.formes = ['Rayquaza-Mega'] as SpeciesName[];
      similar.abilityChange = true;
      return similar;
    }
    return similar;
  }
  if (pset.species === 'Rayquaza-Mega' && format &&
    (!format.id.includes('balancedhackmons') && !format.id.includes('bh'))) {
    similar.formes = ['Rayquaza'] as SpeciesName[];
    similar.abilityChange = true;
    return similar;
  }
  if ((pset.species === 'Groudon' || pset.species === 'Groudon-Primal') &&
    pset.item === 'Red Orb') {
    similar.formes = [pset.species === 'Groudon' ? 'Groudon-Primal' : 'Groudon'] as SpeciesName[];
    similar.abilityChange = true;
    return similar;
  }
  if ((pset.species === 'Kyogre' || pset.species === 'Kyogre-Primal') &&
    pset.item === 'Blue Orb') {
    similar.formes = [pset.species === 'Kyogre' ? 'Kyogre-Primal' : 'Kyogre'] as SpeciesName[];
    similar.abilityChange = true;
    return similar;
  }
  if (pset.species === 'Darmanitan-Galar' && pset.ability === 'Zen Mode') {
    similar.formes = ['Darmanitan-Galar-Zen'] as SpeciesName[];
    return similar;
  }
  if (pset.species === 'Darmanitan-Galar-Zen') {
    similar.formes = ['Darmanitan-Galar'] as SpeciesName[];
    return similar;
  }
  if (pset.species === 'Meloetta' && pset.moves.includes('Relic Song')) {
    similar.formes = ['Meloetta-Pirouette'] as SpeciesName[];
    return similar;
  }
  if (pset.species === 'Meloetta-Pirouette') {
    similar.formes = ['Meloetta'] as SpeciesName[];
    return similar;
  }
  switch (specie.name) {
    case 'Aegislash':
      similar.formes = ['Aegislash-Blade', 'Aegislash-Shield', 'Aegislash-Both'] as SpeciesName[];
      break;
    case 'Keldeo':
      similar.formes = ['Keldeo-Resolute'] as SpeciesName[];
      break;
    case 'Minior':
      similar.formes = ['Minior-Meteor'] as SpeciesName[];
      break;
    case 'Palafin':
      similar.formes = ['Palafin-Hero'] as SpeciesName[];
      break;
    case 'Terapagos':
      similar.formes = ['Terapagos-Stellar', 'Terapagos-Terastal'] as SpeciesName[];
      similar.abilityChange = true;
      break;
    case 'Sirfetch\'d':
      similar.formes = ['Sirfetch’d'] as SpeciesName[];
      break;
    case 'Wishiwashi':
      similar.formes = ['Wishiwashi-School'] as SpeciesName[];
  }
  return similar;
}

async function fetchDexSets(genNum: GenerationNum): Promise<DexSets> {
  const url = `https://data.pkmn.cc/sets/gen${genNum}.json`;
  console.log(`Fetching ${url}...`);
  const resp = await fetch(url);
  if (resp.status === 404) return {};
  return resp.json();
}

async function fetchStats(formatID: ID): Promise<DisplayStatistics | false> {
  const url = `https://data.pkmn.cc/stats/${formatID}.json`;
  console.log(`Fetching ${url}...`);
  const resp = await fetch(url);
  if (resp.status === 404) return false;
  return resp.json();
}
async function importGen(
  gen: Generation
): Promise<{[specie: string]: {[name: string]: CalcSet}}> {
  const calcSets: {[specie: string]: {[name: string]: CalcSet}} = {};
  const dexSets = await fetchDexSets(gen.num);
  const formatIDs = new Set<ID>();
  const statsIgnore: {[specie: string]: Set<ID>} = {};
  for (const [specieName, formats] of Object.entries(dexSets)) {
    for (let [formatID, sets] of Object.entries(formats).sort((a, b) =>
      getTierRanking(a[0]) - getTierRanking(b[0])) as unknown as [ID, DexSet][]) {
      formatID = `gen${gen.num}${formatID}` as ID;
      const psFormat = toPSFormat(formatID);
      const format = UNSUPPORTED[psFormat] ? null : Dex.formats.get(psFormat);
      if (format && !format.exists) {
        continue;
      }
      formatIDs.add(formatID);
      const formatName = format?.name ?? UNSUPPORTED[psFormat];
      const specie = getSpecie(gen, specieName as SpeciesName);
      for (const [name, set] of Object.entries(sets)) {
        const pset = dexToPset(gen, formatID, specie, set);
        if (format && !validatePSet(format, pset, 'dex')) continue;
        const calcSet = psetToCalcSet(gen.num, pset);
        const setName = `${formatName.slice(formatName.indexOf(']') + 2)} ${name}`;
        if (!calcSets[specieName]) calcSets[specieName] = {};
        calcSets[specieName][setName] = calcSet;
        if (!statsIgnore[specieName]) statsIgnore[specieName] = new Set();
        statsIgnore[specieName].add(formatID);
        const item = gen.items.get(pset.item) ?? ModdedDex.forGen(gen.num).items.get(pset.item);
        const copyTo = similarFormes(pset, specie, item, format, gen.num);
        // Quintuple loop... yikes
        for (const forme of copyTo.formes) {
          if (!statsIgnore[forme]) statsIgnore[forme] = new Set();
          statsIgnore[forme].add(formatID);
          if (!calcSets[forme]) calcSets[forme] = {};
          if (copyTo.abilityChange) {
            const formeSpecie = getSpecie(gen, forme);
            calcSets[forme][setName] = {...calcSet, ability: formeSpecie.abilities[0]};
          } else {
            calcSets[forme][setName] = calcSet;
          }
        }
      }
    }
  }
  for (const formatID of [...formatIDs].sort((a, b) =>
    getTierRanking(a[0]) - getTierRanking(b[0]))) {
    const psFormat = toPSFormat(formatID);
    const format = UNSUPPORTED[psFormat] ? null : Dex.formats.get(psFormat);
    if (format && !format.exists) {
      continue;
    }
    const formatName = format ? format.name : UNSUPPORTED[psFormat];
    let stats: DisplayStatistics | false = false;
    try {
      stats = await fetchStats(formatID);
    } catch (err) {}
    if (!stats) {
      console.log(`${formatName} has no stats page`);
      continue;
    }
    const threshold = getUsageThreshold(formatID, stats.battles);
    const pokemon =
      Object.entries(stats.pokemon) as unknown as [SpeciesName, LegacyDisplayUsageStatistics][];
    for (const [specieName, uset] of pokemon) {
      if (statsIgnore[specieName]?.has(formatID)) {
        continue;
      }
      if (uset.usage.weighted < threshold) continue;
      const specie = getSpecie(gen, specieName);
      const pset = usageToPset(gen, formatID, specie.name, uset);
      if (format && !validatePSet(format, pset, 'stats')) continue;
      const calcSet = psetToCalcSet(gen.num, pset);
      if (!calcSets[specieName]) calcSets[specieName] = {};
      const setName = `${formatName.slice(formatName.indexOf(']') + 2)} Showdown Usage`;
      calcSets[specieName][setName] = calcSet;
      const item = gen.items.get(pset.item) ?? ModdedDex.forGen(gen.num).items.get(pset.item);
      const copyTo = similarFormes(pset, specie, item, format, gen.num);
      for (const forme of copyTo.formes) {
        if (statsIgnore[forme]?.has(formatID)) {
          continue;
        }
        if (!calcSets[forme]) calcSets[forme] = {};
        if (copyTo.abilityChange) {
          const formeSpecie = getSpecie(gen, forme);
          calcSets[forme][setName] = {...calcSet, ability: formeSpecie.abilities[0]};
        } else {
          calcSets[forme][setName] = calcSet;
        }
      }
    }
  }
  return calcSets;
}

// JSON.stringify's pretty option takes too much space since it gives every element
// a separate newline so we write our custom stringify which makes it pretty but still
// take a reasonable amount of space. The build script minfies it so this has no effect
// on the bundle size
function stringifyCalcSets(calcSets: {[specie: string]: {[name: string]: CalcSet}}) {
  const buf = [];
  const space = (n = 2) => ' '.repeat(n);
  for (const [specie, sets] of Object.entries(calcSets)) {
    buf.push(`${space()}"${specie}": {`);
    const setsBuf = [];
    for (const [setName, set] of Object.entries(sets)) {
      setsBuf.push(`${space(4)}${JSON.stringify(setName)}: ${JSON.stringify(set)}`);
    }
    buf.push(setsBuf.join(',\n'));
    buf.push(`${space()}},`);
  }
  // Slice the last comma so we are valid JSON
  return buf.join('\n').slice(0, -1);
}

(async () => {
  Dex.includeData();
  const gens = new Generations(ModdedDex);
  const outDir = process.argv[2];
  if (!fs.statSync(outDir).isDirectory()) {
    console.log(`${outDir} is not a directory`);
    process.exit(1);
  }
  const genNames = ['RBY', 'GSC', 'ADV', 'DPP', 'BW', 'XY', 'SM', 'SS', 'SV'];
  for (const [i, genName] of genNames.entries()) {
    const calcSets = await importGen(gens.get(i + 1));
    const path = `${outDir}/gen${i + 1}.js`;
    console.log(`Writing ${path}...`);
    fs.writeFileSync(
      path, `var SETDEX_${genName} = {\n${stringifyCalcSets(calcSets)}\n};\n`
    );
  }
  process.exit(0);
})().catch((err) => {
  throw err;
});
