"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
exports.__esModule = true;
exports.multiDamageRange = exports.damageRange = exports.Result = void 0;
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
        var _a = __read(damageRange(this.damage), 2), min = _a[0], max = _a[1];
        return [min, max];
    };
    Result.prototype.fullDesc = function (notation, err) {
        if (notation === void 0) { notation = '%'; }
        if (err === void 0) { err = true; }
        return (0, desc_1.display)(this.gen, this.attacker, this.defender, this.move, this.field, this.damage, this.rawDesc, notation, err);
    };
    Result.prototype.moveDesc = function (notation) {
        if (notation === void 0) { notation = '%'; }
        return (0, desc_1.displayMove)(this.gen, this.attacker, this.defender, this.move, this.damage, notation);
    };
    Result.prototype.recovery = function (notation) {
        if (notation === void 0) { notation = '%'; }
        return (0, desc_1.getRecovery)(this.gen, this.attacker, this.defender, this.move, this.damage, notation);
    };
    Result.prototype.recoil = function (notation) {
        if (notation === void 0) { notation = '%'; }
        return (0, desc_1.getRecoil)(this.gen, this.attacker, this.defender, this.move, this.damage, notation);
    };
    Result.prototype.kochance = function (err) {
        if (err === void 0) { err = true; }
        return (0, desc_1.getKOChance)(this.gen, this.attacker, this.defender, this.move, this.field, this.damage, err);
    };
    return Result;
}());
exports.Result = Result;
function damageRange(damage) {
    var range = multiDamageRange(damage);
    if (typeof range[0] === 'number')
        return range;
    var d = range;
    var summedRange = [0, 0];
    for (var i = 0; i < d[0].length; i++) {
        summedRange[0] += d[0][i];
        summedRange[1] += d[1][i];
    }
    return summedRange;
}
exports.damageRange = damageRange;
function multiDamageRange(damage) {
    var e_1, _a;
    if (typeof damage === 'number')
        return [damage, damage];
    if (typeof damage[0] !== 'number') {
        damage = damage;
        var ranges = [[], []];
        try {
            for (var damage_1 = __values(damage), damage_1_1 = damage_1.next(); !damage_1_1.done; damage_1_1 = damage_1.next()) {
                var damageList = damage_1_1.value;
                ranges[0].push(damageList[0]);
                ranges[1].push(damageList[damageList.length - 1]);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (damage_1_1 && !damage_1_1.done && (_a = damage_1["return"])) _a.call(damage_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return ranges;
    }
    var d = damage;
    if (d.length < 16) {
        return [d, d];
    }
    return [d[0], d[d.length - 1]];
}
exports.multiDamageRange = multiDamageRange;
//# sourceMappingURL=result.js.map