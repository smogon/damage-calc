import {Gender, Species, SPECIES} from './data/species';
import {Type} from './data/types';
import {Generation} from './gen';
import {StatsTable, calcStat, STATS, DVToIV, getHPDV, shortForm, Stat} from './stats';
import {extend} from './util';

export type Status =
  | 'Healthy'
  | 'Paralyzed'
  | 'Poisoned'
  | 'Badly Poisoned'
  | 'Burned'
  | 'Asleep'
  | 'Frozen';

export class Pokemon {
  gen: Generation;
  name: string;
  species: Species;

  type1: Type;
  type2?: Type;
  weight: number;

  level: number;
  gender?: Gender;
  ability?: string;
  abilityOn: boolean;
  item?: string;

  nature: string;
  ivs: StatsTable<number>;
  evs: StatsTable<number>;
  boosts: StatsTable<number>;
  rawStats: StatsTable<number>;
  stats: StatsTable<number>;

  curHP: number;
  status: Status;
  toxicCounter: number;

  moves: string[];

  constructor(
    gen: Generation,
    name: string,
    options: {
      level?: number;
      ability?: string;
      abilityOn?: boolean;
      item?: string;
      gender?: Gender;
      nature?: string;
      ivs?: Partial<StatsTable<number>>;
      evs?: Partial<StatsTable<number>>;
      boosts?: Partial<StatsTable<number>>;
      curHP?: number;
      status?: Status;
      toxicCounter?: number;
      moves?: string[];
      overrides?: Partial<Species>;
    } = {}
  ) {
    this.species = extend(true, {}, SPECIES[gen][name], options.overrides);

    this.gen = gen;
    this.name = name;
    this.type1 = this.species.t1;
    this.type2 = this.species.t2;
    this.weight = this.species.w;

    this.level = options.level || 100;
    this.gender = options.gender || this.species.gender || 'male';
    this.ability = options.ability || this.species.ab;
    this.abilityOn = !!options.abilityOn;
    this.item = options.item;

    this.nature = options.nature || 'Serious';
    this.ivs = Pokemon.withDefault(gen, options.ivs, 31);
    this.evs = Pokemon.withDefault(gen, options.evs, gen >= 3 ? 0 : 252);
    this.boosts = Pokemon.withDefault(gen, options.boosts, 0);

    if (gen < 3) {
      this.ivs.hp = DVToIV(
        getHPDV({
          atk: this.ivs.atk,
          def: this.ivs.def,
          spe: this.ivs.spe,
          spc: typeof this.ivs.spc === 'undefined' ? this.ivs.spa : this.ivs.spc,
        })
      );
    }

    this.rawStats = {} as StatsTable<number>;
    this.stats = {} as StatsTable<number>;
    for (const stat of STATS[gen]) {
      const val = this.calcStat(gen, stat);
      this.rawStats[stat] = val;
      this.stats[stat] = val;
    }

    this.curHP = options.curHP && options.curHP <= this.maxHP() ? options.curHP : this.maxHP();
    this.status = options.status || 'Healthy';
    this.toxicCounter = options.toxicCounter || 0;
    this.moves = options.moves || [];
  }

  /* get */ maxHP() {
    return this.rawStats.hp;
  }

  hasAbility(...abilities: string[]) {
    return this.ability && abilities.indexOf(this.ability) !== -1;
  }

  hasItem(...items: string[]) {
    return this.item && items.indexOf(this.item) !== -1;
  }

  hasStatus(...statuses: Status[]) {
    return statuses.indexOf(this.status) !== -1;
  }

  hasType(...types: Type[]) {
    for (const type of types) {
      if (this.type1 === type || this.type2 === type) return true;
    }
    return false;
  }

  named(...names: string[]) {
    return names.indexOf(this.name) !== -1;
  }

  clone() {
    return new Pokemon(this.gen, this.name, {
      level: this.level,
      ability: this.ability,
      abilityOn: this.abilityOn,
      item: this.item,
      gender: this.gender,
      nature: this.nature,
      ivs: extend(true, {}, this.ivs),
      evs: extend(true, {}, this.evs),
      boosts: extend(true, {}, this.boosts),
      curHP: this.curHP,
      status: this.status,
      toxicCounter: this.toxicCounter,
      moves: this.moves.slice(),
      overrides: this.species,
    });
  }

  private calcStat(gen: Generation, stat: Stat) {
    return calcStat(
      gen,
      stat,
      this.species.bs[shortForm(stat)]!,
      this.ivs[stat]!,
      this.evs[stat]!,
      this.level,
      this.nature
    );
  }

  static getForme(gen: Generation, speciesName: string, item?: string, moveName?: string) {
    const species = SPECIES[gen][speciesName];
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
    gen: Generation,
    current: Partial<StatsTable<number>> | undefined,
    val: number
  ) {
    return extend(
      true,
      {},
      {hp: val, atk: val, def: val, spe: val},
      gen < 2 ? {spc: val} : {spa: val, spd: val},
      current
    );
  }
}
