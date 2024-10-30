import type { Generation } from '../data/interface';
import type { Field } from '../field';
import type { Move } from '../move';
import type { Pokemon } from '../pokemon';
import { Result } from '../result';
export declare function calculateRBYGSC(gen: Generation, attacker: Pokemon, defender: Pokemon, move: Move, field: Field): Result;
