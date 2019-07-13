// When using this library in the browser, a bundler like Webpack should be
// used to encapsulate the various interdependencies between internal packages.
// However, if you are requiring contents of this package in HTML <script>
// tags, the following loading order is required:
//
//   - util.js
//   - stats.js
//
//   - data/species.js
//   - data/types.js
//   - data/natures.js
//   - data/abilities.js
//   - data/moves.js
//   - data/items.js
//
//   - pokemon.js
//   - field.js
//   - move.js
//
//   - mechanics/util.js
//   - mechanics/gen7.js
//   - mechanics/gen6.js
//   - mechanics/gen5.js
//   - mechanics/gen4.js
//   - mechanics/gen3.js
//   - mechanics/gen2.js
//   - mechanics/gen1.js
//
//   - calc.js
//   - desc.js
//
//   - index.js
//
// Furthermore, before anything is loaded, the following is required:
//
// <script type="text/javascript">
//		var calc = exports = {};
//		function require() { return exports; };
//	</script>

// If we're not being used as a module we're just going to rely on globals and
// that the correct loading order being followed.

export { calculate } from './calc';
export { Pokemon } from './pokemon';
export { Move } from './move';
export { Field, Side } from './field';

export { ABILITIES } from './data/abilities';
export { ITEMS } from './data/items';
// TODO: encapsulate getZMoveName and stop exporting
export { MOVES, getZMoveName } from './data/moves';
export { SPECIES } from './data/species';
export { NATURES } from './data/natures';
export { TYPE_CHART } from './data/types';
// TODO: Migrate all to standard stat notation and turn this into a 'displayStat' function.
// TODO: expose a single calcStat(gen, ...) method.
// TODO: remove stat constants, just use literals.
export {
  STATS,
  HP,
  AT,
  DF,
  SA,
  SD,
  SP,
  SL,
  toSmogonStat,
  calcStatRBYFromDV,
  calcStatADV,
} from './stats';

// TODO: Description/KO Chance will be exposed through a 'Result' type.
export { buildDescription, getKOChanceText } from './desc';
