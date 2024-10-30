"use strict";
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
var adaptable_1 = require("../adaptable");
var calc = __importStar(require("../index"));
var dex_1 = require("@pkmn/dex");
var gen_1 = require("./gen");
var pkmn = { Generations: new gen_1.Generations(dex_1.Dex) };
var gens = [1, 2, 3, 4, 5, 6, 7, 8, 9];
describe('Generations', function () {
    test('abilities', function () {
        var e_1, _a, e_2, _b, e_3, _c;
        try {
            for (var gens_1 = __values(gens), gens_1_1 = gens_1.next(); !gens_1_1.done; gens_1_1 = gens_1.next()) {
                var gen = gens_1_1.value;
                var p = Array.from(pkmn.Generations.get(gen).abilities);
                var c = new Map();
                try {
                    for (var _d = (e_2 = void 0, __values(calc.Generations.get(gen).abilities)), _e = _d.next(); !_e.done; _e = _d.next()) {
                        var ability = _e.value;
                        c.set(ability.id, ability);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_e && !_e.done && (_b = _d["return"])) _b.call(_d);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                expect(Array.from(c.values()).map(function (s) { return s.name; }).sort()).toEqual(p.map(function (s) { return s.name; }).sort());
                try {
                    for (var p_1 = (e_3 = void 0, __values(p)), p_1_1 = p_1.next(); !p_1_1.done; p_1_1 = p_1.next()) {
                        var ability = p_1_1.value;
                        expect(c.get(ability.id)).toEqual(ability);
                        c["delete"](ability.id);
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (p_1_1 && !p_1_1.done && (_c = p_1["return"])) _c.call(p_1);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
                expect(c.size).toBe(0);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (gens_1_1 && !gens_1_1.done && (_a = gens_1["return"])) _a.call(gens_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    });
    test('items', function () {
        var e_4, _a, e_5, _b, e_6, _c;
        try {
            for (var gens_2 = __values(gens), gens_2_1 = gens_2.next(); !gens_2_1.done; gens_2_1 = gens_2.next()) {
                var gen = gens_2_1.value;
                var p = Array.from(pkmn.Generations.get(gen).items);
                var c = new Map();
                try {
                    for (var _d = (e_5 = void 0, __values(calc.Generations.get(gen).items)), _e = _d.next(); !_e.done; _e = _d.next()) {
                        var item = _e.value;
                        c.set(item.id, item);
                    }
                }
                catch (e_5_1) { e_5 = { error: e_5_1 }; }
                finally {
                    try {
                        if (_e && !_e.done && (_b = _d["return"])) _b.call(_d);
                    }
                    finally { if (e_5) throw e_5.error; }
                }
                expect(Array.from(c.values()).map(function (s) { return s.name; }).sort()).toEqual(p.map(function (s) { return s.name; }).sort());
                try {
                    for (var p_2 = (e_6 = void 0, __values(p)), p_2_1 = p_2.next(); !p_2_1.done; p_2_1 = p_2.next()) {
                        var item = p_2_1.value;
                        expect(c.get(item.id)).toEqual(item);
                        c["delete"](item.id);
                    }
                }
                catch (e_6_1) { e_6 = { error: e_6_1 }; }
                finally {
                    try {
                        if (p_2_1 && !p_2_1.done && (_c = p_2["return"])) _c.call(p_2);
                    }
                    finally { if (e_6) throw e_6.error; }
                }
                expect(c.size).toBe(0);
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (gens_2_1 && !gens_2_1.done && (_a = gens_2["return"])) _a.call(gens_2);
            }
            finally { if (e_4) throw e_4.error; }
        }
    });
    test('moves', function () {
        var e_7, _a, e_8, _b, e_9, _c, e_10, _d;
        try {
            for (var gens_3 = __values(gens), gens_3_1 = gens_3.next(); !gens_3_1.done; gens_3_1 = gens_3.next()) {
                var gen = gens_3_1.value;
                var p = Array.from(pkmn.Generations.get(gen).moves);
                var c = new Map();
                try {
                    for (var _e = (e_8 = void 0, __values(calc.Generations.get(gen).moves)), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var move = _f.value;
                        c.set(move.id, move);
                    }
                }
                catch (e_8_1) { e_8 = { error: e_8_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_b = _e["return"])) _b.call(_e);
                    }
                    finally { if (e_8) throw e_8.error; }
                }
                expect(Array.from(c.values()).map(function (s) { return s.name; }).sort()).toEqual(p.map(function (s) { return s.name; }).sort());
                try {
                    for (var p_3 = (e_9 = void 0, __values(p)), p_3_1 = p_3.next(); !p_3_1.done; p_3_1 = p_3.next()) {
                        var move = p_3_1.value;
                        try {
                            for (var _g = (e_10 = void 0, __values(Object.entries(move))), _h = _g.next(); !_h.done; _h = _g.next()) {
                                var _j = __read(_h.value, 2), k = _j[0], v = _j[1];
                                if (v === undefined) {
                                    delete move[k];
                                }
                            }
                        }
                        catch (e_10_1) { e_10 = { error: e_10_1 }; }
                        finally {
                            try {
                                if (_h && !_h.done && (_d = _g["return"])) _d.call(_g);
                            }
                            finally { if (e_10) throw e_10.error; }
                        }
                        expect(c.get(move.id)).toMatchObject(move);
                        c["delete"](move.id);
                    }
                }
                catch (e_9_1) { e_9 = { error: e_9_1 }; }
                finally {
                    try {
                        if (p_3_1 && !p_3_1.done && (_c = p_3["return"])) _c.call(p_3);
                    }
                    finally { if (e_9) throw e_9.error; }
                }
                expect(c.size).toBe(0);
            }
        }
        catch (e_7_1) { e_7 = { error: e_7_1 }; }
        finally {
            try {
                if (gens_3_1 && !gens_3_1.done && (_a = gens_3["return"])) _a.call(gens_3);
            }
            finally { if (e_7) throw e_7.error; }
        }
    });
    test('species', function () {
        var e_11, _a, e_12, _b, e_13, _c;
        try {
            for (var gens_4 = __values(gens), gens_4_1 = gens_4.next(); !gens_4_1.done; gens_4_1 = gens_4.next()) {
                var gen = gens_4_1.value;
                var p = Array.from(pkmn.Generations.get(gen).species);
                var c = new Map();
                try {
                    for (var _d = (e_12 = void 0, __values(calc.Generations.get(gen).species)), _e = _d.next(); !_e.done; _e = _d.next()) {
                        var specie = _e.value;
                        c.set(specie.id, specie);
                    }
                }
                catch (e_12_1) { e_12 = { error: e_12_1 }; }
                finally {
                    try {
                        if (_e && !_e.done && (_b = _d["return"])) _b.call(_d);
                    }
                    finally { if (e_12) throw e_12.error; }
                }
                expect(Array.from(c.values()).map(function (s) { return s.name; }).sort()).toEqual(p.map(function (s) { return s.name; }).sort());
                try {
                    for (var p_4 = (e_13 = void 0, __values(p)), p_4_1 = p_4.next(); !p_4_1.done; p_4_1 = p_4.next()) {
                        var specie = p_4_1.value;
                        expect(c.get(specie.id)).toEqual(specie);
                        c["delete"](specie.id);
                    }
                }
                catch (e_13_1) { e_13 = { error: e_13_1 }; }
                finally {
                    try {
                        if (p_4_1 && !p_4_1.done && (_c = p_4["return"])) _c.call(p_4);
                    }
                    finally { if (e_13) throw e_13.error; }
                }
                expect(c.size).toBe(0);
            }
        }
        catch (e_11_1) { e_11 = { error: e_11_1 }; }
        finally {
            try {
                if (gens_4_1 && !gens_4_1.done && (_a = gens_4["return"])) _a.call(gens_4);
            }
            finally { if (e_11) throw e_11.error; }
        }
    });
    test('types', function () {
        var e_14, _a, e_15, _b, e_16, _c;
        try {
            for (var gens_5 = __values(gens), gens_5_1 = gens_5.next(); !gens_5_1.done; gens_5_1 = gens_5.next()) {
                var gen = gens_5_1.value;
                var p = Array.from(pkmn.Generations.get(gen).types);
                var c = new Map();
                try {
                    for (var _d = (e_15 = void 0, __values(calc.Generations.get(gen).types)), _e = _d.next(); !_e.done; _e = _d.next()) {
                        var type = _e.value;
                        c.set(type.id, type);
                    }
                }
                catch (e_15_1) { e_15 = { error: e_15_1 }; }
                finally {
                    try {
                        if (_e && !_e.done && (_b = _d["return"])) _b.call(_d);
                    }
                    finally { if (e_15) throw e_15.error; }
                }
                expect(Array.from(c.values()).map(function (s) { return s.name; }).sort()).toEqual(p.map(function (s) { return s.name; }).sort());
                try {
                    for (var p_5 = (e_16 = void 0, __values(p)), p_5_1 = p_5.next(); !p_5_1.done; p_5_1 = p_5.next()) {
                        var type = p_5_1.value;
                        expect(c.get(type.id)).toEqual(type);
                        c["delete"](type.id);
                    }
                }
                catch (e_16_1) { e_16 = { error: e_16_1 }; }
                finally {
                    try {
                        if (p_5_1 && !p_5_1.done && (_c = p_5["return"])) _c.call(p_5);
                    }
                    finally { if (e_16) throw e_16.error; }
                }
                expect(c.size).toBe(0);
            }
        }
        catch (e_14_1) { e_14 = { error: e_14_1 }; }
        finally {
            try {
                if (gens_5_1 && !gens_5_1.done && (_a = gens_5["return"])) _a.call(gens_5);
            }
            finally { if (e_14) throw e_14.error; }
        }
    });
    test('natures', function () {
        var e_17, _a, e_18, _b, e_19, _c;
        try {
            for (var gens_6 = __values(gens), gens_6_1 = gens_6.next(); !gens_6_1.done; gens_6_1 = gens_6.next()) {
                var gen = gens_6_1.value;
                var p = Array.from(pkmn.Generations.get(gen).natures);
                var c = new Map();
                try {
                    for (var _d = (e_18 = void 0, __values(calc.Generations.get(gen).natures)), _e = _d.next(); !_e.done; _e = _d.next()) {
                        var nature = _e.value;
                        c.set(nature.id, nature);
                    }
                }
                catch (e_18_1) { e_18 = { error: e_18_1 }; }
                finally {
                    try {
                        if (_e && !_e.done && (_b = _d["return"])) _b.call(_d);
                    }
                    finally { if (e_18) throw e_18.error; }
                }
                expect(Array.from(c.values()).map(function (s) { return s.name; }).sort()).toEqual(p.map(function (s) { return s.name; }).sort());
                try {
                    for (var p_6 = (e_19 = void 0, __values(p)), p_6_1 = p_6.next(); !p_6_1.done; p_6_1 = p_6.next()) {
                        var nature = p_6_1.value;
                        expect(c.get(nature.id)).toEqual(nature);
                        c["delete"](nature.id);
                    }
                }
                catch (e_19_1) { e_19 = { error: e_19_1 }; }
                finally {
                    try {
                        if (p_6_1 && !p_6_1.done && (_c = p_6["return"])) _c.call(p_6);
                    }
                    finally { if (e_19) throw e_19.error; }
                }
                expect(c.size).toBe(0);
            }
        }
        catch (e_17_1) { e_17 = { error: e_17_1 }; }
        finally {
            try {
                if (gens_6_1 && !gens_6_1.done && (_a = gens_6["return"])) _a.call(gens_6);
            }
            finally { if (e_17) throw e_17.error; }
        }
    });
});
describe('Adaptable', function () {
    test('usage', function () {
        var gen = pkmn.Generations.get(5);
        var result = (0, adaptable_1.calculate)(gen, new adaptable_1.Pokemon(gen, 'Gengar', {
            item: 'Choice Specs',
            nature: 'Timid',
            evs: { spa: 252 },
            boosts: { spa: 1 }
        }), new adaptable_1.Pokemon(gen, 'Chansey', {
            item: 'Eviolite',
            nature: 'Calm',
            evs: { hp: 252, spd: 252 }
        }), new adaptable_1.Move(gen, 'Focus Blast'));
        expect(result.range()).toEqual([274, 324]);
    });
});
//# sourceMappingURL=data.test.js.map