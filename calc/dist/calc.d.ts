import { Field } from './field';
import type { Generation } from './data/interface';
import type { Move } from './move';
import type { Pokemon } from './pokemon';
import type { Result } from './result';
export declare function calculate(gen: Generation, attacker: Pokemon, defender: Pokemon, move: Move, field?: Field): Result;
