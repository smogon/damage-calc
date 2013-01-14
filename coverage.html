<!DOCTYPE html>
<html><head><meta charset="UTF-8" />
<!-- Toad was here, Bowser is a loser -->
<title>Honkalculator 3000</title>
<link rel="stylesheet" type="text/css" href="calcstyle_mass.css" />
<script type="text/javascript" src="damage.js"></script>
<script type="text/javascript" src="sets.js"></script>
<script type="text/javascript" src="util.js"></script>
<script type="text/javascript">
var allSets = getAllSets();
var uweight = 50;

function setUser() {
    var index = $('user').selectedIndex;
    if(index == 0) return;
    $('type1').selectedIndex = 0;
    $('type2').selectedIndex = 0;
    $('item').selectedIndex = 0;
    $('ability').selectedIndex = 0;
    $('move1').selectedIndex = 0;
    $('move2').selectedIndex = 0;
    $('move3').selectedIndex = 0;
    $('move4').selectedIndex = 0;
    var set = allSets[index-1];
    $('type1').value = set.type1;
    $('type2').value = set.type2;
    $('level').value = set.level;
    $('baseat').value = set.atbase;
    $('atevs').value = set.atevs;
    $('ativs').value = set.ativs;
    $('basesa').value = set.sabase;
    $('saevs').value = set.saevs;
    $('saivs').value = set.saivs;
    $('basesp').value = set.spbase;
    $('spevs').value = set.spevs;
    $('spivs').value = set.spivs;
    $('atstage').value = 0;
    $('sastage').value = 0;
    $('spstage').value = 0;
    $('item').value = set.items[0];
    $('ability').value = set.abilities[0];
    $('nature').value = set.nature;
    $('status').value = 'Healthy';
    $('move1').value = set.move1;
    $('move2').value = set.move2;
    $('move3').value = set.move3;
    $('move4').value = set.move4;
    setMove(1);
    setMove(2);
    setMove(3);
    setMove(4);
    setAT();
    setSA();
    setSP();
    uweight = set.w;
}

function setAT() {
    setStat('at', 'baseat', 'ativs', 'atevs', 'level', 'nature', 0);
}
function setSA() {
    setStat('sa', 'basesa', 'saivs', 'saevs', 'level', 'nature', 2);
}
function setSP() {
    setStat('sp', 'basesp', 'spivs', 'spevs', 'level', 'nature', 4);
}

function validateAll() {
    $('level').value = validate($('level').value, 1, 100);
    $('at').value = validate($('at').value, 1, 999);
    $('sa').value = validate($('sa').value, 1, 999);
    $('sp').value = validate($('sp').value, 1, 999);
    $('move1pwr').value = validate($('move1pwr').value, 1, 999);
    $('move2pwr').value = validate($('move2pwr').value, 0, 999);
    $('move3pwr').value = validate($('move3pwr').value, 0, 999);
    $('move4pwr').value = validate($('move4pwr').value, 0, 999);
}

function calcAll() {
    validateAll();
    var highestTier = $('hightier').selectedIndex;
    var lowestTier = $('lowtier').selectedIndex;
    var isStrict = $('strict').checked;
    var results = [];
    
    for (var i in allSets) {
        // filter results
        if ($('style').value === 'VGC' || $('style').value === 'LC' ||
                (getTier(allSets[i].meta) >= highestTier && getTier(allSets[i].meta) <= lowestTier &&
                (!isStrict || (getTier(allSets[i].tier) >= highestTier && getTier(allSets[i].tier) <= lowestTier)))) {
            var sets = getUniqueTargets(allSets[i]);
            for (var j in sets) {
                results.push({
                    'set' : sets[j],
                    'damage' : calc(sets[j])
                });
            }
        }
    }
    
    results.sort(sortResultsUp);
    removeDuplicates(results, 2); // TODO set numMoves
    $('damageresult').innerHTML = $('astext').checked ? resultsToText(results, 1) : resultsToTable(results, 2); // TODO set numMoves
}

