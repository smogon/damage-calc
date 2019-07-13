import { makeCalculate } from './gen7';

const XY = 6;

const calculateXY = makeCalculate(XY);

// TODO: switch to inline exports no longer relying on globals
export { calculateXY };
