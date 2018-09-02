if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function(searchElement, fromIndex) {
	var k;

	if (this == null) {
		throw new TypeError('"this" equals null or n is undefined');
	}

	var O = Object(this);

	var len = O.length >>> 0;

	if (len === 0) {
		return -1;
	}

	var n = +fromIndex || 0;

	if (Math.abs(n) === Infinity) {
		n = 0;
	}
	if (n >= len) {
		return -1;
	}

	k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
	while (k < len) {
		if (k in O && O[k] === searchElement) {
	    	return k;
	  	}
	  	k++;
	}
		return -1;
	};
}

// input field validation
var bounds = {
	"level": [0, 100],
	"base": [1, 255],
	"evs": [0, 252],
	"ivs": [0, 31],
	"dvs": [0, 15],
	"move-bp": [0, 999]
};
for (var bounded in bounds) {
	attachValidation(bounded, bounds[bounded][0], bounds[bounded][1]);
}
function attachValidation(clazz, min, max) {
	$("." + clazz).keyup(function () {
		validate($(this), min, max);
	});
}
function validate(obj, min, max) {
	obj.val(Math.max(min, Math.min(max, ~~obj.val())));
}

// auto-calc stats and current HP on change
$(".level").keyup(function () {
	var poke = $(this).closest(".poke-info");
	calcHP(poke);
	calcStats(poke);
});
$(".nature").bind("keyup change", function () {
	calcStats($(this).closest(".poke-info"));
});
$(".hp .base, .hp .evs, .hp .ivs").bind("keyup change", function () {
	calcHP($(this).closest(".poke-info"));
});
$(".at .base, .at .evs, .at .ivs").bind("keyup change", function () {
	calcStat($(this).closest(".poke-info"), 'at');
});
$(".df .base, .df .evs, .df .ivs").bind("keyup change", function () {
	calcStat($(this).closest(".poke-info"), 'df');
});
$(".sa .base, .sa .evs, .sa .ivs").bind("keyup change", function () {
	calcStat($(this).closest(".poke-info"), 'sa');
});
$(".sd .base, .sd .evs, .sd .ivs").bind("keyup change", function () {
	calcStat($(this).closest(".poke-info"), 'sd');
});
$(".sp .base, .sp .evs, .sp .ivs").bind("keyup change", function () {
	calcStat($(this).closest(".poke-info"), 'sp');
});
$(".sl .base").keyup(function () {
	calcStat($(this).closest(".poke-info"), 'sl');
});
$(".at .dvs").keyup(function () {
	var poke = $(this).closest(".poke-info");
	calcStat(poke, 'at');
	poke.find(".hp .dvs").val(getHPDVs(poke));
	calcHP(poke);
});
$(".df .dvs").keyup(function () {
	var poke = $(this).closest(".poke-info");
	calcStat(poke, 'df');
	poke.find(".hp .dvs").val(getHPDVs(poke));
	calcHP(poke);
});
$(".sa .dvs").keyup(function () {
	var poke = $(this).closest(".poke-info");
	calcStat(poke, 'sa');
	poke.find(".sd .dvs").val($(this).val());
	calcStat(poke, 'sd');
	poke.find(".hp .dvs").val(getHPDVs(poke));
	calcHP(poke);
});
$(".sp .dvs").keyup(function () {
	var poke = $(this).closest(".poke-info");
	calcStat(poke, 'sp');
	poke.find(".hp .dvs").val(getHPDVs(poke));
	calcHP(poke);
});
$(".sl .dvs").keyup(function () {
	var poke = $(this).closest(".poke-info");
	calcStat(poke, 'sl');
	poke.find(".hp .dvs").val(getHPDVs(poke));
	calcHP(poke);
});

function getHPDVs(poke) {
	return (~~poke.find(".at .dvs").val() % 2) * 8 +
(~~poke.find(".df .dvs").val() % 2) * 4 +
(~~poke.find(".sp .dvs").val() % 2) * 2 +
(~~poke.find(gen === 1 ? ".sl .dvs" : ".sa .dvs").val() % 2);
}

function calcStats(poke) {
	for (var i = 0; i < STATS.length; i++) {
		calcStat(poke, STATS[i]);
	}
}

function calcCurrentHP(poke, max, percent) {
	var current = Math.ceil(percent * max / 100);
	poke.find(".current-hp").val(current);
	drawHealthBar(poke, max, current);
}
function calcPercentHP(poke, max, current) {
	var percent = Math.floor(100 * current / max);
	poke.find(".percent-hp").val(percent);
	drawHealthBar(poke, max, current);
}
function drawHealthBar(poke, max, current) {
	var fillPercent = Math.floor(100 * current / max);
	var fillColor = fillPercent > 50 ? "green" : fillPercent > 20 ? "yellow" : "red";

	var healthbar = poke.find(".hpbar");
	healthbar.addClass("hp-" + fillColor);
	var unwantedColors = ["green", "yellow", "red"];
	unwantedColors.splice(unwantedColors.indexOf(fillColor), 1);
	for (i = 0; i < unwantedColors.length; i++) {
		healthbar.removeClass("hp-" + unwantedColors[i]);
	}
	
	healthbar.css("background", "linear-gradient(to right, " + fillColor + " " + fillPercent + "%, white 0%");
}
$(".current-hp").keyup(function () {
	var max = $(this).parent().children(".max-hp").text();
	validate($(this), 0, max);
	var current = $(this).val();
	calcPercentHP($(this).parent(), max, current);
});
$(".percent-hp").keyup(function () {
	var max = $(this).parent().children(".max-hp").text();
	validate($(this), 0, 100);
	var percent = $(this).val();
	calcCurrentHP($(this).parent(), max, percent);
});

