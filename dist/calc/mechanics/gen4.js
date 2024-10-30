"use strict";
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;

var items_1 = require("../items");
var result_1 = require("../result");
var util_1 = require("./util");
function calculateDPP(gen, attacker, defender, move, field) {
    var _a;
    var _b;
    (0, util_1.checkAirLock)(attacker, field);
    (0, util_1.checkAirLock)(defender, field);
    (0, util_1.checkForecast)(attacker, field.weather);
    (0, util_1.checkForecast)(defender, field.weather);
    (0, util_1.checkItem)(attacker);
    (0, util_1.checkItem)(defender);
    (0, util_1.checkIntimidate)(gen, attacker, defender);
    (0, util_1.checkIntimidate)(gen, defender, attacker);
    (0, util_1.checkDownload)(attacker, defender);
    (0, util_1.checkDownload)(defender, attacker);
    attacker.stats.spe = (0, util_1.getFinalSpeed)(gen, attacker, field, field.attackerSide);
    defender.stats.spe = (0, util_1.getFinalSpeed)(gen, defender, field, field.defenderSide);
    var desc = {
        attackerName: attacker.name,
        moveName: move.name,
        defenderName: defender.name
    };
    var result = new result_1.Result(gen, attacker, defender, move, field, 0, desc);
    if (move.category === 'Status' && !move.named('Nature Power')) {
        return result;
    }
    if (field.defenderSide.isProtected && !move.breaksProtect) {
        desc.isProtected = true;
        return result;
    }
    if (move.name === 'Pain Split') {
        var average = Math.floor((attacker.curHP() + defender.curHP()) / 2);
        var damage_1 = Math.max(0, defender.curHP() - average);
        result.damage = damage_1;
        return result;
    }
    var defenderAbilityIgnored = defender.hasAbility('Battle Armor', 'Clear Body', 'Damp', 'Dry Skin', 'Filter', 'Flash Fire', 'Flower Gift', 'Heatproof', 'Hyper Cutter', 'Immunity', 'Inner Focus', 'Insomnia', 'Keen Eye', 'Leaf Guard', 'Levitate', 'Lightning Rod', 'Limber', 'Magma Armor', 'Marvel Scale', 'Motor Drive', 'Oblivious', 'Own Tempo', 'Sand Veil', 'Shell Armor', 'Shield Dust', 'Simple', 'Snow Cloak', 'Solid Rock', 'Soundproof', 'Sticky Hold', 'Storm Drain', 'Sturdy', 'Suction Cups', 'Tangled Feet', 'Thick Fat', 'Unaware', 'Vital Spirit', 'Volt Absorb', 'Water Absorb', 'Water Veil', 'White Smoke', 'Wonder Guard');
    if (attacker.hasAbility('Mold Breaker') && defenderAbilityIgnored) {
        defender.ability = '';
        desc.attackerAbility = attacker.ability;
    }
    var isCritical = move.isCrit && !defender.hasAbility('Battle Armor', 'Shell Armor');
    if (move.named('Weather Ball')) {
        move.type =
            field.hasWeather('Sun') ? 'Fire'
                : field.hasWeather('Rain') ? 'Water'
                    : field.hasWeather('Sand') ? 'Rock'
                        : field.hasWeather('Hail') ? 'Ice'
                            : 'Normal';
        desc.weather = field.weather;
        desc.moveType = move.type;
    }
    else if (move.named('Judgment') && attacker.item && attacker.item.includes('Plate')) {
        move.type = (0, items_1.getItemBoostType)(attacker.item);
    }
    else if (move.named('Natural Gift') && ((_b = attacker.item) === null || _b === void 0 ? void 0 : _b.endsWith('Berry'))) {
        var gift = (0, items_1.getNaturalGift)(gen, attacker.item);
        move.type = gift.t;
        move.bp = gift.p;
        desc.attackerItem = attacker.item;
        desc.moveBP = move.bp;
        desc.moveType = move.type;
    }
    else if (move.named('Brick Break')) {
        field.defenderSide.isReflect = false;
        field.defenderSide.isLightScreen = false;
    }
    if (attacker.hasAbility('Normalize') && !move.named('Struggle')) {
        move.type = 'Normal';
        desc.attackerAbility = attacker.ability;
    }
    var isGhostRevealed = attacker.hasAbility('Scrappy') || field.defenderSide.isForesight;
    var typeEffectivenessPrecedenceRules = [
        'Normal',
        'Fire',
        'Water',
        'Electric',
        'Grass',
        'Ice',
        'Fighting',
        'Poison',
        'Ground',
        'Flying',
        'Psychic',
        'Bug',
        'Rock',
        'Ghost',
        'Dragon',
        'Dark',
        'Steel',
    ];
    var firstDefenderType = defender.types[0];
    var secondDefenderType = defender.types[1];
    if (secondDefenderType && firstDefenderType !== secondDefenderType) {
        var firstTypePrecedence = typeEffectivenessPrecedenceRules.indexOf(firstDefenderType);
        var secondTypePrecedence = typeEffectivenessPrecedenceRules.indexOf(secondDefenderType);
        if (firstTypePrecedence > secondTypePrecedence) {
            _a = __read([secondDefenderType, firstDefenderType], 2), firstDefenderType = _a[0], secondDefenderType = _a[1];
        }
    }
    var type1Effectiveness = (0, util_1.getMoveEffectiveness)(gen, move, firstDefenderType, isGhostRevealed, field.isGravity);
    var type2Effectiveness = secondDefenderType
        ? (0, util_1.getMoveEffectiveness)(gen, move, secondDefenderType, isGhostRevealed, field.isGravity)
        : 1;
    var typeEffectiveness = type1Effectiveness * type2Effectiveness;
    if (typeEffectiveness === 0 && move.hasType('Ground') &&
        (defender.hasItem('Iron Ball') && !defender.hasAbility('Klutz'))) {
        if (type1Effectiveness === 0) {
            type1Effectiveness = 1;
        }
        else if (defender.types[1] && type2Effectiveness === 0) {
            type2Effectiveness = 1;
        }
        typeEffectiveness = type1Effectiveness * type2Effectiveness;
    }
    if (typeEffectiveness === 0) {
        return result;
    }
    var ignoresWonderGuard = move.hasType('???') || move.named('Fire Fang');
    if ((!ignoresWonderGuard && defender.hasAbility('Wonder Guard') && typeEffectiveness <= 1) ||
        (move.hasType('Fire') && defender.hasAbility('Flash Fire')) ||
        (move.hasType('Water') && defender.hasAbility('Dry Skin', 'Water Absorb')) ||
        (move.hasType('Electric') && defender.hasAbility('Motor Drive', 'Volt Absorb')) ||
        (move.hasType('Ground') && !field.isGravity &&
            !defender.hasItem('Iron Ball') && defender.hasAbility('Levitate')) ||
        (move.flags.sound && defender.hasAbility('Soundproof'))) {
        desc.defenderAbility = defender.ability;
        return result;
    }
    desc.HPEVs = (0, util_1.getStatDescriptionText)(gen, defender, 'hp');
    var fixedDamage = (0, util_1.handleFixedDamageMoves)(attacker, move);
    if (fixedDamage) {
        result.damage = fixedDamage;
        return result;
    }
    if (move.hits > 1) {
        desc.hits = move.hits;
    }
    var isPhysical = move.category === 'Physical';
    var basePower = calculateBasePowerDPP(gen, attacker, defender, move, field, desc);
    if (basePower === 0) {
        return result;
    }
    basePower = calculateBPModsDPP(attacker, defender, move, field, desc, basePower);
    var attack = calculateAttackDPP(gen, attacker, defender, move, field, desc, isCritical);
    var defense = calculateDefenseDPP(gen, attacker, defender, move, field, desc, isCritical);
    var baseDamage = Math.floor(Math.floor((Math.floor((2 * attacker.level) / 5 + 2) * basePower * attack) / 50) / defense);
    if (attacker.hasStatus('brn') && isPhysical && !attacker.hasAbility('Guts')) {
        baseDamage = Math.floor(baseDamage * 0.5);
        desc.isBurned = true;
    }
    baseDamage = calculateFinalModsDPP(baseDamage, attacker, move, field, desc, isCritical);
    var stabMod = 1;
    if (move.hasType.apply(move, __spreadArray([], __read(attacker.types), false))) {
        if (attacker.hasAbility('Adaptability')) {
            stabMod = 2;
            desc.attackerAbility = attacker.ability;
        }
        else {
            stabMod = 1.5;
        }
    }
    var filterMod = 1;
    if (defender.hasAbility('Filter', 'Solid Rock') && typeEffectiveness > 1) {
        filterMod = 0.75;
        desc.defenderAbility = defender.ability;
    }
    var ebeltMod = 1;
    if (attacker.hasItem('Expert Belt') && typeEffectiveness > 1) {
        ebeltMod = 1.2;
        desc.attackerItem = attacker.item;
    }
    var tintedMod = 1;
    if (attacker.hasAbility('Tinted Lens') && typeEffectiveness < 1) {
        tintedMod = 2;
        desc.attackerAbility = attacker.ability;
    }
    var berryMod = 1;
    if (move.hasType((0, items_1.getBerryResistType)(defender.item)) &&
        (typeEffectiveness > 1 || move.hasType('Normal'))) {
        berryMod = 0.5;
        desc.defenderItem = defender.item;
    }
    var damage = [];
    for (var i = 0; i < 16; i++) {
        damage[i] = Math.floor((baseDamage * (85 + i)) / 100);
        damage[i] = Math.floor(damage[i] * stabMod);
        damage[i] = Math.floor(damage[i] * type1Effectiveness);
        damage[i] = Math.floor(damage[i] * type2Effectiveness);
        damage[i] = Math.floor(damage[i] * filterMod);
        damage[i] = Math.floor(damage[i] * ebeltMod);
        damage[i] = Math.floor(damage[i] * tintedMod);
        damage[i] = Math.floor(damage[i] * berryMod);
        damage[i] = Math.max(1, damage[i]);
    }
    result.damage = damage;
    if ((move.dropsStats && move.timesUsed > 1) || move.hits > 1) {
        var origDefBoost = desc.defenseBoost;
        var origAtkBoost = desc.attackBoost;
        var numAttacks = 1;
        if (move.dropsStats && move.timesUsed > 1) {
            desc.moveTurns = "over ".concat(move.timesUsed, " turns");
            numAttacks = move.timesUsed;
        }
        else {
            numAttacks = move.hits;
        }
        var usedItems = [false, false];
        var _loop_1 = function (times) {
            usedItems = (0, util_1.checkMultihitBoost)(gen, attacker, defender, move, field, desc, usedItems[0], usedItems[1]);
            var newBasePower = calculateBasePowerDPP(gen, attacker, defender, move, field, desc);
            newBasePower = calculateBPModsDPP(attacker, defender, move, field, desc, newBasePower);
            var newAtk = calculateAttackDPP(gen, attacker, defender, move, field, desc, isCritical);
            var baseDamage_1 = Math.floor(Math.floor((Math.floor((2 * attacker.level) / 5 + 2) * newBasePower * newAtk) / 50) / defense);
            if (attacker.hasStatus('brn') && isPhysical && !attacker.hasAbility('Guts')) {
                baseDamage_1 = Math.floor(baseDamage_1 * 0.5);
                desc.isBurned = true;
            }
            baseDamage_1 = calculateFinalModsDPP(baseDamage_1, attacker, move, field, desc, isCritical);
            var damageMultiplier = 0;
            result.damage = result.damage.map(function (affectedAmount) {
                var newFinalDamage = 0;
                newFinalDamage = Math.floor((baseDamage_1 * (85 + damageMultiplier)) / 100);
                newFinalDamage = Math.floor(newFinalDamage * stabMod);
                newFinalDamage = Math.floor(newFinalDamage * type1Effectiveness);
                newFinalDamage = Math.floor(newFinalDamage * type2Effectiveness);
                newFinalDamage = Math.floor(newFinalDamage * filterMod);
                newFinalDamage = Math.floor(newFinalDamage * ebeltMod);
                newFinalDamage = Math.floor(newFinalDamage * tintedMod);
                newFinalDamage = Math.max(1, newFinalDamage);
                damageMultiplier++;
                return affectedAmount + newFinalDamage;
            });
        };
        for (var times = 1; times < numAttacks; times++) {
            _loop_1(times);
        }
        desc.defenseBoost = origDefBoost;
        desc.attackBoost = origAtkBoost;
    }
    return result;
}
exports.calculateDPP = calculateDPP;
function calculateBasePowerDPP(gen, attacker, defender, move, field, desc, hit) {
    if (hit === void 0) { hit = 1; }
    var basePower = move.bp;
    var turnOrder = attacker.stats.spe > defender.stats.spe ? 'first' : 'last';
    switch (move.name) {
        case 'Brine':
            if (defender.curHP() <= defender.maxHP() / 2) {
                basePower *= 2;
                desc.moveBP = basePower;
            }
            break;
        case 'Eruption':
        case 'Water Spout':
            basePower = Math.max(1, Math.floor((basePower * attacker.curHP()) / attacker.maxHP()));
            desc.moveBP = basePower;
            break;
        case 'Facade':
            if (attacker.hasStatus('par', 'psn', 'tox', 'brn')) {
                basePower = move.bp * 2;
                desc.moveBP = basePower;
            }
            break;
        case 'Flail':
        case 'Reversal':
            var p = Math.floor((64 * attacker.curHP()) / attacker.maxHP());
            basePower = p <= 1 ? 200 : p <= 5 ? 150 : p <= 12 ? 100 : p <= 21 ? 80 : p <= 42 ? 40 : 20;
            desc.moveBP = basePower;
            break;
        case 'Fling':
            basePower = (0, items_1.getFlingPower)(attacker.item);
            desc.moveBP = basePower;
            desc.attackerItem = attacker.item;
            break;
        case 'Grass Knot':
        case 'Low Kick':
            var w = defender.weightkg;
            basePower = w >= 200 ? 120 : w >= 100 ? 100 : w >= 50 ? 80 : w >= 25 ? 60 : w >= 10 ? 40 : 20;
            desc.moveBP = basePower;
            break;
        case 'Gyro Ball':
            basePower = Math.min(150, Math.floor((25 * defender.stats.spe) / attacker.stats.spe));
            desc.moveBP = basePower;
            break;
        case 'Payback':
            if (turnOrder !== 'first') {
                basePower *= 2;
                desc.moveBP = basePower;
            }
            break;
        case 'Punishment':
            basePower = Math.min(200, 60 + 20 * (0, util_1.countBoosts)(gen, defender.boosts));
            desc.moveBP = basePower;
            break;
        case 'Wake-Up Slap':
            if (defender.hasStatus('slp')) {
                basePower *= 2;
                desc.moveBP = basePower;
            }
            break;
        case 'Nature Power':
            move.category = 'Special';
            move.secondaries = true;
            basePower = 80;
            desc.moveName = 'Tri Attack';
            break;
        case 'Crush Grip':
        case 'Wring Out':
            basePower = Math.floor((defender.curHP() * 120) / defender.maxHP()) + 1;
            desc.moveBP = basePower;
            break;
        case 'Triple Kick':
            basePower = hit * 10;
            desc.moveBP = move.hits === 2 ? 30 : move.hits === 3 ? 60 : 10;
            break;
        case 'Weather Ball':
            basePower = move.bp * (field.weather ? 2 : 1);
            desc.moveBP = basePower;
            break;
        default:
            basePower = move.bp;
    }
    return basePower;
}
exports.calculateBasePowerDPP = calculateBasePowerDPP;
function calculateBPModsDPP(attacker, defender, move, field, desc, basePower) {
    if (field.attackerSide.isHelpingHand) {
        basePower = Math.floor(basePower * 1.5);
        desc.isHelpingHand = true;
    }
    var isPhysical = move.category === 'Physical';
    if ((attacker.hasItem('Muscle Band') && isPhysical) ||
        (attacker.hasItem('Wise Glasses') && !isPhysical)) {
        basePower = Math.floor(basePower * 1.1);
        desc.attackerItem = attacker.item;
    }
    else if (move.hasType((0, items_1.getItemBoostType)(attacker.item)) ||
        (attacker.hasItem('Adamant Orb') &&
            attacker.named('Dialga') &&
            move.hasType('Steel', 'Dragon')) ||
        (attacker.hasItem('Lustrous Orb') &&
            attacker.named('Palkia') &&
            move.hasType('Water', 'Dragon')) ||
        (attacker.hasItem('Griseous Orb') &&
            attacker.named('Giratina-Origin') &&
            move.hasType('Ghost', 'Dragon'))) {
        basePower = Math.floor(basePower * 1.2);
        desc.attackerItem = attacker.item;
    }
    if ((attacker.hasAbility('Reckless') && (move.recoil || move.hasCrashDamage)) ||
        (attacker.hasAbility('Iron Fist') && move.flags.punch)) {
        basePower = Math.floor(basePower * 1.2);
        desc.attackerAbility = attacker.ability;
    }
    else if ((attacker.curHP() <= attacker.maxHP() / 3 &&
        ((attacker.hasAbility('Overgrow') && move.hasType('Grass')) ||
            (attacker.hasAbility('Blaze') && move.hasType('Fire')) ||
            (attacker.hasAbility('Torrent') && move.hasType('Water')) ||
            (attacker.hasAbility('Swarm') && move.hasType('Bug')))) ||
        (attacker.hasAbility('Technician') && basePower <= 60)) {
        basePower = Math.floor(basePower * 1.5);
        desc.attackerAbility = attacker.ability;
    }
    if ((defender.hasAbility('Heatproof') && move.hasType('Fire')) ||
        (defender.hasAbility('Thick Fat') && (move.hasType('Fire', 'Ice')))) {
        basePower = Math.floor(basePower * 0.5);
        desc.defenderAbility = defender.ability;
    }
    else if (defender.hasAbility('Dry Skin') && move.hasType('Fire')) {
        basePower = Math.floor(basePower * 1.25);
        desc.defenderAbility = defender.ability;
    }
    return basePower;
}
exports.calculateBPModsDPP = calculateBPModsDPP;
function calculateAttackDPP(gen, attacker, defender, move, field, desc, isCritical) {
    if (isCritical === void 0) { isCritical = false; }
    var isPhysical = move.category === 'Physical';
    var attackStat = isPhysical ? 'atk' : 'spa';
    desc.attackEVs = (0, util_1.getStatDescriptionText)(gen, attacker, attackStat, attacker.nature);
    var attack;
    var attackBoost = attacker.boosts[attackStat];
    var rawAttack = attacker.rawStats[attackStat];
    if (attackBoost === 0 || (isCritical && attackBoost < 0)) {
        attack = rawAttack;
    }
    else if (defender.hasAbility('Unaware')) {
        attack = rawAttack;
        desc.defenderAbility = defender.ability;
    }
    else if (attacker.hasAbility('Simple')) {
        attack = getSimpleModifiedStat(rawAttack, attackBoost);
        desc.attackerAbility = attacker.ability;
        desc.attackBoost = attackBoost;
    }
    else {
        attack = (0, util_1.getModifiedStat)(rawAttack, attackBoost);
        desc.attackBoost = attackBoost;
    }
    if (isPhysical && attacker.hasAbility('Pure Power', 'Huge Power')) {
        attack *= 2;
        desc.attackerAbility = attacker.ability;
    }
    else if (field.hasWeather('Sun') &&
        (attacker.hasAbility(isPhysical ? 'Flower Gift' : 'Solar Power'))) {
        attack = Math.floor(attack * 1.5);
        desc.attackerAbility = attacker.ability;
        desc.weather = field.weather;
    }
    else if ((isPhysical &&
        (attacker.hasAbility('Hustle') || (attacker.hasAbility('Guts') && attacker.status)) ||
        (!isPhysical && attacker.abilityOn && attacker.hasAbility('Plus', 'Minus')))) {
        attack = Math.floor(attack * 1.5);
        desc.attackerAbility = attacker.ability;
    }
    else if (isPhysical && attacker.hasAbility('Slow Start') && attacker.abilityOn) {
        attack = Math.floor(attack / 2);
        desc.attackerAbility = attacker.ability;
    }
    if (field.attackerSide.isFlowerGift && !attacker.hasAbility('Flower Gift') &&
        field.hasWeather('Sun') && isPhysical) {
        attack = Math.floor(attack * 1.5);
        desc.weather = field.weather;
        desc.isFlowerGiftAttacker = true;
    }
    if ((isPhysical ? attacker.hasItem('Choice Band') : attacker.hasItem('Choice Specs')) ||
        (!isPhysical && attacker.hasItem('Soul Dew') && attacker.named('Latios', 'Latias'))) {
        attack = Math.floor(attack * 1.5);
        desc.attackerItem = attacker.item;
    }
    else if ((attacker.hasItem('Light Ball') && attacker.named('Pikachu')) ||
        (attacker.hasItem('Thick Club') && attacker.named('Cubone', 'Marowak') && isPhysical) ||
        (attacker.hasItem('Deep Sea Tooth') && attacker.named('Clamperl') && !isPhysical)) {
        attack *= 2;
        desc.attackerItem = attacker.item;
    }
    return attack;
}
exports.calculateAttackDPP = calculateAttackDPP;
function calculateDefenseDPP(gen, attacker, defender, move, field, desc, isCritical) {
    if (isCritical === void 0) { isCritical = false; }
    var isPhysical = move.category === 'Physical';
    var defenseStat = isPhysical ? 'def' : 'spd';
    desc.defenseEVs = (0, util_1.getStatDescriptionText)(gen, defender, defenseStat, defender.nature);
    var defense;
    var defenseBoost = defender.boosts[defenseStat];
    var rawDefense = defender.rawStats[defenseStat];
    if (defenseBoost === 0 || (isCritical && defenseBoost > 0)) {
        defense = rawDefense;
    }
    else if (attacker.hasAbility('Unaware')) {
        defense = rawDefense;
        desc.attackerAbility = attacker.ability;
    }
    else if (defender.hasAbility('Simple')) {
        defense = getSimpleModifiedStat(rawDefense, defenseBoost);
        desc.defenderAbility = defender.ability;
        desc.defenseBoost = defenseBoost;
    }
    else {
        defense = (0, util_1.getModifiedStat)(rawDefense, defenseBoost);
        desc.defenseBoost = defenseBoost;
    }
    if (defender.hasAbility('Marvel Scale') && defender.status && isPhysical) {
        defense = Math.floor(defense * 1.5);
        desc.defenderAbility = defender.ability;
    }
    else if (defender.hasAbility('Flower Gift') && field.hasWeather('Sun') && !isPhysical) {
        defense = Math.floor(defense * 1.5);
        desc.defenderAbility = defender.ability;
        desc.weather = field.weather;
    }
    else if (field.defenderSide.isFlowerGift && field.hasWeather('Sun') && !isPhysical) {
        defense = Math.floor(defense * 1.5);
        desc.weather = field.weather;
        desc.isFlowerGiftDefender = true;
    }
    if (defender.hasItem('Soul Dew') && defender.named('Latios', 'Latias') && !isPhysical) {
        defense = Math.floor(defense * 1.5);
        desc.defenderItem = defender.item;
    }
    else if ((defender.hasItem('Deep Sea Scale') && defender.named('Clamperl') && !isPhysical) ||
        (defender.hasItem('Metal Powder') && defender.named('Ditto') && isPhysical)) {
        defense *= 2;
        desc.defenderItem = defender.item;
    }
    if (field.hasWeather('Sand') && defender.hasType('Rock') && !isPhysical) {
        defense = Math.floor(defense * 1.5);
        desc.weather = field.weather;
    }
    if (move.named('Explosion') || move.named('Self-Destruct')) {
        defense = Math.floor(defense * 0.5);
    }
    if (defense < 1) {
        defense = 1;
    }
    return defense;
}
exports.calculateDefenseDPP = calculateDefenseDPP;
function calculateFinalModsDPP(baseDamage, attacker, move, field, desc, isCritical) {
    if (isCritical === void 0) { isCritical = false; }
    var isPhysical = move.category === 'Physical';
    if (!isCritical) {
        var screenMultiplier = field.gameType !== 'Singles' ? 2 / 3 : 1 / 2;
        if (isPhysical && field.defenderSide.isReflect) {
            baseDamage = Math.floor(baseDamage * screenMultiplier);
            desc.isReflect = true;
        }
        else if (!isPhysical && field.defenderSide.isLightScreen) {
            baseDamage = Math.floor(baseDamage * screenMultiplier);
            desc.isLightScreen = true;
        }
    }
    if (field.gameType !== 'Singles' &&
        ['allAdjacent', 'allAdjacentFoes'].includes(move.target)) {
        baseDamage = Math.floor((baseDamage * 3) / 4);
    }
    if ((field.hasWeather('Sun') && move.hasType('Fire')) ||
        (field.hasWeather('Rain') && move.hasType('Water'))) {
        baseDamage = Math.floor(baseDamage * 1.5);
        desc.weather = field.weather;
    }
    else if ((field.hasWeather('Sun') && move.hasType('Water')) ||
        (field.hasWeather('Rain') && move.hasType('Fire')) ||
        (move.named('Solar Beam') && field.hasWeather('Rain', 'Sand', 'Hail'))) {
        baseDamage = Math.floor(baseDamage * 0.5);
        desc.weather = field.weather;
    }
    if (attacker.hasAbility('Flash Fire') && attacker.abilityOn && move.hasType('Fire')) {
        baseDamage = Math.floor(baseDamage * 1.5);
        desc.attackerAbility = 'Flash Fire';
    }
    baseDamage += 2;
    if (isCritical) {
        if (attacker.hasAbility('Sniper')) {
            baseDamage *= 3;
            desc.attackerAbility = attacker.ability;
        }
        else {
            baseDamage *= 2;
        }
        desc.isCritical = isCritical;
    }
    if (attacker.hasItem('Life Orb')) {
        baseDamage = Math.floor(baseDamage * 1.3);
        desc.attackerItem = attacker.item;
    }
    if (move.named('Pursuit') && field.defenderSide.isSwitching === 'out') {
        if (attacker.hasAbility('Technician')) {
            baseDamage = Math.floor(baseDamage * 1);
        }
        else {
            baseDamage = Math.floor(baseDamage * 2);
            desc.isSwitching = 'out';
        }
    }
    return baseDamage;
}
function getSimpleModifiedStat(stat, mod) {
    var simpleMod = Math.min(6, Math.max(-6, mod * 2));
    return simpleMod > 0
        ? Math.floor((stat * (2 + simpleMod)) / 2)
        : simpleMod < 0 ? Math.floor((stat * 2) / (2 - simpleMod)) : stat;
}
//# sourceMappingURL=gen4.js.map