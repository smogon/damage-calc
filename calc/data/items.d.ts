import * as I from './interface';
export declare const MEGA_STONES: {
    [species: string]: string;
};
export declare const ITEMS: string[][];
export declare class Items implements I.Items {
    private readonly gen;
    constructor(gen: I.GenerationNum);
    get(id: I.ID): Item;
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
    constructor(name: string, gen: number);
}
export {};
