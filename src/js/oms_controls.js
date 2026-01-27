/* eslint no-global-assign: 0 */
/*global LEGACY_STATS, randdex, setdex, setSelectValueIfValid, damageResults, PC_HANDLER, toID, timeoutFunc, calcHP, calcStats, resultLocations, calculateAllMoves, ITEMS_BY_ID, getItemBoostType */

/** A mapping of pokemon -> tier */
var pokemonTiers;

var CONVERSION_G9 = {
	"lc": 30, "nfe": 30, "zu": 30, "zubl": 30, "(pu)": 30, "pu": 30, "publ": 25, "nu": 25, "nubl": 20, "ru": 20,
	"rubl": 15, "uu": 15, "uubl": 0, "ou": 0, "(ou)": 0, "uber": 0, "illegal": 0, "unreleased": "0", "ag": 0, "cap": 0,
	"cap lc": 30, "cap nfe": 30
};
var CONVERSION_PREG9 = {
	"lc": 40, "nfe": 40, "zu": 40, "zubl": 40, "(pu)": 40, "pu": 40, "publ": 30, "nu": 30, "nubl": 20, "ru": 20,
	"rubl": 10, "uu": 10, "uubl": 0, "ou": 0, "(ou)": 0, "uber": 0, "illegal": 0, "unreleased": 0, "ag": 0, "cap": 0,
	"cap lc": 40, "cap nfe": 40
};
var specialCases = {
	//stone: [baby form, big form pair]
	"redorb": ["Groudon", "Groudon-Primal"],
	"blueorb": ["Kyogre", "Kyogre-Primal"],
	"zygardite": ["Zygarde-Complete", "Zygarde-Mega"],
	"floettite": ["Floette-Eternal", "Floette-Mega"],
	"rustedsword": ["Zacian", "Zacian-Crowned"],
	"rustedshield": ["Zamazenta", "Zamazenta-Crowned"],
	"griseouscore": ["Giratina", "Giratina-Origin"],
	"adamantcrystal": ["Dialga", "Dialga-Origin"],
	"lustrousglobe": ["Palkia", "Palkia-Origin"],
	"vilevial": ["Venomicon", "Venomicon-Epilogue"],
	"hearthflamemask": ["Ogerpon", "Ogerpon-Hearthflame"],
	"wellspringmask": ["Ogerpon", "Ogerpon-Wellspring"],
	"cornerstonemask": ["Ogerpon", "Ogerpon-Cornerstone"],

};

// need to know if we have to do a name switcheroo
var multMegas = {
	'Adamant Crystal': {'at': -20, 'df': 0, 'sa': 0, 'sd': 20, 'sp': 0, 'weight': 167, 'ability': 'Pressure', 'type': '', 'skip': ['Dialga-Origin']},
	'Griseous Core': {'at': 20, 'df': -20, 'sa': 20, 'sd': -20, 'sp': 0, 'weight': -100, 'ability': 'Levitate', 'type': '', 'skip': ['Giratina-Origin']},
	'Lustrous Globe': {'at': -20, 'df': 0, 'sa': 0, 'sd': 0, 'sp': 20, 'weight': 324, 'ability': 'Pressure', 'type': '', 'skip': ['Palkia-Origin']},
	'Vile Vial': {'at': 52, 'df': -28, 'sa': -56, 'sd': -5, 'sp': 37, 'weight': 0.9, 'ability': 'Tinted Lens', 'type': '', 'skip': ['Venomicon-Epilogue']},
	'Hearthflame Mask': {'at': 0, 'df': 0, 'sa': 0, 'sd': 0, 'sp': 0, 'weight': 0, 'ability': 'Mold Breaker', 'type': 'Fire', 'skip': ['Ogerpon-Hearthflame', 'Ogerpon-Hearthflame-Tera']},
	'Wellspring Mask': {'at': 0, 'df': 0, 'sa': 0, 'sd': 0, 'sp': 0, 'weight': 0, 'ability': 'Water Absorb', 'type': 'Water', 'skip': ['Ogerpon-Wellspring', 'Ogerpon-Wellspring-Tera']},
	'Cornerstone Mask': {'at': 0, 'df': 0, 'sa': 0, 'sd': 0, 'sp': 0, 'weight': 0, 'ability': 'Sturdy', 'type': 'Rock', 'skip': ['Ogerpon-Cornerstone', 'Ogerpon-Cornerstone-Tera']},
};
var megaDelta = {};
function generateMegaDelta(gen) {
	for (var item in ITEMS_BY_ID[gen]) {
		var baseForm = false;
		var bigForm = false;
		var bigFormName;
		if (ITEMS_BY_ID[gen][item].megaStone) {

			baseForm = pokedex[Object.keys(ITEMS_BY_ID[gen][item]['megaStone'])[0]];
			bigFormName = Object.values(ITEMS_BY_ID[gen][item]['megaStone'])[0];
			bigForm = pokedex[bigFormName];
		}
		if (specialCases[item]) {
			baseForm = pokedex[specialCases[item][0]];
			bigFormName = specialCases[item][1];
			bigForm = pokedex[bigFormName];
		}
		if (item.endsWith("plate")) {
			//console.log(item)
			baseForm = pokedex["Arceus"];
			bigFormName = "Arceus-" + getItemBoostType(ITEMS_BY_ID[gen][item]['name']);
			bigForm = pokedex[bigFormName];
		}
		if (baseForm && bigForm) {
			megaDelta[item] = {};
			// do not change hp
			for (var i = 1; i < LEGACY_STATS[gen].length; i++) {
				var statName = LEGACY_STATS[gen][i];
				megaDelta[item][statName] = bigForm['bs'][statName] - baseForm['bs'][statName];
			}
			megaDelta[item]['ability'] = bigForm['abilities'][0];
			if (bigForm['types'][1] != baseForm['types'][1]) {
				megaDelta[item]['type'] = bigForm['types'][1];
			}
			if (bigForm['types'][0] != baseForm['types'][0]) {
				megaDelta[item]['primaryType'] = bigForm['types'][0];
			}
			megaDelta[item]['weight'] = bigForm['weightkg'] - baseForm['weightkg'];
			megaDelta[item]['skip'] = bigFormName;
		}
	}
	//console.log(megaDelta)
}
function clamp(value, min, max) {
	return Math.min(Math.max(value, min), max);
}

