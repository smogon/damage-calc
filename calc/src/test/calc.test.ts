import { calculate } from '../calc';
import { Pokemon } from '../pokemon';
import { Move } from '../move';
import { Field } from '../field';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeRange(a: number, b: number): R;
    }
  }
}

expect.extend({
  toBeRange(received: number[], floor: number, ceiling: number) {
    const a = received[0];
    const b = received[received.length - 1];
    const pass = a === floor && b === ceiling;
    if (pass) {
      return {
        message: () => `expected range (${a}, ${b}) not to be within range (${floor}, ${ceiling})`,
        pass,
      };
    } else {
      return {
        message: () => `expected range (${a}, ${b}) to be within range (${floor}, ${ceiling})`,
        pass,
      };
    }
  },
});

const ABOMASNOW = new Pokemon(7, 'Abomasnow', {
  item: 'Icy Rock',
  ability: 'Snow Warning',
  nature: 'Hasty',
  evs: { atk: 252, spd: 4, spe: 252 },
});

const HOOPA = new Pokemon(7, 'Hoopa-Unbound', {
  item: 'Choice Band',
  ability: 'Magician',
  nature: 'Jolly',
  evs: { hp: 32, atk: 224, spe: 252 },
});

describe('calc', () => {
  describe('gen', () => {
    test('1', () => {
      const result = calculate(
        1,
        new Pokemon(1, 'Gengar'),
        new Pokemon(1, 'Chansey'),
        new Move(1, 'Thunderbolt')
      );
      expect(result.damage).toBeRange(79, 94);
      expect(result.desc()).toBe(
        'Gengar Thunderbolt vs. Chansey: 79-94 (11.2 - 13.3%) -- possible 8HKO'
      );
    });
    test('2', () => {
      const result = calculate(
        2,
        new Pokemon(2, 'Gengar'),
        new Pokemon(2, 'Chansey', { item: 'Leftovers' }),
        new Move(2, 'Dynamic Punch')
      );
      expect(result.damage).toBeRange(304, 358);
      expect(result.desc()).toBe(
        'Gengar Dynamic Punch vs. Chansey: 304-358 (43.2 - 50.9%) -- guaranteed 3HKO after Leftovers recovery'
      );
    });
    test('3', () => {
      const result = calculate(
        3,
        new Pokemon(3, 'Gengar', {
          nature: 'Mild',
          evs: { atk: 100 },
        }),
        new Pokemon(3, 'Chansey', {
          item: 'Leftovers',
          nature: 'Bold',
          evs: { hp: 252, def: 252 },
        }),
        new Move(3, 'Focus Punch')
      );
      expect(result.damage).toBeRange(346, 408);
      expect(result.desc()).toBe(
        '100 Atk Gengar Focus Punch vs. 252 HP / 252+ Def Chansey: 346-408 (49.1 - 57.9%) -- 59% chance to 2HKO after Leftovers recovery'
      );
    });
    test('4', () => {
      const result = calculate(
        4,
        new Pokemon(4, 'Gengar', {
          item: 'Choice Specs',
          nature: 'Timid',
          evs: { spa: 252 },
          boosts: { spa: 1 },
        }),
        new Pokemon(4, 'Chansey', {
          item: 'Leftovers',
          nature: 'Calm',
          evs: { hp: 252, spd: 252 },
        }),
        new Move(4, 'Focus Blast')
      );
      expect(result.damage).toBeRange(408, 482);
      expect(result.desc()).toBe(
        '+1 252 SpA Choice Specs Gengar Focus Blast vs. 252 HP / 252+ SpD Chansey: 408-482 (57.9 - 68.4%) -- guaranteed 2HKO after Leftovers recovery'
      );
    });
    test('5', () => {
      const result = calculate(
        5,
        new Pokemon(5, 'Gengar', {
          item: 'Choice Specs',
          nature: 'Timid',
          evs: { spa: 252 },
          boosts: { spa: 1 },
        }),
        new Pokemon(5, 'Chansey', {
          item: 'Eviolite',
          nature: 'Calm',
          evs: { hp: 252, spd: 252 },
        }),
        new Move(5, 'Focus Blast')
      );
      expect(result.damage).toBeRange(274, 324);
      expect(result.fullDesc('px')).toBe(
        '+1 252 SpA Choice Specs Gengar Focus Blast vs. 252 HP / 252+ SpD Eviolite Chansey: 274-324 (18 - 22px) -- guaranteed 3HKO'
      );
    });
    test('6', () => {
      const result = calculate(
        6,
        new Pokemon(6, 'Gengar', {
          item: 'Life Orb',
          nature: 'Modest',
          evs: { spa: 252 },
        }),
        new Pokemon(6, 'Chansey', {
          item: 'Eviolite',
          nature: 'Bold',
          evs: { hp: 252, def: 252 },
        }),
        new Move(6, 'Sludge Bomb')
      );
      expect(result.damage).toBeRange(134, 160);
      expect(result.desc()).toBe(
        '252+ SpA Life Orb Gengar Sludge Bomb vs. 252 HP / 0 SpD Eviolite Chansey: 134-160 (19 - 22.7%) -- possible 5HKO'
      );
    });
    test('7', () => {
      const result = calculate(
        7,
        new Pokemon(7, 'Gengar', {
          item: 'Life Orb',
          nature: 'Modest',
          evs: { spa: 252 },
          boosts: { spa: 3 },
        }),
        new Pokemon(7, 'Chansey', {
          item: 'Eviolite',
          nature: 'Bold',
          evs: { hp: 100, spd: 100 },
          boosts: { spd: 1 },
        }),
        new Move(7, 'Sludge Bomb')
      );
      expect(result.damage).toBeRange(204, 242);
      expect(result.desc()).toBe(
        '+3 252+ SpA Life Orb Gengar Sludge Bomb vs. +1 100 HP / 100 SpD Eviolite Chansey: 204-242 (30.6 - 36.3%) -- 52.9% chance to 3HKO'
      );
    });
  });

  describe('field', () => {
    test('none', () => {
      let result = calculate(7, ABOMASNOW, HOOPA, new Move(7, 'Wood Hammer'));
      expect(result.damage).toBeRange(234, 276);
      expect(result.desc()).toBe(
        '252 Atk Abomasnow Wood Hammer vs. 32 HP / 0 Def Hoopa-Unbound: 234-276 (75.7 - 89.3%) -- guaranteed 2HKO'
      );
      const recoil = result.recoil();
      expect(recoil.recoil).toBeRange(24, 28.3);
      expect(recoil.text).toBe('24 - 28.3% recoil damage');

      result = calculate(7, HOOPA, ABOMASNOW, new Move(7, 'Drain Punch'));
      expect(result.damage).toBeRange(398, 470);
      expect(result.desc()).toBe(
        '224 Atk Choice Band Hoopa-Unbound Drain Punch vs. 0 HP / 0- Def Abomasnow: 398-470 (123.9 - 146.4%) -- guaranteed OHKO'
      );
      const recovery = result.recovery();
      expect(recovery.recovery).toBeRange(199, 235);
      expect(recovery.text).toBe('64.4 - 76% recovered');
    });

    test('none', () => {
      const field = new Field({
        gameType: 'Doubles',
        terrain: 'Grassy',
        weather: 'Hail',
        defenderSide: {
          isSR: true,
          spikes: 1,
          isLightScreen: true,
          isSeeded: true,
          isFriendGuard: true,
        },
        attackerSide: {
          isHelpingHand: true,
          isTailwind: true,
        },
      });
      const result = calculate(7, ABOMASNOW, HOOPA, new Move(7, 'Blizzard'), field);
      expect(result.damage).toBeRange(50, 59);
      expect(result.desc()).toBe(
        "0 SpA Abomasnow Helping Hand Blizzard vs. 32 HP / 0 SpD Hoopa-Unbound through Light Screen with an ally's Friend Guard: 50-59 (16.1 - 19%)" +
          ' -- 91.4% chance to 3HKO after Stealth Rock, 1 layer of Spikes, hail damage, Leech Seed damage, and Grassy Terrain recovery'
      );
    });
  });

  describe('mechanics', () => {
    test('gen 2 DVs', () => {
      const aerodactyl = new Pokemon(2, 'Aerodactyl');
      const zapdos = new Pokemon(2, 'Zapdos', { ivs: { atk: 29, def: 27 }, item: 'Leftovers' });
      expect(zapdos.ivs.hp).toBe(15);

      const move = new Move(7, 'Ancient Power');
      const result = calculate(2, aerodactyl, zapdos, move);
      expect(result.damage).toBeRange(153, 180);
      expect(result.desc()).toBe(
        'Aerodactyl Ancient Power vs. Zapdos: 153-180 (41.6 - 49%) -- guaranteed 3HKO after Leftovers recovery'
      );
    });

    test('zmove criticals', () => {
      const zMove = new Move(7, 'Wood Hammer', { useZ: true, isCrit: true });
      const result = calculate(7, ABOMASNOW, HOOPA, zMove);
      expect(result.damage).toBeRange(555, 654);
      expect(result.desc()).toBe(
        '252 Atk Abomasnow Bloom Doom (190 BP) vs. 32 HP / 0 Def Hoopa-Unbound on a critical hit: 555-654 (179.6 - 211.6%) -- guaranteed OHKO'
      );
    });
  });

  describe('mold breaker', () => {
    test('gen 4', () => {
      const pinsir = new Pokemon(4, 'Pinsir', {
        item: 'Choice Band',
        nature: 'Adamant',
        ability: 'Hyper Cutter',
        evs: { atk: 252 },
      });
      const gengar = new Pokemon(4, 'Gengar', {
        item: 'Choice Specs',
        nature: 'Timid',
        evs: { spa: 252 },
        boosts: { spa: 1 },
      });
      const earthquake = new Move(4, 'Earthquake');

      let result = calculate(4, pinsir, gengar, earthquake);
      expect(result.damage).toBeRange(0, 0);

      pinsir.ability = 'Mold Breaker';
      result = calculate(4, pinsir, gengar, earthquake);
      expect(result.damage).toBeRange(528, 622);
      expect(result.desc()).toBe(
        '252+ Atk Choice Band Mold Breaker Pinsir Earthquake vs. 0 HP / 0 Def Gengar: 528-622 (202.2 - 238.3%) -- guaranteed OHKO'
      );

      pinsir.boosts.atk = 2;
      gengar.ability = 'Unaware';
      result = calculate(4, pinsir, gengar, earthquake);
      expect(result.damage).toBeRange(1054, 1240);
    });
    test('gen 7', () => {
      const pinsir = new Pokemon(7, 'Pinsir', {
        item: 'Choice Band',
        nature: 'Adamant',
        ability: 'Hyper Cutter',
        evs: { atk: 252 },
      });
      const gengar = new Pokemon(7, 'Gengar', {
        item: 'Choice Specs',
        nature: 'Timid',
        ability: 'Levitate',
        evs: { spa: 252 },
        boosts: { spa: 1 },
      });
      const earthquake = new Move(7, 'Earthquake');

      let result = calculate(7, pinsir, gengar, earthquake);
      expect(result.damage).toBeRange(0, 0);

      pinsir.ability = 'Mold Breaker';
      result = calculate(7, pinsir, gengar, earthquake);
      expect(result.damage).toBeRange(528, 622);
      expect(result.desc()).toBe(
        '252+ Atk Choice Band Mold Breaker Pinsir Earthquake vs. 0 HP / 0 Def Gengar: 528-622 (202.2 - 238.3%) -- guaranteed OHKO'
      );

      pinsir.boosts.atk = 2;
      gengar.ability = 'Unaware';
      result = calculate(7, pinsir, gengar, earthquake);
      expect(result.damage).toBeRange(1054, 1240);
    });
  });
});
