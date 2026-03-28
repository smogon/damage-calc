function placeBsBtn() {
	var importBtn = "<button id='import' class='bs-btn bs-btn-default'>Import</button>";
	$("#import-1_wrapper").append(importBtn);

	$("#import.bs-btn").click(function () {
		var pokes = document.getElementsByClassName("import-team-text")[0].value;
		var name = document.getElementsByClassName("import-name-text")[0].value.trim() === "" ? "Custom Set" : document.getElementsByClassName("import-name-text")[0].value;
		addSets(pokes, name);
	});
}

function ExportPokemon(pokeInfo) {
	var pokemon = createPokemon(pokeInfo);
	var gender = pokeInfo.find(".gender").val() || 'N';
	var EV_counter = 0;
	var finalText = checkExceptionsExport(pokemon.name);
	if (gender !== 'N') finalText += " (" + gender + ")";
	if (pokemon.item) finalText += " @ " + pokemon.item;
	finalText += "\n";
	if (pokemon.ability) finalText += "Ability: " + pokemon.ability + "\n";
	if (pokemon.level !== 100) finalText += "Level: " + pokemon.level + "\n";
	if (gen === 9) {
		var teraType = pokeInfo.find(".teraType").val();
		if (teraType !== undefined && teraType !== pokemon.types[0]) {
			finalText += "Tera Type: " + teraType + "\n";
		}
	}
	if (gen > 2) {
		var EVs_Array = [];
		for (var stat in pokemon.evs) {
			var ev = pokemon.evs[stat] ? pokemon.evs[stat] : 0;
			if (ev > 0) {
				EVs_Array.push(ev + " " + calc.Stats.displayStat(stat));
			}
			EV_counter += ev;
			if (EV_counter > 510) break;
		}
		if (EVs_Array.length > 0) {
			finalText += "EVs: ";
			finalText += serialize(EVs_Array, " / ");
			finalText += "\n";
		}
	}
	if (pokemon.nature && gen > 2) finalText += pokemon.nature + " Nature" + "\n";
	var IVs_Array = [];
	for (var stat in pokemon.ivs) {
		var iv = pokemon.ivs[stat] ? pokemon.ivs[stat] : 0;
		if (iv < 31) {
			IVs_Array.push(iv + " " + calc.Stats.displayStat(stat));
		}
	}
	if (IVs_Array.length > 0) {
		finalText += "IVs: ";
		finalText += serialize(IVs_Array, " / ");
		finalText += "\n";
	}

	for (var i = 0; i < 4; i++) {
		var moveName = pokemon.moves[i].name;
		if (moveName !== "(No Move)") {
			finalText += "- " + moveName + "\n";
		}
	}
	finalText = finalText.trim();
	$("textarea.import-team-text").val(finalText);
}

$("#exportL").click(function () {
	ExportPokemon($("#p1"));
});

$("#exportR").click(function () {
	ExportPokemon($("#p2"));
});

function serialize(array, separator) {
	var text = "";
	for (var i = 0; i < array.length; i++) {
		if (i < array.length - 1) {
			text += array[i] + separator;
		} else {
			text += array[i];
		}
	}
	return text;
}

function statToLegacyStat(stat) {
	switch (stat) {
	case 'hp':
		return "hp";
	case 'atk':
		return "at";
	case 'def':
		return "df";
	case 'spa':
		return "sa";
	case 'spd':
		return "sd";
	case 'spe':
		return "sp";
	}
}

function findSpecies(row) {
	row = row.split(/[()@]/);
	// Skip if the row contains the ability As One (Spectrier / Glastrier),
	// so that it is not treated as a separate Pokemon.
	if (row.length > 0 && row[0].includes('As One')) return {offset: undefined};
	var name;
	var offset;
	for (var j = 0; j < row.length && offset === undefined; j++) {
		name = checkExceptionsImport(row[j].trim());
		if (calc.SPECIES[9][name] !== undefined) offset = j;
	}
	return {name: name, offset: offset};
}

function getGender(currentRow, j) {
	var gender;
	for (; j < currentRow.length; j++) {
		gender = currentRow[j].trim();
		if (gender === 'M' || gender === 'F' || gender === 'N') return gender;
	}
}

