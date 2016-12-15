﻿function getKOChanceText(damage, defender, field, hits, isBadDreams) {
    if (isNaN(damage[0])) {
        return 'something broke; please tell Austin or Marty';
    }
    if (damage[damage.length-1] === 0) {
        return 'aim for the horn next time';
    }
    if (damage[0] >= defender.maxHP) {
        return 'guaranteed OHKO';
    }

    var hazards = 0;
    var hazardText = [];
    if (field.isSR && defender.ability !== 'Magic Guard') {
        var effectiveness = typeChart['Rock'][defender.type1] * (defender.type2 ? typeChart['Rock'][defender.type2] : 1);
        hazards += Math.floor(effectiveness * defender.maxHP / 8);
        hazardText.push('Stealth Rock');
    }
    if ([defender.type1, defender.type2].indexOf('Flying') === -1 &&
            ['Magic Guard', 'Levitate'].indexOf(defender.ability) === -1 && defender.item !== 'Air Balloon') {
        if (field.spikes === 1) {
            hazards += Math.floor(defender.maxHP / 8);
            if (gen === 2) {
                hazardText.push('Spikes');
            } else {
                hazardText.push('1 layer of Spikes');
            }
        } else if (field.spikes === 2) {
            hazards += Math.floor(defender.maxHP / 6);
            hazardText.push('2 layers of Spikes');
        } else if (field.spikes === 3) {
            hazards += Math.floor(defender.maxHP / 4);
            hazardText.push('3 layers of Spikes');
        }
    }
    if (isNaN(hazards)) {
        hazards = 0;
    }

    var eot = 0;
    var eotText = [];
    if (field.weather === 'Sun' || field.weather === "Harsh Sunshine") {
        if (defender.ability === 'Dry Skin' || defender.ability === 'Solar Power') {
            eot -= Math.floor(defender.maxHP / 8);
            eotText.push(defender.ability + ' damage');
        }
    } else if (field.weather === 'Rain' || field.weather === "Heavy Rain") {
        if (defender.ability === 'Dry Skin') {
            eot += Math.floor(defender.maxHP / 8);
            eotText.push('Dry Skin recovery');
        } else if (defender.ability === 'Rain Dish') {
            eot += Math.floor(defender.maxHP / 16);
            eotText.push('Rain Dish recovery');
        }
    } else if (field.weather === 'Sand') {
        if (['Rock', 'Ground', 'Steel'].indexOf(defender.type1) === -1 &&
                ['Rock', 'Ground', 'Steel'].indexOf(defender.type2) === -1 &&
                ['Magic Guard', 'Overcoat', 'Sand Force', 'Sand Rush', 'Sand Veil'].indexOf(defender.ability) === -1 &&
                defender.item !== 'Safety Goggles') {
            eot -= Math.floor(defender.maxHP / 16);
            eotText.push('sandstorm damage');
        }
    } else if (field.weather === 'Hail') {
        if (defender.ability === 'Ice Body') {
            eot += Math.floor(defender.maxHP / 16);
            eotText.push('Ice Body recovery');
        } else if (defender.type1 !== 'Ice' && defender.type2 !== 'Ice' &&
                ['Magic Guard', 'Overcoat', 'Snow Cloak'].indexOf(defender.ability) === -1 &&
                defender.item !== 'Safety Goggles') {
            eot -= Math.floor(defender.maxHP / 16);
            eotText.push('hail damage');
        }
    }
    if (defender.item === 'Leftovers') {
        eot += Math.floor(defender.maxHP / 16);
        eotText.push('Leftovers recovery');
    } else if (defender.item === 'Black Sludge') {
        if (defender.type1 === 'Poison' || defender.type2 === 'Poison') {
            eot += Math.floor(defender.maxHP / 16);
            eotText.push('Black Sludge recovery');
        } else if (defender.ability !== 'Magic Guard' && defender.ability !== 'Klutz') {
            eot -= Math.floor(defender.maxHP / 8);
            eotText.push('Black Sludge damage');
        }
    }
    if (field.terrain === "Grassy") {
        if (field.isGravity || (defender.type1 !== "Flying" && defender.type2 !== "Flying" &&
                defender.item !== "Air Balloon" && defender.ability !== "Levitate")) {
            eot += Math.floor(defender.maxHP / 16);
            eotText.push('Grassy Terrain recovery');
        }
    }
    var toxicCounter = 0;
    if (defender.status === 'Poisoned') {
        if (defender.ability === 'Poison Heal') {
            eot += Math.floor(defender.maxHP / 8);
            eotText.push('Poison Heal');
        } else if (defender.ability !== 'Magic Guard') {
            eot -= Math.floor(defender.maxHP / 8);
            eotText.push('poison damage');
        }
    } else if (defender.status === 'Badly Poisoned') {
        if (defender.ability === 'Poison Heal') {
            eot += Math.floor(defender.maxHP / 8);
            eotText.push('Poison Heal');
        } else if (defender.ability !== 'Magic Guard') {
            eotText.push('toxic damage');
            toxicCounter = defender.toxicCounter;
        }
    } else if (defender.status === 'Burned') {
        if (defender.ability === 'Heatproof') {
            eot -= gen > 6 ? Math.floor(defender.maxHP / 32) : Math.floor(defender.maxHP / 16);
            eotText.push('reduced burn damage');
        } else if (defender.ability !== 'Magic Guard') {
            eot -= gen > 6 ? Math.floor(defender.maxHP / 16) : Math.floor(defender.maxHP / 8);
            eotText.push('burn damage');
        }
    } else if ((defender.status === 'Asleep' || defender.ability === 'Comatose') && isBadDreams && defender.ability !== 'Magic Guard') {
        eot -= Math.floor(defender.maxHP / 8);
        eotText.push('Bad Dreams');
    }

    // multi-hit moves have too many possibilities for brute-forcing to work, so reduce it to an approximate distribution
    var qualifier = '';
    if (hits > 1) {
        qualifier = 'approx. ';
        damage = squashMultihit(damage, hits);
    }

    var c = getKOChance(damage, defender.maxHP - hazards, 0, 1, defender.maxHP, toxicCounter);
    var afterText = hazardText.length > 0 ? ' after ' + serializeText(hazardText) : '';
    if (c === 1) {
        return 'guaranteed OHKO' + afterText;
    } else if (c > 0) {
        return qualifier + Math.round(c * 1000) / 10 + '% chance to OHKO' + afterText;
    }

    afterText = hazardText.length > 0 || eotText.length > 0 ? ' after ' + serializeText(hazardText.concat(eotText)) : '';
    var i;
    for (i = 2; i <= 4; i++) {
        c = getKOChance(damage, defender.maxHP - hazards, eot, i, defender.maxHP, toxicCounter);
        if (c === 1) {
            return 'guaranteed ' + i + 'HKO' + afterText;
        } else if (c > 0) {
            return qualifier + Math.round(c * 1000) / 10 + '% chance to ' + i + 'HKO' + afterText;
        }
    }

    for (i = 5; i <= 9; i++) {
        if (predictTotal(damage[0], eot, i, toxicCounter, defender.maxHP) >= defender.maxHP - hazards) {
            return 'guaranteed ' + i + 'HKO' + afterText;
        } else if (predictTotal(damage[damage.length-1], eot, i, toxicCounter, defender.maxHP) >= defender.maxHP - hazards) {
            return 'possible ' + i + 'HKO' + afterText;
        }
    }

    return 'possibly the worst move ever';
}