function clampStats(stat) {
	return Math.floor(clamp(stat, 1, 255));
}
function calcMult(pokemon) {
	// rby should use special instead of spatk + spdef
	var special = pokemon.bs.sa ? pokemon.bs.sa + pokemon.bs.sd : pokemon.bs.sl;
	var bstScale = pokemon.bs.at + pokemon.bs.df + special + pokemon.bs.sp;
	// and 500 as scale base
	return (Object.keys(pokemon.bs).length * 100 - pokemon.bs.hp) / bstScale;
}

function autoUpdateStats(p) {
	var fullSetName = $(p + " .set-selector .select2-chosen").text();
	if (!fullSetName) return;
	var pokemonName, setName;
	pokemonName = fullSetName.substring(0, fullSetName.indexOf(" ("));
	setName = fullSetName.substring(fullSetName.indexOf("(") + 1, fullSetName.lastIndexOf(")"));
	var pokeObj = $(p);
	var abilityObj = pokeObj.find(".ability");
	var pokemon = pokedex[pokemonName];
	var randset = $("#randoms").prop("checked") ? randdex[pokemonName] : undefined;
	var regSets = pokemonName in setdex && setName in setdex[pokemonName];
	var set = regSets ? setdex[pokemonName][setName] : randset;
	// reset if no rules are set
	if (!(shouldUseTS || shouldUseScale || shouldUseMnM)) {
		for (var i = 1; i < LEGACY_STATS[gen].length; i++) {
			pokeObj.find("." + LEGACY_STATS[gen][i] + " .base").val(pokemon.bs[LEGACY_STATS[gen][i]]);
		}
		pokeObj.find(".type2").val(pokemon.types[1]);
		var abilityFallback = (typeof pokemon.abilities !== "undefined") ? pokemon.abilities[0] : "";
		if (typeof set !== 'undefined') {
			setSelectValueIfValid(abilityObj, set.ability, abilityFallback);
		} else {
			abilityObj.val(abilityFallback);
		}
	}
	var volatileCopy = structuredClone(pokemon);
	// mix and mega is top priority
	if (shouldUseMnM) {
		var itemObj = pokeObj.find(".item");
		var item = toID(itemObj.val());
		if (megaDelta[item] && megaDelta[item].skip.indexOf(pokemonName) < 0) {
			// change stats based on mega stone
			for (var i = 1; i < LEGACY_STATS[gen].length; i++) {
				var stat = LEGACY_STATS[gen][i];
				volatileCopy.bs[stat] = clampStats(pokemon.bs[stat] + megaDelta[item][stat]);
				pokeObj.find("." + stat + " .base").val(volatileCopy.bs[stat]);

			}
			// ability
			if (megaDelta[item]['ability']) {
				abilityObj.val(megaDelta[item]['ability']);
			}
		}
		// always try to change type to not make old stones permanent
		var deltaType = megaDelta[item] ? megaDelta[item].type : '';
		if (item === "Aggronite" || pokemon.types[0] == deltaType) {
			pokeObj.find(".type2").val("???");
		} else if (deltaType) {
			pokeObj.find(".type2").val(megaDelta[item]['type']);
		} else {
			pokeObj.find(".type2").val(pokemon.types[1]);
		}
		//staraptor-mega stone code (and technically every primary-changing-type)
		var deltaPrimaryType = megaDelta[item] ? megaDelta[item].primaryType : '';
		if (deltaPrimaryType && pokemon.types[1] === deltaPrimaryType) {
			pokeObj.find(".type2").val("???");
		}
		if (deltaPrimaryType) {
			pokeObj.find(".type1").val(megaDelta[item]['primaryType']);
		} else {
			pokeObj.find(".type1").val(pokemon.types[0]);
		}


	} else {
		pokeObj.find(".type1").val(pokemon.types[0]);
		pokeObj.find(".type2").val(pokemon.types[1]);
		var abilityFallback = (typeof pokemon.abilities !== "undefined") ? pokemon.abilities[0] : "";
		if (typeof set !== 'undefined') {
			setSelectValueIfValid(abilityObj, set.ability, abilityFallback);
		} else {
			abilityObj.val(abilityFallback);
	     }
	}
	// scale is second priority
	if (shouldUseScale) {
		var multiplier = calcMult(pokemon);
		for (var i = 1; i < LEGACY_STATS[gen].length; i++) {
			var stat = LEGACY_STATS[gen][i];
			volatileCopy.bs[stat] = clampStats(volatileCopy.bs[stat] * multiplier);
			pokeObj.find("." + stat + " .base").val(volatileCopy.bs[stat]);
		}
	}
	if (shouldUseTS) {
		// have to do it inside function cause of timing, has to be after gen is set
		// have a backup 0 just in case the tier doesn't exist ex: somehow failed to fetch
		var tier = pokemonTiers[toID(pokemonName)] || '';
		var tierAddon = (gen >= 9 ? CONVERSION_G9 : CONVERSION_PREG9)[tier.toLowerCase()] || 0;
		for (var i = 1; i < LEGACY_STATS[gen].length; i++) {
			var stat = LEGACY_STATS[gen][i];
			volatileCopy.bs[stat] = clampStats(volatileCopy.bs[stat] + tierAddon);
			pokeObj.find("." + stat + " .base").val(volatileCopy.bs[stat]);
		}
	}
	calcHP(pokeObj);
	calcStats(pokeObj);
}

