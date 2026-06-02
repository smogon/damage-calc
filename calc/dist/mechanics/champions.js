"use strict";
exports.__esModule = true;
exports.calculateFinalModsChampions = exports.calculateDfModsChampions = exports.calculateDefenseChampions = exports.calculateAtModsChampions = exports.calculateAttackChampions = exports.calculateBPModsChampions = exports.calculateBasePowerChampions = exports.calculateChampions = void 0;
var util_1 = require("../util");
var items_1 = require("../items");
var result_1 = require("../result");
var util_2 = require("./util");
function calculateChampions(gen, attacker, defender, move, field) {
    (0, util_2.checkForecast)(attacker, field.weather);
    (0, util_2.checkForecast)(defender, field.weather);
    (0, util_2.checkItem)(attacker, field.isMagicRoom);
    (0, util_2.checkItem)(defender, field.isMagicRoom);
    (0, util_2.checkRawStatChanges)(attacker, field.attackerSide.isPowerTrick, field.isWonderRoom);
    (0, util_2.checkRawStatChanges)(defender, field.defenderSide.isPowerTrick, field.isWonderRoom);
    (0, util_2.computeFinalStats)(gen, attacker, defender, field, 'def', 'spd', 'spe');
    (0, util_2.checkIntimidate)(gen, attacker, defender);
    (0, util_2.checkIntimidate)(gen, defender, attacker);
    if (move.named('Meteor Beam', 'Electro Shot')) {
        attacker.boosts.spa += attacker.hasAbility('Contrary') ? -1 : 1;
        attacker.boosts.spa = Math.min(6, Math.max(-6, attacker.boosts.spa));
    }
    (0, util_2.computeFinalStats)(gen, attacker, defender, field, 'atk', 'spa');
    (0, util_2.checkInfiltrator)(attacker, field.defenderSide);
    (0, util_2.checkInfiltrator)(defender, field.attackerSide);
    var desc = {
        attackerName: attacker.name,
        moveName: move.name,
        defenderName: defender.name,
        isWonderRoom: field.isWonderRoom
    };
    var result = new result_1.Result(gen, attacker, defender, move, field, 0, desc);
    if (move.category === 'Status') {
        return result;
    }
    if (move.named('Shell Side Arm') &&
        (0, util_2.getShellSideArmCategory)(attacker, defender, field.isWonderRoom) === 'Physical') {
        move.category = 'Physical';
        move.flags.contact = 1;
    }
    var breaksProtect = move.breaksProtect ||
        (attacker.hasAbility('Unseen Fist', 'Piercing Drill') && move.flags.contact);
    if (field.defenderSide.isProtected && !breaksProtect) {
        desc.isProtected = true;
        return result;
    }
    if (move.name === 'Pain Split') {
        var average = Math.floor((attacker.curHP() + defender.curHP()) / 2);
        var damage_1 = Math.max(0, defender.curHP() - average);
        result.damage = damage_1;
        return result;
    }
    var defenderAbilityIgnored = defender.hasAbility('Armor Tail', 'Aroma Veil', 'Battle Armor', 'Big Pecks', 'Bulletproof', 'Clear Body', 'Contrary', 'Damp', 'Disguise', 'Dry Skin', 'Earth Eater', 'Filter', 'Flash Fire', 'Flower Veil', 'Friend Guard', 'Fur Coat', 'Heatproof', 'Heavy Metal', 'Hyper Cutter', 'Illuminate', 'Immunity', 'Inner Focus', 'Insomnia', 'Keen Eye', 'Leaf Guard', 'Levitate', 'Light Metal', 'Lightning Rod', 'Limber', 'Magic Bounce', 'Magma Armor', 'Marvel Scale', 'Mirror Armor', 'Motor Drive', 'Multiscale', 'Oblivious', 'Overcoat', 'Own Tempo', 'Purifying Salt', 'Queenly Majesty', 'Sand Veil', 'Sap Sipper', 'Shell Armor', 'Shield Dust', 'Snow Cloak', 'Solid Rock', 'Soundproof', 'Sticky Hold', 'Storm Drain', 'Sturdy', 'Sweet Veil', 'Tangled Feet', 'Telepathy', 'Thick Fat', 'Unaware', 'Vital Spirit', 'Volt Absorb', 'Water Absorb', 'Water Bubble', 'Water Veil', 'White Smoke');
    var attackerIgnoresAbility = attacker.hasAbility('Mold Breaker');
    if (defenderAbilityIgnored && attackerIgnoresAbility) {
        if (attackerIgnoresAbility)
            desc.attackerAbility = attacker.ability;
        defender.ability = '';
    }
    var isCritical = !defender.hasAbility('Shell Armor') &&
        (move.isCrit || (attacker.hasAbility('Merciless') && defender.hasStatus('psn', 'tox'))) &&
        move.timesUsed === 1;
    var type = move.type;
    if (move.originalName === 'Weather Ball') {
        var isMegaSol = attacker.hasAbility('Mega Sol');
        type =
            field.hasWeather('Sun', 'Harsh Sunshine') || isMegaSol ? 'Fire'
                : field.hasWeather('Rain', 'Heavy Rain') ? 'Water'
                    : field.hasWeather('Sand') ? 'Rock'
                        : field.hasWeather('Hail', 'Snow') ? 'Ice'
                            : 'Normal';
        isMegaSol ? desc.attackerAbility = attacker.ability : desc.weather = field.weather;
        desc.moveType = type;
    }
    else if (move.originalName === 'Terrain Pulse' && (0, util_2.isGrounded)(attacker, field)) {
        type =
            field.hasTerrain('Electric') ? 'Electric'
                : field.hasTerrain('Grassy') ? 'Grass'
                    : field.hasTerrain('Misty') ? 'Fairy'
                        : field.hasTerrain('Psychic') ? 'Psychic'
                            : 'Normal';
        desc.terrain = field.terrain;
        if (!(move.named('Nature Power') && attacker.hasAbility('Prankster')) &&
            ((defender.types.includes('Dark') ||
                (field.hasTerrain('Psychic') && (0, util_2.isGrounded)(defender, field))))) {
            desc.moveType = type;
        }
    }
    else if (move.named('Aura Wheel')) {
        if (attacker.named('Morpeko')) {
            type = 'Electric';
        }
        else if (attacker.named('Morpeko-Hangry')) {
            type = 'Dark';
        }
    }
    else if (move.named('Raging Bull')) {
        if (attacker.named('Tauros-Paldea-Combat')) {
            type = 'Fighting';
        }
        else if (attacker.named('Tauros-Paldea-Blaze')) {
            type = 'Fire';
        }
        else if (attacker.named('Tauros-Paldea-Aqua')) {
            type = 'Water';
        }
        field.defenderSide.isReflect = false;
        field.defenderSide.isLightScreen = false;
        field.defenderSide.isAuroraVeil = false;
    }
    else if (move.named('Brick Break', 'Psychic Fangs')) {
        field.defenderSide.isReflect = false;
        field.defenderSide.isLightScreen = false;
        field.defenderSide.isAuroraVeil = false;
    }
    var hasAteAbilityTypeChange = false;
    var isAerilate = false;
    var isDragonize = false;
    var isPixilate = false;
    var isRefrigerate = false;
    var isLiquidVoice = false;
    var noTypeChange = move.named('Weather Ball', 'Terrain Pulse', 'Struggle');
    if (!noTypeChange) {
        var normal = type === 'Normal';
        if ((isAerilate = attacker.hasAbility('Aerilate') && normal)) {
            type = 'Flying';
        }
        else if ((isDragonize = attacker.hasAbility('Dragonize') && normal)) {
            type = 'Dragon';
        }
        else if ((isLiquidVoice = attacker.hasAbility('Liquid Voice') && !!move.flags.sound)) {
            type = 'Water';
        }
        else if ((isPixilate = attacker.hasAbility('Pixilate') && normal)) {
            type = 'Fairy';
        }
        else if ((isRefrigerate = attacker.hasAbility('Refrigerate') && normal)) {
            type = 'Ice';
        }
        if (isAerilate || isDragonize || isPixilate || isRefrigerate) {
            desc.attackerAbility = attacker.ability;
            hasAteAbilityTypeChange = true;
        }
        else if (isLiquidVoice) {
            desc.attackerAbility = attacker.ability;
        }
    }
    move.type = type;
    var isGhostRevealed = attacker.hasAbility('Scrappy');
    var type1Effectiveness = (0, util_2.getMoveEffectiveness)(gen, move, defender.types[0], isGhostRevealed, field.isGravity, false);
    var type2Effectiveness = defender.types[1]
        ? (0, util_2.getMoveEffectiveness)(gen, move, defender.types[1], isGhostRevealed, field.isGravity, false)
        : 1;
    var typeEffectiveness = type1Effectiveness * type2Effectiveness;
    if (typeEffectiveness === 0) {
        return result;
    }
    if ((move.named('Steel Roller') && !field.terrain) ||
        (move.named('Poltergeist') && !defender.item)) {
        return result;
    }
    if ((move.hasType('Grass') && defender.hasAbility('Sap Sipper')) ||
        (move.hasType('Fire') && defender.hasAbility('Flash Fire')) ||
        (move.hasType('Water') && defender.hasAbility('Dry Skin', 'Water Absorb')) ||
        (move.hasType('Electric') &&
            defender.hasAbility('Lightning Rod', 'Motor Drive', 'Volt Absorb')) ||
        (move.hasType('Ground') &&
            !field.isGravity && defender.hasAbility('Levitate')) ||
        (move.flags.bullet && defender.hasAbility('Bulletproof')) ||
        (move.flags.sound && !move.named('Clangorous Soul') && defender.hasAbility('Soundproof')) ||
        (move.priority > 0 && defender.hasAbility('Queenly Majesty', 'Armor Tail')) ||
        (move.hasType('Ground') && defender.hasAbility('Earth Eater'))) {
        desc.defenderAbility = defender.ability;
        return result;
    }
    if (move.priority > 0 && field.hasTerrain('Psychic') && (0, util_2.isGrounded)(defender, field)) {
        desc.terrain = field.terrain;
        return result;
    }
    desc.HPEVs = (0, util_2.getStatDescriptionText)(gen, defender, 'hp');
    var fixedDamage = (0, util_2.handleFixedDamageMoves)(attacker, move);
    if (fixedDamage) {
        if (attacker.hasAbility('Parental Bond')) {
            result.damage = [fixedDamage, fixedDamage];
            desc.attackerAbility = attacker.ability;
        }
        else {
            result.damage = fixedDamage;
        }
        return result;
    }
    if (move.named('Final Gambit')) {
        result.damage = attacker.curHP();
        return result;
    }
    if (move.hits > 1) {
        desc.hits = move.hits;
    }
    var turnOrder = attacker.stats.spe > defender.stats.spe ? 'first' : 'last';
    var basePower = calculateBasePowerChampions(gen, attacker, defender, move, field, hasAteAbilityTypeChange, desc);
    if (basePower === 0) {
        return result;
    }
    var attack = calculateAttackChampions(gen, attacker, defender, move, field, desc, isCritical);
    var defense = calculateDefenseChampions(gen, attacker, defender, move, field, desc, isCritical);
    var hitsPhysical = move.overrideDefensiveStat === 'def' || move.category === 'Physical';
    var defenseStat = hitsPhysical ? 'def' : 'spd';
    var baseDamage = calculateBaseDamageChampions(gen, attacker, defender, basePower, attack, defense, move, field, desc, isCritical);
    if ((attacker.hasAbility('Gale Wings') &&
        move.hasType('Flying') &&
        attacker.curHP() === attacker.maxHP())) {
        move.priority = 1;
        desc.attackerAbility = attacker.ability;
    }
    var stabMod = (0, util_2.getStabMod)(attacker, move, desc);
    var applyBurn = attacker.hasStatus('brn') &&
        move.category === 'Physical' &&
        !attacker.hasAbility('Guts') &&
        !move.named('Facade');
    desc.isBurned = applyBurn;
    var finalMods = calculateFinalModsChampions(gen, attacker, defender, move, field, desc, isCritical, typeEffectiveness);
    var protect = false;
    if (field.defenderSide.isProtected &&
        (attacker.hasAbility('Unseen Fist', 'Piercing Drill') && move.flags.contact)) {
        protect = true;
        desc.isProtected = true;
    }
    var finalMod = (0, util_2.chainMods)(finalMods, 41, 131072);
    var isSpread = field.gameType !== 'Singles' &&
        ['allAdjacent', 'allAdjacentFoes'].includes(move.target);
    var childDamage;
    if (attacker.hasAbility('Parental Bond') && move.hits === 1 && !isSpread) {
        var child = attacker.clone();
        child.ability = 'Parental Bond (Child)';
        (0, util_2.checkMultihitBoost)(gen, child, defender, move, field, desc);
        childDamage = calculateChampions(gen, child, defender, move, field).damage;
        desc.attackerAbility = attacker.ability;
    }
    var damage = [];
    for (var i = 0; i < 16; i++) {
        damage[i] =
            (0, util_2.getFinalDamage)(baseDamage, i, typeEffectiveness, applyBurn, stabMod, finalMod, protect);
    }
    result.damage = childDamage ? [damage, childDamage] : damage;
    if (move.timesUsed > 1 || move.hits > 1) {
        var origDefBoost = desc.defenseBoost;
        var origAtkBoost = desc.attackBoost;
        var numAttacks = 1;
        if (move.timesUsed > 1) {
            desc.moveTurns = "over ".concat(move.timesUsed, " turns");
            numAttacks = move.timesUsed;
        }
        else {
            numAttacks = move.hits;
        }
        var usedItems = [false, false];
        var damageMatrix = [damage];
        for (var times = 1; times < numAttacks; times++) {
            usedItems = (0, util_2.checkMultihitBoost)(gen, attacker, defender, move, field, desc, usedItems[0], usedItems[1]);
            var newAttack = calculateAttackChampions(gen, attacker, defender, move, field, desc, isCritical);
            var newDefense = calculateDefenseChampions(gen, attacker, defender, move, field, desc, isCritical);
            hasAteAbilityTypeChange = hasAteAbilityTypeChange &&
                attacker.hasAbility('Aerilate', 'Dragonize', 'Pixilate', 'Refrigerate');
            if (move.timesUsed > 1) {
                stabMod = (0, util_2.getStabMod)(attacker, move, desc);
            }
            var newBasePower = calculateBasePowerChampions(gen, attacker, defender, move, field, hasAteAbilityTypeChange, desc, times + 1);
            var newBaseDamage = calculateBaseDamageChampions(gen, attacker, defender, newBasePower, newAttack, newDefense, move, field, desc, isCritical);
            var newFinalMods = calculateFinalModsChampions(gen, attacker, defender, move, field, desc, isCritical, typeEffectiveness, times);
            var newFinalMod = (0, util_2.chainMods)(newFinalMods, 41, 131072);
            var damageArray = [];
            for (var i = 0; i < 16; i++) {
                var newFinalDamage = (0, util_2.getFinalDamage)(newBaseDamage, i, typeEffectiveness, applyBurn, stabMod, newFinalMod, protect);
                damageArray[i] = newFinalDamage;
            }
            damageMatrix[times] = damageArray;
        }
        result.damage = damageMatrix;
        desc.defenseBoost = origDefBoost;
        desc.attackBoost = origAtkBoost;
    }
    return result;
}
exports.calculateChampions = calculateChampions;
function calculateBasePowerChampions(gen, attacker, defender, move, field, hasAteAbilityTypeChange, desc, hit) {
    if (hit === void 0) { hit = 1; }
    var turnOrder = attacker.stats.spe > defender.stats.spe ? 'first' : 'last';
    var basePower;
    switch (move.name) {
        case 'Payback':
            basePower = move.bp * (turnOrder === 'last' ? 2 : 1);
            desc.moveBP = basePower;
            break;
        case 'Electro Ball':
            var r = Math.floor(attacker.stats.spe / defender.stats.spe);
            basePower = r >= 4 ? 150 : r >= 3 ? 120 : r >= 2 ? 80 : r >= 1 ? 60 : 40;
            if (defender.stats.spe === 0)
                basePower = 40;
            desc.moveBP = basePower;
            break;
        case 'Gyro Ball':
            basePower = Math.min(150, Math.floor((25 * defender.stats.spe) / attacker.stats.spe) + 1);
            if (attacker.stats.spe === 0)
                basePower = 1;
            desc.moveBP = basePower;
            break;
        case 'Punishment':
            basePower = Math.min(200, 60 + 20 * (0, util_2.countBoosts)(gen, defender.boosts));
            desc.moveBP = basePower;
            break;
        case 'Low Kick':
        case 'Grass Knot':
            var w = (0, util_2.getWeight)(defender, desc, 'defender');
            basePower = w >= 200 ? 120 : w >= 100 ? 100 : w >= 50 ? 80 : w >= 25 ? 60 : w >= 10 ? 40 : 20;
            desc.moveBP = basePower;
            break;
        case 'Hex':
        case 'Infernal Parade':
            basePower = move.bp * (defender.status ? 2 : 1);
            desc.moveBP = basePower;
            break;
        case 'Heavy Slam':
        case 'Heat Crash':
            var wr = (0, util_2.getWeight)(attacker, desc, 'attacker') /
                (0, util_2.getWeight)(defender, desc, 'defender');
            basePower = wr >= 5 ? 120 : wr >= 4 ? 100 : wr >= 3 ? 80 : wr >= 2 ? 60 : 40;
            desc.moveBP = basePower;
            break;
        case 'Stored Power':
        case 'Power Trip':
            basePower = 20 + 20 * (0, util_2.countBoosts)(gen, attacker.boosts);
            desc.moveBP = basePower;
            break;
        case 'Acrobatics':
            basePower = move.bp * (!attacker.item ? 2 : 1);
            desc.moveBP = basePower;
            break;
        case 'Assurance':
            basePower = move.bp * (defender.hasAbility('Parental Bond (Child)') ? 2 : 1);
            break;
        case 'Smelling Salts':
            basePower = move.bp * (defender.hasStatus('par') ? 2 : 1);
            desc.moveBP = basePower;
            break;
        case 'Weather Ball':
            basePower = move.bp * (field.weather || attacker.hasAbility('Mega Sol') ? 2 : 1);
            desc.moveBP = basePower;
            break;
        case 'Terrain Pulse':
            basePower = move.bp * ((0, util_2.isGrounded)(attacker, field) && field.terrain ? 2 : 1);
            desc.moveBP = basePower;
            break;
        case 'Rising Voltage':
            basePower = move.bp * (((0, util_2.isGrounded)(defender, field) && field.hasTerrain('Electric')) ? 2 : 1);
            desc.moveBP = basePower;
            break;
        case 'Fling':
            basePower = (0, items_1.getFlingPower)(attacker.item, gen.num);
            desc.moveBP = basePower;
            desc.attackerItem = attacker.item;
            break;
        case 'Eruption':
        case 'Water Spout':
            basePower = Math.max(1, Math.floor((150 * attacker.curHP()) / attacker.maxHP()));
            desc.moveBP = basePower;
            break;
        case 'Flail':
        case 'Reversal':
            var p = Math.floor((48 * attacker.curHP()) / attacker.maxHP());
            basePower = p <= 1 ? 200 : p <= 4 ? 150 : p <= 9 ? 100 : p <= 16 ? 80 : p <= 32 ? 40 : 20;
            desc.moveBP = basePower;
            break;
        case 'Triple Axel':
            basePower = hit * 20;
            desc.moveBP = move.hits === 2 ? 60 : move.hits === 3 ? 120 : 20;
            break;
        case 'Hard Press':
            basePower = 100 * Math.floor((defender.curHP() * 4096) / defender.maxHP());
            basePower = Math.floor(Math.floor((100 * basePower + 2048 - 1) / 4096) / 100) || 1;
            desc.moveBP = basePower;
            break;
        default:
            basePower = move.bp;
    }
    if (basePower === 0) {
        return 0;
    }
    var bpMods = calculateBPModsChampions(gen, attacker, defender, move, field, desc, basePower, hasAteAbilityTypeChange, turnOrder, hit);
    basePower = (0, util_2.OF16)(Math.max(1, (0, util_2.pokeRound)((basePower * (0, util_2.chainMods)(bpMods, 41, 2097152)) / 4096)));
    return basePower;
}
exports.calculateBasePowerChampions = calculateBasePowerChampions;
function calculateBPModsChampions(gen, attacker, defender, move, field, desc, basePower, hasAteAbilityTypeChange, turnOrder, hit) {
    var bpMods = [];
    var defenderItem = (defender.item && defender.item !== '')
        ? defender.item : defender.disabledItem;
    var resistedKnockOffDamage = !defenderItem;
    if (!resistedKnockOffDamage && defenderItem) {
        var item = gen.items.get((0, util_1.toID)(defenderItem));
        resistedKnockOffDamage = !!(item.megaStone &&
            (item.megaStone[defender.name] || Object.values(item.megaStone).includes(defender.name)));
    }
    if (!resistedKnockOffDamage && hit > 1 && !defender.hasAbility('Sticky Hold')) {
        resistedKnockOffDamage = true;
    }
    if ((move.named('Facade') && attacker.hasStatus('brn', 'par', 'psn', 'tox')) ||
        (move.named('Venoshock') && defender.hasStatus('psn', 'tox')) ||
        (move.named('Lash Out') && ((0, util_2.countBoosts)(gen, attacker.boosts) < 0))) {
        bpMods.push(8192);
        desc.moveBP = basePower * 2;
    }
    else if (move.named('Expanding Force') && (0, util_2.isGrounded)(attacker, field) && field.hasTerrain('Psychic')) {
        move.target = 'allAdjacentFoes';
        bpMods.push(6144);
        desc.moveBP = basePower * 1.5;
    }
    else if ((move.named('Knock Off') && !resistedKnockOffDamage) ||
        (move.named('Misty Explosion') && (0, util_2.isGrounded)(attacker, field) && field.hasTerrain('Misty')) ||
        (move.named('Grav Apple') && field.isGravity)) {
        bpMods.push(6144);
        desc.moveBP = basePower * 1.5;
    }
    else if (move.named('Solar Beam', 'Solar Blade') &&
        field.hasWeather('Rain', 'Sand', 'Hail', 'Snow') && !attacker.hasAbility('Mega Sol')) {
        bpMods.push(2048);
        desc.moveBP = basePower / 2;
        desc.weather = field.weather;
    }
    if (field.attackerSide.isHelpingHand) {
        bpMods.push(6144);
        desc.isHelpingHand = true;
    }
    var terrainMultiplier = 5325;
    if ((0, util_2.isGrounded)(attacker, field)) {
        if ((field.hasTerrain('Electric') && move.hasType('Electric')) ||
            (field.hasTerrain('Grassy') && move.hasType('Grass')) ||
            (field.hasTerrain('Psychic') && move.hasType('Psychic'))) {
            bpMods.push(terrainMultiplier);
            desc.terrain = field.terrain;
        }
    }
    if ((0, util_2.isGrounded)(defender, field)) {
        if ((field.hasTerrain('Misty') && move.hasType('Dragon')) ||
            (field.hasTerrain('Grassy') && move.named('Bulldoze', 'Earthquake'))) {
            bpMods.push(2048);
            desc.terrain = field.terrain;
        }
    }
    if ((attacker.hasAbility('Technician') && basePower <= 60) ||
        (attacker.hasAbility('Mega Launcher') && move.flags.pulse) ||
        (attacker.hasAbility('Strong Jaw') && move.flags.bite) ||
        (attacker.hasAbility('Sharpness') && move.flags.slicing)) {
        bpMods.push(6144);
        desc.attackerAbility = attacker.ability;
    }
    var aura = "".concat(move.type, " Aura");
    var isAttackerAura = attacker.hasAbility(aura);
    var isDefenderAura = defender.hasAbility(aura);
    var isFieldFairyAura = field.isFairyAura && move.type === 'Fairy';
    var isFieldDarkAura = field.isDarkAura && move.type === 'Dark';
    var auraActive = isAttackerAura || isDefenderAura || isFieldFairyAura || isFieldDarkAura;
    if (auraActive) {
        bpMods.push(5448);
        if (isAttackerAura)
            desc.attackerAbility = attacker.ability;
        if (isDefenderAura)
            desc.defenderAbility = defender.ability;
    }
    if ((attacker.hasAbility('Sheer Force') &&
        (move.secondaries || move.named('Electro Shot')) ||
        (attacker.hasAbility('Sand Force') &&
            field.hasWeather('Sand') && move.hasType('Rock', 'Ground', 'Steel')) ||
        (attacker.hasAbility('Analytic') &&
            (turnOrder !== 'first' || field.defenderSide.isSwitching === 'out')) ||
        (attacker.hasAbility('Tough Claws') && move.flags.contact))) {
        bpMods.push(5325);
        desc.attackerAbility = attacker.ability;
    }
    if (attacker.hasAbility('Rivalry') && ![attacker.gender, defender.gender].includes('N')) {
        if (attacker.gender === defender.gender) {
            bpMods.push(5120);
            desc.rivalry = 'buffed';
        }
        else {
            bpMods.push(3072);
            desc.rivalry = 'nerfed';
        }
        desc.attackerAbility = attacker.ability;
    }
    if (hasAteAbilityTypeChange) {
        bpMods.push(4915);
    }
    if ((attacker.hasAbility('Reckless') && (move.recoil || move.hasCrashDamage)) ||
        (attacker.hasAbility('Iron Fist') && move.flags.punch)) {
        bpMods.push(4915);
        desc.attackerAbility = attacker.ability;
    }
    if (defender.hasAbility('Dry Skin') && move.hasType('Fire')) {
        bpMods.push(5120);
        desc.defenderAbility = defender.ability;
    }
    if (attacker.hasAbility('Supreme Overlord') && attacker.alliesFainted) {
        var powMod = [4096, 4506, 4915, 5325, 5734, 6144];
        bpMods.push(powMod[Math.min(5, attacker.alliesFainted)]);
        desc.attackerAbility = attacker.ability;
        desc.alliesFainted = attacker.alliesFainted;
    }
    if (attacker.item && move.hasType((0, items_1.getItemBoostType)(attacker.item))) {
        bpMods.push(4915);
        desc.attackerItem = attacker.item;
    }
    return bpMods;
}
exports.calculateBPModsChampions = calculateBPModsChampions;
function calculateAttackChampions(gen, attacker, defender, move, field, desc, isCritical) {
    if (isCritical === void 0) { isCritical = false; }
    var attack;
    var attackSource = move.named('Foul Play') ? defender : attacker;
    var attackStat = move.named('Body Press')
        ? (field.isWonderRoom ? 'spd' : 'def')
        : (move.category === 'Special' ? 'spa' : 'atk');
    desc.attackEVs =
        move.named('Foul Play')
            ? (0, util_2.getStatDescriptionText)(gen, attackSource, attackStat, field.defenderSide.isPowerTrick)
            : (0, util_2.getStatDescriptionText)(gen, attackSource, attackStat, field.attackerSide.isPowerTrick, field.isWonderRoom);
    if (field.attackerSide.isPowerTrick) {
        if ((move.category === 'Physical' && !move.named('Foul Play')) || move.named('Body Press')) {
            desc.isPowerTrickAttacker = true;
        }
    }
    var boosts = attackSource.boosts[attackStat];
    if (boosts === 0 || (isCritical && boosts < 0)) {
        attack = attackSource.rawStats[attackStat];
    }
    else if (defender.hasAbility('Unaware')) {
        attack = attackSource.rawStats[attackStat];
        desc.defenderAbility = defender.ability;
    }
    else {
        attack = (0, util_2.getModifiedStat)(attackSource.rawStats[attackStat], boosts);
        desc.attackBoost = boosts;
    }
    if (attacker.hasAbility('Hustle') && move.category === 'Physical') {
        attack = (0, util_2.pokeRound)((attack * 3) / 2);
        desc.attackerAbility = attacker.ability;
    }
    var atMods = calculateAtModsChampions(gen, attacker, defender, move, field, desc);
    attack = (0, util_2.OF16)(Math.max(1, (0, util_2.pokeRound)((attack * (0, util_2.chainMods)(atMods, 410, 131072)) / 4096)));
    return attack;
}
exports.calculateAttackChampions = calculateAttackChampions;
function calculateAtModsChampions(gen, attacker, defender, move, field, desc) {
    var atMods = [];
    if ((attacker.hasAbility('Solar Power') &&
        field.hasWeather('Sun') &&
        move.category === 'Special')) {
        atMods.push(6144);
        desc.attackerAbility = attacker.ability;
        desc.weather = field.weather;
    }
    else if ((attacker.hasAbility('Guts') && attacker.status && move.category === 'Physical') ||
        (attacker.curHP() <= attacker.maxHP() / 3 &&
            ((attacker.hasAbility('Overgrow') && move.hasType('Grass')) ||
                (attacker.hasAbility('Blaze') && move.hasType('Fire')) ||
                (attacker.hasAbility('Torrent') && move.hasType('Water')) ||
                (attacker.hasAbility('Swarm') && move.hasType('Bug')))) ||
        (move.category === 'Special' && attacker.abilityOn && attacker.hasAbility('Plus', 'Minus'))) {
        atMods.push(6144);
        desc.attackerAbility = attacker.ability;
    }
    else if (attacker.hasAbility('Flash Fire') && attacker.abilityOn && move.hasType('Fire')) {
        atMods.push(6144);
        desc.attackerAbility = 'Flash Fire';
    }
    else if ((attacker.hasAbility('Water Bubble') && move.hasType('Water')) ||
        (attacker.hasAbility('Huge Power', 'Pure Power') && move.category === 'Physical')) {
        atMods.push(8192);
        desc.attackerAbility = attacker.ability;
    }
    if ((defender.hasAbility('Thick Fat') && move.hasType('Fire', 'Ice')) ||
        (defender.hasAbility('Water Bubble') && move.hasType('Fire')) ||
        (defender.hasAbility('Purifying Salt') && move.hasType('Ghost'))) {
        atMods.push(2048);
        desc.defenderAbility = defender.ability;
    }
    if (defender.hasAbility('Heatproof') && move.hasType('Fire')) {
        atMods.push(2048);
        desc.defenderAbility = defender.ability;
    }
    return atMods;
}
exports.calculateAtModsChampions = calculateAtModsChampions;
function calculateDefenseChampions(gen, attacker, defender, move, field, desc, isCritical) {
    if (isCritical === void 0) { isCritical = false; }
    var defense;
    var hitsPhysical = move.overrideDefensiveStat === 'def' || move.category === 'Physical';
    var defenseStat = hitsPhysical ? 'def' : 'spd';
    desc.defenseEVs = (0, util_2.getStatDescriptionText)(gen, defender, defenseStat, field.defenderSide.isPowerTrick, field.isWonderRoom);
    if (field.defenderSide.isPowerTrick && (field.isWonderRoom !== hitsPhysical)) {
        desc.isPowerTrickDefender = true;
    }
    var boosts = defender.boosts[defenseStat];
    if (boosts === 0 ||
        (isCritical && boosts > 0) ||
        move.ignoreDefensive) {
        defense = defender.rawStats[defenseStat];
    }
    else if (attacker.hasAbility('Unaware')) {
        defense = defender.rawStats[defenseStat];
        desc.attackerAbility = attacker.ability;
    }
    else {
        defense = (0, util_2.getModifiedStat)(defender.rawStats[defenseStat], boosts);
        desc.defenseBoost = boosts;
    }
    if (!attacker.hasAbility('Mega Sol')) {
        if (field.hasWeather('Sand') && defender.hasType('Rock') && !hitsPhysical) {
            defense = (0, util_2.pokeRound)((defense * 3) / 2);
            desc.weather = field.weather;
        }
        if (field.hasWeather('Snow') && defender.hasType('Ice') && hitsPhysical) {
            defense = (0, util_2.pokeRound)((defense * 3) / 2);
            desc.weather = field.weather;
        }
    }
    var dfMods = calculateDfModsChampions(gen, attacker, defender, move, field, desc, isCritical, hitsPhysical);
    return (0, util_2.OF16)(Math.max(1, (0, util_2.pokeRound)((defense * (0, util_2.chainMods)(dfMods, 410, 131072)) / 4096)));
}
exports.calculateDefenseChampions = calculateDefenseChampions;
function calculateDfModsChampions(gen, attacker, defender, move, field, desc, isCritical, hitsPhysical) {
    if (isCritical === void 0) { isCritical = false; }
    if (hitsPhysical === void 0) { hitsPhysical = false; }
    var dfMods = [];
    if (defender.hasAbility('Marvel Scale') && defender.status && hitsPhysical) {
        dfMods.push(6144);
        desc.defenderAbility = defender.ability;
    }
    else if (defender.hasAbility('Fur Coat') && hitsPhysical) {
        dfMods.push(8192);
        desc.defenderAbility = defender.ability;
    }
    return dfMods;
}
exports.calculateDfModsChampions = calculateDfModsChampions;
function calculateBaseDamageChampions(gen, attacker, defender, basePower, attack, defense, move, field, desc, isCritical) {
    if (isCritical === void 0) { isCritical = false; }
    var baseDamage = (0, util_2.getBaseDamage)(attacker.level, basePower, attack, defense);
    var isSpread = field.gameType !== 'Singles' &&
        ['allAdjacent', 'allAdjacentFoes'].includes(move.target);
    if (isSpread) {
        baseDamage = (0, util_2.pokeRound)((0, util_2.OF32)(baseDamage * 3072) / 4096);
    }
    if (attacker.hasAbility('Parental Bond (Child)')) {
        baseDamage = (0, util_2.pokeRound)((0, util_2.OF32)(baseDamage * 1024) / 4096);
    }
    var isMegaSol = attacker.hasAbility('Mega Sol');
    if (((field.hasWeather('Sun') || isMegaSol) && move.hasType('Fire')) ||
        ((field.hasWeather('Rain') && !isMegaSol) && move.hasType('Water'))) {
        baseDamage = (0, util_2.pokeRound)((0, util_2.OF32)(baseDamage * 6144) / 4096);
        isMegaSol ? desc.attackerAbility = attacker.ability : desc.weather = field.weather;
    }
    else if (((field.hasWeather('Sun') || isMegaSol) && move.hasType('Water')) ||
        (field.hasWeather('Rain') && move.hasType('Fire'))) {
        baseDamage = (0, util_2.pokeRound)((0, util_2.OF32)(baseDamage * 2048) / 4096);
        isMegaSol ? desc.attackerAbility = attacker.ability : desc.weather = field.weather;
    }
    if (isCritical) {
        baseDamage = Math.floor((0, util_2.OF32)(baseDamage * 1.5));
        desc.isCritical = isCritical;
    }
    return baseDamage;
}
function calculateFinalModsChampions(gen, attacker, defender, move, field, desc, isCritical, typeEffectiveness, hitCount) {
    if (isCritical === void 0) { isCritical = false; }
    if (hitCount === void 0) { hitCount = 0; }
    var finalMods = [];
    if (field.defenderSide.isReflect && move.category === 'Physical' &&
        !isCritical && !field.defenderSide.isAuroraVeil) {
        finalMods.push(field.gameType !== 'Singles' ? 2732 : 2048);
        desc.isReflect = true;
    }
    else if (field.defenderSide.isLightScreen && move.category === 'Special' &&
        !isCritical && !field.defenderSide.isAuroraVeil) {
        finalMods.push(field.gameType !== 'Singles' ? 2732 : 2048);
        desc.isLightScreen = true;
    }
    if (field.defenderSide.isAuroraVeil && !isCritical) {
        finalMods.push(field.gameType !== 'Singles' ? 2732 : 2048);
        desc.isAuroraVeil = true;
    }
    if (attacker.hasAbility('Sniper') && isCritical) {
        finalMods.push(6144);
        desc.attackerAbility = attacker.ability;
    }
    if (defender.hasAbility('Multiscale') &&
        defender.curHP() === defender.maxHP() &&
        hitCount === 0 &&
        (!field.defenderSide.isSR && (!field.defenderSide.spikes || defender.hasType('Flying'))) &&
        !attacker.hasAbility('Parental Bond (Child)')) {
        finalMods.push(2048);
        desc.defenderAbility = defender.ability;
    }
    if (defender.hasAbility('Solid Rock', 'Filter') && typeEffectiveness > 1) {
        finalMods.push(3072);
        desc.defenderAbility = defender.ability;
    }
    if (field.defenderSide.isFriendGuard) {
        finalMods.push(3072);
        desc.isFriendGuard = true;
    }
    if (move.hasType((0, items_1.getBerryResistType)(defender.item)) &&
        (typeEffectiveness > 1 || move.hasType('Normal')) &&
        hitCount === 0 &&
        !attacker.hasAbility('Unnerve')) {
        if (defender.hasAbility('Ripen')) {
            finalMods.push(1024);
        }
        else {
            finalMods.push(2048);
        }
        desc.defenderItem = defender.item;
    }
    return finalMods;
}
exports.calculateFinalModsChampions = calculateFinalModsChampions;
//# sourceMappingURL=champions.js.map