import { RawDesc } from './desc';
import { Generation } from './data/interface';
import { Field } from './field';
import { Move } from './move';
import { Pokemon } from './pokemon';
export declare class Result {
    gen: Generation;
    attacker: Pokemon;
    defender: Pokemon;
    move: Move;
    field: Field;
    damage: number[];
    rawDesc: RawDesc;
    constructor(gen: Generation, attacker: Pokemon, defender: Pokemon, move: Move, field: Field, damage: number[], rawDesc: RawDesc);
    desc(): string;
    fullDesc(notation?: string, err?: boolean): string;
    moveDesc(notation?: string): string;
    recovery(notation?: string): {
        recovery: number[];
        text: string;
    };
    recoil(notation?: string): {
        recoil: number | [number, number];
        text: string;
    };
    kochance(err?: boolean): {
        chance: number;
        n: number;
        text: string;
    } | {
        n: number;
        text: string;
        chance?: undefined;
    };
}
