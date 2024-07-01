import * as I from '../data/interface';
import * as D from '@pkmn/dex';

export function toID(s: string) {
  return ('' + s).toLowerCase().replace(/[^a-z0-9]+/g, '') as I.ID;
}

const GENERATIONS = Object.create(null) as {[num: number]: Generation};

export class Generations implements I.Generations {
  private readonly dex: D.ModdedDex;

  constructor(dex: D.ModdedDex) {
    this.dex = dex;
  }

  get(gen: I.GenerationNum) {
    if (GENERATIONS[gen]) return GENERATIONS[gen];
    return (GENERATIONS[gen] = new Generation(this.dex.forGen(gen)));
  }
}

class Generation implements I.Generation {
  dex: D.ModdedDex;

  abilities: Abilities;
  items: Items;
  moves: Moves;
  species: Species;
  types: Types;
  natures: Natures;

  num: I.GenerationNum;

  constructor(dex: D.ModdedDex) {
    this.dex = dex;

    this.abilities = new Abilities(dex);
    this.items = new Items(dex);
    this.moves = new Moves(dex);
    this.species = new Species(dex);
    this.types = new Types(dex);
    this.natures = new Natures(dex);
    this.num = this.dex.gen;
  }
}

class Abilities implements I.Abilities {
  private readonly dex: D.ModdedDex;

  constructor(dex: D.ModdedDex) {
    this.dex = dex;
  }

  get(name: string) {
    const ability = this.dex.abilities.get(name);
    if (ability.isNonstandard === 'CAP' && this.dex.gen < 4) return undefined;
    return exists(ability, this.dex.gen) ? new Ability(ability) : undefined;
  }

  *[Symbol.iterator]() {
    for (const id in this.dex.data.Abilities) {
      const a = this.get(id);
      if (a) yield a;
    }
  }
}

class Ability implements I.Ability {
  readonly kind: 'Ability';
  readonly id: I.ID;
  readonly name: I.AbilityName;

  constructor(ability: D.Ability) {
    this.kind = 'Ability';
    this.id = ability.id as I.ID;
    this.name = ability.name as I.AbilityName;
  }
}

class Items implements I.Items {
  private readonly dex: D.ModdedDex;

  constructor(dex: D.ModdedDex) {
    this.dex = dex;
  }

  get(name: string) {
    if (this.dex.gen < 2) return undefined;
    let item = this.dex.items.get(name);
    // Enigma Berry is Unobtainable in Gen 3, but the damage calc supports Unobtainable data and
    // needs the naturalGift data which is only defined in Gen 4.
    if (this.dex.gen === 3 && item.id === 'enigmaberry') {
      item = this.dex.forGen(4).items.get('enigmaberry');
    }
    return exists(item, this.dex.gen) ? new Item(item, this.dex.gen) : undefined;
  }

  *[Symbol.iterator]() {
    for (const id in this.dex.data.Items) {
      const i = this.get(id);
      if (i) yield i;
    }
  }
}

class Item implements I.Item {
  readonly kind: 'Item';
  readonly id: I.ID;
  readonly name: I.ItemName;
  readonly megaEvolves?: I.SpeciesName;
  readonly isBerry?: boolean;
  readonly naturalGift?: Readonly<{basePower: number; type: I.TypeName}>;

  constructor(item: D.Item, gen: I.GenerationNum) {
    this.kind = 'Item';
    this.id = item.id as I.ID;
    this.name = item.name as I.ItemName;
    this.megaEvolves = item.megaEvolves as I.SpeciesName;
    this.isBerry = item.isBerry;
    this.naturalGift = item.naturalGift && {
      basePower: item.naturalGift.basePower - (gen === 2 ? 20 : 0),
      type: item.naturalGift.type,
    };
  }
}

class Moves implements I.Moves {
  private readonly dex: D.ModdedDex;

  constructor(dex: D.ModdedDex) {
    this.dex = dex;
  }

  get(name: string) {
    const move = this.dex.moves.get(name);
    return exists(move, this.dex.gen) ? new Move(move, this.dex) : undefined;
  }

  *[Symbol.iterator]() {
    yield NoMove(this.dex);
    for (const id in this.dex.data.Moves) {
      const m = this.get(id);
      if (m) yield m;
    }
  }
}

