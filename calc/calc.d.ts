import { Field } from './field';
import { Generation } from './data/interface';
import { Move } from './move';
import { Pokemon } from './pokemon';
import { Result } from './result';
export declare function calculate(gen: Generation, attacker: Pokemon, defender: Pokemon, move: Move, field?: Field): Result;
