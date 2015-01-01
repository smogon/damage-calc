$("#p2 .ability").bind("keyup change", function() {
    autosetWeather($(this).val(), 1);
});

$("#p2 .item").bind("keyup change", function() {
    autosetStatus("#p2", $(this).val());
});

lastManualStatus["#p2"] = "Healthy";
lastAutoStatus["#p1"] = "Healthy";

function getTerrainEffects() {
    var className = $(this).prop("className");
    className = className.substring(0, className.indexOf(" "));
    switch (className) {
        case "type1":
        case "type2":
        case "ability":
        case "item":
            var id = $(this).closest(".poke-info").prop("id");
            var terrainValue = $("input:checkbox[name='terrain']:checked").val();
            if (terrainValue === "Electric") {
                $("#" + id).find("[value='Asleep']").prop("disabled", isGrounded($("#" + id)));
            } else if (terrainValue === "Misty") {
                $("#" + id).find(".status").prop("disabled", isGrounded($("#" + id)));
            }
            break;
        default:
            $("input:checkbox[name='terrain']").not(this).prop("checked", false);
            if ($(this).prop("checked") && $(this).val() === "Electric") {
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

var resultLocations = [[],[]];
for (var i = 0; i < 4; i++) {
    resultLocations[0].push({
        "move":"#resultMoveL" + (i+1),
        "damage":"#resultDamageL" + (i+1)
    });
    resultLocations[1].push({
        "move":"#resultMoveR" + (i+1),
        "damage":"#resultDamageR" + (i+1)
    });
}

var damageResults;
function calculate() {
    var p1 = new Pokemon($("#p1"));
    var p2 = new Pokemon($("#p2"));
    var field = new Field();
    damageResults = calculateAllMoves(p1, p2, field);
    var result, minDamage, maxDamage, minPercent, maxPercent, percentText;
    var highestMaxPercent = -1;
    var bestResult;
    for (var i = 0; i < 4; i++) {
        result = damageResults[0][i];
        minDamage = result.damage[0] * p1.moves[i].hits;
        maxDamage = result.damage[result.damage.length-1] * p1.moves[i].hits;
        minPercent = Math.floor(minDamage * 1000 / p2.maxHP) / 10;
        maxPercent = Math.floor(maxDamage * 1000 / p2.maxHP) / 10;
        result.damageText = minDamage + "-" + maxDamage + " (" + minPercent + " - " + maxPercent + "%)";
        result.koChanceText = p1.moves[i].bp === 0 ? 'nice move'
                : getKOChanceText(result.damage, p2, field.getSide(1), p1.moves[i].hits, p1.ability === 'Bad Dreams');
        $(resultLocations[0][i].move + " + label").text(p1.moves[i].name.replace("Hidden Power", "HP"));
        $(resultLocations[0][i].damage).text(minPercent + " - " + maxPercent + "%");
        if (maxPercent > highestMaxPercent) {
            highestMaxPercent = maxPercent;
            bestResult = $(resultLocations[0][i].move);
        }
        
        result = damageResults[1][i];
        minDamage = result.damage[0] * p2.moves[i].hits;
        maxDamage = result.damage[result.damage.length-1] * p2.moves[i].hits;
        minPercent = Math.floor(minDamage * 1000 / p1.maxHP) / 10;
        maxPercent = Math.floor(maxDamage * 1000 / p1.maxHP) / 10;
        result.damageText = minDamage + "-" + maxDamage + " (" + minPercent + " - " + maxPercent + "%)";
        result.koChanceText = p2.moves[i].bp === 0 ? 'nice move'
                : getKOChanceText(result.damage, p1, field.getSide(0), p2.moves[i].hits, p2.ability === 'Bad Dreams');
        $(resultLocations[1][i].move + " + label").text(p2.moves[i].name.replace("Hidden Power", "HP"));
        $(resultLocations[1][i].damage).text(minPercent + " - " + maxPercent + "%");
        if (maxPercent > highestMaxPercent) {
            highestMaxPercent = maxPercent;
            bestResult = $(resultLocations[1][i].move);
        }
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
            $("#damageValues").text("(" + result.damage.join(", ") + ")");
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

$(".mode").change(function() {
    window.location.replace( "calc_bc.html?mode=" + $(this).attr("id") );
});

$(document).ready(function() {
    $(".terrain-trigger").bind("change keyup", getTerrainEffects);
    $(".calc-trigger").bind("change keyup", calculate);
    calculate();
});