function getItem(currentRow, j) {
	var item;
	for (; j < currentRow.length; j++) {
		item = currentRow[j].trim();
		if (calc.ITEMS[9].indexOf(item) !== -1) return item;
	}
}

function getStats(currentPoke, rows, x) {
	currentPoke.nature = "Serious";
	var currentEV;
	var currentIV;
	var currentNature;
	currentPoke.level = 100;
	for (; x < rows.length && findSpecies(rows[x]).offset === undefined; x++) {
		var currentRow = rows[x] ? rows[x].split(/[/:]/) : '';
		var evs = {};
		var ivs = {};
		var ev;
		var ability;
		var teraType;
		var j;

		switch (currentRow[0]) {
		case 'Level':
			currentPoke.level = parseInt(currentRow[1].trim());
			break;
		case 'EVs':
			for (j = 1; j < currentRow.length; j++) {
				currentEV = currentRow[j].trim().split(" ");
				currentEV[1] = statToLegacyStat(currentEV[1].toLowerCase());
				evs[currentEV[1]] = parseInt(currentEV[0]);
			}
			currentPoke.evs = evs;
			break;
		case 'IVs':
			for (j = 1; j < currentRow.length; j++) {
				currentIV = currentRow[j].trim().split(" ");
				currentIV[1] = statToLegacyStat(currentIV[1].toLowerCase());
				ivs[currentIV[1]] = parseInt(currentIV[0]);
			}
			currentPoke.ivs = ivs;
			break;
		case 'Ability':
			ability = currentRow[1] ? currentRow[1].trim() : '';
			if (calc.ABILITIES[9].indexOf(ability) !== -1) currentPoke.ability = ability;
			break;
		case 'Tera Type':
			teraType = currentRow[1] ? currentRow[1].trim() : '';
			if (Object.keys(calc.TYPE_CHART[9]).slice(1).indexOf(teraType) !== -1) currentPoke.teraType = teraType;
			break;
		}

		currentNature = rows[x] ? rows[x].trim().split(" ") : '';
		if (currentNature[1] === "Nature" && currentNature[0] != "-") currentPoke.nature = currentNature[0];
	}
	return currentPoke;
}

function getMoves(currentPoke, rows, x) {
	var movesFound = false;
	var move;
	var moves = [];
	for (; x < rows.length && findSpecies(rows[x]).offset === undefined; x++) {
		if (rows[x]) {
			if (rows[x][0] === "-") {
				movesFound = true;
				move = rows[x].slice(2).replace("[", "").replace("]", "").trim().replace(/\s+/g, " ");
				moves.push(move);
			} else if (movesFound === true) {
				break;
			}
		}
	}
	currentPoke.moves = moves;
	return currentPoke;
}

