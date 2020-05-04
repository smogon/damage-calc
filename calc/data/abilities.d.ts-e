import * as I from './interface';
export declare const ABILITIES: string[][];
export declare class Abilities implements I.Abilities {
    private readonly gen;
    constructor(gen: I.GenerationNum);
    get(id: I.ID): Ability;
    [Symbol.iterator](): Generator<Ability, void, unknown>;
}
declare class Ability implements I.Ability {
    readonly kind: 'Ability';
    readonly id: I.ID;
    readonly name: I.AbilityName;
    constructor(name: string);
}
export {};
