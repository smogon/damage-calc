function CALCULATE_ALL_MOVES_BW(p1, p2, field) {
    checkAirLock(p1, field);
    checkAirLock(p2, field);
    checkForecast(p1, field.getWeather());
    checkForecast(p2, field.getWeather());
    checkKlutz(p1);
    checkKlutz(p2);
    p1.stats[DF] = getModifiedStat(p1.rawStats[DF], p1.boosts[DF]);
    p1.stats[SD] = getModifiedStat(p1.rawStats[SD], p1.boosts[SD]);
    p1.stats[SP] = getFinalSpeed(p1, field.getWeather());
    p2.stats[DF] = getModifiedStat(p2.rawStats[DF], p2.boosts[DF]);
    p2.stats[SD] = getModifiedStat(p2.rawStats[SD], p2.boosts[SD]);
    p2.stats[SP] = getFinalSpeed(p2, field.getWeather());
    checkIntimidate(p1, p2);
    checkIntimidate(p2, p1);
    checkDownload(p1, p2);
    checkDownload(p2, p1);
    p1.stats[AT] = getModifiedStat(p1.rawStats[AT], p1.boosts[AT]);
    p1.stats[SA] = getModifiedStat(p1.rawStats[SA], p1.boosts[SA]);
    p2.stats[AT] = getModifiedStat(p2.rawStats[AT], p2.boosts[AT]);
    p2.stats[SA] = getModifiedStat(p2.rawStats[SA], p2.boosts[SA]);
    var side1 = field.getSide(1);
    var side2 = field.getSide(0);
    checkInfiltrator(p1, side1);
    checkInfiltrator(p2, side2);
    var results = [[],[]];
    for (var i = 0; i < 4; i++) {
        results[0][i] = getDamageResult(p1, p2, p1.moves[i], side1);
        results[1][i] = getDamageResult(p2, p1, p2.moves[i], side2);
    }
    return results;
}

function CALCULATE_MOVES_OF_ATTACKER_BW(attacker, defender, field) {
    checkAirLock(attacker, field);
    checkAirLock(defender, field);
    checkForecast(attacker, field.getWeather());
    checkForecast(defender, field.getWeather());
    checkKlutz(attacker);
    checkKlutz(defender);
    attacker.stats[SP] = getFinalSpeed(attacker, field.getWeather());
    defender.stats[DF] = getModifiedStat(defender.rawStats[DF], defender.boosts[DF]);
    defender.stats[SD] = getModifiedStat(defender.rawStats[SD], defender.boosts[SD]);
    defender.stats[SP] = getFinalSpeed(defender, field.getWeather());
    checkIntimidate(attacker, defender);
    checkIntimidate(defender, attacker);
    checkDownload(attacker, defender);
    attacker.stats[AT] = getModifiedStat(attacker.rawStats[AT], attacker.boosts[AT]);
    attacker.stats[SA] = getModifiedStat(attacker.rawStats[SA], attacker.boosts[SA]);
    defender.stats[AT] = getModifiedStat(defender.rawStats[AT], defender.boosts[AT]);
    var defenderSide = field.getSide( ~~(mode === "one-vs-all") );
    checkInfiltrator(attacker, defenderSide);
    var results = [];
    for (var i = 0; i < 4; i++) {
        results[i] = getDamageResult(attacker, defender, attacker.moves[i], defenderSide);
    }
    return results;
}

