import {AbilityName} from '../data/interface';
import {inGen, inGens} from './helper';

describe('calc', () => {
  describe('Multi-Gen', () => {
    inGens(4, 7, ({gen, calculate, Pokemon, Move}) => {
      test(`Grass Knot (gen ${gen})`, () => {
        const result = calculate(Pokemon('Groudon'), Pokemon('Groudon'), Move('Grass Knot'));
        expect(result.damage).toBeRange(190, 224);
      });
    });

    inGens(1, 8, ({gen, calculate, Pokemon, Move}) => {
      test(`Night Shade / Seismic Toss (gen ${gen})`, () => {
        const mew = Pokemon('Mew', {level: 50});
        const vulpix = Pokemon('Vulpix');
        for (const move of [Move('Seismic Toss'), Move('Night Shade')]) {
          const result = calculate(mew, vulpix, move);
          expect(result.damage).toBeRange(50, 50);
          expect(result.desc()).toBe(
            gen < 3
              ? `Mew ${move.name} vs. Vulpix: 50-50 (17.9 - 17.9%) -- guaranteed 6HKO`
              : `Mew ${move.name} vs. 0 HP Vulpix: 50-50 (23 - 23%) -- guaranteed 5HKO`
          );
        }
      });
    });

    inGens(1, 8, ({gen, calculate, Pokemon, Move, Field}) => {
      test(`Critical hits ignore attack decreases (gen ${gen})`, () => {
        const field = Field({defenderSide: {isReflect: true}});

        const mew = Pokemon('Mew', {status: 'Burned'});
        const vulpix = Pokemon('Vulpix');
        const explosion = Move('Explosion', {isCrit: true});
        let result = calculate(mew, vulpix, explosion, field);
        mew.boosts.atk = 2;
        vulpix.boosts.def = 2;
        if (gen < 2) {
          expect(result.damage).toBeRange(799, 939);
          expect(result.desc()).toBe(
            'Mew Explosion vs. Vulpix on a critical hit: 799-939 (286.3 - 336.5%) -- guaranteed OHKO'
          );
        } else if (gen < 5 && gen > 2) {
          expect(result.damage).toBeRange(729, 858);
          expect(result.desc()).toBe(
            '0 Atk burned Mew Explosion vs. 0 HP / 0 Def Vulpix on a critical hit: 729-858 (335.9 - 395.3%) -- guaranteed OHKO'
          );
        } else if (gen === 5) {
          expect(result.damage).toBeRange(364, 429);
          expect(result.desc()).toBe(
            '0 Atk burned Mew Explosion vs. 0 HP / 0 Def Vulpix on a critical hit: 364-429 (167.7 - 197.6%) -- guaranteed OHKO'
          );
        } else if (gen >= 6) {
          expect(result.damage).toBeRange(273, 321);
          expect(result.desc()).toBe(
            '0 Atk burned Mew Explosion vs. 0 HP / 0 Def Vulpix on a critical hit: 273-321 (125.8 - 147.9%) -- guaranteed OHKO'
          );
        }
        explosion.isCrit = false;
        result = calculate(mew, vulpix, explosion, field);
        if (gen === 1) {
          expect(result.damage).toBeRange(102, 120);
        } else if (gen === 2) {
          expect(result.damage).toBeRange(149, 176);
        } else if (gen > 2 && gen < 5) {
          expect(result.damage).toBeRange(182, 215);
        } else {
          expect(result.damage).toBeRange(91, 107);
        }
      });
    });
  });

  describe('Gen 1', () => {
    inGen(1, ({calculate, Pokemon, Move}) => {
      test('Basic: Gengar vs. Chansey', () => {
        const result = calculate(Pokemon('Gengar'), Pokemon('Chansey'), Move('Thunderbolt'));
        expect(result.damage).toBeRange(79, 94);
        expect(result.desc()).toBe(
          'Gengar Thunderbolt vs. Chansey: 79-94 (11.2 - 13.3%) -- possible 8HKO'
        );
      });
    });
  });

  describe('Gen 2', () => {
    inGen(2, ({calculate, Pokemon, Move, Field}) => {
      test('Basic: Gengar vs. Chansey', () => {
        const result = calculate(
          Pokemon('Gengar'),
          Pokemon('Chansey', {item: 'Leftovers'}),
          Move('Dynamic Punch')
        );
        expect(result.damage).toBeRange(304, 358);
        expect(result.desc()).toBe(
          'Gengar Dynamic Punch vs. Chansey: 304-358 (43.2 - 50.9%) -- guaranteed 3HKO after Leftovers recovery'
        );
      });

      test('Struggle', () => {
        const attacker = Pokemon('Skarmory', {boosts: {atk: 6, def: 6}});
        const defender = Pokemon('Skarmory', {boosts: {atk: 6, def: 6}});
        const move = Move('Struggle');
        const result = calculate(attacker, defender, move);
        expect(result.damage).toBeRange(37, 44);
        expect(result.desc()).toBe(
          '+6 Skarmory Struggle vs. +6 Skarmory: 37-44 (11.1 - 13.2%) -- possible 8HKO'
        );
      });

      test('Present', () => {
        const attacker = Pokemon('Togepi', {level: 5, boosts: {atk: -6}, status: 'Burned'});
        const defender = Pokemon('Umbreon', {boosts: {def: 6}});
        const move = Move('Present');
        const field = Field({defenderSide: {isReflect: true}});
        const result = calculate(attacker, defender, move, field);
        expect(result.damage).toBeRange(125, 147);
        expect(result.desc()).toBe(
          '-6 burned Togepi Present vs. +6 Umbreon through Reflect: 125-147 (31.8 - 37.4%) -- 89.1% chance to 3HKO'
        );
      });

      test('DVs', () => {
        const aerodactyl = Pokemon('Aerodactyl');
        const zapdos = Pokemon('Zapdos', {ivs: {atk: 29, def: 27}, item: 'Leftovers'});
        expect(zapdos.ivs.hp).toBe(15);

        const move = Move('Ancient Power');
        const result = calculate(aerodactyl, zapdos, move);
        expect(result.damage).toBeRange(153, 180);
        expect(result.desc()).toBe(
          'Aerodactyl Ancient Power vs. Zapdos: 153-180 (41.6 - 49%) -- guaranteed 3HKO after Leftovers recovery'
        );
      });
    });
  });

  describe('Gen 3', () => {
    inGen(3, ({calculate, Pokemon, Move, Field}) => {
      test('Basic: Gengar vs. Chansey', () => {
        const result = calculate(
          Pokemon('Gengar', {
            nature: 'Mild',
            evs: {atk: 100},
          }),
          Pokemon('Chansey', {
            item: 'Leftovers',
            nature: 'Bold',
            evs: {hp: 252, def: 252},
          }),
          Move('Focus Punch')
        );
        expect(result.damage).toBeRange(346, 408);
        expect(result.desc()).toBe(
          '100 Atk Gengar Focus Punch vs. 252 HP / 252+ Def Chansey: 346-408 (49.1 - 57.9%) -- 59% chance to 2HKO after Leftovers recovery'
        );
      });
      test('Water Absorb', () => {
        const cacturne = Pokemon('Cacturne', {
          ability: 'Sand Veil',
        });
        const blastoise = Pokemon('Blastoise', {
          evs: {spa: 252},
        });
        const surf = Move('Surf');

        let result = calculate(blastoise, cacturne, surf);
        expect(result.damage).toBeRange(88, 104);
        expect(result.desc()).toBe(
          '252 SpA Blastoise Surf vs. 0 HP / 0 SpD Cacturne: 88-104 (31.3 - 37%) -- 76.6% chance to 3HKO'
        );

        cacturne.ability = 'Water Absorb' as AbilityName;
        result = calculate(blastoise, cacturne, surf);
        expect(result.damage).toBeRange(0, 0);
      });

      describe('Spread Moves', () => {
        test('allAdjacent', () => {
          const gengar = Pokemon('Gengar', {nature: 'Mild', evs: {atk: 100}});
          const blissey = Pokemon('Chansey', {
            item: 'Leftovers',
            nature: 'Bold',
            evs: {hp: 252, def: 252},
          });
          const field = Field({gameType: 'Doubles'});
          const result = calculate(gengar, blissey, Move('Explosion'), field);
          expect(result.damage).toBeRange(578, 681);
          expect(result.desc()).toBe(
            '100 Atk Gengar Explosion vs. 252 HP / 252+ Def Chansey: 578-681 (82.1 - 96.7%) -- guaranteed 2HKO after Leftovers recovery'
          );
        });
        test('allAdjacentFoes', () => {
          const gengar = Pokemon('Gengar', {nature: 'Modest', evs: {spa: 252}});
          const blissey = Pokemon('Chansey', {
            item: 'Leftovers',
            nature: 'Bold',
            evs: {hp: 252, def: 252},
          });
          const field = Field({gameType: 'Doubles'});
          const result = calculate(gengar, blissey, Move('Blizzard'), field);
          expect(result.damage).toBeRange(69, 82);
          expect(result.desc()).toBe(
            '252+ SpA Gengar Blizzard vs. 252 HP / 0 SpD Chansey: 69-82 (9.8 - 11.6%)'
          );
        });
      });
    });
  });

  describe('Gen 4', () => {
    inGen(4, ({calculate, Pokemon, Move}) => {
      test('Basic: Gengar vs. Chansey', () => {
        const result = calculate(
          Pokemon('Gengar', {
            item: 'Choice Specs',
            nature: 'Timid',
            evs: {spa: 252},
            boosts: {spa: 1},
          }),
          Pokemon('Chansey', {
            item: 'Leftovers',
            nature: 'Calm',
            evs: {hp: 252, spd: 252},
          }),
          Move('Focus Blast')
        );
        expect(result.damage).toBeRange(408, 482);
        expect(result.desc()).toBe(
          '+1 252 SpA Choice Specs Gengar Focus Blast vs. 252 HP / 252+ SpD Chansey: 408-482 (57.9 - 68.4%) -- guaranteed 2HKO after Leftovers recovery'
        );
      });
      test('Mold Breaker', () => {
        const pinsir = Pokemon('Pinsir', {
          item: 'Choice Band',
          nature: 'Adamant',
          ability: 'Hyper Cutter',
          evs: {atk: 252},
        });
        const gengar = Pokemon('Gengar', {
          item: 'Choice Specs',
          nature: 'Timid',
          evs: {spa: 252},
          boosts: {spa: 1},
        });
        const earthquake = Move('Earthquake');

        let result = calculate(pinsir, gengar, earthquake);
        expect(result.damage).toBeRange(0, 0);

        pinsir.ability = 'Mold Breaker' as AbilityName;
        result = calculate(pinsir, gengar, earthquake);
        expect(result.damage).toBeRange(528, 622);
        expect(result.desc()).toBe(
          '252+ Atk Choice Band Mold Breaker Pinsir Earthquake vs. 0 HP / 0 Def Gengar: 528-622 (202.2 - 238.3%) -- guaranteed OHKO'
        );

        pinsir.boosts.atk = 2;
        gengar.ability = 'Unaware' as AbilityName;
        result = calculate(pinsir, gengar, earthquake);
        expect(result.damage).toBeRange(1054, 1240);
      });
    });
  });

  describe('Gen 5', () => {
    inGen(5, ({calculate, Pokemon, Move}) => {
      test('Basic: Gengar vs. Chansey', () => {
        const result = calculate(
          Pokemon('Gengar', {
            item: 'Choice Specs',
            nature: 'Timid',
            evs: {spa: 252},
            boosts: {spa: 1},
          }),
          Pokemon('Chansey', {
            item: 'Eviolite',
            nature: 'Calm',
            evs: {hp: 252, spd: 252},
          }),
          Move('Focus Blast')
        );
        expect(result.damage).toBeRange(274, 324);
        expect(result.fullDesc('px')).toBe(
          '+1 252 SpA Choice Specs Gengar Focus Blast vs. 252 HP / 252+ SpD Eviolite Chansey: 274-324 (18 - 22px) -- guaranteed 3HKO'
        );
      });
    });
  });

  describe('Gen 6', () => {
    inGen(6, ({calculate, Pokemon, Move}) => {
      test('Basic: Gengar vs. Chansey', () => {
        const result = calculate(
          Pokemon('Gengar', {
            item: 'Life Orb',
            nature: 'Modest',
            evs: {spa: 252},
          }),
          Pokemon('Chansey', {
            item: 'Eviolite',
            nature: 'Bold',
            evs: {hp: 252, def: 252},
          }),
          Move('Sludge Bomb')
        );
        expect(result.damage).toBeRange(134, 160);
        expect(result.desc()).toBe(
          '252+ SpA Life Orb Gengar Sludge Bomb vs. 252 HP / 0 SpD Eviolite Chansey: 134-160 (19 - 22.7%) -- possible 5HKO'
        );
      });
    });
  });

  describe('Gen 7', () => {
    inGen(7, ({calculate, Pokemon, Move, Field}) => {
      const abomasnow = Pokemon('Abomasnow', {
        item: 'Icy Rock',
        ability: 'Snow Warning',
        nature: 'Hasty',
        evs: {atk: 252, spd: 4, spe: 252},
      });

      const hoopa = Pokemon('Hoopa-Unbound', {
        item: 'Choice Band',
        ability: 'Magician',
        nature: 'Jolly',
        evs: {hp: 32, atk: 224, spe: 252},
      });

      test('Basic: Gengar vs. Chansey', () => {
        const result = calculate(
          Pokemon('Gengar', {
            item: 'Life Orb',
            nature: 'Modest',
            evs: {spa: 252},
            boosts: {spa: 3},
          }),
          Pokemon('Chansey', {
            item: 'Eviolite',
            nature: 'Bold',
            evs: {hp: 100, spd: 100},
            boosts: {spd: 1},
          }),
          Move('Sludge Bomb')
        );
        expect(result.damage).toBeRange(204, 242);
        expect(result.desc()).toBe(
          '+3 252+ SpA Life Orb Gengar Sludge Bomb vs. +1 100 HP / 100 SpD Eviolite Chansey: 204-242 (30.6 - 36.3%) -- 52.9% chance to 3HKO'
        );
      });

      test('Z-Move critical hits', () => {
        const zMove = Move('Wood Hammer', {useZ: true, isCrit: true});
        const result = calculate(abomasnow, hoopa, zMove);
        expect(result.damage).toBeRange(555, 654);
        expect(result.desc()).toBe(
          '252 Atk Abomasnow Bloom Doom (190 BP) vs. 32 HP / 0 Def Hoopa-Unbound on a critical hit: 555-654 (179.6 - 211.6%) -- guaranteed OHKO'
        );
      });

      test('Empty Field', () => {
        let result = calculate(abomasnow, hoopa, Move('Wood Hammer'));
        expect(result.damage).toBeRange(234, 276);
        expect(result.desc()).toBe(
          '252 Atk Abomasnow Wood Hammer vs. 32 HP / 0 Def Hoopa-Unbound: 234-276 (75.7 - 89.3%) -- guaranteed 2HKO'
        );
        const recoil = result.recoil();
        expect(recoil.recoil).toBeRange(24, 28.3);
        expect(recoil.text).toBe('24 - 28.3% recoil damage');

        result = calculate(hoopa, abomasnow, Move('Drain Punch'));
        expect(result.damage).toBeRange(398, 470);
        expect(result.desc()).toBe(
          '224 Atk Choice Band Hoopa-Unbound Drain Punch vs. 0 HP / 0- Def Abomasnow: 398-470 (123.9 - 146.4%) -- guaranteed OHKO'
        );
        const recovery = result.recovery();
        expect(recovery.recovery).toBeRange(160, 160);
        expect(recovery.text).toBe('51.9 - 51.9% recovered');
      });

      test('Loaded Field', () => {
        const field = Field({
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
        const result = calculate(abomasnow, hoopa, Move('Blizzard'), field);
        expect(result.damage).toBeRange(50, 59);
        expect(result.desc()).toBe(
          "0 SpA Abomasnow Helping Hand Blizzard vs. 32 HP / 0 SpD Hoopa-Unbound through Light Screen with an ally's Friend Guard: 50-59 (16.1 - 19%)" +
            ' -- 91.4% chance to 3HKO after Stealth Rock, 1 layer of Spikes, hail damage, Leech Seed damage, and Grassy Terrain recovery'
        );
      });

      test('Wring Out', () => {
        const smeargle = Pokemon('Smeargle', {level: 50, ability: 'Technician'});
        const blissey = Pokemon('Blissey', {level: 50, evs: {hp: 252}, curHP: 184});
        const result = calculate(smeargle, blissey, Move('Wring Out'));
        expect(result.damage).toBeRange(15, 18);
        expect(result.desc()).toBe(
          '0 SpA Technician Smeargle Wring Out (60 BP) vs. 252 HP / 0 SpD Blissey: 15-18 (4.1 - 4.9%)'
        );
      });

      test('Mold Breaker', () => {
        const pinsir = Pokemon('Pinsir', {
          item: 'Choice Band',
          nature: 'Adamant',
          ability: 'Hyper Cutter',
          evs: {atk: 252},
        });
        const gengar = Pokemon('Gengar', {
          item: 'Choice Specs',
          nature: 'Timid',
          ability: 'Levitate',
          evs: {spa: 252},
          boosts: {spa: 1},
        });
        const earthquake = Move('Earthquake');

        let result = calculate(pinsir, gengar, earthquake);
        expect(result.damage).toBeRange(0, 0);

        pinsir.ability = 'Mold Breaker' as AbilityName;
        result = calculate(pinsir, gengar, earthquake);
        expect(result.damage).toBeRange(528, 622);
        expect(result.desc()).toBe(
          '252+ Atk Choice Band Mold Breaker Pinsir Earthquake vs. 0 HP / 0 Def Gengar: 528-622 (202.2 - 238.3%) -- guaranteed OHKO'
        );

        pinsir.boosts.atk = 2;
        gengar.ability = 'Unaware' as AbilityName;
        result = calculate(pinsir, gengar, earthquake);
        expect(result.damage).toBeRange(1054, 1240);
      });
    });
  });

  describe('Gen 8', () => {
    inGen(8, ({calculate, Pokemon, Move}) => {
      test('Basic: Gengar vs. Chansey', () => {
        const result = calculate(
          Pokemon('Gengar', {
            item: 'Life Orb',
            nature: 'Modest',
            evs: {spa: 252},
            boosts: {spa: 3},
          }),
          Pokemon('Chansey', {
            item: 'Eviolite',
            nature: 'Bold',
            evs: {hp: 100, spd: 100},
            boosts: {spd: 1},
          }),
          Move('Sludge Bomb')
        );
        expect(result.damage).toBeRange(204, 242);
        expect(result.desc()).toBe(
          '+3 252+ SpA Life Orb Gengar Sludge Bomb vs. +1 100 HP / 100 SpD Eviolite Chansey: 204-242 (30.6 - 36.3%) -- 52.9% chance to 3HKO'
        );
      });
    });
  });
});

/*
 TODO rewrite: this is 3 unrelated tests in one
 test('Damage should be 0 when applicable', () => {
    for (let genNum = 1; genNum <= 8; genNum++) {
      const gen = genNum as GenerationNum;
      const snorlax = new Pokemon(gen, 'Snorlax');
      const vulpix = new Pokemon(gen, 'Vulpix');
      const gengar = new Pokemon(gen, 'Gengar');
      const barrier = new Move(gen, 'Barrier');
      const cometPunch = new Move(gen, 'Comet Punch');
      const hyperBeam = new Move(gen, 'Hyper Beam');
      let result = calculate(gen, snorlax, vulpix, barrier);
      expect(result.damage).toBeRange(0, 0);
      expect(result.desc()).toBe('Snorlax Barrier vs. Vulpix: 0-0 (0 - 0%)');
      result = calculate(gen, snorlax, vulpix, cometPunch);
      if (gen < 3) {
        expect(result.damage).toBeRange(36, 43);
        expect(result.desc()).toBe(
          'Snorlax Comet Punch (3 hits) vs. Vulpix: 108-129 (38.7 - 46.2%) -- guaranteed 3HKO'
        );
      } else if (gen === 3) {
        expect(result.damage).toBeRange(44, 52);
        expect(result.desc()).toBe(
          '0 Atk Snorlax Comet Punch (3 hits) vs. 0 HP / 0 Def Vulpix: 132-156 (60.8 - 71.8%) -- guaranteed 2HKO'
        );
      } else {
        expect(result.damage).toBeRange(43, 52);
        expect(result.desc()).toBe(
          '0 Atk Snorlax Comet Punch (3 hits) vs. 0 HP / 0 Def Vulpix: 129-156 (59.4 - 71.8%) -- guaranteed 2HKO'
        );
      }
      result = calculate(gen, snorlax, gengar, hyperBeam);
      expect(result.damage).toBeRange(0, 0);
    }
    const field = new Field({
      defenderSide: {
        isLightScreen: true,
      },
    });
    const vulpix = new Pokemon(1, 'Vulpix');
    const gengar = new Pokemon(1, 'Gengar');
    const surf = new Move(1, 'Surf');
    const result = calculate(1, gengar, vulpix, surf, field);
    expect(result.desc()).toBe(
      'Gengar Surf vs. Vulpix through Light Screen: 108-128 (38.7 - 45.8%) -- guaranteed 3HKO'
    );
  });
});
*/
