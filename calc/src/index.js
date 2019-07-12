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

// The object that we intend to expose in an environment without modules.
var calc = calc || exports;

// FIXME: convert everything to Typescript so this all just turns into export
// statements and actually works in a module environment.

calc.calculate = calculate;

calc.Pokemon = Pokemon;
calc.Move = Move;
calc.Field = Field;
calc.Side = Side;

calc.ABILITIES = ABILITIES;
calc.ITEMS = ITEMS;
calc.MOVES = MOVES;
calc.SPECIES = SPECIES;
calc.NATURES = NATURES;
calc.TYPE_CHART = TYPE_CHART;
calc.STATS = STATS;

calc.getZMoveName = getZMoveName;

// TODO: Description/KO Chance will be exposed through a 'Result' type.
calc.buildDescription = buildDescription;
calc.getKOChanceText = getKOChanceText;

// TODO: Migrate all to standard stat notation and turn this into a 'displayStat' function.
calc.toSmogonStat = toSmogonStat;

// TODO: expose a single calcStat(gen, ...) method.
calc.calcStatRBYFromDV = calcStatRBYFromDV;
calc.calcStatADV = calcStatADV;

// TODO: remove, just use literals.
calc.HP = HP;
calc.AT = AT;
calc.DF = DF;
calc.SP = SP;
calc.SD = SD;
calc.SL = SL;
calc.SA = SA;