function getDefensiveItems() {
    return ['Air Balloon', 'DeepSeaScale', 'Eviolite', 'Metal Powder', 'Soul Dew', 
            'Chilan Berry', 'Rindo Berry', 'Occa Berry', 'Passho Berry', 'Wacan Berry', 'Yache Berry', 'Coba Berry', 'Chople Berry', 'Tanga Berry', 
            'Kebia Berry', 'Shuca Berry', 'Charti Berry', 'Payapa Berry', 'Kasib Berry', 'Haban Berry', 'Colbur Berry', 'Babiri Berry', 
            'Choice Scarf', 'Iron Ball', 'Macho Brace'];
}

function getDefensiveAbilities() {
    return ['Air Lock', 'Cloud Nine', 'Drizzle', 'Drought', 'Dry Skin', 'Filter', 'Flash Fire', 'Flower Gift', 'Heatproof',
            'Intimidate', 'Levitate', 'Lightningrod', 'Marvel Scale', 'Motor Drive', 'Multiscale', 'Sand Stream', 'Sap Sipper',
            'Snow Warning', 'Solid Rock', 'Storm Drain', 'Thick Fat', 'Unaware', 'Volt Absorb', 'Water Absorb', 'Wonder Guard'];
}

//TODO clean this up
function getUniqueTargets(set) {
    //flash fire should not be "optional" defensively
    if (set.abilities.length === 2 && set.abilities.indexOf('Flash Fire') !== -1 && set.abilities.indexOf('') !== -1) {
        set.abilities = ['Flash Fire'];
    }
    
    var sets = [];
    var hasClearItem = false;
    for (var i = 0; i < set.items.length; i++) {
        if (set.items.length > 1 && getDefensiveItems().indexOf(set.items[i]) !== -1) {
            var hasClearAbility = false;
            for (var j = 0; j < set.abilities.length; j++) {
                if (set.abilities.length > 1 && getDefensiveAbilities().indexOf(set.abilities[j]) !== -1) {
                    var tmp = cloneObj(set);
                    tmp.items[0] = set.items[i];
                    tmp.abilities[0] = set.abilities[j];
                    tmp.set = set.set + " [" + set.items[i] + "] [" + set.abilities[j] + "]";
                    sets.push(tmp);
                }
                else if (!hasClearAbility) {
                    hasClearAbility = true;
                    var tmp = cloneObj(set);
                    tmp.items[0] = set.items[i];
                    tmp.abilities[0] = set.abilities[j];
                    tmp.set = set.set + " [" + set.items[i] + "]";
                    sets.push(tmp);
                }
            }
        }
        else if (!hasClearItem) {
            hasClearItem = true;
            var hasClearAbility = false;
            for (var k = 0; k < set.abilities.length; k++) {
                if (set.abilities.length > 1 && getDefensiveAbilities().indexOf(set.abilities[k]) !== -1) {
                    var tmp = cloneObj(set);
                    tmp.items[0] = set.items[i];
                    tmp.abilities[0] = set.abilities[k];
                    tmp.set = set.set + " [" + set.abilities[k] + "]";
                    sets.push(tmp);
                }
                else if (!hasClearAbility) {
                    hasClearAbility = true;
                    var tmp = cloneObj(set);
                    tmp.items[0] = set.items[i];
                    tmp.abilities[0] = set.abilities[k];
                    tmp.set = set.set;
                    sets.push(tmp);
                }
            }
        }
    }
    return sets;
}

function removeDuplicates(results, moves) {
    for (var i = 0; i < results.length-1; i++) {
        if (results[i].set.pokemon === results[i+1].set.pokemon) {
            var dupe = true;
            for (var j = 0; j < moves; j++) {
                if (results[i+1].damage[j].max - results[i].damage[j].max >= 0.1) {
                    dupe = false;
                    break;
                }
            }
            if (dupe) {
                if (results[i].set.set.length > results[i+1].set.set.length) {
                    results.splice(i, 1);
                } else {
                    results.splice(i+1, 1);
                }
                i--;
            }
        }
    }
}

function resultsToTable(results, moves) {
    var out = '<table>\n<tr><th width="350">Target</th><th width="90">Best Move</th><th width="100">Damage</th>';
    for (var i = 1; i < moves; i++) {
        out += '<th width="90">Next Best</th><th width="100">Damage</th>';
    }
    out += '</tr>';
    
    for (i = 0; i < results.length; i++) {
        out += '<tr><td>' + getFullSetName(results[i].set) + '</td>';
        for (var j = 0; j < moves; j++) {
            out += '<td>' + getCleanMoveName(results[i].damage[j].move) + '</td><td>' + results[i].damage[j].min + ' - ' + results[i].damage[j].max + '%</td>';
        }
        out += '</tr>';
    }
    out += '</table>';
    return out;
}

