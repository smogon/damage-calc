function placeBsBtn(){
	var importBtn = "<button class='bs-btn bs-btn-default'>Import</button>";
    $("#import-1_wrapper").append(importBtn);
    $(".bs-btn").click(function() {
		var pokes = document.getElementsByClassName("import-team-text")[0].value;
		addSets(pokes);     
    });
	

}
function getAbility(row){
	ability = row[1] ? row[1].trim() : '';
	if (ABILITIES_SM.indexOf(ability) != -1){
		return(ability);

	}else{
		return;

	}

}

function statConverter(stat){
	switch(stat){
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

function getStats(currentPoke,rows,i){
	currentPoke.nature = "Serious";
	var currentEV;
	var currentIV;
	var currentNature;
	currentPoke.level = 100;
	for(x = i;x<i+7;x++){
		var currentRow = rows[x] ? rows[x].split(/[/:]/) : '';
		var evs = new Object();
		var ivs = new Object();
		var ev

		switch(currentRow[0]){
			case 'Level':
				currentPoke.level = parseInt(currentRow[1].trim());
				break;
			case 'EVs':
				
				for(j = 1;j<currentRow.length;j++){
					currentEV = currentRow[j].trim().split(" ");
					currentEV[1] = statConverter(currentEV[1].toLowerCase());
					evs[currentEV[1]] = parseInt(currentEV[0]);

				}
				currentPoke.evs = evs;
				break;
			case 'IVs':	
				for(j = 1;j<currentRow.length;j++){
					currentIV = currentRow[j].trim().split(" ");
					currentIV[1] = statConverter(currentIV[1].toLowerCase());
					ivs[currentIV[1]] = parseInt(currentIV[0]);
				}
				currentPoke.ivs = ivs;
				break;

		}
		currentNature = rows[x] ? rows[x].trim().split(" ") : '';
		if ( currentNature[1] == "Nature"){
			currentPoke.nature = currentNature[0];

		}
	}
	return currentPoke;
	
	
}

function getItem(currentRow,j){
	for(;j<currentRow.length;j++){
		var item = currentRow[j].trim();
		if(ITEMS_SM.indexOf(item) != -1){
			return item;

		}
	}
	return;

}

function getMoves(currentPoke,rows,i){
	var movesFound = false;
	var moves = new Array();
	for(x = i;x<i+12;x++){

		if(rows[x]){
			if(rows[x][0] == "-"){
				movesFound = true;
				
				var move = rows[x].substr(2,rows[x].length-2).replace("[","").replace("]","").replace("  ","");
				moves.push(move);
	
			}else {
				if (movesFound == true){
					break;
	
				}
	
			}			
		}
	}
	currentPoke.moves = moves;
	return currentPoke;
	
	

}

function addToDex(poke){
	var dexObject = new Object();
	if(SETDEX_SM[poke.name] == undefined) SETDEX_SM[poke.name] = new Object();
	if(SETDEX_XY[poke.name] == undefined) SETDEX_XY[poke.name] = new Object();
	if(SETDEX_BW[poke.name] == undefined) SETDEX_BW[poke.name] = new Object();
	if(SETDEX_DPP[poke.name] == undefined) SETDEX_DPP[poke.name] = new Object();
	if(SETDEX_ADV[poke.name] == undefined) SETDEX_ADV[poke.name] = new Object();
	if(SETDEX_GSC[poke.name] == undefined) SETDEX_GSC[poke.name] = new Object();
	if(SETDEX_RBY[poke.name] == undefined) SETDEX_RBY[poke.name] = new Object();

	if (poke.ability !== undefined){
		dexObject.ability = poke.ability;

	}
	dexObject.level = poke.level;
	dexObject.evs = poke.evs;
	dexObject.ivs = poke.ivs;
	dexObject.moves = poke.moves;
	dexObject.nature = poke.nature;
	dexObject.item = poke.item;
	if(localStorage.customsets){
		customsets = JSON.parse(localStorage.customsets);
	}
	else{
		customsets = {};
	}
	if(!customsets[poke.name]){
		customsets[poke.name] = {};
	}
	customsets[poke.name][poke.nameProp] = dexObject;
	if(poke.name == "Aegislash-Blade"){
		if(!customsets["Aegislash-Shield"]){
			customsets["Aegislash-Shield"] = {};
		}
		customsets["Aegislash-Shield"][poke.nameProp] = 	dexObject;
	}
	updateDex(customsets);
}

function updateDex(customsets){
	for(pokemon in customsets){
		for(moveset in customsets[pokemon]){
			if(!SETDEX_SM[pokemon]) SETDEX_SM[pokemon] = {};
			SETDEX_SM[pokemon][moveset] = customsets[pokemon][moveset];
			if(!SETDEX_XY[pokemon]) SETDEX_XY[pokemon] = {};
			SETDEX_XY[pokemon][moveset] = customsets[pokemon][moveset];
			if(!SETDEX_BW[pokemon]) SETDEX_BW[pokemon] = {};
			SETDEX_BW[pokemon][moveset] = customsets[pokemon][moveset];
			if(!SETDEX_DPP[pokemon]) SETDEX_DPP[pokemon] = {};
			SETDEX_DPP[pokemon][moveset] = customsets[pokemon][moveset];
			if(!SETDEX_ADV[pokemon]) SETDEX_ADV[pokemon] = {};
			SETDEX_ADV[pokemon][moveset] = customsets[pokemon][moveset];
			if(!SETDEX_GSC[pokemon]) SETDEX_GSC[pokemon] = {};
			SETDEX_GSC[pokemon][moveset] = customsets[pokemon][moveset];
			if(!SETDEX_RBY[pokemon]) SETDEX_RBY[pokemon] = {};
			SETDEX_RBY[pokemon][moveset] = customsets[pokemon][moveset];
		}
	}
	localStorage.customsets = JSON.stringify(customsets);
}

function addSets(pokes){
	var rows = pokes.split("\n");
	var currentRow;
	var currentPoke;
	var addedpokes = 0;
	for (i = 0; i < rows.length; i++) {
		currentRow = rows[i].split(/[\(\)@]/);
		for (j = 0; j<currentRow.length;j++){
			currentRow[j] = checkExeptions(currentRow[j].trim());
			if(POKEDEX_SM[currentRow[j].trim()] !== undefined){
				currentPoke = POKEDEX_SM[currentRow[j].trim()];
				currentPoke.name = currentRow[j].trim();
				currentPoke.item = getItem(currentRow,j+1);
				if(j===1){
					currentPoke.nameProp = currentRow[j-1].trim();

				}else{
					currentPoke.nameProp = "Custom Set";

				}
				currentPoke.ability = getAbility(rows[i+1].split(":"));
				currentPoke = getStats(currentPoke,rows,i+1);
				currentPoke = getMoves(currentPoke,rows,i);
				addToDex(currentPoke);
				addedpokes++;

			}
		}		
	}
	if (addedpokes > 0) {
		alert("Successfully imported "+addedpokes+" sets");
	}
}

function checkExeptions(poke){
	switch(poke){
		case 'Abomasnow-Mega':
			poke = "Mega Abomasnow";
			break;
		case 'Absol-Mega':
			poke = "Mega Absol";
			break;
		case 'Aegislash':
			poke = "Aegislash-Blade";
			break;
		case 'Aggron-Mega':
			poke = "Mega Aggron";
			break;
		case 'Alakazam-Mega':
			poke = "Mega Alakazam";
			break;
		case 'Altaria-Mega':
			poke = "Mega Altaria";
			break;
		case 'Ampharos-Mega':
			poke = "Mega Ampharos";
			break;
		case 'Audino-Mega':
			poke = "Mega Audino";
			break;
		case 'Banette-Mega':
			poke = "Mega Banette";
			break;
		case 'Basculin-Blue-Striped':
			poke = "Basculin";
			break;
		case 'Beedrill-Mega':
			poke = "Mega Beedrill";
			break;
		case 'Blaziken-Mega':
			poke = "Mega Blaziken";
			break;
		case 'Blastoise-Mega':
			poke = "Mega Blastoise";
			break;
		case 'Camerupt-Mega':
			poke = "Mega Venusaur";
			break;
		case 'Charizard-Mega-X':
			poke = "Mega Charizard X";
			break;
		case 'Charizard-Mega-Y':
			poke = "Mega Charizard Y";
			break;
		case 'Crucibelle-Mega':
			poke = "Mega Crucibelle";
			break;
		case 'Diancie-Mega':
			poke = "Mega Diancie";
			break;
		case 'Gallade-Mega':
			poke = "Mega Gallade";
			break;
		case 'Garchomp-Mega':
			poke = "Mega Garchomp";
			break;
		case 'Gardevoir-Mega':
			poke = "Mega Gardevoir";
			break;
		case 'Gengar-Mega':
			poke = "Mega Gengar";
			break;
		case 'Glalie-Mega':
			poke = "Mega Glalie";
			break;
		case 'Gyarados-Mega':
			poke = "Mega Gyarados";
			break;
		case 'Heracross-Mega':
			poke = "Mega Heracross";
			break;
		case 'Houndoom-Mega':
			poke = "Mega Houndoom";
			break;
		case 'Kangaskhan-Mega':
			poke = "Mega Kangaskhan";
			break;
		case 'Keldeo-Resolute':
			poke = "Keldeo";
			break;
		case 'Latias-Mega':
			poke = "Mega Latias";
			break;
		case 'Latios-Mega':
			poke = "Mega Latios";
			break;
		case 'Lopunny-Mega':
			poke = "Mega Lopunny";
			break;
		case 'Lucario-Mega':
			poke = "Mega Lucario";
			break;
		case 'Manectric-Mega':
			poke = "Mega Manectric";
			break;
		case 'Mawile-Mega':
			poke = "Mega Mawile";
			break;
		case 'Medicham-Mega':
			poke = "Mega Medicham";
			break;
		case 'Metagross-Mega':
			poke = "Mega Metagross";
			break;
		case 'Mewtwo-Mega-X':
			poke = "Mega Mewtwo X";
			break;
		case 'Mewtwo-Mega-Y':
			poke = "Mega Mewtwo Y";
			break;
		case 'Mimikyu-Busted':
			poke = "Mimikyu";
			break;
		case 'Pidgeot-Mega':
			poke = "Mega Pidgeot";
			break;
		case 'Pikachu-Alola':
		case 'Pikachu-Belle':	
		case 'Pikachu-Cosplay':	
		case 'Pikachu-Hoenn':
		case 'Pikachu-Kalos':
		case 'Pikachu-Libre':
		case 'Pikachu-Original':
		case 'Pikachu-PhD':	
		case 'Pikachu-Pop-Star':	
		case 'Pikachu-Rock-Star':
		case 'Pikachu-Sinnoh':
		case 'Pikachu-Unova':
			poke = "Pikachu";
			break;
		case 'Pinsir-Mega':
			poke = "Mega Pinsir";
			break;
		case 'Rayquaza-Mega':
			poke = "Mega Rayquaza";
			break;
		case 'Sableye-Mega':
			poke = "Mega Sableye";
			break;
		case 'Salamence-Mega':
			poke = "Mega Salamence";
			break;
		case 'Sceptile-Mega':
			poke = "Mega Sceptile";
			break;
		case 'Scizor-Mega':
			poke = "Mega Scizor";
			break;
		case 'Sharpedo-Mega':
			poke = "Mega Sharpedo";
			break;
		case 'Slowbro-Mega':
			poke = "Mega Slowbro";
			break;
		case 'Steelix-Mega':
			poke = "Mega Steelix";
			break;
		case 'Swampert-Mega':
			poke = "Mega Swampert";
			break;
		case 'Tyranitar-Mega':
			poke = "Mega Tyranitar";
			break;
		case 'Venusaur-Mega':
			poke = "Mega Venusaur";
			break;
		case 'Vivillon-Fancy':
		case 'Vivillon-Pokeball':
			poke = "Vivillon";
			break;
	}
	return poke;
	
}

$(document).ready(function() {
    placeBsBtn();
	if(localStorage.customsets){
		updateDex(JSON.parse(localStorage.customsets));
	}
});
