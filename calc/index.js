"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var data_1 = require("./data");
var A = __importStar(require("./adaptable"));
var Acalculate = exports.calculate;
function calculate(gen, attacker, defender, move, field) {
    return (Acalculate || A.calculate)(typeof gen === 'number' ? data_1.Generations.get(gen) : gen, attacker, defender, move, field);
}
exports.calculate = calculate;
var Move = (function (_super) {
    __extends(Move, _super);
    function Move(gen, name, options) {
        if (options === void 0) { options = {}; }
        return _super.call(this, typeof gen === 'number' ? data_1.Generations.get(gen) : gen, name, options) || this;
    }
    return Move;
}(A.Move));
exports.Move = Move;
var Pokemon = (function (_super) {
    __extends(Pokemon, _super);
    function Pokemon(gen, name, options) {
        if (options === void 0) { options = {}; }
        return _super.call(this, typeof gen === 'number' ? data_1.Generations.get(gen) : gen, name, options) || this;
    }
    Pokemon.getForme = function (gen, speciesName, item, moveName) {
        return A.Pokemon.getForme(typeof gen === 'number' ? data_1.Generations.get(gen) : gen, speciesName, item, moveName);
    };
    return Pokemon;
}(A.Pokemon));
exports.Pokemon = Pokemon;
function calcStat(gen, stat, base, iv, ev, level, nature) {
    return A.Stats.calcStat(typeof gen === 'number' ? data_1.Generations.get(gen) : gen, stat === 'spc' ? 'spa' : stat, base, iv, ev, level, nature);
}
exports.calcStat = calcStat;
var field_1 = require("./field");
exports.Field = field_1.Field;
exports.Side = field_1.Side;
var result_1 = require("./result");
exports.Result = result_1.Result;
var index_1 = require("./data/index");
exports.Generations = index_1.Generations;
var util_1 = require("./util");
exports.toID = util_1.toID;
var abilities_1 = require("./data/abilities");
exports.ABILITIES = abilities_1.ABILITIES;
var items_1 = require("./data/items");
exports.ITEMS = items_1.ITEMS;
exports.MEGA_STONES = items_1.MEGA_STONES;
var moves_1 = require("./data/moves");
exports.MOVES = moves_1.MOVES;
var species_1 = require("./data/species");
exports.SPECIES = species_1.SPECIES;
var natures_1 = require("./data/natures");
exports.NATURES = natures_1.NATURES;
var types_1 = require("./data/types");
exports.TYPE_CHART = types_1.TYPE_CHART;
var stats_1 = require("./stats");
exports.STATS = stats_1.STATS;
exports.Stats = stats_1.Stats;
//# sourceMappingURL=index.js.map