function getDamageResult(attacker, defender, move, field) {
    var description = {
        "attackerName": attacker.name,
        "moveName": move.name,
        "defenderName": defender.name
    };
    
    if (move.bp === 0) {
        return {"damage":[0], "description":buildDescription(description)};
    }
    
    var defAbility = defender.ability;
    if (["Mold Breaker", "Teravolt", "Turboblaze"].indexOf(attacker.ability) !== -1) {
        defAbility = "";
        description.attackerAbility = attacker.ability;
    }
    
    var isCritical = move.isCrit && ["Battle Armor", "Shell Armor"].indexOf(defAbility) === -1;
    
    if (move.name === "Weather Ball") {
        move.type = field.weather.indexOf("Sun") !== -1 ? "Fire"
                : field.weather.indexOf("Rain") !== -1 ? "Water"
                : field.weather === "Sand" ? "Rock"
                : field.weather === "Hail" ? "Ice"
                : "Normal";
        description.weather = field.weather;
        description.moveType = move.type;
    } else if (move.name === "Judgment" && attacker.item.indexOf("Plate") !== -1) {
        move.type = getItemBoostType(attacker.item);
    } else if (move.name === "Techno Blast" && attacker.item.indexOf("Drive") !== -1) {
        move.type = getTechnoBlast(attacker.item);
    } else if (move.name === "Natural Gift" && attacker.item.indexOf("Berry") !== -1) {
        var gift = getNaturalGift(attacker.item);
        move.type = gift.t;
        move.bp = gift.p;
        description.attackerItem = attacker.item;
        description.moveBP = move.bp;
        description.moveType = move.type;
    } else if (move.name === "Nature Power") {
        move.type = field.terrain === "Electric" ? "Electric" : field.terrain === "Grassy" ? "Grass" : field.terrain === "Misty" ? "Fairy" : field.terrain === "Psychic" ? "Psychic" : "Normal";
    }
    
    var isAerilate = attacker.ability === "Aerilate" && move.type === "Normal";
    var isPixilate = attacker.ability === "Pixilate" && move.type === "Normal";
    var isRefrigerate = attacker.ability === "Refrigerate" && move.type === "Normal";
    var isGalvanize = attacker.ability === "Galvanize" && move.type === "Normal";
    var isLiquidVoice = attacker.ability === "Liquid Voice" && move.isSound;
    if (isAerilate) {
        move.type = "Flying";
    } else if (isGalvanize) {
        move.type = "Electric";
    } else if (isLiquidVoice) {
        move.type = "Water";
    } else if (isPixilate) {
        move.type = "Fairy";
    } else if (isRefrigerate) {
        move.type = "Ice";
    } else if (attacker.ability === "Normalize") {
        move.type = "Normal";
        description.attackerAbility = attacker.ability;
    }
    
    var typeEffect1 = getMoveEffectiveness(move, defender.type1, attacker.ability === "Scrappy" || field.isForesight, field.isGravity);
    var typeEffect2 = defender.type2 ? getMoveEffectiveness(move, defender.type2, attacker.ability === "Scrappy" || field.isForesight, field.isGravity) : 1;
    var typeEffectiveness = typeEffect1 * typeEffect2;
    var PriorityDamageCheck = move.hasPriority && (defAbility === "Queenly Majesty" || defAbility === "Dazzling") && (["Mold Breaker", "Teravolt", "Turboblaze"].indexOf(attacker.ability) !== -1) || (move.givesHealth && attacker.ability === "triage");
    
    if (typeEffectiveness === 0 && move.name === "Thousand Arrows") {
        typeEffectiveness = 1;
    }
    if (typeEffectiveness === 0) {
        return {"damage":[0], "description":buildDescription(description)};
    }
    if (move.name === "Sky Drop" && (defender.type1 === "Flying" || defender.type2 === "Flying" || (gen >= 6 && defender.weight >= 200) || field.isGravity)) {
        return {"damage":[0], "description":buildDescription(description)};
    }
    if (move.name === "Synchronoise" && [defender.type1, defender.type2].indexOf(attacker.type1) === -1 &&
            (!attacker.type2 || [defender.type1, defender.type2].indexOf(attacker.type2) === -1)) {
        return {"damage": [0], "description": buildDescription(description)};
    }
    if ((defAbility === "Wonder Guard" && typeEffectiveness <= 1) ||
            (move.type === "Grass" && defAbility === "Sap Sipper") ||
            (move.type === "Fire" && defAbility.indexOf("Flash Fire") !== -1) ||
            (move.type === "Water" && ["Dry Skin", "Storm Drain", "Water Absorb"].indexOf(defAbility) !== -1) ||
            (move.type === "Electric" && ["Lightning Rod", "Motor Drive", "Volt Absorb"].indexOf(defAbility) !== -1) ||
            (move.type === "Ground" && !field.isGravity && defAbility === "Levitate") ||
            (move.isBullet && defAbility === "Bulletproof") ||
            (move.isSound && defAbility === "Soundproof") || PriorityDamageCheck) {
        description.defenderAbility = defAbility;
        return {"damage":[0], "description":buildDescription(description)};
    }
    if (field.weather === "Strong Winds" && (defender.type1 === "Flying" || defender.type2 === "Flying") && typeChart[move.type]["Flying"] > 1) {
        typeEffectiveness /= 2;
        description.weather = field.weather;
    }
    if (move.type === "Ground" && move.name !== "Thousand Arrows" && !field.isGravity && defender.item === "Air Balloon") {
        description.defenderItem = defender.item;
        return {"damage":[0], "description":buildDescription(description)};
    }
    
    description.HPEVs = defender.HPEVs + " HP";
    
    if (move.name === "Seismic Toss" || move.name === "Night Shade") {
        var lv = attacker.level;
        if (attacker.ability === "Parental Bond") {
            lv *= 2;
        }
        return {"damage":[lv], "description":buildDescription(description)};
    }
    
    if (move.name === "Final Gambit") {
        var hp = attacker.curHP;
        return {"damage":[hp], "description":buildDescription(description)};
    }
    
    if (move.hits > 1) {
        description.hits = move.hits;
    }
    var turnOrder = attacker.stats[SP] > defender.stats[SP] ? "FIRST" : "LAST";
    
    ////////////////////////////////
    ////////// BASE POWER //////////
    ////////////////////////////////
    var basePower;
    switch (move.name) {
        case "Payback":
            basePower = turnOrder === "LAST" ? 100 : 50;
            description.moveBP = basePower;
            break;
        case "Electro Ball":
            var r = Math.floor(attacker.stats[SP] / defender.stats[SP]);
            basePower = r >= 4 ? 150 : r >= 3 ? 120 : r >= 2 ? 80 : 60;
            description.moveBP = basePower;
            break;
        case "Gyro Ball":
            basePower = Math.min(150, Math.floor(25 * defender.stats[SP] / attacker.stats[SP]));
            description.moveBP = basePower;
            break;
        case "Punishment":
            basePower = Math.min(200, 60 + 20 * countBoosts(defender.boosts));
            description.moveBP = basePower;
            break;
        case "Low Kick":
        case "Grass Knot":
            var w = defender.weight;
            basePower = w >= 200 ? 120 : w >= 100 ? 100 : w >= 50 ? 80 : w >= 25 ? 60 : w >= 10 ? 40 : 20;
            description.moveBP = basePower;
            break;
        case "Hex":
            basePower = move.bp * (defender.status !== "Healthy" ? 2 : 1);
            description.moveBP = basePower;
            break;
        case "Heavy Slam":
        case "Heat Crash":
            var wr = attacker.weight / defender.weight;
            basePower = wr >= 5 ? 120 : wr >= 4 ? 100 : wr >= 3 ? 80 : wr >= 2 ? 60 : 40;
            description.moveBP = basePower;
            break;
        case "Stored Power":
            basePower = 20 + 20 * countBoosts(attacker.boosts);
            description.moveBP = basePower;
            break;
        case "Acrobatics":
            basePower = attacker.item === "Flying Gem" || attacker.item === "" ? 110 : 55;
            description.moveBP = basePower;
            break;
        case "Wake-Up Slap":
            basePower = move.bp * (defender.status === "Asleep" ? 2 : 1);
            description.moveBP = basePower;
            break;
        case "Weather Ball":
            basePower = field.weather !== "" ? 100 : 50;
            description.moveBP = basePower;
            break;
        case "Fling":
            basePower = getFlingPower(attacker.item);
            description.moveBP = basePower;
            description.attackerItem = attacker.item;
            break;
        case "Eruption":
        case "Water Spout":
            basePower = Math.max(1, Math.floor(150 * attacker.curHP / attacker.maxHP));
            description.moveBP = basePower;
            break;
        case "Flail":
        case "Reversal":
            var p = Math.floor(48 * attacker.curHP / attacker.maxHP);
            basePower = p <= 1 ? 200 : p <= 4 ? 150 : p <= 9 ? 100 : p <= 16 ? 80 : p <= 32 ? 40 : 20;
            description.moveBP = basePower;
            break;
        case "Bulldoze":
        case "Earthquake":
            basePower = (field.terrain === "Grassy") ? move.bp / 2 : move.bp;
            description.terrain = field.terrain;
            break;
        case "Nature Power":
            basePower = (field.terrain === "Electric" || field.terrain === "Grassy") ? 90 : (field.terrain === "Misty") ? 95 : 80;
            break;
        case "Water Shuriken":
            basePower = (attacker.name === "Greninja-Ash") ? 20 : 15;
            description.moveBP = basePower;
            break;
        default:
            basePower = move.bp;
    }
    
    var bpMods = [];
    if ((attacker.ability === "Technician" && basePower <= 60) ||
            (attacker.ability === "Flare Boost" && attacker.status === "Burned" && move.category === "Special") ||
            (attacker.ability === "Toxic Boost" && (attacker.status === "Poisoned" || attacker.status === "Badly Poisoned") &&
                    move.category === "Physical")) {
        bpMods.push(0x1800);
        description.attackerAbility = attacker.ability;
    } else if (attacker.ability === "Analytic" && turnOrder !== "FIRST") {
        bpMods.push(0x14CD);
        description.attackerAbility = attacker.ability;
    } else if (attacker.ability === "Sand Force" && field.weather === "Sand" && ["Rock","Ground","Steel"].indexOf(move.type) !== -1) {
        bpMods.push(0x14CD);
        description.attackerAbility = attacker.ability;
        description.weather = field.weather;
    } else if ((attacker.ability === "Reckless" && move.hasRecoil) ||
            (attacker.ability === "Iron Fist" && move.isPunch)) {
        bpMods.push(0x1333);
        description.attackerAbility = attacker.ability;
    }
    
    if (defAbility === "Heatproof" && move.type === "Fire") {
        bpMods.push(0x800);
        description.defenderAbility = defAbility;
    } else if (defAbility === "Dry Skin" && move.type === "Fire") {
        bpMods.push(0x1400);
        description.defenderAbility = defAbility;
    } else if (defAbility === "Fluffy" && move.makesContact && move.type === "Fire") {
        bpMods.push(0x2000); 
        description.defenderAbility = defAbility;
    } else if (defAbility === "Fluffy" && move.makesContact && !attacker.ability === "Long Reach") {
        bpMods.push(0x800);
        description.defenderAbility = defAbility;
    }
    
    if (attacker.ability === "Sheer Force" && move.hasSecondaryEffect) {
        bpMods.push(0x14CD);
        description.attackerAbility = attacker.ability;
    }
    
    if (getItemBoostType(attacker.item) === move.type) {
        bpMods.push(0x1333);
        description.attackerItem = attacker.item;
    } else if ((attacker.item === "Muscle Band" && move.category === "Physical") ||
            (attacker.item === "Wise Glasses" && move.category === "Special")) {
        bpMods.push(0x1199);
        description.attackerItem = attacker.item;
    } else if (((attacker.item === "Adamant Orb" && attacker.name === "Dialga") ||
            (attacker.item === "Lustrous Orb" && attacker.name === "Palkia") ||
            (attacker.item === "Griseous Orb" && attacker.name === "Giratina-Origin")) &&
            (move.type === attacker.type1 || move.type === attacker.type2)) {
        bpMods.push(0x1333);
        description.attackerItem = attacker.item;
    } else if (attacker.item === move.type + " Gem") {
        bpMods.push(gen >= 6 ? 0x14CD : 0x1800);
        description.attackerItem = attacker.item;
    }
    
    if ((move.name === "Facade" && ["Burned","Paralyzed","Poisoned","Badly Poisoned"].indexOf(attacker.status) !== -1) ||
            (move.name === "Brine" && defender.curHP <= defender.maxHP / 2) ||
            (move.name === "Venoshock" && (defender.status === "Poisoned" || defender.status === "Badly Poisoned"))) {
        bpMods.push(0x2000);
        description.moveBP = move.bp * 2;
    } else if (move.name === "Solar Beam" && ["Rain","Heavy Rain","Sand","Hail"].indexOf(field.weather) !== -1) {
        bpMods.push(0x800);
        description.moveBP = move.bp / 2;
        description.weather = field.weather;
    } else if (gen >= 6 && move.name === "Knock Off" && !(defender.item === "" ||
            (defender.name === "Giratina-Origin" && defender.item === "Griseous Orb") ||
            (defender.name.indexOf("Arceus") !== -1 && defender.item.indexOf("Plate") !== -1) ||
            (defender.name.indexOf("Genesect") !== -1 && defender.item.indexOf("Drive") !== -1))) {
        bpMods.push(0x1800);
        description.moveBP = move.bp * 1.5;
    }
    
    if (field.isHelpingHand) {
        bpMods.push(0x1800);
        description.isHelpingHand = true;
    }
    
    if (isAerilate || isPixilate || isRefrigerate || isGalvanize) {
        bpMods.push(gen >= 7 ? 0x1333 : 0x14CD);
        description.attackerAbility = attacker.ability;
    } else if ((attacker.ability === "Mega Launcher" && move.isPulse) ||
            (attacker.ability === "Strong Jaw" && move.isBite)) {
        bpMods.push(0x1800);
        description.attackerAbility = attacker.ability;
    } else if (attacker.ability === "Tough Claws" && move.makesContact) {
        bpMods.push(0x14CD);
        description.attackerAbility = attacker.ability;
    }
    
    var isAttackerAura = attacker.ability === (move.type + " Aura");
    var isDefenderAura = defAbility === (move.type + " Aura");
    if (isAttackerAura || isDefenderAura) {
        if (attacker.ability === "Aura Break" || defAbility === "Aura Break") {
            bpMods.push(0x0C00);
            description.attackerAbility = attacker.ability;
            description.defenderAbility = defAbility;
        } else {
            bpMods.push(0x1547);
            if (isAttackerAura) {
                description.attackerAbility = attacker.ability;
            }
            if (isDefenderAura) {
                description.defenderAbility = defAbility;
            }
        }
    }
    
    basePower = Math.max(1, pokeRound(basePower * chainMods(bpMods) / 0x1000));
    
    ////////////////////////////////
    ////////// (SP)ATTACK //////////
    ////////////////////////////////
    var attack;
    var attackSource = move.name === "Foul Play" ? defender : attacker;
    var attackStat = move.category === "Physical" ? AT : SA;
    description.attackEVs = attacker.evs[attackStat] +
            (NATURES[attacker.nature][0] === attackStat ? "+" : NATURES[attacker.nature][1] === attackStat ? "-" : "") + " " +
            toSmogonStat(attackStat);
    if (attackSource.boosts[attackStat] === 0 || (isCritical && attackSource.boosts[attackStat] < 0)) {
        attack = attackSource.rawStats[attackStat];
    } else if (defAbility === "Unaware") {
        attack = attackSource.rawStats[attackStat];
        description.defenderAbility = defAbility;
    } else {
        attack = attackSource.stats[attackStat];
        description.attackBoost = attackSource.boosts[attackStat];
    }
    
    // unlike all other attack modifiers, Hustle gets applied directly
    if (attacker.ability === "Hustle" && move.category === "Physical") {
        attack = pokeRound(attack * 3/2);
        description.attackerAbility = attacker.ability;
    }
    
    var atMods = [];
    if (defAbility === "Thick Fat" && (move.type === "Fire" || move.type === "Ice") || (defAbility === "Water Bubble" && move.type === "Fire")) {
        atMods.push(0x800);
        description.defenderAbility = defAbility;
    }
    
    if ((attacker.ability === "Guts" && attacker.status !== "Healthy" && move.category === "Physical") ||
            (attacker.ability === "Overgrow" && attacker.curHP <= attacker.maxHP / 3 && move.type === "Grass") ||
            (attacker.ability === "Blaze" && attacker.curHP <= attacker.maxHP / 3 && move.type === "Fire") ||
            (attacker.ability === "Torrent" && attacker.curHP <= attacker.maxHP / 3 && move.type === "Water") ||
            (attacker.ability === "Swarm" && attacker.curHP <= attacker.maxHP / 3 && move.type === "Bug") || (move.category === "Special" && (attacker.ability === "Plus" || attacker.ability === "Minus"))) {
        atMods.push(0x1800);
        description.attackerAbility = attacker.ability;
    } else if (attacker.ability === "Flash Fire (activated)" && move.type === "Fire") {
        atMods.push(0x1800);
        description.attackerAbility = "Flash Fire";
    } else if ((attacker.ability === "Solar Power" && field.weather.indexOf("Sun") !== -1 && move.category === "Special") ||
            (attacker.ability === "Flower Gift" && field.weather.indexOf("Sun") !== -1 && move.category === "Physical")) {
        atMods.push(0x1800);
        description.attackerAbility = attacker.ability;
        description.weather = field.weather;
    } else if ((attacker.ability === "Defeatist" && attacker.curHP <= attacker.maxHP / 2) ||
            (attacker.ability === "Slow Start" && move.category === "Physical")) {
        atMods.push(0x800);
        description.attackerAbility = attacker.ability;
    } else if ((attacker.ability === "Huge Power" || attacker.ability === "Pure Power") && move.category === "Physical") {
        atMods.push(0x2000);
        description.attackerAbility = attacker.ability;
    }
    
    if ((attacker.item === "Thick Club" && (attacker.name === "Cubone" || attacker.name === "Marowak" || attacker.name === "Marowak-Alola") && move.category === "Physical") ||
            (attacker.item === "Deep Sea Tooth" && attacker.name === "Clamperl" && move.category === "Special") ||
            (attacker.item === "Light Ball" && attacker.name === "Pikachu")) {
        atMods.push(0x2000);
        description.attackerItem = attacker.item;
    } else if ((gen < 7 && attacker.item === "Soul Dew" && (attacker.name === "Latios" || attacker.name === "Latias") && move.category === "Special") ||
            (attacker.item === "Choice Band" && move.category === "Physical") ||
            (attacker.item === "Choice Specs" && move.category === "Special")) {
        atMods.push(0x1800);
        description.attackerItem = attacker.item;
    }
    
    attack = Math.max(1, pokeRound(attack * chainMods(atMods) / 0x1000));
    
    ////////////////////////////////
    ///////// (SP)DEFENSE //////////
    ////////////////////////////////
    var defense;
    var hitsPhysical = move.category === "Physical" || move.dealsPhysicalDamage;
    var defenseStat = hitsPhysical ? DF : SD;
    description.defenseEVs = defender.evs[defenseStat] +
            (NATURES[defender.nature][0] === defenseStat ? "+" : NATURES[defender.nature][1] === defenseStat ? "-" : "") + " " +
            toSmogonStat(defenseStat);
    if (defender.boosts[defenseStat] === 0 || (isCritical && defender.boosts[defenseStat] > 0) || move.ignoresDefenseBoosts) {
        defense = defender.rawStats[defenseStat];
    } else if (attacker.ability === "Unaware") {
        defense = defender.rawStats[defenseStat];
        description.attackerAbility = attacker.ability;
    } else {
        defense = defender.stats[defenseStat];
        description.defenseBoost = defender.boosts[defenseStat];
    }
    
    // unlike all other defense modifiers, Sandstorm SpD boost gets applied directly
    if (field.weather === "Sand" && (defender.type1 === "Rock" || defender.type2 === "Rock") && !hitsPhysical) {
        defense = pokeRound(defense * 3/2);
        description.weather = field.weather;
    }
    
    var dfMods = [];
    if (defAbility === "Marvel Scale" && defender.status !== "Healthy" && hitsPhysical) {
        dfMods.push(0x1800);
        description.defenderAbility = defAbility;
    } else if (defAbility === "Flower Gift" && field.weather.indexOf("Sun") !== -1 && !hitsPhysical) {
        dfMods.push(0x1800);
        description.defenderAbility = defAbility;
        description.weather = field.weather;
    }
    
    if (field.terrain === "Grassy" && defAbility === "Grass Pelt" && hitsPhysical) {
        dfMods.push(0x1800);
        description.defenderAbility = defAbility;
    }
    
    if ((gen < 7 && defender.item === "Soul Dew" && (defender.name === "Latios" || defender.name === "Latias") && !hitsPhysical) ||
            (defender.item === "Assault Vest" && !hitsPhysical) || defender.item === "Eviolite") {
        dfMods.push(0x1800);
        description.defenderItem = defender.item;
    }

    if ((defender.item === "Metal Powder" && defender.name === "Ditto" && hitsPhysical) ||
            (defender.item === "Deep Sea Scale" && defender.name === "Clamperl" && !hitsPhysical)) {
        dfMods.push(0x2000);
        description.defenderItem = defender.item;
    }
    
    if (defAbility === "Fur Coat" && hitsPhysical) {
        dfMods.push(0x2000);
        description.defenderAbility = defAbility;
    }

    defense = Math.max(1, pokeRound(defense * chainMods(dfMods) / 0x1000));
    
    ////////////////////////////////
    //////////// DAMAGE ////////////
    ////////////////////////////////
    var baseDamage = Math.floor(Math.floor((Math.floor((2 * attacker.level) / 5 + 2) * basePower * attack) / defense) / 50 + 2);
    if (field.format !== "Singles" && move.isSpread) {
        baseDamage = pokeRound(baseDamage * 0xC00 / 0x1000);
    }
    if ((field.weather.indexOf("Sun") !== -1 && move.type === "Fire") || (field.weather.indexOf("Rain") !== -1 && move.type === "Water")) {
        baseDamage = pokeRound(baseDamage * 0x1800 / 0x1000);
        description.weather = field.weather;
    } else if ((field.weather === "Sun" && move.type === "Water") || (field.weather === "Rain" && move.type === "Fire")) {
        baseDamage = pokeRound(baseDamage * 0x800 / 0x1000);
        description.weather = field.weather;
    } else if ((field.weather === "Harsh Sunshine" && move.type === "Water") || (field.weather === "Heavy Rain" && move.type === "Fire")) {
        return {"damage":[0], "description":buildDescription(description)};
    }
    if (field.isGravity || (attacker.type1 !== "Flying" && attacker.type2 !== "Flying" &&
                attacker.item !== "Air Balloon" && attacker.ability !== "Levitate")) {
        if (field.terrain === "Electric" && move.type === "Electric") {
            baseDamage = pokeRound(baseDamage * 0x1800 / 0x1000);
            description.terrain = field.terrain;
        } else if (field.terrain === "Grassy" && move.type == "Grass") {
            baseDamage = pokeRound(baseDamage * 0x1800 / 0x1000);
            description.terrain = field.terrain;
        } else if (field.terrain === "Psychic" && move.type === "Psychic") {
            baseDamage = pokeRound(baseDamage * 0x1800 / 0x1000);
            description.terrain - field.terrain;
        }
    }
    if (field.isGravity || (defender.type1 !== "Flying" && defender.type2 !== "Flying" &&
            defender.item !== "Air Balloon" && defender.ability !== "Levitate")) {
        if (field.terrain === "Misty" && move.type === "Dragon") {
            baseDamage = pokeRound(baseDamage * 0x800 / 0x1000);
            description.terrain = field.terrain;
        }
    }
    if (isCritical) {
        baseDamage = Math.floor(baseDamage * (gen >= 6 ? 1.5 : 2));
        description.isCritical = isCritical;
    }
    // the random factor is applied between the crit mod and the stab mod, so don't apply anything below this until we're inside the loop
    var stabMod = 0x1000;
    if (move.type === attacker.type1 || move.type === attacker.type2) {
        if (attacker.ability === "Adaptability") {
            stabMod = 0x2000;
            description.attackerAbility = attacker.ability;
        } else {
            stabMod = 0x1800;
        }
    } else if (attacker.ability === "Protean") {
        stabMod = 0x1800;
        description.attackerAbility = attacker.ability;
    }
    var applyBurn = (attacker.status === "Burned" && move.category === "Physical" && attacker.ability !== "Guts" && !move.ignoresBurn);
    description.isBurned = applyBurn;
    var finalMods = [];
    if (field.isReflect && move.category === "Physical" && !isCritical) {
        finalMods.push(field.format !== "Singles" ? (gen >= 6 ? 0xAAC : 0xA8F) : 0x800);
        description.isReflect = true;
    } else if (field.isLightScreen && move.category === "Special" && !isCritical) {
        finalMods.push(field.format !== "Singles" ? (gen >= 6 ? 0xAAC : 0xA8F) : 0x800);
        description.isLightScreen = true;
    }
    if ((defAbility === "Multiscale" || defAbility === "Shadow Shield") && defender.curHP === defender.maxHP) {
        finalMods.push(0x800);
        description.defenderAbility = defAbility;
    }
    if (attacker.ability === "Tinted Lens" && typeEffectiveness < 1) {
        finalMods.push(0x2000);
        description.attackerAbility = attacker.ability;
    }
    if (attacker.ability === "Water Bubble" && move.type === "Water") { 
        finalMods.push(0x2000); 
        description.attackerAbility = attacker.ability; 
    } 
    if (attacker.ability === "Steelworker" && move.type === "Steel") {
        finalMods.push(0x1800);
        description.attackerAbility = attacker.ability;
    }
    if (field.isFriendGuard) {
        finalMods.push(0xC00);
        description.isFriendGuard = true;
    }
    if (attacker.ability === "Sniper" && isCritical) {
        finalMods.push(0x1800);
        description.attackerAbility = attacker.ability;
    }
    if ((defAbility === "Solid Rock" || defAbility === "Filter" || defAbility === "Prism Armor") && typeEffectiveness > 1) {
        finalMods.push(0xC00);
        description.defenderAbility = defAbility;
    }
    if (attacker.item === "Expert Belt" && typeEffectiveness > 1) {
        finalMods.push(0x1333);
        description.attackerItem = attacker.item;
    } else if (attacker.item === "Life Orb") {
        finalMods.push(0x14CC);
        description.attackerItem = attacker.item;
    }
    if (getBerryResistType(defender.item) === move.type && (typeEffectiveness > 1 || move.type === "Normal") &&
            attacker.ability !== "Unnerve") {
        finalMods.push(0x800);
        description.defenderItem = defender.item;
    }
    var finalMod = chainMods(finalMods);
    
    var damage = [];
    for (var i = 0; i < 16; i++) {
        damage[i] = Math.floor(baseDamage * (85 + i) / 100);
        damage[i] = pokeRound(damage[i] * stabMod / 0x1000);
        damage[i] = Math.floor(damage[i] * typeEffectiveness);
        if (applyBurn) {
            damage[i] = Math.floor(damage[i] / 2);
        }
        damage[i] = Math.max(1, damage[i]);
        damage[i] = pokeRound(damage[i] * finalMod / 0x1000);

        // is 2nd hit half BP? half attack? half damage range? keeping it as a flat multiplier until I know the specifics
        if (attacker.ability === "Parental Bond" && move.hits === 1 && (field.format === "Singles" || !move.isSpread)) {
            var bondFactor = gen < 7 ? 3/2 : 5/4; // in gen 7, 2nd hit was reduced from 50% to 25% 
            damage[i] = Math.floor(damage[i] * bondFactor);
            description.attackerAbility = attacker.ability;
        }
    }
    return {"damage":damage, "description":buildDescription(description)};
}

