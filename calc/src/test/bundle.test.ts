/* eslint-disable max-len */

import * as fs from 'fs';
import * as path from 'path';

describe('Bundle', () => {
  test('usage', () => {
    {
      // eslint-disable-next-line no-var
      var window = {} as any;
      // eslint-disable-next-line no-eval
      eval(fs.readFileSync(path.resolve(__dirname, '../../dist/data/production.min.js'), 'utf8'));
      // eslint-disable-next-line no-eval
      eval(fs.readFileSync(path.resolve(__dirname, '../../dist/production.min.js'), 'utf8'));

      const calc = window.calc;

      const gen = calc.Generations.get(5);
      const result = calc.calculate(
        gen,
        new calc.Pokemon(gen, 'Gengar', {
          item: 'Choice Specs',
          nature: 'Timid',
          evs: {spa: 252},
          boosts: {spa: 1},
        }),
        new calc.Pokemon(gen, 'Chansey', {
          item: 'Eviolite',
          nature: 'Calm',
          evs: {hp: 252, spd: 252},
        }),
        new calc.Move(gen, 'Focus Blast'),
        new calc.Field({attackerSide: new calc.Side({isHelpingHand: true})})
      );
      expect(result.range()).toEqual([410, 484]);
      expect(result.desc()).toBe(
        '+1 252 SpA Choice Specs Gengar Helping Hand Focus Blast vs. 252 HP / 252+ SpD Eviolite Chansey: 410-484 (58.2 - 68.7%) -- guaranteed 2HKO'
      );
    }
  });
});
