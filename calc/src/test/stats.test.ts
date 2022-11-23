import {Generations} from '../data';
import {GenerationNum, StatsTable, StatID} from '../data/interface';
import {Stats} from '../stats';
import {getModifiedStat} from '../mechanics/util';

describe('Stats', () => {
  test('displayStat', () => {
    expect(Stats.displayStat('hp')).toBe('HP');
    expect(Stats.displayStat('atk')).toBe('Atk');
    expect(Stats.displayStat('def')).toBe('Def');
    expect(Stats.displayStat('spa')).toBe('SpA');
    expect(Stats.displayStat('spd')).toBe('SpD');
    expect(Stats.displayStat('spe')).toBe('Spe');
    expect(Stats.displayStat('spc')).toBe('Spc');
  });

  test('calcStat', () => {
    const RBY: StatsTable = {
      hp: 403,
      atk: 298,
      def: 298,
      spa: 298,
      spd: 298,
      spe: 298,
    };
    const ADV: StatsTable = {hp: 404, atk: 328, def: 299, spa: 269, spd: 299, spe: 299};
    for (let gen = 1; gen <= 9; gen++) {
      for (const s in ADV) {
        const stat = s as StatID;
        const val = Stats.calcStat(
          Generations.get(gen as GenerationNum),
          stat,
          100,
          31,
          252,
          100,
          'Adamant'
        );
        expect(val).toBe(gen < 3 ? RBY[stat] : ADV[stat]);
      }
    }

    // Shedinja
    expect(Stats.calcStat(Generations.get(8), 'hp', 1, 31, 252, 100, 'Jolly')).toBe(1);
    // no nature
    expect(Stats.calcStat(Generations.get(8), 'atk', 100, 31, 252, 100)).toBe(299);
  });

  test('dvs', () => {
    for (let dv = 0; dv <= 15; dv++) {
      expect(Stats.IVToDV(Stats.DVToIV(dv))).toBe(dv);
    }

    expect(
      Stats.getHPDV({
        atk: Stats.DVToIV(15),
        def: Stats.DVToIV(15),
        spc: Stats.DVToIV(15),
        spe: Stats.DVToIV(15),
      })
    ).toBe(15);
    expect(
      Stats.getHPDV({
        atk: Stats.DVToIV(5),
        def: Stats.DVToIV(15),
        spc: Stats.DVToIV(13),
        spe: Stats.DVToIV(13),
      })
    ).toBe(15);
    expect(
      Stats.getHPDV({
        atk: Stats.DVToIV(15),
        def: Stats.DVToIV(3),
        spc: Stats.DVToIV(11),
        spe: Stats.DVToIV(10),
      })
    ).toBe(13);
  });

  test('gen 2 modifications', () => {
    expect(getModifiedStat(158, -1, Generations.get(2))).toBe(104); // Snorlax after Curse
    expect(getModifiedStat(238, -1, Generations.get(2))).toBe(157); // Skarmory after Curse
  });
});
