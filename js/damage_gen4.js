function CALCULATE_ALL_MOVES_DPP(p1, p2, field) {
	checkAirLock(p1, field);
	checkAirLock(p2, field);
	checkForecast(p1, field.getWeather());
	checkForecast(p2, field.getWeather());
	checkKlutz(p1);
	checkKlutz(p2);
	checkIntimidate(p1, p2);
	checkIntimidate(p2, p1);
	checkDownload(p1, p2);
	checkDownload(p2, p1);
	var side1 = field.getSide(1);
	var side2 = field.getSide(0);
	p1.stats[SP] = getFinalSpeed(p1, field, side1);
	p2.stats[SP] = getFinalSpeed(p2, field, side2);
	var results = [[], []];
	for (var i = 0; i < 4; i++) {
		results[0][i] = CALCULATE_DAMAGE_DPP(p1, p2, p1.moves[i], side1);
		results[1][i] = CALCULATE_DAMAGE_DPP(p2, p1, p2.moves[i], side2);
	}
	return results;
}

function CALCULATE_MOVES_OF_ATTACKER_DPP(attacker, defender, field) {
	checkAirLock(attacker, field);
	checkAirLock(defender, field);
	checkForecast(attacker, field.getWeather());
	checkForecast(defender, field.getWeather());
	checkKlutz(attacker);
	checkKlutz(defender);
	checkIntimidate(attacker, defender);
	checkIntimidate(defender, attacker);
	checkDownload(attacker, defender);
	var defenderSide = field.getSide(~~(mode === "one-vs-all"));
	var attackerSide = field.getSide(~~(mode !== "one-vs-all"));
	attacker.stats[SP] = getFinalSpeed(attacker, field, attackerSide);
	defender.stats[SP] = getFinalSpeed(defender, field, defenderSide);
	var results = [];
	for (var i = 0; i < 4; i++) {
		results[i] = CALCULATE_DAMAGE_DPP(attacker, defender, attacker.moves[i], defenderSide);
	}
	return results;
}

