"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var util_1 = require("../util");
var stats_1 = require("../stats");
var EV_ITEMS = [
    'Macho Brace',
    'Power Anklet',
    'Power Band',
    'Power Belt',
    'Power Bracer',
    'Power Lens',
    'Power Weight',
];
function isGrounded(pokemon, field) {
    return (field.isGravity ||
        (!pokemon.hasType('Flying') &&
            !pokemon.hasAbility('Levitate') &&
            !pokemon.hasItem('Air Balloon')));
}
exports.isGrounded = isGrounded;
function getModifiedStat(stat, mod, gen) {
    var boostTable = [1, 1.5, 2, 2.5, 3, 3.5, 4];
    if (gen && gen.num < 3) {
        if (mod >= 0) {
            stat = Math.floor(stat * boostTable[mod]);
        }
        else {
            var numerators = [100, 66, 50, 40, 33, 28, 25];
            stat = Math.floor((stat * numerators[-mod]) / 100);
        }
        return Math.min(999, Math.max(1, stat));
    }
    if (mod >= 0) {
        stat = Math.floor(stat * boostTable[mod]);
    }
    else {
        stat = Math.floor(stat / boostTable[-mod]);
    }
    return stat;
}
exports.getModifiedStat = getModifiedStat;
function getFinalSpeed(gen, pokemon, field, side) {
    var weather = field.weather || '';
    var terrain = field.terrain;
    var speed = getModifiedStat(pokemon.rawStats.spe, pokemon.boosts.spe, gen);
    if (pokemon.hasItem('Choice Scarf')) {
        speed = pokeRound(speed * 1.5);
    }
    else if (pokemon.hasItem.apply(pokemon, __spreadArrays(['Iron Ball'], EV_ITEMS))) {
        speed = pokeRound(speed / 2);
    }
    else if (pokemon.hasItem('Quick Powder') && pokemon.named('Ditto')) {
        speed *= 2;
    }
    if ((pokemon.hasAbility('Chlorophyll') && weather.indexOf('Sun') !== -1) ||
        (pokemon.hasAbility('Sand Rush') && weather === 'Sand') ||
        (pokemon.hasAbility('Swift Swim') && weather.indexOf('Rain') !== -1) ||
        (pokemon.hasAbility('Slush Rush') && weather === 'Hail')) {
        speed *= 2;
    }
    else if (pokemon.hasAbility('Quick Feet') && !pokemon.hasStatus('Healthy')) {
        speed = pokeRound(speed * 1.5);
    }
    else if (pokemon.hasAbility('Slow Start') && pokemon.abilityOn) {
        speed = pokeRound(speed / 2);
    }
    else if ((pokemon.hasAbility('Surge Surfer') && terrain === 'Electric') ||
        (pokemon.hasAbility('Unburden') && pokemon.abilityOn)) {
        speed *= 2;
    }
    if (side.isTailwind)
        speed *= 2;
    if (pokemon.hasStatus('Paralyzed') && !pokemon.hasAbility('Quick Feet')) {
        speed = pokeRound(speed * (gen.num < 7 ? 0.25 : 0.5));
    }
    if (gen.num <= 2)
        speed = Math.min(999, speed);
    return Math.max(1, speed);
}
exports.getFinalSpeed = getFinalSpeed;
function pokeRound(num) {
    return num % 1 > 0.5 ? Math.ceil(num) : Math.floor(num);
}
exports.pokeRound = pokeRound;
function getMoveEffectiveness(gen, move, type, isGhostRevealed, isGravity) {
    if (isGhostRevealed && type === 'Ghost' && ['Normal', 'Fighting'].indexOf(move.type) !== -1) {
        return 1;
    }
    else if (isGravity && type === 'Flying' && move.type === 'Ground') {
        return 1;
    }
    else if (move.name === 'Freeze-Dry' && type === 'Water') {
        return 2;
    }
    else if (move.name === 'Flying Press') {
        return (gen.types.get('fighting').effectiveness[type] *
            gen.types.get('flying').effectiveness[type]);
    }
    else {
        return gen.types.get(util_1.toID(move.type)).effectiveness[type];
    }
}
exports.getMoveEffectiveness = getMoveEffectiveness;
function checkAirLock(pokemon, field) {
    if (pokemon.hasAbility('Air Lock', 'Cloud Nine')) {
        field.weather = undefined;
    }
}
exports.checkAirLock = checkAirLock;
function checkForecast(pokemon, weather) {
    if (pokemon.hasAbility('Forecast') && pokemon.named('Castform')) {
        switch (weather) {
            case 'Sun':
            case 'Harsh Sunshine':
                pokemon.type1 = 'Fire';
                break;
            case 'Rain':
            case 'Heavy Rain':
                pokemon.type1 = 'Water';
                break;
            case 'Hail':
                pokemon.type1 = 'Ice';
                break;
            default:
                pokemon.type1 = 'Normal';
        }
        pokemon.type2 = undefined;
    }
}
exports.checkForecast = checkForecast;
function checkKlutz(pokemon) {
    if (pokemon.hasAbility('Klutz') && !EV_ITEMS.includes(pokemon.item)) {
        pokemon.item = '';
    }
}
exports.checkKlutz = checkKlutz;
function checkIntimidate(source, target) {
    if (source.ability === 'Intimidate' &&
        source.abilityOn &&
        !target.hasAbility('Clear Body', 'White Smoke', 'Hyper Cutter', 'Full Metal Body')) {
        if (target.hasAbility('Contrary', 'Defiant')) {
            target.boosts.atk = Math.min(6, target.boosts.atk + 1);
        }
        else if (target.hasAbility('Simple')) {
            target.boosts.atk = Math.max(-6, target.boosts.atk - 2);
        }
        else {
            target.boosts.atk = Math.max(-6, target.boosts.atk - 1);
        }
    }
}
exports.checkIntimidate = checkIntimidate;
function checkDownload(source, target) {
    if (source.hasAbility('Download')) {
        if (target.stats.spd <= target.stats.def) {
            source.boosts.spa = Math.min(6, source.boosts.spa + 1);
        }
        else {
            source.boosts.atk = Math.min(6, source.boosts.atk + 1);
        }
    }
}
exports.checkDownload = checkDownload;
function checkIntrepidSword(source) {
    if (source.hasAbility('Intrepid Sword')) {
        source.boosts.atk = Math.min(6, source.boosts.atk + 1);
    }
}
exports.checkIntrepidSword = checkIntrepidSword;
function checkInfiltrator(pokemon, affectedSide) {
    if (pokemon.hasAbility('Infiltrator')) {
        affectedSide.isReflect = false;
        affectedSide.isLightScreen = false;
        affectedSide.isAuroraVeil = false;
    }
}
exports.checkInfiltrator = checkInfiltrator;
function checkSeedBoost(pokemon, field) {
    if (!pokemon.item)
        return;
    if (field.terrain && pokemon.item.indexOf('Seed') !== -1) {
        var terrainSeed = pokemon.item.substring(0, pokemon.item.indexOf(' '));
        if (terrainSeed === field.terrain) {
            if (terrainSeed === 'Grassy' || terrainSeed === 'Electric') {
                pokemon.boosts.def = pokemon.hasAbility('Contrary')
                    ? Math.max(-6, pokemon.boosts.def - 1)
                    : Math.min(6, pokemon.boosts.def + 1);
            }
            else {
                pokemon.boosts.spd = pokemon.hasAbility('Contrary')
                    ? Math.max(-6, pokemon.boosts.spd - 1)
                    : Math.min(6, pokemon.boosts.spd + 1);
            }
        }
    }
}
exports.checkSeedBoost = checkSeedBoost;
function chainMods(mods) {
    var M = 0x1000;
    for (var i = 0; i < mods.length; i++) {
        if (mods[i] !== 0x1000) {
            M = (M * mods[i] + 0x800) >> 12;
        }
    }
    return M;
}
exports.chainMods = chainMods;
function getBaseDamage(level, basePower, attack, defense) {
    return Math.floor(Math.floor((Math.floor((2 * level) / 5 + 2) * basePower * attack) / defense) / 50 + 2);
}
exports.getBaseDamage = getBaseDamage;
function getFinalDamage(baseAmount, i, effectiveness, isBurned, stabMod, finalMod, protect) {
    var damageAmount = Math.floor(pokeRound((Math.floor((baseAmount * (85 + i)) / 100) * stabMod) / 0x1000) * effectiveness);
    if (isBurned)
        damageAmount = Math.floor(damageAmount / 2);
    if (protect)
        damageAmount = pokeRound((damageAmount * 0x400) / 0x1000);
    return pokeRound(Math.max(1, (damageAmount * finalMod) / 0x1000));
}
exports.getFinalDamage = getFinalDamage;
function getWeightFactor(pokemon) {
    return pokemon.hasAbility('Heavy Metal') ? 2 : pokemon.hasAbility('Light Metal') ? 0.5 : 1;
}
exports.getWeightFactor = getWeightFactor;
function countBoosts(gen, boosts) {
    var sum = 0;
    for (var i = 1; i < stats_1.STATS[gen.num].length; i++) {
        var boost = boosts[stats_1.STATS[gen.num][i]];
        if (boost && boost > 0)
            sum += boost;
    }
    return sum;
}
exports.countBoosts = countBoosts;
function getEVDescriptionText(gen, pokemon, stat, natureName) {
    var nature = gen.natures.get(util_1.toID(natureName));
    return (pokemon.evs[stat] +
        (nature.plus === nature.minus
            ? ''
            : nature.plus === stat
                ? '+'
                : nature.minus === stat
                    ? '-'
                    : '') +
        ' ' +
        stats_1.Stats.displayStat(stat));
}
exports.getEVDescriptionText = getEVDescriptionText;
//# sourceMappingURL=util.js.map