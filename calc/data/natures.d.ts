import * as I from './interface';
export declare const NATURES: {
    [name: string]: [I.StatName, I.StatName];
};
export declare class Natures implements I.Natures {
    get(id: I.ID): Nature;
    [Symbol.iterator](): Generator<Nature, void, unknown>;
}
declare class Nature implements I.Nature {
    readonly kind: 'Nature';
    readonly id: I.ID;
    readonly name: I.NatureName;
    readonly plus?: I.StatName;
    readonly minus?: I.StatName;
    constructor(name: string, [plus, minus]: [I.StatName, I.StatName]);
}
export {};