class Move implements I.Move {
  readonly kind: 'Move';
  readonly id: I.ID;
  readonly name: I.MoveName;
  readonly basePower: number;
  readonly type: I.TypeName;
  readonly category?: I.MoveCategory;
  readonly flags: I.MoveFlags;
  readonly secondaries?: any;
  readonly target?: I.MoveTarget;
  readonly recoil?: [number, number];
  readonly hasCrashDamage?: boolean;
  readonly mindBlownRecoil?: boolean;
  readonly struggleRecoil?: boolean;
  readonly willCrit?: boolean;
  readonly drain?: [number, number];
  readonly priority?: number;
  readonly self?: I.SelfOrSecondaryEffect | null;
  readonly ignoreDefensive?: boolean;
  readonly overrideOffensiveStat?: I.StatIDExceptHP;
  readonly overrideDefensiveStat?: I.StatIDExceptHP;
  readonly overrideOffensivePokemon?: 'target' | 'source';
  readonly overrideDefensivePokemon?: 'target' | 'source';
  readonly breaksProtect?: boolean;
  readonly isZ?: boolean;
  readonly zMove?: {
    basePower?: number;
  };
  readonly isMax?: boolean;
  readonly maxMove?: {
    basePower: number;
  };
  readonly multihit?: number | number[];
  readonly multiaccuracy?: boolean;

  constructor(move: D.Move, dex: D.ModdedDex) {
    this.kind = 'Move';
    this.id = move.id === 'hiddenpower' ? toID(move.name) : move.id as I.ID;
    this.name = move.name as I.MoveName;
    this.basePower = move.basePower;
    this.type = move.type;
    this.overrideOffensiveStat = move.overrideOffensiveStat;
    this.overrideDefensiveStat = move.overrideDefensiveStat;
    this.overrideOffensivePokemon = move.overrideOffensivePokemon;
    this.overrideDefensivePokemon = move.overrideDefensivePokemon;

    if (move.category === 'Status' || dex.gen >= 4) {
      this.category = move.category;
    }

    if (move.recoil) this.recoil = move.recoil;
    if (move.hasCrashDamage) this.hasCrashDamage = move.hasCrashDamage;
    if (move.mindBlownRecoil) this.mindBlownRecoil = move.mindBlownRecoil;
    if (move.struggleRecoil) this.struggleRecoil = move.struggleRecoil;

    const stat = move.category === 'Special' ? 'spa' : 'atk';
    if (move.self?.boosts && move.self.boosts[stat] && move.self.boosts[stat]! < 0) {
      this.self = move.self;
    }

    if (move.multihit) this.multihit = move.multihit;
    if (move.multiaccuracy) this.multiaccuracy = move.multiaccuracy;
    if (move.drain) this.drain = move.drain;
    if (move.willCrit) this.willCrit = move.willCrit;
    if (move.priority > 0) this.priority = move.priority;

    this.flags = {};
    if (dex.gen >= 2) {
      if (move.breaksProtect) this.breaksProtect = move.breaksProtect;
    }
    if (dex.gen >= 3) {
      if (move.flags.contact) this.flags.contact = move.flags.contact;
      if (move.flags.sound) this.flags.sound = move.flags.sound;

      if (['allAdjacent', 'allAdjacentFoes'].includes(move.target)) {
        this.target = move.target;
      }
    }
    if (dex.gen >= 4) {
      if (move.flags.punch) this.flags.punch = move.flags.punch;
      if (move.flags.bite) this.flags.bite = move.flags.bite;
    }
    if (dex.gen >= 5) {
      if (move.ignoreDefensive) this.ignoreDefensive = move.ignoreDefensive;

      if ('secondaries' in move && move.secondaries?.length) {
        this.secondaries = true;
      }
    }
    if (dex.gen >= 6) {
      if (move.flags.bullet) this.flags.bullet = move.flags.bullet;
      if (move.flags.pulse) this.flags.pulse = move.flags.pulse;
    }
    if (dex.gen >= 7) {
      if (move.isZ) this.isZ = true;
      if (move.zMove?.basePower) this.zMove = {basePower: move.zMove.basePower};
    }
    if (dex.gen >= 8) {
      if (move.isMax) this.isMax = true;
      if (move.maxMove) this.maxMove = {basePower: move.maxMove.basePower};
    }
    if (dex.gen >= 9) {
      if (move.flags.wind) this.flags.wind = move.flags.wind;
      if (move.flags.slicing) this.flags.slicing = move.flags.slicing;
    }
  }
}

class Species implements I.Species {
  private readonly dex: D.ModdedDex;

  constructor(dex: D.ModdedDex) {
    this.dex = dex;
  }

  get(name: string) {
    const species = this.dex.species.get(name);
    if (this.dex.gen >= 6 && species.id === 'aegislashboth') return AegislashBoth(this.dex);
    return exists(species, this.dex.gen) ? new Specie(species, this.dex) : undefined;
  }