function getKOChance(damage, hp, eot, hits, maxHP, toxicCounter) {
    var n = damage.length;
    var minDamage = damage[0];
    var maxDamage = damage[n-1];
    var i;
    if (hits === 1) {
        if (maxDamage < hp) {
            return 0;
        }
        for (i = 0; i < n; i++) {
            if (damage[i] >= hp) {
                return (n-i)/n;
            }
        }
    }
    if (predictTotal(maxDamage, eot, hits, toxicCounter, maxHP) < hp) {
        return 0;
    } else if (predictTotal(minDamage, eot, hits, toxicCounter, maxHP) >= hp) {
        return 1;
    }
    var toxicDamage = 0;
    if (toxicCounter > 0) {
        toxicDamage = Math.floor(toxicCounter * maxHP / 16);
        toxicCounter++;
    }
    var sum = 0;
    for (i = 0; i < n; i++) {
        var c = getKOChance(damage, hp - damage[i] + eot - toxicDamage, eot, hits - 1, maxHP, toxicCounter);
        if (c === 1) {
            sum += (n-i);
            break;
        } else {
            sum += c;
        }
    }
    return sum/n;
}

function predictTotal(damage, eot, hits, toxicCounter, maxHP) {
    var toxicDamage = 0;
    if (toxicCounter > 0) {
        for (var i = 0; i < hits-1; i++) {
            toxicDamage += Math.floor((toxicCounter + i) * maxHP / 16);
        }
    }
    var total = (damage * hits) - (eot * (hits - 1)) + toxicDamage;
    return total;
}

