import { Generation } from '../data/interface';
import { Pokemon } from '../pokemon';
import { Move } from '../move';
import { Field } from '../field';
import { Result } from '../result';
export declare function calculateADV(gen: Generation, attacker: Pokemon, defender: Pokemon, move: Move, field: Field): Result;
