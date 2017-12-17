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
			return firstMove.maxDamage < secondMove.maxDamage;
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
					minHealthRecovered = 100;
					maxHealthRecovered = 100;
				} else if (notation !== '%' && minHealthRecovered > 48) {
					minHealthRecovered = 48;
					maxHealthRecovered = 48;
				}
			recoveryText = ' (' + minHealthRecovered + ' - ' + maxHealthRecovered + notation + ' recovered)';
		}
		$(resultLocations[0][i].move + " + label").text(p1.moves[i].name.replace("Hidden Power", "HP"));
		$(resultLocations[0][i].damage).text(minDisplay + " - " + maxDisplay + notation + recoveryText);
		
		result = damageResults[1][i];
		var recoveryText = '';
		minDamage = result.damage[0] * p2.moves[i].hits;
		maxDamage = result.damage[result.damage.length - 1] * p2.moves[i].hits;
		p2.maxDamages.push({
			moveOrder : i,
			maxDamage : maxDamage
		});
		p2.maxDamages.sort(function(firstMove, secondMove){
			return firstMove.maxDamage < secondMove.maxDamage;
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
					minHealthRecovered = 100;
					maxHealthRecovered = 100;
				} else if (notation !== '%' && minHealthRecovered > 48) {
					minHealthRecovered = 48;
					maxHealthRecovered = 48;
				}
			recoveryText = ' (' + minHealthRecovered + ' - ' + maxHealthRecovered + notation + ' recovered)';
		}
		$(resultLocations[1][i].move + " + label").text(p2.moves[i].name.replace("Hidden Power", "HP"));
		$(resultLocations[1][i].damage).text(minDisplay + " - " + maxDisplay + notation + recoveryText);
		if (fastestSide === "tie") {
			if (maxDamage > highestDamage) {
				highestDamage = maxDamage;
				bestResult = $(resultLocations[0][i].move);
			}
		}
		else {
			var bestMove = battling[fastestSide].maxDamages[0].moveOrder;
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

$(".result-move").change(function () {
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
	window.location.replace("honkalculate.html?mode=" + $(this).attr("id"));
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
