"use strict";
exports.__esModule = true;
var util_1 = require("../util");
describe('util', function () {
    test('extend', function () {
        var obj1 = { a: 1, b: { c: 2 }, d: { e: 3 }, f: 4 };
        var obj2 = { a: 2, b: { c: 3 }, d: 4, e: { f: 5 } };
        expect((0, util_1.extend)(true, {}, obj1)).toEqual(obj1);
        expect((0, util_1.extend)(true, {}, obj1, obj2)).toEqual({ a: 2, b: { c: 3 }, d: 4, e: { f: 5 }, f: 4 });
        expect((0, util_1.extend)(true, {}, obj2, obj1)).toEqual({
            a: 1,
            b: { c: 2 },
            d: { e: 3 },
            e: { f: 5 },
            f: 4
        });
    });
});
//# sourceMappingURL=utils.test.js.map