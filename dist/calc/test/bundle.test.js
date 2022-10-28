"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
exports.__esModule = true;
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
describe('Bundle', function () {
    test('usage', function () {
        {
            var window = {};
            eval(fs.readFileSync(path.resolve(__dirname, '../../dist/data/production.min.js'), 'utf8'));
            eval(fs.readFileSync(path.resolve(__dirname, '../../dist/production.min.js'), 'utf8'));
            var calc = window.calc;
            var gen = calc.Generations.get(5);
            var result = calc.calculate(gen, new calc.Pokemon(gen, 'Gengar', {
                item: 'Choice Specs',
                nature: 'Timid',
                evs: { spa: 252 },
                boosts: { spa: 1 }
            }), new calc.Pokemon(gen, 'Chansey', {
                item: 'Eviolite',
                nature: 'Calm',
                evs: { hp: 252, spd: 252 }
            }), new calc.Move(gen, 'Focus Blast'), new calc.Field({ attackerSide: new calc.Side({ isHelpingHand: true }) }));
            expect(result.range()).toEqual([410, 484]);
            expect(result.desc()).toEqual('+1 252 SpA Choice Specs Gengar Helping Hand Focus Blast vs. 252 HP / 252+ SpD Eviolite Chansey: 410-484 (58.2 - 68.7%) -- guaranteed 2HKO');
        }
    });
});
//# sourceMappingURL=bundle.test.js.map