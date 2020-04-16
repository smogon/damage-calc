"use strict";
exports.__esModule = true;
var util_1 = require("./mechanics/util");
var util_2 = require("./util");
function display(gen, attacker, defender, move, field, damage, rawDesc, notation, err) {
    if (notation === void 0) { notation = '%'; }
    if (err === void 0) { err = true; }
    var minDamage = damage[0] * move.hits;
    var maxDamage = damage[damage.length - 1] * move.hits;
    var minDisplay = toDisplay(notation, minDamage, defender.maxHP());
    var maxDisplay = toDisplay(notation, maxDamage, defender.maxHP());
    var desc = buildDescription(rawDesc);
    var damageText = minDamage + "-" + maxDamage + " (" + minDisplay + " - " + maxDisplay + notation + ")";
    if (move.bp === 0)
        return desc + ": " + damageText;
    var koChanceText = getKOChance(gen, attacker, defender, move, field, damage, err).text;
    return koChanceText ? desc + ": " + damageText + " -- " + koChanceText : desc + ": " + damageText;
}
exports.display = display;
function displayMove(gen, attacker, defender, move, damage, notation) {
    if (notation === void 0) { notation = '%'; }
    var minDamage = damage[0] * move.hits;
    var maxDamage = damage[damage.length - 1] * move.hits;
    var minDisplay = toDisplay(notation, minDamage, defender.maxHP());
    var maxDisplay = toDisplay(notation, maxDamage, defender.maxHP());
    var recoveryText = getRecovery(gen, attacker, defender, move, damage, notation).text;
    var recoilText = getRecoil(gen, attacker, defender, move, damage, notation).text;
    return minDisplay + " - " + maxDisplay + notation + (recoveryText &&
        " (" + recoveryText + ")") + (recoilText && " (" + recoilText + ")");
}
exports.displayMove = displayMove;
function getRecovery(gen, attacker, defender, move, damage, notation) {
    if (notation === void 0) { notation = '%'; }
    var minDamage = damage[0] * move.hits;
    var maxDamage = damage[damage.length - 1] * move.hits;
    var recovery = [0, 0];
    var text = '';
    var ignoresShellBell = gen.num === 3 && (move.name === 'Doom Desire' || move.name === 'Future Sight');
    if (attacker.hasItem('Shell Bell') && !ignoresShellBell) {
        var max = defender.maxHP() / 8;
        recovery[0] += Math.min(minDamage / 8, max);
        recovery[1] += Math.min(maxDamage / 8, max);
    }
    if (move.givesHealth) {
        var max = defender.maxHP() * move.percentHealed;
        recovery[0] += Math.min(minDamage * move.percentHealed, max);
        recovery[1] += Math.min(maxDamage * move.percentHealed, max);
    }
    if (recovery[1] === 0)
        return { recovery: recovery, text: text };
    var minHealthRecovered = toDisplay(notation, recovery[0], attacker.maxHP());
    var maxHealthRecovered = toDisplay(notation, recovery[1], attacker.maxHP());
    recovery[0] = Math.floor(recovery[0]);
    recovery[1] = Math.floor(recovery[1]);
    text = minHealthRecovered + " - " + maxHealthRecovered + notation + " recovered";
    return { recovery: recovery, text: text };
}
exports.getRecovery = getRecovery;
function getRecoil(gen, attacker, defender, move, damage, notation) {
    if (notation === void 0) { notation = '%'; }
    var minDamage = damage[0] * move.hits;
    var maxDamage = damage[damage.length - 1] * move.hits;
    var recoil = [0, 0];
    var text = '';
    var damageOverflow = minDamage > defender.curHP || maxDamage > defender.curHP;
    if (typeof move.hasRecoil === 'number') {
        var minRecoilDamage = void 0, maxRecoilDamage = void 0;
        if (damageOverflow) {
            minRecoilDamage = toDisplay(notation, defender.curHP * move.hasRecoil, attacker.maxHP(), 100);
            maxRecoilDamage = toDisplay(notation, defender.curHP * move.hasRecoil, attacker.maxHP(), 100);
        }
        else {
            minRecoilDamage = toDisplay(notation, Math.min(minDamage, defender.curHP) * move.hasRecoil, attacker.maxHP(), 100);
            maxRecoilDamage = toDisplay(notation, Math.min(maxDamage, defender.curHP) * move.hasRecoil, attacker.maxHP(), 100);
        }
        if (!attacker.hasAbility('Rock Head')) {
            recoil = [minRecoilDamage, maxRecoilDamage];
            text = minRecoilDamage + " - " + maxRecoilDamage + notation + " recoil damage";
        }
    }
    else if (move.hasRecoil === 'crash') {
        var genMultiplier = gen.num === 2 ? 12.5 : gen.num >= 3 ? 50 : 1;
        var minRecoilDamage = void 0, maxRecoilDamage = void 0;
        if (damageOverflow && gen.num !== 2) {
            minRecoilDamage = toDisplay(notation, defender.curHP * genMultiplier, attacker.maxHP(), 100);
            maxRecoilDamage = toDisplay(notation, defender.curHP * genMultiplier, attacker.maxHP(), 100);
        }
        else {
            minRecoilDamage = toDisplay(notation, Math.min(minDamage, defender.maxHP()) * genMultiplier, attacker.maxHP(), 100);
            maxRecoilDamage = toDisplay(notation, Math.min(maxDamage, defender.maxHP()) * genMultiplier, attacker.maxHP(), 100);
        }
        recoil = [minRecoilDamage, maxRecoilDamage];
        switch (gen.num) {
            case 1:
                recoil = toDisplay(notation, 1, attacker.maxHP());
                text = '1hp damage on miss';
                break;
            case 2:
            case 3:
            case 4:
                if (defender.hasType('Ghost')) {
                    if (gen.num === 4) {
                        var gen4CrashDamage = Math.floor(((defender.maxHP() * 0.5) / attacker.maxHP()) * 100);
                        recoil = notation === '%' ? gen4CrashDamage : Math.floor((gen4CrashDamage / 100) * 48);
                        text = gen4CrashDamage + "% crash damage";
                    }
                    else {
                        recoil = 0;
                        text = 'no crash damage on Ghost types';
                    }
                }
                else {
                    text = minRecoilDamage + " - " + maxRecoilDamage + notation + " crash damage on miss";
                }
                break;
            case 4:
                text = minRecoilDamage + " - " + maxRecoilDamage + notation + " crash damage on miss";
                break;
            default:
                recoil = notation === '%' ? 24 : 50;
                text = '50% crash damage';
        }
    }
    else if (move.hasRecoil === 'Struggle') {
        recoil = notation === '%' ? 12 : 25;
        text = '25% struggle damage';
    }
    else if (move.hasRecoil) {
        recoil = notation === '%' ? 24 : 50;
        text = '50% recoil damage';
    }
    return { recoil: recoil, text: text };
}
exports.getRecoil = getRecoil;
function getKOChance(gen, attacker, defender, move, field, damage, err) {
    if (err === void 0) { err = true; }
    if (isNaN(damage[0])) {
        util_2.error(err, 'damage[0] must be a number.');
        return { chance: 0, n: 0, text: '' };
    }
    if (damage[damage.length - 1] === 0) {
        util_2.error(err, 'damage[damage.length - 1] === 0.');
        return { chance: 0, n: 0, text: '' };
    }
    if (move.usedTimes === undefined)
        move.usedTimes = 1;
    if (move.metronomeCount === undefined)
        move.metronomeCount = 1;
    if (damage[0] >= defender.maxHP() && move.usedTimes === 1 && move.metronomeCount === 1) {
        return { chance: 1, n: 1, text: 'guaranteed OHKO' };
    }
    var hazards = getHazards(gen, defender, field.defenderSide);
    var eot = getEndOfTurn(gen, attacker, defender, move, field);
    var toxicCounter = defender.status === 'Badly Poisoned' && defender.ability !== 'Magic Guard'
        ? defender.toxicCounter
        : 0;
    var qualifier = '';
    if (move.hits > 1) {
        qualifier = 'approx. ';
        damage = squashMultihit(gen, damage, move.hits, err);
    }
    var afterText = hazards.texts.length > 0 || eot.texts.length > 0
        ? ' after ' + serializeText(hazards.texts.concat(eot.texts))
        : '';
    if ((move.usedTimes === 1 && move.metronomeCount === 1) || move.isZ) {
        var chance = computeKOChance(damage, defender.curHP - hazards.damage, 0, 1, 1, defender.maxHP(), toxicCounter);
        if (chance === 1) {
            return { chance: chance, n: 1, text: "guaranteed OHKO" + afterText };
        }
        else if (chance > 0) {
            return {
                chance: chance,
                n: 1,
                text: qualifier + Math.round(chance * 1000) / 10 + ("% chance to OHKO" + afterText)
            };
        }
        for (var i = 2; i <= 4; i++) {
            var chance_1 = computeKOChance(damage, defender.curHP - hazards.damage, eot.damage, i, 1, defender.maxHP(), toxicCounter);
            if (chance_1 === 1) {
                return { chance: chance_1, n: i, text: "guaranteed " + i + "HKO" + afterText };
            }
            else if (chance_1 > 0) {
                return {
                    chance: chance_1,
                    n: i,
                    text: qualifier + Math.round(chance_1 * 1000) / 10 + ("% chance to " + i + "HKO" + afterText)
                };
            }
        }
        for (var i = 5; i <= 9; i++) {
            if (predictTotal(damage[0], eot.damage, i, 1, toxicCounter, defender.maxHP()) >=
                defender.curHP - hazards.damage) {
                return { chance: 1, n: i, text: "guaranteed " + i + "HKO" + afterText };
            }
            else if (predictTotal(damage[damage.length - 1], eot.damage, i, 1, toxicCounter, defender.maxHP()) >=
                defender.curHP - hazards.damage) {
                return { n: i, text: "possible " + i + "HKO" + afterText };
            }
        }
    }
    else {
        var chance = computeKOChance(damage, defender.maxHP() - hazards.damage, eot.damage, move.hits || 1, move.usedTimes || 1, defender.maxHP(), toxicCounter);
        if (chance === 1) {
            return {
                chance: chance,
                n: move.usedTimes,
                text: "guaranteed KO in " + move.usedTimes + " turns" + afterText
            };
        }
        else if (chance > 0) {
            return {
                chance: chance,
                n: move.usedTimes,
                text: qualifier +
                    Math.round(chance * 1000) / 10 +
                    ("% chance to " + move.usedTimes + "HKO" + afterText)
            };
        }
        if (predictTotal(damage[0], eot.damage, move.hits, move.usedTimes, toxicCounter, defender.maxHP()) >=
            defender.curHP - hazards.damage) {
            return {
                chance: 1,
                n: move.usedTimes,
                text: "guaranteed KO in " + move.usedTimes + " turns" + afterText
            };
        }
        else if (predictTotal(damage[damage.length - 1], eot.damage, move.hits, move.usedTimes, toxicCounter, defender.maxHP()) >=
            defender.curHP - hazards.damage) {
            return { n: move.usedTimes, text: "possible KO in " + move.usedTimes + " turns" + afterText };
        }
        return { n: move.usedTimes, text: 'not a KO' };
    }
    return { chance: 0, n: 0, text: '' };
}
exports.getKOChance = getKOChance;
function getHazards(gen, defender, defenderSide) {
    var damage = 0;
    var texts = [];
    if (defender.hasItem('Heavy-Duty Boots')) {
        return { damage: damage, texts: texts };
    }
    if (defenderSide.isSR && !defender.hasAbility('Magic Guard', 'Mountaineer')) {
        var rockType = gen.types.get('rock');
        var effectiveness = rockType.effectiveness[defender.type1] *
            (defender.type2 ? rockType.effectiveness[defender.type2] : 1);
        damage += Math.floor((effectiveness * defender.maxHP()) / 8);
        texts.push('Stealth Rock');
    }
    if (defenderSide.steelsurge && !defender.hasAbility('Magic Guard', 'Mountaineer')) {
        var steelType = gen.types.get('steel');
        var effectiveness = steelType.effectiveness[defender.type1] *
            (defender.type2 ? steelType.effectiveness[defender.type2] : 1);
        damage += Math.floor((effectiveness * defender.maxHP()) / 8);
        texts.push('Steelsurge');
    }
    if (!defender.hasType('Flying') &&
        !defender.hasAbility('Magic Guard', 'Levitate') &&
        !defender.hasItem('Air Balloon')) {
        if (defenderSide.spikes === 1) {
            damage += Math.floor(defender.maxHP() / 8);
            if (gen.num === 2) {
                texts.push('Spikes');
            }
            else {
                texts.push('1 layer of Spikes');
            }
        }
        else if (defenderSide.spikes === 2) {
            damage += Math.floor(defender.maxHP() / 6);
            texts.push('2 layers of Spikes');
        }
        else if (defenderSide.spikes === 3) {
            damage += Math.floor(defender.maxHP() / 4);
            texts.push('3 layers of Spikes');
        }
    }
    if (isNaN(damage)) {
        damage = 0;
    }
    return { damage: damage, texts: texts };
}
function getEndOfTurn(gen, attacker, defender, move, field) {
    var damage = 0;
    var texts = [];
    if (field.hasWeather('Sun', 'Harsh Sunshine')) {
        if (defender.hasAbility('Dry Skin', 'Solar Power')) {
            damage -= Math.floor(defender.maxHP() / 8);
            texts.push(defender.ability + ' damage');
        }
    }
    else if (field.hasWeather('Rain', 'Heavy Rain')) {
        if (defender.hasAbility('Dry Skin')) {
            damage += Math.floor(defender.maxHP() / 8);
            texts.push('Dry Skin recovery');
        }
        else if (defender.hasAbility('Rain Dish')) {
            damage += Math.floor(defender.maxHP() / 16);
            texts.push('Rain Dish recovery');
        }
    }
    else if (field.hasWeather('Sand')) {
        if (!defender.hasType('Rock', 'Ground', 'Steel') &&
            !defender.hasAbility('Magic Guard', 'Overcoat', 'Sand Force', 'Sand Rush', 'Sand Veil') &&
            !defender.hasItem('Safety Goggles')) {
            damage -= Math.floor(defender.maxHP() / (gen.num === 2 ? 8 : 16));
            texts.push('sandstorm damage');
        }
    }
    else if (field.hasWeather('Hail')) {
        if (defender.hasAbility('Ice Body')) {
            damage += Math.floor(defender.maxHP() / 16);
            texts.push('Ice Body recovery');
        }
        else if (!defender.hasType('Ice') &&
            !defender.hasAbility('Magic Guard', 'Overcoat', 'Snow Cloak') &&
            !defender.hasItem('Safety Goggles')) {
            damage -= Math.floor(defender.maxHP() / 16);
            texts.push('hail damage');
        }
    }
    var loseItem = move.name === 'Knock Off' && !defender.hasAbility('Sticky Hold');
    if (defender.item === 'Leftovers' && !loseItem) {
        damage += Math.floor(defender.maxHP() / 16);
        texts.push('Leftovers recovery');
    }
    else if (defender.hasItem('Black Sludge') && !loseItem) {
        if (defender.hasType('Poison')) {
            damage += Math.floor(defender.maxHP() / 16);
            texts.push('Black Sludge recovery');
        }
        else if (!defender.hasAbility('Magic Guard', 'Klutz')) {
            damage -= Math.floor(defender.maxHP() / 8);
            texts.push('Black Sludge damage');
        }
    }
    else if (defender.hasItem('Sticky Barb')) {
        damage -= Math.floor(defender.maxHP() / 8);
        texts.push('Sticky Barb damage');
    }
    if (field.defenderSide.isSeeded) {
        if (!defender.hasAbility('Magic Guard')) {
            damage -= Math.floor(defender.maxHP() / (gen.num >= 2 ? 8 : 16));
            texts.push('Leech Seed damage');
        }
    }
    if (field.attackerSide.isSeeded && !attacker.hasAbility('Magic Guard')) {
        if (attacker.hasAbility('Liquid Ooze')) {
            damage -= Math.floor(attacker.maxHP() / (gen.num >= 2 ? 8 : 16));
            texts.push('Liquid Ooze damage');
        }
        else {
            damage += Math.floor(attacker.maxHP() / (gen.num >= 2 ? 8 : 16));
            texts.push('Leech Seed recovery');
        }
    }
    if (field.terrain === 'Grassy') {
        if (util_1.isGrounded(defender, field)) {
            damage += Math.floor(defender.maxHP() / 16);
            texts.push('Grassy Terrain recovery');
        }
    }
    if (defender.hasStatus('Poisoned')) {
        if (defender.hasAbility('Poison Heal')) {
            damage += Math.floor(defender.maxHP() / 8);
            texts.push('Poison Heal');
        }
        else if (!defender.hasAbility('Magic Guard')) {
            damage -= Math.floor(defender.maxHP() / (gen.num === 1 ? 16 : 8));
            texts.push('poison damage');
        }
    }
    else if (defender.hasStatus('Badly Poisoned')) {
        if (defender.hasAbility('Poison Heal')) {
            damage += Math.floor(defender.maxHP() / 8);
            texts.push('Poison Heal');
        }
        else if (!defender.hasAbility('Magic Guard')) {
            texts.push('toxic damage');
        }
    }
    else if (defender.hasStatus('Burned')) {
        if (defender.hasAbility('Heatproof')) {
            damage -= Math.floor(defender.maxHP() / (gen.num > 6 ? 32 : 16));
            texts.push('reduced burn damage');
        }
        else if (!defender.hasAbility('Magic Guard')) {
            damage -= Math.floor(defender.maxHP() / (gen.num === 1 || gen.num > 6 ? 16 : 8));
            texts.push('burn damage');
        }
    }
    else if ((defender.hasStatus('Asleep') || defender.hasAbility('Comatose')) &&
        attacker.hasAbility('isBadDreams') &&
        !defender.hasAbility('Magic Guard')) {
        damage -= Math.floor(defender.maxHP() / 8);
        texts.push('Bad Dreams');
    }
    if ([
        'Bind',
        'Clamp',
        'Fire Spin',
        'Infestation',
        'Magma Storm',
        'Sand Tomb',
        'Whirlpool',
        'Wrap',
    ].indexOf(move.name) !== -1 &&
        !defender.hasAbility('Magic Guard')) {
        if (attacker.hasItem('Binding Band')) {
            damage -= gen.num > 5 ? Math.floor(defender.maxHP() / 6) : Math.floor(defender.maxHP() / 8);
            texts.push('trapping damage');
        }
        else {
            damage -= gen.num > 5 ? Math.floor(defender.maxHP() / 8) : Math.floor(defender.maxHP() / 16);
            texts.push('trapping damage');
        }
    }
    if ((move.name === 'Fire Pledge (Grass Pledge Boosted)' ||
        move.name === 'Grass Pledge (Fire Pledge Boosted)') &&
        !defender.hasType('Fire') &&
        !defender.hasAbility('Magic Guard')) {
        damage -= Math.floor(defender.maxHP() / 8);
        texts.push('Sea of Fire damage');
    }
    return { damage: damage, texts: texts };
}
function computeKOChance(damage, hp, eot, hits, moveHits, maxHP, toxicCounter) {
    var n = damage.length;
    var minDamage = damage[0];
    var maxDamage = damage[n - 1];
    if (hits === 1) {
        for (var i = 0; i < n; i++) {
            if (damage[i] >= hp) {
                return (n - i) / n;
            }
        }
    }
    if (predictTotal(maxDamage, eot, hits, moveHits, toxicCounter, maxHP) < hp) {
        return 0;
    }
    else if (predictTotal(minDamage, eot, hits, moveHits, toxicCounter, maxHP) >= hp) {
        return 1;
    }
    var toxicDamage = 0;
    if (toxicCounter > 0) {
        toxicDamage = Math.floor((toxicCounter * maxHP) / 16);
        toxicCounter++;
    }
    var sum = 0;
    for (var i = 0; i < n; i++) {
        var c = computeKOChance(damage, hp - damage[i] + eot - toxicDamage, eot, hits - 1, moveHits, maxHP, toxicCounter);
        if (c === 1) {
            sum += n - i;
            break;
        }
        else {
            sum += c;
        }
    }
    return sum / n;
}
function predictTotal(damage, eot, hits, moveHits, toxicCounter, maxHP) {
    var toxicDamage = 0;
    if (toxicCounter > 0) {
        for (var i = 0; i < hits - 1; i++) {
            toxicDamage += Math.floor(((toxicCounter + i) * maxHP) / 16);
        }
    }
    var total = 0;
    if (hits > 1 && moveHits === 1) {
        total = damage * hits - eot * (hits - 1) + toxicDamage;
    }
    else {
        total = damage - eot * (hits - 1) + toxicDamage;
    }
    return total;
}
function squashMultihit(gen, d, hits, err) {
    if (err === void 0) { err = true; }
    if (d.length === 1) {
        return [d[0] * hits];
    }
    else if (gen.num === 1) {
        var r = [];
        for (var i = 0; i < d.length; i++) {
            r[i] = d[i] * hits;
        }
        return r;
    }
    else if (d.length === 16) {
        switch (hits) {
            case 2:
                return [
                    2 * d[0],
                    d[2] + d[3],
                    d[4] + d[4],
                    d[4] + d[5],
                    d[5] + d[6],
                    d[6] + d[6],
                    d[6] + d[7],
                    d[7] + d[7],
                    d[8] + d[8],
                    d[8] + d[9],
                    d[9] + d[9],
                    d[9] + d[10],
                    d[10] + d[11],
                    d[11] + d[11],
                    d[12] + d[13],
                    2 * d[15],
                ];
            case 3:
                return [
                    3 * d[0],
                    d[3] + d[3] + d[4],
                    d[4] + d[4] + d[5],
                    d[5] + d[5] + d[6],
                    d[5] + d[6] + d[6],
                    d[6] + d[6] + d[7],
                    d[6] + d[7] + d[7],
                    d[7] + d[7] + d[8],
                    d[7] + d[8] + d[8],
                    d[8] + d[8] + d[9],
                    d[8] + d[9] + d[9],
                    d[9] + d[9] + d[10],
                    d[9] + d[10] + d[10],
                    d[10] + d[11] + d[11],
                    d[11] + d[12] + d[12],
                    3 * d[15],
                ];
            case 4:
                return [
                    4 * d[0],
                    4 * d[4],
                    d[4] + d[5] + d[5] + d[5],
                    d[5] + d[5] + d[6] + d[6],
                    4 * d[6],
                    d[6] + d[6] + d[7] + d[7],
                    4 * d[7],
                    d[7] + d[7] + d[7] + d[8],
                    d[7] + d[8] + d[8] + d[8],
                    4 * d[8],
                    d[8] + d[8] + d[9] + d[9],
                    4 * d[9],
                    d[9] + d[9] + d[10] + d[10],
                    d[10] + d[10] + d[10] + d[11],
                    4 * d[11],
                    4 * d[15],
                ];
            case 5:
                return [
                    5 * d[0],
                    d[4] + d[4] + d[4] + d[5] + d[5],
                    d[5] + d[5] + d[5] + d[5] + d[6],
                    d[5] + d[6] + d[6] + d[6] + d[6],
                    d[6] + d[6] + d[6] + d[6] + d[7],
                    d[6] + d[6] + d[7] + d[7] + d[7],
                    5 * d[7],
                    d[7] + d[7] + d[7] + d[8] + d[8],
                    d[7] + d[7] + d[8] + d[8] + d[8],
                    5 * d[8],
                    d[8] + d[8] + d[8] + d[9] + d[9],
                    d[8] + d[9] + d[9] + d[9] + d[9],
                    d[9] + d[9] + d[9] + d[9] + d[10],
                    d[9] + d[10] + d[10] + d[10] + d[10],
                    d[10] + d[10] + d[11] + d[11] + d[11],
                    5 * d[15],
                ];
            default:
                util_2.error(err, "Unexpected # of hits: " + hits);
                return d;
        }
    }
    else if (d.length === 39) {
        switch (hits) {
            case 2:
                return [
                    2 * d[0],
                    2 * d[7],
                    2 * d[10],
                    2 * d[12],
                    2 * d[14],
                    d[15] + d[16],
                    2 * d[17],
                    d[18] + d[19],
                    d[19] + d[20],
                    2 * d[21],
                    d[22] + d[23],
                    2 * d[24],
                    2 * d[26],
                    2 * d[28],
                    2 * d[31],
                    2 * d[38],
                ];
            case 3:
                return [
                    3 * d[0],
                    3 * d[9],
                    3 * d[12],
                    3 * d[13],
                    3 * d[15],
                    3 * d[16],
                    3 * d[17],
                    3 * d[18],
                    3 * d[20],
                    3 * d[21],
                    3 * d[22],
                    3 * d[23],
                    3 * d[25],
                    3 * d[26],
                    3 * d[29],
                    3 * d[38],
                ];
            case 4:
                return [
                    4 * d[0],
                    2 * d[10] + 2 * d[11],
                    4 * d[13],
                    4 * d[14],
                    2 * d[15] + 2 * d[16],
                    2 * d[16] + 2 * d[17],
                    2 * d[17] + 2 * d[18],
                    2 * d[18] + 2 * d[19],
                    2 * d[19] + 2 * d[20],
                    2 * d[20] + 2 * d[21],
                    2 * d[21] + 2 * d[22],
                    2 * d[22] + 2 * d[23],
                    4 * d[24],
                    4 * d[25],
                    2 * d[27] + 2 * d[28],
                    4 * d[38],
                ];
            case 5:
                return [
                    5 * d[0],
                    5 * d[11],
                    5 * d[13],
                    5 * d[15],
                    5 * d[16],
                    5 * d[17],
                    5 * d[18],
                    5 * d[19],
                    5 * d[19],
                    5 * d[20],
                    5 * d[21],
                    5 * d[22],
                    5 * d[23],
                    5 * d[25],
                    5 * d[27],
                    5 * d[38],
                ];
            default:
                util_2.error(err, "Unexpected # of hits: " + hits);
                return d;
        }
    }
    else {
        util_2.error(err, "Unexpected # of possible damage values: " + d.length);
        return d;
    }
}
function buildDescription(description) {
    var output = '';
    if (description.attackBoost) {
        if (description.attackBoost > 0) {
            output += '+';
        }
        output += description.attackBoost + ' ';
    }
    output = appendIfSet(output, description.attackEVs);
    output = appendIfSet(output, description.attackerItem);
    output = appendIfSet(output, description.attackerAbility);
    output = appendIfSet(output, description.rivalry);
    if (description.isBurned) {
        output += 'burned ';
    }
    output += description.attackerName + ' ';
    if (description.isHelpingHand) {
        output += 'Helping Hand ';
    }
    if (description.isBattery) {
        output += ' Battery boosted ';
    }
    if (description.isSwitching) {
        output += ' switching boosted ';
    }
    output += description.moveName + ' ';
    if (description.moveBP && description.moveType) {
        output += '(' + description.moveBP + ' BP ' + description.moveType + ') ';
    }
    else if (description.moveBP) {
        output += '(' + description.moveBP + ' BP) ';
    }
    else if (description.moveType) {
        output += '(' + description.moveType + ') ';
    }
    if (description.hits) {
        output += '(' + description.hits + ' hits) ';
    }
    output = appendIfSet(output, description.moveTurns);
    output += 'vs. ';
    if (description.defenseBoost) {
        if (description.defenseBoost > 0) {
            output += '+';
        }
        output += description.defenseBoost + ' ';
    }
    output = appendIfSet(output, description.HPEVs);
    if (description.defenseEVs) {
        output += '/ ' + description.defenseEVs + ' ';
    }
    output = appendIfSet(output, description.defenderItem);
    output = appendIfSet(output, description.defenderAbility);
    if (description.isProtected) {
        output += 'protected ';
    }
    if (description.isDefenderDynamaxed) {
        output += 'Dynamax ';
    }
    output += description.defenderName;
    if (description.weather && description.terrain) {
    }
    else if (description.weather) {
        output += ' in ' + description.weather;
    }
    else if (description.terrain) {
        output += ' in ' + description.terrain + ' Terrain';
    }
    if (description.isReflect) {
        output += ' through Reflect';
    }
    else if (description.isLightScreen) {
        output += ' through Light Screen';
    }
    if (description.isFriendGuard) {
        output += " with an ally's Friend Guard";
    }
    if (description.isAuroraVeil) {
        output += " with an ally's Aurora Veil";
    }
    if (description.isCritical) {
        output += ' on a critical hit';
    }
    return output;
}
function serializeText(arr) {
    if (arr.length === 0) {
        return '';
    }
    else if (arr.length === 1) {
        return arr[0];
    }
    else if (arr.length === 2) {
        return arr[0] + ' and ' + arr[1];
    }
    else {
        var text = '';
        for (var i = 0; i < arr.length - 1; i++) {
            text += arr[i] + ', ';
        }
        return text + 'and ' + arr[arr.length - 1];
    }
}
function appendIfSet(str, toAppend) {
    return toAppend ? "" + str + toAppend + " " : str;
}
function toDisplay(notation, a, b, f) {
    if (f === void 0) { f = 1; }
    return notation === '%' ? Math.floor((a * (1000 / f)) / b) / 10 : Math.floor((a * (48 / f)) / b);
}
//# sourceMappingURL=desc.js.map