var shouldUseMnM = false;
function toggleMNM() {
	shouldUseMnM = !shouldUseMnM;
	autoUpdateStats('#p1');
	autoUpdateStats('#p2');
	// mnm CAN change abilities and field conditions, we want to reset it just in case
	autosetWeather($("#p1 .ability").val(), 0);
	autosetTerrain($("#p1 .ability").val(), 0);
	autosetWeather($("#p2 .ability").val(), 0);
	autosetTerrain($("#p2 .ability").val(), 0);
}

var shouldUseTS = false;
function toggleTS() {
	shouldUseTS = !shouldUseTS;
	autoUpdateStats('#p1');
	autoUpdateStats('#p2');
}

var shouldUseScale = false;
function toggleScale() {
	shouldUseScale = !shouldUseScale;
	autoUpdateStats('#p1');
	autoUpdateStats('#p2');
}

function performCalculationsOM() {
	// this is in here because just having it onload is a race condition
	var p1info = $("#p1");
	var p2info = $("#p2");
	var p1 = createPokemon(p1info);
	var p2 = createPokemon(p2info);
	if (shouldUseMnM) {
		if (multMegas[p1.item]) {
			p1.alias = p1.name;
			p1.name = multMegas[p1.item].skip[0];
		}
		if (multMegas[p2.item]) {
			p2.alias = p2.name;
			p2.name = multMegas[p2.item].skip[0];
		}
	}
	var p1field = createField();
	var p2field = p1field.clone().swap();

	damageResults = calculateAllMoves(gen, p1, p1field, p2, p2field);
	if (p1['alias']) {
		p1.name = p1.alias;
	}
	if (p2['alias']) {
		p2.name = p2.alias;
	}
	var battling = [p1, p2];
	p1.maxDamages = [];
	p2.maxDamages = [];

	p1info.find(".sp .totalMod").text(p1.stats.spe);
	p2info.find(".sp .totalMod").text(p2.stats.spe);
	var fastestSide = p1.stats.spe > p2.stats.spe ? 0 : p1.stats.spe === p2.stats.spe ? "tie" : 1;

	var result, maxDamage;
	var bestResult;
	var zProtectAlerted = false;
	for (var i = 0; i < 4; i++) {
		// P1
		result = damageResults[0][i];
		// so the attacker is p1, defender is p2
		result.rawDesc.attackerName = p1.name;
		result.rawDesc.defenderName = p2.name;
		maxDamage = result.range()[1] * p1.moves[i].hits;
		if (!zProtectAlerted && maxDamage > 0 && p1.item.indexOf(" Z") === -1 && p1field.defenderSide.isProtected && p1.moves[i].isZ) {
			alert('Although only possible while hacking, Z-Moves fully damage through protect without a Z-Crystal');
			zProtectAlerted = true;
		}
		p1.maxDamages.push({moveOrder: i, maxDamage: maxDamage});
		p1.maxDamages.sort(function (firstMove, secondMove) {
			return secondMove.maxDamage - firstMove.maxDamage;
		});
		if (shouldUseMnM) {
			if (megaDelta[toID(result.attacker.item)]) {
				result.rawDesc.attackerItem = result.attacker.item;
			}
			if (megaDelta[toID(result.defender.item)]) {
				result.rawDesc.defenderItem = result.defender.item;
			}
		}
		$(resultLocations[0][i].move + " + label").text(p1.moves[i].name.replace("Hidden Power", "HP"));
		$(resultLocations[0][i].damage).text(result.moveDesc(notation));

		// P2
		result = damageResults[1][i];
		// so the attacker is p2, defender is p1
		result.rawDesc.attackerName = p2.name;
		result.rawDesc.defenderName = p1.name;
		maxDamage = result.range()[1] * p2.moves[i].hits;
		if (!zProtectAlerted && maxDamage > 0 && p2.item.indexOf(" Z") === -1 && p2field.defenderSide.isProtected && p2.moves[i].isZ) {
			alert('Although only possible while hacking, Z-Moves fully damage through protect without a Z-Crystal');
			zProtectAlerted = true;
		}
		p2.maxDamages.push({moveOrder: i, maxDamage: maxDamage});
		p2.maxDamages.sort(function (firstMove, secondMove) {
			return secondMove.maxDamage - firstMove.maxDamage;
		});
		if (shouldUseMnM) {
			if (megaDelta[toID(result.attacker.item)]) {
				result.rawDesc.attackerItem = result.attacker.item;
			}
			if (megaDelta[toID(result.defender.item)]) {
				result.rawDesc.defenderItem = result.defender.item;
			}
		}
		$(resultLocations[1][i].move + " + label").text(p2.moves[i].name.replace("Hidden Power", "HP"));
		$(resultLocations[1][i].damage).text(result.moveDesc(notation));

		// BOTH
		var bestMove;
		if (fastestSide === "tie") {
			// Technically the order should be random in a speed tie, but this non-determinism makes manual testing more difficult.
			// battling.sort(function () { return 0.5 - Math.random(); });
			bestMove = battling[0].maxDamages[0].moveOrder;
			var chosenPokemon = battling[0] === p1 ? "0" : "1";
			bestResult = $(resultLocations[chosenPokemon][bestMove].move);
		} else {
			bestMove = battling[fastestSide].maxDamages[0].moveOrder;
			bestResult = $(resultLocations[fastestSide][bestMove].move);
		}
	}
	if ($('.locked-move').length) {
		bestResult = $('.locked-move');
	} else {
		stickyMoves.setSelectedMove(bestResult.prop("id"));
	}
	bestResult.prop("checked", true);
	bestResult.change();
	$("#resultHeaderL").text(p1.name + "'s Moves (select one to show detailed results)");
	$("#resultHeaderR").text(p2.name + "'s Moves (select one to show detailed results)");
}

