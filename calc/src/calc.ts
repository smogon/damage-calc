import {Field} from './field';
import {Generation} from './data/interface';
import {Move} from './move';
import {Pokemon} from './pokemon';
import {Result} from './result';

import {calculateRBY} from './mechanics/gen1';
import {calculateGSC} from './mechanics/gen2';
import {calculateADV} from './mechanics/gen3';
import {calculateDPP} from './mechanics/gen4';
import {calculateModern} from './mechanics/modern';

const MECHANICS = [
  () => {},
  calculateRBY,
  calculateGSC,
  calculateADV,
  calculateDPP,
  calculateModern,
  calculateModern,
  calculateModern,
  calculateModern,
];

export function calculate(
  gen: Generation,
  attacker: Pokemon,
  defender: Pokemon,
  move: Move,
  field?: Field
) {
  return MECHANICS[gen.num](
    gen,
    attacker.clone(),
    defender.clone(),
    move.clone(),
    field ? field.clone() : new Field()
  ) as Result;
}
