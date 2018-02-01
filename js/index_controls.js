$("#p2 .ability").bind("keyup change", function () {
	autosetWeather($(this).val(), 1);
	autosetTerrain($(this).val(), 1);
});

$("#p2 .item").bind("keyup change", function () {
	autosetStatus("#p2", $(this).val());
});

lastManualStatus["#p2"] = "Healthy";
lastAutoStatus["#p1"] = "Healthy";

var resultLocations = [[], []];
for (var i = 0; i < 4; i++) {
	resultLocations[0].push({
		"move": "#resultMoveL" + (i + 1),
		"damage": "#resultDamageL" + (i + 1)
	});
	resultLocations[1].push({
		"move": "#resultMoveR" + (i + 1),
		"damage": "#resultDamageR" + (i + 1)
	});
}

var damageResults;
function calculate() {
	var p1 = new Pokemon($("#p1"));
	var p2 = new Pokemon($("#p2"));
	var battling = [p1, p2];
	p1.maxDamages = [];
	p2.maxDamages = [];
	var field = new Field();
	damageResults = calculateAllMoves(p1, p2, field);
	var fastestSide = p1.stats[SP] > p2.stats[SP] ? 0 : p1.stats[SP] === p2.stats[SP] ? "tie" : 1;
	var result, minDamage, maxDamage, minDisplay, maxDisplay;
	var highestDamage = -1;
	var bestResult;
	for (var i = 0; i < 4; i++) {
		result = damageResults[0][i];
		minDamage = result.damage[0] * p1.moves[i].hits;
		maxDamage = result.damage[result.damage.length - 1] * p1.moves[i].hits;
		p1.maxDamages.push({
			moveOrder : i,
			maxDamage : maxDamage
		});
		p1.maxDamages.sort(function(firstMove, secondMove){
			return secondMove.maxDamage - firstMove.maxDamage;
		});
		minDisplay = notation === '%' ? Math.floor(minDamage * 1000 / p2.maxHP) / 10 : Math.floor(minDamage * 48 / p2.maxHP);
		maxDisplay = notation === '%' ? Math.floor(maxDamage * 1000 / p2.maxHP) / 10 : Math.floor(maxDamage * 48 / p2.maxHP);
		result.damageText = minDamage + "-" + maxDamage + " (" + minDisplay + " - " + maxDisplay + notation + ")";
		result.koChanceText = p1.moves[i].bp === 0 ? 'nice move' :
			getKOChanceText(result.damage, p1, p2, field.getSide(1), p1.moves[i], p1.moves[i].hits, p1.ability === 'Bad Dreams');
		var recoveryText = '';
		if (p1.moves[i].givesHealth) {
			var minHealthRecovered = notation === '%' ? Math.floor(minDamage * p1.moves[i].percentHealed * 1000 / p1.maxHP) /
                10 : Math.floor(minDamage * p1.moves[i].percentHealed * 48 / p1.maxHP);
			var maxHealthRecovered = notation === '%' ? Math.floor(maxDamage * p1.moves[i].percentHealed * 1000 / p1.maxHP) /
                10 : Math.floor(maxDamage * p1.moves[i].percentHealed * 48 / p1.maxHP);
			if (minHealthRecovered > 100 && notation === '%') {
				minHealthRecovered = Math.floor(p2.maxHP * p1.moves[i].percentHealed * 1000 / p1.maxHP) / 10;
				maxHealthRecovered = Math.floor(p2.maxHP * p1.moves[i].percentHealed * 1000 / p1.maxHP) / 10;
			} else if (notation !== '%' && minHealthRecovered > 48) {
				minHealthRecovered = Math.floor(p2.maxHP * p1.moves[i].percentHealed * 48 / p1.maxHP);
				maxHealthRecovered = Math.floor(p2.maxHP * p1.moves[i].percentHealed * 48 / p1.maxHP);
			}
			recoveryText = ' (' + minHealthRecovered + ' - ' + maxHealthRecovered + notation + ' recovered)';
		}
		var recoilText = '';
		if (typeof p1.moves[i].hasRecoil === 'number') {
			var damageOverflow = minDamage > p2.curHP || maxDamage > p2.curHP;
			var minRecoilDamage = notation === '%' ? Math.floor(Math.min(minDamage, p2.curHP) * p1.moves[i].hasRecoil * 10 / p1.maxHP) / 10 :
				Math.floor(Math.min(minDamage, p2.curHP) * p1.moves[i].hasRecoil * 0.48 / p1.maxHP);
			var maxRecoilDamage = notation === '%' ? Math.floor(Math.min(maxDamage, p2.curHP) * p1.moves[i].hasRecoil * 10 / p1.maxHP) / 10 :
				Math.floor(Math.min(maxDamage, p2.curHP) * p1.moves[i].hasRecoil * 0.48 / p1.maxHP);
			if (damageOverflow) {
				minRecoilDamage = notation === '%' ? Math.floor(p2.curHP * p1.moves[i].hasRecoil * 10 / p1.maxHP) / 10
				: Math.floor(p2.maxHP * p1.moves[i].hasRecoil * 0.48 / p1.maxHP);
				maxRecoilDamage = notation === '%' ? Math.floor(p2.curHP * p1.moves[i].hasRecoil * 10 / p1.maxHP) / 10
				: Math.floor(p2.curHP * p1.moves[i].hasRecoil * 0.48 / p1.maxHP);
			}
			recoilText = ' (' + minRecoilDamage + ' - ' + maxRecoilDamage + notation + ' recoil damage)';
		} else if (p1.moves[i].hasRecoil === 'crash') {
			var genMultiplier = gen === 2 ? 12.5 : gen >= 3 ? 50 : 1;		
			var gen4CrashDamage = Math.floor(p2.maxHP * 0.5 / p1.maxHP * 100);
			var minRecoilDamage = notation === '%' ? Math.floor(Math.min(minDamage, p2.maxHP) * genMultiplier * 10 / p1.maxHP) / 10 
			   : Math.floor(Math.min(minDamage, p2.maxHP) * genMultiplier * 0.48 / p1.maxHP);
			var maxRecoilDamage = notation === '%' ? Math.floor(Math.min(maxDamage, p2.maxHP) * genMultiplier * 10 / p1.maxHP) / 10 
			: Math.floor(Math.min(maxDamage, p2.maxHP) * genMultiplier * 0.48 / p1.maxHP);
			if (damageOverflow && gen !== 2) {
				minRecoilDamage = notation === '%' ? Math.floor(p2.curHP * genMultiplier * 10 / p1.maxHP) / 10
				: Math.floor(p2.curHP * genMultiplier * 0.48 / p1.maxHP);
				maxRecoilDamage = notation === '%' ? Math.floor(p2.maxHP * genMultiplier * 10 / p1.maxHP) / 10
				: Math.floor(Math.min(p2.maxHP, p1.maxHP) * genMultiplier * 0.48);
			}
			recoilText = gen === 1 ? ' (1hp damage on miss)' :
			gen === 2 ? (p2.type1 === "Ghost" || p2.type2 === "Ghost") ? ' (no crash damage on Ghost types)' : ' (' + minRecoilDamage + ' - ' + maxRecoilDamage + notation + ' crash damage on miss)' :
			gen === 3 ? (p2.type1 === "Ghost" || p2.type2 === "Ghost") ? ' (no crash damage on Ghost types)' : ' (' + minRecoilDamage + ' - ' + maxRecoilDamage + notation + ' crash damage on miss)' :
			gen === 4 ? (p2.type1 === "Ghost" || p2.type2 === "Ghost") ? ' (' + gen4CrashDamage + '% crash damage)' : ' (' + minRecoilDamage + ' - ' + maxRecoilDamage + notation + ' crash damage on miss)' :
			gen > 4 ? ' (50% crash damage)' :
			'';
		} else if (p1.moves[i].hasRecoil === 'Struggle') { 
			recoilText = ' (25% struggle damage)';
		} else if (p1.moves[i].hasRecoil) {
			recoilText = ' (50% recoil damage)';
		}
		$(resultLocations[0][i].move + " + label").text(p1.moves[i].name.replace("Hidden Power", "HP"));
		$(resultLocations[0][i].damage).text(minDisplay + " - " + maxDisplay + notation + recoveryText + recoilText);
		
		result = damageResults[1][i];
		var recoveryText = '';
		minDamage = result.damage[0] * p2.moves[i].hits;
		maxDamage = result.damage[result.damage.length - 1] * p2.moves[i].hits;
		p2.maxDamages.push({
			moveOrder : i,
			maxDamage : maxDamage
		});
		p2.maxDamages.sort(function(firstMove, secondMove){
			return secondMove.maxDamage - firstMove.maxDamage;
		});
		minDisplay = notation === '%' ? Math.floor(minDamage * 1000 / p1.maxHP) / 10 : Math.floor(minDamage * 48 / p1.maxHP);
		maxDisplay = notation === '%' ? Math.floor(maxDamage * 1000 / p1.maxHP) / 10 : Math.floor(maxDamage * 48 / p1.maxHP);
		result.damageText = minDamage + "-" + maxDamage + " (" + minDisplay + " - " + maxDisplay + notation + ")";
		result.koChanceText = p2.moves[i].bp === 0 ? 'nice move' :
			getKOChanceText(result.damage, p2, p1, field.getSide(0), p2.moves[i], p2.moves[i].hits, p2.ability === 'Bad Dreams');
		if (p2.moves[i].givesHealth) {
			var minHealthRecovered = notation === '%' ? Math.floor(minDamage * p2.moves[i].percentHealed * 1000 / p2.maxHP) /
                10 : Math.floor(minDamage * p2.moves[i].percentHealed * 48 / p2.maxHP);
			var maxHealthRecovered = notation === '%' ? Math.floor(maxDamage * p2.moves[i].percentHealed * 1000 / p2.maxHP) /
                10 : Math.floor(maxDamage * p2.moves[i].percentHealed * 48 / p2.maxHP);
			if (minHealthRecovered > 100 && notation === '%') {
					minHealthRecovered = Math.floor(p1.maxHP * p2.moves[i].percentHealed * 1000 / p2.maxHP) / 10;
					maxHealthRecovered = Math.floor(p1.maxHP * p2.moves[i].percentHealed * 1000 / p2.maxHP) / 10
				} else if (notation !== '%' && minHealthRecovered > 48) {
					minHealthRecovered = Math.floor(p1.maxHP * p2.moves[i].percentHealed * 48 / p2.maxHP);
					maxHealthRecovered = Math.floor(p1.maxHP * p2.moves[i].percentHealed * 48 / p2.maxHP);
				}
			recoveryText = ' (' + minHealthRecovered + ' - ' + maxHealthRecovered + notation + ' recovered)';
		}
		var recoilText = '';
		if (typeof p2.moves[i].hasRecoil === 'number') {
			var damageOverflow = minDamage > p1.curHP || maxDamage > p1.curHP;
			var minRecoilDamage = notation === '%' ? Math.floor(Math.min(minDamage, p1.curHP) * p2.moves[i].hasRecoil * 10 / p2.maxHP) / 10 :
				Math.floor(Math.min(minDamage, p1.curHP) * p2.moves[i].hasRecoil * 0.48 / p2.maxHP);
			var maxRecoilDamage = notation === '%' ? Math.floor(Math.min(maxDamage, p1.maxHP) * p2.moves[i].hasRecoil * 10 / p2.maxHP) / 10 :
				Math.floor(Math.min(maxDamage, p1.curHP) * p2.moves[i].hasRecoil * 0.48 / p2.maxHP);
			if (damageOverflow) {
				minRecoilDamage = notation === '%' ? Math.floor(Math.min(p1.maxHP * p2.moves[i].hasRecoil) * 10 / p2.maxHP) / 10
				: Math.floor(p1.maxHP * p2.moves[i].recoilPercentage * 0.48 / p1.maxHP);
				maxRecoilDamage = notation === '%' ? Math.floor(Math.min(p1.maxHP, p2.moves[i].hasRecoil) * 10 / p2.maxHP) / 10
				: Math.floor(Math.min(p1.maxHP, p2.moves[i].hasRecoil) * 0.48 / p2.maxHP);
			}
			recoilText = ' (' + minRecoilDamage + ' - ' + maxRecoilDamage + notation + ' recoil damage)';
		} else if (p2.moves[i].hasRecoil === 'crash') {
			var genMultiplier = gen === 2 ? 12.5 : gen >= 3 ? 50 : 1;		
			var gen4CrashDamage = Math.floor(p2.maxHP * 0.5 / p1.maxHP * 100);
			var minRecoilDamage = notation === '%' ? Math.floor(Math.min(minDamage, p1.maxHP) * genMultiplier * 10 / p2.maxHP) / 10 
			: Math.floor(Math.min(minDamage, p1.maxHP) * 0.48 / p2.maxHP);
			var maxRecoilDamage = notation === '%' ? Math.floor(Math.min(maxDamage, p1.maxHP) * genMultiplier * 10 / p2.maxHP) / 10
			: Math.floor(Math.min(maxDamage, p1.maxHP) * 0.48 / p2.maxHP);
			if (damageOverflow && gen !== 2) {
				minRecoilDamage = notation === '%' ? Math.floor(Math.min(p1.maxHP, genMultiplier) * 10 / p2.maxHP) / 10
				: Math.floor(Math.min(p1.maxHP, p1.maxHP) * genMultiplier * 0.48);
				maxRecoilDamage = notation === '%' ? Math.floor(Math.min(p1.maxHP, genMultiplier) * 10 / p2.maxHP) / 10
				: Math.floor(Math.min(p1.maxHP, p2.maxHP) * genMultiplier * 0.48);
			}
			recoilText = gen === 1 ? ' (1hp damage on miss)' :
			gen === 2 ? (p1.type1 === "Ghost" || p1.type2 === "Ghost") ? ' (no crash damage on Ghost types)' : ' (' + minRecoilDamage + ' - ' + maxRecoilDamage + notation + ' crash damage on miss)' :
			gen === 3 ? (p1.type1 === "Ghost" || p1.type2 === "Ghost") ? ' (no crash damage on Ghost types)' : ' (' + minRecoilDamage + ' - ' + maxRecoilDamage + notation + ' crash damage on miss)' :
			gen === 4 ? (p1.type1 === "Ghost" || p1.type2 === "Ghost") ? ' (' + gen4CrashDamage + '% crash damage)' : ' (' + minRecoilDamage + ' - ' + maxRecoilDamage + notation + ' crash damage on miss)' :
			gen > 4 ? ' (50% crash damage)' :
			'';
		} else if (p2.moves[i].hasRecoil === 'Struggle') {
			recoilText = ' (25% struggle damage)';
		} else if (p2.moves[i].hasRecoil) {
			recoilText = ' (50% recoil damage)';
		}
		var bestMove;
		$(resultLocations[1][i].move + " + label").text(p2.moves[i].name.replace("Hidden Power", "HP"));
		$(resultLocations[1][i].damage).text(minDisplay + " - " + maxDisplay + notation + recoveryText + recoilText);
		if (fastestSide === "tie") {
			battling.sort(function() {
				return 0.5 - Math.random();
			});
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

$(".result-move").change(function() {
	if (damageResults) {
		var result = findDamageResult($(this));
		if (result) {
			$("#mainResult").text(result.description + ": " + result.damageText + " -- " + result.koChanceText);
			$("#damageValues").text("Possible damage amounts: (" + result.damage.join(", ") + ")");
		}
	}
});

function findDamageResult(resultMoveObj) {
	var selector = "#" + resultMoveObj.attr("id");
	for (var i = 0; i < resultLocations.length; i++) {
		for (var j = 0; j < resultLocations[i].length; j++) {
			if (resultLocations[i][j].move === selector) {
				return damageResults[i][j];
			}
		}
	}
}

var calculateAllMoves;

$(".gen").change(function () {
	switch (gen) {
	case 1:
		calculateAllMoves = CALCULATE_ALL_MOVES_RBY;
		break;
	case 2:
		calculateAllMoves = CALCULATE_ALL_MOVES_GSC;
		break;
	case 3:
		calculateAllMoves = CALCULATE_ALL_MOVES_ADV;
		break;
	case 4:
		calculateAllMoves = CALCULATE_ALL_MOVES_DPP;
		break;
	default:
		calculateAllMoves = CALCULATE_ALL_MOVES_BW;
		break;
	}
});

$(".mode").change(function () {
	window.location.replace('honkalculate' + linkExtension + '?mode=' + $(this).attr("id"));
});

$(".notation").change(function () {
	calculate();
});

$(document).ready(function () {
	$(".calc-trigger").bind("change keyup", function () {
		setTimeout(calculate, 0);
	});
	calculate();
});