$(".ability").bind("keyup change", function () {
	$(this).closest(".poke-info").find(".move-hits").val($(this).val() === 'Skill Link' ? 5 : 3);
});

$("#p1 .ability").bind("keyup change", function () {
	autosetWeather($(this).val(), 0);
	autosetTerrain($(this).val(), 0);
});

var lastManualWeather = "";
var lastAutoWeather = ["", ""];
function autosetWeather(ability, i) {
	var currentWeather = $("input:radio[name='weather']:checked").val();
	if (lastAutoWeather.indexOf(currentWeather) === -1) {
		lastManualWeather = currentWeather;
		lastAutoWeather[1 - i] = "";
	}
	switch (ability) {
	case "Drought":
		lastAutoWeather[i] = "Sun";
		$("#sun").prop("checked", true);
		break;
	case "Drizzle":
		lastAutoWeather[i] = "Rain";
		$("#rain").prop("checked", true);
		break;
	case "Sand Stream":
		lastAutoWeather[i] = "Sand";
		$("#sand").prop("checked", true);
		break;
	case "Snow Warning":
		lastAutoWeather[i] = "Hail";
		$("#hail").prop("checked", true);
		break;
	case "Desolate Land":
		lastAutoWeather[i] = "Harsh Sunshine";
		$("#harsh-sunshine").prop("checked", true);
		break;
	case "Primordial Sea":
		lastAutoWeather[i] = "Heavy Rain";
		$("#heavy-rain").prop("checked", true);
		break;
	case "Delta Stream":
		lastAutoWeather[i] = "Strong Winds";
		$("#strong-winds").prop("checked", true);
		break;
	default:
		lastAutoWeather[i] = "";
		var newWeather = lastAutoWeather[1 - i] !== "" ? lastAutoWeather[1 - i] : "";
		$("input:radio[name='weather'][value='" + newWeather + "']").prop("checked", true);
		break;
	}
}

var lastManualTerrain = "";
var lastAutoTerrain = ["", ""];
function autosetTerrain(ability, i) {
	var currentTerrain = $("input:checkbox[name='terrain']:checked").val() || "No terrain";
	if (lastAutoTerrain.indexOf(currentTerrain) === -1) {
		lastManualTerrain = currentTerrain;
		lastAutoTerrain[1 - i] = "";
	}
	// terrain input uses checkbox instead of radio, need to uncheck all first
	$("input:checkbox[name='terrain']:checked").prop("checked", false);
	switch (ability) {
	case "Electric Surge":
		lastAutoTerrain[i] = "Electric";
		$("#electric").prop("checked", true);
		break;
	case "Grassy Surge":
		lastAutoTerrain[i] = "Grassy";
		$("#grassy").prop("checked", true);
		break;
	case "Misty Surge":
		lastAutoTerrain[i] = "Misty";
		$("#misty").prop("checked", true);
		break;
	case "Psychic Surge":
		lastAutoTerrain[i] = "Psychic";
		$("#psychic").prop("checked", true);
		break;
	default:
		lastAutoTerrain[i] = "";
		var newTerrain = lastAutoTerrain[1 - i] !== "" ? lastAutoTerrain[1 - i] : lastManualTerrain;
		if ("No terrain" !== newTerrain) {
			$("input:checkbox[name='terrain'][value='" + newTerrain + "']").prop("checked", true);
		}
		break;
	}
}

$("#p1 .item").bind("keyup change", function () {
	autosetStatus("#p1", $(this).val());
});

var lastManualStatus = {"#p1": "Healthy"};
var lastAutoStatus = {"#p1": "Healthy"};
function autosetStatus(p, item) {
	var currentStatus = $(p + " .status").val();
	if (currentStatus !== lastAutoStatus[p]) {
		lastManualStatus[p] = currentStatus;
	}
	if (item === "Flame Orb") {
		lastAutoStatus[p] = "Burned";
		$(p + " .status").val("Burned");
		$(p + " .status").change();
	} else if (item === "Toxic Orb") {
		lastAutoStatus[p] = "Badly Poisoned";
		$(p + " .status").val("Badly Poisoned");
		$(p + " .status").change();
	} else {
		lastAutoStatus[p] = "Healthy";
		if (currentStatus !== lastManualStatus[p]) {
			$(p + " .status").val(lastManualStatus[p]);
			$(p + " .status").change();
		}
	}
}

$(".status").bind("keyup change", function () {
	if ($(this).val() === 'Badly Poisoned') {
		$(this).parent().children(".toxic-counter").show();
	} else {
		$(this).parent().children(".toxic-counter").hide();
	}
});

var lockerMove = "";
// auto-update move details on select
$(".move-selector").change(function () {
	var moveName = $(this).val();
	var move = moves[moveName] || moves['(No Move)'];
	var moveGroupObj = $(this).parent();
	moveGroupObj.children(".move-bp").val(move.bp);
	moveGroupObj.children(".move-type").val(move.type);
	moveGroupObj.children(".move-cat").val(move.category);
	moveGroupObj.children(".move-crit").prop("checked", move.alwaysCrit === true);
	moveGroupObj.children(".metronome").prop("disabled", !!move.dropsStats);
	if (move.isMultiHit) {
		moveGroupObj.children(".stat-drops").hide();
		moveGroupObj.children(".move-hits").show();
		moveGroupObj.children(".move-hits").val($(this).closest(".poke-info").find(".ability").val() === 'Skill Link' ? 5 : 3);
		moveGroupObj.children(".move-hits").val($(this).closest(".poke-info").find(".item").val() === 'Grip Claw' ? 5 : 3);
	} else if (move.dropsStats) {
		moveGroupObj.children(".move-hits").hide();
		moveGroupObj.children(".stat-drops").show();
	} else {
		moveGroupObj.children(".move-hits").hide();
		moveGroupObj.children(".stat-drops").hide();
	}
	moveGroupObj.children(".move-z").prop("checked", false);
});

