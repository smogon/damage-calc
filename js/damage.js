<!DOCTYPE html>
<html lang="us" manifest="cache.appcache">

<head>
    <meta charset="UTF-8" />
    <title>A Pok&eacute;mon Calculator</title>
    <link type="text/css" rel="stylesheet" href="./select2/select2.css" />
    <link type="text/css" rel="stylesheet" href="./ap_calc.css?v2" />
    <link type="text/css" rel="stylesheet" href="./bootstrap.css" />
	
	<style type="text/css">
		.total{
			color:black;	
		}
	</style>
</head>

<body>

<div class="header"><div class="header-inner">
    <ul class="nav">
        <li><a class="button nav-first" href="/"><img src="/images/pokemonshowdownbeta.png" alt="Pok&eacute;mon Showdown! (beta)" /> Home</a></li>
        <li><a class="button" href="/dex/">Pok&eacute;dex</a></li>
        <li><a class="button" href="//replay.pokemonshowdown.com/">Replays</a></li>
        <li><a class="button" href="/ladder/">Ladder</a></li>
        <li><a class="button nav-last" href="/forums/">Forum</a></li>
    </ul>
    <ul class="nav nav-play">
        <li><a class="button greenbutton nav-first nav-last" href="//play.pokemonshowdown.com/">Play</a></li>
    </ul>
    <div style="clear:both"></div>
