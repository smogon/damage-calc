import type * as I from './interface';
export interface SpeciesData {
    readonly types: [I.TypeName] | [I.TypeName, I.TypeName];
    readonly bs: {
        hp: number;
        at: number;
        df: number;
        sa?: number;
        sd?: number;
        sl?: number;
        sp: number;
    };
    readonly weightkg: number;
    readonly gender?: I.GenderName;
    readonly nfe?: boolean;
    readonly abilities?: {
        0: string;
    };
    readonly otherFormes?: string[];
    readonly baseSpecies?: string;
}
export declare const SPECIES: {
    [name: string]: SpeciesData;
}[];
export declare class Species implements I.Species {
    private readonly gen;
    constructor(gen: I.GenerationNum);
    get(id: I.ID): Specie;
    [Symbol.iterator](): Generator<Specie, void, unknown>;
}
declare class Specie implements I.Specie {
    readonly kind: 'Species';
    readonly id: I.ID;
    readonly name: I.SpeciesName;
    readonly types: [I.TypeName] | [I.TypeName, I.TypeName];
    readonly baseStats: Readonly<I.StatsTable>;
    readonly weightkg: number;
    readonly gender?: I.GenderName;
    readonly nfe?: boolean;
    readonly abilities?: {
        0: I.AbilityName;
    };
    readonly otherFormes?: I.SpeciesName[];
    readonly baseSpecies?: I.SpeciesName;
    private static readonly EXCLUDE;
    constructor(name: string, data: SpeciesData);
}
export {};
