"use strict";
exports.__esModule = true;
var index_1 = require("../index");
expect.extend({
    toBeRange: function (received, floor, ceiling) {
        var a = received[0];
        var b = received[received.length - 1];
        var pass = a === floor && b === ceiling;
        if (pass) {
            return {
                message: function () { return "expected range (" + a + ", " + b + ") not to be within range (" + floor + ", " + ceiling + ")"; },
                pass: pass
            };
        }
        else {
            return {
                message: function () { return "expected range (" + a + ", " + b + ") to be within range (" + floor + ", " + ceiling + ")"; },
                pass: pass
            };
        }
    }
});
var ABOMASNOW = new index_1.Pokemon(7, 'Abomasnow', {
    item: 'Icy Rock',
    ability: 'Snow Warning',
    nature: 'Hasty',
    evs: { atk: 252, spd: 4, spe: 252 }
});
var HOOPA = new index_1.Pokemon(7, 'Hoopa-Unbound', {
    item: 'Choice Band',
    ability: 'Magician',
    nature: 'Jolly',
    evs: { hp: 32, atk: 224, spe: 252 }
});
describe('calc', function () {
    describe('gen', function () {
        test('1', function () {
            var result = index_1.calculate(1, new index_1.Pokemon(1, 'Gengar'), new index_1.Pokemon(1, 'Chansey'), new index_1.Move(1, 'Thunderbolt'));
            expect(result.damage).toBeRange(79, 94);
            expect(result.desc()).toBe('Gengar Thunderbolt vs. Chansey: 79-94 (11.2 - 13.3%) -- possible 8HKO');
        });
        test('2', function () {
            var result = index_1.calculate(2, new index_1.Pokemon(2, 'Gengar'), new index_1.Pokemon(2, 'Chansey', { item: 'Leftovers' }), new index_1.Move(2, 'Dynamic Punch'));
            expect(result.damage).toBeRange(304, 358);
            expect(result.desc()).toBe('Gengar Dynamic Punch vs. Chansey: 304-358 (43.2 - 50.9%) -- guaranteed 3HKO after Leftovers recovery');
        });
        test('3', function () {
            var result = index_1.calculate(3, new index_1.Pokemon(3, 'Gengar', {
                nature: 'Mild',
                evs: { atk: 100 }
            }), new index_1.Pokemon(3, 'Chansey', {
                item: 'Leftovers',
                nature: 'Bold',
                evs: { hp: 252, def: 252 }
            }), new index_1.Move(3, 'Focus Punch'));
            expect(result.damage).toBeRange(346, 408);
            expect(result.desc()).toBe('100 Atk Gengar Focus Punch vs. 252 HP / 252+ Def Chansey: 346-408 (49.1 - 57.9%) -- 59% chance to 2HKO after Leftovers recovery');
        });
        test('4', function () {
            var result = index_1.calculate(4, new index_1.Pokemon(4, 'Gengar', {
                item: 'Choice Specs',
                nature: 'Timid',
                evs: { spa: 252 },
                boosts: { spa: 1 }
            }), new index_1.Pokemon(4, 'Chansey', {
                item: 'Leftovers',
                nature: 'Calm',
                evs: { hp: 252, spd: 252 }
            }), new index_1.Move(4, 'Focus Blast'));
            expect(result.damage).toBeRange(408, 482);
            expect(result.desc()).toBe('+1 252 SpA Choice Specs Gengar Focus Blast vs. 252 HP / 252+ SpD Chansey: 408-482 (57.9 - 68.4%) -- guaranteed 2HKO after Leftovers recovery');
        });
        test('5', function () {
            var result = index_1.calculate(5, new index_1.Pokemon(5, 'Gengar', {
                item: 'Choice Specs',
                nature: 'Timid',
                evs: { spa: 252 },
                boosts: { spa: 1 }
            }), new index_1.Pokemon(5, 'Chansey', {
                item: 'Eviolite',
                nature: 'Calm',
                evs: { hp: 252, spd: 252 }
            }), new index_1.Move(5, 'Focus Blast'));
            expect(result.damage).toBeRange(274, 324);
            expect(result.fullDesc('px')).toBe('+1 252 SpA Choice Specs Gengar Focus Blast vs. 252 HP / 252+ SpD Eviolite Chansey: 274-324 (18 - 22px) -- guaranteed 3HKO');
        });
        test('6', function () {
            var result = index_1.calculate(6, new index_1.Pokemon(6, 'Gengar', {
                item: 'Life Orb',
                nature: 'Modest',
                evs: { spa: 252 }
            }), new index_1.Pokemon(6, 'Chansey', {
                item: 'Eviolite',
                nature: 'Bold',
                evs: { hp: 252, def: 252 }
            }), new index_1.Move(6, 'Sludge Bomb'));
            expect(result.damage).toBeRange(134, 160);
            expect(result.desc()).toBe('252+ SpA Life Orb Gengar Sludge Bomb vs. 252 HP / 0 SpD Eviolite Chansey: 134-160 (19 - 22.7%) -- possible 5HKO');
        });
        test('7', function () {
            var result = index_1.calculate(7, new index_1.Pokemon(7, 'Gengar', {
                item: 'Life Orb',
                nature: 'Modest',
                evs: { spa: 252 },
                boosts: { spa: 3 }
            }), new index_1.Pokemon(7, 'Chansey', {
                item: 'Eviolite',
                nature: 'Bold',
                evs: { hp: 100, spd: 100 },
                boosts: { spd: 1 }
            }), new index_1.Move(7, 'Sludge Bomb'));
            expect(result.damage).toBeRange(204, 242);
            expect(result.desc()).toBe('+3 252+ SpA Life Orb Gengar Sludge Bomb vs. +1 100 HP / 100 SpD Eviolite Chansey: 204-242 (30.6 - 36.3%) -- 52.9% chance to 3HKO');
        });
        test('8', function () {
            var result = index_1.calculate(8, new index_1.Pokemon(8, 'Gengar', {
                item: 'Life Orb',
                nature: 'Modest',
                evs: { spa: 252 },
                boosts: { spa: 3 }
            }), new index_1.Pokemon(8, 'Chansey', {
                item: 'Eviolite',
                nature: 'Bold',
                evs: { hp: 100, spd: 100 },
                boosts: { spd: 1 }
            }), new index_1.Move(8, 'Sludge Bomb'));
            expect(result.damage).toBeRange(204, 242);
            expect(result.desc()).toBe('+3 252+ SpA Life Orb Gengar Sludge Bomb vs. +1 100 HP / 100 SpD Eviolite Chansey: 204-242 (30.6 - 36.3%) -- 52.9% chance to 3HKO');
        });
    });
    describe('field', function () {
        test('none', function () {
            var result = index_1.calculate(7, ABOMASNOW, HOOPA, new index_1.Move(7, 'Wood Hammer'));
            expect(result.damage).toBeRange(234, 276);
            expect(result.desc()).toBe('252 Atk Abomasnow Wood Hammer vs. 32 HP / 0 Def Hoopa-Unbound: 234-276 (75.7 - 89.3%) -- guaranteed 2HKO');
            var recoil = result.recoil();
            expect(recoil.recoil).toBeRange(24, 28.3);
            expect(recoil.text).toBe('24 - 28.3% recoil damage');
            result = index_1.calculate(7, HOOPA, ABOMASNOW, new index_1.Move(7, 'Drain Punch'));
            expect(result.damage).toBeRange(398, 470);
            expect(result.desc()).toBe('224 Atk Choice Band Hoopa-Unbound Drain Punch vs. 0 HP / 0- Def Abomasnow: 398-470 (123.9 - 146.4%) -- guaranteed OHKO');
            var recovery = result.recovery();
            expect(recovery.recovery).toBeRange(160, 160);
            expect(recovery.text).toBe('51.9 - 51.9% recovered');
        });
        test('none', function () {
            var field = new index_1.Field({
                gameType: 'Doubles',
                terrain: 'Grassy',
                weather: 'Hail',
                defenderSide: {
                    isSR: true,
                    spikes: 1,
                    isLightScreen: true,
                    isSeeded: true,
                    isFriendGuard: true
                },
                attackerSide: {
                    isHelpingHand: true,
                    isTailwind: true
                }
            });
            var result = index_1.calculate(7, ABOMASNOW, HOOPA, new index_1.Move(7, 'Blizzard'), field);
            expect(result.damage).toBeRange(50, 59);
            expect(result.desc()).toBe("0 SpA Abomasnow Helping Hand Blizzard vs. 32 HP / 0 SpD Hoopa-Unbound through Light Screen with an ally's Friend Guard: 50-59 (16.1 - 19%)" +
                ' -- 91.4% chance to 3HKO after Stealth Rock, 1 layer of Spikes, hail damage, Leech Seed damage, and Grassy Terrain recovery');
        });
    });
    describe('mechanics', function () {
        test('gen 2 DVs', function () {
            var aerodactyl = new index_1.Pokemon(2, 'Aerodactyl');
            var zapdos = new index_1.Pokemon(2, 'Zapdos', { ivs: { atk: 29, def: 27 }, item: 'Leftovers' });
            expect(zapdos.ivs.hp).toBe(15);
            var move = new index_1.Move(2, 'Ancient Power');
            var result = index_1.calculate(2, aerodactyl, zapdos, move);
            expect(result.damage).toBeRange(153, 180);
            expect(result.desc()).toBe('Aerodactyl Ancient Power vs. Zapdos: 153-180 (41.6 - 49%) -- guaranteed 3HKO after Leftovers recovery');
        });
        test('gen 2 struggle', function () {
            var attacker = new index_1.Pokemon(2, 'Skarmory', { boosts: { atk: 6, def: 6 } });
            var defender = new index_1.Pokemon(2, 'Skarmory', { boosts: { atk: 6, def: 6 } });
            var move = new index_1.Move(2, 'Struggle');
            var result = index_1.calculate(2, attacker, defender, move);
            expect(result.damage).toBeRange(37, 44);
            expect(result.desc()).toBe('+6 Skarmory Struggle vs. +6 Skarmory: 37-44 (11.1 - 13.2%) -- possible 8HKO');
        });
        test('gen 2 present', function () {
            var attacker = new index_1.Pokemon(2, 'Togepi', { level: 5, boosts: { atk: -6 }, status: 'Burned' });
            var defender = new index_1.Pokemon(2, 'Umbreon', { boosts: { def: 6 } });
            var move = new index_1.Move(2, 'Present');
            var field = new index_1.Field({ defenderSide: { isReflect: true } });
            var result = index_1.calculate(2, attacker, defender, move, field);
            expect(result.damage).toBeRange(125, 147);
            expect(result.desc()).toBe('-6 burned Togepi Present vs. +6 Umbreon through Reflect: 125-147 (31.8 - 37.4%) -- 89.1% chance to 3HKO');
        });
        test('zmove criticals', function () {
            var zMove = new index_1.Move(7, 'Wood Hammer', { useZ: true, isCrit: true });
            var result = index_1.calculate(7, ABOMASNOW, HOOPA, zMove);
            expect(result.damage).toBeRange(555, 654);
            expect(result.desc()).toBe('252 Atk Abomasnow Bloom Doom (190 BP) vs. 32 HP / 0 Def Hoopa-Unbound on a critical hit: 555-654 (179.6 - 211.6%) -- guaranteed OHKO');
        });
        test('grass knot', function () {
            var result = index_1.calculate(7, new index_1.Pokemon(7, 'Groudon'), new index_1.Pokemon(7, 'Groudon'), new index_1.Move(7, 'Grass Knot'));
            expect(result.damage).toBeRange(190, 224);
            result = index_1.calculate(4, new index_1.Pokemon(4, 'Groudon'), new index_1.Pokemon(4, 'Groudon'), new index_1.Move(4, 'Grass Knot'));
            expect(result.damage).toBeRange(190, 224);
        });
        test('Night Shade and Seismic Toss', function () {
            var mew = new index_1.Pokemon(1, 'Mew', { level: 50 });
            var vulpix = new index_1.Pokemon(1, 'Vulpix', { level: 100 });
            var nightshade = new index_1.Move(1, 'Night Shade');
            var stoss = new index_1.Move(1, 'Seismic Toss');
            var result = index_1.calculate(1, mew, vulpix, stoss);
            expect(result.damage).toBeRange(50, 50);
            expect(result.desc()).toBe('Mew Seismic Toss vs. Vulpix: 50-50 (17.9 - 17.9%) -- guaranteed 6HKO');
            result = index_1.calculate(1, mew, vulpix, nightshade);
            expect(result.damage).toBeRange(50, 50);
        });
        test('Critical hits should ignore attack decreasers', function () {
            var field = new index_1.Field({
                defenderSide: {
                    isReflect: true
                }
            });
            var mew = new index_1.Pokemon(1, 'Mew', { level: 100, status: 'Burned' });
            var vulpix = new index_1.Pokemon(1, 'Vulpix', { level: 100 });
            var Explosion = new index_1.Move(1, 'Explosion', { isCrit: true });
            var result = index_1.calculate(1, mew, vulpix, Explosion, field);
            mew.boosts.atk = 2;
            vulpix.boosts.def = 2;
            expect(result.damage).toBeRange(799, 939);
            expect(result.desc()).toBe('Mew Explosion vs. Vulpix on a critical hit: 799-939 (286.3 - 336.5%) -- guaranteed OHKO');
            Explosion.isCrit = false;
            result = index_1.calculate(1, mew, vulpix, Explosion, field);
            expect(result.damage).toBeRange(102, 120);
        });
        test('Damage should be 0 when applicable', function () {
            var field = new index_1.Field({
                defenderSide: {
                    isLightScreen: true
                }
            });
            var snorlax = new index_1.Pokemon(1, 'Snorlax', { level: 100 });
            var vulpix = new index_1.Pokemon(1, 'Vulpix', { level: 100 });
            var gengar = new index_1.Pokemon(1, 'Vulpix', { level: 100 });
            var barrier = new index_1.Move(1, 'Barrier');
            var cometPunch = new index_1.Move(1, 'Comet Punch');
            var hyperBeam = new index_1.Move(1, 'Hyper Beam');
            var result = index_1.calculate(1, snorlax, vulpix, barrier, field);
            expect(result.damage).toBeRange(0, 0);
            expect(result.desc()).toBe('Snorlax Barrier vs. Vulpix: 0-0 (0 - 0%)');
            result = index_1.calculate(1, snorlax, vulpix, cometPunch, field);
            expect(result.damage).toBeRange(36, 43);
            expect(result.desc()).toBe('Snorlax Comet Punch (3 hits) vs. Vulpix: 108-129 (38.7 - 46.2%) -- guaranteed 3HKO');
        });
        test('wring out', function () {
            var smeargle = new index_1.Pokemon(7, 'Smeargle', { level: 50, ability: 'Technician' });
            var blissey = new index_1.Pokemon(7, 'Blissey', { level: 50, evs: { hp: 252 }, curHP: 184 });
            var result = index_1.calculate(7, smeargle, blissey, new index_1.Move(7, 'Wring Out'));
            expect(result.damage).toBeRange(15, 18);
            expect(result.desc()).toBe('0 SpA Technician Smeargle Wring Out (60 BP) vs. 252 HP / 0 SpD Blissey: 15-18 (4.1 - 4.9%)');
        });
    });
    describe('gen 3 spread', function () {
        test('allAdjacent', function () {
            var gengar = new index_1.Pokemon(3, 'Gengar', { nature: 'Mild', evs: { atk: 100 } });
            var blissey = new index_1.Pokemon(3, 'Chansey', {
                item: 'Leftovers',
                nature: 'Bold',
                evs: { hp: 252, def: 252 }
            });
            var field = new index_1.Field({ gameType: 'Doubles' });
            var result = index_1.calculate(3, gengar, blissey, new index_1.Move(3, 'Explosion'), field);
            expect(result.damage).toBeRange(578, 681);
            expect(result.desc()).toBe('100 Atk Gengar Explosion vs. 252 HP / 252+ Def Chansey: 578-681 (82.1 - 96.7%) -- guaranteed 2HKO after Leftovers recovery');
        });
        test('allAdjacentFoes', function () {
            var gengar = new index_1.Pokemon(3, 'Gengar', { nature: 'Modest', evs: { spa: 252 } });
            var blissey = new index_1.Pokemon(3, 'Chansey', {
                item: 'Leftovers',
                nature: 'Bold',
                evs: { hp: 252, def: 252 }
            });
            var field = new index_1.Field({ gameType: 'Doubles' });
            var result = index_1.calculate(3, gengar, blissey, new index_1.Move(3, 'Blizzard'), field);
            expect(result.damage).toBeRange(69, 82);
            expect(result.desc()).toBe('252+ SpA Gengar Blizzard vs. 252 HP / 0 SpD Chansey: 69-82 (9.8 - 11.6%)');
        });
    });
    describe('water absorb', function () {
        test('gen 3', function () {
            var cacturne = new index_1.Pokemon(3, 'Cacturne', {
                ability: 'Sand Veil'
            });
            var blastoise = new index_1.Pokemon(3, 'Blastoise', {
                evs: { spa: 252 }
            });
            var surf = new index_1.Move(3, 'Surf');
            var result = index_1.calculate(3, blastoise, cacturne, surf);
            expect(result.damage).toBeRange(88, 104);
            expect(result.desc()).toBe('252 SpA Blastoise Surf vs. 0 HP / 0 SpD Cacturne: 88-104 (31.3 - 37%) -- 76.6% chance to 3HKO');
            cacturne.ability = 'Water Absorb';
            result = index_1.calculate(3, blastoise, cacturne, surf);
            expect(result.damage).toBeRange(0, 0);
        });
    });
    describe('mold breaker', function () {
        test('gen 4', function () {
            var pinsir = new index_1.Pokemon(4, 'Pinsir', {
                item: 'Choice Band',
                nature: 'Adamant',
                ability: 'Hyper Cutter',
                evs: { atk: 252 }
            });
            var gengar = new index_1.Pokemon(4, 'Gengar', {
                item: 'Choice Specs',
                nature: 'Timid',
                evs: { spa: 252 },
                boosts: { spa: 1 }
            });
            var earthquake = new index_1.Move(4, 'Earthquake');
            var result = index_1.calculate(4, pinsir, gengar, earthquake);
            expect(result.damage).toBeRange(0, 0);
            pinsir.ability = 'Mold Breaker';
            result = index_1.calculate(4, pinsir, gengar, earthquake);
            expect(result.damage).toBeRange(528, 622);
            expect(result.desc()).toBe('252+ Atk Choice Band Mold Breaker Pinsir Earthquake vs. 0 HP / 0 Def Gengar: 528-622 (202.2 - 238.3%) -- guaranteed OHKO');
            pinsir.boosts.atk = 2;
            gengar.ability = 'Unaware';
            result = index_1.calculate(4, pinsir, gengar, earthquake);
            expect(result.damage).toBeRange(1054, 1240);
        });
        test('gen 7', function () {
            var pinsir = new index_1.Pokemon(7, 'Pinsir', {
                item: 'Choice Band',
                nature: 'Adamant',
                ability: 'Hyper Cutter',
                evs: { atk: 252 }
            });
            var gengar = new index_1.Pokemon(7, 'Gengar', {
                item: 'Choice Specs',
                nature: 'Timid',
                ability: 'Levitate',
                evs: { spa: 252 },
                boosts: { spa: 1 }
            });
            var earthquake = new index_1.Move(7, 'Earthquake');
            var result = index_1.calculate(7, pinsir, gengar, earthquake);
            expect(result.damage).toBeRange(0, 0);
            pinsir.ability = 'Mold Breaker';
            result = index_1.calculate(7, pinsir, gengar, earthquake);
            expect(result.damage).toBeRange(528, 622);
            expect(result.desc()).toBe('252+ Atk Choice Band Mold Breaker Pinsir Earthquake vs. 0 HP / 0 Def Gengar: 528-622 (202.2 - 238.3%) -- guaranteed OHKO');
            pinsir.boosts.atk = 2;
            gengar.ability = 'Unaware';
            result = index_1.calculate(7, pinsir, gengar, earthquake);
            expect(result.damage).toBeRange(1054, 1240);
        });
    });
});
//# sourceMappingURL=calc.test.js.map