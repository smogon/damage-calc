function CALCULATE_DAMAGE_RBY(gen, attacker, defender, move, field, attackerSideNum) {
	attacker.stats[AT] = Math.min(999, Math.max(1, getModifiedStat(attacker.rawStats[AT], attacker.boosts[AT])));
	attacker.stats[DF] = Math.min(999, Math.max(1, getModifiedStat(attacker.rawStats[DF], attacker.boosts[DF])));
	attacker.stats[SL] = Math.min(999, Math.max(1, getModifiedStat(attacker.rawStats[SL], attacker.boosts[SL])));
	attacker.stats[SP] = getFinalSpeed(gen, attacker, field, field.getSide(attackerSideNum));

	defender.stats[AT] = Math.min(999, Math.max(1, getModifiedStat(defender.rawStats[AT], defender.boosts[AT])));
	defender.stats[DF] = Math.min(999, Math.max(1, getModifiedStat(defender.rawStats[DF], defender.boosts[DF])));
	defender.stats[SL] = Math.min(999, Math.max(1, getModifiedStat(defender.rawStats[SL], defender.boosts[SL])));
	defender.stats[SP] = getFinalSpeed(gen, defender, field, field.getSide(1 - attackerSideNum));

	field = field.getSide(attackerSideNum);

	var description = {
		"attackerName": attacker.name,
		"moveName": move.name,
		"defenderName": defender.name
	};

	if (move.bp === 0) {
		return {"damage": [0], "description": description};
	}

	var lv = attacker.level;
	if (move.name === "Seismic Toss" || move.name === "Night Shade") {
		return {"damage": [lv], "description": description};
	}

	var typeEffect1 = TYPE_CHART[gen][move.type][defender.type1];
	var typeEffect2 = defender.type2 ? TYPE_CHART[gen][move.type][defender.type2] : 1;
	var typeEffectiveness = typeEffect1 * typeEffect2;

	if (typeEffectiveness === 0) {
		return {"damage": [0], "description": description};
	}

	if (move.hits > 1) {
		description.hits = move.hits;
	}

	var isPhysical = TYPE_CHART[gen][move.type].category === "Physical";
	var attackStat = isPhysical ? AT : SL;
	var defenseStat = isPhysical ? DF : SL;
	var at = attacker.stats[attackStat];
	var df = defender.stats[defenseStat];

	if (move.isCrit) {
		lv *= 2;
		at = attacker.rawStats[attackStat];
		df = defender.rawStats[defenseStat];
		description.isCritical = true;
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

	if (!move.isCrit) {
		if (isPhysical && field.isReflect) {
			df *= 2;
			description.isReflect = true;
		} else if (!isPhysical && field.isLightScreen) {
			df *= 2;
			description.isLightScreen = true;
		}
	}

	if (at > 255 || df > 255) {
		at = Math.floor(at / 4) % 256;
		df = Math.floor(df / 4) % 256;
	}

	var baseDamage = Math.min(997, Math.floor(Math.floor(Math.floor(2 * lv / 5 + 2) * Math.max(1, at) * move.bp / Math.max(1, df)) / 50)) + 2;
	if (move.type === attacker.type1 || move.type === attacker.type2) {
		baseDamage = Math.floor(baseDamage * 1.5);
	}
	baseDamage = Math.floor(baseDamage * typeEffectiveness);
	// If baseDamage >= 768, don't apply random factor? upokecenter says this, but nobody else does
	var damage = [];
	for (var i = 217; i <= 255; i++) {
		damage[i - 217] = Math.floor(baseDamage * i / 255);
	}
	return {"damage": damage, "description": description};
}
