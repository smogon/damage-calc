export type As<T> = {__brand: T};
export type ID = string & As<'ID'>;
export type GenerationNum = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type GenderName = 'M' | 'F' | 'N';
export type StatName = 'hp' | 'atk' | 'def' | 'spa' | 'spd' | 'spe';

export type AbilityName = string & As<'AbilityName'>;
export type ItemName = string & As<'ItemName'>;
export type MoveName = string & As<'MoveName'>;
export type SpeciesName = string & As<'SpeciesName'>;

export type TypeName =
  | '???'
  | 'Normal'
  | 'Grass'
  | 'Fire'
  | 'Water'
  | 'Electric'
  | 'Ice'
  | 'Flying'
  | 'Bug'
  | 'Poison'
  | 'Ground'
  | 'Rock'
  | 'Fighting'
  | 'Psychic'
  | 'Ghost'
  | 'Dragon'
  | 'Dark'
  | 'Steel'
  | 'Fairy';
export type NatureName =
  | 'Adamant'
  | 'Bashful'
  | 'Bold'
  | 'Brave'
  | 'Calm'
  | 'Careful'
  | 'Docile'
  | 'Gentle'
  | 'Hardy'
  | 'Hasty'
  | 'Impish'
  | 'Jolly'
  | 'Lax'
  | 'Lonely'
  | 'Mild'
  | 'Modest'
  | 'Naive'
  | 'Naughty'
  | 'Quiet'
  | 'Quirky'
  | 'Rash'
  | 'Relaxed'
  | 'Sassy'
  | 'Serious'
  | 'Timid';

export type MoveCategory = 'Physical' | 'Special' | 'Status';
export type MoveRecoil = boolean | number | 'crash' | 'Struggle';

export interface Generations {
  get(gen: GenerationNum): Generation;
}

export interface Generation {
  readonly num: GenerationNum;
  readonly abilities: Abilities;
  readonly items: Items;
  readonly moves: Moves;
  readonly species: Species;
  readonly types: Types;
  readonly natures: Natures;
}

export type DataKind = 'Ability' | 'Item' | 'Move' | 'Species' | 'Type' | 'Nature';

export interface Data<NameT> {
  readonly id: ID;
  readonly name: NameT;
  readonly kind: DataKind;
}

export interface Abilities {
  get(id: ID): Ability | undefined;
  [Symbol.iterator](): IterableIterator<Ability>;
}

export interface Ability extends Data<AbilityName> {
  readonly kind: 'Ability';
}

export interface Items {
  get(id: ID): Item | undefined;
  [Symbol.iterator](): IterableIterator<Item>;
}

export interface Item extends Data<ItemName> {
  readonly kind: 'Item';
  readonly megaEvolves?: SpeciesName;
  readonly isBerry?: boolean;
  readonly naturalGift?: Readonly<{basePower: number; type: TypeName}>;
}

export interface Moves {
  get(id: ID): Move | undefined;
  [Symbol.iterator](): IterableIterator<Move>;
}

export interface Move extends Data<MoveName> {
  readonly kind: 'Move';
  readonly bp: number;
  readonly type: TypeName;
  readonly category?: MoveCategory;
  readonly hasSecondaryEffect?: boolean;
  readonly isSpread?: boolean | 'allAdjacent';
  readonly makesContact?: boolean;
  readonly hasRecoil?: MoveRecoil;
  readonly alwaysCrit?: boolean;
  readonly givesHealth?: boolean;
  readonly percentHealed?: number;
  readonly ignoresBurn?: boolean;
  readonly isPunch?: boolean;
  readonly isBite?: boolean;
  readonly isBullet?: boolean;
  readonly isSound?: boolean;
  readonly isPulse?: boolean;
  readonly hasPriority?: boolean;
  readonly dropsStats?: number;
  readonly ignoresDefenseBoosts?: boolean;
  readonly dealsPhysicalDamage?: boolean;
  readonly bypassesProtect?: boolean;
  readonly isZ?: boolean;
  readonly isMax?: boolean;
  readonly usesHighestAttackStat?: boolean;
  readonly zp?: number;
  readonly maxPower?: number;
  readonly isMultiHit?: boolean;
  readonly isTwoHit?: boolean;
}

export interface Species {
  get(id: ID): Specie | undefined;
  [Symbol.iterator](): IterableIterator<Specie>;
}

// TODO: rename these fields to be readable
export interface Specie {
  readonly kind: 'Species';
  readonly t1: TypeName; // type1
  readonly t2?: TypeName; // type2
  readonly bs: Readonly<{
    hp: number;
    at: number;
    df: number;
    sa: number;
    sd: number;
    sp: number;
    sl?: number;
  }>; // baseStats
  readonly w: number; // weight
  readonly canEvolve?: boolean;
  readonly gender?: GenderName;
  readonly formes?: SpeciesName[];
  readonly isAlternateForme?: boolean;
  readonly ab?: AbilityName; // ability
}

export interface Types {
  get(id: ID): Type | undefined;
  [Symbol.iterator](): IterableIterator<Type>;
}

export type TypeEffectiveness = 0 | 0.5 | 1 | 2;

export interface Type extends Data<TypeName> {
  readonly kind: 'Type';
  readonly category?: MoveCategory;
  readonly damageTaken: Readonly<{[type in TypeName]?: TypeEffectiveness}>;
}

export interface Natures {
  get(id: ID): Nature | undefined;
  [Symbol.iterator](): IterableIterator<Nature>;
}

export interface Nature extends Data<NatureName> {
  readonly kind: 'Nature';
  readonly plus: StatName;
  readonly minus: StatName;
}
