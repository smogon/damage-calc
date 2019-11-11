import {Field} from './field';
import {Generation} from './gen';
import {Move} from './move';
import {Pokemon} from './pokemon';
import {Result} from './result';

import {calculateRBY} from './mechanics/gen1';
import {calculateGSC} from './mechanics/gen2';
import {calculateADV} from './mechanics/gen3';
import {calculateDPP} from './mechanics/gen4';
import {calculateBW} from './mechanics/gen5';
import {calculateXY} from './mechanics/gen6';
import {calculateSM} from './mechanics/gen7';
import {calculateSS} from './mechanics/gen8';

const MECHANICS = [
  () => {},
  calculateRBY,
  calculateGSC,
  calculateADV,
  calculateDPP,
  calculateBW,
  calculateXY,
  calculateSM,
  calculateSS,
];

export function calculate(
  gen: Generation,
  attacker: Pokemon,
  defender: Pokemon,
  move: Move,
  field?: Field
) {
  return MECHANICS[gen](
    attacker.clone(),
    defender.clone(),
    move.clone(),
    field ? field.clone() : new Field()
  ) as Result;
}
