"use strict";
exports.__esModule = true;
var data_1 = require("../data");
var stats_1 = require("../stats");
var util_1 = require("../mechanics/util");
describe('Stats', function () {
    test('displayStat', function () {
        expect(stats_1.Stats.displayStat('hp')).toBe('HP');
        expect(stats_1.Stats.displayStat('atk')).toBe('Atk');
        expect(stats_1.Stats.displayStat('def')).toBe('Def');
        expect(stats_1.Stats.displayStat('spa')).toBe('SpA');
        expect(stats_1.Stats.displayStat('spd')).toBe('SpD');
        expect(stats_1.Stats.displayStat('spe')).toBe('Spe');
        expect(stats_1.Stats.displayStat('spc')).toBe('Spc');
    });
    test('calcStat', function () {
        var RBY = {
            hp: 403,
            atk: 298,
            def: 298,
            spa: 298,
            spd: 298,
            spe: 298
        };
        var ADV = { hp: 404, atk: 328, def: 299, spa: 269, spd: 299, spe: 299 };
        for (var gen = 1; gen <= 9; gen++) {
            for (var s in ADV) {
                var stat = s;
                var val = stats_1.Stats.calcStat(data_1.Generations.get(gen), stat, 100, 31, 252, 100, 'Adamant');
                expect(val).toBe(gen < 3 ? RBY[stat] : ADV[stat]);
            }
        }
        expect(stats_1.Stats.calcStat(data_1.Generations.get(8), 'hp', 1, 31, 252, 100, 'Jolly')).toBe(1);
        expect(stats_1.Stats.calcStat(data_1.Generations.get(8), 'atk', 100, 31, 252, 100)).toBe(299);
    });
    test('dvs', function () {
        for (var dv = 0; dv <= 15; dv++) {
            expect(stats_1.Stats.IVToDV(stats_1.Stats.DVToIV(dv))).toBe(dv);
        }
        expect(stats_1.Stats.getHPDV({
            atk: stats_1.Stats.DVToIV(15),
            def: stats_1.Stats.DVToIV(15),
            spc: stats_1.Stats.DVToIV(15),
            spe: stats_1.Stats.DVToIV(15)
        })).toBe(15);
        expect(stats_1.Stats.getHPDV({
            atk: stats_1.Stats.DVToIV(5),
            def: stats_1.Stats.DVToIV(15),
            spc: stats_1.Stats.DVToIV(13),
            spe: stats_1.Stats.DVToIV(13)
        })).toBe(15);
        expect(stats_1.Stats.getHPDV({
            atk: stats_1.Stats.DVToIV(15),
            def: stats_1.Stats.DVToIV(3),
            spc: stats_1.Stats.DVToIV(11),
            spe: stats_1.Stats.DVToIV(10)
        })).toBe(13);
    });
    test('gen 2 modifications', function () {
        expect((0, util_1.getModifiedStat)(158, -1, data_1.Generations.get(2))).toBe(104);
        expect((0, util_1.getModifiedStat)(238, -1, data_1.Generations.get(2))).toBe(157);
    });
});
//# sourceMappingURL=stats.test.js.map