$(".item").change(function () {
	var itemName = $(this).val();
	var $metronomeControl = $(this).closest('.poke-info').find('.metronome');
	if (itemName === "Metronome") {
		$metronomeControl.show();
	} else {
		$metronomeControl.hide();
	}
});

// auto-update set details on select
$(".set-selector").change(function () {
	var fullSetName = $(this).val();
	var pokemonName, setName;
	pokemonName = fullSetName.substring(0, fullSetName.indexOf(" ("));
	setName = fullSetName.substring(fullSetName.indexOf("(") + 1, fullSetName.lastIndexOf(")"));
	var pokemon = pokedex[pokemonName];
	if (pokemon) {
		var pokeObj = $(this).closest(".poke-info");
		if (stickyMoves.getSelectedSide() === pokeObj.prop("id")) {
			stickyMoves.clearStickyMove();
		}
		pokeObj.find(".type1").val(pokemon.t1);
		pokeObj.find(".type2").val(pokemon.t2);
		pokeObj.find(".hp .base").val(pokemon.bs.hp);
		var i;
		for (i = 0; i < STATS.length; i++) {
			pokeObj.find("." + STATS[i] + " .base").val(pokemon.bs[STATS[i]]);
		}
		pokeObj.find(".weight").val(pokemon.w);
		pokeObj.find(".boost").val(0);
		pokeObj.find(".percent-hp").val(100);
		pokeObj.find(".status").val("Healthy");
		$(".status").change();
		var moveObj;
		var abilityObj = pokeObj.find(".ability");
		var itemObj = pokeObj.find(".item");
		if (pokemonName in setdex && setName in setdex[pokemonName]) {
			var set = setdex[pokemonName][setName];
			pokeObj.find(".level").val(set.level);
			pokeObj.find(".hp .evs").val((set.evs && set.evs.hp !== undefined) ? set.evs.hp : 0);
			pokeObj.find(".hp .ivs").val((set.ivs && set.ivs.hp !== undefined) ? set.ivs.hp : 31);
			pokeObj.find(".hp .dvs").val((set.dvs && set.dvs.hp !== undefined) ? set.dvs.hp : 15);
			for (i = 0; i < STATS.length; i++) {
				pokeObj.find("." + STATS[i] + " .evs").val((set.evs && set.evs[STATS[i]] !== undefined) ? set.evs[STATS[i]] : 0);
				pokeObj.find("." + STATS[i] + " .ivs").val((set.ivs && set.ivs[STATS[i]] !== undefined) ? set.ivs[STATS[i]] : 31);
				pokeObj.find("." + STATS[i] + " .dvs").val((set.dvs && set.dvs[STATS[i]] !== undefined) ? set.dvs[STATS[i]] : 15);
			}
			setSelectValueIfValid(pokeObj.find(".nature"), set.nature, "Hardy");
			setSelectValueIfValid(abilityObj, pokemon.ab ? pokemon.ab : set.ability, "");
			setSelectValueIfValid(itemObj, set.item, "");
			for (i = 0; i < 4; i++) {
				moveObj = pokeObj.find(".move" + (i + 1) + " select.move-selector");
				setSelectValueIfValid(moveObj, set.moves[i], "(No Move)");
				moveObj.change();
			}
		} else {
			pokeObj.find(".level").val(100);
			pokeObj.find(".hp .evs").val(0);
			pokeObj.find(".hp .ivs").val(31);
			pokeObj.find(".hp .dvs").val(15);
			for (i = 0; i < STATS.length; i++) {
				pokeObj.find("." + STATS[i] + " .evs").val(0);
				pokeObj.find("." + STATS[i] + " .ivs").val(31);
				pokeObj.find("." + STATS[i] + " .dvs").val(15);
			}
			pokeObj.find(".nature").val("Hardy");
			setSelectValueIfValid(abilityObj, pokemon.ab, "");
			itemObj.val("");
			for (i = 0; i < 4; i++) {
				moveObj = pokeObj.find(".move" + (i + 1) + " select.move-selector");
				moveObj.val("(No Move)");
				moveObj.change();
			}
		}
		if (typeof getSelectedTiers === "function") { // doesn't exist when in 1vs1 mode
			var format = getSelectedTiers()[0];
			if (format === "LC") pokeObj.find(".level").val(5);
			if (_.startsWith(format, "VGC")) pokeObj.find(".level").val(50);
		}
		var formeObj = $(this).siblings().find(".forme").parent();
		itemObj.prop("disabled", false);
		if (pokemon.formes) {
			showFormes(formeObj, setName, pokemonName, pokemon);
		} else {
			formeObj.hide();
		}
		calcHP(pokeObj);
		calcStats(pokeObj);
		abilityObj.change();
		itemObj.change();
		if (pokemon.gender === "genderless") {
			pokeObj.find(".gender").parent().hide();
			pokeObj.find(".gender").val("");
		} else pokeObj.find(".gender").parent().show();
	}
});