</div></div>
<div class="wrapper">

    <div>
        <span class="title-text">Pok&eacute;mon Damage Calculator</span>
        <span title="Select the generation.">
            <input class="gen btn-input" type="radio" name="gen" value="1" id="gen1" /><label class="btn btn-small btn-left" for="gen1">RBY</label>
            <input class="gen btn-input" type="radio" name="gen" value="2" id="gen2" /><label class="btn btn-small btn-mid" for="gen2">GSC</label>
            <input class="gen btn-input" type="radio" name="gen" value="3" id="gen3" /><label class="btn btn-small btn-mid" for="gen3">ADV</label>
            <input class="gen btn-input" type="radio" name="gen" value="4" id="gen4" /><label class="btn btn-small btn-mid" for="gen4">DPP</label>
            <input class="gen btn-input" type="radio" name="gen" value="5" id="gen5" /><label class="btn btn-small btn-mid" for="gen5">B/W</label>
            <input class="gen btn-input" type="radio" name="gen" value="6" id="gen6" checked="checked" /><label class="btn btn-small btn-right" for="gen6">X/Y</label>
        </span>
        <span title="Select the calculator's mode of function.">
            <input class="mode btn-input" type="radio" name="mode" id="all-vs-one" /><label class="btn btn-wide btn-right right" for="all-vs-one">All vs One</label>
            <input class="mode btn-input" type="radio" name="mode" id="one-vs-all" /><label class="btn btn-wide btn-mid right" for="one-vs-all">One vs All</label>
            <input class="mode btn-input" type="radio" name="mode" id="one-vs-one" checked="checked" /><label class="btn btn-wide btn-left right" for="one-vs-one">One vs One</label>
        </span>
    </div>
    <hr />
    <div class="move-result-group" title="Select a move to show detailed results.">
        <div class="move-result-subgroup">
            <div class="result-move-header"><span id="resultHeaderL">Pok&eacute;mon 1's Moves (select one to show detailed results)</span>
            </div>
            <div>
                <input class="result-move btn-input" type="radio" name="resultMove" id="resultMoveL1" checked="checked" />
                <label class="btn btn-xxxwide btn-top" for="resultMoveL1">Hi Jump Kick</label>
                <span id="resultDamageL1">??? - ???%</span>
            </div>
            <div>
                <input class="result-move btn-input" type="radio" name="resultMove" id="resultMoveL2" />
                <label class="btn btn-xxxwide btn-mid" for="resultMoveL2">Falcon Punch</label>
                <span id="resultDamageL2">??? - ???%</span>
            </div>
            <div>
                <input class="result-move btn-input" type="radio" name="resultMove" id="resultMoveL3" />
                <label class="btn btn-xxxwide btn-mid" for="resultMoveL3">Suspicious Odor</label>
                <span id="resultDamageL3">??? - ???%</span>
            </div>
            <div>
                <input class="result-move btn-input" type="radio" name="resultMove" id="resultMoveL4" />
                <label class="btn btn-xxxwide btn-bottom" for="resultMoveL4">Tombstoner</label>
                <span id="resultDamageL4">??? - ???%</span>
            </div>
        </div>
        <div class="move-result-subgroup">
            <div class="result-move-header"><span id="resultHeaderR">Pok&eacute;mon 2's Moves (select one to show detailed results)</span>
            </div>
            <div>
                <input class="result-move btn-input" type="radio" name="resultMove" id="resultMoveR1" />
                <label class="btn btn-xxxwide btn-top" for="resultMoveR1">Hi Jump Kick</label>
                <span id="resultDamageR1">??? - ???%</span>
            </div>
            <div>
                <input class="result-move btn-input" type="radio" name="resultMove" id="resultMoveR2" />
                <label class="btn btn-xxxwide btn-mid" for="resultMoveR2">Falcon Punch</label>
                <span id="resultDamageR2">??? - ???%</span>
            </div>
            <div>
                <input class="result-move btn-input" type="radio" name="resultMove" id="resultMoveR3" />
                <label class="btn btn-xxxwide btn-mid" for="resultMoveR3">Suspicious Odor</label>
                <span id="resultDamageR3">??? - ???%</span>
            </div>
            <div>
                <input class="result-move btn-input" type="radio" name="resultMove" id="resultMoveR4" />
                <label class="btn btn-xxxwide btn-bottom" for="resultMoveR4">Tombstoner</label>
                <span id="resultDamageR4">??? - ???%</span>
            </div>
        </div>
    </div>
    <div class="main-result-group">
        <div class="big-text"><span id="mainResult">Loading...</span>
        </div>
        <div class="small-text"><span id="damageValues">(If you see this message for more than a few seconds, try enabling JavaScript.)</span>
        </div>
    </div>
    
    <div class="panel">
        <fieldset class="poke-info" id="p1">
            <legend align="center">Pok&eacute;mon 1</legend>
            <input type="text" class="set-selector calc-trigger" />
            <div class="info-group">
                <div>
                    <label>Type</label>
                    <select class="type1 terrain-trigger calc-trigger"></select>
                    <select class="type2 terrain-trigger calc-trigger"></select>
                </div>
                <div>
                    <label>Level</label>
                    <input class="level calc-trigger" value="100" />
                </div>
                <div class="hide">
                    <label>Weight (kg)</label>
                    <input class="weight calc-trigger" value="10.0" />
                </div>
            </div>
            <div class="info-group">
                <table>
                    <tr>
                        <th></th>
                        <th>Base</th>
                        <th class="gen-specific g3 g4 g5 g6">IVs</th>
                        <th class="gen-specific g3 g4 g5 g6">EVs</th>
                        <th class="gen-specific g1 g2 hide">DVs</th>
                        <th></th>
                        <th></th>
                    </tr>
                    <tr class="hp">
                        <td>
                            <label>HP</label>
                        </td>
                        <td>
                            <input class="base calc-trigger" value="100" />
                        </td>
                        <td class="gen-specific g3 g4 g5 g6">
                            <input class="ivs calc-trigger" value="31" />
                        </td>
                        <td class="gen-specific g3 g4 g5 g6">
                            <input class="evs calc-trigger" type="number" min="0" max="252" step="4" value="0" />
                        </td>
                        <td class="gen-specific g1 g2 hide">
                            <input class="dvs calc-trigger" value="15" disabled="disabled" />
                        </td>
                        <td><span class="total">341</span>
                        </td>
                        <td></td>
                    </tr>
                    <tr class="at">
                        <td>
                            <label>Attack</label>
                        </td>
                        <td>
                            <input class="base calc-trigger" value="100" />
                        </td>
                        <td class="gen-specific g3 g4 g5 g6">
                            <input class="ivs calc-trigger" value="31" />
                        </td>
                        <td class="gen-specific g3 g4 g5 g6">
                            <input class="evs calc-trigger" type="number" min="0" max="252" step="4" value="0" />
                        </td>
                        <td class="gen-specific g1 g2 hide">
                            <input class="dvs calc-trigger" value="15" />
                        </td>
                        <td><span class="total">236</span>
                        </td>
                        <td>
                            <select class="boost calc-trigger">
                                <option value="6">+6</option>
                                <option value="5">+5</option>
                                <option value="4">+4</option>
                                <option value="3">+3</option>
                                <option value="2">+2</option>
                                <option value="1">+1</option>
                                <option value="0" selected="selected">--</option>
                                <option value="-1">-1</option>
                                <option value="-2">-2</option>
                                <option value="-3">-3</option>
                                <option value="-4">-4</option>
                                <option value="-5">-5</option>
                                <option value="-6">-6</option>
                            </select>
                        </td>
                    </tr>
                    <tr class="df">
                        <td>
                            <label>Defense</label>
                        </td>
                        <td>
                            <input class="base calc-trigger" value="100" />
                        </td>
                        <td class="gen-specific g3 g4 g5 g6">
                            <input class="ivs calc-trigger" value="31" />
                        </td>
                        <td class="gen-specific g3 g4 g5 g6">
                            <input class="evs calc-trigger" type="number" min="0" max="252" step="4" value="0" />
                        </td>
                        <td class="gen-specific g1 g2 hide">
                            <input class="dvs calc-trigger" value="15" />
                        </td>
                        <td><span class="total">236</span>
                        </td>
                        <td>
                            <select class="boost calc-trigger">
                                <option value="6">+6</option>
                                <option value="5">+5</option>
                                <option value="4">+4</option>
                                <option value="3">+3</option>
                                <option value="2">+2</option>
                                <option value="1">+1</option>
                                <option value="0" selected="selected">--</option>
                                <option value="-1">-1</option>
                                <option value="-2">-2</option>
                                <option value="-3">-3</option>
                                <option value="-4">-4</option>
                                <option value="-5">-5</option>
                                <option value="-6">-6</option>
                            </select>
                        </td>
                    </tr>
                    <tr class="sa gen-specific g2 g3 g4 g5 g6">
                        <td>
                            <label>Sp. Atk</label>
                        </td>
                        <td>
                            <input class="base calc-trigger" value="100" />
                        </td>
                        <td class="gen-specific g3 g4 g5 g6">
                            <input class="ivs calc-trigger" value="31" />
                        </td>
                        <td class="gen-specific g3 g4 g5 g6">
                            <input class="evs calc-trigger" type="number" min="0" max="252" step="4" value="0" />
                        </td>
                        <td class="gen-specific g1 g2 hide">
                            <input class="dvs calc-trigger" value="15" />
                        </td>
                        <td><span class="total">236</span>
                        </td>
                        <td>
                            <select class="boost calc-trigger">
                                <option value="6">+6</option>
                                <option value="5">+5</option>
                                <option value="4">+4</option>
                                <option value="3">+3</option>
                                <option value="2">+2</option>
                                <option value="1">+1</option>
                                <option value="0" selected="selected">--</option>
                                <option value="-1">-1</option>
                                <option value="-2">-2</option>
                                <option value="-3">-3</option>
                                <option value="-4">-4</option>
                                <option value="-5">-5</option>
                                <option value="-6">-6</option>
                            </select>
                        </td>
                    </tr>
                    <tr class="sd gen-specific g2 g3 g4 g5 g6">
                        <td>
                            <label>Sp. Def</label>
                        </td>
                        <td>
                            <input class="base calc-trigger" value="100" />
                        </td>
                        <td class="gen-specific g3 g4 g5 g6">
                            <input class="ivs calc-trigger" value="31" />
                        </td>
                        <td class="gen-specific g3 g4 g5 g6">
                            <input class="evs calc-trigger" type="number" min="0" max="252" step="4" value="0" />
                        </td>
                        <td class="gen-specific g1 g2 hide">
                            <input class="dvs calc-trigger" value="15" disabled="disabled" />
                        </td>
                        <td><span class="total">236</span>
                        </td>
                        <td>
                            <select class="boost calc-trigger">
                                <option value="6">+6</option>
                                <option value="5">+5</option>
                                <option value="4">+4</option>
                                <option value="3">+3</option>
                                <option value="2">+2</option>
                                <option value="1">+1</option>
                                <option value="0" selected="selected">--</option>
                                <option value="-1">-1</option>
                                <option value="-2">-2</option>
                                <option value="-3">-3</option>
                                <option value="-4">-4</option>
                                <option value="-5">-5</option>
                                <option value="-6">-6</option>
                            </select>
                        </td>
                    </tr>
                    <tr class="sl gen-specific g1 hide">
                        <td>
                            <label>Special</label>
                        </td>
                        <td>
                            <input class="base calc-trigger" value="100" />
                        </td>
                        <td>
                            <input class="dvs calc-trigger" value="15" />
                        </td>
                        <td><span class="total">236</span>
                        </td>
                        <td>
                            <select class="boost calc-trigger">
                                <option value="6">+6</option>
                                <option value="5">+5</option>
                                <option value="4">+4</option>
                                <option value="3">+3</option>
                                <option value="2">+2</option>
                                <option value="1">+1</option>
                                <option value="0" selected="selected">--</option>
                                <option value="-1">-1</option>
                                <option value="-2">-2</option>
                                <option value="-3">-3</option>
                                <option value="-4">-4</option>
                                <option value="-5">-5</option>
                                <option value="-6">-6</option>
                            </select>
                        </td>
                    </tr>
                    <tr class="sp">
                        <td>
                            <label>Speed</label>
                        </td>
                        <td>
                            <input class="base calc-trigger" value="100" />
                        </td>
                        <td class="gen-specific g3 g4 g5 g6">
                            <input class="ivs calc-trigger" value="31" />
                        </td>
                        <td class="gen-specific g3 g4 g5 g6">
                            <input class="evs calc-trigger" type="number" min="0" max="252" step="4" value="0" />
                        </td>
                        <td class="gen-specific g1 g2 hide">
                            <input class="dvs calc-trigger" value="15" />
                        </td>
                        <td><span class="total">236</span>
                        </td>
                        <td>
                            <select class="boost calc-trigger">
                                <option value="6">+6</option>
                                <option value="5">+5</option>
                                <option value="4">+4</option>
                                <option value="3">+3</option>
                                <option value="2">+2</option>
                                <option value="1">+1</option>
                                <option value="0" selected="selected">--</option>
                                <option value="-1">-1</option>
                                <option value="-2">-2</option>
                                <option value="-3">-3</option>
                                <option value="-4">-4</option>
                                <option value="-5">-5</option>
                                <option value="-6">-6</option>
                            </select>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="info-group info-selectors">
                <div class="gen-specific g3 g4 g5 g6">
                    <label>Nature</label>
                    <select class="nature calc-trigger">
                        <option value="Adamant">Adamant</option>
                        <option value="Bashful">Bashful</option>
                        <option value="Bold">Bold</option>
                        <option value="Brave">Brave</option>
                        <option value="Calm">Calm</option>
                        <option value="Careful">Careful</option>
                        <option value="Docile">Docile</option>
                        <option value="Gentle">Gentle</option>
                        <option value="Hardy" selected="selected">Hardy</option>
                        <option value="Hasty">Hasty</option>
                        <option value="Impish">Impish</option>
                        <option value="Jolly">Jolly</option>
                        <option value="Lax">Lax</option>
                        <option value="Lonely">Lonely</option>
                        <option value="Mild">Mild</option>
                        <option value="Modest">Modest</option>
                        <option value="Naive">Naive</option>
                        <option value="Naughty">Naughty</option>
                        <option value="Quiet">Quiet</option>
                        <option value="Quirky">Quirky</option>
                        <option value="Rash">Rash</option>
                        <option value="Relaxed">Relaxed</option>
                        <option value="Sassy">Sassy</option>
                        <option value="Serious">Serious</option>
                        <option value="Timid">Timid</option>
                    </select>
                </div>
                <div class="gen-specific g3 g4 g5 g6">
                    <label>Ability</label>
                    <select class="ability terrain-trigger calc-trigger"></select>
                </div>
                <div class="gen-specific g2 g3 g4 g5 g6">
                    <label>Item</label>
                    <select class="item terrain-trigger calc-trigger"></select>
                </div>
                <div>
                    <label>Status</label>
                    <select class="status calc-trigger">
                        <option value="Healthy">Healthy</option>
                        <option value="Poisoned">Poisoned</option>
                        <option value="Badly Poisoned">Badly Poisoned</option>
                        <option value="Burned">Burned</option>
                        <option value="Paralyzed">Paralyzed</option>
                        <option value="Asleep">Asleep</option>
                        <option value="Frozen">Frozen</option>
                    </select>
                    <select class="toxic-counter calc-trigger hide">
                        <option value="1">1/16</option>
                        <option value="2">2/16</option>
                        <option value="3">3/16</option>
                        <option value="4">4/16</option>
                        <option value="5">5/16</option>
                        <option value="6">6/16</option>
                        <option value="7">7/16</option>
                        <option value="8">8/16</option>
                        <option value="9">9/16</option>
                        <option value="10">10/16</option>
                        <option value="11">11/16</option>
                        <option value="12">12/16</option>
                        <option value="13">13/16</option>
                        <option value="14">14/16</option>
                        <option value="15">15/16</option>
                    </select>
                </div>
            </div>
            <div class="info-group">
                <label>Current HP</label>
                <input class="current-hp calc-trigger" value="341" />/<span class="max-hp">341</span> (
                <input class="percent-hp calc-trigger" value="100" />%)
            </div>
            <div class="move1">
                <select class="move-selector calc-trigger small-select"></select>
                <input class="move-bp calc-trigger" value="50" />
                <select class="move-type calc-trigger"></select>
                <select class="move-cat calc-trigger gen-specific g4 g5 g6">
                    <option value="Physical">Physical</option>
                    <option value="Special">Special</option>
                </select>
                <input class="move-crit calc-trigger btn-input" type="checkbox" id="critL1" />
                <label class="btn crit-btn" for="critL1" title="Force this attack to be a critical hit?">Crit</label>
                <select class="move-hits calc-trigger hide">
                    <option value="2">2 hits</option>
                    <option value="3">3 hits</option>
                    <option value="4">4 hits</option>
                    <option value="5">5 hits</option>
                </select>
            </div>
            <div class="move2">
                <select class="move-selector calc-trigger small-select"></select>
                <input class="move-bp calc-trigger" value="0" />
                <select class="move-type calc-trigger"></select>
                <select class="move-cat calc-trigger gen-specific g4 g5 g6">
                    <option value="Physical">Physical</option>
                    <option value="Special">Special</option>
                </select>
                <input class="move-crit calc-trigger btn-input" type="checkbox" id="critL2" />
                <label class="btn crit-btn" for="critL2" title="Force this attack to be a critical hit?">Crit</label>
                <select class="move-hits calc-trigger hide">
                    <option value="2">2 hits</option>
                    <option value="3">3 hits</option>
                    <option value="4">4 hits</option>
                    <option value="5">5 hits</option>
                </select>
            </div>
            <div class="move3">
                <select class="move-selector calc-trigger small-select"></select>
                <input class="move-bp calc-trigger" value="0" />
                <select class="move-type calc-trigger"></select>
                <select class="move-cat calc-trigger gen-specific g4 g5 g6">
                    <option value="Physical">Physical</option>
                    <option value="Special">Special</option>
                </select>
                <input class="move-crit calc-trigger btn-input" type="checkbox" id="critL3" />
                <label class="btn crit-btn" for="critL3" title="Force this attack to be a critical hit?">Crit</label>
                <select class="move-hits calc-trigger hide">
                    <option value="2">2 hits</option>
                    <option value="3">3 hits</option>
                    <option value="4">4 hits</option>
                    <option value="5">5 hits</option>
                </select>
            </div>
            <div class="move4">
                <select class="move-selector calc-trigger small-select"></select>
                <input class="move-bp calc-trigger" value="0" />
                <select class="move-type calc-trigger"></select>
                <select class="move-cat calc-trigger gen-specific g4 g5 g6">
                    <option value="Physical">Physical</option>
                    <option value="Special">Special</option>
                </select>
                <input class="move-crit calc-trigger btn-input" type="checkbox" id="critL4" />
                <label class="btn crit-btn" for="critL4" title="Force this attack to be a critical hit?">Crit</label>
                <select class="move-hits calc-trigger hide">
                    <option value="2">2 hits</option>
                    <option value="3">3 hits</option>
                    <option value="4">4 hits</option>
                    <option value="5">5 hits</option>
                </select>
            </div>
        </fieldset>
    </div>
    
    <div class="panel">
        <fieldset class="field-info">
            <legend align="center">Field</legend>
            <div class="gen-specific g3 g4 g5 g6" style="width: 10.6em; margin: 0 auto 5px;" title="Select the battle format.">
                <input class="btn-input calc-trigger" type="radio" name="format" value="Singles" id="singles-format" checked="checked" />
                <label class="btn btn-left" for="singles-format">Singles</label>
                <input class="btn-input calc-trigger" type="radio" name="format" value="Doubles" id="doubles-format" />
                <label class="btn btn-right" for="doubles-format">Doubles</label>
            </div>
            <div class="gen-specific g6" style="width: 24.2em; margin: 5px auto;" title="Select the current terrain.">
                <input class="btn-input terrain-trigger calc-trigger" type="checkbox" name="terrain" value="Electric" id="electric" /><label class="btn btn-xxwide btn-left" for="electric">Electric Terrain</label>
                <input class="btn-input terrain-trigger calc-trigger" type="checkbox" name="terrain" value="Grassy" id="grassy" /><label class="btn btn-xxwide btn-mid" for="grassy">Grassy Terrain</label>
                <input class="btn-input terrain-trigger calc-trigger" type="checkbox" name="terrain" value="Misty" id="misty" /><label class="btn btn-xwide btn-right" for="misty">Misty Terrain</label>
            </div>
            <hr class="gen-specific g6" />
            <div class="gen-specific g3 g4 g5 g6" style="width: 22.2em; margin: 5px auto;" title="Select the current weather condition.">
                <input class="btn-input calc-trigger" type="radio" name="weather" value="" id="clear" checked="checked" />
                <label class="btn btn-small btn-left" for="clear">None</label>
                <input class="btn-input calc-trigger" type="radio" name="weather" value="Sun" id="sun" />
                <label class="btn btn-small btn-mid" for="sun">Sun</label>
                <input class="btn-input calc-trigger" type="radio" name="weather" value="Rain" id="rain" />
                <label class="btn btn-small btn-mid" for="rain">Rain</label>
                <input class="btn-input calc-trigger" type="radio" name="weather" value="Sand" id="sand" />
                <label class="btn btn-small btn-mid" for="sand">Sand</label>
                <input class="btn-input calc-trigger" type="radio" name="weather" value="Hail" id="hail" />
                <label class="btn btn-small btn-right" for="hail">Hail</label>
            </div>
            <div class="gen-specific g6" title="Select the current weather condition.">
                <input class="btn-input calc-trigger" type="radio" name="weather" value="Harsh Sunshine" id="harsh-sunshine" />
                <label class="btn btn-xxxwide btn-left" for="harsh-sunshine">Harsh Sunshine</label>
                <input class="btn-input calc-trigger" type="radio" name="weather" value="Heavy Rain" id="heavy-rain" />
                <label class="btn btn-xxxwide btn-mid" for="heavy-rain">Heavy Rain</label>
                <input class="btn-input calc-trigger" type="radio" name="weather" value="Strong Winds" id="strong-winds" />
                <label class="btn btn-xxxwide btn-right" for="strong-winds">Strong Winds</label>
            </div>
            <div class="gen-specific g2 hide" style="width: 17.8em; margin: 0 auto 5px;" title="Select the current weather condition.">
                <input class="btn-input calc-trigger" type="radio" name="gscWeather" value="" id="gscClear" checked="checked" />
                <label class="btn btn-small btn-left" for="gscClear">None</label>
                <input class="btn-input calc-trigger" type="radio" name="gscWeather" value="Sun" id="gscSun" />
                <label class="btn btn-small btn-mid" for="gscSun">Sun</label>
                <input class="btn-input calc-trigger" type="radio" name="gscWeather" value="Rain" id="gscRain" />
                <label class="btn btn-small btn-mid" for="gscRain">Rain</label>
                <input class="btn-input calc-trigger" type="radio" name="gscWeather" value="Sand" id="gscSand" />
                <label class="btn btn-small btn-right" for="gscSand">Sand</label>
            </div>
            <div class="gen-specific g4 g5 g6" style="width: 5.3em; margin: 5px auto;" title="Is gravity in effect?">
                <input class="btn-input calc-trigger" type="checkbox" id="gravity" />
                <label class="btn" for="gravity">Gravity</label>
            </div>
            <hr class="gen-specific g2 g3 g4 g5 g6" />
            <div class="btn-group gen-specific g4 g5 g6">
                <div class="left" title="Is Stealth Rock affecting this side of the field?">
                    <input class="btn-input calc-trigger" type="checkbox" id="srL" />
                    <label class="btn btn-xwide" for="srL">Stealth Rock</label>
                </div>
                <div class="right" title="Is Stealth Rock affecting this side of the field?">
                    <input class="btn-input calc-trigger" type="checkbox" id="srR" />
                    <label class="btn btn-xwide" for="srR">Stealth Rock</label>
                </div>
            </div>
            <div class="btn-group gen-specific g3 g4 g5 g6">
                <div class="left" title="Are there Spikes on this side of the field?">
                    <input class="btn-input calc-trigger" type="radio" name="spikesL" value="0" id="spikesL0" checked="checked" />
                    <label class="btn btn-xsmall btn-left" for="spikesL0">0</label>
                    <input class="btn-input calc-trigger" type="radio" name="spikesL" value="1" id="spikesL1" />
                    <label class="btn btn-xsmall btn-mid" for="spikesL1">1</label>
                    <input class="btn-input calc-trigger" type="radio" name="spikesL" value="2" id="spikesL2" />
                    <label class="btn btn-xsmall btn-mid" for="spikesL2">2</label>
                    <input class="btn-input calc-trigger" type="radio" name="spikesL" value="3" id="spikesL3" />
                    <label class="btn btn-wide btn-right" for="spikesL3">3 Spikes</label>
                </div>
                <div class="right" title="Are there Spikes on this side of the field?">
                    <input class="btn-input calc-trigger" type="radio" name="spikesR" value="0" id="spikesR0" checked="checked" />
                    <label class="btn btn-xsmall btn-left" for="spikesR0">0</label>
                    <input class="btn-input calc-trigger" type="radio" name="spikesR" value="1" id="spikesR1" />
                    <label class="btn btn-xsmall btn-mid" for="spikesR1">1</label>
                    <input class="btn-input calc-trigger" type="radio" name="spikesR" value="2" id="spikesR2" />
                    <label class="btn btn-xsmall btn-mid" for="spikesR2">2</label>
                    <input class="btn-input calc-trigger" type="radio" name="spikesR" value="3" id="spikesR3" />
                    <label class="btn btn-wide btn-right" for="spikesR3">3 Spikes</label>
                </div>
            </div>
            <div class="btn-group gen-specific g2">
                <div class="left" title="Are there Spikes on this side of the field?">
                    <input class="btn-input calc-trigger" type="checkbox" id="gscSpikesL" />
                    <label class="btn" for="gscSpikesL">Spikes</label>
                </div>
                <div class="right" title="Are there Spikes on this side of the field?">
                    <input class="btn-input calc-trigger" type="checkbox" id="gscSpikesR" />
                    <label class="btn" for="gscSpikesR">Spikes</label>
                </div>
            </div>
            <div class="btn-group">
                <div class="left" title="Is this Pok&eacute;mon protected by Reflect and/or Light Screen?">
                    <input class="btn-input calc-trigger" type="checkbox" id="reflectL" />
                    <label class="btn btn-left" for="reflectL">Reflect</label>
                    <input class="btn-input calc-trigger" type="checkbox" id="lightScreenL" />
                    <label class="btn btn-xwide btn-right" for="lightScreenL">Light Screen</label>
                </div>
                <div class="right" title="Is this Pok&eacute;mon protected by Reflect and/or Light Screen?">
                    <input class="btn-input calc-trigger" type="checkbox" id="reflectR" />
                    <label class="btn btn-left" for="reflectR">Reflect</label>
                    <input class="btn-input calc-trigger" type="checkbox" id="lightScreenR" />
                    <label class="btn btn-xwide btn-right" for="lightScreenR">Light Screen</label>
                </div>
            </div>
            <div class="btn-group gen-specific g2 g3 g4 g5 g6">
                <div class="left" title="Has this Pok&eacute;mon been revealed with Foresight or Odor Sleuth?">
                    <input class="btn-input calc-trigger" type="checkbox" id="foresightL" />
                    <label class="btn btn-wide" for="foresightL">Foresight</label>
                </div>
                <div class="right" title="Has this Pok&eacute;mon been revealed with Foresight or Odor Sleuth?">
                    <input class="btn-input calc-trigger" type="checkbox" id="foresightR" />
                    <label class="btn btn-wide" for="foresightR">Foresight</label>
                </div>
            </div>
            <div class="btn-group gen-specific g3 g4 g5 g6">
                <div class="left" title="Has this Pok&eacute;mon's power been boosted by an ally's Helping Hand?">
                    <input class="btn-input calc-trigger" type="checkbox" id="helpingHandL" />
                    <label class="btn btn-xxwide" for="helpingHandL">Helping Hand</label>
                </div>
                <div class="right" title="Has this Pok&eacute;mon's power been boosted by an ally's Helping Hand?">
                    <input class="btn-input calc-trigger" type="checkbox" id="helpingHandR" />
                    <label class="btn btn-xxwide" for="helpingHandR">Helping Hand</label>
                </div>
            </div>
        </fieldset>
    </div>
    <div class="panel">
        <fieldset class="poke-info" id="p2">
            <legend align="center">Pok&eacute;mon 2</legend>
            <input type="text" class="set-selector calc-trigger" />
            <div class="info-group">
                <div>
                    <label>Type</label>
                    <select class="type1 terrain-trigger calc-trigger"></select>
                    <select class="type2 terrain-trigger calc-trigger"></select>
                </div>
                <div>
                    <label>Level</label>
                    <input class="level calc-trigger" value="100" />
                </div>
                <div class="hide">
                    <label>Weight (kg)</label>
                    <input class="weight calc-trigger" value="10.0" />
                </div>
            </div>
            <div class="info-group">
                <table>
                    <tr>
                        <th></th>
                        <th>Base</th>
                        <th class="gen-specific g3 g4 g5 g6">IVs</th>
                        <th class="gen-specific g3 g4 g5 g6">EVs</th>
                        <th class="gen-specific g1 g2 hide">DVs</th>
                        <th></th>
                        <th></th>
                    </tr>
                    <tr class="hp">
                        <td>
                            <label>HP</label>
                        </td>
                        <td>
                            <input class="base calc-trigger" value="100" />
                        </td>
                        <td class="gen-specific g3 g4 g5 g6">
                            <input class="ivs calc-trigger" value="31" />
                        </td>
                        <td class="gen-specific g3 g4 g5 g6">
                            <input class="evs calc-trigger" type="number" min="0" max="252" step="4" value="0" />
                        </td>
                        <td class="gen-specific g1 g2 hide">
                            <input class="dvs calc-trigger" value="15" disabled="disabled" />
                        </td>
                        <td><span class="total">341</span>
                        </td>
                        <td></td>
                    </tr>
                    <tr class="at">
                        <td>
                            <label>Attack</label>
                        </td>
                        <td>
                            <input class="base calc-trigger" value="100" />
                        </td>
                        <td class="gen-specific g3 g4 g5 g6">
                            <input class="ivs calc-trigger" value="31" />
                        </td>
                        <td class="gen-specific g3 g4 g5 g6">
                            <input class="evs calc-trigger" type="number" min="0" max="252" step="4" value="0" />
                        </td>
                        <td class="gen-specific g1 g2 hide">
                            <input class="dvs calc-trigger" value="15" />
                        </td>
                        <td><span class="total">236</span>
                        </td>
                        <td>
                            <select class="boost calc-trigger">
                                <option value="6">+6</option>
                                <option value="5">+5</option>
                                <option value="4">+4</option>
                                <option value="3">+3</option>
                                <option value="2">+2</option>
                                <option value="1">+1</option>
                                <option value="0" selected="selected">--</option>
                                <option value="-1">-1</option>
                                <option value="-2">-2</option>
                                <option value="-3">-3</option>
                                <option value="-4">-4</option>
                                <option value="-5">-5</option>
                                <option value="-6">-6</option>
                            </select>
                        </td>
                    </tr>
                    <tr class="df">
                        <td>
                            <label>Defense</label>
                        </td>
                        <td>
                            <input class="base calc-trigger" value="100" />
                        </td>
                        <td class="gen-specific g3 g4 g5 g6">
                            <input class="ivs calc-trigger" value="31" />
                        </td>
                        <td class="gen-specific g3 g4 g5 g6">
                            <input class="evs calc-trigger" type="number" min="0" max="252" step="4" value="0" />
                        </td>
                        <td class="gen-specific g1 g2 hide">
                            <input class="dvs calc-trigger" value="15" />
                        </td>
                        <td><span class="total">236</span>
                        </td>
                        <td>
                            <select class="boost calc-trigger">
                                <option value="6">+6</option>
                                <option value="5">+5</option>
                                <option value="4">+4</option>
                                <option value="3">+3</option>
                                <option value="2">+2</option>
                                <option value="1">+1</option>
                                <option value="0" selected="selected">--</option>
                                <option value="-1">-1</option>
                                <option value="-2">-2</option>
                                <option value="-3">-3</option>
                                <option value="-4">-4</option>
                                <option value="-5">-5</option>
                                <option value="-6">-6</option>
                            </select>
                        </td>
                    </tr>
                    <tr class="sa gen-specific g2 g3 g4 g5 g6">
                        <td>
                            <label>Sp. Atk</label>
                        </td>
                        <td>
                            <input class="base calc-trigger" value="100" />
                        </td>
                        <td class="gen-specific g3 g4 g5 g6">
                            <input class="ivs calc-trigger" value="31" />
                        </td>
                        <td class="gen-specific g3 g4 g5 g6">
                            <input class="evs calc-trigger" type="number" min="0" max="252" step="4" value="0" />
                        </td>
                        <td class="gen-specific g1 g2 hide">
                            <input class="dvs calc-trigger" value="15" />
                        </td>
                        <td><span class="total">236</span>
                        </td>
                        <td>
                            <select class="boost calc-trigger">
                                <option value="6">+6</option>
                                <option value="5">+5</option>
                                <option value="4">+4</option>
                                <option value="3">+3</option>
                                <option value="2">+2</option>
                                <option value="1">+1</option>
                                <option value="0" selected="selected">--</option>
                                <option value="-1">-1</option>
                                <option value="-2">-2</option>
                                <option value="-3">-3</option>
                                <option value="-4">-4</option>
                                <option value="-5">-5</option>
                                <option value="-6">-6</option>
                            </select>
                        </td>
                    </tr>
                    <tr class="sd gen-specific g2 g3 g4 g5 g6">
                        <td>
                            <label>Sp. Def</label>
                        </td>
                        <td>
                            <input class="base calc-trigger" value="100" />
                        </td>
                        <td class="gen-specific g3 g4 g5 g6">
                            <input class="ivs calc-trigger" value="31" />
                        </td>
                        <td class="gen-specific g3 g4 g5 g6">
                            <input class="evs calc-trigger" type="number" min="0" max="252" step="4" value="0" />
                        </td>
                        <td class="gen-specific g1 g2 hide">
                            <input class="dvs calc-trigger" value="15" disabled="disabled" />
                        </td>
                        <td><span class="total">236</span>
                        </td>
                        <td>
                            <select class="boost calc-trigger">
                                <option value="6">+6</option>
                                <option value="5">+5</option>
                                <option value="4">+4</option>
                                <option value="3">+3</option>
                                <option value="2">+2</option>
                                <option value="1">+1</option>
                                <option value="0" selected="selected">--</option>
                                <option value="-1">-1</option>
                                <option value="-2">-2</option>
                                <option value="-3">-3</option>
                                <option value="-4">-4</option>
                                <option value="-5">-5</option>
                                <option value="-6">-6</option>
                            </select>
                        </td>
                    </tr>
                    <tr class="sl gen-specific g1 hide">
                        <td>
                            <label>Special</label>
                        </td>
                        <td>
                            <input class="base calc-trigger" value="100" />
                        </td>
                        <td>
                            <input class="dvs calc-trigger" value="15" />
                        </td>
                        <td><span class="total">236</span>
                        </td>
                        <td>
                            <select class="boost calc-trigger">
                                <option value="6">+6</option>
                                <option value="5">+5</option>
                                <option value="4">+4</option>
                                <option value="3">+3</option>
                                <option value="2">+2</option>
                                <option value="1">+1</option>
                                <option value="0" selected="selected">--</option>
                                <option value="-1">-1</option>
                                <option value="-2">-2</option>
                                <option value="-3">-3</option>
                                <option value="-4">-4</option>
                                <option value="-5">-5</option>
                                <option value="-6">-6</option>
                            </select>
                        </td>
                    </tr>
                    <tr class="sp">
                        <td>
                            <label>Speed</label>
                        </td>
                        <td>
                            <input class="base calc-trigger" value="100" />
                        </td>
                        <td class="gen-specific g3 g4 g5 g6">
                            <input class="ivs calc-trigger" value="31" />
                        </td>
                        <td class="gen-specific g3 g4 g5 g6">
                            <input class="evs calc-trigger" type="number" min="0" max="252" step="4" value="0" />
                        </td>
                        <td class="gen-specific g1 g2 hide">
                            <input class="dvs calc-trigger" value="15" />
                        </td>
                        <td><span class="total">236</span>
                        </td>
                        <td>
                            <select class="boost calc-trigger">
                                <option value="6">+6</option>
                                <option value="5">+5</option>
                                <option value="4">+4</option>
                                <option value="3">+3</option>
                                <option value="2">+2</option>
                                <option value="1">+1</option>
                                <option value="0" selected="selected">--</option>
                                <option value="-1">-1</option>
                                <option value="-2">-2</option>
                                <option value="-3">-3</option>
                                <option value="-4">-4</option>
                                <option value="-5">-5</option>
                                <option value="-6">-6</option>
                            </select>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="info-group info-selectors">
                <div class="gen-specific g3 g4 g5 g6">
                    <label>Nature</label>
                    <select class="nature calc-trigger">
                        <option value="Adamant">Adamant</option>
                        <option value="Bashful">Bashful</option>
                        <option value="Bold">Bold</option>
                        <option value="Brave">Brave</option>
                        <option value="Calm">Calm</option>
                        <option value="Careful">Careful</option>
                        <option value="Docile">Docile</option>
                        <option value="Gentle">Gentle</option>
                        <option value="Hardy" selected="selected">Hardy</option>
                        <option value="Hasty">Hasty</option>
                        <option value="Impish">Impish</option>
                        <option value="Jolly">Jolly</option>
                        <option value="Lax">Lax</option>
                        <option value="Lonely">Lonely</option>
                        <option value="Mild">Mild</option>
                        <option value="Modest">Modest</option>
                        <option value="Naive">Naive</option>
                        <option value="Naughty">Naughty</option>
                        <option value="Quiet">Quiet</option>
                        <option value="Quirky">Quirky</option>
                        <option value="Rash">Rash</option>
                        <option value="Relaxed">Relaxed</option>
                        <option value="Sassy">Sassy</option>
                        <option value="Serious">Serious</option>
                        <option value="Timid">Timid</option>
                    </select>
                </div>
                <div class="gen-specific g3 g4 g5 g6">
                    <label>Ability</label>
                    <select class="ability terrain-trigger calc-trigger"></select>
                </div>
                <div class="gen-specific g2 g3 g4 g5 g6">
                    <label>Item</label>
                    <select class="item terrain-trigger calc-trigger"></select>
                </div>
                <div>
                    <label>Status</label>
                    <select class="status calc-trigger">
                        <option value="Healthy">Healthy</option>
                        <option value="Poisoned">Poisoned</option>
                        <option value="Badly Poisoned">Badly Poisoned</option>
                        <option value="Burned">Burned</option>
                        <option value="Paralyzed">Paralyzed</option>
                        <option value="Asleep">Asleep</option>
                        <option value="Frozen">Frozen</option>
                    </select>
                    <select class="toxic-counter calc-trigger hide">
                        <option value="1">1/16</option>
                        <option value="2">2/16</option>
                        <option value="3">3/16</option>
                        <option value="4">4/16</option>
                        <option value="5">5/16</option>
                        <option value="6">6/16</option>
                        <option value="7">7/16</option>
                        <option value="8">8/16</option>
                        <option value="9">9/16</option>
                        <option value="10">10/16</option>
                        <option value="11">11/16</option>
                        <option value="12">12/16</option>
                        <option value="13">13/16</option>
                        <option value="14">14/16</option>
                        <option value="15">15/16</option>
                    </select>
                </div>
            </div>
            <div class="info-group">
                <label>Current HP</label>
                <input class="current-hp calc-trigger" value="341" />/<span class="max-hp">341</span> (
                <input class="percent-hp calc-trigger" value="100" />%)
            </div>
            <div class="move1">
                <select class="move-selector calc-trigger small-select"></select>
                <input class="move-bp calc-trigger" value="50" />
                <select class="move-type calc-trigger"></select>
                <select class="move-cat calc-trigger gen-specific g4 g5 g6">
                    <option value="Physical">Physical</option>
                    <option value="Special">Special</option>
                </select>
                <input class="move-crit calc-trigger btn-input" type="checkbox" id="critR1" />
                <label class="btn crit-btn" for="critR1" title="Force this attack to be a critical hit?">Crit</label>
                <select class="move-hits calc-trigger hide">
                    <option value="2">2 hits</option>
                    <option value="3">3 hits</option>
                    <option value="4">4 hits</option>
                    <option value="5">5 hits</option>
                </select>
            </div>
            <div class="move2">
                <select class="move-selector calc-trigger small-select"></select>
                <input class="move-bp calc-trigger" value="0" />
                <select class="move-type calc-trigger"></select>
                <select class="move-cat calc-trigger gen-specific g4 g5 g6">
                    <option value="Physical">Physical</option>
                    <option value="Special">Special</option>
                </select>
                <input class="move-crit calc-trigger btn-input" type="checkbox" id="critR2" />
                <label class="btn crit-btn" for="critR2" title="Force this attack to be a critical hit?">Crit</label>
                <select class="move-hits calc-trigger hide">
                    <option value="2">2 hits</option>
                    <option value="3">3 hits</option>
                    <option value="4">4 hits</option>
                    <option value="5">5 hits</option>
                </select>
            </div>
            <div class="move3">
                <select class="move-selector calc-trigger small-select"></select>
                <input class="move-bp calc-trigger" value="0" />
                <select class="move-type calc-trigger"></select>
                <select class="move-cat calc-trigger gen-specific g4 g5 g6">
                    <option value="Physical">Physical</option>
                    <option value="Special">Special</option>
                </select>
                <input class="move-crit calc-trigger btn-input" type="checkbox" id="critR3" />
                <label class="btn crit-btn" for="critR3" title="Force this attack to be a critical hit?">Crit</label>
                <select class="move-hits calc-trigger hide">
                    <option value="2">2 hits</option>
                    <option value="3">3 hits</option>
                    <option value="4">4 hits</option>
                    <option value="5">5 hits</option>
                </select>
            </div>
            <div class="move4">
                <select class="move-selector calc-trigger small-select"></select>
                <input class="move-bp calc-trigger" value="0" />
                <select class="move-type calc-trigger"></select>
                <select class="move-cat calc-trigger gen-specific g4 g5 g6">
                    <option value="Physical">Physical</option>
                    <option value="Special">Special</option>
                </select>
                <input class="move-crit calc-trigger btn-input" type="checkbox" id="critR4" />
                <label class="btn crit-btn" for="critR4" title="Force this attack to be a critical hit?">Crit</label>
                <select class="move-hits calc-trigger hide">
                    <option value="2">2 hits</option>
                    <option value="3">3 hits</option>
                    <option value="4">4 hits</option>
                    <option value="5">5 hits</option>
                </select>
            </div>
        </fieldset>
    </div>
    <div class="panel">
        <fieldset class="poke-import">
		<legend align="center">Import Team</legend>
			<div id="import-1_wrapper" class="dataTables_wrapper no-footer" style="max-width: 638.609375px;">
				
				<form class="import-team">
					<textarea class="import-team-text"></textarea>
					<!--<button style='position:absolute' class='bs-btn bs-btn-default'>Import</button>-->
			</div>
			</form>
        </fieldset>
    </div>
    <script type="text/javascript" src="https://pokemonshowdown.com/js/jquery-1.9.1.min.js"></script>
    <script type="text/javascript" src="https://pokemonshowdown.com/js/lodash.min.js"></script>
    <script type="text/javascript" src="./select2/select2.min.js"></script>
    <script type="text/javascript" src="./js/data/pokedex.js"></script>
    <script type="text/javascript" src="./js/data/setdex_xy.js"></script>
    <script type="text/javascript" src="./js/data/setdex_bw.js"></script>
    <script type="text/javascript" src="./js/data/setdex_dpp.js"></script>
    <script type="text/javascript" src="./js/data/setdex_rse.js"></script>
    <script type="text/javascript" src="./js/data/setdex_gsc.js"></script>
    <script type="text/javascript" src="./js/data/setdex_rby.js"></script>
    <script type="text/javascript" src="./js/data/stat_data.js"></script>
    <script type="text/javascript" src="./js/data/type_data.js"></script>
    <script type="text/javascript" src="./js/data/nature_data.js"></script>
    <script type="text/javascript" src="./js/data/ability_data.js"></script>
    <script type="text/javascript" src="./js/data/item_data.js"></script>
    <script type="text/javascript" src="./js/data/move_data.js"></script>
    <script type="text/javascript" src="./js/ap_calc.js"></script>
    <script type="text/javascript" src="./js/calc_ab.js"></script>
    <script type="text/javascript" src="./js/damage.js"></script>
    <script type="text/javascript" src="./js/damage_dpp.js"></script>
    <script type="text/javascript" src="./js/damage_rse.js"></script>
    <script type="text/javascript" src="./js/damage_gsc.js"></script>
    <script type="text/javascript" src="./js/damage_rby.js"></script>
    <script type="text/javascript" src="./js/ko_chance.js"></script>
    <script type="text/javascript" src="./js/moveset_import.js"></script>
</div>

</body>

</html>