function resultsToText(results, moves) {
    var out = '<textarea>';
    for (var i = 0; i < results.length; i++) {
        for (var j = 0; j < moves; j++) {
            if (results[i].damage[j].desc && results[i].damage[j].max > 0) {
                out += results[i].damage[j].desc + ': ' + results[i].damage[j].min + ' - ' + results[i].damage[j].max + '%\n';
            }
        }
    }
    if (out.length <= 10) {
        out += 'Nothing interesting to show.';
    }
    out += '</textarea>';
    return out;
}

function calc(target) {
    var attacker = {
        'name' : $('user').value.split(' ')[0],
        'level' : parseInt($('level').value),
        'type1' : $('type1').value,
        'type2' : $('type2').value,
        'at' : parseInt($('at').value),
        'atm' : parseInt($('atstage').value),
        'ati' : parseInt($('atevs').value) + getSignForNature($('nature').value, 0) + ' Atk',
        'sa' : parseInt($('sa').value),
        'sam' : parseInt($('sastage').value),
        'sai' : parseInt($('saevs').value) + getSignForNature($('nature').value, 2) + ' SpA',
        'sp' : parseInt($('sp').value),
        'spm' : parseInt($('spstage').value),
        'item' : $('item').value,
        'ability' : $('ability').value,
        'status' : $('status').value,
        'weight' : uweight
    };
    var defender = {
        'name' : target.pokemon,
        'type1' : target.type1,
        'type2' : target.type2,
        'hp' : calcHP(target.hpbase, target.hpivs, target.hpevs, target.level),
        'hpi' : target.hpevs + ' HP',
        'df' : calcStat(target.dfbase, target.dfivs, target.dfevs, target.level, calcNature(getNatureVals(target.nature)[1])),
        'dfm' : 0,
        'dfi' : target.dfevs + getSignForNature(target.nature, 1) + ' Def',
        'sd' : calcStat(target.sdbase, target.sdivs, target.sdevs, target.level, calcNature(getNatureVals(target.nature)[3])),
        'sdm' : 0,
        'sdi' : target.sdevs + getSignForNature(target.nature, 3) + ' SpD',
        'sp' : calcStat(target.spbase, target.spivs, target.spevs, target.level, calcNature(getNatureVals(target.nature)[4])),
        'spm' : 0,
        'item' : target.items[0],
        'ability' : target.abilities[0],
        'status' : 'Healthy',
        'weight' : target.w
    };
    var moves = [
        {
            'name' : $('move1').value,
            'bp' : parseInt($('move1pwr').value),
            'type' : $('move1type').value,
            'physical' : $('move1cat').selectedIndex === 0
        },
        {
            'name' : $('move2').value,
            'bp' : parseInt($('move2pwr').value),
            'type' : $('move2type').value,
            'physical' : $('move2cat').selectedIndex === 0
        },
        {
            'name' : $('move3').value,
            'bp' : parseInt($('move3pwr').value),
            'type' : $('move3type').value,
            'physical' : $('move3cat').selectedIndex === 0
        },
        {
            'name' : $('move4').value,
            'bp' : parseInt($('move4pwr').value),
            'type' : $('move4type').value,
            'physical' : $('move4cat').selectedIndex === 0
        }
    ];
    var weather = $('weather').value;
    var isDoubles = $('doubles').checked;
    var isReflect = false;
    var isLightScreen = false;
    var isForesight = $('foresight').checked;
    var isGravity = $('gravity').checked;
    var isHelpingHand = $('helping').checked;
    var isSwitchin = $('switching').checked;
    var isCriticalHit = false;
    
    var damage = getAllDamage(attacker, defender, moves, weather, isDoubles, isReflect, isLightScreen, isForesight, isGravity, isHelpingHand, isSwitchin, isCriticalHit);
    
    var results = [];
    for (var i = 0; i < 4; i++) {
        results.push({
            'move' : moves[i],
            'min' : Math.floor(damage[i].damage[0] * 10000 / defender.hp) / 100,
            'max' : Math.floor(damage[i].damage[15] * 10000 / defender.hp) / 100,
            'desc' : damage[i].desc
        });
    }
    
    results.sort(
        function(a, b) {
            return b.max - a.max;
        }
    );
    return results;
}
</script>
</head>
<body onload="resize()" onresize="resize()">
<h1>"One vs All" Pokemon Offensive Coverage Calculator</h1>
<p>Created by Honko. Based on <a href="http://pokedex-br.info/damage.html">AMF's damage calculator</a>. 
Thanks to <a href="http://www.smogon.com/bw/articles/bw_complete_damage_formula">Xfr, Bond697, Kaphotics, and V4Victini</a> for the formula.</p>
<p id="help"><b>HOW TO PLAY:</b> Select an attacker, adjust its stats/item/ability/weatherfulness/moves as necessary, pick your tiers, and hit GO! 
Mouse over the fields for further explanation.</p>
<p>To see how a Pokemon fares defensively instead, check out the "<a href="wall">All vs One</a>" calculator. 
If you want to tweak both the attacker and the target, try the <a href="./">1v1 damage calculator</a>.
<select id="style" style="float:right">
<option>Singles</option>
<option>VGC</option>
<option>LC</option>
</select></p>
<hr />
<form>
<fieldset>
<legend>Attacker info</legend>
<ul>
<li>
<select id="user"></select>
</li><br /><li>
<label title="Select the attacker's type." for="type1">Type</label>
<select title="Select the attacker's PRIMARY type." id="type1"></select>
<select title="Select the attacker's SECONDARY type." id="type2"></select>
</li><li>
<label title="Input the attacker's level here. Minimum 1, maximum 100." for="level">Level</label>
<input title="Input the attacker's level here. Minimum 1, maximum 100." id="level" value="100" />
</li><li>
<label title="Input the attacker's base Attack here. Minimum 1." for="at">Attack</label>
<input title="Input the attacker's base Attack here. Minimum 1." id="baseat" value="100" />&nbsp;
<input title="Input the attacker's Attack EVs here. Minimum 0, maximum 255." id="atevs" value="0" />&nbsp;EVs&nbsp;&nbsp;
<input title="Input the attacker's Attack IVs here. Minimum 0, maximum 31." id="ativs" value="31" />&nbsp;IVs&nbsp;&nbsp;
<input title="Input the attacker's Attack here. Minimum 1." id="at" value="236" />
<select title="Input the attacker's Attack modifier here." id="atstage">
<option value="6">+6</option>
<option value="5">+5</option>
<option value="4">+4</option>
<option value="3">+3</option>
<option value="2">+2</option>
<option value="1">+1</option>
<option value="0" selected="selected">+0</option>
<option>-1</option>
<option>-2</option>
<option>-3</option>
<option>-4</option>
<option>-5</option>
<option>-6</option>
</select>
</li><li>
<label title="Input the attacker's base Special Attack here. Minimum 1." for="sa">Sp.Attack</label>
<input title="Input the attacker's base Special Attack here. Minimum 1." id="basesa" value="100" />&nbsp;
<input title="Input the attacker's Special Attack EVs here. Minimum 0, maximum 255." id="saevs" value="0" />&nbsp;EVs&nbsp;&nbsp;
<input title="Input the attacker's Special Attack IVs here. Minimum 0, maximum 31." id="saivs" value="31" />&nbsp;IVs&nbsp;&nbsp;
<input title="Input the attacker's Special Attack here. Minimum 1." id="sa" value="236" />
<select title="Input the attacker's Special Attack modifier here." id="sastage">
<option value="6">+6</option>
<option value="5">+5</option>
<option value="4">+4</option>
<option value="3">+3</option>
<option value="2">+2</option>
<option value="1">+1</option>
<option value="0" selected="selected">+0</option>
<option>-1</option>
<option>-2</option>
<option>-3</option>
<option>-4</option>
<option>-5</option>
<option>-6</option>
</select>
</li><li>
<label title="Input the attacker's base Speed here. Minimum 1." for="sp">Speed</label>
<input title="Input the attacker's base Speed here. Minimum 1." id="basesp" value="100" />&nbsp;
<input title="Input the attacker's Speed EVs here. Minimum 0, maximum 255." id="spevs" value="0" />&nbsp;EVs&nbsp;&nbsp;
<input title="Input the attacker's Speed IVs here. Minimum 0, maximum 31." id="spivs" value="31" />&nbsp;IVs&nbsp;&nbsp;
<input title="Input the attacker's Speed here. Minimum 1." id="sp" value="236" />
<select title="Input the attacker's Speed modifier here." id="spstage">
<option value="6">+6</option>
<option value="5">+5</option>
<option value="4">+4</option>
<option value="3">+3</option>
<option value="2">+2</option>
<option value="1">+1</option>
<option value="0" selected="selected">+0</option>
<option>-1</option>
<option>-2</option>
<option>-3</option>
<option>-4</option>
<option>-5</option>
<option>-6</option>
</select>
</li><li>
<label title="Select the attacker's item, ONLY if it's in effect." for="item">Item</label>
<select title="Select the attacker's item, ONLY if it's in effect." id="item"></select>
<span title="Is the target switching in on this turn?" for="switching">
<input title="Is the target switching in on this turn?" id="switching" type="checkbox" />Switching In</span>
</li><li>
<label title="Select the attacker's special ability, ONLY if it's activated. (For example, only select Guts if the attacker is statused.)" for="ability">Ability</label>
<select title="Select the attacker's special ability, ONLY if it's activated. (For example, only select Guts if the attacker is statused.)" id="ability"></select>
<span title="Is this a 2v2 or 3v3 battle?" for="doubles">
<input title="Is this a 2v2 or 3v3 battle?" id="doubles" type="checkbox" />Doubles/Triples</span>
</li><li>
<label title="Select the attacker's nature." for="nature">Nature</label>
<select title="Select the attacker's nature." id="nature"></select>
<span title="Has the attacker's power been boosted by Helping Hand this turn?" for="helping">
<input title="Has the attacker's power been boosted by Helping Hand this turn?" id="helping" type="checkbox" />Helping Hand</span>
</li><li>
<label title="Select the attacker's status." for="status">Status</label>
<select title="Select the attacker's status." id="status">
<option>Healthy</option>
<option>Poisoned</option>
<option>Paralyzed</option>
<option>Burned</option>
<option>Asleep</option>
</select>
<span title="Has the target been revealed by Foresight or Odor Sleuth?" for="foresight">
<input title="Has the target been revealed by Foresight or Odor Sleuth?" id="foresight" type="checkbox" />Foresight</span>
</li><li>
<label title="Are any weather conditions in effect?" for="weather">Weather</label>
<select title="Are any weather conditions in effect?" id="weather">
<option>(none)</option>
<option>Sunny Day</option>
<option>Rain Dance</option>
<option>Sandstorm</option>
<option>Hail</option>
</select>
<span title="Is Gravity in effect?" for="gravity">
<input title="Is Gravity in effect?" id="gravity" type="checkbox" />Gravity</span>
</li><br /><li>
<select title="Select a move." id="move1"></select>
<input title="Input the move's base power here." id="move1pwr" value="100" />
<select title="Select the move's type here." id="move1type"></select>
<select title="Is the move Physical or Special?" id="move1cat">
<option>Physical</option>
<option>Special</option>
</select>
</li><li>
<select title="Select a move." id="move2"></select>
<input title="Input the move's base power here." id="move2pwr" value="0" />
<select title="Select the move's type here." id="move2type"></select>
<select title="Is the move Physical or Special?" id="move2cat">
<option>Physical</option>
<option>Special</option>
</select>
</li><li>
<select title="Select a move." id="move3"></select>
<input title="Input the move's base power here." id="move3pwr" value="0" />
<select title="Select the move's type here." id="move3type"></select>
<select title="Is the move Physical or Special?" id="move3cat">
<option>Physical</option>
<option>Special</option>
</select>
</li><li>
<select title="Select a move." id="move4"></select>
<input title="Input the move's base power here." id="move4pwr" value="0" />
<select title="Select the move's type here." id="move4type"></select>
<select title="Is the move Physical or Special?" id="move4cat">
<option>Physical</option>
<option>Special</option>
</select>
</li><br /><li>
<label title="What tiers do you want to check?" for="hightier">Tiers</label>
<select title="What is the highest tier you want to check?" id="hightier">
<option>Uber</option>
<option selected="selected">OU</option>
<option>UU</option>
<option>RU</option>
<option>NU</option>
<option>VGC</option>
<option>LC</option>
</select>
 to 