function showFormes(formeObj, setName, pokemonName, pokemon) {
	var defaultForme = 0;

	if (setName !== 'Blank Set') {
		var set = setdex[pokemonName][setName];
		if (set.item) {
			// Repurpose the previous filtering code to provide the "different default" logic
			if ((set.item.indexOf('ite') !== -1 && set.item.indexOf('ite Y') === -1) ||
	            (pokemonName === "Groudon" && set.item.indexOf("Red Orb") !== -1) ||
	            (pokemonName === "Kyogre" && set.item.indexOf("Blue Orb") !== -1) ||
	            (pokemonName === "Meloetta" && set.moves.indexOf("Relic Song") !== -1) ||
	            (pokemonName === "Rayquaza" && set.moves.indexOf("Dragon Ascent") !== -1)) {
				defaultForme = 1;
			} else if (set.item.indexOf('ite Y') !== -1) {
				defaultForme = 2;
			}
		}
	}

	var formeOptions = getSelectOptions(pokemon.formes, false, defaultForme);
	formeObj.children("select").find("option").remove().end().append(formeOptions).change();
	formeObj.show();
}

function setSelectValueIfValid(select, value, fallback) {
	select.val(select.children("option[value='" + value + "']").length ? value : fallback);
}

$(".forme").change(function () {
	var altForme = pokedex[$(this).val()],
		container = $(this).closest(".info-group").siblings(),
		fullSetName = container.find(".select2-chosen").first().text(),
		pokemonName = fullSetName.substring(0, fullSetName.indexOf(" (")),
		setName = fullSetName.substring(fullSetName.indexOf("(") + 1, fullSetName.lastIndexOf(")"));

	$(this).parent().siblings().find(".type1").val(altForme.t1);
	$(this).parent().siblings().find(".type2").val(altForme.t2 ? altForme.t2 : "");
	$(this).parent().siblings().find(".weight").val(altForme.w);

	for (var i = 0; i < STATS.length; i++) {
		var baseStat = container.find("." + STATS[i]).find(".base");
		baseStat.val(altForme.bs[STATS[i]]);
		baseStat.keyup();
	}
	var chosenSet = setdex[pokemonName][setName];
	if (abilities.indexOf(altForme.ab) !== -1) {
		container.find(".ability").val(altForme.ab);
	} else {
		container.find(".ability").val(chosenSet.ability);
	}
	container.find(".ability").keyup();

	if ($(this).val().indexOf("-Mega") !== -1 && $(this).val() !== "Rayquaza-Mega") {
		container.find(".item").val("").keyup();
	} else {
		container.find(".item").prop("disabled", false);
	}
});


function Pokemon(pokeInfo) {
	if (typeof pokeInfo === "string") { // in this case, pokeInfo is the id of an individual setOptions value whose moveset's tier matches the selected tier(s)
		this.name = pokeInfo.substring(0, pokeInfo.indexOf(" ("));
		var setName = pokeInfo.substring(pokeInfo.indexOf("(") + 1, pokeInfo.lastIndexOf(")"));
		var pokemon = pokedex[this.name];
		this.type1 = pokemon.t1;
		this.type2 = (pokemon.t2 && typeof pokemon.t2 !== "undefined") ? pokemon.t2 : "";
		this.rawStats = [];
		this.boosts = [];
		this.stats = [];
		this.evs = [];

		var set = setdex[this.name][setName];
		this.level = set.level;
		this.HPEVs = (set.evs && typeof set.evs.hp !== "undefined") ? set.evs.hp : 0;
		if (gen < 3) {
			var HPDVs = 15;
			this.maxHP = ~~(((pokemon.bs.hp + HPDVs) * 2 + 63) * this.level / 100) + this.level + 10;
		} else if (pokemon.bs.hp === 1) {
			this.maxHP = 1;
		} else {
			var HPIVs = 31;
			this.maxHP = ~~((pokemon.bs.hp * 2 + HPIVs + ~~(this.HPEVs / 4)) * this.level / 100) + this.level + 10;
		}
		this.curHP = this.maxHP;
		this.nature = set.nature;
		for (var i = 0; i < STATS.length; i++) {
			var stat = STATS[i];
			this.boosts[stat] = 0;
			this.evs[stat] = (set.evs && typeof set.evs[stat] !== "undefined") ? set.evs[stat] : 0;
			if (gen < 3) {
				var dvs = 15;
				this.rawStats[stat] = ~~(((pokemon.bs[stat] + dvs) * 2 + 63) * this.level / 100) + 5;
			} else {
				var ivs = (set.ivs && typeof set.ivs[stat] !== "undefined") ? set.ivs[stat] : 31;
				var natureMods = NATURES[this.nature];
				var nature = natureMods[0] === stat ? 1.1 : natureMods[1] === stat ? 0.9 : 1;
				this.rawStats[stat] = ~~((~~((pokemon.bs[stat] * 2 + ivs + ~~(this.evs[stat] / 4)) * this.level / 100) + 5) * nature);
			}
		}
		this.ability = (set.ability && typeof set.ability !== "undefined") ? set.ability :
			(pokemon.ab && typeof pokemon.ab !== "undefined") ? pokemon.ab : "";
		this.item = (set.item && typeof set.item !== "undefined" && (set.item === "Eviolite" || set.item.indexOf("ite") < 0)) ? set.item : "";
		this.status = "Healthy";
		this.toxicCounter = 0;
		this.moves = [];
		for (var i = 0; i < 4; i++) {
			var moveName = set.moves[i];
			var defaultDetails = moves[moveName] || moves['(No Move)'];
			this.moves.push($.extend({}, defaultDetails, {
				name: (defaultDetails.bp === 0) ? "(No Move)" : moveName,
				bp: defaultDetails.bp,
				type: defaultDetails.type,
				category: defaultDetails.category,
				isCrit: !!defaultDetails.alwaysCrit,
				hits: defaultDetails.isMultiHit ? ((this.ability === "Skill Link" || this.item === "Grip Claw") ? 5 : 3) : defaultDetails.isTwoHit ? 2 : 1,
				usedTimes: defaultDetails.usedTimes
			}));
		}
		this.weight = pokemon.w;
		this.gender = pokemon.gender ? "genderless" : "Male";
	} else {
		var setName = pokeInfo.find("input.set-selector").val();
		if (setName.indexOf("(") === -1) {
			this.name = setName;
		} else {
			var pokemonName = setName.substring(0, setName.indexOf(" ("));
			this.name = (pokedex[pokemonName].formes) ? pokeInfo.find(".forme").val() : pokemonName;
		}
		this.type1 = pokeInfo.find(".type1").val();
		this.type2 = pokeInfo.find(".type2").val();
		this.level = ~~pokeInfo.find(".level").val();
		this.maxHP = ~~pokeInfo.find(".hp .total").text();
		this.curHP = ~~pokeInfo.find(".current-hp").val();
		this.HPEVs = ~~pokeInfo.find(".hp .evs").val();
		this.rawStats = [];
		this.boosts = [];
		this.stats = [];
		this.evs = [];
		for (var i = 0; i < STATS.length; i++) {
			this.rawStats[STATS[i]] = ~~pokeInfo.find("." + STATS[i] + " .total").text();
			this.boosts[STATS[i]] = ~~pokeInfo.find("." + STATS[i] + " .boost").val();
			this.evs[STATS[i]] = ~~pokeInfo.find("." + STATS[i] + " .evs").val();
		}
		this.nature = pokeInfo.find(".nature").val();
		this.ability = pokeInfo.find(".ability").val();
		this.item = pokeInfo.find(".item").val();
		this.status = pokeInfo.find(".status").val();
		this.toxicCounter = this.status === 'Badly Poisoned' ? ~~pokeInfo.find(".toxic-counter").val() : 0;
		this.moves = [
			getMoveDetails(pokeInfo.find(".move1"), this.item),
			getMoveDetails(pokeInfo.find(".move2"), this.item),
			getMoveDetails(pokeInfo.find(".move3"), this.item),
			getMoveDetails(pokeInfo.find(".move4"), this.item)
		];
		this.weight = +pokeInfo.find(".weight").val();
		this.gender = pokeInfo.find(".gender").is(":visible") ? pokeInfo.find(".gender").val() : "genderless";
	}

	this.hasType = function(type) {
		return this.type1 === type || this.type2 === type;
	};
}

