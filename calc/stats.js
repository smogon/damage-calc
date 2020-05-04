"use strict";
exports.__esModule = true;
var util_1 = require("./util");
var RBY = ['hp', 'atk', 'def', 'spc', 'spe'];
var GSC = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
var ADV = GSC;
var DPP = GSC;
var BW = GSC;
var XY = GSC;
var SM = GSC;
var SS = GSC;
exports.STATS = [[], RBY, GSC, ADV, DPP, BW, XY, SM, SS];
exports.Stats = new ((function () {
    function class_1() {
    }
    class_1.prototype.displayStat = function (stat) {
        switch (stat) {
            case 'hp':
                return 'HP';
            case 'atk':
                return 'Atk';
            case 'def':
                return 'Def';
            case 'spa':
                return 'SpA';
            case 'spd':
                return 'SpD';
            case 'spe':
                return 'Spe';
            case 'spc':
                return 'Spc';
            default:
                throw new Error("unknown stat " + stat);
        }
    };
    class_1.prototype.shortForm = function (stat) {
        switch (stat) {
            case 'hp':
                return 'hp';
            case 'atk':
                return 'at';
            case 'def':
                return 'df';
            case 'spa':
                return 'sa';
            case 'spd':
                return 'sd';
            case 'spe':
                return 'sp';
            case 'spc':
                return 'sl';
        }
    };
    class_1.prototype.getHPDV = function (ivs) {
        return ((this.IVToDV(ivs.atk) % 2) * 8 +
            (this.IVToDV(ivs.def) % 2) * 4 +
            (this.IVToDV(ivs.spe) % 2) * 2 +
            (this.IVToDV(ivs.spc) % 2));
    };
    class_1.prototype.IVToDV = function (iv) {
        return Math.floor(iv / 2);
    };
    class_1.prototype.DVToIV = function (dv) {
        return dv * 2 + 1;
    };
    class_1.prototype.calcStat = function (gen, stat, base, iv, ev, level, nature) {
        if (gen.num < 1 || gen.num > 8)
            throw new Error("Invalid generation " + gen.num);
        if (gen.num < 3)
            return this.calcStatRBY(stat, base, iv, level);
        return this.calcStatADV(gen.natures, stat, base, iv, ev, level, nature);
    };
    class_1.prototype.calcStatADV = function (natures, stat, base, iv, ev, level, nature) {
        if (stat === 'hp') {
            return base === 1
                ? base
                : Math.floor(((base * 2 + iv + Math.floor(ev / 4)) * level) / 100) + level + 10;
        }
        else {
            var mods = [undefined, undefined];
            if (nature) {
                var nat = natures.get(util_1.toID(nature));
                mods = [nat === null || nat === void 0 ? void 0 : nat.plus, nat === null || nat === void 0 ? void 0 : nat.minus];
            }
            var n = mods[0] === stat && mods[1] === stat
                ? 1
                : mods[0] === stat
                    ? 1.1
                    : mods[1] === stat
                        ? 0.9
                        : 1;
            return Math.floor((Math.floor(((base * 2 + iv + Math.floor(ev / 4)) * level) / 100) + 5) * n);
        }
    };
    class_1.prototype.calcStatRBY = function (stat, base, iv, level) {
        return this.calcStatRBYFromDV(stat, base, this.IVToDV(iv), level);
    };
    class_1.prototype.calcStatRBYFromDV = function (stat, base, dv, level) {
        if (stat === 'hp') {
            return Math.floor((((base + dv) * 2 + 63) * level) / 100) + level + 10;
        }
        else {
            return Math.floor((((base + dv) * 2 + 63) * level) / 100) + 5;
        }
    };
    return class_1;
}()))();
//# sourceMappingURL=stats.js.map