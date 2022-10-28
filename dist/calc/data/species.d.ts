import * as I from './interface';
export interface SpeciesData {
    readonly types: [I.TypeName] | [I.TypeName, I.TypeName];
    readonly bs: {
        hp: number;
        at: number;
        df: number;
        sa?: number;
        sd?: number;
        sp: number;
        sl?: number;
    };
    readonly weightkg: number;
    readonly nfe?: boolean;
    readonly gender?: I.GenderName;
    readonly otherFormes?: string[];
    readonly baseSpecies?: string;
    readonly abilities?: {
        0: string;
    };
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
    readonly nfe?: boolean;
    readonly gender?: I.GenderName;
    readonly otherFormes?: I.SpeciesName[];
    readonly baseSpecies?: I.SpeciesName;
    readonly abilities?: {
        0: I.AbilityName;
    };
    private static readonly EXCLUDE;
    constructor(name: string, data: SpeciesData);
}
export {};