$("#p1 .item").bind("keyup change", function () {
	autoUpdateStats("#p1");
	autosetWeather($("#p1 .ability").val(), 0);
});

$("#p2 .item").bind("keyup change", function () {
	autoUpdateStats("#p2");
	autosetWeather($("#p2 .ability").val(), 0);
});
$(".om-trigger").prop("checked", false);
$(".om-trigger").change();
$(".ts-trigger").bind("change keyup", toggleTS);
$(".mnm-trigger").bind("change keyup", toggleMNM);
$(".scale-trigger").bind("change keyup", toggleScale);
$(".gen").change(function () {
	$.ajax({
		url: 'js/data/tiers/gen' + gen + '.json',
		async: false,
		dataType: 'json',
		success: function (response) {
			pokemonTiers = response;
		},
		error: function (_, textStatus, errorThrown) {
			alert("Error fetching tier data: " + textStatus + " " + errorThrown + "\n Tiers data will be set to a blank value, try refreshing.");
			pokemonTiers = {};
		}
	});
	generateMegaDelta(gen);
});
$(document).ready(function () {
	$(".calc-trigger").unbind("change keyup", PC_HANDLER);
	performCalculationsOM();
});
$(".calc-trigger").bind("change keyup", function () {
	setTimeout(performCalculationsOM, 0);
});
