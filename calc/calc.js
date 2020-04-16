"use strict";
exports.__esModule = true;
var field_1 = require("./field");
var gen1_1 = require("./mechanics/gen1");
var gen2_1 = require("./mechanics/gen2");
var gen3_1 = require("./mechanics/gen3");
var gen4_1 = require("./mechanics/gen4");
var gen56_1 = require("./mechanics/gen56");
var gen78_1 = require("./mechanics/gen78");
var MECHANICS = [
    function () { },
    gen1_1.calculateRBY,
    gen2_1.calculateGSC,
    gen3_1.calculateADV,
    gen4_1.calculateDPP,
    gen56_1.calculateBWXY,
    gen56_1.calculateBWXY,
    gen78_1.calculateSMSS,
    gen78_1.calculateSMSS,
];
function calculate(gen, attacker, defender, move, field) {
    return MECHANICS[gen.num](gen, attacker.clone(), defender.clone(), move.clone(), field ? field.clone() : new field_1.Field());
}
exports.calculate = calculate;
//# sourceMappingURL=calc.js.map