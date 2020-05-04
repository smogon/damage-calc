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
    Result.prototype.range = function () {
        var range = damageRange(this.damage);
        if (typeof range[0] === 'number')
            return range;
        var d = range;
        return [d[0][0] + d[0][1], d[1][0] + d[1][1]];
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
function damageRange(damage) {
    if (typeof damage === 'number')
        return [damage, damage];
    if (damage.length > 2) {
        var d_1 = damage;
        if (d_1[0] > d_1[d_1.length - 1])
            return [Math.min.apply(Math, d_1), Math.max.apply(Math, d_1)];
        return [d_1[0], d_1[d_1.length - 1]];
    }
    if (typeof damage[0] === 'number' && typeof damage[1] === 'number') {
        return [[damage[0], damage[1]], [damage[0], damage[1]]];
    }
    var d = damage;
    if (d[0][0] > d[0][d[0].length - 1])
        d[0] = d[0].slice().sort();
    if (d[1][0] > d[1][d[1].length - 1])
        d[1] = d[1].slice().sort();
    return [[d[0][0], d[1][0]], [d[0][d[0].length - 1], d[1][d[1].length - 1]]];
}
exports.damageRange = damageRange;
//# sourceMappingURL=result.js.map