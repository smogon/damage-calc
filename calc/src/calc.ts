import { Field } from './field';
import { Move } from './move';
import { Pokemon } from './pokemon';
import { Result } from './result';

import { calculateRBY } from './mechanics/gen1';
import { calculateGSC } from './mechanics/gen2';
import { calculateADV } from './mechanics/gen3';
import { calculateDPP } from './mechanics/gen4';
import { calculateBW } from './mechanics/gen5';
import { calculateXY } from './mechanics/gen6';
import { calculateSM } from './mechanics/gen7';

const MECHANICS = [
  () => {},
  calculateRBY,
  calculateGSC,
  calculateADV,
  calculateDPP,
  calculateBW,
  calculateXY,
  calculateSM,
];

export function calculate(
  gen: 1 | 2 | 3 | 4 | 5 | 6 | 7,
  attacker: Pokemon,
  defender: Pokemon,
  move: Move,
  field?: Field
) {
  // TODO: clone here to prevent mutating what is passed in
  return MECHANICS[gen](attacker, defender, move, field || new Field()) as Result;
}
