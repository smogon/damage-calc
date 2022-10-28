"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
var e_1, _a;
exports.__esModule = true;

var util_1 = require("../util");
var RBY = {
    '???': {
        Normal: 1,
        Grass: 1,
        Fire: 1,
        Water: 1,
        Electric: 1,
        Ice: 1,
        Flying: 1,
        Bug: 1,
        Poison: 1,
        Ground: 1,
        Rock: 1,
        Fighting: 1,
        Psychic: 1,
        Ghost: 1,
        Dragon: 1
    },
    Normal: {
        '???': 1,
        Normal: 1,
        Grass: 1,
        Fire: 1,
        Water: 1,
        Electric: 1,
        Ice: 1,
        Flying: 1,
        Bug: 1,
        Poison: 1,
        Ground: 1,
        Rock: 0.5,
        Fighting: 1,
        Psychic: 1,
        Ghost: 0,
        Dragon: 1
    },
    Grass: {
        '???': 1,
        Normal: 1,
        Grass: 0.5,
        Fire: 0.5,
        Water: 2,
        Electric: 1,
        Ice: 1,
        Flying: 0.5,
        Bug: 0.5,
        Poison: 0.5,
        Ground: 2,
        Rock: 2,
        Fighting: 1,
        Psychic: 1,
        Ghost: 1,
        Dragon: 0.5
    },
    Fire: {
        '???': 1,
        Normal: 1,
        Grass: 2,
        Fire: 0.5,
        Water: 0.5,
        Electric: 1,
        Ice: 2,
        Flying: 1,
        Bug: 2,
        Poison: 1,
        Ground: 1,
        Rock: 0.5,
        Fighting: 1,
        Psychic: 1,
        Ghost: 1,
        Dragon: 0.5
    },
    Water: {
        '???': 1,
        Normal: 1,
        Grass: 0.5,
        Fire: 2,
        Water: 0.5,
        Electric: 1,
        Ice: 1,
        Flying: 1,
        Bug: 1,
        Poison: 1,
        Ground: 2,
        Rock: 2,
        Fighting: 1,
        Psychic: 1,
        Ghost: 1,
        Dragon: 0.5
    },
    Electric: {
        '???': 1,
        Normal: 1,
        Grass: 0.5,
        Fire: 1,
        Water: 2,
        Electric: 0.5,
        Ice: 1,
        Flying: 2,
        Bug: 1,
        Poison: 1,
        Ground: 0,
        Rock: 1,
        Fighting: 1,
        Psychic: 1,
        Ghost: 1,
        Dragon: 0.5
    },
    Ice: {
        '???': 1,
        Normal: 1,
        Grass: 2,
        Fire: 1,
        Water: 0.5,
        Electric: 1,
        Ice: 0.5,
        Flying: 2,
        Bug: 1,
        Poison: 1,
        Ground: 2,
        Rock: 1,
        Fighting: 1,
        Psychic: 1,
        Ghost: 1,
        Dragon: 2
    },
    Flying: {
        '???': 1,
        Normal: 1,
        Grass: 2,
        Fire: 1,
        Water: 1,
        Electric: 0.5,
        Ice: 1,
        Flying: 1,
        Bug: 2,
        Poison: 1,
        Ground: 1,
        Rock: 0.5,
        Fighting: 2,
        Psychic: 1,
        Ghost: 1,
        Dragon: 1
    },
    Bug: {
        '???': 1,
        Normal: 1,
        Grass: 2,
        Fire: 0.5,
        Water: 1,
        Electric: 1,
        Ice: 1,
        Flying: 0.5,
        Bug: 1,
        Poison: 2,
        Ground: 1,
        Rock: 1,
        Fighting: 0.5,
        Psychic: 2,
        Ghost: 0.5,
        Dragon: 1
    },
    Poison: {
        '???': 1,
        Normal: 1,
        Grass: 2,
        Fire: 1,
        Water: 1,
        Electric: 1,
        Ice: 1,
        Flying: 1,
        Bug: 2,
        Poison: 0.5,
        Ground: 0.5,
        Rock: 0.5,
        Fighting: 1,
        Psychic: 1,
        Ghost: 0.5,
        Dragon: 1
    },
    Ground: {
        '???': 1,
        Normal: 1,
        Grass: 0.5,
        Fire: 2,
        Water: 1,
        Electric: 2,
        Ice: 1,
        Flying: 0,
        Bug: 0.5,
        Poison: 2,
        Ground: 1,
        Rock: 2,
        Fighting: 1,
        Psychic: 1,
        Ghost: 1,
        Dragon: 1
    },
    Rock: {
        '???': 1,
        Normal: 1,
        Grass: 1,
        Fire: 2,
        Water: 1,
        Electric: 1,
        Ice: 2,
        Flying: 2,
        Bug: 2,
        Poison: 1,
        Ground: 0.5,
        Rock: 1,
        Fighting: 0.5,
        Psychic: 1,
        Ghost: 1,
        Dragon: 1
    },
    Fighting: {
        '???': 1,
        Normal: 2,
        Grass: 1,
        Fire: 1,
        Water: 1,
        Electric: 1,
        Ice: 2,
        Flying: 0.5,
        Bug: 0.5,
        Poison: 0.5,
        Ground: 1,
        Rock: 2,
        Fighting: 1,
        Psychic: 0.5,
        Ghost: 0,
        Dragon: 1
    },
    Psychic: {
        '???': 1,
        Normal: 1,
        Grass: 1,
        Fire: 1,
        Water: 1,
        Electric: 1,
        Ice: 1,
        Flying: 1,
        Bug: 1,
        Poison: 2,
        Ground: 1,
        Rock: 1,
        Fighting: 2,
        Psychic: 0.5,
        Ghost: 1,
        Dragon: 1
    },
    Ghost: {
        '???': 1,
        Normal: 0,
        Grass: 1,
        Fire: 1,
        Water: 1,
        Electric: 1,
        Ice: 1,
        Flying: 1,
        Bug: 1,
        Poison: 1,
        Ground: 1,
        Rock: 1,
        Fighting: 1,
        Psychic: 0,
        Ghost: 2,
        Dragon: 1
    },
    Dragon: {
        '???': 1,
        Normal: 1,
        Grass: 1,
        Fire: 1,
        Water: 1,
        Electric: 1,
        Ice: 1,
        Flying: 1,
        Bug: 1,
        Poison: 1,
        Ground: 1,
        Rock: 1,
        Fighting: 1,
        Psychic: 1,
        Ghost: 1,
        Dragon: 2
    }
};
var GSC = util_1.extend(true, {}, RBY, {
    '???': { Dark: 1, Steel: 1 },
    Normal: { Dark: 1, Steel: 0.5 },
    Grass: { Dark: 1, Steel: 0.5 },
    Fire: { Dark: 1, Steel: 2 },
    Water: { Dark: 1, Steel: 1 },
    Electric: { Dark: 1, Steel: 1 },
    Ice: { Fire: 0.5, Dark: 1, Steel: 0.5 },
    Flying: { Dark: 1, Steel: 0.5 },
    Bug: { Poison: 0.5, Dark: 2, Steel: 0.5 },
    Poison: { Bug: 1, Dark: 1, Steel: 0 },
    Ground: { Dark: 1, Steel: 2 },
    Rock: { Dark: 1, Steel: 0.5 },
    Fighting: { Dark: 2, Steel: 2 },
    Psychic: { Dark: 0, Steel: 0.5 },
    Ghost: { Psychic: 2, Dark: 0.5, Steel: 0.5 },
    Dragon: { Dark: 1, Steel: 0.5 },
    Dark: {
        '???': 1,
        Normal: 1,
        Grass: 1,
        Fire: 1,
        Water: 1,
        Electric: 1,
        Ice: 1,
        Flying: 1,
        Bug: 1,
        Poison: 1,
        Ground: 1,
        Rock: 1,
        Fighting: 0.5,
        Psychic: 2,
        Ghost: 2,
        Dragon: 1,
        Dark: 0.5,
        Steel: 0.5
    },
    Steel: {
        '???': 1,
        Normal: 1,
        Grass: 1,
        Fire: 0.5,
        Water: 0.5,
        Electric: 0.5,
        Ice: 2,
        Flying: 1,
        Bug: 1,
        Poison: 1,
        Ground: 1,
        Rock: 2,
        Fighting: 1,
        Psychic: 1,
        Ghost: 1,
        Dragon: 1,
        Dark: 1,
        Steel: 0.5
    }
});
var ADV = GSC;
var DPP = GSC;
var BW = GSC;
var XY = util_1.extend(true, {}, GSC, {
    '???': { Fairy: 1 },
    Normal: { Fairy: 1 },
    Grass: { Fairy: 1 },
    Fire: { Fairy: 1 },
    Water: { Fairy: 1 },
    Electric: { Fairy: 1 },
    Ice: { Fairy: 1 },
    Flying: { Fairy: 1 },
    Bug: { Fairy: 0.5 },
    Poison: { Fairy: 2 },
    Ground: { Fairy: 1 },
    Rock: { Fairy: 1 },
    Fighting: { Fairy: 0.5 },
    Psychic: { Fairy: 1 },
    Ghost: { Steel: 1, Fairy: 1 },
    Dragon: { Fairy: 0 },
    Dark: { Steel: 1, Fairy: 0.5 },
    Steel: { Fairy: 2 },
    Fairy: {
        '???': 1,
        Normal: 1,
        Grass: 1,
        Fire: 0.5,
        Water: 1,
        Electric: 1,
        Ice: 1,
        Flying: 1,
        Bug: 1,
        Poison: 0.5,
        Ground: 1,
        Rock: 1,
        Fighting: 2,
        Psychic: 1,
        Ghost: 1,
        Dragon: 2,
        Dark: 2,
        Steel: 0.5,
        Fairy: 1
    }
});
var SM = XY;
var SS = SM;
exports.TYPE_CHART = [{}, RBY, GSC, ADV, DPP, BW, XY, SM, SS];
var Types = (function () {
    function Types(gen) {
        this.gen = gen;
    }
    Types.prototype.get = function (id) {
        return TYPES_BY_ID[this.gen][id];
    };
    Types.prototype[Symbol.iterator] = function () {
        var _a, _b, _i, id;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = [];
                    for (_b in TYPES_BY_ID[this.gen])
                        _a.push(_b);
                    _i = 0;
                    _c.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3, 4];
                    id = _a[_i];
                    return [4, this.get(id)];
                case 2:
                    _c.sent();
                    _c.label = 3;
                case 3:
                    _i++;
                    return [3, 1];
                case 4: return [2];
            }
        });
    };
    return Types;
}());
exports.Types = Types;
var Type = (function () {
    function Type(name, effectiveness) {
        this.kind = 'Type';
        this.id = util_1.toID(name);
        this.name = name;
        this.effectiveness = effectiveness;
    }
    return Type;
}());
var TYPES_BY_ID = [];
try {
    for (var TYPE_CHART_1 = __values(exports.TYPE_CHART), TYPE_CHART_1_1 = TYPE_CHART_1.next(); !TYPE_CHART_1_1.done; TYPE_CHART_1_1 = TYPE_CHART_1.next()) {
        var typeChart = TYPE_CHART_1_1.value;
        var map = {};
        for (var type in typeChart) {
            var t = new Type(type, __assign({}, typeChart[type]));
            map[t.id] = t;
        }
        TYPES_BY_ID.push(map);
    }
}
catch (e_1_1) { e_1 = { error: e_1_1 }; }
finally {
    try {
        if (TYPE_CHART_1_1 && !TYPE_CHART_1_1.done && (_a = TYPE_CHART_1["return"])) _a.call(TYPE_CHART_1);
    }
    finally { if (e_1) throw e_1.error; }
}
//# sourceMappingURL=types.js.map