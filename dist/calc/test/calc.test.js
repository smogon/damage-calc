"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
exports.__esModule = true;
var helper_1 = require("./helper");
describe('calc', function () {
    describe('Multi-Gen', function () {
        (0, helper_1.inGens)(4, 7, function (_a) {
            var gen = _a.gen, calculate = _a.calculate, Pokemon = _a.Pokemon, Move = _a.Move;
            test("Grass Knot (gen ".concat(gen, ")"), function () {
                var result = calculate(Pokemon('Groudon'), Pokemon('Groudon'), Move('Grass Knot'));
                expect(result.range()).toEqual([190, 224]);
            });
        });
        (0, helper_1.inGens)(4, 7, function (_a) {
            var gen = _a.gen, calculate = _a.calculate, Pokemon = _a.Pokemon, Move = _a.Move;
            test("Arceus Plate (gen ".concat(gen, ")"), function () {
                var result = calculate(Pokemon('Arceus', { item: 'Meadow Plate' }), Pokemon('Blastoise'), Move('Judgment'));
                expect(result.range()).toEqual([194, 230]);
                expect(result.desc()).toBe('0 SpA Meadow Plate Arceus Judgment vs. 0 HP / 0 SpD Blastoise: 194-230 (64.8 - 76.9%) -- guaranteed 2HKO');
            });
        });
        (0, helper_1.inGens)(1, 9, function (_a) {
            var gen = _a.gen, calculate = _a.calculate, Pokemon = _a.Pokemon, Move = _a.Move;
            test("Night Shade / Seismic Toss (gen ".concat(gen, ")"), function () {
                var e_1, _a;
                var mew = Pokemon('Mew', { level: 50 });
                var vulpix = Pokemon('Vulpix');
                try {
                    for (var _b = __values([Move('Seismic Toss'), Move('Night Shade')]), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var move = _c.value;
                        var result = calculate(mew, vulpix, move);
                        expect(result.damage).toBe(50);
                        expect(result.desc()).toBe(gen < 3
                            ? "Lvl 50 Mew ".concat(move.name, " vs. Vulpix: 50-50 (17.9 - 17.9%) -- guaranteed 6HKO")
                            : "Lvl 50 Mew ".concat(move.name, " vs. 0 HP Vulpix: 50-50 (23 - 23%) -- guaranteed 5HKO"));
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            });
        });
        (0, helper_1.tests)('Comet Punch', function (_a) {
            var gen = _a.gen, calculate = _a.calculate, Pokemon = _a.Pokemon, Move = _a.Move;
            expect(calculate(Pokemon('Snorlax'), Pokemon('Vulpix'), Move('Comet Punch'))).toMatch(gen, {
                1: { range: [108, 129], desc: 'Snorlax Comet Punch (3 hits) vs. Vulpix', result: '(38.7 - 46.2%) -- approx. 3HKO' },
                3: { range: [132, 156], desc: '0 Atk Snorlax Comet Punch (3 hits) vs. 0 HP / 0 Def Vulpix', result: '(60.8 - 71.8%) -- approx. 2HKO' },
                4: { range: [129, 156], result: '(59.4 - 71.8%) -- approx. 2HKO' }
            });
        });
        (0, helper_1.inGens)(1, 9, function (_a) {
            var gen = _a.gen, calculate = _a.calculate, Pokemon = _a.Pokemon, Move = _a.Move;
            test("Immunity (gen ".concat(gen, ")"), function () {
                expect(calculate(Pokemon('Snorlax'), Pokemon('Gengar'), Move('Hyper Beam')).damage).toBe(0);
            });
        });
        (0, helper_1.inGens)(1, 9, function (_a) {
            var gen = _a.gen, calculate = _a.calculate, Pokemon = _a.Pokemon, Move = _a.Move;
            test("Non-damaging (gen ".concat(gen, ")"), function () {
                var result = calculate(Pokemon('Snorlax'), Pokemon('Vulpix'), Move('Barrier'));
                expect(result.damage).toBe(0);
                expect(result.desc()).toBe('Snorlax Barrier vs. Vulpix: 0-0 (0 - 0%)');
            });
        });
        (0, helper_1.inGens)(1, 9, function (_a) {
            var gen = _a.gen, calculate = _a.calculate, Pokemon = _a.Pokemon, Move = _a.Move, Field = _a.Field;
            test("Protect (gen ".concat(gen, ")"), function () {
                var field = Field({ defenderSide: { isProtected: true } });
                var snorlax = Pokemon('Snorlax');
                var chansey = Pokemon('Chansey');
                expect(calculate(snorlax, chansey, Move('Hyper Beam'), field).damage).toBe(0);
            });
        });
        (0, helper_1.inGens)(1, 9, function (_a) {
            var gen = _a.gen, calculate = _a.calculate, Pokemon = _a.Pokemon, Move = _a.Move, Field = _a.Field;
            test("Critical hits ignore attack decreases (gen ".concat(gen, ")"), function () {
                var field = Field({ defenderSide: { isReflect: true } });
                var mew = Pokemon('Mew', { status: 'brn' });
                var vulpix = Pokemon('Vulpix');
                var explosion = Move('Explosion', { isCrit: true });
                var result = calculate(mew, vulpix, explosion, field);
                mew.boosts.atk = 2;
                vulpix.boosts.def = 2;
                if (gen < 2) {
                    expect(result.range()).toEqual([799, 939]);
                    expect(result.desc()).toBe('Mew Explosion vs. Vulpix on a critical hit: 799-939 (286.3 - 336.5%) -- guaranteed OHKO');
                }
                else if (gen < 5 && gen > 2) {
                    expect(result.range()).toEqual([729, 858]);
                    expect(result.desc()).toBe('0 Atk burned Mew Explosion vs. 0 HP / 0 Def Vulpix on a critical hit: 729-858 (335.9 - 395.3%) -- guaranteed OHKO');
                }
                else if (gen === 5) {
                    expect(result.range()).toEqual([364, 429]);
                    expect(result.desc()).toBe('0 Atk burned Mew Explosion vs. 0 HP / 0 Def Vulpix on a critical hit: 364-429 (167.7 - 197.6%) -- guaranteed OHKO');
                }
                else if (gen >= 6) {
                    expect(result.range()).toEqual([273, 321]);
                    expect(result.desc()).toBe('0 Atk burned Mew Explosion vs. 0 HP / 0 Def Vulpix on a critical hit: 273-321 (125.8 - 147.9%) -- guaranteed OHKO');
                }
                explosion.isCrit = false;
                result = calculate(mew, vulpix, explosion, field);
                if (gen === 1) {
                    expect(result.range()).toEqual([102, 120]);
                }
                else if (gen === 2) {
                    expect(result.range()).toEqual([149, 176]);
                }
                else if (gen > 2 && gen < 5) {
                    expect(result.range()).toEqual([182, 215]);
                }
                else {
                    expect(result.range()).toEqual([91, 107]);
                }
            });
        });
        (0, helper_1.inGens)(1, 9, function (_a) {
            var gen = _a.gen, calculate = _a.calculate, Pokemon = _a.Pokemon, Move = _a.Move;
            test("Struggle vs. Ghost (gen ".concat(gen, ")"), function () {
                var result = calculate(Pokemon('Mew'), Pokemon('Gengar'), Move('Struggle'));
                if (gen < 2) {
                    expect(result.range()[1]).toBe(0);
                }
                else {
                    expect(result.range()[1]).toBeGreaterThan(0);
                }
            });
        });
        (0, helper_1.inGens)(3, 9, function (_a) {
            var gen = _a.gen, calculate = _a.calculate, Pokemon = _a.Pokemon, Move = _a.Move, Field = _a.Field;
            test("Weather Ball should change type depending on the weather (gen ".concat(gen, ")"), function () {
                var e_2, _a;
                var weathers = [
                    {
                        weather: 'Sun', type: 'Fire', damage: {
                            adv: { range: [346, 408], desc: '(149.7 - 176.6%) -- guaranteed OHKO' },
                            dpp: { range: [342, 404], desc: '(148 - 174.8%) -- guaranteed OHKO' },
                            modern: { range: [344, 408], desc: '(148.9 - 176.6%) -- guaranteed OHKO' }
                        }
                    },
                    {
                        weather: 'Rain', type: 'Water', damage: {
                            adv: { range: [86, 102], desc: '(37.2 - 44.1%) -- guaranteed 3HKO' },
                            dpp: { range: [85, 101], desc: '(36.7 - 43.7%) -- guaranteed 3HKO' },
                            modern: { range: [86, 102], desc: '(37.2 - 44.1%) -- guaranteed 3HKO' }
                        }
                    },
                    {
                        weather: 'Sand', type: 'Rock', damage: {
                            adv: {
                                range: [96, 114],
                                desc: '(41.5 - 49.3%) -- 82.4% chance to 2HKO after sandstorm damage'
                            },
                            dpp: {
                                range: [77, 91],
                                desc: '(33.3 - 39.3%) -- guaranteed 3HKO after sandstorm damage'
                            },
                            modern: {
                                range: [77, 91],
                                desc: '(33.3 - 39.3%) -- guaranteed 3HKO after sandstorm damage'
                            }
                        }
                    },
                    {
                        weather: 'Hail', type: 'Ice', damage: {
                            adv: {
                                range: [234, 276],
                                desc: '(101.2 - 119.4%) -- guaranteed OHKO'
                            },
                            dpp: {
                                range: [230, 272],
                                desc: '(99.5 - 117.7%) -- 93.8% chance to OHKO (guaranteed OHKO after hail damage)'
                            },
                            modern: {
                                range: [230, 272],
                                desc: '(99.5 - 117.7%) -- 93.8% chance to OHKO (guaranteed OHKO after hail damage)'
                            }
                        }
                    },
                ];
                try {
                    for (var weathers_1 = __values(weathers), weathers_1_1 = weathers_1.next(); !weathers_1_1.done; weathers_1_1 = weathers_1.next()) {
                        var _b = weathers_1_1.value, weather = _b.weather, type = _b.type, damage = _b.damage;
                        var dmg = gen === 3 ? damage.adv : gen === 4 ? damage.dpp : damage.modern;
                        var _c = __read(gen === 3 && type === 'Rock' ? ['Atk', 'Def'] : ['SpA', 'SpD'], 2), atk = _c[0], def = _c[1];
                        var result = calculate(Pokemon('Castform'), Pokemon('Bulbasaur'), Move('Weather Ball'), Field({ weather: weather }));
                        expect(result.range()).toEqual(dmg.range);
                        expect(result.desc()).toBe("0 ".concat(atk, " Castform Weather Ball (100 BP ").concat(type, ") vs. 0 HP / 0 ").concat(def, " Bulbasaur in ").concat(weather, ": ").concat(dmg.range[0], "-").concat(dmg.range[1], " ").concat(dmg.desc));
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (weathers_1_1 && !weathers_1_1.done && (_a = weathers_1["return"])) _a.call(weathers_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            });
        });
        (0, helper_1.inGens)(6, 9, function (_a) {
            var gen = _a.gen, calculate = _a.calculate, Pokemon = _a.Pokemon, Move = _a.Move;
            test("Flying Press (gen ".concat(gen, ")"), function () {
                var attacker = Pokemon('Hawlucha');
                var flyingPress = Move('Flying Press');
                var result = calculate(attacker, Pokemon('Cacturne'), flyingPress);
                if (gen === 6) {
                    expect(result.range()).toEqual([484, 576]);
                    expect(result.desc()).toBe('0 Atk Hawlucha Flying Press vs. 0 HP / 0 Def Cacturne: 484-576 (172.2 - 204.9%) -- guaranteed OHKO');
                }
                else {
                    expect(result.range()).toEqual([612, 720]);
                    expect(result.desc()).toBe('0 Atk Hawlucha Flying Press vs. 0 HP / 0 Def Cacturne: 612-720 (217.7 - 256.2%) -- guaranteed OHKO');
                }
                var result2 = calculate(attacker, Pokemon('Spiritomb'), flyingPress);
                expect(result2.range()).toEqual([0, 0]);
                var scrappyAttacker = Pokemon('Hawlucha', { 'ability': 'Scrappy' });
                var ringTargetSpiritomb = Pokemon('Spiritomb', { 'item': 'Ring Target' });
                var result3 = calculate(attacker, ringTargetSpiritomb, flyingPress);
                var result4 = calculate(scrappyAttacker, Pokemon('Spiritomb'), flyingPress);
                if (gen === 6) {
                    expect(result3.range()).toEqual([152, 180]);
                    expect(result4.range()).toEqual([152, 180]);
                }
                else {
                    expect(result3.range()).toEqual([188, 224]);
                    expect(result4.range()).toEqual([188, 224]);
                }
            });
        });
        (0, helper_1.inGens)(6, 9, function (_a) {
            var gen = _a.gen, calculate = _a.calculate, Pokemon = _a.Pokemon, Move = _a.Move;
            test("Thousand Arrows and Ring Target Should negate damage nullfiers (gen ".concat(gen, ")"), function () {
                var result = calculate(Pokemon('Zygarde'), Pokemon('Swellow'), Move('Thousand Arrows'));
                expect(result.range()).toEqual([147, 174]);
                expect(result.desc()).toBe('0 Atk Zygarde Thousand Arrows vs. 0 HP / 0 Def Swellow: 147-174 (56.3 - 66.6%) -- guaranteed 2HKO');
            });
        });
        (0, helper_1.inGens)(5, 9, function (_a) {
            var gen = _a.gen, calculate = _a.calculate, Pokemon = _a.Pokemon, Move = _a.Move;
            test("Ring Target should negate type nullfiers (gen ".concat(gen, ")"), function () {
                var attacker = Pokemon('Mew');
                var defender = Pokemon('Skarmory', { 'item': 'Ring Target' });
                var result = calculate(attacker, defender, Move('Sludge Bomb'));
                expect(result.range()).toEqual([87, 103]);
                expect(result.desc()).toBe('0 SpA Mew Sludge Bomb vs. 0 HP / 0 SpD Skarmory: 87-103 (32.1 - 38%) -- 94.6% chance to 3HKO');
                var result2 = calculate(attacker, defender, Move('Earth Power'));
                expect(result2.range()).toEqual([174, 206]);
                expect(result2.desc()).toBe('0 SpA Mew Earth Power vs. 0 HP / 0 SpD Skarmory: 174-206 (64.2 - 76%) -- guaranteed 2HKO');
            });
        });
        describe('IVs are shown if applicable', function () {
            (0, helper_1.inGens)(3, 9, function (_a) {
                var gen = _a.gen, calculate = _a.calculate, Pokemon = _a.Pokemon, Move = _a.Move;
                test("Gen ".concat(gen), function () {
                    var ivs = { spa: 9, spd: 9, hp: 9 };
                    var evs = { spa: 9, spd: 9, hp: 9 };
                    var result = calculate(Pokemon('Mew', { ivs: ivs }), Pokemon('Mew', { evs: evs }), Move('Psychic'));
                    expect(result.desc()).toBe('0 SpA 9 IVs Mew Psychic vs. 9 HP / 9 SpD Mew: 43-51 (12.5 - 14.8%) -- possible 7HKO');
                    result = calculate(Pokemon('Mew', { evs: evs }), Pokemon('Mew', { ivs: ivs }), Move('Psychic'));
                    expect(result.desc()).toBe('9 SpA Mew Psychic vs. 0 HP 9 IVs / 0 SpD 9 IVs Mew: 54-64 (16.9 - 20%) -- possible 5HKO');
                });
            });
        });
        (0, helper_1.inGens)(4, 9, function (_a) {
            var gen = _a.gen, calculate = _a.calculate, Pokemon = _a.Pokemon, Move = _a.Move;
            var zapdos = Pokemon('Zapdos', { item: 'Iron Ball' });
            if (gen === 4) {
                test("Iron Ball negates ground immunities (gen ".concat(gen, ")"), function () {
                    var result = calculate(Pokemon('Vibrava'), zapdos, Move('Earthquake'));
                    expect(result.range()).toEqual([186, 218]);
                    expect(result.desc()).toBe('0 Atk Vibrava Earthquake vs. 0 HP / 0 Def Zapdos: 186-218 (57.9 - 67.9%) -- guaranteed 2HKO');
                });
            }
            else {
                test("Iron Ball Should negate damage nullifiers (gen ".concat(gen, ")"), function () {
                    var result = calculate(Pokemon('Vibrava'), zapdos, Move('Earthquake'));
                    expect(result.range()).toEqual([93, 109]);
                    expect(result.desc()).toBe('0 Atk Vibrava Earthquake vs. 0 HP / 0 Def Zapdos: 93-109 (28.9 - 33.9%) -- 1.2% chance to 3HKO');
                });
            }
            test("Iron Ball negates levitate (gen ".concat(gen, ")"), function () {
                var result = calculate(Pokemon('Poliwrath'), Pokemon('Mismagius', { item: 'Iron Ball' }), Move('Mud Shot'));
                expect(result.range()).toEqual([29, 35]);
                expect(result.desc()).toBe('0 SpA Poliwrath Mud Shot vs. 0 HP / 0 SpD Mismagius: 29-35 (11.1 - 13.4%) -- possible 8HKO');
            });
        });
        (0, helper_1.inGens)(5, 9, function (_a) {
            var gen = _a.gen, calculate = _a.calculate, Pokemon = _a.Pokemon, Move = _a.Move, Field = _a.Field;
            var dragonite = Pokemon('Dragonite', { ability: 'Multiscale' });
            var dragonite1 = Pokemon('Dragonite', { ability: 'Multiscale', curHP: 69 });
            var dragonite2 = Pokemon('Dragonite', { ability: 'Shadow Shield', item: 'Heavy-Duty Boots' });
            if (gen > 7) {
                test("Multiscale and Shadow Shield halves damage even if there are hazzards if holding Heavy-Duty Boots (gen ".concat(gen, ")"), function () {
                    var field = Field({ defenderSide: { isSR: true } });
                    var result = calculate(Pokemon('Abomasnow'), dragonite2, Move('Blizzard'), field);
                    expect(result.range()).toEqual([222, 264]);
                    expect(result.desc()).toBe('0 SpA Abomasnow Blizzard vs. 0 HP / 0 SpD Shadow Shield Dragonite: 222-264 (68.7 - 81.7%) -- guaranteed 2HKO');
                });
            }
            test("Multiscale and Shadow Shield should not halve damage if less than 100% HP (gen ".concat(gen, ")"), function () {
                var result = calculate(Pokemon('Abomasnow'), dragonite1, Move('Ice Shard'));
                expect(result.range()).toEqual([168, 204]);
                expect(result.desc()).toBe('0 Atk Abomasnow Ice Shard vs. 0 HP / 0 Def Dragonite: 168-204 (52 - 63.1%) -- guaranteed OHKO');
            });
            test("Multiscale and Shadow Shield Should halve damage taken (gen ".concat(gen, ")"), function () {
                var result = calculate(Pokemon('Abomasnow'), dragonite, Move('Ice Shard'));
                expect(result.range()).toEqual([84, 102]);
                expect(result.desc()).toBe('0 Atk Abomasnow Ice Shard vs. 0 HP / 0 Def Multiscale Dragonite: 84-102 (26 - 31.5%) -- guaranteed 4HKO');
            });
            describe('Weight', function () {
                describe('Heavy Metal', function () {
                    function testBP(ability) {
                        return calculate(Pokemon('Simisage', { ability: ability }), Pokemon('Simisear', { ability: 'Heavy Metal' }), Move('Grass Knot')).rawDesc.moveBP;
                    }
                    it('should double the weight of a Pokemon', function () { return expect(testBP('Gluttony')).toBe(80); });
                    it('should be negated by Mold Breaker', function () { return expect(testBP('Mold Breaker')).toBe(60); });
                });
                describe('Light Metal', function () {
                    function testBP(ability) {
                        return calculate(Pokemon('Simisage', { ability: ability }), Pokemon('Registeel', { ability: 'Light Metal' }), Move('Grass Knot')).rawDesc.moveBP;
                    }
                    it('should halve the weight of a Pokemon', function () { return expect(testBP('Gluttony')).toBe(100); });
                    it('should be negated by Mold Breaker', function () { return expect(testBP('Mold Breaker')).toBe(120); });
                });
                describe('Float Stone', function () {
                    function testBP(ability) {
                        return calculate(Pokemon('Simisage', { ability: 'Gluttony' }), Pokemon('Registeel', { ability: ability, item: 'Float Stone' }), Move('Grass Knot')).rawDesc.moveBP;
                    }
                    it('should halve the weight of a Pokemon', function () { return expect(testBP()).toBe(100); });
                    it('should stack with Light Metal', function () { return expect(testBP('Light Metal')).toBe(80); });
                });
            });
        });
        (0, helper_1.inGen)(8, function (_a) {
            var gen = _a.gen, Pokemon = _a.Pokemon;
            test("Pokemon should double their HP stat when dynamaxing (gen ".concat(gen, ")"), function () {
                var munchlax = Pokemon('Munchlax', { isDynamaxed: true });
                expect(munchlax.curHP()).toBe(822);
            });
        });
        (0, helper_1.inGens)(7, 9, function (_a) {
            var gen = _a.gen, calculate = _a.calculate, Pokemon = _a.Pokemon, Move = _a.Move, Field = _a.Field;
            test("Psychic Terrain (gen ".concat(gen, ")"), function () {
                var field = Field({ terrain: 'Psychic' });
                var Mewtwo = Pokemon('Mewtwo', {
                    nature: 'Timid',
                    evs: { spa: 252 },
                    boosts: { spa: 2 }
                });
                var Milotic = Pokemon('Milotic', {
                    item: 'Flame Orb',
                    nature: 'Bold',
                    ability: 'Marvel Scale',
                    evs: { hp: 248, def: 184 },
                    status: 'brn',
                    boosts: { spd: 1 }
                });
                var Psystrike = Move('Psystrike');
                var sPunch = Move('Sucker Punch');
                var result = calculate(Mewtwo, Milotic, Psystrike, field);
                if (gen < 8) {
                    expect(result.range()).toEqual([331, 391]);
                    expect(result.desc()).toBe('+2 252 SpA Mewtwo Psystrike vs. 248 HP / 184+ Def Marvel Scale Milotic in Psychic Terrain: 331-391 (84.2 - 99.4%) -- 37.5% chance to OHKO after burn damage');
                }
                else {
                    expect(result.range()).toEqual([288, 339]);
                    expect(result.desc()).toBe('+2 252 SpA Mewtwo Psystrike vs. 248 HP / 184+ Def Marvel Scale Milotic in Psychic Terrain: 288-339 (73.2 - 86.2%) -- guaranteed 2HKO after burn damage');
                }
                result = calculate(Mewtwo, Milotic, sPunch, field);
                expect(result.range()).toEqual([0, 0]);
            });
        });
        (0, helper_1.inGens)(6, 9, function (_a) {
            var gen = _a.gen, calculate = _a.calculate, Pokemon = _a.Pokemon, Move = _a.Move;
            test("Parental Bond (gen ".concat(gen, ")"), function () {
                var result = calculate(Pokemon('Kangaskhan-Mega', { evs: { atk: 152 } }), Pokemon('Amoonguss', { nature: 'Bold', evs: { hp: 252, def: 152 } }), Move('Frustration'));
                if (gen === 6) {
                    expect(result.damage).toEqual([
                        [153, 154, 156, 157, 159, 162, 163, 165, 166, 168, 171, 172, 174, 175, 177, 180],
                        [76, 76, 78, 78, 79, 81, 81, 82, 82, 84, 85, 85, 87, 87, 88, 90],
                    ]);
                    expect(result.desc()).toBe('152 Atk Parental Bond Kangaskhan-Mega Frustration vs. 252 HP / 152+ Def Amoonguss: 229-270 (53 - 62.5%) -- approx. 2HKO');
                }
                else {
                    expect(result.damage).toEqual([
                        [153, 154, 156, 157, 159, 162, 163, 165, 166, 168, 171, 172, 174, 175, 177, 180],
                        [37, 37, 39, 39, 39, 40, 40, 40, 40, 42, 42, 42, 43, 43, 43, 45],
                    ]);
                    expect(result.desc()).toBe('152 Atk Parental Bond Kangaskhan-Mega Frustration vs. 252 HP / 152+ Def Amoonguss: 190-225 (43.9 - 52%) -- approx. 6.6% chance to 2HKO');
                }
                result = calculate(Pokemon('Kangaskhan-Mega', { level: 88 }), Pokemon('Amoonguss'), Move('Seismic Toss'));
                expect(result.damage).toEqual([88, 88]);
                expect(result.desc()).toBe('Lvl 88 Parental Bond Kangaskhan-Mega Seismic Toss vs. 0 HP Amoonguss: 176-176 (47.6 - 47.6%) -- guaranteed 3HKO');
                result = calculate(Pokemon('Kangaskhan-Mega', { evs: { atk: 252 } }), Pokemon('Aggron', { level: 72 }), Move('Power-Up Punch'));
                if (gen === 6) {
                    expect(result.desc()).toBe('252 Atk Parental Bond Kangaskhan-Mega Power-Up Punch vs. Lvl 72 0 HP / 0 Def Aggron: 248-296 (120.9 - 144.3%) -- guaranteed OHKO');
                }
                else {
                    expect(result.desc()).toBe('252 Atk Parental Bond Kangaskhan-Mega Power-Up Punch vs. Lvl 72 0 HP / 0 Def Aggron: 196-236 (95.6 - 115.1%) -- 78.9% chance to OHKO');
                }
                if (gen === 6)
                    return;
                result = calculate(Pokemon('Kangaskhan-Mega', { evs: { atk: 252 } }), Pokemon('Lunala'), Move('Crunch'));
                expect(result.damage).toEqual([
                    [188, 190, 192, 194, 196, 198, 202, 204, 206, 208, 210, 212, 214, 216, 218, 222],
                    [92, 96, 96, 96, 96, 100, 100, 100, 104, 104, 104, 104, 108, 108, 108, 112],
                ]);
                expect(result.desc()).toBe('252 Atk Parental Bond Kangaskhan-Mega Crunch vs. 0 HP / 0 Def Shadow Shield Lunala: 280-334 (67.4 - 80.4%) -- approx. 2HKO');
            });
        });
        (0, helper_1.inGens)(5, 9, function (_a) {
            var gen = _a.gen, calculate = _a.calculate, Pokemon = _a.Pokemon, Move = _a.Move;
            test("Multi-hit interaction with Multiscale (gen ".concat(gen, ")"), function () {
                var result = calculate(Pokemon('Mamoswine'), Pokemon('Dragonite', {
                    ability: 'Multiscale'
                }), Move('Icicle Spear'));
                expect(result.range()).toEqual([360, 430]);
                expect(result.desc()).toBe('0 Atk Mamoswine Icicle Spear (3 hits) vs. 0 HP / 0 Def Multiscale Dragonite: 360-430 (111.4 - 133.1%) -- guaranteed OHKO');
            });
        });
        (0, helper_1.inGens)(5, 9, function (_a) {
            var gen = _a.gen, calculate = _a.calculate, Pokemon = _a.Pokemon, Move = _a.Move;
            test("Multi-hit interaction with Weak Armor (gen ".concat(gen, ")"), function () {
                var result = calculate(Pokemon('Mamoswine'), Pokemon('Skarmory', {
                    ability: 'Weak Armor'
                }), Move('Icicle Spear'));
                expect(result.range()).toEqual([115, 138]);
                expect(result.desc()).toBe('0 Atk Mamoswine Icicle Spear (3 hits) vs. 0 HP / 0 Def Weak Armor Skarmory: 115-138 (42.4 - 50.9%) -- approx. 2.7% chance to 2HKO');
                result = calculate(Pokemon('Mamoswine'), Pokemon('Skarmory', {
                    ability: 'Weak Armor',
                    item: 'White Herb'
                }), Move('Icicle Spear'));
                expect(result.range()).toEqual([89, 108]);
                expect(result.desc()).toBe('0 Atk Mamoswine Icicle Spear (3 hits) vs. 0 HP / 0 Def White Herb Weak Armor Skarmory: 89-108 (32.8 - 39.8%) -- approx. 99.9% chance to 3HKO');
                result = calculate(Pokemon('Mamoswine'), Pokemon('Skarmory', {
                    ability: 'Weak Armor',
                    item: 'White Herb',
                    boosts: { def: 2 }
                }), Move('Icicle Spear'));
                expect(result.range()).toEqual([56, 69]);
                expect(result.desc()).toBe('0 Atk Mamoswine Icicle Spear (3 hits) vs. +2 0 HP / 0 Def Weak Armor Skarmory: 56-69 (20.6 - 25.4%) -- approx. 0.1% chance to 4HKO');
                result = calculate(Pokemon('Mamoswine', {
                    ability: 'Unaware'
                }), Pokemon('Skarmory', {
                    ability: 'Weak Armor',
                    item: 'White Herb',
                    boosts: { def: 2 }
                }), Move('Icicle Spear'));
                expect(result.range()).toEqual([75, 93]);
                expect(result.desc()).toBe('0 Atk Unaware Mamoswine Icicle Spear (3 hits) vs. 0 HP / 0 Def Skarmory: 75-93 (27.6 - 34.3%) -- approx. 1.5% chance to 3HKO');
            });
        });
        (0, helper_1.inGens)(6, 9, function (_a) {
            var gen = _a.gen, calculate = _a.calculate, Pokemon = _a.Pokemon, Move = _a.Move;
            test("Multi-hit interaction with Mummy (gen ".concat(gen, ")"), function () {
                var result = calculate(Pokemon('Pinsir-Mega'), Pokemon('Cofagrigus', {
                    ability: 'Mummy'
                }), Move('Double Hit'));
                if (gen === 6) {
                    expect(result.range()).toEqual([96, 113]);
                    expect(result.desc()).toBe('0 Atk Aerilate Pinsir-Mega Double Hit (2 hits) vs. 0 HP / 0 Def Mummy Cofagrigus: 96-113 (37.3 - 43.9%) -- approx. 3HKO');
                }
                else {
                    expect(result.range()).toEqual([91, 107]);
                    expect(result.desc()).toBe('0 Atk Aerilate Pinsir-Mega Double Hit (2 hits) vs. 0 HP / 0 Def Mummy Cofagrigus: 91-107 (35.4 - 41.6%) -- approx. 3HKO');
                }
            });
        });
        (0, helper_1.inGens)(7, 9, function (_a) {
            var gen = _a.gen, calculate = _a.calculate, Pokemon = _a.Pokemon, Move = _a.Move;
            test("Multi-hit interaction with Items (gen ".concat(gen, ")"), function () {
                var result = calculate(Pokemon('Greninja'), Pokemon('Gliscor', {
                    item: 'Luminous Moss'
                }), Move('Water Shuriken'));
                expect(result.range()).toEqual([104, 126]);
                expect(result.desc()).toBe('0 SpA Greninja Water Shuriken (15 BP) (3 hits) vs. 0 HP / 0 SpD Luminous Moss Gliscor: 104-126 (35.7 - 43.2%) -- approx. 3HKO');
                result = calculate(Pokemon('Greninja'), Pokemon('Gliscor', {
                    ability: 'Simple',
                    item: 'Luminous Moss'
                }), Move('Water Shuriken'));
                expect(result.range()).toEqual([92, 114]);
                expect(result.desc()).toBe('0 SpA Greninja Water Shuriken (15 BP) (3 hits) vs. 0 HP / 0 SpD Luminous Moss Simple Gliscor: 92-114 (31.6 - 39.1%) -- approx. 79.4% chance to 3HKO');
                result = calculate(Pokemon('Greninja'), Pokemon('Gliscor', {
                    ability: 'Contrary',
                    item: 'Luminous Moss'
                }), Move('Water Shuriken'));
                expect(result.range()).toEqual([176, 210]);
                expect(result.desc()).toBe('0 SpA Greninja Water Shuriken (15 BP) (3 hits) vs. 0 HP / 0 SpD Luminous Moss Contrary Gliscor: 176-210 (60.4 - 72.1%) -- approx. 2HKO');
            });
        });
        (0, helper_1.inGens)(3, 9, function (_a) {
            var gen = _a.gen, calculate = _a.calculate, Pokemon = _a.Pokemon, Move = _a.Move;
            test("KOed Pokemon don't receive HP recovery after 5+ turns (gen ".concat(gen, ")"), function () {
                var chansey = Pokemon('Chansey', {
                    level: 25
                });
                var mew = Pokemon('Mew', {
                    level: 30,
                    item: 'Leftovers',
                    ivs: { hp: 0 }
                });
                var seismicToss = Move('Seismic Toss');
                var result = calculate(chansey, mew, seismicToss);
                expect(result.damage).toBe(25);
                expect(result.desc()).toBe('Lvl 25 Chansey Seismic Toss vs. Lvl 30 0 HP 0 IVs Mew: 25-25 (25 - 25%) -- guaranteed 5HKO after Leftovers recovery');
            });
        });
        (0, helper_1.inGens)(3, 9, function (_a) {
            var gen = _a.gen, calculate = _a.calculate, Pokemon = _a.Pokemon, Move = _a.Move;
            test("KOed Pokemon don't receive HP recovery after 1-4 turns (gen ".concat(gen, ")"), function () {
                var chansey = Pokemon('Chansey', {
                    level: 55
                });
                var mew = Pokemon('Mew', {
                    level: 30,
                    item: 'Leftovers',
                    ivs: { hp: 0 }
                });
                var seismicToss = Move('Seismic Toss');
                var result = calculate(chansey, mew, seismicToss);
                expect(result.damage).toBe(55);
                expect(result.desc()).toBe('Lvl 55 Chansey Seismic Toss vs. Lvl 30 0 HP 0 IVs Mew: 55-55 (55 - 55%) -- guaranteed 2HKO after Leftovers recovery');
            });
        });
        (0, helper_1.inGens)(3, 9, function (_a) {
            var gen = _a.gen, calculate = _a.calculate, Pokemon = _a.Pokemon, Move = _a.Move;
            test("End of turn damage is calculated correctly after 5+ turns (gen ".concat(gen, ")"), function () {
                var chansey = Pokemon('Chansey', {
                    level: 1
                });
                var mew = Pokemon('Mew', {
                    level: 30,
                    status: 'tox',
                    toxicCounter: 1,
                    ivs: { hp: 0 }
                });
                var seismicToss = Move('Seismic Toss');
                var result = calculate(chansey, mew, seismicToss);
                expect(result.damage).toBe(1);
                expect(result.desc()).toBe('Lvl 1 Chansey Seismic Toss vs. Lvl 30 0 HP 0 IVs Mew: 1-1 (1 - 1%) -- guaranteed 6HKO after toxic damage');
            });
        });
        (0, helper_1.inGens)(3, 9, function (_a) {
            var gen = _a.gen, calculate = _a.calculate, Pokemon = _a.Pokemon, Move = _a.Move, Field = _a.Field;
            test("End of turn damage is calculated correctly after 1-4 turns (gen ".concat(gen, ")"), function () {
                var field = Field({
                    weather: 'Sand',
                    defenderSide: {
                        isSeeded: true
                    }
                });
                var chansey = Pokemon('Chansey', {
                    level: 1
                });
                var mew = Pokemon('Mew', {
                    level: 30,
                    status: 'tox',
                    toxicCounter: 1,
                    ivs: { hp: 0 }
                });
                var seismicToss = Move('Seismic Toss');
                var result = calculate(chansey, mew, seismicToss, field);
                expect(result.damage).toBe(1);
                expect(result.desc()).toBe('Lvl 1 Chansey Seismic Toss vs. Lvl 30 0 HP 0 IVs Mew: 1-1 (1 - 1%) -- guaranteed 4HKO after sandstorm damage, Leech Seed damage, and toxic damage');
            });
        });
        (0, helper_1.inGens)(3, 9, function (_a) {
            var gen = _a.gen, calculate = _a.calculate, Pokemon = _a.Pokemon, Move = _a.Move, Field = _a.Field;
            test("End of turn damage is calculated correctly on the first turn (gen ".concat(gen, ")"), function () {
                var field = Field({
                    weather: 'Sand'
                });
                var chansey = Pokemon('Chansey', {
                    level: 90
                });
                var mew = Pokemon('Mew', {
                    level: 30,
                    status: 'brn',
                    ivs: { hp: 0 }
                });
                var seismicToss = Move('Seismic Toss');
                var result = calculate(chansey, mew, seismicToss, field);
                expect(result.damage).toBe(90);
                expect(result.desc()).toBe('Lvl 90 Chansey Seismic Toss vs. Lvl 30 0 HP 0 IVs Mew: 90-90 (90 - 90%) -- guaranteed OHKO after sandstorm damage and burn damage');
            });
        });
        (0, helper_1.inGens)(4, 9, function (_a) {
            var gen = _a.gen, calculate = _a.calculate, Pokemon = _a.Pokemon, Move = _a.Move, Field = _a.Field;
            test("Mold Breaker does not disable abilities that don't affect direct damage (gen ".concat(gen, ")"), function () {
                var attacker = Pokemon('Rampardos', {
                    ability: 'Mold Breaker'
                });
                var defender = Pokemon('Blastoise', {
                    ability: 'Rain Dish'
                });
                var field = Field({
                    weather: 'Rain'
                });
                var move = Move('Stone Edge');
                var result = calculate(attacker, defender, move, field);
                expect(result.defender.ability).toBe('Rain Dish');
                expect(result.desc()).toBe('0 Atk Rampardos Stone Edge vs. 0 HP / 0 Def Blastoise: 168-198 (56.1 - 66.2%) -- guaranteed 2HKO after Rain Dish recovery');
            });
        });
        (0, helper_1.inGens)(8, 9, function (_a) {
            var gen = _a.gen, calculate = _a.calculate, Pokemon = _a.Pokemon, Move = _a.Move, Field = _a.Field;
            test('Steely Spirit should boost Steel-type moves as a field effect.', function () {
                var pokemon = Pokemon('Perrserker', {
                    ability: 'Battle Armor'
                });
                var move = Move('Iron Head');
                var result = calculate(pokemon, pokemon, move);
                expect(result.desc()).toBe('0 Atk Perrserker Iron Head vs. 0 HP / 0 Def Perrserker: 46-55 (16.3 - 19.5%) -- possible 6HKO');
                var field = Field({ attackerSide: { isSteelySpirit: true } });
                result = calculate(pokemon, pokemon, move, field);
                expect(result.desc()).toBe('0 Atk Perrserker with an ally\'s Steely Spirit Iron Head vs. 0 HP / 0 Def Perrserker: 70-83 (24.9 - 29.5%) -- 99.9% chance to 4HKO');
                pokemon.ability = 'Steely Spirit';
                result = calculate(pokemon, pokemon, move, field);
                expect(result.desc()).toBe('0 Atk Steely Spirit Perrserker with an ally\'s Steely Spirit Iron Head vs. 0 HP / 0 Def Perrserker: 105-124 (37.3 - 44.1%) -- guaranteed 3HKO');
            });
        });
    });
    describe('Gen 1', function () {
        (0, helper_1.inGen)(1, function (_a) {
            var calculate = _a.calculate, Pokemon = _a.Pokemon, Move = _a.Move, Field = _a.Field;
            test('Basic: Gengar vs. Chansey', function () {
                var result = calculate(Pokemon('Gengar'), Pokemon('Chansey'), Move('Thunderbolt'));
                expect(result.range()).toEqual([79, 94]);
                expect(result.desc()).toBe('Gengar Thunderbolt vs. Chansey: 79-94 (11.2 - 13.3%) -- possible 8HKO');
            });
            test('Light Screen', function () {
                var field = Field({ defenderSide: { isLightScreen: true } });
                var result = calculate(Pokemon('Gengar'), Pokemon('Vulpix'), Move('Surf'), field);
                expect(result.desc()).toBe('Gengar Surf vs. Vulpix through Light Screen: 108-128 (38.7 - 45.8%) -- guaranteed 3HKO');
            });
        });
    });
    describe('Gen 2', function () {
        (0, helper_1.inGen)(2, function (_a) {
            var calculate = _a.calculate, Pokemon = _a.Pokemon, Move = _a.Move, Field = _a.Field;
            test('Basic: Gengar vs. Chansey', function () {
                var result = calculate(Pokemon('Gengar'), Pokemon('Chansey', { item: 'Leftovers' }), Move('Dynamic Punch'));
                expect(result.range()).toEqual([304, 358]);
                expect(result.desc()).toBe('Gengar Dynamic Punch vs. Chansey: 304-358 (43.2 - 50.9%) -- guaranteed 3HKO after Leftovers recovery');
            });
            test('Struggle', function () {
                var attacker = Pokemon('Skarmory', { boosts: { atk: 6, def: 6 } });
                var defender = Pokemon('Skarmory', { boosts: { atk: 6, def: 6 } });
                var move = Move('Struggle');
                var result = calculate(attacker, defender, move);
                expect(result.range()).toEqual([37, 44]);
                expect(result.desc()).toBe('+6 Skarmory Struggle vs. +6 Skarmory: 37-44 (11.1 - 13.2%) -- possible 8HKO');
            });
            test('Present', function () {
                var attacker = Pokemon('Togepi', { level: 5, boosts: { atk: -6 }, status: 'brn' });
                var defender = Pokemon('Umbreon', { boosts: { def: 6 } });
                var move = Move('Present');
                var field = Field({ defenderSide: { isReflect: true } });
                var result = calculate(attacker, defender, move, field);
                expect(result.range()).toEqual([125, 147]);
                expect(result.desc()).toBe('-6 Lvl 5 burned Togepi Present vs. +6 Umbreon through Reflect: 125-147 (31.8 - 37.4%) -- 89.1% chance to 3HKO');
            });
            test('DVs', function () {
                var aerodactyl = Pokemon('Aerodactyl');
                var zapdos = Pokemon('Zapdos', { ivs: { atk: 29, def: 27 }, item: 'Leftovers' });
                expect(zapdos.ivs.hp).toBe(14);
                var move = Move('Ancient Power');
                var result = calculate(aerodactyl, zapdos, move);
                expect(result.range()).toEqual([153, 180]);
                expect(result.desc()).toBe('Aerodactyl Ancient Power vs. Zapdos: 153-180 (41.6 - 49%) -- guaranteed 3HKO after Leftovers recovery');
            });
        });
    });
    describe('Gen 3', function () {
        (0, helper_1.inGen)(3, function (_a) {
            var calculate = _a.calculate, Pokemon = _a.Pokemon, Move = _a.Move, Field = _a.Field;
            test('Basic: Gengar vs. Chansey', function () {
                var result = calculate(Pokemon('Gengar', {
                    nature: 'Mild',
                    evs: { atk: 100 }
                }), Pokemon('Chansey', {
                    item: 'Leftovers',
                    nature: 'Bold',
                    evs: { hp: 252, def: 252 }
                }), Move('Focus Punch'));
                expect(result.range()).toEqual([346, 408]);
                expect(result.desc()).toBe('100 Atk Gengar Focus Punch vs. 252 HP / 252+ Def Chansey: 346-408 (49.1 - 57.9%) -- 59% chance to 2HKO after Leftovers recovery');
            });
            test('Water Absorb', function () {
                var cacturne = Pokemon('Cacturne', {
                    ability: 'Sand Veil'
                });
                var blastoise = Pokemon('Blastoise', {
                    evs: { spa: 252 }
                });
                var surf = Move('Surf');
                var result = calculate(blastoise, cacturne, surf);
                expect(result.range()).toEqual([88, 104]);
                expect(result.desc()).toBe('252 SpA Blastoise Surf vs. 0 HP / 0 SpD Cacturne: 88-104 (31.3 - 37%) -- 76.6% chance to 3HKO');
                cacturne.ability = 'Water Absorb';
                result = calculate(blastoise, cacturne, surf);
                expect(result.damage).toBe(0);
            });
            describe('Spread Moves', function () {
                test('allAdjacent', function () {
                    var gengar = Pokemon('Gengar', { nature: 'Mild', evs: { atk: 100 } });
                    var blissey = Pokemon('Chansey', {
                        item: 'Leftovers',
                        nature: 'Bold',
                        evs: { hp: 252, def: 252 }
                    });
                    var field = Field({ gameType: 'Doubles' });
                    var result = calculate(gengar, blissey, Move('Explosion'), field);
                    expect(result.range()).toEqual([578, 681]);
                    expect(result.desc()).toBe('100 Atk Gengar Explosion vs. 252 HP / 252+ Def Chansey: 578-681 (82.1 - 96.7%) -- guaranteed 2HKO after Leftovers recovery');
                });
                test('allAdjacentFoes', function () {
                    var gengar = Pokemon('Gengar', { nature: 'Modest', evs: { spa: 252 } });
                    var blissey = Pokemon('Chansey', {
                        item: 'Leftovers',
                        nature: 'Bold',
                        evs: { hp: 252, def: 252 }
                    });
                    var field = Field({ gameType: 'Doubles' });
                    var result = calculate(gengar, blissey, Move('Blizzard'), field);
                    expect(result.range()).toEqual([69, 82]);
                    expect(result.desc()).toBe('252+ SpA Gengar Blizzard vs. 252 HP / 0 SpD Chansey: 69-82 (9.8 - 11.6%)');
                });
            });
        });
    });
    describe('Gen 4', function () {
        (0, helper_1.inGen)(4, function (_a) {
            var calculate = _a.calculate, Pokemon = _a.Pokemon, Move = _a.Move;
            test('Basic: Gengar vs. Chansey', function () {
                var result = calculate(Pokemon('Gengar', {
                    item: 'Choice Specs',
                    nature: 'Timid',
                    evs: { spa: 252 },
                    boosts: { spa: 1 }
                }), Pokemon('Chansey', {
                    item: 'Leftovers',
                    nature: 'Calm',
                    evs: { hp: 252, spd: 252 }
                }), Move('Focus Blast'));
                expect(result.range()).toEqual([408, 482]);
                expect(result.desc()).toBe('+1 252 SpA Choice Specs Gengar Focus Blast vs. 252 HP / 252+ SpD Chansey: 408-482 (57.9 - 68.4%) -- guaranteed 2HKO after Leftovers recovery');
            });
            test('Mold Breaker', function () {
                var pinsir = Pokemon('Pinsir', {
                    item: 'Choice Band',
                    nature: 'Adamant',
                    ability: 'Hyper Cutter',
                    evs: { atk: 252 }
                });
                var gengar = Pokemon('Gengar', {
                    item: 'Choice Specs',
                    nature: 'Timid',
                    evs: { spa: 252 },
                    boosts: { spa: 1 }
                });
                var earthquake = Move('Earthquake');
                var result = calculate(pinsir, gengar, earthquake);
                expect(result.damage).toBe(0);
                pinsir.ability = 'Mold Breaker';
                result = calculate(pinsir, gengar, earthquake);
                expect(result.range()).toEqual([528, 622]);
                expect(result.desc()).toBe('252+ Atk Choice Band Mold Breaker Pinsir Earthquake vs. 0 HP / 0 Def Gengar: 528-622 (202.2 - 238.3%) -- guaranteed OHKO');
                pinsir.boosts.atk = 2;
                gengar.ability = 'Unaware';
                result = calculate(pinsir, gengar, earthquake);
                expect(result.range()).toEqual([1054, 1240]);
            });
        });
    });
    describe('Gen 5', function () {
        (0, helper_1.inGen)(5, function (_a) {
            var calculate = _a.calculate, Pokemon = _a.Pokemon, Move = _a.Move;
            test('Basic: Gengar vs. Chansey', function () {
                var result = calculate(Pokemon('Gengar', {
                    item: 'Choice Specs',
                    nature: 'Timid',
                    evs: { spa: 252 },
                    boosts: { spa: 1 }
                }), Pokemon('Chansey', {
                    item: 'Eviolite',
                    nature: 'Calm',
                    evs: { hp: 252, spd: 252 }
                }), Move('Focus Blast'));
                expect(result.range()).toEqual([274, 324]);
                expect(result.fullDesc('px')).toBe('+1 252 SpA Choice Specs Gengar Focus Blast vs. 252 HP / 252+ SpD Eviolite Chansey: 274-324 (18 - 22px) -- guaranteed 3HKO');
            });
            test('Technician with Low Kick', function () {
                var ambipom = Pokemon('Ambipom', { level: 50, ability: 'Technician' });
                var blissey = Pokemon('Blissey', { level: 50, evs: { hp: 252 } });
                var result = calculate(ambipom, blissey, Move('Low Kick'));
                expect(result.range()).toEqual([272, 320]);
                expect(result.desc()).toBe('0 Atk Technician Ambipom Low Kick (60 BP) vs. 252 HP / 0 Def Blissey: 272-320 (75.1 - 88.3%) -- guaranteed 2HKO');
                var aggron = Pokemon('Aggron', { level: 50, evs: { hp: 252 } });
                result = calculate(ambipom, aggron, Move('Low Kick'));
                expect(result.range()).toEqual([112, 132]);
                expect(result.desc()).toBe('0 Atk Ambipom Low Kick (120 BP) vs. 252 HP / 0 Def Aggron: 112-132 (63.2 - 74.5%) -- guaranteed 2HKO');
            });
        });
    });
    describe('Gen 6', function () {
        (0, helper_1.inGen)(6, function (_a) {
            var calculate = _a.calculate, Pokemon = _a.Pokemon, Move = _a.Move;
            test('Basic: Gengar vs. Chansey', function () {
                var result = calculate(Pokemon('Gengar', {
                    item: 'Life Orb',
                    nature: 'Modest',
                    evs: { spa: 252 }
                }), Pokemon('Chansey', {
                    item: 'Eviolite',
                    nature: 'Bold',
                    evs: { hp: 252, def: 252 }
                }), Move('Sludge Bomb'));
                expect(result.range()).toEqual([134, 160]);
                expect(result.desc()).toBe('252+ SpA Life Orb Gengar Sludge Bomb vs. 252 HP / 0 SpD Eviolite Chansey: 134-160 (19 - 22.7%) -- possible 5HKO');
            });
        });
    });
    describe('Gen 7', function () {
        (0, helper_1.inGen)(7, function (_a) {
            var calculate = _a.calculate, Pokemon = _a.Pokemon, Move = _a.Move, Field = _a.Field;
            var abomasnow = Pokemon('Abomasnow', {
                item: 'Icy Rock',
                ability: 'Snow Warning',
                nature: 'Hasty',
                evs: { atk: 252, spd: 4, spe: 252 }
            });
            var hoopa = Pokemon('Hoopa-Unbound', {
                item: 'Choice Band',
                ability: 'Magician',
                nature: 'Jolly',
                evs: { hp: 32, atk: 224, spe: 252 }
            });
            test('Basic: Gengar vs. Chansey', function () {
                var result = calculate(Pokemon('Gengar', {
                    item: 'Life Orb',
                    nature: 'Modest',
                    evs: { spa: 252 },
                    boosts: { spa: 3 }
                }), Pokemon('Chansey', {
                    item: 'Eviolite',
                    nature: 'Bold',
                    evs: { hp: 100, spd: 100 },
                    boosts: { spd: 1 }
                }), Move('Sludge Bomb'));
                expect(result.range()).toEqual([204, 242]);
                expect(result.desc()).toBe('+3 252+ SpA Life Orb Gengar Sludge Bomb vs. +1 100 HP / 100 SpD Eviolite Chansey: 204-242 (30.6 - 36.3%) -- 52.9% chance to 3HKO');
            });
            test('Z-Move critical hits', function () {
                var zMove = Move('Wood Hammer', { useZ: true, isCrit: true });
                var result = calculate(abomasnow, hoopa, zMove);
                expect(result.range()).toEqual([555, 654]);
                expect(result.desc()).toBe('252 Atk Abomasnow Bloom Doom (190 BP) vs. 32 HP / 0 Def Hoopa-Unbound on a critical hit: 555-654 (179.6 - 211.6%) -- guaranteed OHKO');
            });
            test('Recoil & Recovery', function () {
                var result = calculate(abomasnow, hoopa, Move('Wood Hammer'));
                expect(result.range()).toEqual([234, 276]);
                expect(result.desc()).toBe('252 Atk Abomasnow Wood Hammer vs. 32 HP / 0 Def Hoopa-Unbound: 234-276 (75.7 - 89.3%) -- guaranteed 2HKO');
                var recoil = result.recoil();
                expect(recoil.recoil).toEqual([24, 28.3]);
                expect(recoil.text).toBe('24 - 28.3% recoil damage');
                result = calculate(hoopa, abomasnow, Move('Drain Punch'));
                expect(result.range()).toEqual([398, 470]);
                expect(result.desc()).toBe('224 Atk Choice Band Hoopa-Unbound Drain Punch vs. 0 HP / 0- Def Abomasnow: 398-470 (123.9 - 146.4%) -- guaranteed OHKO');
                var recovery = result.recovery();
                expect(recovery.recovery).toEqual([161, 161]);
                expect(recovery.text).toBe('52.1 - 52.1% recovered');
            });
            test('Big Root', function () {
                var bigRoot = Pokemon('Blissey', { item: 'Big Root' });
                var result = calculate(bigRoot, abomasnow, Move('Drain Punch'));
                expect(result.range()).toEqual([38, 46]);
                expect(result.recovery().recovery).toEqual([24, 29]);
            });
            test('Loaded Field', function () {
                var field = Field({
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
                var result = calculate(abomasnow, hoopa, Move('Blizzard'), field);
                expect(result.range()).toEqual([50, 59]);
                expect(result.desc()).toBe('0 SpA Abomasnow Helping Hand Blizzard vs. 32 HP / 0 SpD Hoopa-Unbound through Light Screen with an ally\'s Friend Guard: 50-59 (16.1 - 19%)' +
                    ' -- guaranteed 3HKO after Stealth Rock, 1 layer of Spikes, hail damage, Leech Seed damage, and Grassy Terrain recovery');
            });
            test('Wring Out', function () {
                var smeargle = Pokemon('Smeargle', { level: 50, ability: 'Technician' });
                var blissey = Pokemon('Blissey', { level: 50, evs: { hp: 252 }, curHP: 184 });
                var result = calculate(smeargle, blissey, Move('Wring Out'));
                expect(result.range()).toEqual([15, 18]);
                expect(result.desc()).toBe('0 SpA Technician Smeargle Wring Out (60 BP) vs. 252 HP / 0 SpD Blissey: 15-18 (4.1 - 4.9%)');
            });
            test('Mold Breaker', function () {
                var pinsir = Pokemon('Pinsir', {
                    item: 'Choice Band',
                    nature: 'Adamant',
                    ability: 'Hyper Cutter',
                    evs: { atk: 252 }
                });
                var gengar = Pokemon('Gengar', {
                    item: 'Choice Specs',
                    nature: 'Timid',
                    ability: 'Levitate',
                    evs: { spa: 252 },
                    boosts: { spa: 1 }
                });
                var earthquake = Move('Earthquake');
                var result = calculate(pinsir, gengar, earthquake);
                expect(result.damage).toBe(0);
                pinsir.ability = 'Mold Breaker';
                result = calculate(pinsir, gengar, earthquake);
                expect(result.range()).toEqual([528, 622]);
                expect(result.desc()).toBe('252+ Atk Choice Band Mold Breaker Pinsir Earthquake vs. 0 HP / 0 Def Gengar: 528-622 (202.2 - 238.3%) -- guaranteed OHKO');
                pinsir.boosts.atk = 2;
                gengar.ability = 'Unaware';
                result = calculate(pinsir, gengar, earthquake);
                expect(result.range()).toEqual([1054, 1240]);
            });
            test('16-bit Overflow', function () {
                var result = calculate(Pokemon('Mewtwo-Mega-Y', { evs: { spa: 196 } }), Pokemon('Wynaut', { level: 1, boosts: { spd: -6 } }), Move('Fire Blast'), Field({ attackerSide: { isHelpingHand: true } }));
                expect(result.damage).toEqual([
                    55725, 56380, 57036, 57691,
                    58347, 59003, 59658, 60314,
                    60969, 61625, 62281, 62936,
                    63592, 64247, 64903, 23,
                ]);
            });
            test('32-bit Overflow', function () {
                var kyogre = Pokemon('Kyogre', {
                    ability: 'Water Bubble',
                    item: 'Choice Specs',
                    curHP: 340,
                    ivs: { spa: 6 },
                    boosts: { spa: 6 }
                });
                var wynaut = Pokemon('Wynaut', { level: 1, boosts: { spd: -6 } });
                var waterSpout = Move('Water Spout');
                var field = Field({ weather: 'Rain', attackerSide: { isHelpingHand: true } });
                expect(calculate(kyogre, wynaut, waterSpout, field).range()).toEqual([55, 66]);
                kyogre = Pokemon('Kyogre', __assign(__assign({}, kyogre), { overrides: { types: ['Normal'] } }));
                expect(calculate(kyogre, wynaut, waterSpout, field).range()).toEqual([37, 44]);
            });
        });
    });
    describe('Gen 8', function () {
        (0, helper_1.inGen)(8, function (_a) {
            var calculate = _a.calculate, Pokemon = _a.Pokemon, Move = _a.Move, Field = _a.Field;
            test('Basic: Gengar vs. Chansey', function () {
                var result = calculate(Pokemon('Gengar', {
                    item: 'Life Orb',
                    nature: 'Modest',
                    evs: { spa: 252 },
                    boosts: { spa: 3 }
                }), Pokemon('Chansey', {
                    item: 'Eviolite',
                    nature: 'Bold',
                    evs: { hp: 100, spd: 100 },
                    boosts: { spd: 1 }
                }), Move('Sludge Bomb'));
                expect(result.range()).toEqual([204, 242]);
                expect(result.desc()).toBe('+3 252+ SpA Life Orb Gengar Sludge Bomb vs. +1 100 HP / 100 SpD Eviolite Chansey: 204-242 (30.6 - 36.3%) -- 52.9% chance to 3HKO');
            });
            test('Knock Off vs. Silvally', function () {
                var sawk = Pokemon('Sawk', { ability: 'Mold Breaker', evs: { atk: 252 } });
                var silvally = Pokemon('Silvally-Dark', { item: 'Dark Memory' });
                var knockoff = Move('Knock Off');
                var result = calculate(sawk, silvally, knockoff);
                expect(result.desc()).toBe('252 Atk Sawk Knock Off vs. 0 HP / 0 Def Silvally-Dark: 36-43 (10.8 - 12.9%) -- possible 8HKO');
            });
            test('-ate Abilities', function () {
                var sylveon = Pokemon('Sylveon', { ability: 'Pixilate', evs: { spa: 252 } });
                var silvally = Pokemon('Silvally');
                var hypervoice = Move('Hyper Voice');
                var result = calculate(sylveon, silvally, hypervoice);
                expect(result.desc()).toBe('252 SpA Pixilate Sylveon Hyper Voice vs. 0 HP / 0 SpD Silvally: 165-195 (49.8 - 58.9%) -- 99.6% chance to 2HKO');
            });
            test('% chance to OHKO', function () {
                var abomasnow = Pokemon('Abomasnow', {
                    level: 55,
                    item: 'Choice Specs',
                    evs: { spa: 252 }
                });
                var deerling = Pokemon('Deerling', { evs: { hp: 36 } });
                var blizzard = Move('Blizzard');
                var hail = Field({ weather: 'Hail' });
                var result = calculate(abomasnow, deerling, blizzard, hail);
                expect(result.desc()).toBe('Lvl 55 252 SpA Choice Specs Abomasnow Blizzard vs. 36 HP / 0 SpD Deerling: 236-278 (87.4 - 102.9%) -- 25% chance to OHKO (56.3% chance to OHKO after hail damage)');
            });
            test('% chance to OHKO with Leftovers', function () {
                var kyurem = Pokemon('Kyurem', {
                    level: 100,
                    item: 'Choice Specs',
                    evs: { spa: 252 }
                });
                var jirachi = Pokemon('Jirachi', { item: 'Leftovers' });
                var earthpower = Move('Earth Power');
                var result = calculate(kyurem, jirachi, earthpower);
                expect(result.desc()).toBe('252 SpA Choice Specs Kyurem Earth Power vs. 0 HP / 0 SpD Jirachi: 294-348 (86.2 - 102%) -- 12.5% chance to OHKO');
            });
            test('Technician with Low Kick', function () {
                var ambipom = Pokemon('Ambipom', { level: 50, ability: 'Technician' });
                var blissey = Pokemon('Blissey', { level: 50, evs: { hp: 252 } });
                var result = calculate(ambipom, blissey, Move('Low Kick'));
                expect(result.range()).toEqual([272, 320]);
                expect(result.desc()).toBe('0 Atk Technician Ambipom Low Kick (60 BP) vs. 252 HP / 0 Def Blissey: 272-320 (75.1 - 88.3%) -- guaranteed 2HKO');
                var aggron = Pokemon('Aggron', { level: 50, evs: { hp: 252 } });
                result = calculate(ambipom, aggron, Move('Low Kick'));
                expect(result.range()).toEqual([112, 132]);
                expect(result.desc()).toBe('0 Atk Ambipom Low Kick (120 BP) vs. 252 HP / 0 Def Aggron: 112-132 (63.2 - 74.5%) -- guaranteed 2HKO');
            });
        });
    });
    describe('Gen 9', function () {
        (0, helper_1.inGen)(9, function (_a) {
            var calculate = _a.calculate, Pokemon = _a.Pokemon, Move = _a.Move, Field = _a.Field;
            test('Supreme Overlord', function () {
                var kingambit = Pokemon('Kingambit', { level: 100, ability: 'Supreme Overlord', alliesFainted: 0 });
                var aggron = Pokemon('Aggron', { level: 100 });
                var result = calculate(kingambit, aggron, Move('Iron Head'));
                expect(result.range()).toEqual([67, 79]);
                expect(result.desc()).toBe('0 Atk Kingambit Iron Head vs. 0 HP / 0 Def Aggron: 67-79 (23.8 - 28.1%) -- 91.2% chance to 4HKO');
                kingambit.alliesFainted = 5;
                result = calculate(kingambit, aggron, Move('Iron Head'));
                expect(result.range()).toEqual([100, 118]);
                expect(result.desc()).toBe('0 Atk Supreme Overlord 5 allies fainted Kingambit Iron Head vs. 0 HP / 0 Def Aggron: 100-118 (35.5 - 41.9%) -- guaranteed 3HKO');
                kingambit.alliesFainted = 10;
                result = calculate(kingambit, aggron, Move('Iron Head'));
                expect(result.range()).toEqual([100, 118]);
                expect(result.desc()).toBe('0 Atk Supreme Overlord 5 allies fainted Kingambit Iron Head vs. 0 HP / 0 Def Aggron: 100-118 (35.5 - 41.9%) -- guaranteed 3HKO');
            });
            test('Electro Drift/Collision Course boost on Super Effective hits', function () {
                var attacker = Pokemon('Arceus');
                var defender = Pokemon('Mew');
                var calc = function (move) {
                    if (move === void 0) { move = Move('Electro Drift'); }
                    return calculate(attacker, defender, move).range();
                };
                var neutral = calc();
                var fusionBolt = Move('Fusion Bolt');
                expect(calc(fusionBolt)).toEqual(neutral);
                defender = Pokemon('Manaphy');
                var se = calc();
                expect(calc(fusionBolt)).not.toEqual(se);
                defender.teraType = 'Normal';
                expect(calc()).toEqual(neutral);
                var cc = Move('Collision Course');
                defender = Pokemon('Jirachi');
                expect(calc(cc)).toEqual(neutral);
                defender.teraType = 'Normal';
                expect(calc(cc)).toEqual(se);
            });
            function testQP(ability, field) {
                test("".concat(ability, " should take into account boosted stats by default"), function () {
                    var attacker = Pokemon('Iron Leaves', { ability: ability, boostedStat: 'auto', boosts: { spa: 6 } });
                    var defender = Pokemon('Iron Treads', { ability: ability, boostedStat: 'auto', boosts: { spd: 6 } });
                    var result = calculate(attacker, defender, Move('Leaf Storm'), Field(field)).rawDesc;
                    expect(result.attackerAbility).toBe(ability);
                    expect(result.defenderAbility).toBe(ability);
                    result = calculate(attacker, defender, Move('Psyblade'), Field(field)).rawDesc;
                    expect(result.attackerAbility).toBeUndefined();
                    expect(result.defenderAbility).toBeUndefined();
                });
            }
            function testQPOverride(ability, field) {
                test("".concat(ability, " should be able to be overridden with boostedStat"), function () {
                    var attacker = Pokemon('Flutter Mane', { ability: ability, boostedStat: 'atk', boosts: { spa: 6 } });
                    var defender = Pokemon('Walking Wake', { ability: ability, boostedStat: 'def', boosts: { spd: 6 } });
                    var result = calculate(attacker, defender, Move('Leaf Storm'), Field(field)).rawDesc;
                    expect(result.attackerAbility).toBeUndefined();
                    expect(result.defenderAbility).toBeUndefined();
                    result = calculate(attacker, defender, Move('Psyblade'), Field(field)).rawDesc;
                    expect(result.attackerAbility).toBe(ability);
                    expect(result.defenderAbility).toBe(ability);
                });
            }
            testQP('Quark Drive', { terrain: 'Electric' });
            testQP('Protosynthesis', { weather: 'Sun' });
            testQPOverride('Quark Drive', { terrain: 'Electric' });
            testQPOverride('Protosynthesis', { weather: 'Sun' });
            test('Meteor Beam/Electro Shot', function () {
                var defender = Pokemon('Arceus');
                var testCase = function (options, expected) {
                    var result = calculate(Pokemon('Archaludon', options), defender, Move('Meteor Beam'));
                    expect(result.attacker.boosts.spa).toBe(expected);
                    result = calculate(Pokemon('Archaludon', options), defender, Move('Electro Shot'));
                    expect(result.attacker.boosts.spa).toBe(expected);
                };
                testCase({}, 1);
                testCase({ boosts: { spa: 6 } }, 6);
                testCase({ ability: 'Simple' }, 2);
                testCase({ ability: 'Contrary' }, -1);
            });
            test('Revelation Dance should change type if Pokemon Terastallized', function () {
                var attacker = Pokemon('Oricorio-Pom-Pom');
                var defender = Pokemon('Sandaconda');
                var result = calculate(attacker, defender, Move('Revelation Dance'));
                expect(result.move.type).toBe('Electric');
                attacker.teraType = 'Water';
                result = calculate(attacker, defender, Move('Revelation Dance'));
                expect(result.move.type).toBe('Water');
            });
            test('Flower Gift, Power Spot, Battery, and switching boosts shouldn\'t have double spaces', function () {
                var attacker = Pokemon('Weavile');
                var defender = Pokemon('Vulpix');
                var field = Field({
                    weather: 'Sun',
                    attackerSide: {
                        isFlowerGift: true,
                        isPowerSpot: true
                    },
                    defenderSide: {
                        isSwitching: 'out'
                    }
                });
                var result = calculate(attacker, defender, Move('Pursuit'), field);
                expect(result.desc()).toBe("0 Atk Weavile with an ally's Flower Gift Power Spot boosted switching boosted Pursuit (80 BP) vs. 0 HP / 0 Def Vulpix in Sun: 399-469 (183.8 - 216.1%) -- guaranteed OHKO");
            });
            test('Wind Rider should give an Attack boost in Tailwind', function () {
                var attacker = Pokemon('Brambleghast', { 'ability': 'Wind Rider' });
                var defender = Pokemon('Brambleghast', { 'ability': 'Wind Rider' });
                var field = Field({
                    attackerSide: {
                        isTailwind: true
                    }
                });
                var result = calculate(attacker, defender, Move('Power Whip'), field);
                expect(attacker.boosts.atk).toBe(0);
                expect(result.attacker.boosts.atk).toBe(1);
            });
            describe('Tera Stellar', function () {
                var terastal = Pokemon('Arceus', { teraType: 'Stellar' });
                var control = Pokemon('Arceus');
                test('should only be displayed on defender for Stellar attacks', function () {
                    expect(calculate(control, terastal, Move('Tera Blast'))
                        .rawDesc
                        .defenderTera).toBeUndefined();
                    expect(calculate(terastal, terastal, Move('Tera Blast'))
                        .rawDesc
                        .defenderTera).toBeDefined();
                    expect(calculate(terastal, terastal, Move('Tera Blast', { isStellarFirstUse: true }))
                        .rawDesc
                        .defenderTera).toBeDefined();
                    expect(calculate(control, terastal, Move('Tera Blast', { isStellarFirstUse: true }))
                        .rawDesc
                        .defenderTera).toBeUndefined();
                });
                test('should not be displayed for non-boosted attacks', function () { return expect(calculate(terastal, control, Move('Judgment', { isStellarFirstUse: false }))
                    .rawDesc
                    .attackerTera).toBeUndefined(); });
                test('should distinguish between first use for Tera Blast', function () {
                    var result = [true, false].map(function (isStellarFirstUse) {
                        var _ = [];
                        for (var _i = 1; _i < arguments.length; _i++) {
                            _[_i - 1] = arguments[_i];
                        }
                        return calculate(terastal, control, Move('Tera Blast', { isStellarFirstUse: isStellarFirstUse }))
                            .rawDesc
                            .isStellarFirstUse;
                    });
                    expect(result[0]).not.toEqual(result[1]);
                });
            });
        });
        describe('Descriptions', function () {
            (0, helper_1.inGen)(9, function (_a) {
                var gen = _a.gen, calculate = _a.calculate, Pokemon = _a.Pokemon, Move = _a.Move;
                test('displayed chances should not round to 100%', function () {
                    var result = calculate(Pokemon('Xerneas', { item: 'Choice Band', nature: 'Adamant', evs: { atk: 252 } }), Pokemon('Necrozma-Dusk-Mane', { nature: 'Impish', evs: { hp: 252, def: 252 } }), Move('Close Combat'));
                    expect(result.kochance().chance).toBeGreaterThanOrEqual(0.9995);
                    expect(result.kochance().text).toBe('99.9% chance to 3HKO');
                });
                test('displayed chances should not round to 0%', function () {
                    var result = calculate(Pokemon('Deoxys-Attack', { evs: { spa: 44 } }), Pokemon('Blissey', { nature: 'Calm', evs: { hp: 252, spd: 252 } }), Move('Psycho Boost'));
                    expect(result.kochance().chance).toBeLessThan(0.005);
                    expect(result.kochance().text).toBe('0.1% chance to 4HKO');
                });
            });
        });
        describe('Some moves should break screens before doing damage', function () {
            (0, helper_1.inGens)(3, 9, function (_a) {
                var calculate = _a.calculate, Pokemon = _a.Pokemon, Move = _a.Move, Field = _a.Field;
                test('Brick Break should break screens', function () {
                    var pokemon = Pokemon('Mew');
                    var brickBreak = Move('Brick Break');
                    var otherMove = Move('Vital Throw', { overrides: { basePower: 75 } });
                    var field = Field({ defenderSide: { isReflect: true } });
                    var brickBreakResult = calculate(pokemon, pokemon, brickBreak, field);
                    expect(brickBreakResult.field.defenderSide.isReflect).toBe(false);
                    var otherMoveResult = calculate(pokemon, pokemon, otherMove, field);
                    expect(otherMoveResult.field.defenderSide.isReflect).toBe(true);
                    expect(brickBreakResult.range()[0]).toBeGreaterThan(otherMoveResult.range()[0]);
                    expect(brickBreakResult.range()[1]).toBeGreaterThan(otherMoveResult.range()[1]);
                });
            });
            (0, helper_1.inGens)(7, 9, function (_a) {
                var calculate = _a.calculate, Pokemon = _a.Pokemon, Move = _a.Move, Field = _a.Field;
                test('Psychic Fangs should break screens', function () {
                    var pokemon = Pokemon('Mew');
                    var psychicFangs = Move('Psychic Fangs');
                    var otherMove = Move('Zen Headbutt', { overrides: { basePower: 75 } });
                    var field = Field({ defenderSide: { isReflect: true } });
                    var psychicFangsResult = calculate(pokemon, pokemon, psychicFangs, field);
                    expect(psychicFangsResult.field.defenderSide.isReflect).toBe(false);
                    var otherMoveResult = calculate(pokemon, pokemon, otherMove, field);
                    expect(otherMoveResult.field.defenderSide.isReflect).toBe(true);
                    expect(psychicFangsResult.range()[0]).toBeGreaterThan(otherMoveResult.range()[0]);
                    expect(psychicFangsResult.range()[1]).toBeGreaterThan(otherMoveResult.range()[1]);
                });
            });
            (0, helper_1.inGen)(9, function (_a) {
                var calculate = _a.calculate, Pokemon = _a.Pokemon, Move = _a.Move, Field = _a.Field;
                test('Raging Bull should break screens', function () {
                    var pokemon = Pokemon('Tauros-Paldea-Aqua');
                    var ragingBull = Move('Raging Bull');
                    var otherMove = Move('Waterfall', { overrides: { basePower: 90 } });
                    var field = Field({ defenderSide: { isReflect: true } });
                    var ragingBullResult = calculate(pokemon, pokemon, ragingBull, field);
                    expect(ragingBullResult.field.defenderSide.isReflect).toBe(false);
                    var otherMoveResult = calculate(pokemon, pokemon, otherMove, field);
                    expect(otherMoveResult.field.defenderSide.isReflect).toBe(true);
                    expect(ragingBullResult.range()[0]).toBeGreaterThan(otherMoveResult.range()[0]);
                    expect(ragingBullResult.range()[1]).toBeGreaterThan(otherMoveResult.range()[1]);
                });
            });
        });
    });
});
//# sourceMappingURL=calc.test.js.map