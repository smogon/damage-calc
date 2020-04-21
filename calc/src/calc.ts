import {Field} from './field';
import {Generation} from './data/interface';
import {Move} from './move';
import {Pokemon} from './pokemon';
import {Result} from './result';

import {calculateRBYGSC} from './mechanics/gen12';
import {calculateADV} from './mechanics/gen3';
import {calculateDPP} from './mechanics/gen4';
import {calculateBWXY} from './mechanics/gen56';
import {calculateSMSS} from './mechanics/gen78';

const MECHANICS = [
  () => {},
  calculateRBYGSC,
  calculateRBYGSC,
  calculateADV,
  calculateDPP,
  calculateBWXY,
  calculateBWXY,
  calculateSMSS,
  calculateSMSS,
];

export function calculate(
  gen: Generation,
  attacker: Pokemon,
  defender: Pokemon,
  move: Move,
  field?: Field,
) {
  return MECHANICS[gen.num](
    gen,
    attacker.clone(),
    defender.clone(),
    move.clone(),
    field ? field.clone() : new Field()
  ) as Result;
}