function addToDex(poke) {
	var dexObject = {};
	if ($("#randoms").prop("checked")) {
		if (GEN9RANDOMBATTLE[poke.name] == undefined) GEN9RANDOMBATTLE[poke.name] = {};
		if (GEN8RANDOMBATTLE[poke.name] == undefined) GEN8RANDOMBATTLE[poke.name] = {};
		if (GEN7RANDOMBATTLE[poke.name] == undefined) GEN7RANDOMBATTLE[poke.name] = {};
		if (GEN6RANDOMBATTLE[poke.name] == undefined) GEN6RANDOMBATTLE[poke.name] = {};
		if (GEN5RANDOMBATTLE[poke.name] == undefined) GEN5RANDOMBATTLE[poke.name] = {};
		if (GEN4RANDOMBATTLE[poke.name] == undefined) GEN4RANDOMBATTLE[poke.name] = {};
		if (GEN3RANDOMBATTLE[poke.name] == undefined) GEN3RANDOMBATTLE[poke.name] = {};
		if (GEN2RANDOMBATTLE[poke.name] == undefined) GEN2RANDOMBATTLE[poke.name] = {};
		if (GEN1RANDOMBATTLE[poke.name] == undefined) GEN1RANDOMBATTLE[poke.name] = {};
	} else {
		if (SETDEX_SV[poke.name] == undefined) SETDEX_SV[poke.name] = {};
		if (SETDEX_SS[poke.name] == undefined) SETDEX_SS[poke.name] = {};
		if (SETDEX_SM[poke.name] == undefined) SETDEX_SM[poke.name] = {};
		if (SETDEX_XY[poke.name] == undefined) SETDEX_XY[poke.name] = {};
		if (SETDEX_BW[poke.name] == undefined) SETDEX_BW[poke.name] = {};
		if (SETDEX_DPP[poke.name] == undefined) SETDEX_DPP[poke.name] = {};
		if (SETDEX_ADV[poke.name] == undefined) SETDEX_ADV[poke.name] = {};
		if (SETDEX_GSC[poke.name] == undefined) SETDEX_GSC[poke.name] = {};
		if (SETDEX_RBY[poke.name] == undefined) SETDEX_RBY[poke.name] = {};
	}
	if (poke.ability !== undefined) {
		dexObject.ability = poke.ability;
	}
	if (poke.teraType !== undefined) {
		dexObject.teraType = poke.teraType;
	}
	dexObject.level = poke.level;
	dexObject.evs = poke.evs;
	dexObject.ivs = poke.ivs;
	dexObject.moves = poke.moves;
	dexObject.nature = poke.nature;
	dexObject.gender = poke.gender;
	dexObject.item = poke.item;
	dexObject.isCustomSet = poke.isCustomSet;
	var customsets;
	if (localStorage.customsets) {
		customsets = JSON.parse(localStorage.customsets);
	} else {
		customsets = {};
	}
	if (!customsets[poke.name]) {
		customsets[poke.name] = {};
	}
	customsets[poke.name][poke.nameProp] = dexObject;
	if (poke.name === "Aegislash-Blade") {
		if (!customsets["Aegislash-Shield"]) customsets["Aegislash-Shield"] = {};
		if (!customsets["Aegislash-Both"]) customsets["Aegislash-Both"] = {};
		customsets["Aegislash-Shield"][poke.nameProp] = dexObject;
		customsets["Aegislash-Both"][poke.nameProp] = dexObject;
	}
	updateDex(customsets);
}

function updateDex(customsets) {
	for (var pokemon in customsets) {
		for (var moveset in customsets[pokemon]) {
			if (!SETDEX_SV[pokemon]) SETDEX_SV[pokemon] = {};
			SETDEX_SV[pokemon][moveset] = customsets[pokemon][moveset];
			if (!SETDEX_SS[pokemon]) SETDEX_SS[pokemon] = {};
			SETDEX_SS[pokemon][moveset] = customsets[pokemon][moveset];
			if (!SETDEX_SM[pokemon]) SETDEX_SM[pokemon] = {};
			SETDEX_SM[pokemon][moveset] = customsets[pokemon][moveset];
			if (!SETDEX_XY[pokemon]) SETDEX_XY[pokemon] = {};
			SETDEX_XY[pokemon][moveset] = customsets[pokemon][moveset];
			if (!SETDEX_BW[pokemon]) SETDEX_BW[pokemon] = {};
			SETDEX_BW[pokemon][moveset] = customsets[pokemon][moveset];
			if (!SETDEX_DPP[pokemon]) SETDEX_DPP[pokemon] = {};
			SETDEX_DPP[pokemon][moveset] = customsets[pokemon][moveset];
			if (!SETDEX_ADV[pokemon]) SETDEX_ADV[pokemon] = {};
			SETDEX_ADV[pokemon][moveset] = customsets[pokemon][moveset];
			if (!SETDEX_GSC[pokemon]) SETDEX_GSC[pokemon] = {};
			SETDEX_GSC[pokemon][moveset] = customsets[pokemon][moveset];
			if (!SETDEX_RBY[pokemon]) SETDEX_RBY[pokemon] = {};
			SETDEX_RBY[pokemon][moveset] = customsets[pokemon][moveset];
		}
	}
	localStorage.customsets = JSON.stringify(customsets);
}