function getMoveDetails(moveInfo, item) {
	var moveName = moveInfo.find("select.move-selector").val();
	var defaultDetails = moves[moveName];
	var isZMove = gen >= 7 && moveInfo.find("input.move-z").prop("checked");

	// If z-move is checked but there isn't a corresponding z-move, use the original move
	if (isZMove && "zp" in defaultDetails) {
		var zMoveName = getZMoveName(moveName, defaultDetails.type, item);
		return $.extend({}, moves[zMoveName], {
			name: zMoveName,
			bp: moves[zMoveName].bp === 1 ? defaultDetails.zp : moves[zMoveName].bp,
			category: defaultDetails.category,
			isCrit: moveInfo.find(".move-crit").prop("checked"),
			hits: 1
		});
	} else {
		return $.extend({}, defaultDetails, {
			name: moveName,
			bp: ~~moveInfo.find(".move-bp").val(),
			type: moveInfo.find(".move-type").val(),
			category: moveInfo.find(".move-cat").val(),
			isCrit: moveInfo.find(".move-crit").prop("checked"),
			hits: defaultDetails.isMultiHit ? ~~moveInfo.find(".move-hits").val() : defaultDetails.isTwoHit ? 2 : 1,
			usedTimes: defaultDetails.dropsStats ? ~~moveInfo.find(".stat-drops").val() : 1,
			metronomeCount : moveInfo.find(".metronome").is(':visible') ? ~~moveInfo.find(".metronome").val() : 1
		});
	}
}

function getZMoveName(moveName, moveType, item) {
	return moveName.indexOf("Hidden Power") !== -1 ? "Breakneck Blitz" : // Hidden Power will become Breakneck Blitz
		moveName === "Clanging Scales" && item === "Kommonium Z" ? "Clangorous Soulblaze" :
			moveName === "Darkest Lariat" && item === "Incinium Z" ? "Malicious Moonsault" :
				moveName === "Giga Impact" && item === "Snorlium Z" ? "Pulverizing Pancake" :
					moveName === "Moongeist Beam" && item === "Lunalium Z" ? "Menacing Moonraze Maelstrom" :
						moveName === "Photon Geyser" && item === "Ultranecrozium Z" ? "Light That Burns the Sky" :
							moveName === "Play Rough" && item === "Mimikium Z" ? "Let\'s Snuggle Forever" :
								moveName === "Psychic" && item === "Mewnium Z" ? "Genesis Supernova" :
									moveName === "Sparkling Aria" && item === "Primarium Z" ? "Oceanic Operetta" :
										moveName === "Spectral Thief" && item === "Marshadium Z" ? "Soul-Stealing 7-Star Strike" :
											moveName === "Spirit Shackle" && item === "Decidium Z" ? "Sinister Arrow Raid" :
												moveName === "Stone Edge" && item === "Lycanium Z" ? "Splintered Stormshards" :
													moveName === "Sunsteel Strike" && item === "Solganium Z" ? "Searing Sunraze Smash" :
														moveName === "Thunderbolt" && item === "Aloraichium Z" ? "Stoked Sparksurfer" :
															moveName === "Thunderbolt" && item === "Pikashunium Z" ? "10,000,000 Volt Thunderbolt" :
																moveName === "Volt Tackle" && item === "Pikanium Z" ? "Catastropika" :
																	moveName === "Nature\'s Madness" && item === "Tapunium Z" ? "Guardian of Alola" :
																		ZMOVES_TYPING[moveType];
}