function squashMultihit(d, hits) {
    if (d.length === 1) {
        return [d[0] * hits];
    } else if (gen === 1) {
        var r = [];
        for (var i = 0; i < d.length; i++) {
            r[i] = d[i] * hits;
        }
        return r;
    } else if (d.length === 16) {
        switch (hits) {
            case 2:
                return [
                    2*d[0], d[2]+d[3], d[4]+d[4], d[4]+d[5],
                    d[5]+d[6], d[6]+d[6], d[6]+d[7], d[7]+d[7],
                    d[8]+d[8], d[8]+d[9], d[9]+d[9], d[9]+d[10],
                    d[10]+d[11], d[11]+d[11], d[12]+d[13], 2*d[15]
                ];
            case 3:
                return [
                    3*d[0], d[3]+d[3]+d[4], d[4]+d[4]+d[5], d[5]+d[5]+d[6],
                    d[5]+d[6]+d[6], d[6]+d[6]+d[7], d[6]+d[7]+d[7], d[7]+d[7]+d[8],
                    d[7]+d[8]+d[8], d[8]+d[8]+d[9], d[8]+d[9]+d[9], d[9]+d[9]+d[10],
                    d[9]+d[10]+d[10], d[10]+d[11]+d[11], d[11]+d[12]+d[12], 3*d[15]
                ];
            case 4:
                return [
                    4*d[0], 4*d[4], d[4]+d[5]+d[5]+d[5], d[5]+d[5]+d[6]+d[6],
                    4*d[6], d[6]+d[6]+d[7]+d[7], 4*d[7], d[7]+d[7]+d[7]+d[8],
                    d[7]+d[8]+d[8]+d[8], 4*d[8], d[8]+d[8]+d[9]+d[9], 4*d[9],
                    d[9]+d[9]+d[10]+d[10], d[10]+d[10]+d[10]+d[11], 4*d[11], 4*d[15]
                ];
            case 5:
                return [
                    5*d[0], d[4]+d[4]+d[4]+d[5]+d[5], d[5]+d[5]+d[5]+d[5]+d[6], d[5]+d[6]+d[6]+d[6]+d[6],
                    d[6]+d[6]+d[6]+d[6]+d[7], d[6]+d[6]+d[7]+d[7]+d[7], 5*d[7], d[7]+d[7]+d[7]+d[8]+d[8],
                    d[7]+d[7]+d[8]+d[8]+d[8], 5*d[8], d[8]+d[8]+d[8]+d[9]+d[9], d[8]+d[9]+d[9]+d[9]+d[9],
                    d[9]+d[9]+d[9]+d[9]+d[10], d[9]+d[10]+d[10]+d[10]+d[10], d[10]+d[10]+d[11]+d[11]+d[11], 5*d[15]
                ];
            default:
                console.log("Unexpected # of hits: " + hits);
                return d;
        }
    } else if (d.length === 39) {
        switch (hits) {
            case 2:
                return [
                    2*d[0], 2*d[7], 2*d[10], 2*d[12],
                    2*d[14], d[15]+d[16], 2*d[17], d[18]+d[19],
                    d[19]+d[20], 2*d[21], d[22]+d[23], 2*d[24],
                    2*d[26], 2*d[28], 2*d[31], 2*d[38]
                ];
            case 3:
                return [
                    3*d[0], 3*d[9], 3*d[12], 3*d[13],
                    3*d[15], 3*d[16], 3*d[17], 3*d[18],
                    3*d[20], 3*d[21], 3*d[22], 3*d[23],
                    3*d[25], 3*d[26], 3*d[29], 3*d[38]
                ];
            case 4:
                return [
                    4*d[0], 2*d[10]+2*d[11], 4*d[13], 4*d[14],
                    2*d[15]+2*d[16], 2*d[16]+2*d[17], 2*d[17]+2*d[18], 2*d[18]+2*d[19],
                    2*d[19]+2*d[20], 2*d[20]+2*d[21], 2*d[21]+2*d[22], 2*d[22]+2*d[23],
                    4*d[24], 4*d[25], 2*d[27]+2*d[28], 4*d[38]
                ];
            case 5:
                return [
                    5*d[0], 5*d[11], 5*d[13], 5*d[15],
                    5*d[16], 5*d[17], 5*d[18], 5*d[19],
                    5*d[19], 5*d[20], 5*d[21], 5*d[22],
                    5*d[23], 5*d[25], 5*d[27], 5*d[38]
                ];
            default:
                console.log("Unexpected # of hits: " + hits);
                return d;
        }
    } else {
        console.log("Unexpected # of possible damage values: " + d.length);
        return d;
    }
}

function serializeText(arr) {
    if (arr.length === 0) {
        return '';
    } else if (arr.length === 1) {
        return arr[0];
    } else if (arr.length === 2) {
        return arr[0] + " and " + arr[1];
    } else {
        var text = '';
        for (var i = 0; i < arr.length-1; i++) {
            text += arr[i] + ', ';
        }
        return text + 'and ' + arr[arr.length-1];
    }
}