function addSets(pokes, name) {
	var rows = pokes.split("\n");
	var currentRow;
	var species;
	var currentPoke;
	var addedPokes = 0;
	for (var i = 0; i < rows.length; i++) {
		species = findSpecies(rows[i]);
		if (species.offset !== undefined) {
			currentRow = rows[i].split(/[()@]/);
			currentPoke = JSON.parse(JSON.stringify(calc.SPECIES[9][species.name]));
			currentPoke.name = species.name;
			currentPoke.gender = getGender(currentRow, species.offset + 1);
			currentPoke.item = getItem(currentRow, species.offset + 1);
			currentPoke = getStats(currentPoke, rows, i + 1);
			currentPoke = getMoves(currentPoke, rows, i + 1);
			if (species.offset === 1 && currentRow[0].trim()) {
				currentPoke.nameProp = currentRow[0].trim();
			} else {
				currentPoke.nameProp = name;
			}
			currentPoke.isCustomSet = true;
			addToDex(currentPoke);
			addedPokes++;
		}
	}
	if (addedPokes > 0) {
		alert("Successfully imported " + addedPokes + (addedPokes === 1 ? " set" : " sets"));
		$(allPokemon("#importedSetsOptions")).css("display", "inline");
	} else {
		alert("No sets imported, please check your syntax and try again");
	}
}

