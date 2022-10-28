"use strict";
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
function tests() {
    var _a, _b, _c;
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var name = args[0];
    var from;
    var to;
    var fn;
    var type = undefined;
    if (typeof args[1] !== 'number') {
        from = 1;
        to = 8;
        fn = args[1];
        type = args[2];
    }
    else if (typeof args[2] !== 'number') {
        from = (_a = args[1]) !== null && _a !== void 0 ? _a : 1;
        to = 8;
        fn = args[2];
        type = args[3];
    }
    else {
        from = (_b = args[1]) !== null && _b !== void 0 ? _b : 1;
        to = (_c = args[2]) !== null && _c !== void 0 ? _c : 8;
        fn = args[3];
        type = args[4];
    }
    inGens(from, to, function (gen) {
        var n = name + " (gen " + gen.gen + ")";
        if (type === 'skip') {
            test.skip(n, function () { return fn(gen); });
        }
        else if (type === 'only') {
            test.only(n, function () { return fn(gen); });
        }
        else {
            test(n, function () { return fn(gen); });
        }
    });
}
exports.tests = tests;
expect.extend({
    toMatch: function (received, gen, notation, diff) {
        var e_1, _a;
        if (typeof notation !== 'string') {
            diff = notation;
            notation = '%';
        }
        if (!diff)
            throw new Error('toMatch called with no diff!');
        var breakdowns = Object.entries(diff).sort();
        var expected = { range: undefined, desc: '', result: '' };
        try {
            for (var breakdowns_1 = __values(breakdowns), breakdowns_1_1 = breakdowns_1.next(); !breakdowns_1_1.done; breakdowns_1_1 = breakdowns_1.next()) {
                var _b = __read(breakdowns_1_1.value, 2), g = _b[0], _c = _b[1], range = _c.range, desc = _c.desc, result = _c.result;
                if (Number(g) > gen)
                    break;
                if (range)
                    expected.range = range;
                if (desc)
                    expected.desc = desc;
                if (result)
                    expected.result = result;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (breakdowns_1_1 && !breakdowns_1_1.done && (_a = breakdowns_1["return"])) _a.call(breakdowns_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (!(expected.range || expected.desc || expected.result)) {
            throw new Error("toMatch called with empty diff: " + diff);
        }
        if (expected.range) {
            if (this.isNot) {
                expect(received.range()).not.toEqual(expected.range);
            }
            else {
                expect(received.range()).toEqual(expected.range);
            }
        }
        if (expected.desc) {
            var r = received.fullDesc(notation).split(': ')[0];
            if (this.isNot) {
                expect(r).not.toEqual(expected.desc);
            }
            else {
                expect(r).toEqual(expected.desc);
            }
        }
        if (expected.result) {
            var post = received.fullDesc(notation).split(': ')[1];
            var r = "(" + post.split('(')[1];
            if (this.isNot) {
                expect(r).not.toEqual(expected.result);
            }
            else {
                expect(r).toEqual(expected.result);
            }
        }
        return { pass: !this.isNot, message: function () { return ''; } };
    }
});
//# sourceMappingURL=helper.js.map