import * as I from './interface';
export declare type TypeChart = {
    [type in I.TypeName]?: {
        [type in I.TypeName]?: number;
    };
};
export declare const TYPE_CHART: TypeChart[];
export declare class Types implements I.Types {
    private readonly gen;
    constructor(gen: I.GenerationNum);
    get(id: I.ID): Type;
    [Symbol.iterator](): Generator<Type, void, unknown>;
}
declare class Type implements I.Type {
    readonly kind: 'Type';
    readonly id: I.ID;
    readonly name: I.TypeName;
    readonly effectiveness: Readonly<{
        [type in I.TypeName]?: I.TypeEffectiveness;
    }>;
    constructor(name: string, effectiveness: TypeChart[I.TypeName]);
}
export {};
