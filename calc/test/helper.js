"use strict";
exports.__esModule = true;
var index_1 = require("../index");
var field_1 = require("../field");
var calc = function (gen) { return function (attacker, defender, move, field) { return index_1.calculate(gen, attacker, defender, move, field); }; };
var move = function (gen) { return function (name, options) {
    if (options === void 0) { options = {}; }
    return new index_1.Move(gen, name, options);
}; };
var pokemon = function (gen) { return function (name, options) {
    if (options === void 0) { options = {}; }
    return new index_1.Pokemon(gen, name, options);
}; };
var field = function (field) {
    if (field === void 0) { field = {}; }
    return new field_1.Field(field);
};
var side = function (side) {
    if (side === void 0) { side = {}; }
    return new field_1.Side(side);
};
function inGen(gen, fn) {
    fn({
        gen: gen,
        calculate: calc(gen),
        Move: move(gen),
        Pokemon: pokemon(gen),
        Field: field,
        Side: side
    });
}
exports.inGen = inGen;
function inGens(from, to, fn) {
    for (var gen = from; gen <= to; gen++) {
        inGen(gen, fn);
    }
}
exports.inGens = inGens;
//# sourceMappingURL=helper.js.map