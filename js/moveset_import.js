function placeBsBtn() {
	var importBtn = "<button class='bs-btn bs-btn-default'>Import</button>";
	$("#import-1_wrapper").append(importBtn);
	$(".bs-btn").click(function () {
		var pokes = document.getElementsByClassName("import-team-text")[0].value;
		addSets(pokes);
	});


}
function getAbility(row) {
	ability = row[1] ? row[1].trim() : '';
	if (ABILITIES_SM.indexOf(ability) != -1) {
		return (ability);

	} else {
		return;

	}

}

function statConverter(stat) {
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

function getStats(currentPoke, rows, offset) {
	currentPoke.nature = "Serious";
	var currentEV;
	var currentIV;
	var currentNature;
	currentPoke.level = 100;
	for (var x = offset; x < offset + 7; x++) {
		var currentRow = rows[x] ? rows[x].split(/[/:]/) : '';
		var evs = {};
		var ivs = {};
		var ev;

		switch (currentRow[0]) {
		case 'Level':
			currentPoke.level = parseInt(currentRow[1].trim());
			break;
		case 'EVs':

			for (j = 1; j < currentRow.length; j++) {
				currentEV = currentRow[j].trim().split(" ");
				currentEV[1] = statConverter(currentEV[1].toLowerCase());
				evs[currentEV[1]] = parseInt(currentEV[0]);

			}
			currentPoke.evs = evs;
			break;
		case 'IVs':
			for (j = 1; j < currentRow.length; j++) {
				currentIV = currentRow[j].trim().split(" ");
				currentIV[1] = statConverter(currentIV[1].toLowerCase());
				ivs[currentIV[1]] = parseInt(currentIV[0]);
			}
			currentPoke.ivs = ivs;
			break;

		}
		currentNature = rows[x] ? rows[x].trim().split(" ") : '';
		if (currentNature[1] == "Nature") {
			currentPoke.nature = currentNature[0];

		}
	}
	return currentPoke;


}

function getItem(currentRow, j) {
	for (;j < currentRow.length; j++) {
		var item = currentRow[j].trim();
		if (ITEMS_SM.indexOf(item) != -1) {
			return item;

		}
	}
	return;

}

function getMoves(currentPoke, rows, offset) {
	var movesFound = false;
	var moves = [];
	for (var x = offset; x < offset + 12; x++) {

		if (rows[x]) {
			if (rows[x][0] == "-") {
				movesFound = true;

				var move = rows[x].substr(2, rows[x].length - 2).replace("[", "").replace("]", "").replace("  ", "");
				moves.push(move);

			} else {
				if (movesFound == true) {
					break;

				}

			}
		}
	}
	currentPoke.moves = moves;
	return currentPoke;


}

function addToDex(poke) {
	var dexObject = {};
	if (SETDEX_SM[poke.name] == undefined) SETDEX_SM[poke.name] = {};
	if (SETDEX_XY[poke.name] == undefined) SETDEX_XY[poke.name] = {};
	if (SETDEX_BW[poke.name] == undefined) SETDEX_BW[poke.name] = {};
	if (SETDEX_DPP[poke.name] == undefined) SETDEX_DPP[poke.name] = {};
	if (SETDEX_ADV[poke.name] == undefined) SETDEX_ADV[poke.name] = {};
	if (SETDEX_GSC[poke.name] == undefined) SETDEX_GSC[poke.name] = {};
	if (SETDEX_RBY[poke.name] == undefined) SETDEX_RBY[poke.name] = {};

	if (poke.ability !== undefined) {
		dexObject.ability = poke.ability;

	}
	dexObject.level = poke.level;
	dexObject.evs = poke.evs;
	dexObject.ivs = poke.ivs;
	dexObject.moves = poke.moves;
	dexObject.nature = poke.nature;
	dexObject.item = poke.item;
	if (localStorage.customsets) {
		customsets = JSON.parse(localStorage.customsets);
	} else {
		customsets = {};
	}
	if (!customsets[poke.name]) {
		customsets[poke.name] = {};
	}
	customsets[poke.name][poke.nameProp] = dexObject;
	if (poke.name == "Aegislash-Blade") {
		if (!customsets["Aegislash-Shield"]) {
			customsets["Aegislash-Shield"] = {};
		}
		customsets["Aegislash-Shield"][poke.nameProp] = dexObject;
	}
	updateDex(customsets);
}

function updateDex(customsets) {
	for (pokemon in customsets) {
		for (moveset in customsets[pokemon]) {
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

function addSets(pokes) {
	var rows = pokes.split("\n");
	var currentRow;
	var currentPoke;
	var addedpokes = 0;
	for (i = 0; i < rows.length; i++) {
		currentRow = rows[i].split(/[\(\)@]/);
		for (j = 0; j < currentRow.length; j++) {
			currentRow[j] = checkExeptions(currentRow[j].trim());
			if (POKEDEX_SM[currentRow[j].trim()] !== undefined) {
				currentPoke = POKEDEX_SM[currentRow[j].trim()];
				currentPoke.name = currentRow[j].trim();
				currentPoke.item = getItem(currentRow, j + 1);
				if (j === 1) {
					currentPoke.nameProp = currentRow[j - 1].trim();

				} else {
					currentPoke.nameProp = "Custom Set";

				}
				currentPoke.ability = getAbility(rows[i + 1].split(":"));
				currentPoke = getStats(currentPoke, rows, i + 1);
				currentPoke = getMoves(currentPoke, rows, i);
				addToDex(currentPoke);
				addedpokes++;

			}
		}
	}
	if (addedpokes > 0) {
		alert("Successfully imported " + addedpokes + " set(s)");
		$("#importedSetsOptions").css("display","inline");
	} else {
		alert("No sets imported, please check your syntax and try again");
	}
}

function checkExeptions(poke) {
	switch (poke) {
	case 'Aegislash':
		poke = "Aegislash-Blade";
		break;
	case 'Araquanid-Totem':
		poke = "Araquanid";
		break;
	case 'Basculin-Blue-Striped':
		poke = "Basculin";
		break;
	case 'Gumshoos-Totem':
		poke = "Gumshoos";
		break;
	case 'Keldeo-Resolute':
		poke = "Keldeo";
		break;
	case 'Kommo-o-Totem':
		poke = "Kommo-o";
		break;
	case 'Lurantis-Totem':
		poke = "Lurantis";
		break;
	case 'Marowak-Alola-Totem':
		poke = "Marowak-Alola";
		break;
	case 'Mimikyu-Totem':
	case 'Mimikyu-Busted':
		poke = "Mimikyu";
		break;
	case 'Pikachu-Alola':
	case 'Pikachu-Belle':
	case 'Pikachu-Cosplay':
	case 'Pikachu-Hoenn':
	case 'Pikachu-Kalos':
	case 'Pikachu-Libre':
	case 'Pikachu-Original':
	case 'Pikachu-Partner':
	case 'Pikachu-PhD':
	case 'Pikachu-Pop-Star':
	case 'Pikachu-Rock-Star':
	case 'Pikachu-Sinnoh':
	case 'Pikachu-Unova':
		poke = "Pikachu";
		break;
	case 'Raticate-Alola-Totem':
		poke = "Raticate-Alola";
		break;
	case 'Ribombee-Totem':
		poke = "Ribombee";
		break;
	case 'Salazzle-Totem':
		poke = "Salazzle";
		break;
	case 'Vikavolt-Totem':
		poke = "Vikavolt";
		break;
	case 'Vivillon-Fancy':
	case 'Vivillon-Pokeball':
		poke = "Vivillon";
		break;
	}
	return poke;

}

$("#clearSets").click(function () {
	localStorage.removeItem("customsets");
	alert("Custom Sets successfully cleared. Please refresh the page.");
	$("#importedSetsOptions").css("display","none");
	loadDefaultList();
});

$("#importedSets").click(function () {
	var showCustomSets = $(this).prop("checked");
	if (showCustomSets) {
		loadCustomList();
	} else {
		loadDefaultList();
	}
});

var customSets;

$(document).ready(function () {
	placeBsBtn();
	if (localStorage.customsets) {
		customSets = JSON.parse(localStorage.customsets);
		updateDex(customSets);		
		$("#importedSetsOptions").css("display","inline");
	} else {
		loadDefaultList();
	}
});
