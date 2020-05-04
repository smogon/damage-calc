import { ID } from './data/interface';
declare type Primitive = string | number | boolean | bigint | symbol | undefined | null;
export declare type DeepPartial<T> = T extends Primitive ? T : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export declare function toID(text: any): ID;
export declare function error(err: boolean, msg: string): void;
export declare function assignWithout(a: {
    [key: string]: any;
}, b: {
    [key: string]: any;
}, exclude: Set<string>): void;
export declare function extend(this: any, ...args: any[]): any;
export {};
