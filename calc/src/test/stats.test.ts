import {Generation} from '../gen';
import {displayStat, DVToIV, getHPDV, IVToDV, STATS, calcStat, StatsTable} from '../stats';
import {getModifiedStat} from '../mechanics/util';

describe('stats', () => {
  test('displayStat', () => {
    expect(displayStat('hp')).toBe('HP');
    expect(displayStat('atk')).toBe('Atk');
    expect(displayStat('def')).toBe('Def');
    expect(displayStat('spa')).toBe('SpA');
    expect(displayStat('spd')).toBe('SpD');
    expect(displayStat('spe')).toBe('Spe');
    expect(displayStat('spc')).toBe('Spc');
  });

  test('calcStat', () => {
    const RBY: StatsTable<number> = {
      hp: 403,
      atk: 298,
      def: 298,
      spa: 298,
      spd: 298,
      spc: 298,
      spe: 298,
    };
    const ADV: StatsTable<number> = {hp: 404, atk: 328, def: 299, spa: 269, spd: 299, spe: 299};
    for (let gen = 1; gen <= 7; gen++) {
      for (const stat of STATS[gen]) {
        const val = calcStat(gen as Generation, stat, 100, 31, 252, 100, 'Adamant');
        expect(val).toBe(gen < 3 ? RBY[stat] : ADV[stat]);
      }
    }

    // Shedinja
    expect(calcStat(7, 'hp', 1, 31, 252, 100, 'Jolly')).toBe(1);
    // no nature
    expect(calcStat(7, 'atk', 100, 31, 252, 100)).toBe(299);
  });

  test('dvs', () => {
    for (let dv = 0; dv <= 15; dv++) {
      expect(IVToDV(DVToIV(dv))).toBe(dv);
    }

    expect(
      getHPDV({
        atk: DVToIV(15),
        def: DVToIV(15),
        spc: DVToIV(15),
        spe: DVToIV(15),
      })
    ).toBe(15);
    expect(
      getHPDV({
        atk: DVToIV(5),
        def: DVToIV(15),
        spc: DVToIV(13),
        spe: DVToIV(13),
      })
    ).toBe(15);
    expect(
      getHPDV({
        atk: DVToIV(15),
        def: DVToIV(3),
        spc: DVToIV(11),
        spe: DVToIV(10),
      })
    ).toBe(13);
  });

  test('gen 2 modifications', () => {
    expect(getModifiedStat(158, -1, 2)).toBe(104); // Snorlax after Curse
    expect(getModifiedStat(238, -1, 2)).toBe(157); // Skarmory after Curse
  });
});
