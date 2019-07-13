import { makeCalculate } from './gen7';

const BW = 5;

const calculateBW = makeCalculate(BW);

// TODO: switch to inline exports no longer relying on globals
export { calculateBW };
