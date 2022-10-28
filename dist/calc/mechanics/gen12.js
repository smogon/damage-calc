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
function calculateRBYGSC(gen, attacker, defender, move, field) {
    util_1.computeFinalStats(gen, attacker, defender, field, 'atk', 'def', 'spa', 'spd', 'spe');
    var desc = {
        attackerName: attacker.name,
        moveName: move.name,
        defenderName: defender.name
    };
    var result = new result_1.Result(gen, attacker, defender, move, field, 0, desc);
    if (move.category === 'Status') {
        return result;
    }
    if (field.defenderSide.isProtected) {
        desc.isProtected = true;
        return result;
    }
    if (gen.num === 1) {
        var fixedDamage = util_1.handleFixedDamageMoves(attacker, move);
        if (fixedDamage) {
            result.damage = fixedDamage;
            return result;
        }
    }
    var type1Effectiveness = util_1.getMoveEffectiveness(gen, move, defender.types[0], field.defenderSide.isForesight);
    var type2Effectiveness = defender.types[1]
        ? util_1.getMoveEffectiveness(gen, move, defender.types[1], field.defenderSide.isForesight)
        : 1;
    var typeEffectiveness = type1Effectiveness * type2Effectiveness;
    if (typeEffectiveness === 0) {
        return result;
    }
    if (gen.num === 2) {
        var fixedDamage = util_1.handleFixedDamageMoves(attacker, move);
        if (fixedDamage) {
            result.damage = fixedDamage;
            return result;
        }
    }
    if (move.hits > 1) {
        desc.hits = move.hits;
    }
    if (move.named('Flail', 'Reversal')) {
        move.isCrit = false;
        var p = Math.floor((48 * attacker.curHP()) / attacker.maxHP());
        move.bp = p <= 1 ? 200 : p <= 4 ? 150 : p <= 9 ? 100 : p <= 16 ? 80 : p <= 32 ? 40 : 20;
        desc.moveBP = move.bp;
    }
    else if (move.named('Present') && !move.bp) {
        move.bp = 40;
    }
    if (move.bp === 0) {
        return result;
    }
    var isPhysical = move.category === 'Physical';
    var attackStat = isPhysical ? 'atk' : 'spa';
    var defenseStat = isPhysical ? 'def' : 'spd';
    var at = attacker.stats[attackStat];
    var df = defender.stats[defenseStat];
    var ignoreMods = move.isCrit &&
        (gen.num === 1 ||
            (gen.num === 2 && attacker.boosts[attackStat] <= defender.boosts[defenseStat]));
    var lv = attacker.level;
    if (ignoreMods) {
        at = attacker.rawStats[attackStat];
        df = defender.rawStats[defenseStat];
        if (gen.num === 1) {
            lv *= 2;
            desc.isCritical = true;
        }
    }
    else {
        if (attacker.boosts[attackStat] !== 0)
            desc.attackBoost = attacker.boosts[attackStat];
        if (defender.boosts[defenseStat] !== 0)
            desc.defenseBoost = defender.boosts[defenseStat];
        if (isPhysical && attacker.hasStatus('brn')) {
            at = Math.floor(at / 2);
            desc.isBurned = true;
        }
    }
    if (move.named('Explosion', 'Self-Destruct')) {
        df = Math.floor(df / 2);
    }
    if (!ignoreMods) {
        if (isPhysical && field.defenderSide.isReflect) {
            df *= 2;
            desc.isReflect = true;
        }
        else if (!isPhysical && field.defenderSide.isLightScreen) {
            df *= 2;
            desc.isLightScreen = true;
        }
    }
    if ((attacker.named('Pikachu') && attacker.hasItem('Light Ball') && !isPhysical) ||
        (attacker.named('Cubone', 'Marowak') && attacker.hasItem('Thick Club') && isPhysical)) {
        at *= 2;
        desc.attackerItem = attacker.item;
    }
    if (at > 255 || df > 255) {
        at = Math.floor(at / 4) % 256;
        df = Math.floor(df / 4) % 256;
    }
    if (move.named('Present')) {
        var lookup = {
            Normal: 0, Fighting: 1, Flying: 2, Poison: 3, Ground: 4, Rock: 5, Bug: 7,
            Ghost: 8, Steel: 9, '???': 19, Fire: 20, Water: 21, Grass: 22, Electric: 23,
            Psychic: 24, Ice: 25, Dragon: 26, Dark: 27
        };
        at = 10;
        df = Math.max(lookup[attacker.types[1] ? attacker.types[1] : attacker.types[0]], 1);
        lv = Math.max(lookup[defender.types[1] ? defender.types[1] : defender.types[0]], 1);
    }
    if (defender.named('Ditto') && defender.hasItem('Metal Powder')) {
        df = Math.floor(df * 1.5);
        desc.defenderItem = defender.item;
    }
    var baseDamage = Math.floor(Math.floor((Math.floor((2 * lv) / 5 + 2) * Math.max(1, at) * move.bp) / Math.max(1, df)) / 50);
    if (gen.num === 2 && move.isCrit) {
        baseDamage *= 2;
        desc.isCritical = true;
    }
    if (move.named('Pursuit') && field.defenderSide.isSwitching === 'out') {
        baseDamage = Math.floor(baseDamage * 2);
        desc.isSwitching = 'out';
    }
    var itemBoostType = attacker.hasItem('Dragon Fang')
        ? undefined
        : items_1.getItemBoostType(attacker.hasItem('Dragon Scale') ? 'Dragon Fang' : attacker.item);
    if (move.hasType(itemBoostType)) {
        baseDamage = Math.floor(baseDamage * 1.1);
        desc.attackerItem = attacker.item;
    }
    baseDamage = Math.min(997, baseDamage) + 2;
    if ((field.hasWeather('Sun') && move.hasType('Fire')) ||
        (field.hasWeather('Rain') && move.hasType('Water'))) {
        baseDamage = Math.floor(baseDamage * 1.5);
        desc.weather = field.weather;
    }
    else if ((field.hasWeather('Sun') && move.hasType('Water')) ||
        (field.hasWeather('Rain') && (move.hasType('Fire') || move.named('Solar Beam')))) {
        baseDamage = Math.floor(baseDamage / 2);
        desc.weather = field.weather;
    }
    if (move.hasType.apply(move, __spread(attacker.types))) {
        baseDamage = Math.floor(baseDamage * 1.5);
    }
    baseDamage = Math.floor(baseDamage * typeEffectiveness);
    if (move.named('Flail', 'Reversal')) {
        result.damage = baseDamage;
        return result;
    }
    result.damage = [];
    for (var i = 217; i <= 255; i++) {
        result.damage[i - 217] = Math.floor((baseDamage * i) / 255);
    }
    return result;
}
exports.calculateRBYGSC = calculateRBYGSC;
//# sourceMappingURL=gen12.js.map