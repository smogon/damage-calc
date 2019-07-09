function CALCULATE_DAMAGE_GSC(attacker, defender, move, field, attackerSideNum) {
	attacker.stats[AT] = Math.min(999, Math.max(1, getModifiedStat(attacker.rawStats[AT], attacker.boosts[AT])));
	attacker.stats[DF] = Math.min(999, Math.max(1, getModifiedStat(attacker.rawStats[DF], attacker.boosts[DF])));
	attacker.stats[SA] = Math.min(999, Math.max(1, getModifiedStat(attacker.rawStats[SA], attacker.boosts[SA])));
	attacker.stats[SD] = Math.min(999, Math.max(1, getModifiedStat(attacker.rawStats[SD], attacker.boosts[SD])));
	attacker.stats[SP] = getFinalSpeed(attacker, field, field.getSide(attackerSideNum));

	defender.stats[AT] = Math.min(999, Math.max(1, getModifiedStat(defender.rawStats[AT], defender.boosts[AT])));
	defender.stats[DF] = Math.min(999, Math.max(1, getModifiedStat(defender.rawStats[DF], defender.boosts[DF])));
	defender.stats[SA] = Math.min(999, Math.max(1, getModifiedStat(defender.rawStats[SA], defender.boosts[SA])));
	defender.stats[SD] = Math.min(999, Math.max(1, getModifiedStat(defender.rawStats[SD], defender.boosts[SD])));
	defender.stats[SP] = getFinalSpeed(defender, field, field.getSide(1 - attackerSideNum));

	field = field.getSide(attackerSideNum);

	var description = {
		"attackerName": attacker.name,
		"moveName": move.name,
		"defenderName": defender.name
	};

	if (move.bp === 0) {
		return {"damage": [0], "description": buildDescription(description)};
	}

	if (field.isProtected) {
		description.isProtected = true;
		return {"damage": [0], "description": buildDescription(description)};
	}

	var typeEffect1 = getMoveEffectiveness(move, defender.type1, field.isForesight);
	var typeEffect2 = defender.type2 ? getMoveEffectiveness(move, defender.type2, field.isForesight) : 1;
	var typeEffectiveness = typeEffect1 * typeEffect2;

	if (typeEffectiveness === 0) {
		return {"damage": [0], "description": buildDescription(description)};
	}

	var lv = attacker.level;
	if (move.name === "Seismic Toss" || move.name === "Night Shade") {
		return {"damage": [lv], "description": buildDescription(description)};
	}

	if (move.hits > 1) {
		description.hits = move.hits;
	}

	// Flail and Reversal are variable BP and never crit
	if (move.name === "Flail" || move.name === "Reversal") {
		move.isCrit = false;
		var p = Math.floor(48 * attacker.curHP / attacker.maxHP);
		move.bp = p <= 1 ? 200 : p <= 4 ? 150 : p <= 9 ? 100 : p <= 16 ? 80 : p <= 32 ? 40 : 20;
		description.moveBP = move.bp;
	}

	var isPhysical = typeChart[move.type].category === "Physical";
	var attackStat = isPhysical ? AT : SA;
	var defenseStat = isPhysical ? DF : SD;
	var at = attacker.stats[attackStat];
	var df = defender.stats[defenseStat];

	// ignore Reflect, Light Screen, stat stages, and burns if attack is a crit and attacker does not have stat stage advantage
	var ignoreMods = move.isCrit && attacker.boosts[attackStat] <= defender.boosts[defenseStat];

	if (ignoreMods) {
		at = attacker.rawStats[attackStat];
		df = defender.rawStats[defenseStat];
	} else {
		if (attacker.boosts[attackStat] !== 0) {
			description.attackBoost = attacker.boosts[attackStat];
		}
		if (defender.boosts[defenseStat] !== 0) {
			description.defenseBoost = defender.boosts[defenseStat];
		}
		if (isPhysical && attacker.hasStatus("Burned")) {
			at = Math.floor(at / 2);
			description.isBurned = true;
		}
	}

	if (move.name === "Explosion" || move.name === "Self-Destruct") {
		df = Math.floor(df / 2);
	}

	if (!ignoreMods) {
		if (isPhysical && field.isReflect) {
			df *= 2;
			description.isReflect = true;
		} else if (!isPhysical && field.isLightScreen) {
			df *= 2;
			description.isLightScreen = true;
		}
	}

	if ((attacker.named("Pikachu") && attacker.hasItem("Light Ball") && !isPhysical) ||
            (attacker.named("Cubone", "Marowak") && attacker.hasItem("Thick Club") && isPhysical)) {
		at *= 2;
		description.attackerItem = attacker.item;
	}

	if (at > 255 || df > 255) {
		at = Math.floor(at / 4) % 256;
		df = Math.floor(df / 4) % 256;
	}

	if (defender.named("Ditto") && defender.hasItem("Metal Powder")) {
		df = Math.floor(df * 1.5);
		description.defenderItem = defender.item;
	}

	var baseDamage = Math.floor(Math.floor(Math.floor(2 * lv / 5 + 2) * Math.max(1, at) * move.bp / Math.max(1, df)) / 50);

	if (move.isCrit) {
		baseDamage *= 2;
		description.isCritical = true;
	}

	if (getItemBoostType(attacker.item) === move.type) {
		baseDamage = Math.floor(baseDamage * 1.1);
		description.attackerItem = attacker.item;
	}

	baseDamage = Math.min(997, baseDamage) + 2;

	if ((field.hasWeather("Sun") && move.type === "Fire") || (field.hasWeather("Rain") && move.type === "Water")) {
		baseDamage = Math.floor(baseDamage * 1.5);
		description.weather = field.weather;
	} else if ((field.hasWeather("Sun") && move.type === "Water") || (field.hasWeather("Rain") && (move.type === "Fire" || move.name === "Solar Beam"))) {
		baseDamage = Math.floor(baseDamage / 2);
		description.weather = field.weather;
	}

	if (move.type === attacker.type1 || move.type === attacker.type2) {
		baseDamage = Math.floor(baseDamage * 1.5);
	}

	baseDamage = Math.floor(baseDamage * typeEffectiveness);

	// Flail and Reversal don't use random factor
	if (move.name === "Flail" || move.name === "Reversal") {
		return {"damage": [baseDamage], "description": buildDescription(description)};
	}

	var damage = [];
	for (var i = 217; i <= 255; i++) {
		damage[i - 217] = Math.floor(baseDamage * i / 255);
	}
	return {"damage": damage, "description": buildDescription(description)};
}