  *[Symbol.iterator]() {
    for (const id in this.dex.data.Species) {
      const s = this.get(id);
      if (s) {
        if (id === 'aegislash') yield AegislashBoth(this.dex);
        yield s;
      }
    }
  }
}

// Custom Move placeholder
function NoMove(dex: D.ModdedDex) {
  return new Move({
    id: 'nomove' as I.ID,
    name: '(No Move)' as I.MoveName,
    basePower: 0,
    type: 'Normal',
    category: 'Status',
    target: 'any',
    flags: {},
    gen: 1,
    priority: 0,
  } as D.Move, dex);
}

class Specie implements I.Specie {
  readonly kind: 'Species';
  readonly id: I.ID;
  readonly name: I.SpeciesName;

  readonly types: [I.TypeName] | [I.TypeName, I.TypeName];
  readonly baseStats: Readonly<I.StatsTable>;
  readonly weightkg: number;
  readonly nfe?: boolean;
  readonly gender?: I.GenderName;
  readonly otherFormes?: I.SpeciesName[];
  readonly baseSpecies?: I.SpeciesName;
  readonly abilities?: {0: I.AbilityName};

  constructor(species: D.Species, dex: D.ModdedDex) {
    this.kind = 'Species';
    this.id = (species.id === 'aegislash' ? 'aegislashshield' : species.id) as I.ID;
    this.name = (species.name === 'Aegislash' ? 'Aegislash-Shield' : species.name) as I.SpeciesName;
    this.types = species.types;
    this.baseStats = species.baseStats;
    this.weightkg = species.weightkg;

    const nfe = !!species.evos?.some((s: string) => exists(dex.species.get(s), dex.gen));
    if (nfe) this.nfe = nfe;
    if (species.gender === 'N' && dex.gen > 1) this.gender = species.gender;

    const formes = species.otherFormes?.filter((s: string) => exists(dex.species.get(s), dex.gen));
    if (species.id.startsWith('aegislash')) {
      if (species.id === 'aegislashblade') {
        this.otherFormes = ['Aegislash-Shield', 'Aegislash-Both'] as I.SpeciesName[];
      } else {
        this.baseSpecies = 'Aegislash-Blade' as I.SpeciesName;
      }
    } else if (species.id === 'toxtricity') {
      this.otherFormes = [
        'Toxtricity-Gmax', 'Toxtricity-Low-Key', 'Toxtricity-Low-Key-Gmax',
      ] as I.SpeciesName[];
    } else if (species.id === 'toxtricitylowkey') {
      this.baseSpecies = 'Toxtricity' as I.SpeciesName;
    } else if (species.id === 'urshifu') {
      this.otherFormes = [
        'Urshifu-Gmax', 'Urshifu-Rapid-Strike', 'Urshifu-Rapid-Strike-Gmax',
      ] as I.SpeciesName[];
    } else if (species.id === 'eternatus') {
      this.otherFormes = ['Eternatus-Eternamax'] as I.SpeciesName[];
    } else if (formes?.length) {
      this.otherFormes = [...formes].sort() as I.SpeciesName[];
    } else if (species.baseSpecies !== this.name) {
      this.baseSpecies = species.baseSpecies as I.SpeciesName;
    }
    // TODO: clean this up with proper Gigantamax support
    if (dex.gen === 8 && species.canGigantamax &&
        !(species.id.startsWith('toxtricity') || species.id.startsWith('urshifu'))) {
      const formes = this.otherFormes || [];
      const gmax = dex.species.get(`${species.name}-Gmax`);
      if (exists(gmax, dex.gen)) this.otherFormes = [...formes, gmax.name].sort();
    }

    if (dex.gen > 2) this.abilities = {0: species.abilities[0] as I.AbilityName};
  }
}

// Custom Aegislash forme
function AegislashBoth(dex: D.ModdedDex) {
  const shield = dex.species.get('aegislash')!;
  const blade = dex.species.get('aegislashblade')!;
  const baseStats = {
    hp: shield.baseStats.hp,
    atk: blade.baseStats.atk,
    def: shield.baseStats.def,
    spa: blade.baseStats.spa,
    spd: shield.baseStats.spd,
    spe: shield.baseStats.spe,
  };
  return new Specie({
    ...shield,
    baseStats,
    id: 'aegislashboth' as I.ID,
    name: 'Aegislash-Both' as I.SpeciesName,
  } as D.Species, dex);
}