function Field() {
	var format = $("input:radio[name='format']:checked").val();
	var isGravity = $("#gravity").prop("checked");
	var isSR = [$("#srL").prop("checked"), $("#srR").prop("checked")];
	var weather;
	var spikes;
	if (gen === 2) {
		spikes = [$("#gscSpikesL").prop("checked") ? 1 : 0, $("#gscSpikesR").prop("checked") ? 1 : 0];
		weather = $("input:radio[name='gscWeather']:checked").val();
	} else {
		weather = $("input:radio[name='weather']:checked").val();
		spikes = [~~$("input:radio[name='spikesL']:checked").val(), ~~$("input:radio[name='spikesR']:checked").val()];
	}
	var terrain = ($("input:checkbox[name='terrain']:checked").val()) ? $("input:checkbox[name='terrain']:checked").val() : "";
	var isReflect = [$("#reflectL").prop("checked"), $("#reflectR").prop("checked")];
	var isLightScreen = [$("#lightScreenL").prop("checked"), $("#lightScreenR").prop("checked")];
	var isProtected = [$("#protectL").prop("checked"), $("#protectR").prop("checked")];
	var isSeeded = [$("#leechSeedL").prop("checked"), $("#leechSeedR").prop("checked")];
	var isForesight = [$("#foresightL").prop("checked"), $("#foresightR").prop("checked")];
	var isHelpingHand = [$("#helpingHandR").prop("checked"), $("#helpingHandL").prop("checked")]; // affects attacks against opposite side
	var isFriendGuard = [$("#friendGuardL").prop("checked"), $("#friendGuardR").prop("checked")];
	var isAuroraVeil = [$("#auroraVeilL").prop("checked"), $("#auroraVeilR").prop("checked")];

	this.getWeather = function () {
		return weather;
	};
	this.clearWeather = function () {
		weather = "";
	};
	this.getSide = function (i) {
		return new Side(format, terrain, weather, isGravity, isSR[i], spikes[i], isReflect[i], isLightScreen[i], isProtected[i], isSeeded[1 - i], isSeeded[i], isForesight[i], isHelpingHand[i], isFriendGuard[i], isAuroraVeil[i]);
	};
}

function Side(format, terrain, weather, isGravity, isSR, spikes, isReflect, isLightScreen, isProtected, isAttackerSeeded, isDefenderSeeded, isForesight, isHelpingHand, isFriendGuard, isAuroraVeil) {
	this.format = format;
	this.terrain = terrain;
	this.weather = weather;
	this.isGravity = isGravity;
	this.isSR = isSR;
	this.spikes = spikes;
	this.isReflect = isReflect;
	this.isLightScreen = isLightScreen;
	this.isProtected = isProtected;
	this.isAttackerSeeded = isAttackerSeeded;
	this.isDefenderSeeded = isDefenderSeeded;
	this.isForesight = isForesight;
	this.isHelpingHand = isHelpingHand;
	this.isFriendGuard = isFriendGuard;
	this.isAuroraVeil = isAuroraVeil;
}

var gen, genWasChanged, notation, pokedex, setdex, typeChart, moves, abilities, items, STATS, calcHP, calcStat;

