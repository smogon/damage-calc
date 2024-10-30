"use strict";
exports.__esModule = true;

var field_1 = require("./field");
var gen12_1 = require("./mechanics/gen12");
var gen3_1 = require("./mechanics/gen3");
var gen4_1 = require("./mechanics/gen4");
var gen56_1 = require("./mechanics/gen56");
var gen789_1 = require("./mechanics/gen789");
var MECHANICS = [
    function () { },
    gen12_1.calculateRBYGSC,
    gen12_1.calculateRBYGSC,
    gen3_1.calculateADV,
    gen4_1.calculateDPP,
    gen56_1.calculateBWXY,
    gen56_1.calculateBWXY,
    gen789_1.calculateSMSSSV,
    gen789_1.calculateSMSSSV,
    gen789_1.calculateSMSSSV,
];
function calculate(gen, attacker, defender, move, field) {
    return MECHANICS[gen.num](gen, attacker.clone(), defender.clone(), move.clone(), field ? field.clone() : new field_1.Field());
}
exports.calculate = calculate;
//# sourceMappingURL=calc.js.map