const DAMAGE_TAKEN = [1, 2, 0.5, 0] as I.TypeEffectiveness[];

export class Types implements I.Types {
  private readonly dex: D.ModdedDex;
  private readonly byID: {[id: string]: I.Type};

  constructor(dex: D.ModdedDex) {
    this.dex = dex;

    const unknown = {
      kind: 'Type',
      id: '' as I.ID,
      name: '???',
      effectiveness: {},
    } as I.Type;

    this.byID = {};
    for (const id in this.dex.data.Types) {
      if (!exists(this.dex.types.get(id), this.dex.gen)) continue;
      const name = id[0].toUpperCase() + id.slice(1) as Exclude<I.TypeName, '???'>;

      const effectiveness = {'???': 1} as {[type in I.TypeName]: I.TypeEffectiveness};
      for (const t2ID in this.dex.data.Types) {
        if (!exists(this.dex.types.get(t2ID), this.dex.gen)) continue;
        const t = t2ID[0].toUpperCase() + t2ID.slice(1) as Exclude<I.TypeName, '???'>;
        effectiveness[t] = DAMAGE_TAKEN[this.dex.data.Types[t2ID].damageTaken[name]!];
      }
      (unknown.effectiveness as any)[name] = 1;

      this.byID[id] = {kind: 'Type', id: id as I.ID, name, effectiveness};
    }
    this.byID[unknown.id] = unknown;
  }

  get(name: string) {
    // toID('???') => '', as do many other things, but returning the '???' type seems appropriate :)
    return this.byID[toID(name)];
  }

  *[Symbol.iterator]() {
    for (const id in this.byID) {
      yield this.byID[id];
    }
  }
}

export class Natures implements I.Natures {
  private readonly dex: D.ModdedDex;

  constructor(dex: D.ModdedDex) {
    this.dex = dex;
  }

  get(name: string) {
    const nature = this.dex.natures.get(name);
    return nature.exists ? new Nature(nature) : undefined;
  }

  *[Symbol.iterator]() {
    for (const id in this.dex.data.Natures) {
      const n = this.get(id);
      if (n) yield n;
    }
  }
}

class Nature implements I.Nature {
  readonly kind: 'Nature';
  readonly id: I.ID;
  readonly name: I.NatureName;
  readonly plus: I.StatID;
  readonly minus: I.StatID;

  constructor(nature: D.Nature) {
    this.kind = 'Nature';
    this.id = nature.id as I.ID;
    this.name = nature.name;

    switch (nature.id) {
    case 'hardy':
      this.plus = 'atk';
      this.minus = 'atk';
      break;
    case 'docile':
      this.plus = 'def';
      this.minus = 'def';
      break;
    case 'bashful':
      this.plus = 'spa';
      this.minus = 'spa';
      break;
    case 'quirky':
      this.plus = 'spd';
      this.minus = 'spd';
      break;
    case 'serious':
      this.plus = 'spe';
      this.minus = 'spe';
      break;
    default:
      this.plus = nature.plus!;
      this.minus = nature.minus!;
    }
  }
}

const NATDEX_BANNED = [
  'Pikachu-Cosplay',
  'Pikachu-Rock-Star',
  'Pikachu-Belle',
  'Pikachu-Pop-Star',
  'Pikachu-PhD',
  'Pikachu-Libre',
  'Pichu-Spiky-eared',
  'Floette-Eternal',
];

function exists(val: D.Ability| D.Item | D.Move | D.Species | D.Type, gen: I.GenerationNum) {
  if (!val.exists || val.id === 'noability') return false;
  if (gen === 7 && val.isNonstandard === 'LGPE') return true;
  if (gen >= 8) {
    if (gen === 8) {
      if (('isMax' in val && val.isMax) || val.isNonstandard === 'Gigantamax') return true;
      if (['eternatuseternamax', 'zarude', 'zarudedada'].includes(val.id)) return true;
      if (val.isNonstandard === 'Future') return false;
    }
    if (val.isNonstandard === 'Past' && !NATDEX_BANNED.includes(val.name)) return true;
    if (gen > 8 && 'isZ' in val && val.isZ) return false;
    if (gen > 8 && val.isNonstandard === 'Unobtainable') return true;
  }
  if (gen >= 6 && ['floetteeternal'].includes(val.id)) return true;
  // TODO: clean this up with proper Gigantamax support
  if (val.isNonstandard && !['CAP', 'Unobtainable', 'Gigantamax'].includes(val.isNonstandard)) {
    return false;
  }
  return !('tier' in val && ['Illegal', 'Unreleased'].includes(val.tier));
}
