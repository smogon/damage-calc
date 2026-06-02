import type { ID } from './data/interface';
export declare function toID(text: any): ID;
export declare function error(err: boolean, msg: string): void;
export declare function assignWithout(a: {
    [key: string]: any;
}, b: {
    [key: string]: any;
}, exclude: Set<string>): void;
export type Primitive = string | number | boolean | bigint | symbol | undefined | null;
export type Builtin = Primitive | Function | Date | Error | RegExp;
export type IsTuple<T> = T extends [infer A] ? T : T extends [infer A, infer B] ? T : T extends [infer A, infer B, infer C] ? T : T extends [infer A, infer B, infer C, infer D] ? T : T extends [infer A, infer B, infer C, infer D, infer E] ? T : never;
export type DeepPartial<T> = T extends Builtin ? T : T extends Map<infer K, infer V> ? Map<DeepPartial<K>, DeepPartial<V>> : T extends ReadonlyMap<infer K, infer V> ? ReadonlyMap<DeepPartial<K>, DeepPartial<V>> : T extends Set<infer U> ? Set<DeepPartial<U>> : T extends ReadonlySet<infer U> ? ReadonlySet<DeepPartial<U>> : T extends Array<infer U> ? T extends IsTuple<T> ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Array<DeepPartial<U>> : T extends Promise<infer U> ? Promise<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export declare function extend(this: any, ...args: any[]): any;