$(".gen").change(function () {
	gen = ~~$(this).val();
	genWasChanged = true;
	switch (gen) {
	case 1:
		pokedex = POKEDEX_RBY;
		setdex = SETDEX_RBY;
		typeChart = TYPE_CHART_RBY;
		moves = MOVES_RBY;
		items = [];
		abilities = [];
		STATS = STATS_RBY;
		calcHP = CALC_HP_RBY;
		calcStat = CALC_STAT_RBY;
		break;
	case 2:
		pokedex = POKEDEX_GSC;
		setdex = SETDEX_GSC;
		typeChart = TYPE_CHART_GSC;
		moves = MOVES_GSC;
		items = ITEMS_GSC;
		abilities = [];
		STATS = STATS_GSC;
		calcHP = CALC_HP_RBY;
		calcStat = CALC_STAT_RBY;
		break;
	case 3:
		pokedex = POKEDEX_ADV;
		setdex = SETDEX_ADV;
		typeChart = TYPE_CHART_GSC;
		moves = MOVES_ADV;
		items = ITEMS_ADV;
		abilities = ABILITIES_ADV;
		STATS = STATS_GSC;
		calcHP = CALC_HP_ADV;
		calcStat = CALC_STAT_ADV;
		break;
	case 4:
		pokedex = POKEDEX_DPP;
		setdex = SETDEX_DPP;
		typeChart = TYPE_CHART_GSC;
		moves = MOVES_DPP;
		items = ITEMS_DPP;
		abilities = ABILITIES_DPP;
		STATS = STATS_GSC;
		calcHP = CALC_HP_ADV;
		calcStat = CALC_STAT_ADV;
		break;
	case 5:
		pokedex = POKEDEX_BW;
		setdex = SETDEX_BW;
		typeChart = TYPE_CHART_GSC;
		moves = MOVES_BW;
		items = ITEMS_BW;
		abilities = ABILITIES_BW;
		STATS = STATS_GSC;
		calcHP = CALC_HP_ADV;
		calcStat = CALC_STAT_ADV;
		break;
	case 6:
		pokedex = POKEDEX_XY;
		setdex = SETDEX_XY;
		typeChart = TYPE_CHART_XY;
		moves = MOVES_XY;
		items = ITEMS_XY;
		abilities = ABILITIES_XY;
		STATS = STATS_GSC;
		calcHP = CALC_HP_ADV;
		calcStat = CALC_STAT_ADV;
		break;
	default:
		pokedex = POKEDEX_SM;
		setdex = SETDEX_SM;
		typeChart = TYPE_CHART_XY;
		moves = MOVES_SM;
		items = ITEMS_SM;
		abilities = ABILITIES_SM;
		STATS = STATS_GSC;
		calcHP = CALC_HP_ADV;
		calcStat = CALC_STAT_ADV;
	}
	clearField();
	$("#importedSets").prop("checked", false);
	loadDefaultLists();
	$(".gen-specific.g" + gen).show();
	$(".gen-specific").not(".g" + gen).hide();
	var typeOptions = getSelectOptions(Object.keys(typeChart));
	$("select.type1, select.move-type").find("option").remove().end().append(typeOptions);
	$("select.type2").find("option").remove().end().append("<option value=\"\">(none)</option>" + typeOptions);
	var moveOptions = getSelectOptions(Object.keys(moves), true);
	$("select.move-selector").find("option").remove().end().append(moveOptions);
	var abilityOptions = getSelectOptions(abilities, true);
	$("select.ability").find("option").remove().end().append("<option value=\"\">(other)</option>" + abilityOptions);
	var itemOptions = getSelectOptions(items, true);
	$("select.item").find("option").remove().end().append("<option value=\"\">(none)</option>" + itemOptions);

	$(".set-selector").val(getSetOptions()[gen < 3 ? 3 : 1].id);
	$(".set-selector").change();
});

$(".notation").change(function () {
	notation = $(this).val();
});

function clearField() {
	$("#singles-format").prop("checked", true);
	$("#clear").prop("checked", true);
	$("#gscClear").prop("checked", true);
	$("#gravity").prop("checked", false);
	$("#srL").prop("checked", false);
	$("#srR").prop("checked", false);
	$("#spikesL0").prop("checked", true);
	$("#spikesR0").prop("checked", true);
	$("#gscSpikesL").prop("checked", false);
	$("#gscSpikesR").prop("checked", false);
	$("#reflectL").prop("checked", false);
	$("#reflectR").prop("checked", false);
	$("#lightScreenL").prop("checked", false);
	$("#lightScreenR").prop("checked", false);
	$("#protectL").prop("checked", false);
	$("#protectR").prop("checked", false);
	$("#leechSeedL").prop("checked", false);
	$("#leechSeedR").prop("checked", false);
	$("#foresightL").prop("checked", false);
	$("#foresightR").prop("checked", false);
	$("#helpingHandL").prop("checked", false);
	$("#helpingHandR").prop("checked", false);
	$("#friendGuardL").prop("checked", false);
	$("#friendGuardR").prop("checked", false);
	$("#auroraVeilL").prop("checked", false);
	$("#auroraVeilR").prop("checked", false);
	$("input:checkbox[name='terrain']").prop("checked", false);
}

function getSetOptions(sets) {
	var setsHolder = sets;
	if (setsHolder === undefined) {
		setsHolder = pokedex;
	}
	var pokeNames = Object.keys(setsHolder);
	pokeNames.sort();
	var setOptions = [];
	var idNum = 0;
	for (var i = 0; i < pokeNames.length; i++) {
		var pokeName = pokeNames[i];
		setOptions.push({
			pokemon: pokeName,
			text: pokeName
		});
		if (pokeName in setdex) {
			var setNames = Object.keys(setdex[pokeName]);
			for (var j = 0; j < setNames.length; j++) {
				var setName = setNames[j];
				setOptions.push({
					pokemon: pokeName,
					set: setName,
					text: pokeName + " (" + setName + ")",
					id: pokeName + " (" + setName + ")",
					isCustom: setdex[pokeName][setName].isCustomSet,
					nickname: setdex[pokeName][setName].nickname || "" 
				});
			}
		}
		setOptions.push({
			pokemon: pokeName,
			set: "Blank Set",
			text: pokeName + " (Blank Set)",
			id: pokeName + " (Blank Set)"
		});
	}
	return setOptions;
}

function getSelectOptions(arr, sort) {
	if (sort) {
		arr.sort();
	}
	var r = '';
	for (var i = 0; i < arr.length; i++) {
		r += '<option value="' + arr[i] + '">' + arr[i] + '</option>';
	}
	return r;
}
var stickyMoves = (function () {
	var lastClicked = 'resultMoveL1';
	$(".result-move").click(function () {
		if (this.id === lastClicked) {
			$(this).toggleClass("locked-move");
		} else {
			$('.locked-move').removeClass('locked-move');
		}
		lastClicked = this.id;
	});

	return {
		clearStickyMove: function () {
			lastClicked = null;
			$('.locked-move').removeClass('locked-move');
		},
		setSelectedMove: function (slot) {
			lastClicked = slot;
		},
		getSelectedSide: function () {
			if (lastClicked) {
				if (lastClicked.indexOf('resultMoveL') !== -1) {
					return 'p1';
				} else if (lastClicked.indexOf('resultMoveR') !== -1) {
					return 'p2';
				}
			}
			return null;
		}
	};
})();

