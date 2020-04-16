"use strict";
exports.__esModule = true;
var desc_1 = require("./desc");
var Result = (function () {
    function Result(gen, attacker, defender, move, field, damage, rawDesc) {
        this.gen = gen;
        this.attacker = attacker;
        this.defender = defender;
        this.move = move;
        this.field = field;
        this.damage = damage;
        this.rawDesc = rawDesc;
    }
    Result.prototype.desc = function () {
        return this.fullDesc();
    };
    Result.prototype.fullDesc = function (notation, err) {
        if (notation === void 0) { notation = '%'; }
        if (err === void 0) { err = true; }
        return desc_1.display(this.gen, this.attacker, this.defender, this.move, this.field, this.damage, this.rawDesc, notation, err);
    };
    Result.prototype.moveDesc = function (notation) {
        if (notation === void 0) { notation = '%'; }
        return desc_1.displayMove(this.gen, this.attacker, this.defender, this.move, this.damage, notation);
    };
    Result.prototype.recovery = function (notation) {
        if (notation === void 0) { notation = '%'; }
        return desc_1.getRecovery(this.gen, this.attacker, this.defender, this.move, this.damage, notation);
    };
    Result.prototype.recoil = function (notation) {
        if (notation === void 0) { notation = '%'; }
        return desc_1.getRecoil(this.gen, this.attacker, this.defender, this.move, this.damage, notation);
    };
    Result.prototype.kochance = function (err) {
        if (err === void 0) { err = true; }
        return desc_1.getKOChance(this.gen, this.attacker, this.defender, this.move, this.field, this.damage, err);
    };
    return Result;
}());
exports.Result = Result;
//# sourceMappingURL=result.js.map