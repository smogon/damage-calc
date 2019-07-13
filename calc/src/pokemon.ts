import { Gender } from './data/species';
import { StatsTable } from './stats';
import { Type } from './data/types';

export type Status =
  | 'Healthy'
  | 'Paralyzed'
  | 'Poisoned'
  | 'Badly Poisoned'
  | 'Burned'
  | 'Asleep'
  | 'Frozen';

class Pokemon {
  name: string;
  type1: Type;
  type2?: Type;
  rawStats: StatsTable<number>;
  boosts: StatsTable<number>;
  stats: StatsTable<number>;
  evs: StatsTable<number>;
  level: number;
  HPEVs: number;
  maxHP: number;
  curHP: number;
  nature: string;
  ability?: string;
  abilityOn: boolean;
  item?: string;
  status: Status;
  toxicCounter: number;
  moves: string[];
  weight: number;
  gender?: Gender;

  constructor(
    name: string,
    type1: Type,
    type2: Type | undefined,
    rawStats: StatsTable<number>,
    boosts: StatsTable<number>,
    stats: StatsTable<number>,
    evs: StatsTable<number>,
    level: number,
    HPEVs: number,
    maxHP: number,
    curHP: number,
    nature: string,
    ability: string | undefined,
    abilityOn: boolean,
    item: string | undefined,
    status: Status,
    toxicCounter: number,
    moves: string[],
    weight: number,
    gender: Gender | undefined
  ) {
    this.name = name;
    this.type1 = type1;
    this.type2 = type2;
    this.rawStats = rawStats;
    this.boosts = boosts;
    this.stats = stats;
    this.evs = evs;
    this.level = level;
    this.HPEVs = HPEVs;
    this.maxHP = maxHP;
    this.curHP = curHP;
    this.nature = nature;
    this.ability = ability;
    this.abilityOn = abilityOn;
    this.item = item;
    this.status = status;
    this.toxicCounter = toxicCounter;
    this.moves = moves;
    this.weight = weight;
    this.gender = gender;
  }

  hasAbility(...abilities: string[]) {
    return abilities.indexOf(this.ability) !== -1;
  }

  hasItem(...items: string[]) {
    return items.indexOf(this.item) !== -1;
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
}

// TODO: switch to inline exports no longer relying on globals
export { Pokemon };
