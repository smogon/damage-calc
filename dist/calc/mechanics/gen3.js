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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
exports.__esModule = true;

var items_1 = require("../items");
var result_1 = require("../result");
var util_1 = require("./util");
function calculateADV(gen, attacker, defender, move, field) {
    util_1.checkAirLock(attacker, field);
    util_1.checkAirLock(defender, field);
    util_1.checkForecast(attacker, field.weather);
    util_1.checkForecast(defender, field.weather);
    util_1.checkIntimidate(gen, attacker, defender);
    util_1.checkIntimidate(gen, defender, attacker);
    attacker.stats.spe = util_1.getFinalSpeed(gen, attacker, field, field.attackerSide);
    defender.stats.spe = util_1.getFinalSpeed(gen, defender, field, field.defenderSide);
    var desc = {
        attackerName: attacker.name,
        moveName: move.name,
        defenderName: defender.name
    };
    var result = new result_1.Result(gen, attacker, defender, move, field, 0, desc);
    if (move.category === 'Status' && !move.named('Nature Power')) {
        return result;
    }
    if (field.defenderSide.isProtected) {
        desc.isProtected = true;
        return result;
    }
    if (move.named('Weather Ball')) {
        move.type =
            field.hasWeather('Sun') ? 'Fire'
                : field.hasWeather('Rain') ? 'Water'
                    : field.hasWeather('Sand') ? 'Rock'
                        : field.hasWeather('Hail') ? 'Ice'
                            : 'Normal';
        move.category = move.type === 'Rock' ? 'Physical' : 'Special';
        desc.weather = field.weather;
        desc.moveType = move.type;
        desc.moveBP = move.bp;
    }
    var type1Effectiveness = util_1.getMoveEffectiveness(gen, move, defender.types[0], field.defenderSide.isForesight);
    var type2Effectiveness = defender.types[1]
        ? util_1.getMoveEffectiveness(gen, move, defender.types[1], field.defenderSide.isForesight)
        : 1;
    var typeEffectiveness = type1Effectiveness * type2Effectiveness;
    if (typeEffectiveness === 0) {
        return result;
    }
    if ((defender.hasAbility('Flash Fire') && move.hasType('Fire')) ||
        (defender.hasAbility('Levitate') && move.hasType('Ground')) ||
        (defender.hasAbility('Volt Absorb') && move.hasType('Electric')) ||
        (defender.hasAbility('Water Absorb') && move.hasType('Water')) ||
        (defender.hasAbility('Wonder Guard') && !move.hasType('???') && typeEffectiveness <= 1) ||
        (defender.hasAbility('Soundproof') && move.flags.sound)) {
        desc.defenderAbility = defender.ability;
        return result;
    }
    desc.HPEVs = defender.evs.hp + " HP";
    var fixedDamage = util_1.handleFixedDamageMoves(attacker, move);
    if (fixedDamage) {
        result.damage = fixedDamage;
        return result;
    }
    if (move.hits > 1) {
        desc.hits = move.hits;
    }
    var bp;
    switch (move.name) {
        case 'Flail':
        case 'Reversal':
            var p = Math.floor((48 * attacker.curHP()) / attacker.maxHP());
            bp = p <= 1 ? 200 : p <= 4 ? 150 : p <= 9 ? 100 : p <= 16 ? 80 : p <= 32 ? 40 : 20;
            desc.moveBP = bp;
            break;
        case 'Low Kick':
            var w = defender.weightkg;
            bp = w >= 200 ? 120 : w >= 100 ? 100 : w >= 50 ? 80 : w >= 25 ? 60 : w >= 10 ? 40 : 20;
            desc.moveBP = bp;
            break;
        case 'Facade':
            if (attacker.hasStatus('par', 'psn', 'tox', 'brn')) {
                bp = 140;
                desc.moveBP = bp;
            }
            else {
                bp = 70;
                desc.moveBP = bp;
            }
            break;
        default:
            bp = move.bp;
    }
    if (bp === 0) {
        return result;
    }
    var isPhysical = move.category === 'Physical';
    var attackStat = isPhysical ? 'atk' : 'spa';
    desc.attackEVs = util_1.getEVDescriptionText(gen, attacker, attackStat, attacker.nature);
    var defenseStat = isPhysical ? 'def' : 'spd';
    desc.defenseEVs = util_1.getEVDescriptionText(gen, defender, defenseStat, defender.nature);
    var at = attacker.rawStats[attackStat];
    var df = defender.rawStats[defenseStat];
    if (isPhysical && attacker.hasAbility('Huge Power', 'Pure Power')) {
        at *= 2;
        desc.attackerAbility = attacker.ability;
    }
    if (field.attackerSide.isBadgeAtk) {
        if ((move.hasType('Normal', 'Fighting', 'Flying', 'Ground', 'Rock', 'Bug', 'Ghost', 'Poison', 'Steel'))) {
            at = Math.floor(at * 1.1);
            desc.isBadgeAtk = true;
        }
    }
    if (field.attackerSide.isBadgeSpec) {
        if ((move.hasType('Water', 'Grass', 'Fire', 'Ice', 'Electric', 'Psychic', 'Dragon', 'Dark'))) {
            at = Math.floor(at * 1.1);
            desc.isBadgeSpec = true;
        }
    }
    if (field.defenderSide.isBadgeSpec) {
        if (!isPhysical) {
            df = Math.floor(df * 1.1);
        }
    }
    if (field.defenderSide.isBadgeDef) {
        if (isPhysical) {
            df = Math.floor(df * 1.1);
        }
    }
    if (!attacker.hasItem('Sea Incense') && move.hasType(items_1.getItemBoostType(attacker.item))) {
        at = Math.floor(at * 1.1);
        desc.attackerItem = attacker.item;
    }
    else if (attacker.hasItem('Sea Incense') && move.hasType('Water')) {
        at = Math.floor(at * 1.05);
        desc.attackerItem = attacker.item;
    }
    else if ((isPhysical && attacker.hasItem('Choice Band')) ||
        (!isPhysical && attacker.hasItem('Soul Dew') && attacker.named('Latios', 'Latias'))) {
        at = Math.floor(at * 1.5);
        desc.attackerItem = attacker.item;
    }
    else if ((!isPhysical && attacker.hasItem('Deep Sea Tooth') && attacker.named('Clamperl')) ||
        (!isPhysical && attacker.hasItem('Light Ball') && attacker.named('Pikachu')) ||
        (isPhysical && attacker.hasItem('Thick Club') && attacker.named('Cubone', 'Marowak'))) {
        at *= 2;
        desc.attackerItem = attacker.item;
    }
    if (!isPhysical && defender.hasItem('Soul Dew') && defender.named('Latios', 'Latias')) {
        df = Math.floor(df * 1.5);
        desc.defenderItem = defender.item;
    }
    else if ((!isPhysical && defender.hasItem('Deep Sea Scale') && defender.named('Clamperl')) ||
        (isPhysical && defender.hasItem('Metal Powder') && defender.named('Ditto'))) {
        df *= 2;
        desc.defenderItem = defender.item;
    }
    if (defender.hasAbility('Thick Fat') && (move.hasType('Fire', 'Ice'))) {
        at = Math.floor(at / 2);
        desc.defenderAbility = defender.ability;
    }
    else if (isPhysical && defender.hasAbility('Marvel Scale') && defender.status) {
        df = Math.floor(df * 1.5);
        desc.defenderAbility = defender.ability;
    }
    if ((isPhysical &&
        (attacker.hasAbility('Hustle') || (attacker.hasAbility('Guts') && attacker.status))) ||
        (!isPhysical && attacker.abilityOn && attacker.hasAbility('Plus', 'Minus'))) {
        at = Math.floor(at * 1.5);
        desc.attackerAbility = attacker.ability;
    }
    else if (attacker.curHP() <= attacker.maxHP() / 3 &&
        ((attacker.hasAbility('Overgrow') && move.hasType('Grass')) ||
            (attacker.hasAbility('Blaze') && move.hasType('Fire')) ||
            (attacker.hasAbility('Torrent') && move.hasType('Water')) ||
            (attacker.hasAbility('Swarm') && move.hasType('Bug')))) {
        bp = Math.floor(bp * 1.5);
        desc.attackerAbility = attacker.ability;
    }
    if (move.named('Explosion', 'Self-Destruct')) {
        df = Math.floor(df / 2);
    }
    var isCritical = move.isCrit && !defender.hasAbility('Battle Armor', 'Shell Armor');
    var attackBoost = attacker.boosts[attackStat];
    var defenseBoost = defender.boosts[defenseStat];
    if (attackBoost > 0 || (!isCritical && attackBoost < 0)) {
        at = util_1.getModifiedStat(at, attackBoost);
        desc.attackBoost = attackBoost;
    }
    if (defenseBoost < 0 || (!isCritical && defenseBoost > 0)) {
        df = util_1.getModifiedStat(df, defenseBoost);
        desc.defenseBoost = defenseBoost;
    }
    var lv = attacker.level;
    var baseDamage = Math.floor(Math.floor((Math.floor((2 * lv) / 5 + 2) * at * bp) / df) / 50);
    if (attacker.hasStatus('brn') && isPhysical && !attacker.hasAbility('Guts')) {
        baseDamage = Math.floor(baseDamage / 2);
        desc.isBurned = true;
    }
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
    if (move.named('Pursuit') && field.defenderSide.isSwitching === 'out') {
        baseDamage = Math.floor(baseDamage * 2);
        desc.isSwitching = 'out';
    }
    if (field.gameType !== 'Singles' && move.target === 'allAdjacentFoes') {
        baseDamage = Math.floor(baseDamage / 2);
    }
    if ((field.hasWeather('Sun') && move.hasType('Fire')) ||
        (field.hasWeather('Rain') && move.hasType('Water'))) {
        baseDamage = Math.floor(baseDamage * 1.5);
        desc.weather = field.weather;
    }
    else if ((field.hasWeather('Sun') && move.hasType('Water')) ||
        (field.hasWeather('Rain') && move.hasType('Fire')) ||
        (move.named('Solar Beam') && field.hasWeather('Rain', 'Sand', 'Hail'))) {
        baseDamage = Math.floor(baseDamage / 2);
        desc.weather = field.weather;
    }
    if (attacker.hasAbility('Flash Fire') && attacker.abilityOn && move.hasType('Fire')) {
        baseDamage = Math.floor(baseDamage * 1.5);
        desc.attackerAbility = 'Flash Fire';
    }
    baseDamage = (move.category === 'Physical' ? Math.max(1, baseDamage) : baseDamage) + 2;
    if (isCritical) {
        baseDamage *= 2;
        desc.isCritical = true;
    }
    if (move.named('Weather Ball') && field.weather) {
        baseDamage *= 2;
        desc.moveBP = bp * 2;
    }
    if (field.attackerSide.isHelpingHand) {
        baseDamage = Math.floor(baseDamage * 1.5);
        desc.isHelpingHand = true;
    }
    if (move.hasType.apply(move, __spread(attacker.types))) {
        baseDamage = Math.floor(baseDamage * 1.5);
    }
    baseDamage = Math.floor(baseDamage * typeEffectiveness);
    result.damage = [];
    for (var i = 85; i <= 100; i++) {
        result.damage[i - 85] = Math.max(1, Math.floor((baseDamage * i) / 100));
    }
    return result;
}
exports.calculateADV = calculateADV;
//# sourceMappingURL=gen3.js.map