import { Stat } from '../stats';

const NATURES: { [name: string]: [Stat?, Stat?] } = {
  Adamant: ['at', 'sa'],
  Bashful: [undefined, undefined],
  Bold: ['df', 'at'],
  Brave: ['at', 'sp'],
  Calm: ['sd', 'at'],
  Careful: ['sd', 'sa'],
  Docile: [undefined, undefined],
  Gentle: ['sd', 'df'],
  Hardy: [undefined, undefined],
  Hasty: ['sp', 'df'],
  Impish: ['df', 'sa'],
  Jolly: ['sp', 'sa'],
  Lax: ['df', 'sd'],
  Lonely: ['at', 'df'],
  Mild: ['sa', 'df'],
  Modest: ['sa', 'at'],
  Naive: ['sp', 'sd'],
  Naughty: ['at', 'sd'],
  Quiet: ['sa', 'sp'],
  Quirky: [undefined, undefined],
  Rash: ['sa', 'sd'],
  Relaxed: ['df', 'sp'],
  Sassy: ['sd', 'sp'],
  Serious: [undefined, undefined],
  Timid: ['sp', 'at'],
};

// TODO: switch to inline exports no longer relying on globals
export { NATURES };