function isGrounded(pokeInfo) {
	return $("#gravity").prop("checked") || (
		pokeInfo.find(".type1").val() !== "Flying" &&
        pokeInfo.find(".type2").val() !== "Flying" &&
        pokeInfo.find(".ability").val() !== "Levitate" &&
        pokeInfo.find(".item").val() !== "Air Balloon"
	);
}

function getTerrainEffects() {
	var className = $(this).prop("className");
	className = className.substring(0, className.indexOf(" "));
	switch (className) {
	case "type1":
	case "type2":
	case "item":
		var id = $(this).closest(".poke-info").prop("id");
		var terrainValue = $("input:checkbox[name='terrain']:checked").val();
		if (terrainValue === "Electric") {
			$("#" + id).find("[value='Asleep']").prop("disabled", isGrounded($("#" + id)));
		} else if (terrainValue === "Misty") {
			$("#" + id).find(".status").prop("disabled", isGrounded($("#" + id)));
		}
		break;
	case "ability":
		// with autoset, ability change may cause terrain change, need to consider both sides
		var terrainValue = $("input:checkbox[name='terrain']:checked").val();
		if (terrainValue === "Electric") {
			$("#p1").find(".status").prop("disabled", false);
			$("#p2").find(".status").prop("disabled", false);
			$("#p1").find("[value='Asleep']").prop("disabled", isGrounded($("#p1")));
			$("#p2").find("[value='Asleep']").prop("disabled", isGrounded($("#p2")));
		} else if (terrainValue === "Misty") {
			$("#p1").find(".status").prop("disabled", isGrounded($("#p1")));
			$("#p2").find(".status").prop("disabled", isGrounded($("#p2")));
		} else {
			$("#p1").find("[value='Asleep']").prop("disabled", false);
			$("#p1").find(".status").prop("disabled", false);
			$("#p2").find("[value='Asleep']").prop("disabled", false);
			$("#p2").find(".status").prop("disabled", false);
		}
		break;
	default:
		$("input:checkbox[name='terrain']").not(this).prop("checked", false);
		if ($(this).prop("checked") && $(this).val() === "Electric") {
			// need to enable status because it may be disabled by Misty Terrain before.
			$("#p1").find(".status").prop("disabled", false);
			$("#p2").find(".status").prop("disabled", false);
			$("#p1").find("[value='Asleep']").prop("disabled", isGrounded($("#p1")));
			$("#p2").find("[value='Asleep']").prop("disabled", isGrounded($("#p2")));
		} else if ($(this).prop("checked") && $(this).val() === "Misty") {
			$("#p1").find(".status").prop("disabled", isGrounded($("#p1")));
			$("#p2").find(".status").prop("disabled", isGrounded($("#p2")));
		} else {
			$("#p1").find("[value='Asleep']").prop("disabled", false);
			$("#p1").find(".status").prop("disabled", false);
			$("#p2").find("[value='Asleep']").prop("disabled", false);
			$("#p2").find(".status").prop("disabled", false);
		}
		break;
	}
}

function loadDefaultLists() {
	$(".set-selector").select2({
		formatResult: function (object) {
			return object.set ? ("&nbsp;&nbsp;&nbsp;" + object.set) : ("<b>" + object.text + "</b>");
		},
		query: function (query) {
			var pageSize = 30;
			var results = _.filter(getSetOptions(), function (option) {
				var pokeName = option.pokemon.toUpperCase();
				return !query.term || query.term.toUpperCase().split(" ").every(function (term) {
					return pokeName.indexOf(term) === 0 || pokeName.indexOf("-" + term) >= 0 || pokeName.indexOf(" " + term) >= 0;
				});
			});
			query.callback({
				results: results.slice((query.page - 1) * pageSize, query.page * pageSize),
				more: results.length >= query.page * pageSize
			});
		},
		initSelection: function (element, callback) {
			var data = getSetOptions()[gen < 3 ? 3 : 1];
			callback(data);
		}
	});
}

function bothPokemon(selector) {
	return "#p1 " + selector + ", #p2 " + selector; 
}

function loadCustomList(id) {
	var customSetsOptions = getSetOptions(customSets);
	$("#" + id + " .set-selector").select2({
			formatResult: function(set){
				return (set.nickname ? set.pokemon + " (" + set.nickname + ")" : set.id);
			},
			query: function(query){
				var pageSize = 20;
				var results = _.filter(getSetOptions(), function(option){
					if (option.isCustom) {
						return (option.nickname ? option.pokemon + " (" + option.nickname + ")" : option.id);
					}
				});
				query.callback({
					results: results,
					more: results.length >= query.page * pageSize
				});
			},
			initSelection: function(element, callback){
				var data = "";
				callback(data);
			}
		});
}

$(document).ready(function () {
	$("#gen7").prop("checked", true);
	$("#gen7").change();
	$("#percentage").prop("checked", true);
	$("#percentage").change();
	loadDefaultLists();
	$(".move-selector").select2({
		dropdownAutoWidth: true,
		matcher: function (term, text) {
			// 2nd condition is for Hidden Power
			return text.toUpperCase().indexOf(term.toUpperCase()) === 0 || text.toUpperCase().indexOf(" " + term.toUpperCase()) >= 0;
		}
	});
	$(".set-selector").val(getSetOptions()[gen < 3 ? 3 : 1].id);
	$(".set-selector").change();
	$(".terrain-trigger").bind("change keyup", getTerrainEffects);
});
