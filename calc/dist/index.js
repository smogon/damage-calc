"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
exports.__esModule = true;
exports.Stats = exports.STATS = exports.TYPE_CHART = exports.NATURES = exports.SPECIES = exports.MOVES = exports.MEGA_STONES = exports.ITEMS = exports.ABILITIES = exports.toID = exports.Generations = exports.Result = exports.Side = exports.Field = exports.calcStat = exports.Pokemon = exports.Move = exports.calculate = void 0;
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
__createBinding(exports, field_1, "Field");
__createBinding(exports, field_1, "Side");
var result_1 = require("./result");
__createBinding(exports, result_1, "Result");
var index_1 = require("./data/index");
__createBinding(exports, index_1, "Generations");
var util_1 = require("./util");
__createBinding(exports, util_1, "toID");
var abilities_1 = require("./data/abilities");
__createBinding(exports, abilities_1, "ABILITIES");
var items_1 = require("./data/items");
__createBinding(exports, items_1, "ITEMS");
__createBinding(exports, items_1, "MEGA_STONES");
var moves_1 = require("./data/moves");
__createBinding(exports, moves_1, "MOVES");
var species_1 = require("./data/species");
__createBinding(exports, species_1, "SPECIES");
var natures_1 = require("./data/natures");
__createBinding(exports, natures_1, "NATURES");
var types_1 = require("./data/types");
__createBinding(exports, types_1, "TYPE_CHART");
var stats_1 = require("./stats");
__createBinding(exports, stats_1, "STATS");
__createBinding(exports, stats_1, "Stats");
//# sourceMappingURL=index.js.map