function CALCULATE_DAMAGE_DPP(attacker, defender, move, field) {
	var description = {
		"attackerName": attacker.name,
		"moveName": move.name,
		"defenderName": defender.name
	};

	if (move.bp === 0) {
		return {"damage": [0], "description": buildDescription(description)};
	}

	if (field.isProtected && !move.bypassesProtect) {
		description.isProtected = true;
		return {"damage": [0], "description": buildDescription(description)};
	}

	if (attacker.hasAbility("Mold Breaker")) {
		defender.ability = "";
		description.attackerAbility = attacker.ability;
	}

	var isCritical = move.isCrit && defender.hasAbility("Battle Armor", "Shell Armor");

	if (move.name === "Weather Ball") {
		if (field.weather === "Sun") {
			move.type = "Fire";
			move.bp *= 2;
		} else if (field.weather === "Rain") {
			move.type = "Water";
			move.bp *= 2;
		} else if (field.weather === "Sand") {
			move.type = "Rock";
			move.bp *= 2;
		} else if (field.weather === "Hail") {
			move.type = "Ice";
			move.bp *= 2;
		} else {
			move.type = "Normal";
		}
		description.weather = field.weather;
		description.moveType = move.type;
		description.moveBP = basePower;
	} else if (move.name === "Judgment" && attacker.item.indexOf("Plate") !== -1) {
		move.type = getItemBoostType(attacker.item);
	} else if (move.name === "Natural Gift" && attacker.item.indexOf("Berry") !== -1) {
		var gift = getNaturalGift(attacker.item);
		move.type = gift.t;
		move.bp = gift.p;
		description.attackerItem = attacker.item;
		description.moveBP = move.bp;
		description.moveType = move.type;
	}

	if (attacker.hasAbility("Normalize")) {
		move.type = "Normal";
		description.attackerAbility = attacker.ability;
	}

	var typeEffect1 = getMoveEffectiveness(move, defender.type1, attacker.hasAbility("Scrappy") || field.isForesight, field.isGravity);
	var typeEffect2 = defender.type2 ? getMoveEffectiveness(move, defender.type2, attacker.hasAbility("Scrappy") || field.isForesight, field.isGravity) : 1;
	var typeEffectiveness = typeEffect1 * typeEffect2;

	if (typeEffectiveness === 0) {
		return {"damage": [0], "description": buildDescription(description)};
	}
	if ((defender.hasAbility("Wonder Guard") && typeEffectiveness <= 1) ||
            (move.type === "Fire" && defender.hasAbility("Flash Fire")) ||
            (move.type === "Water" && defender.hasAbility("Dry Skin", "Water Absorb")) ||
            (move.type === "Electric" && defender.hasAbility("Motor Drive", "Volt Absorb")) ||
            (move.type === "Ground" && !field.isGravity && defender.hasAbility("Levitate")) ||
            (move.isSound && defender.hasAbility("Soundproof"))) {
		description.defenderAbility = defender.ability;
		return {"damage": [0], "description": buildDescription(description)};
	}

	description.HPEVs = defender.HPEVs + " HP";

	if (move.name === "Seismic Toss" || move.name === "Night Shade") {
		return {"damage": [attacker.level], "description": buildDescription(description)};
	}

	if (move.hits > 1) {
		description.hits = move.hits;
	}
	var turnOrder = attacker.stats[SP] > defender.stats[SP] ? "FIRST" : "LAST";

	////////////////////////////////
	////////// BASE POWER //////////
	////////////////////////////////
	switch (move.name) {
	case "Brine":
		if (defender.curHP <= (defender.maxHP / 2)) {
			move.bp *= 2;
			description.moveBP = move.bp;
		}
		break;
	case "Eruption":
	case "Water Spout":
		move.bp = Math.max(1, Math.floor(move.bp * attacker.curHP / attacker.maxHP));
		description.moveBP = move.bp;
		break;
	case "Facade":
		if (attacker.hasStatus("Paralyzed", "Poisoned", "Badly Poisoned", "Burned")) {
			move.bp *= 2;
			description.moveBP = move.bp;
		}
		break;
	case "Flail":
	case "Reversal":
		var p = Math.floor(48 * attacker.curHP / attacker.maxHP);
		move.bp = p <= 1 ? 200 : p <= 4 ? 150 : p <= 9 ? 100 : p <= 16 ? 80 : p <= 32 ? 40 : 20;
		description.moveBP = move.bp;
		break;
	case "Fling":
		move.bp = getFlingPower(attacker.item);
		description.moveBP = move.bp;
		description.attackerItem = attacker.item;
		break;
	case "Grass Knot":
	case "Low Kick":
		var w = defender.weight;
		move.bp = w >= 200 ? 120 : w >= 100 ? 100 : w >= 50 ? 80 : w >= 25 ? 60 : w >= 10 ? 40 : 20;
		description.moveBP = move.bp;
		break;
	case "Gyro Ball":
		move.bp = Math.min(150, Math.floor(25 * defender.stats[SP] / attacker.stats[SP]));
		description.moveBP = move.bp;
		break;
	case "Payback":
		if (turnOrder !== "FIRST") {
			move.bp *= 2;
			description.moveBP = move.bp;
		}
		break;
	case "Punishment":
		var boostCount = countBoosts(defender.boosts);
		if (boostCount > 0) {
			move.bp = Math.min(200, move.bp + 20 * boostCount);
			description.moveBP = move.bp;
		}
		break;
	case "Wake-Up Slap":
		if (defender.hasStatus("Asleep")) {
			move.bp *= 2;
			description.moveBP = move.bp;
		}
		break;
	case "Wring Out":
		move.bp = Math.floor(defender.curHP * 120 / defender.maxHP) + 1;
		description.moveBP = move.bp;
		break;
	}

	var basePower = move.bp;

	if (field.isHelpingHand) {
		basePower = Math.floor(basePower * 1.5);
		description.isHelpingHand = true;
	}

	var isPhysical = move.category === "Physical";
	if ((attacker.hasItem("Muscle Band") && isPhysical) || (attacker.hasItem("Wise Glasses") && !isPhysical)) {
		basePower = Math.floor(basePower * 1.1);
		description.attackerItem = attacker.item;
	} else if (getItemBoostType(attacker.item) === move.type ||
            (attacker.hasItem("Adamant Orb") && attacker.named("Dialga")) ||
            (attacker.hasItem("Lustrous Orb") && attacker.named("Palkia")) ||
            (attacker.hasItem("Griseous Orb") && attacker.named("Giratina-Origin")) &&
            (move.type === attacker.type1 || move.type === attacker.type2)) {
		basePower = Math.floor(basePower * 1.2);
		description.attackerItem = attacker.item;
	}

	if ((attacker.hasAbility("Reckless") && move.hasRecoil) ||
            (attacker.hasAbility("Iron Fist") && move.isPunch)) {
		basePower = Math.floor(basePower * 1.2);
		description.attackerAbility = attacker.ability;
	} else if ((attacker.curHP <= attacker.maxHP / 3 &&
            (attacker.hasAbility("Overgrow") && move.type === "Grass")) ||
            (attacker.hasAbility("Blaze)" && move.type === "Fire") ||
            (attacker.hasAbility("Torrent") && move.type === "Water") ||
            (attacker.hasAbility("Swarm") && move.type === "Bug") ||
            (attacker.hasAbility("Technician") && move.bp <= 60))) {
		basePower = Math.floor(basePower * 1.5);
		description.attackerAbility = attacker.ability;
	}

	if ((defender.hasAbility("Thick Fat") && (move.type === "Fire" || move.type === "Ice")) ||
            (defender.hasAbility("Heatproof") && move.type === "Fire")) {
		basePower = Math.floor(basePower * 0.5);
		description.defenderAbility = defender.ability;
	} else if (defender.hasAbility("Dry Skin") && move.type === "Fire") {
		basePower = Math.floor(basePower * 1.25);
		description.defenderAbility = defender.ability;
	}

	////////////////////////////////
	////////// (SP)ATTACK //////////
	////////////////////////////////
	var attackStat = isPhysical ? AT : SA;
	description.attackEVs = attacker.evs[attackStat] +
            (NATURES[attacker.nature][0] === attackStat ? "+" : NATURES[attacker.nature][1] === attackStat ? "-" : "") + " " +
            toSmogonStat(attackStat);
	var attack;
	var attackBoost = attacker.boosts[attackStat];
	var rawAttack = attacker.rawStats[attackStat];
	if (attackBoost === 0 || (isCritical && attackBoost < 0)) {
		attack = rawAttack;
	} else if (defender.hasAbility("Unaware")) {
		attack = rawAttack;
		description.defenderAbility = defender.ability;
	} else if (attacker.ability === "Simple") {
		attack = getSimpleModifiedStat(rawAttack, attackBoost);
		description.attackerAbility = attacker.ability;
		description.attackBoost = attackBoost;
	} else {
		attack = getModifiedStat(rawAttack, attackBoost);
		description.attackBoost = attackBoost;
	}

	if (isPhysical && attacker.hasAbility("Pure Power", "Huge Power")) {
		attack *= 2;
		description.attackerAbility = attacker.ability;
	} else if (field.weather === "Sun" && (isPhysical ? attacker.hasAbility("Flower Gift") : attacker.hasAbility("Solar Power"))) {
		attack = Math.floor(attack * 1.5);
		description.attackerAbility = attacker.ability;
		description.weather = field.weather;
	} else if (isPhysical && (attacker.hasAbility("Hustle") || (attacker.hasAbility("Guts") && !attacker.hasStatus("Healthy")) || (!isPhysical && attacker.abilityOn && attacker.hasAbility("Plus", "Minus")))) {
		attack = Math.floor(attack * 1.5);
		description.attackerAbility = attacker.ability;
	} else if (isPhysical && attacker.ability === "Slow Start" && attacker.abilityOn) {
		attack = Math.floor(attack / 2);
		description.attackerAbility = attacker.ability;
	}

	if ((isPhysical ? attacker.hasItem("Choice Band") : attacker.hasItem("Choice Specs")) ||
            (attacker.hasItem("Soul Dew") && attacker.named("Latios", "Latias") && !isPhysical)) {
		attack = Math.floor(attack * 1.5);
		description.attackerItem = attacker.item;
	} else if ((attacker.hasItem("Light Ball") && attacker.named("Pikachu")) ||
            (attacker.hasItem("Thick Club") && attacker.named("Cubone", "Marowak") && isPhysical) ||
            (attacker.hasItem("Deep Sea Tooth") && attacker.named("Clamperl") && !isPhysical)) {
		attack *= 2;
		description.attackerItem = attacker.item;
	}

	////////////////////////////////
	///////// (SP)DEFENSE //////////
	////////////////////////////////
	var defenseStat = isPhysical ? DF : SD;
	description.defenseEVs = defender.evs[defenseStat] +
            (NATURES[defender.nature][0] === defenseStat ? "+" : NATURES[defender.nature][1] === defenseStat ? "-" : "") + " " +
            toSmogonStat(defenseStat);
	var defense;
	var defenseBoost = defender.boosts[defenseStat];
	var rawDefense = defender.rawStats[defenseStat];
	if (defenseBoost === 0 || (isCritical && defenseBoost > 0)) {
		defense = rawDefense;
	} else if (attacker.hasAbility("Unaware")) {
		defense = rawDefense;
		description.attackerAbility = attacker.ability;
	} else if (defender.hasAbility("Simple")) {
		defense = getSimpleModifiedStat(rawDefense, defenseBoost);
		description.defenderAbility = defender.ability;
		description.defenseBoost = defenseBoost;
	} else {
		defense = getModifiedStat(rawDefense, defenseBoost);
		description.defenseBoost = defenseBoost;
	}

	if (defender.hasAbility("Marvel Scale") && defender.status !== "Healthy" && isPhysical) {
		defense = Math.floor(defense * 1.5);
		description.defenderAbility = defender.ability;
	} else if (defender.hasAbility("Flower Gift") && field.weather === "Sun" && !isPhysical) {
		defense = Math.floor(defense * 1.5);
		description.defenderAbility = defender.ability;
		description.weather = field.weather;
	}

	if (defender.hasItem("Soul Dew") && defender.named("Latios", "Latias") && !isPhysical) {
		defense = Math.floor(defense * 1.5);
		description.defenderItem = defender.item;
	} else if ((defender.hasItem("Deep Sea Scale") && defender.named("Clamperl") && !isPhysical) ||
            (defender.hasItem("Metal Powder") && defender.named("Ditto") && isPhysical)) {
		defense *= 2;
		description.defenderItem = defender.item;
	}

	if (field.weather === "Sand" && (defender.hasType("Rock") && !isPhysical)) {
		defense = Math.floor(defense * 1.5);
		description.weather = field.weather;
	}

	if (move.name === "Explosion" || move.name === "Self-Destruct") {
		defense = Math.floor(defense * 0.5);
	}

	if (defense < 1) {
		defense = 1;
	}

	////////////////////////////////
	//////////// DAMAGE ////////////
	////////////////////////////////
	var baseDamage = Math.floor(Math.floor(Math.floor(2 * attacker.level / 5 + 2) * basePower * attack / 50) / defense);

	if (attacker.hasStatus("Burned") && isPhysical && attacker.ability !== "Guts") {
		baseDamage = Math.floor(baseDamage * 0.5);
		description.isBurned = true;
	}

	if (!isCritical) {
		var screenMultiplier = field.format !== "Singles" ? (2 / 3) : (1 / 2);
		if (isPhysical && field.isReflect) {
			baseDamage = Math.floor(baseDamage * screenMultiplier);
			description.isReflect = true;
		} else if (!isPhysical && field.isLightScreen) {
			baseDamage = Math.floor(baseDamage * screenMultiplier);
			description.isLightScreen = true;
		}
	}

	if (field.format !== "Singles" && move.isSpread) {
		baseDamage = Math.floor(baseDamage * 3 / 4);
	}

	if ((field.weather === "Sun" && move.type === "Fire") || (field.weather === "Rain" && move.type === "Water")) {
		baseDamage = Math.floor(baseDamage * 1.5);
		description.weather = field.weather;
	} else if ((field.weather === "Sun" && move.type === "Water") || (field.weather === "Rain" && move.type === "Fire") ||
            (field.hasWeather("Rain", "Sand", "Hail") !== -1 && move.name === "Solar Beam")) {
		baseDamage = Math.floor(baseDamage * 0.5);
		description.weather = field.weather;
	}

	if (attacker.hasAbility("Flash Fire") && attacker.abilityOn && move.type === "Fire") {
		baseDamage = Math.floor(baseDamage * 1.5);
		description.attackerAbility = "Flash Fire";
	}

	baseDamage += 2;

	if (isCritical) {
		if (attacker.hasAbility("Sniper")) {
			baseDamage *= 3;
			description.attackerAbility = attacker.ability;
		} else {
			baseDamage *= 2;
		}
		description.isCritical = isCritical;
	}

	if (attacker.hasItem("Life Orb")) {
		baseDamage = Math.floor(baseDamage * 1.3);
		description.attackerItem = attacker.item;
	}

	// the random factor is applied between the LO mod and the STAB mod, so don't apply anything below this until we're inside the loop
	var stabMod = 1;
	if (move.type === attacker.type1 || move.type === attacker.type2) {
		if (attacker.hasAbility("Adaptability")) {
			stabMod = 2;
			description.attackerAbility = attacker.ability;
		} else {
			stabMod = 1.5;
		}
	}

	var filterMod = 1;
	if (defender.hasAbility("Filter", "Solid Rock") && typeEffectiveness > 1) {
		filterMod = 0.75;
		description.defenderAbility = defender.ability;
	}
	var ebeltMod = 1;
	if (attacker.hasItem("Expert Belt") && typeEffectiveness > 1) {
		ebeltMod = 1.2;
		description.attackerItem = attacker.item;
	}
	var tintedMod = 1;
	if (attacker.hasAbility("Tinted Lens") && typeEffectiveness < 1) {
		tintedMod = 2;
		description.attackerAbility = attacker.ability;
	}
	var berryMod = 1;
	if (getBerryResistType(defender.item) === move.type && (typeEffectiveness > 1 || move.type === "Normal")) {
		berryMod = 0.5;
		description.defenderItem = defender.item;
	}

	var damage = [];
	for (var i = 0; i < 16; i++) {
		damage[i] = Math.floor(baseDamage * (85 + i) / 100);
		damage[i] = Math.floor(damage[i] * stabMod);
		damage[i] = Math.floor(damage[i] * typeEffect1);
		damage[i] = Math.floor(damage[i] * typeEffect2);
		damage[i] = Math.floor(damage[i] * filterMod);
		damage[i] = Math.floor(damage[i] * ebeltMod);
		damage[i] = Math.floor(damage[i] * tintedMod);
		damage[i] = Math.floor(damage[i] * berryMod);
		damage[i] = Math.max(1, damage[i]);
	}
	return {"damage": damage, "description": buildDescription(description)};
}

function getSimpleModifiedStat(stat, mod) {
	var simpleMod = Math.min(6, Math.max(-6, mod * 2));
	return simpleMod > 0 ? Math.floor(stat * (2 + simpleMod) / 2) :
		simpleMod < 0 ? Math.floor(stat * 2 / (2 - simpleMod)) :
			stat;
}
