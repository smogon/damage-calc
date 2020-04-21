import * as I from './data/interface';
import {StatsTable, STATS, Stat, Stats} from './stats';
import {toID, extend} from './util';

export type StatusName = 'slp' | 'psn' | 'brn' | 'frz' | 'par' | 'tox';

export class Pokemon {
  gen: I.Generation;
  name: string;
  species: I.Specie;

  type1: I.TypeName;
  type2?: I.TypeName;
  weight: number;

  level: number;
  gender?: I.GenderName;
  ability?: I.AbilityName;
  abilityOn?: boolean;
  isDynamaxed?: boolean;
  item?: I.ItemName;

  nature: I.NatureName;
  ivs: StatsTable;
  evs: StatsTable;
  boosts: StatsTable;
  rawStats: StatsTable;
  stats: StatsTable;

  status: StatusName | '';
  toxicCounter: number;

  moves: I.MoveName[];

  private originalCurHP: number;

  constructor(
    gen: I.Generation,
    name: string,
    options: {
      level?: number;
      ability?: I.AbilityName;
      abilityOn?: boolean;
      isDynamaxed?: boolean;
      item?: I.ItemName;
      gender?: I.GenderName;
      nature?: I.NatureName;
      ivs?: Partial<StatsTable>;
      evs?: Partial<StatsTable>;
      boosts?: Partial<StatsTable>;
      curHP?: number;
      status?: StatusName | '';
      toxicCounter?: number;
      moves?: I.MoveName[];
      overrides?: Partial<I.Specie>;
    } = {}
  ) {
    this.species = extend(true, {}, gen.species.get(toID(name)), options.overrides);

    this.gen = gen;
    this.name = name;
    this.type1 = this.species.t1;
    this.type2 = this.species.t2;
    this.weight = this.species.w;

    this.level = options.level || 100;
    this.gender = options.gender || this.species.gender || 'M';
    this.ability = options.ability || this.species.ab;
    this.abilityOn = !!options.abilityOn;
    this.isDynamaxed = !!options.isDynamaxed;
    this.item = options.item;

    this.nature = options.nature || ('Serious' as I.NatureName);
    this.ivs = Pokemon.withDefault(gen, options.ivs, 31);
    this.evs = Pokemon.withDefault(gen, options.evs, gen.num >= 3 ? 0 : 252);
    this.boosts = Pokemon.withDefault(gen, options.boosts, 0);

    if (gen.num < 3) {
      this.ivs.hp = Stats.DVToIV(
        Stats.getHPDV({
          atk: this.ivs.atk,
          def: this.ivs.def,
          spe: this.ivs.spe,
          spc: typeof this.ivs.spc === 'undefined' ? this.ivs.spa : this.ivs.spc,
        })
      );
    }

    this.rawStats = {} as StatsTable;
    this.stats = {} as StatsTable;
    for (const stat of STATS[gen.num]) {
      const val = this.calcStat(gen, stat);
      this.rawStats[stat] = val;
      this.stats[stat] = val;
    }

    this.originalCurHP =
      options.curHP && options.curHP <= this.rawStats.hp ? options.curHP : this.rawStats.hp;
    this.status = options.status || '';
    this.toxicCounter = options.toxicCounter || 0;
    this.moves = options.moves || [];
  }

  maxHP(original = false) {
    // Shedinja still has 1 max HP during the effect even if its Dynamax Level is maxed (DaWoblefet)
    return !original && this.isDynamaxed && this.species.bs.hp !== 1
      ? this.rawStats.hp * 2
      : this.rawStats.hp;
  }

  curHP(original = false) {
    // Shedinja still has 1 max HP during the effect even if its Dynamax Level is maxed (DaWoblefet)
    return !original && this.isDynamaxed && this.species.bs.hp !== 1
      ? this.originalCurHP * 2
      : this.originalCurHP;
  }

  hasAbility(...abilities: string[]) {
    return !!(this.ability && abilities.includes(this.ability));
  }

  hasItem(...items: string[]) {
    return !!(this.item && items.includes(this.item));
  }

  hasStatus(...statuses: StatusName[]) {
    return !!(this.status && statuses.includes(this.status));
  }

  hasType(...types: I.TypeName[]) {
    for (const type of types) {
      if (this.type1 === type || this.type2 === type) return true;
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
      item: this.item,
      gender: this.gender,
      nature: this.nature,
      ivs: extend(true, {}, this.ivs),
      evs: extend(true, {}, this.evs),
      boosts: extend(true, {}, this.boosts),
      curHP: this.originalCurHP,
      status: this.status,
      toxicCounter: this.toxicCounter,
      moves: this.moves.slice(),
      overrides: this.species,
    });
  }

  private calcStat(gen: I.Generation, stat: Stat) {
    return Stats.calcStat(
      gen,
      stat,
      this.species.bs[Stats.shortForm(stat)]!,
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
    if (!species || !species.formes) {
      return speciesName;
    }

    let i = 0;
    if (
      (item &&
        ((item.indexOf('ite') !== -1 && item.indexOf('ite Y') === -1) ||
          (speciesName === 'Groudon' && item === 'Red Orb') ||
          (speciesName === 'Kyogre' && item === 'Blue Orb'))) ||
      (moveName && speciesName === 'Meloetta' && moveName === 'Relic Song') ||
      (speciesName === 'Rayquaza' && moveName === 'Dragon Ascent')
    ) {
      i = 1;
    } else if (item && item.indexOf('ite Y') !== -1) {
      i = 2;
    }

    return species.formes[i];
  }

  private static withDefault(
    gen: I.Generation,
    current: Partial<StatsTable> | undefined,
    val: number
  ) {
    return extend(
      true,
      {},
      {hp: val, atk: val, def: val, spe: val},
      gen.num < 2 ? {spc: val} : {spa: val, spd: val},
      current
    );
  }
}
