"use strict";
exports.__esModule = true;
var util_1 = require("../util");
var items_1 = require("../items");
var result_1 = require("../result");
var util_2 = require("./util");
function calculateGSC(gen, attacker, defender, move, field) {
    attacker.stats.atk = util_2.getModifiedStat(attacker.rawStats.atk, attacker.boosts.atk, gen);
    attacker.stats.def = util_2.getModifiedStat(attacker.rawStats.def, attacker.boosts.def, gen);
    attacker.stats.spa = util_2.getModifiedStat(attacker.rawStats.spa, attacker.boosts.spa, gen);
    attacker.stats.spd = util_2.getModifiedStat(attacker.rawStats.spd, attacker.boosts.spd, gen);
    attacker.stats.spe = util_2.getFinalSpeed(gen, attacker, field, field.attackerSide);
    defender.stats.atk = util_2.getModifiedStat(defender.rawStats.atk, defender.boosts.atk, gen);
    defender.stats.def = util_2.getModifiedStat(defender.rawStats.def, defender.boosts.def, gen);
    defender.stats.spa = util_2.getModifiedStat(defender.rawStats.spa, defender.boosts.spa, gen);
    defender.stats.spd = util_2.getModifiedStat(defender.rawStats.spd, defender.boosts.spd, gen);
    defender.stats.spe = util_2.getFinalSpeed(gen, defender, field, field.defenderSide);
    var description = {
        attackerName: attacker.name,
        moveName: move.name,
        defenderName: defender.name
    };
    var damage = [];
    var result = new result_1.Result(gen, attacker, defender, move, field, damage, description);
    if (move.bp === 0) {
        damage.push(0);
        return result;
    }
    if (field.defenderSide.isProtected) {
        description.isProtected = true;
        damage.push(0);
        return result;
    }
    var typeEffect1 = util_2.getMoveEffectiveness(gen, move, defender.type1, field.defenderSide.isForesight);
    var typeEffect2 = defender.type2
        ? util_2.getMoveEffectiveness(gen, move, defender.type2, field.defenderSide.isForesight)
        : 1;
    var typeEffectiveness = typeEffect1 * typeEffect2;
    if (typeEffectiveness === 0) {
        damage.push(0);
        return result;
    }
    var lv = attacker.level;
    if (move.name === 'Seismic Toss' || move.name === 'Night Shade') {
        damage.push(lv);
        return result;
    }
    if (move.hits > 1) {
        description.hits = move.hits;
    }
    if (move.name === 'Flail' || move.name === 'Reversal') {
        move.isCrit = false;
        var p = Math.floor((48 * attacker.curHP) / attacker.maxHP());
        move.bp = p <= 1 ? 200 : p <= 4 ? 150 : p <= 9 ? 100 : p <= 16 ? 80 : p <= 32 ? 40 : 20;
        description.moveBP = move.bp;
    }
    var isPhysical = gen.types.get(util_1.toID(move.type)).category === 'Physical';
    var attackStat = isPhysical ? 'atk' : 'spa';
    var defenseStat = isPhysical ? 'def' : 'spd';
    var at = attacker.stats[attackStat];
    var df = defender.stats[defenseStat];
    var ignoreMods = move.isCrit && attacker.boosts[attackStat] <= defender.boosts[defenseStat];
    if (ignoreMods) {
        at = attacker.rawStats[attackStat];
        df = defender.rawStats[defenseStat];
    }
    else {
        if (attacker.boosts[attackStat] !== 0) {
            description.attackBoost = attacker.boosts[attackStat];
        }
        if (defender.boosts[defenseStat] !== 0) {
            description.defenseBoost = defender.boosts[defenseStat];
        }
        if (isPhysical && attacker.hasStatus('Burned')) {
            at = Math.floor(at / 2);
            description.isBurned = true;
        }
    }
    if (move.name === 'Explosion' || move.name === 'Self-Destruct') {
        df = Math.floor(df / 2);
    }
    if (!ignoreMods) {
        if (isPhysical && field.defenderSide.isReflect) {
            df *= 2;
            description.isReflect = true;
        }
        else if (!isPhysical && field.defenderSide.isLightScreen) {
            df *= 2;
            description.isLightScreen = true;
        }
    }
    if ((attacker.named('Pikachu') && attacker.hasItem('Light Ball') && !isPhysical) ||
        (attacker.named('Cubone', 'Marowak') && attacker.hasItem('Thick Club') && isPhysical)) {
        at *= 2;
        description.attackerItem = attacker.item;
    }
    if (at > 255 || df > 255) {
        at = Math.floor(at / 4) % 256;
        df = Math.floor(df / 4) % 256;
    }
    if (move.name === 'Present') {
        var type_index = {
            Normal: 0,
            Fighting: 1,
            Flying: 2,
            Poison: 3,
            Ground: 4,
            Rock: 5,
            Bug: 7,
            Ghost: 8,
            Steel: 9,
            None: 19,
            Fire: 20,
            Water: 21,
            Grass: 22,
            Electric: 23,
            Psychic: 24,
            Ice: 25,
            Dragon: 26,
            Dark: 27
        };
        at = 10;
        df = Math.max(type_index[attacker.type2 ? attacker.type2 : attacker.type1], 1);
        lv = Math.max(type_index[defender.type2 ? defender.type2 : defender.type1], 1);
    }
    if (defender.named('Ditto') && defender.hasItem('Metal Powder')) {
        df = Math.floor(df * 1.5);
        description.defenderItem = defender.item;
    }
    var baseDamage = Math.floor(Math.floor((Math.floor((2 * lv) / 5 + 2) * Math.max(1, at) * move.bp) / Math.max(1, df)) / 50);
    if (move.isCrit) {
        baseDamage *= 2;
        description.isCritical = true;
    }
    if (move.name === 'Pursuit' && field.defenderSide.isSwitching) {
        baseDamage = Math.floor(baseDamage * 2);
        description.isSwitching = true;
    }
    var itemBoostType = attacker.item === 'Dragon Fang'
        ? undefined
        : items_1.getItemBoostType(attacker.item === 'Dragon Scale' ? 'Dragon Fang' : attacker.item);
    if (itemBoostType === move.type) {
        baseDamage = Math.floor(baseDamage * 1.1);
        description.attackerItem = attacker.item;
    }
    baseDamage = Math.min(997, baseDamage) + 2;
    if ((field.hasWeather('Sun') && move.type === 'Fire') ||
        (field.hasWeather('Rain') && move.type === 'Water')) {
        baseDamage = Math.floor(baseDamage * 1.5);
        description.weather = field.weather;
    }
    else if ((field.hasWeather('Sun') && move.type === 'Water') ||
        (field.hasWeather('Rain') && (move.type === 'Fire' || move.name === 'Solar Beam'))) {
        baseDamage = Math.floor(baseDamage / 2);
        description.weather = field.weather;
    }
    if (move.type === attacker.type1 || move.type === attacker.type2) {
        baseDamage = Math.floor(baseDamage * 1.5);
    }
    baseDamage = Math.floor(baseDamage * typeEffectiveness);
    if (move.name === 'Flail' || move.name === 'Reversal') {
        damage.push(baseDamage);
        return result;
    }
    for (var i = 217; i <= 255; i++) {
        damage[i - 217] = Math.floor((baseDamage * i) / 255);
    }
    return result;
}
exports.calculateGSC = calculateGSC;
//# sourceMappingURL=gen2.js.map