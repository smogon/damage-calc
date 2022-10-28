/* eslint-disable max-len */

import {AbilityName, Weather} from '../data/interface';
import {inGen, inGens, tests} from './helper';

describe('calc', () => {
  describe('Multi-Gen', () => {
    inGens(4, 7, ({gen, calculate, Pokemon, Move}) => {
      test(`Grass Knot (gen ${gen})`, () => {
        const result = calculate(Pokemon('Groudon'), Pokemon('Groudon'), Move('Grass Knot'));
        expect(result.range()).toEqual([190, 224]);
      });
    });

    inGens(4, 7, ({gen, calculate, Pokemon, Move}) => {
      test(`Arceus Plate (gen ${gen})`, () => {
        const result = calculate(
          Pokemon('Arceus', {item: 'Meadow Plate'}),
          Pokemon('Blastoise'),
          Move('Judgment')
        );
        expect(result.range()).toEqual([194, 230]);
        expect(result.desc()).toBe(
          '0 SpA Meadow Plate Arceus Judgment vs. 0 HP / 0 SpD Blastoise: 194-230 (64.8 - 76.9%) -- guaranteed 2HKO'
        );
      });
    });

    inGens(1, 8, ({gen, calculate, Pokemon, Move}) => {
      test(`Night Shade / Seismic Toss (gen ${gen})`, () => {
        const mew = Pokemon('Mew', {level: 50});
        const vulpix = Pokemon('Vulpix');
        for (const move of [Move('Seismic Toss'), Move('Night Shade')]) {
          const result = calculate(mew, vulpix, move);
          expect(result.damage).toBe(50);
          expect(result.desc()).toBe(
            gen < 3
              ? `Lvl 50 Mew ${move.name} vs. Vulpix: 50-50 (17.9 - 17.9%) -- guaranteed 6HKO`
              : `Lvl 50 Mew ${move.name} vs. 0 HP Vulpix: 50-50 (23 - 23%) -- guaranteed 5HKO`
          );
        }
      });
    });

    tests('Comet Punch', ({gen, calculate, Pokemon, Move}) => {
      expect(calculate(Pokemon('Snorlax'), Pokemon('Vulpix'), Move('Comet Punch'))).toMatch(gen, {
        1: {range: [36, 43], desc: 'Snorlax Comet Punch (3 hits) vs. Vulpix', result: '(38.7 - 46.2%) -- approx. 3HKO'},
        3: {range: [44, 52], desc: '0 Atk Snorlax Comet Punch (3 hits) vs. 0 HP / 0 Def Vulpix', result: '(60.8 - 71.8%) -- approx. 2HKO'},
        4: {range: [43, 52], result: '(59.4 - 71.8%) -- approx. 2HKO'},
      });
    });

    inGens(1, 8, ({gen, calculate, Pokemon, Move}) => {
      test(`Immunity (gen ${gen})`, () => {
        expect(calculate(Pokemon('Snorlax'), Pokemon('Gengar'), Move('Hyper Beam')).damage).toBe(0);
      });
    });

    inGens(1, 8, ({gen, calculate, Pokemon, Move}) => {
      test(`Non-damaging (gen ${gen})`, () => {
        const result = calculate(Pokemon('Snorlax'), Pokemon('Vulpix'), Move('Barrier'));
        expect(result.damage).toBe(0);
        expect(result.desc()).toBe('Snorlax Barrier vs. Vulpix: 0-0 (0 - 0%)');
      });
    });

    inGens(1, 8, ({gen, calculate, Pokemon, Move, Field}) => {
      test(`Protect (gen ${gen})`, () => {
        const field = Field({defenderSide: {isProtected: true}});
        const snorlax = Pokemon('Snorlax');
        const chansey = Pokemon('Chansey');
        expect(calculate(snorlax, chansey, Move('Hyper Beam'), field).damage).toBe(0);
      });
    });

    inGens(1, 8, ({gen, calculate, Pokemon, Move, Field}) => {
      test(`Critical hits ignore attack decreases (gen ${gen})`, () => {
        const field = Field({defenderSide: {isReflect: true}});

        const mew = Pokemon('Mew', {status: 'brn'});
        const vulpix = Pokemon('Vulpix');
        const explosion = Move('Explosion', {isCrit: true});
        let result = calculate(mew, vulpix, explosion, field);
        mew.boosts.atk = 2;
        vulpix.boosts.def = 2;
        if (gen < 2) {
          expect(result.range()).toEqual([799, 939]);
          expect(result.desc()).toBe(
            'Mew Explosion vs. Vulpix on a critical hit: 799-939 (286.3 - 336.5%) -- guaranteed OHKO'
          );
        } else if (gen < 5 && gen > 2) {
          expect(result.range()).toEqual([729, 858]);
          expect(result.desc()).toBe(
            '0 Atk burned Mew Explosion vs. 0 HP / 0 Def Vulpix on a critical hit: 729-858 (335.9 - 395.3%) -- guaranteed OHKO'
          );
        } else if (gen === 5) {
          expect(result.range()).toEqual([364, 429]);
          expect(result.desc()).toBe(
            '0 Atk burned Mew Explosion vs. 0 HP / 0 Def Vulpix on a critical hit: 364-429 (167.7 - 197.6%) -- guaranteed OHKO'
          );
        } else if (gen >= 6) {
          expect(result.range()).toEqual([273, 321]);
          expect(result.desc()).toBe(
            '0 Atk burned Mew Explosion vs. 0 HP / 0 Def Vulpix on a critical hit: 273-321 (125.8 - 147.9%) -- guaranteed OHKO'
          );
        }
        explosion.isCrit = false;
        result = calculate(mew, vulpix, explosion, field);
        if (gen === 1) {
          expect(result.range()).toEqual([102, 120]);
        } else if (gen === 2) {
          expect(result.range()).toEqual([149, 176]);
        } else if (gen > 2 && gen < 5) {
          expect(result.range()).toEqual([182, 215]);
        } else {
          expect(result.range()).toEqual([91, 107]);
        }
      });
    });

    inGens(1, 8, ({gen, calculate, Pokemon, Move}) => {
      test(`Struggle vs. Ghost (gen ${gen})`, () => {
        const result = calculate(Pokemon('Mew'), Pokemon('Gengar'), Move('Struggle'));
        if (gen < 2) {
          expect(result.range()[1]).toBe(0);
        } else {
          expect(result.range()[1]).toBeGreaterThan(0);
        }
      });
    });

    inGens(3, 8, ({gen, calculate, Pokemon, Move, Field}) => {
      test(`Weather Ball should change type depending on the weather (gen ${gen})`, () => {
        const weathers = [
          {
            weather: 'Sun', type: 'Fire', damage: {
              adv: {range: [346, 408], desc: '(149.7 - 176.6%) -- guaranteed OHKO'},
              dpp: {range: [170, 204], desc: '(73.5 - 88.3%) -- guaranteed 2HKO'},
              modern: {range: [344, 408], desc: '(148.9 - 176.6%) -- guaranteed OHKO'},
            },
          },
          {
            weather: 'Rain', type: 'Water', damage: {
              adv: {range: [86, 102], desc: '(37.2 - 44.1%) -- guaranteed 3HKO'},
              dpp: {range: [42, 51], desc: '(18.1 - 22%) -- possible 5HKO'},
              modern: {range: [86, 102], desc: '(37.2 - 44.1%) -- guaranteed 3HKO'},
            },
          },
          {
            weather: 'Sand', type: 'Rock', damage: {
              adv: {
                range: [96, 114],
                desc: '(41.5 - 49.3%) -- 20.7% chance to 2HKO after sandstorm damage',
              },
              dpp: {
                range: [39, 46],
                desc: '(16.8 - 19.9%) -- guaranteed 5HKO after sandstorm damage',
              },
              modern: {
                range: [77, 91],
                desc: '(33.3 - 39.3%) -- guaranteed 3HKO after sandstorm damage',
              },
            },
          },
          {
            weather: 'Hail', type: 'Ice', damage: {
              adv: {
                range: [234, 276],
                desc: '(101.2 - 119.4%) -- guaranteed OHKO',
              },
              dpp: {
                range: [116, 138],
                desc: '(50.2 - 59.7%) -- guaranteed 2HKO after hail damage',
              },
              modern: {
                range: [230, 272],
                desc: '(99.5 - 117.7%) -- 93.8% chance to OHKO',
              },
            },
          },
        ];

        for (const {weather, type, damage} of weathers) {
          const dmg = gen === 3 ? damage.adv : gen === 4 ? damage.dpp : damage.modern;
          const [atk, def] = gen === 3 && type === 'Rock' ? ['Atk', 'Def'] : ['SpA', 'SpD'];

          const result = calculate(
            Pokemon('Castform'),
            Pokemon('Bulbasaur'),
            Move('Weather Ball'),
            Field({weather: weather as Weather})
          );
          expect(result.range()).toEqual(dmg.range);
          expect(result.desc()).toBe(
            `0 ${atk} Castform Weather Ball (100 BP ${type}) vs. 0 HP / 0 ${def} Bulbasaur in ${weather}: ${dmg.range[0]}-${dmg.range[1]} ${dmg.desc}`
          );
        }
      });
    });

    inGens(6, 8, ({gen, calculate, Pokemon, Move}) => {
      test(`Thousand Arrows and Ring Target Should negate damage nullfiers (gen ${gen})`, () => {
        const result = calculate(Pokemon('Zygarde'), Pokemon('Swellow'), Move('Thousand Arrows'));
        expect(result.range()).toEqual([147, 174]);
        expect(result.desc()).toBe(
          '0 Atk Zygarde Thousand Arrows vs. 0 HP / 0 Def Swellow: 147-174 (56.3 - 66.6%) -- guaranteed 2HKO'
        );
      });
    });

    inGens(4, 8, ({gen, calculate, Pokemon, Move}) => {
      const zapdos = Pokemon('Zapdos', {item: 'Iron Ball'});
      if (gen === 4) {
        test(`Iron Ball negates ground immunities (gen ${gen})`, () => {
          const result = calculate(Pokemon('Vibrava'), zapdos, Move('Earthquake'));
          expect(result.range()).toEqual([186, 218]);
          expect(result.desc()).toBe(
            '0 Atk Vibrava Earthquake vs. 0 HP / 0 Def Zapdos: 186-218 (57.9 - 67.9%) -- guaranteed 2HKO'
          );
        });
      } else {
        test(`Iron Ball Should negate damage nullifiers (gen ${gen})`, () => {
          const result = calculate(Pokemon('Vibrava'), zapdos, Move('Earthquake'));
          expect(result.range()).toEqual([93, 109]);
          expect(result.desc()).toBe(
            '0 Atk Vibrava Earthquake vs. 0 HP / 0 Def Zapdos: 93-109 (28.9 - 33.9%) -- 1.2% chance to 3HKO'
          );
        });
      }
      test(`Iron Ball negates levitate (gen ${gen})`, () => {
        const result = calculate(Pokemon('Poliwrath'), Pokemon('Mismagius', {item: 'Iron Ball'}), Move('Mud Shot'));
        expect(result.range()).toEqual([29, 35]);
        expect(result.desc()).toBe(
          '0 SpA Poliwrath Mud Shot vs. 0 HP / 0 SpD Mismagius: 29-35 (11.1 - 13.4%) -- possible 8HKO'
        );
      });
    });

    inGen(8, ({gen, Pokemon}) => {
      test(`Pokemon should double their HP stat when dynamaxing (gen ${gen})`, () => {
        const munchlax = Pokemon('Munchlax', {isDynamaxed: true});
        expect(munchlax.curHP()).toBe(822);
      });
    });

    inGens(7, 8, ({gen, calculate, Pokemon, Move, Field}) => {
      test(`Psychic Terrain (gen ${gen})`, () => {
        const field = Field({terrain: 'Psychic'});
        const Mewtwo = Pokemon('Mewtwo', {
          nature: 'Timid',
          evs: {spa: 252},
          boosts: {spa: 2},
        });
        const Milotic = Pokemon('Milotic', {
          item: 'Flame Orb',
          nature: 'Bold',
          ability: 'Marvel Scale',
          evs: {hp: 248, def: 184},
          status: 'brn',
          boosts: {spd: 1},
        });
        const Psystrike = Move('Psystrike');
        const sPunch = Move('Sucker Punch');
        let result = calculate(Mewtwo, Milotic, Psystrike, field);
        if (gen < 8) {
          expect(result.range()).toEqual([331, 391]);
          expect(result.desc()).toBe(
            '+2 252 SpA Mewtwo Psystrike vs. 248 HP / 184+ Def Marvel Scale Milotic in Psychic Terrain: 331-391 (84.2 - 99.4%) -- guaranteed 2HKO after burn damage'
          );
        } else {
          expect(result.range()).toEqual([288, 339]);
          expect(result.desc()).toBe(
            '+2 252 SpA Mewtwo Psystrike vs. 248 HP / 184+ Def Marvel Scale Milotic in Psychic Terrain: 288-339 (73.2 - 86.2%) -- guaranteed 2HKO after burn damage'
          );
        }
        result = calculate(Mewtwo, Milotic, sPunch, field);
        expect(result.range()).toEqual([0, 0]);
      });
    });

    inGens(6, 8, ({gen, calculate, Pokemon, Move}) => {
      test(`Parental Bond (gen ${gen})`, () => {
        let result = calculate(
          Pokemon('Kangaskhan-Mega', {evs: {atk: 152}}),
          Pokemon('Amoonguss', {nature: 'Bold', evs: {hp: 252, def: 152}}),
          Move('Frustration')
        );

        if (gen === 6) {
          expect(result.damage).toEqual([
            [153, 154, 156, 157, 159, 162, 163, 165, 166, 168, 171, 172, 174, 175, 177, 180],
            [76, 76, 78, 78, 79, 81, 81, 82, 82, 84, 85, 85, 87, 87, 88, 90],
          ]);
          expect(result.desc()).toBe(
            '152 Atk Parental Bond Kangaskhan-Mega Frustration vs. 252 HP / 152+ Def Amoonguss: 229-270 (53 - 62.5%) -- approx. 2HKO'
          );
        } else {
          expect(result.damage).toEqual([
            [153, 154, 156, 157, 159, 162, 163, 165, 166, 168, 171, 172, 174, 175, 177, 180],
            [37, 37, 39, 39, 39, 40, 40, 40, 40, 42, 42, 42, 43, 43, 43, 45],
          ]);
          expect(result.desc()).toBe(
            '152 Atk Parental Bond Kangaskhan-Mega Frustration vs. 252 HP / 152+ Def Amoonguss: 190-225 (43.9 - 52%) -- approx. 6.6% chance to 2HKO'
          );
        }

        result = calculate(
          Pokemon('Kangaskhan-Mega', {level: 88}),
          Pokemon('Amoonguss'),
          Move('Seismic Toss')
        );
        expect(result.damage).toEqual([88, 88]);
        expect(result.desc()).toBe(
          'Lvl 88 Parental Bond Kangaskhan-Mega Seismic Toss vs. 0 HP Amoonguss: 176-176 (47.6 - 47.6%) -- guaranteed 3HKO'
        );

        result = calculate(
          Pokemon('Kangaskhan-Mega', {evs: {atk: 252}}),
          Pokemon('Aggron', {level: 72}),
          Move('Power-Up Punch')
        );
        if (gen === 6) {
          expect(result.desc()).toBe(
            '252 Atk Parental Bond Kangaskhan-Mega Power-Up Punch vs. Lvl 72 0 HP / 0 Def Aggron: 248-296 (120.9 - 144.3%) -- guaranteed OHKO'
          );
        } else {
          expect(result.desc()).toBe(
            '252 Atk Parental Bond Kangaskhan-Mega Power-Up Punch vs. Lvl 72 0 HP / 0 Def Aggron: 196-236 (95.6 - 115.1%) -- 78.9% chance to OHKO'
          );
        }

        if (gen === 6) return;

        result = calculate(
          Pokemon('Kangaskhan-Mega', {evs: {atk: 252}}),
          Pokemon('Lunala'),
          Move('Crunch')
        );

        expect(result.damage).toEqual([
          [188, 190, 192, 194, 196, 198, 202, 204, 206, 208, 210, 212, 214, 216, 218, 222],
          [92, 96, 96, 96, 96, 100, 100, 100, 104, 104, 104, 104, 108, 108, 108, 112],
        ]);
        expect(result.desc()).toBe(
          '252 Atk Parental Bond Kangaskhan-Mega Crunch vs. 0 HP / 0 Def Shadow Shield Lunala: 280-334 (67.4 - 80.4%) -- approx. 2HKO'
        );
      });
    });
  });


  describe('Gen 1', () => {
    inGen(1, ({calculate, Pokemon, Move, Field}) => {
      test('Basic: Gengar vs. Chansey', () => {
        const result = calculate(Pokemon('Gengar'), Pokemon('Chansey'), Move('Thunderbolt'));
        expect(result.range()).toEqual([79, 94]);
        expect(result.desc()).toBe(
          'Gengar Thunderbolt vs. Chansey: 79-94 (11.2 - 13.3%) -- possible 8HKO'
        );
      });

      test('Light Screen', () => {
        const field = Field({defenderSide: {isLightScreen: true}});
        const result = calculate(Pokemon('Gengar'), Pokemon('Vulpix'), Move('Surf'), field);
        expect(result.desc()).toBe(
          'Gengar Surf vs. Vulpix through Light Screen: 108-128 (38.7 - 45.8%) -- guaranteed 3HKO'
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
        expect(result.range()).toEqual([304, 358]);
        expect(result.desc()).toBe(
          'Gengar Dynamic Punch vs. Chansey: 304-358 (43.2 - 50.9%) -- guaranteed 3HKO after Leftovers recovery'
        );
      });

      test('Struggle', () => {
        const attacker = Pokemon('Skarmory', {boosts: {atk: 6, def: 6}});
        const defender = Pokemon('Skarmory', {boosts: {atk: 6, def: 6}});
        const move = Move('Struggle');
        const result = calculate(attacker, defender, move);
        expect(result.range()).toEqual([37, 44]);
        expect(result.desc()).toBe(
          '+6 Skarmory Struggle vs. +6 Skarmory: 37-44 (11.1 - 13.2%) -- possible 8HKO'
        );
      });

      test('Present', () => {
        const attacker = Pokemon('Togepi', {level: 5, boosts: {atk: -6}, status: 'brn'});
        const defender = Pokemon('Umbreon', {boosts: {def: 6}});
        const move = Move('Present');
        const field = Field({defenderSide: {isReflect: true}});
        const result = calculate(attacker, defender, move, field);
        expect(result.range()).toEqual([125, 147]);
        expect(result.desc()).toBe(
          '-6 Lvl 5 burned Togepi Present vs. +6 Umbreon through Reflect: 125-147 (31.8 - 37.4%) -- 89.1% chance to 3HKO'
        );
      });

      test('DVs', () => {
        const aerodactyl = Pokemon('Aerodactyl');
        const zapdos = Pokemon('Zapdos', {ivs: {atk: 29, def: 27}, item: 'Leftovers'});
        expect(zapdos.ivs.hp).toBe(14);

        const move = Move('Ancient Power');
        const result = calculate(aerodactyl, zapdos, move);
        expect(result.range()).toEqual([153, 180]);
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
        expect(result.range()).toEqual([346, 408]);
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
        expect(result.range()).toEqual([88, 104]);
        expect(result.desc()).toBe(
          '252 SpA Blastoise Surf vs. 0 HP / 0 SpD Cacturne: 88-104 (31.3 - 37%) -- 76.6% chance to 3HKO'
        );

        cacturne.ability = 'Water Absorb' as AbilityName;
        result = calculate(blastoise, cacturne, surf);
        expect(result.damage).toBe(0);
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
          expect(result.range()).toEqual([578, 681]);
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
          expect(result.range()).toEqual([69, 82]);
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
        expect(result.range()).toEqual([408, 482]);
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
        expect(result.damage).toBe(0);

        pinsir.ability = 'Mold Breaker' as AbilityName;
        result = calculate(pinsir, gengar, earthquake);
        expect(result.range()).toEqual([528, 622]);
        expect(result.desc()).toBe(
          '252+ Atk Choice Band Mold Breaker Pinsir Earthquake vs. 0 HP / 0 Def Gengar: 528-622 (202.2 - 238.3%) -- guaranteed OHKO'
        );

        pinsir.boosts.atk = 2;
        gengar.ability = 'Unaware' as AbilityName;
        result = calculate(pinsir, gengar, earthquake);
        expect(result.range()).toEqual([1054, 1240]);
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
        expect(result.range()).toEqual([274, 324]);
        expect(result.fullDesc('px')).toBe(
          '+1 252 SpA Choice Specs Gengar Focus Blast vs. 252 HP / 252+ SpD Eviolite Chansey: 274-324 (18 - 22px) -- guaranteed 3HKO'
        );
      });
      test('Technician with Low Kick', () => {
        const ambipom = Pokemon('Ambipom', {level: 50, ability: 'Technician'});
        const blissey = Pokemon('Blissey', {level: 50, evs: {hp: 252}});
        let result = calculate(ambipom, blissey, Move('Low Kick'));
        expect(result.range()).toEqual([272, 320]);
        expect(result.desc()).toBe(
          '0 Atk Technician Ambipom Low Kick (60 BP) vs. 252 HP / 0 Def Blissey: 272-320 (75.1 - 88.3%) -- guaranteed 2HKO'
        );

        const aggron = Pokemon('Aggron', {level: 50, evs: {hp: 252}});
        result = calculate(ambipom, aggron, Move('Low Kick'));
        expect(result.range()).toEqual([112, 132]);
        expect(result.desc()).toBe(
          '0 Atk Ambipom Low Kick (120 BP) vs. 252 HP / 0 Def Aggron: 112-132 (63.2 - 74.5%) -- guaranteed 2HKO'
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
        expect(result.range()).toEqual([134, 160]);
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
        expect(result.range()).toEqual([204, 242]);
        expect(result.desc()).toBe(
          '+3 252+ SpA Life Orb Gengar Sludge Bomb vs. +1 100 HP / 100 SpD Eviolite Chansey: 204-242 (30.6 - 36.3%) -- 52.9% chance to 3HKO'
        );
      });

      test('Z-Move critical hits', () => {
        const zMove = Move('Wood Hammer', {useZ: true, isCrit: true});
        const result = calculate(abomasnow, hoopa, zMove);
        expect(result.range()).toEqual([555, 654]);
        expect(result.desc()).toBe(
          '252 Atk Abomasnow Bloom Doom (190 BP) vs. 32 HP / 0 Def Hoopa-Unbound on a critical hit: 555-654 (179.6 - 211.6%) -- guaranteed OHKO'
        );
      });

      test('Recoil & Recovery', () => {
        let result = calculate(abomasnow, hoopa, Move('Wood Hammer'));
        expect(result.range()).toEqual([234, 276]);
        expect(result.desc()).toBe(
          '252 Atk Abomasnow Wood Hammer vs. 32 HP / 0 Def Hoopa-Unbound: 234-276 (75.7 - 89.3%) -- guaranteed 2HKO'
        );
        const recoil = result.recoil();
        expect(recoil.recoil).toEqual([24, 28.3]);
        expect(recoil.text).toBe('24 - 28.3% recoil damage');

        result = calculate(hoopa, abomasnow, Move('Drain Punch'));
        expect(result.range()).toEqual([398, 470]);
        expect(result.desc()).toBe(
          '224 Atk Choice Band Hoopa-Unbound Drain Punch vs. 0 HP / 0- Def Abomasnow: 398-470 (123.9 - 146.4%) -- guaranteed OHKO'
        );
        const recovery = result.recovery();
        expect(recovery.recovery).toEqual([161, 161]);
        expect(recovery.text).toBe('52.1 - 52.1% recovered');
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
        expect(result.range()).toEqual([50, 59]);
        expect(result.desc()).toBe(
          '0 SpA Abomasnow Helping Hand Blizzard vs. 32 HP / 0 SpD Hoopa-Unbound through Light Screen with an ally\'s Friend Guard: 50-59 (16.1 - 19%)' +
            ' -- 91.4% chance to 3HKO after Stealth Rock, 1 layer of Spikes, hail damage, Leech Seed damage, and Grassy Terrain recovery'
        );
      });

      test('Wring Out', () => {
        const smeargle = Pokemon('Smeargle', {level: 50, ability: 'Technician'});
        const blissey = Pokemon('Blissey', {level: 50, evs: {hp: 252}, curHP: 184});
        const result = calculate(smeargle, blissey, Move('Wring Out'));
        expect(result.range()).toEqual([15, 18]);
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
        expect(result.damage).toBe(0);

        pinsir.ability = 'Mold Breaker' as AbilityName;
        result = calculate(pinsir, gengar, earthquake);
        expect(result.range()).toEqual([528, 622]);
        expect(result.desc()).toBe(
          '252+ Atk Choice Band Mold Breaker Pinsir Earthquake vs. 0 HP / 0 Def Gengar: 528-622 (202.2 - 238.3%) -- guaranteed OHKO'
        );

        pinsir.boosts.atk = 2;
        gengar.ability = 'Unaware' as AbilityName;
        result = calculate(pinsir, gengar, earthquake);
        expect(result.range()).toEqual([1054, 1240]);
      });

      test('16-bit Overflow', () => {
        const result = calculate(
          Pokemon('Mewtwo-Mega-Y', {evs: {spa: 196}}),
          Pokemon('Wynaut', {level: 1, boosts: {spd: -6}}),
          Move('Fire Blast'),
          Field({attackerSide: {isHelpingHand: true}})
        );
        expect(result.damage).toEqual([
          55725, 56380, 57036, 57691,
          58347, 59003, 59658, 60314,
          60969, 61625, 62281, 62936,
          63592, 64247, 64903, 23, // <- overflow: 65559 & 0xFFFF
        ]);
      });

      test('32-bit Overflow', () => {
        let kyogre = Pokemon('Kyogre', {
          ability: 'Water Bubble',
          item: 'Choice Specs',
          curHP: 340, // we need 149 base power Water Spout
          ivs: {spa: 6}, // we need 311 Spa
          boosts: {spa: 6},
        });
        const wynaut = Pokemon('Wynaut', {level: 1, boosts: {spd: -6}});
        const waterSpout = Move('Water Spout');
        const field = Field({weather: 'Rain', attackerSide: {isHelpingHand: true}});

        expect(calculate(kyogre, wynaut, waterSpout, field).range()).toEqual([55, 66]);

        kyogre = Pokemon('Kyogre', {...kyogre, overrides: {types: ['Normal']}});
        expect(calculate(kyogre, wynaut, waterSpout, field).range()).toEqual([37, 44]);
      });
    });
  });

  describe('Gen 8', () => {
    inGen(8, ({calculate, Pokemon, Move, Field}) => {
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
        expect(result.range()).toEqual([204, 242]);
        expect(result.desc()).toBe(
          '+3 252+ SpA Life Orb Gengar Sludge Bomb vs. +1 100 HP / 100 SpD Eviolite Chansey: 204-242 (30.6 - 36.3%) -- 52.9% chance to 3HKO'
        );
      });

      test('Knock Off vs. Silvally', () => {
        const sawk = Pokemon('Sawk', {ability: 'Mold Breaker', evs: {atk: 252}});
        const silvally = Pokemon('Silvally-Dark', {item: 'Dark Memory'});
        const knockoff = Move('Knock Off');
        const result = calculate(sawk, silvally, knockoff);
        expect(result.desc()).toBe(
          '252 Atk Mold Breaker Sawk Knock Off vs. 0 HP / 0 Def Silvally-Dark: 36-43 (10.8 - 12.9%) -- possible 8HKO'
        );
      });

      test('-ate Abilities', () => {
        const sylveon = Pokemon('Sylveon', {ability: 'Pixilate', evs: {spa: 252}});
        const silvally = Pokemon('Silvally');
        const hypervoice = Move('Hyper Voice');
        const result = calculate(sylveon, silvally, hypervoice);
        expect(result.desc()).toBe(
          '252 SpA Pixilate Sylveon Hyper Voice vs. 0 HP / 0 SpD Silvally: 165-195 (49.8 - 58.9%) -- 99.6% chance to 2HKO'
        );
      });

      test('% chance to OHKO', () => {
        const abomasnow = Pokemon('Abomasnow', {
          level: 55,
          item: 'Choice Specs',
          evs: {spa: 252},
        });
        const deerling = Pokemon('Deerling', {evs: {hp: 36}});
        const blizzard = Move('Blizzard');
        const hail = Field({weather: 'Hail'});
        const result = calculate(abomasnow, deerling, blizzard, hail);
        expect(result.desc()).toBe(
          'Lvl 55 252 SpA Choice Specs Abomasnow Blizzard vs. 36 HP / 0 SpD Deerling: 236-278 (87.4 - 102.9%) -- 25% chance to OHKO'
        );
      });

      test('% chance to OHKO with Leftovers', () => {
        const kyurem = Pokemon('Kyurem', {
          level: 100,
          item: 'Choice Specs',
          evs: {spa: 252},
        });
        const jirachi = Pokemon('Jirachi', {item: 'Leftovers'});
        const earthpower = Move('Earth Power');
        const result = calculate(kyurem, jirachi, earthpower);
        expect(result.desc()).toBe(
          '252 SpA Choice Specs Kyurem Earth Power vs. 0 HP / 0 SpD Jirachi: 294-348 (86.2 - 102%) -- 12.5% chance to OHKO'
        );
      });

      test('Technician with Low Kick', () => {
        const ambipom = Pokemon('Ambipom', {level: 50, ability: 'Technician'});
        const blissey = Pokemon('Blissey', {level: 50, evs: {hp: 252}});
        let result = calculate(ambipom, blissey, Move('Low Kick'));
        expect(result.range()).toEqual([272, 320]);
        expect(result.desc()).toBe(
          '0 Atk Technician Ambipom Low Kick (60 BP) vs. 252 HP / 0 Def Blissey: 272-320 (75.1 - 88.3%) -- guaranteed 2HKO'
        );

        const aggron = Pokemon('Aggron', {level: 50, evs: {hp: 252}});
        result = calculate(ambipom, aggron, Move('Low Kick'));
        expect(result.range()).toEqual([112, 132]);
        expect(result.desc()).toBe(
          '0 Atk Ambipom Low Kick (120 BP) vs. 252 HP / 0 Def Aggron: 112-132 (63.2 - 74.5%) -- guaranteed 2HKO'
        );
      });
    });
  });
});