<select title="What is the lowest tier you want to check?" id="lowtier">
<option>Uber</option>
<option selected="selected">OU</option>
<option>UU</option>
<option>RU</option>
<option>NU</option>
<option>VGC</option>
<option>LC</option>
</select> 
<input title="Do you want to ignore Pokemon that lack enough usage to qualify for these tiers? (for example, ignore Carracosta in OU even though it has an OU analysis)" id="strict" type="checkbox" />Strict
<input title="Output the results as copypasta-friendly text instead of a table?" id="astext" type="checkbox" />Copypasta
</li><li>
<input type="button" value="Go!" onclick="calcAll()" />
</li>
</ul>
</fieldset>
<fieldset>
<legend>Damage calculations</legend>
<div id="damageresult"></div>
</fieldset>
</form>
</body>
<script type="text/javascript">
if(navigator.appName == 'Microsoft Internet Explorer') {
   $('help').innerHTML = '<br /><br /><b>NOTE: This calculator does not work properly in Internet Explorer.</b> Try switching to Chrome, Firefox, or pretty much anything that isn\'t IE.';
}

if (document.URL.indexOf('?style=vgc') !== -1) {
    $('style').value = 'VGC';
    setStyle();
} else if (document.URL.indexOf('?style=lc') !== -1) {
    $('style').value = 'LC';
    setStyle();
}

