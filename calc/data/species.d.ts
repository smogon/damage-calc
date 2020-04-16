import * as I from './interface';
export interface SpeciesData {
    readonly t1: I.TypeName;
    readonly t2?: I.TypeName;
    readonly bs: {
        hp: number;
        at: number;
        df: number;
        sa?: number;
        sd?: number;
        sp: number;
        sl?: number;
    };
    readonly w: number;
    readonly canEvolve?: boolean;
    readonly gender?: I.GenderName;
    readonly formes?: string[];
    readonly isAlternateForme?: boolean;
    readonly ab?: string;
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
    readonly t1: I.TypeName;
    readonly t2?: I.TypeName;
    readonly bs: {
        hp: number;
        at: number;
        df: number;
        sa: number;
        sd: number;
        sp: number;
        sl?: number;
    };
    readonly w: number;
    readonly canEvolve?: boolean;
    readonly gender?: I.GenderName;
    readonly formes?: I.SpeciesName[];
    readonly isAlternateForme?: boolean;
    readonly ab?: I.AbilityName;
    constructor(name: string, data: SpeciesData);
}
export {};
