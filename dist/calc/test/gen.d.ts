import * as I from '../data/interface';
import * as D from '@pkmn/dex';
export declare function toID(s: string): I.ID;
export declare class Generations implements I.Generations {
    private readonly dex;
    constructor(dex: D.ModdedDex);
    get(gen: I.GenerationNum): Generation;
}
declare class Generation implements I.Generation {
    dex: D.ModdedDex;
    abilities: Abilities;
    items: Items;
    moves: Moves;
    species: Species;
    types: Types;
    natures: Natures;
    num: I.GenerationNum;
    constructor(dex: D.ModdedDex);
}
declare class Abilities implements I.Abilities {
    private readonly dex;
    constructor(dex: D.ModdedDex);
    get(name: string): Ability | undefined;
    [Symbol.iterator](): Generator<Ability, void, unknown>;
}
declare class Ability implements I.Ability {
    readonly kind: 'Ability';
    readonly id: I.ID;
    readonly name: I.AbilityName;
    constructor(ability: D.Ability);
}
declare class Items implements I.Items {
    private readonly dex;
    constructor(dex: D.ModdedDex);
    get(name: string): Item | undefined;
    [Symbol.iterator](): Generator<Item, void, unknown>;
}
declare class Item implements I.Item {
    readonly kind: 'Item';
    readonly id: I.ID;
    readonly name: I.ItemName;
    readonly megaEvolves?: I.SpeciesName;
    readonly isBerry?: boolean;
    readonly naturalGift?: Readonly<{
        basePower: number;
        type: I.TypeName;
    }>;
    constructor(item: D.Item, gen: I.GenerationNum);
}
declare class Moves implements I.Moves {
    private readonly dex;
    constructor(dex: D.ModdedDex);
    get(name: string): Move | undefined;
    [Symbol.iterator](): Generator<Move, void, unknown>;
}
declare class Move implements I.Move {
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
    readonly defensiveCategory?: I.MoveCategory;
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
    constructor(move: D.Move, dex: D.ModdedDex);
}
declare class Species implements I.Species {
    private readonly dex;
    constructor(dex: D.ModdedDex);
    get(name: string): Specie | undefined;
    [Symbol.iterator](): Generator<Specie, void, unknown>;
}
declare class Specie implements I.Specie {
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
    readonly abilities?: {
        0: I.AbilityName;
    };
    constructor(species: D.Species, dex: D.ModdedDex);
}
export declare class Types implements I.Types {
    private readonly dex;
    private readonly byID;
    constructor(dex: D.ModdedDex);
    get(name: string): I.Type;
    [Symbol.iterator](): Generator<I.Type, void, unknown>;
}
export declare class Natures implements I.Natures {
    private readonly dex;
    constructor(dex: D.ModdedDex);
    get(name: string): Nature | undefined;
    [Symbol.iterator](): Generator<Nature, void, unknown>;
}
declare class Nature implements I.Nature {
    readonly kind: 'Nature';
    readonly id: I.ID;
    readonly name: I.NatureName;
    readonly plus: I.StatName;
    readonly minus: I.StatName;
    constructor(nature: D.Nature);
}
export {};
