import * as I from './data/interface';
import {Stats} from './stats';
import {toID, extend, assignWithout} from './util';
import {State} from './state';

const STATS = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'] as I.StatID[];
const SPC = new Set(['spc']);


export class Pokemon implements State.Pokemon {
  gen: I.Generation;
  name: I.SpeciesName;
  species: I.Specie;

  types: [I.TypeName] | [I.TypeName, I.TypeName];
  weightkg: number;

  level: number;
  gender?: I.GenderName;
  ability?: I.AbilityName;
  abilityOn?: boolean;
  isDynamaxed?: boolean;
  isSaltCure?: boolean;
  alliesFainted?: number;
  item?: I.ItemName;
  teraType?: I.TypeName;

  nature: I.NatureName;
  ivs: I.StatsTable;
  evs: I.StatsTable;
  boosts: I.StatsTable;
  rawStats: I.StatsTable;
  stats: I.StatsTable;

  originalCurHP: number;
  status: I.StatusName | '';
  toxicCounter: number;

  moves: I.MoveName[];

  constructor(
    gen: I.Generation,
    name: string,
    options: Partial<State.Pokemon> & {
      curHP?: number;
      ivs?: Partial<I.StatsTable> & {spc?: number};
      evs?: Partial<I.StatsTable> & {spc?: number};
      boosts?: Partial<I.StatsTable> & {spc?: number};
    } = {}
  ) {
    this.species = extend(true, {}, gen.species.get(toID(name)), options.overrides);

    this.gen = gen;
    this.name = options.name || name as I.SpeciesName;
    this.types = this.species.types;
    this.weightkg = this.species.weightkg;

    this.level = options.level || 100;
    this.gender = options.gender || this.species.gender || 'M';
    this.ability = options.ability || this.species.abilities?.[0] || undefined;
    this.abilityOn = !!options.abilityOn;

    this.isDynamaxed = !!options.isDynamaxed;
    this.isSaltCure = !!options.isSaltCure;
    this.alliesFainted = options.alliesFainted;
    this.teraType = options.teraType;
    this.item = options.item;
    this.nature = options.nature || ('Serious' as I.NatureName);
    this.ivs = Pokemon.withDefault(gen, options.ivs, 31);
    this.evs = Pokemon.withDefault(gen, options.evs, gen.num >= 3 ? 0 : 252);
    this.boosts = Pokemon.withDefault(gen, options.boosts, 0, false);

    // Gigantamax 'forms' inherit weight from their base species when not dynamaxed
    // TODO: clean this up with proper Gigantamax support
    if (this.weightkg === 0 && !this.isDynamaxed && this.species.baseSpecies) {
      this.weightkg = gen.species.get(toID(this.species.baseSpecies))!.weightkg;
    }

    if (gen.num < 3) {
      this.ivs.hp = Stats.DVToIV(
        Stats.getHPDV({
          atk: this.ivs.atk,
          def: this.ivs.def,
          spe: this.ivs.spe,
          spc: this.ivs.spa,
        })
      );
    }

    this.rawStats = {} as I.StatsTable;
    this.stats = {} as I.StatsTable;
    for (const stat of STATS) {
      const val = this.calcStat(gen, stat);
      this.rawStats[stat] = val;
      this.stats[stat] = val;
    }

    const curHP = options.curHP || options.originalCurHP;
    this.originalCurHP = curHP && curHP <= this.rawStats.hp ? curHP : this.rawStats.hp;
    this.status = options.status || '';
    this.toxicCounter = options.toxicCounter || 0;
    this.moves = options.moves || [];
  }

  maxHP(original = false) {
    // Shedinja still has 1 max HP during the effect even if its Dynamax Level is maxed (DaWoblefet)
    return !original && this.isDynamaxed && this.species.baseStats.hp !== 1
      ? this.rawStats.hp * 2
      : this.rawStats.hp;
  }

  curHP(original = false) {
    // Shedinja still has 1 max HP during the effect even if its Dynamax Level is maxed (DaWoblefet)
    return !original && this.isDynamaxed && this.species.baseStats.hp !== 1
      ? this.originalCurHP * 2
      : this.originalCurHP;
  }

  hasAbility(...abilities: string[]) {
    return !!(this.ability && abilities.includes(this.ability));
  }

  hasItem(...items: string[]) {
    return !!(this.item && items.includes(this.item));
  }

  hasStatus(...statuses: I.StatusName[]) {
    return !!(this.status && statuses.includes(this.status));
  }

  hasType(...types: I.TypeName[]) {
    for (const type of types) {
      if (this.teraType ? this.teraType === type : this.types.includes(type)) return true;
    }
    return false;
  }

  /** Ignores Tera type */
  hasOriginalType(...types: I.TypeName[]) {
    for (const type of types) {
      if (this.types.includes(type)) return true;
    }
    return false;
  }

  named(...names: string[]) {
    return names.includes(this.name);
  }

  clone() {
    return new Pokemon(this.gen, this.name, {
      level: this.level,
      ability: this.ability,
      abilityOn: this.abilityOn,
      isDynamaxed: this.isDynamaxed,
      isSaltCure: this.isSaltCure,
      alliesFainted: this.alliesFainted,
      item: this.item,
      gender: this.gender,
      nature: this.nature,
      ivs: extend(true, {}, this.ivs),
      evs: extend(true, {}, this.evs),
      boosts: extend(true, {}, this.boosts),
      originalCurHP: this.originalCurHP,
      status: this.status,
      teraType: this.teraType,
      toxicCounter: this.toxicCounter,
      moves: this.moves.slice(),
      overrides: this.species,
    });
  }

  private calcStat(gen: I.Generation, stat: I.StatID) {
    return Stats.calcStat(
      gen,
      stat,
      this.species.baseStats[stat],
      this.ivs[stat]!,
      this.evs[stat]!,
      this.level,
      this.nature
    );
  }

  static getForme(
    gen: I.Generation,
    speciesName: string,
    item?: I.ItemName,
    moveName?: I.MoveName
  ) {
    const species = gen.species.get(toID(speciesName));
    if (!species?.otherFormes) {
      return speciesName;
    }

    let i = 0;
    if (
      (item &&
        ((item.includes('ite') && !item.includes('ite Y')) ||
          (speciesName === 'Groudon' && item === 'Red Orb') ||
          (speciesName === 'Kyogre' && item === 'Blue Orb'))) ||
      (moveName && speciesName === 'Meloetta' && moveName === 'Relic Song') ||
      (speciesName === 'Rayquaza' && moveName === 'Dragon Ascent')
    ) {
      i = 1;
    } else if (item?.includes('ite Y')) {
      i = 2;
    }

    return i ? species.otherFormes[i - 1] : species.name;
  }

  private static withDefault(
    gen: I.Generation,
    current: Partial<I.StatsTable> & {spc?: number} | undefined,
    val: number,
    match = true,
  ) {
    const cur: Partial<I.StatsTable> = {};
    if (current) {
      assignWithout(cur, current, SPC);
      if (current.spc) {
        cur.spa = current.spc;
        cur.spd = current.spc;
      }
      if (match && gen.num <= 2 && current.spa !== current.spd) {
        throw new Error('Special Attack and Special Defense must match before Gen 3');
      }
    }
    return {hp: val, atk: val, def: val, spa: val, spd: val, spe: val, ...cur};
  }
}
