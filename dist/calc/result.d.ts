import { type RawDesc } from './desc';
import type { Generation } from './data/interface';
import type { Field } from './field';
import type { Move } from './move';
import type { Pokemon } from './pokemon';
export type Damage = number | number[] | [number, number] | [number[], number[]];
export declare class Result {
    gen: Generation;
    attacker: Pokemon;
    defender: Pokemon;
    move: Move;
    field: Field;
    damage: number | number[] | [number[], number[]];
    rawDesc: RawDesc;
    constructor(gen: Generation, attacker: Pokemon, defender: Pokemon, move: Move, field: Field, damage: Damage, rawDesc: RawDesc);
    desc(): string;
    range(): [number, number];
    fullDesc(notation?: string, err?: boolean): string;
    moveDesc(notation?: string): string;
    recovery(notation?: string): {
        recovery: [number, number];
        text: string;
    };
    recoil(notation?: string): {
        recoil: number | [number, number];
        text: string;
    };
    kochance(err?: boolean): {
        chance: number | undefined;
        n: number;
        text: string;
    };
}
export declare function damageRange(damage: Damage): [number, number] | [[number, number], [number, number]];
