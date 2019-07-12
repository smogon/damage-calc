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
	var p1info = $("#p1");
	var p2info = $("#p2");
	var p1 = createPokemon(p1info);
	var p2 = createPokemon(p2info);
	var battling = [p1, p2];
	p1.maxDamages = [];
	p2.maxDamages = [];
	var p1field = createField();
	var p2field = p1field.swap();
	damageResults = calculateAllMoves(gen, p1, p1field, p2, p2field);
	p1info.find(".sp .totalMod").text(p1.stats[SP]);
	p2info.find(".sp .totalMod").text(p2.stats[SP]);
	var fastestSide = p1.stats[SP] > p2.stats[SP] ? 0 : p1.stats[SP] === p2.stats[SP] ? "tie" : 1;
	var result, minDamage, maxDamage, minDisplay, maxDisplay;
	var highestDamage = -1;
	var bestResult;
	var zProtectAlerted = false;
	for (var i = 0; i < 4; i++) {
		result = damageResults[0][i];
		minDamage = result.damage[0] * p1.moves[i].hits;
		maxDamage = result.damage[result.damage.length - 1] * p1.moves[i].hits;
		if (!zProtectAlerted && maxDamage > 0 && p1.item.indexOf(" Z") === -1 && p1field.defenderSide.isProtected && p1.moves[i].isZ) {
			alert('Although only possible while hacking, Z-Moves fully damage through protect without a Z-Crystal');
			zProtectAlerted = true;
		}
		p1.maxDamages.push({
			moveOrder: i,
			maxDamage: maxDamage
		});
		p1.maxDamages.sort(function (firstMove, secondMove) {
			return secondMove.maxDamage - firstMove.maxDamage;
		});
		minDisplay = notation === '%' ? Math.floor(minDamage * 1000 / p2.maxHP) / 10 : Math.floor(minDamage * 48 / p2.maxHP);
		maxDisplay = notation === '%' ? Math.floor(maxDamage * 1000 / p2.maxHP) / 10 : Math.floor(maxDamage * 48 / p2.maxHP);
		result.damageText = minDamage + "-" + maxDamage + " (" + minDisplay + " - " + maxDisplay + notation + ")";
		result.koChanceText = p1.moves[i].bp === 0 ? 'nice move' :
			calc.getKOChanceText(gen, result.damage, p1, p2, p1field, p1.moves[i], p1.moves[i].hits, p1.ability === 'Bad Dreams');
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
				minRecoilDamage = notation === '%' ? Math.floor(p2.curHP * p1.moves[i].hasRecoil * 10 / p1.maxHP) / 10 :
					Math.floor(p2.maxHP * p1.moves[i].hasRecoil * 0.48 / p1.maxHP);
				maxRecoilDamage = notation === '%' ? Math.floor(p2.curHP * p1.moves[i].hasRecoil * 10 / p1.maxHP) / 10 :
					Math.floor(p2.curHP * p1.moves[i].hasRecoil * 0.48 / p1.maxHP);
			}
			if (p1.ability !== 'Rock Head') {
				recoilText = ' (' + minRecoilDamage + ' - ' + maxRecoilDamage + notation + ' recoil damage)';
			} else {
				recoilText = '';
			}
		} else if (p1.moves[i].hasRecoil === 'crash') {
			var genMultiplier = gen === 2 ? 12.5 : gen >= 3 ? 50 : 1;
			var gen4CrashDamage = Math.floor(p2.maxHP * 0.5 / p1.maxHP * 100);
			var minRecoilDamage = notation === '%' ? Math.floor(Math.min(minDamage, p2.maxHP) * genMultiplier * 10 / p1.maxHP) / 10 :
			   Math.floor(Math.min(minDamage, p2.maxHP) * genMultiplier * 0.48 / p1.maxHP);
			var maxRecoilDamage = notation === '%' ? Math.floor(Math.min(maxDamage, p2.maxHP) * genMultiplier * 10 / p1.maxHP) / 10 :
				Math.floor(Math.min(maxDamage, p2.maxHP) * genMultiplier * 0.48 / p1.maxHP);
			if (damageOverflow && gen !== 2) {
				minRecoilDamage = notation === '%' ? Math.floor(p2.curHP * genMultiplier * 10 / p1.maxHP) / 10 :
					Math.floor(p2.curHP * genMultiplier * 0.48 / p1.maxHP);
				maxRecoilDamage = notation === '%' ? Math.floor(p2.maxHP * genMultiplier * 10 / p1.maxHP) / 10 :
					Math.floor(Math.min(p2.maxHP, p1.maxHP) * genMultiplier * 0.48);
			}
			recoilText = gen === 1 ? ' (1hp damage on miss)' :
				gen === 2 ? (p2.type1 === "Ghost" || p2.type2 === "Ghost") ? ' (no crash damage on Ghost types)' : ' (' + minRecoilDamage + ' - ' + maxRecoilDamage + notation + ' crash damage on miss)' :
					gen === 3 ? (p2.type1 === "Ghost" || p2.type2 === "Ghost") ? ' (no crash damage on Ghost types)' : ' (' + minRecoilDamage + ' - ' + maxRecoilDamage + notation + ' crash damage on miss)' :
						gen === 4 ? (p2.type1 === "Ghost" || p2.type2 === "Ghost") ? ' (' + gen4CrashDamage + '% crash damage)' : ' (' + minRecoilDamage + ' - ' + maxRecoilDamage + notation + ' crash damage on miss)' :
							gen > 4 ? ' (50% crash damage on miss)' :
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
		if (!zProtectAlerted && maxDamage > 0 && p2.item.indexOf(" Z") === -1 && p2field.defenderSide.isProtected && p2.moves[i].isZ) {
			alert('Although only possible while hacking, Z-Moves fully damage through protect without a Z-Crystal');
			zProtectAlerted = true;
		}
		p2.maxDamages.push({
			moveOrder: i,
			maxDamage: maxDamage
		});
		p2.maxDamages.sort(function (firstMove, secondMove) {
			return secondMove.maxDamage - firstMove.maxDamage;
		});
		minDisplay = notation === '%' ? Math.floor(minDamage * 1000 / p1.maxHP) / 10 : Math.floor(minDamage * 48 / p1.maxHP);
		maxDisplay = notation === '%' ? Math.floor(maxDamage * 1000 / p1.maxHP) / 10 : Math.floor(maxDamage * 48 / p1.maxHP);
		result.damageText = minDamage + "-" + maxDamage + " (" + minDisplay + " - " + maxDisplay + notation + ")";
		result.koChanceText = p2.moves[i].bp === 0 ? 'nice move' :
			calc.getKOChanceText(gen, result.damage, p2, p1, p2field, p2.moves[i], p2.moves[i].hits, p2.ability === 'Bad Dreams');
		if (p2.moves[i].givesHealth) {
			var minHealthRecovered = notation === '%' ? Math.floor(minDamage * p2.moves[i].percentHealed * 1000 / p2.maxHP) /
                10 : Math.floor(minDamage * p2.moves[i].percentHealed * 48 / p2.maxHP);
			var maxHealthRecovered = notation === '%' ? Math.floor(maxDamage * p2.moves[i].percentHealed * 1000 / p2.maxHP) /
                10 : Math.floor(maxDamage * p2.moves[i].percentHealed * 48 / p2.maxHP);
			if (minHealthRecovered > 100 && notation === '%') {
				minHealthRecovered = Math.floor(p1.maxHP * p2.moves[i].percentHealed * 1000 / p2.maxHP) / 10;
				maxHealthRecovered = Math.floor(p1.maxHP * p2.moves[i].percentHealed * 1000 / p2.maxHP) / 10;
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
				minRecoilDamage = notation === '%' ? Math.floor(Math.min(p1.maxHP * p2.moves[i].hasRecoil) * 10 / p2.maxHP) / 10 :
					Math.floor(p1.maxHP * p2.moves[i].recoilPercentage * 0.48 / p1.maxHP);
				maxRecoilDamage = notation === '%' ? Math.floor(Math.min(p1.maxHP, p2.moves[i].hasRecoil) * 10 / p2.maxHP) / 10 :
					Math.floor(Math.min(p1.maxHP, p2.moves[i].hasRecoil) * 0.48 / p2.maxHP);
			}
			if (p2.ability !== 'Rock Head') {
				recoilText = ' (' + minRecoilDamage + ' - ' + maxRecoilDamage + notation + ' recoil damage)';
			} else {
				recoilText = '';
			}
		} else if (p2.moves[i].hasRecoil === 'crash') {
			var genMultiplier = gen === 2 ? 12.5 : gen >= 3 ? 50 : 1;
			var gen4CrashDamage = Math.floor(p2.maxHP * 0.5 / p1.maxHP * 100);
			var minRecoilDamage = notation === '%' ? Math.floor(Math.min(minDamage, p1.maxHP) * genMultiplier * 10 / p2.maxHP) / 10 :
				Math.floor(Math.min(minDamage, p1.maxHP) * 0.48 / p2.maxHP);
			var maxRecoilDamage = notation === '%' ? Math.floor(Math.min(maxDamage, p1.maxHP) * genMultiplier * 10 / p2.maxHP) / 10 :
				Math.floor(Math.min(maxDamage, p1.maxHP) * 0.48 / p2.maxHP);
			if (damageOverflow && gen !== 2) {
				minRecoilDamage = notation === '%' ? Math.floor(Math.min(p1.maxHP, genMultiplier) * 10 / p2.maxHP) / 10 :
					Math.floor(Math.min(p1.maxHP, p1.maxHP) * genMultiplier * 0.48);
				maxRecoilDamage = notation === '%' ? Math.floor(Math.min(p1.maxHP, genMultiplier) * 10 / p2.maxHP) / 10 :
					Math.floor(Math.min(p1.maxHP, p2.maxHP) * genMultiplier * 0.48);
			}
			recoilText = gen === 1 ? ' (1hp damage on miss)' :
				gen === 2 ? (p1.type1 === "Ghost" || p1.type2 === "Ghost") ? ' (no crash damage on Ghost types)' : ' (' + minRecoilDamage + ' - ' + maxRecoilDamage + notation + ' crash damage on miss)' :
					gen === 3 ? (p1.type1 === "Ghost" || p1.type2 === "Ghost") ? ' (no crash damage on Ghost types)' : ' (' + minRecoilDamage + ' - ' + maxRecoilDamage + notation + ' crash damage on miss)' :
						gen === 4 ? (p1.type1 === "Ghost" || p1.type2 === "Ghost") ? ' (' + gen4CrashDamage + '% crash damage)' : ' (' + minRecoilDamage + ' - ' + maxRecoilDamage + notation + ' crash damage on miss)' :
							gen > 4 ? ' (50% crash damage on miss)' :
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
			battling.sort(function () {
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

$(".result-move").change(function () {
	if (damageResults) {
		var result = findDamageResult($(this));
		if (result) {
			$("#mainResult").text(calc.buildDescription(result.description) + ": " + result.damageText + " -- " + result.koChanceText);
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

function checkStatBoost(p1, p2) {
	if ($('#StatBoostL').prop("checked")) {
		for (var stat in p1.boosts) {
			p1.boosts[stat] = Math.min(6, p1.boosts[stat] + 1);
		}
	}
	if ($('#StatBoostR').prop("checked")) {
		for (var stat in p2.boosts) {
			p2.boosts[stat] = Math.min(6, p2.boosts[stat] + 1);
		}
	}
}

function calculateAllMoves(gen, p1, p1field, p2, p2field) {
	checkStatBoost(p1, p2);
	var results = [[], []];
	for (var i = 0; i < 4; i++) {
		results[0][i] = calc.calculateDamage(gen, p1, p2, p1.moves[i], p1field);
		results[1][i] = calc.calculateDamage(gen, p2, p1, p2.moves[i], p2field);
	}
	return results;
}

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