function buildDescription(description) {
    var output = "";
    if (description.attackBoost) {
        if (description.attackBoost > 0) {
            output += "+";
        }
        output += description.attackBoost + " ";
    }
    output = appendIfSet(output, description.attackEVs);
    output = appendIfSet(output, description.attackerItem);
    output = appendIfSet(output, description.attackerAbility);
    if (description.isBurned) {
        output += "burned ";
    }
    output += description.attackerName + " ";
    if (description.isHelpingHand) {
        output += "Helping Hand ";
    }
    output += description.moveName + " ";
    if (description.moveBP && description.moveType) {
        output += "(" + description.moveBP + " BP " + description.moveType + ") ";
    } else if (description.moveBP) {
        output += "(" + description.moveBP + " BP) ";
    } else if (description.moveType) {
        output += "(" + description.moveType + ") ";
    }
    if (description.hits) {
        output += "(" + description.hits + " hits) ";
    }
    output += "vs. ";
    if (description.defenseBoost) {
        if (description.defenseBoost > 0) {
            output += "+";
        }
        output += description.defenseBoost + " ";
    }
    output = appendIfSet(output, description.HPEVs);
    if (description.defenseEVs) {
        output += " / " + description.defenseEVs + " ";
    }
    output = appendIfSet(output, description.defenderItem);
    output = appendIfSet(output, description.defenderAbility);
    output += description.defenderName;
    if (description.weather && description.terrain) {
        
    } else if (description.weather) {
        output += " in " + description.weather;
    } else if (description.terrain) {
        output += " in " + description.terrain + " Terrain";
    }
    if (description.isReflect) {
        output += " through Reflect";
    } else if (description.isLightScreen) {
        output += " through Light Screen";
    }
    if (description.isFriendGuard) {
        output += " with an ally's Friend Guard";
    }
    if (description.isCritical) {
        output += " on a critical hit";
    }
    return output;
}

