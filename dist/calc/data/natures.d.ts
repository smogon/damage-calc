import type * as I from './interface';
export declare const NATURES: {
    [name: string]: [I.StatID, I.StatID];
};
export declare class Natures implements I.Natures {
    get(id: I.ID): Nature;
    [Symbol.iterator](): Generator<Nature, void, unknown>;
}
declare class Nature implements I.Nature {
    readonly kind: 'Nature';
    readonly id: I.ID;
    readonly name: I.NatureName;
    readonly plus?: I.StatID;
    readonly minus?: I.StatID;
    constructor(name: string, [plus, minus]: [I.StatID, I.StatID]);
}
export {};
