"use strict";
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
exports.__esModule = true;
exports.Natures = exports.NATURES = void 0;
var util_1 = require("../util");
exports.NATURES = {
    Adamant: ['atk', 'spa'],
    Bashful: ['spa', 'spa'],
    Bold: ['def', 'atk'],
    Brave: ['atk', 'spe'],
    Calm: ['spd', 'atk'],
    Careful: ['spd', 'spa'],
    Docile: ['def', 'def'],
    Gentle: ['spd', 'def'],
    Hardy: ['atk', 'atk'],
    Hasty: ['spe', 'def'],
    Impish: ['def', 'spa'],
    Jolly: ['spe', 'spa'],
    Lax: ['def', 'spd'],
    Lonely: ['atk', 'def'],
    Mild: ['spa', 'def'],
    Modest: ['spa', 'atk'],
    Naive: ['spe', 'spd'],
    Naughty: ['atk', 'spd'],
    Quiet: ['spa', 'spe'],
    Quirky: ['spd', 'spd'],
    Rash: ['spa', 'spd'],
    Relaxed: ['def', 'spe'],
    Sassy: ['spd', 'spe'],
    Serious: ['spe', 'spe'],
    Timid: ['spe', 'atk']
};
var Natures = (function () {
    function Natures() {
    }
    Natures.prototype.get = function (id) {
        return NATURES_BY_ID[id];
    };
    Natures.prototype[Symbol.iterator] = function () {
        var _a, _b, _c, _i, id;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _a = NATURES_BY_ID;
                    _b = [];
                    for (_c in _a)
                        _b.push(_c);
                    _i = 0;
                    _d.label = 1;
                case 1:
                    if (!(_i < _b.length)) return [3, 4];
                    _c = _b[_i];
                    if (!(_c in _a)) return [3, 3];
                    id = _c;
                    return [4, this.get(id)];
                case 2:
                    _d.sent();
                    _d.label = 3;
                case 3:
                    _i++;
                    return [3, 1];
                case 4: return [2];
            }
        });
    };
    return Natures;
}());
exports.Natures = Natures;
var Nature = (function () {
    function Nature(name, _a) {
        var _b = __read(_a, 2), plus = _b[0], minus = _b[1];
        this.kind = 'Nature';
        this.id = (0, util_1.toID)(name);
        this.name = name;
        this.plus = plus;
        this.minus = minus;
    }
    return Nature;
}());
var NATURES_BY_ID = {};
for (var nature in exports.NATURES) {
    var n = new Nature(nature, exports.NATURES[nature]);
    NATURES_BY_ID[n.id] = n;
}
//# sourceMappingURL=natures.js.map