function appendIfSet(str, toAppend) {
    if (toAppend) {
        return str + toAppend + " ";
    }
    return str;
}

function toSmogonStat(stat) {
    return stat === AT ? "Atk"
            : stat === DF ? "Def"
            : stat === SA ? "SpA"
            : stat === SD ? "SpD"
            : stat === SP ? "Spe"
            : "wtf";
}

function chainMods(mods) {
    var M = 0x1000;
    for(var i = 0; i < mods.length; i++) {
        if(mods[i] !== 0x1000) {
            M = ((M * mods[i]) + 0x800) >> 12;
        }
    }
    return M;
}

function getMoveEffectiveness(move, type, isGhostRevealed, isGravity) {
    if (isGhostRevealed && type === "Ghost" && (move.type === "Normal" || move.type === "Fighting")) {
        return 1;
    } else if (isGravity && type === "Flying" && move.type === "Ground") {
        return 1;
    } else if (move.name === "Freeze-Dry" && type === "Water") {
        return 2;
    } else if (move.name === "Flying Press") {
        return typeChart["Fighting"][type] * typeChart["Flying"][type];
    } else {
        return typeChart[move.type][type];
    }
}

function getModifiedStat(stat, mod) {
    return mod > 0 ? Math.floor(stat * (2 + mod) / 2)
            : mod < 0 ? Math.floor(stat * 2 / (2 - mod))
            : stat;
}