function checkExceptionsImport(poke) {
	switch (poke) {
	case 'Alcremie-Vanilla-Cream':
	case 'Alcremie-Ruby-Cream':
	case 'Alcremie-Matcha-Cream':
	case 'Alcremie-Mint-Cream':
	case 'Alcremie-Lemon-Cream':
	case 'Alcremie-Salted-Cream':
	case 'Alcremie-Ruby-Swirl':
	case 'Alcremie-Caramel-Swirl':
	case 'Alcremie-Rainbow-Swirl':
		poke = "Alcremie";
		break;
	case 'Aegislash':
	case 'Aegislash-Both':
		poke = "Aegislash-Blade";
		break;
	case 'Basculin-Red-Striped':
		poke = "Basculin";
		break;
	case 'Burmy-Plant':
	case 'Burmy-Sandy':
	case 'Burmy-Trash':
		poke = "Burmy";
		break;
	case 'Calyrex-Ice-Rider':
		poke = "Calyrex-Ice";
		break;
	case 'Calyrex-Shadow-Rider':
		poke = "Calyrex-Shadow";
		break;
	case 'Deerling-Summer':
	case 'Deerling-Autumn':
	case 'Deerling-Winter':
	case 'Deerling-Spring':
		poke = "Deerling";
		break;
	case 'Flabébé-Blue':
	case 'Flabébé-Orange':
	case 'Flabébé-Red':
	case 'Flabébé-White':
	case 'Flabébé-Yellow':
	case 'Flabebe':
	case 'Flabebe-Blue':
	case 'Flabebe-Orange':
	case 'Flabebe-Red':
	case 'Flabebe-White':
	case 'Flabebe-Yellow':
		poke = "Flabébé";
		break;
	case 'Floette-Blue':
	case 'Floette-Orange':
	case 'Floette-Red':
	case 'Floette-White':
	case 'Floette-Yellow':
		poke = "Floette";
		break;
	case 'Florges-Blue':
	case 'Florges-Orange':
	case 'Florges-Red':
	case 'Florges-White':
	case 'Florges-Yellow':
		poke = "Florges";
		break;
	case 'Furfrou-Dandy':
	case 'Furfrou-Debutante':
	case 'Furfrou-Diamond':
	case 'Furfrou-Heart':
	case 'Furfrou-Kabuki':
	case 'Furfrou-La-Reine':
	case 'Furfrou-Matron':
	case 'Furfrou-Natural':
	case 'Furfrou-Pharaoh':
	case 'Furfrou-Star':
		poke = "Furfrou";
		break;
	case 'Gastrodon-East':
	case 'Gastrodon-West':
		poke = "Gastrodon";
		break;
	case 'Giratina-Altered':
		poke = "Giratina";
		break;
	case 'Gourgeist-Average':
	case 'Gourgeist-Medium':
		poke = "Gourgeist";
		break;
	case 'Gourgeist-Jumbo':
		poke = "Gourgeist-Super";
		break;
	case 'Mimikyu-Busted-Totem':
		poke = "Mimikyu-Totem";
		break;
	case 'Mimikyu-Busted':
		poke = "Mimikyu";
		break;
	case 'Minior-Red':
	case 'Minior-Orange':
	case 'Minior-Yellow':
	case 'Minior-Green':
	case 'Minior-Blue':
	case 'Minior-Indigo':
	case 'Minior-Violet':
		poke = "Minior";
		break;
	case 'Poltchageist-Artisan':
	case 'Poltchageist-Counterfeit':
		poke = "Poltchageist";
		break;
	case 'Polteageist-Antique':
	case 'Polteageist-Phony':
		poke = "Polteageist";
		break;
	case 'Pumpkaboo-Average':
	case 'Pumpkaboo-Medium':
		poke = "Pumpkaboo";
		break;
	case 'Pumpkaboo-Jumbo':
		poke = "Pumpkaboo-Super";
		break;
	case 'Sawsbuck-Summer':
	case 'Sawsbuck-Autumn':
	case 'Sawsbuck-Winter':
	case 'Sawsbuck-Spring':
		poke = "Sawsbuck";
		break;
	case 'Shellos-East':
	case 'Shellos-West':
		poke = "Shellos";
		break;
	case 'Sinistcha-Masterpiece':
	case 'Sinistcha-Unremarkable':
		poke = "Sinistcha";
		break;
	case 'Sinistea-Antique':
	case 'Sinistea-Phony':
		poke = "Sinistea";
		break;
	case 'Tastugiri-Curly':
		poke = "Tatsugiri";
		break;
	case 'Unown-A':
	case 'Unown-B':
	case 'Unown-C':
	case 'Unown-D':
	case 'Unown-E':
	case 'Unown-F':
	case 'Unown-G':
	case 'Unown-H':
	case 'Unown-I':
	case 'Unown-J':
	case 'Unown-K':
	case 'Unown-L':
	case 'Unown-M':
	case 'Unown-N':
	case 'Unown-O':
	case 'Unown-P':
	case 'Unown-Q':
	case 'Unown-R':
	case 'Unown-S':
	case 'Unown-T':
	case 'Unown-U':
	case 'Unown-V':
	case 'Unown-W':
	case 'Unown-X':
	case 'Unown-Y':
	case 'Unown-Z':
	case 'Unown-Exclamation':
	case 'Unown-Question':
		poke = "Unown";
		break;
	case 'Vivillon-Archipelago':
	case 'Vivillon-Continental':
	case 'Vivillon-Elegant':
	case 'Vivillon-Garden':
	case 'Vivillon-High Plains':
	case 'Vivillon-Icy Snow':
	case 'Vivillon-Meadow':
	case 'Vivillon-Modern':
	case 'Vivillon-Monsoon':
	case 'Vivillon-Ocean':
	case 'Vivillon-Polar':
	case 'Vivillon-River':
	case 'Vivillon-Sandstorm':
	case 'Vivillon-Savanna':
	case 'Vivillon-Sun':
	case 'Vivillon-Tundra':
		poke = "Vivillon";
		break;
	case 'Vivillon-Pokéball':
		poke = "Vivillon-Pokeball";
		break;
	case 'Wormadam-Plant':
		poke = "Wormadam";
		break;
	case 'Xerneas-Neutral':
		poke = "Xerneas";
		break;
	}
	return poke;
}

function checkExceptionsExport(name) {
	switch (name) {
	case 'Aegislash-Shield':
	case 'Aegislash-Both':
		name = "Aegislash";
		break;
	}
	return name;
}

$(allPokemon("#clearSets")).click(function () {
	if (confirm("Are you sure you want to delete your custom sets? This action cannot be undone.")) {
		localStorage.removeItem("customsets");
		alert("Custom Sets successfully cleared. Please refresh the page.");
		$(allPokemon("#importedSetsOptions")).hide();
		loadDefaultLists();
	}
});

$(allPokemon("#importedSets")).click(function () {
	var pokeID = $(this).parent().parent().prop("id");
	var showCustomSets = $(this).prop("checked");
	if (showCustomSets) {
		loadCustomList(pokeID);
	} else {
		loadDefaultLists();
	}
});

$(document).ready(function () {
	var customSets;
	placeBsBtn();
	if (localStorage.customsets) {
		customSets = JSON.parse(localStorage.customsets);
		updateDex(customSets);
		$(allPokemon("#importedSetsOptions")).css("display", "inline");
	} else {
		loadDefaultLists();
	}
});