$('user').innerHTML = getUserOptions();
var typeOptions = getTypeOptions();
$('type1').innerHTML = typeOptions;
$('type2').innerHTML = typeOptions.replace('Normal','(none)');
$('move1type').innerHTML = $('move2type').innerHTML = $('move3type').innerHTML = $('move4type').innerHTML = typeOptions;
$('item').innerHTML = getItemOptions();
$('ability').innerHTML = getAbilityOptions();
$('nature').innerHTML = getNatureOptions();
var moveOptions = getMoveOptions();
$('move1').innerHTML = moveOptions[0];
$('move2').innerHTML = moveOptions[1];
$('move3').innerHTML = moveOptions[2];
$('move4').innerHTML = moveOptions[3];

function setStyle() {
    var style = $('style').value;
    if (style === 'Singles') {
        allSets = getAllSets();
        $('doubles').checked = false;
        $('hightier').value = $('lowtier').value = 'OU';
    } else if (style === 'VGC') {
        allSets = getVgcSets();
        $('doubles').checked = true;
        $('hightier').value = $('lowtier').value = 'VGC';
    } else if (style === 'LC') {
        allSets = getLcSets();
        $('doubles').checked = false;
        $('hightier').value = $('lowtier').value = 'LC';
    }
    $('user').innerHTML = getUserOptions();
}