function getFinalSpeed(pokemon, weather) {
    var speed = getModifiedStat(pokemon.rawStats[SP], pokemon.boosts[SP]);
    if (pokemon.item === "Choice Scarf") {
        speed = Math.floor(speed * 1.5);
    } else if (pokemon.item === "Macho Brace" || pokemon.item === "Iron Ball") {
        speed = Math.floor(speed / 2);
    }
    if ((pokemon.ability === "Chlorophyll" && weather.indexOf("Sun") !== -1) ||
            (pokemon.ability === "Sand Rush" && weather === "Sand") ||
            (pokemon.ability === "Swift Swim" && weather.indexOf("Rain") !== -1) || 
            (pokemon.ability === "Slush Rush" && weather.indexOf("Hail") !== -1)) {
        speed *= 2;
    }
    return speed;
}

function checkAirLock(pokemon, field) {
    if (pokemon.ability === "Air Lock" || pokemon.ability === "Cloud Nine") {
        field.clearWeather();
    }
}
function checkForecast(pokemon, weather) {
    if (pokemon.ability === "Forecast" && pokemon.name === "Castform") {
        if (weather.indexOf("Sun") !== -1) {
            pokemon.type1 = "Fire";
        } else if (weather.indexOf("Rain") !== -1) {
            pokemon.type1 = "Water";
        } else if (weather === "Hail") {
            pokemon.type1 = "Ice";
        } else {
            pokemon.type1 = "Normal";
        }
        pokemon.type2 = "";
    }
}
function checkKlutz(pokemon) {
    if (pokemon.ability === "Klutz") {
        pokemon.item = "";
    }
}
function checkIntimidate(source, target) {
    if (source.ability === "Intimidate") {
        if (target.ability === "Contrary" || target.ability === "Defiant") {
            target.boosts[AT] = Math.min(6, target.boosts[AT] + 1);
        } else if (["Clear Body", "White Smoke", "Hyper Cutter", "Full Metal Body"].indexOf(target.ability) !== -1) {
            // no effect
        } else if (target.ability === "Simple") {
            target.boosts[AT] = Math.max(-6, target.boosts[AT] - 2);
        } else {
            target.boosts[AT] = Math.max(-6, target.boosts[AT] - 1);
        }
    }
}
function checkDownload(source, target) {
    if (source.ability === "Download") {
        if (target.stats[SD] <= target.stats[DF]) {
            source.boosts[SA] = Math.min(6, source.boosts[SA] + 1);
        } else {
            source.boosts[AT] = Math.min(6, source.boosts[AT] + 1);
        }
    }
}
function checkInfiltrator(attacker, affectedSide) {
    if (attacker.ability === "Infiltrator") {
        affectedSide.isReflect = false;
        affectedSide.isLightScreen = false;
    }
}

function countBoosts(boosts) {
    var sum = 0;
    for (var i = 0; i < STATS.length; i++) {
        if (boosts[STATS[i]] > 0) {
            sum += boosts[STATS[i]];
        }
    }
    return sum;
}

// GameFreak rounds DOWN on .5
function pokeRound(num) {
    return (num % 1 > 0.5) ? Math.ceil(num) : Math.floor(num);
}