function getUserOptions() {
   var out = "<option>(custom)</option>";
   for(var i in allSets) {
      out += "<option>" + allSets[i].pokemon + " (" + allSets[i].meta + " " + allSets[i].set + ")</option>";
   }
   return out;
}

function resize() {
   var dh = window.innerHeight ? (window.innerHeight - $('damageresult').offsetTop - 10) : 400;
   $('damageresult').style.height = dh + 'px';
}

function attach(widgets) {
   for (var i = 0, j = widgets.length; i < j; i++) {
      var wid = widgets[i].id;
      var f = (wid == 'user') ? setUser : 
            (wid == 'move1') ? function(){setMove(1);} : (wid == 'move2') ? function(){setMove(2);} : 
            (wid == 'move3') ? function(){setMove(3);} : (wid == 'move4') ? function(){setMove(4);} :
            (wid == 'baseat' || wid == 'atevs' || wid == 'ativs') ? setAT : 
            (wid == 'basesa' || wid == 'saevs' || wid == 'saivs') ? setSA :
            (wid == 'basesp' || wid == 'spevs' || wid == 'spivs') ? setSP :
            (wid == 'level' || wid == 'nature') ? function(){setAT();setSA();setSP();} : 
            wid == 'style' ? setStyle : validateAll;
      if (window.ActiveXObject) {
         widgets[i].attachEvent('onchange', f);
         widgets[i].attachEvent('onkeyup', f);
      }
      else {
         widgets[i].addEventListener('change', f, false);
         widgets[i].addEventListener('keyup', f, false);
      }
   }
}

attach(document.getElementsByTagName('input'));
attach(document.getElementsByTagName('select'));
</script>
</html>
