function getAllDamage(attacker, defender, moves, weather, isDoubles, isReflect, isLightScreen, isForesight, isGravity, isHelpingHand, isSwitchin, isCriticalHit) {
    
    // standardize item names
    var trueAttackerItem = attacker.item; // for fling and natural gift
    var trueDefenderItem = defender.item; // for damage description of berries
    attacker.item = getSimpleItem(attacker.item);
    defender.item = getSimpleItem(defender.item);
    
    // check for weather-nullifying abilities
    if (attacker.ability === 'Air Lock' || attacker.ability === 'Cloud Nine' || defender.ability === 'Air Lock' || defender.ability === 'Cloud Nine') {
        weather = -1;
    }
    
    // set Castform's type in weather
    if (attacker.ability === 'Forecast' && attacker.name === 'Castform') {
        setForecastType(attacker, weather);
    }
    if (defender.ability === 'Forecast' && attacker.name === 'Castform') {
        setForecastType(defender, weather);
    }
    
    // remove defender's ability if attacker has mold breaker, but first apply intimidate
    if (defender.ability === 'Intimidate') {
        attacker.atm += (attacker.ability === 'Defiant') ? 1 : (attacker.ability === 'Hyper Cutter' || attacker.ability === 'Clear Body') ? 0 : -1;
    }
    if (['Mold Breaker','Teravolt','Turboblaze'].indexOf(attacker.ability) !== -1) {
        defender.ability = -1;
    }
    
    // apply boosts to attacker's stats (can't do the same for defender out here because of Sacred Sword)
    if (defender.ability !== 'Unaware') {
        if (isCriticalHit) {
            attacker.at = Math.max(attacker.at, getModifiedStat(attacker.at, attacker.atm));
            attacker.sa = Math.max(attacker.sa, getModifiedStat(attacker.sa, attacker.sam));
        } else {
            attacker.at = getModifiedStat(attacker.at, attacker.atm);
            attacker.sa = getModifiedStat(attacker.sa, attacker.sam);
        }
    } else {
        attacker.atm = 0;
        attacker.sam = 0;
    }
    
    // apply Hustle (unlike all other modifiers, it gets applied directly)
    if (attacker.ability === 'Hustle') {
        attacker.at = round(attacker.at * 3/2);
    }
    
    // get final speeds
    attacker.sp = getFinalSpeed(attacker.sp, attacker.spm, attacker.item);
    defender.sp = getFinalSpeed(defender.sp, defender.spm, defender.item);
    
    // calculate!
    var damage = [];
    for (var i = 0; i < 4; i++) {
        damage[i] = getDamage(attacker, defender, moves[i], weather, isDoubles, isReflect, isLightScreen, isForesight, isGravity, isHelpingHand, isSwitchin, isCriticalHit, trueAttackerItem, trueDefenderItem);
    }
    return damage;
}

function getDamage(attacker, defender, move, weather, isDoubles, isReflect, isLightScreen, isForesight, isGravity, isHelpingHand, isSwitchin, isCriticalHit, trueAttackerItem, trueDefenderItem) {

    // quick check for blank attack slot
    if (move.bp === 0) {
        return {
            'damage' : [0,0,0,0,
                        0,0,0,0,
                        0,0,0,0,
                        0,0,0,0],
            'desc' : null
        };
    }
    
    var descAtItem = false;
    var descAtAbil = false;
    var descDfItem = false;
    var descDfAbil = false;
    var descWeather = false;
    
    // change Judgment, Weather Ball, and Natural Gift type before checking for immunities
    if (move.name === 'Judgment' && attacker.item.indexOf('Plate') !== -1) {
        move.type = attacker.item.split(' ')[0];
        var typeDesc = move.type;
    }
    else if (move.name === 'Weather Ball') {
        move.type = weather === 'Sunny Day' ? 'Fire' : weather === 'Rain Dance' ? 'Water' : 
                    weather === 'Sandstorm' ? 'Rock' : weather === 'Hail' ? 'Ice' : 
                    move.type;
        var typeDesc = move.type;
        descWeather = true;
    }
    else if (move.name === 'Natural Gift') {
        var gift = getNaturalGift(trueAttackerItem);
        move.type = gift.t;
        move.bp = gift.p;
        var typeDesc = move.type;
        var bpDesc = move.bp;
        descAtItem = true;
    }
    
    // get type effectiveness (with scrappy/foresight and gravity)
    var type1 = getTypeMatch(move.type, defender.type1);
    var type2 = getTypeMatch(move.type, defender.type2);
    if (type1 === 0 && ((defender.type1 === 'Ghost' && (isForesight || attacker.ability === 'Scrappy')) || (defender.type1 === 'Flying' && isGravity))) {
        type1 = 1;
    }
    if (type2 === 0 && ((defender.type2 === 'Ghost' && (isForesight || attacker.ability === 'Scrappy')) || (defender.type2 === 'Flying' && isGravity))) {
        type2 = 1;
    }
    var TYPE = type1 * type2;

    // quick check for immunity
    if (TYPE === 0 || (defender.ability === 'Wonder Guard' && TYPE <= 1) ||
            (move.type === 'Grass' && defender.ability === 'Sap Sipper') ||
            (move.type === 'Fire' && defender.ability === 'Flash Fire') ||
            (move.type === 'Water' && ['Dry Skin','Storm Drain','Water Absorb'].indexOf(defender.ability) !== -1) ||
            (move.type === 'Electric' && ['Lightningrod','Motor Drive','Volt Absorb'].indexOf(defender.ability) !== -1) ||
            (move.type === 'Ground' && !isGravity && (defender.ability === 'Levitate' || defender.item === 'Air Balloon'))) {
        return {
            'damage' : [0,0,0,0,
                        0,0,0,0,
                        0,0,0,0,
                        0,0,0,0],
            'desc' : null
        };
    }
    
    // quick check for stoss/nshade
    if (move.name === 'Seismic Toss' || move.name === 'Night Shade') {
        return {
            'damage' : [attacker.level, attacker.level, attacker.level, attacker.level, 
                        attacker.level, attacker.level, attacker.level, attacker.level, 
                        attacker.level, attacker.level, attacker.level, attacker.level, 
                        attacker.level, attacker.level, attacker.level, attacker.level],
            'desc' : null
        };
    }
    
    
    ////////////////////////////////
    ////////// BASE POWER //////////
    ////////////////////////////////
    
    // get BP of variable power moves
    switch (move.name) {
        case 'Payback':
            var BP = (attacker.sp < defender.sp && !isSwitchin) ? 100 : 50;
            var bpDesc = BP;
            break;
        case 'Electro Ball':
            var R = Math.floor(attacker.sp / defender.sp);
            var BP = (R >= 4) ? 150 : (R >= 3) ? 120 : (R >= 2) ? 80 : 60;
            var bpDesc = BP;
            break;
        case 'Gyro Ball':
            var BP = Math.min(150, Math.floor(25 * defender.sp / attacker.sp));
            var bpDesc = BP;
            break;
        case 'Punishment':
            var BP = Math.min(200, 60 + 20 * countBoosts(defender));
            var bpDesc = BP;
            break;
        case 'Low Kick':
        case 'Grass Knot':
            var W = defender.weight;
            var BP = (W >= 200) ? 120 : (W >= 100) ? 100 : (W >= 50) ? 80 : (W >= 25) ? 60 : (W >= 10) ? 40 : 20;
            var bpDesc = BP;
            break;
        case 'Hex':
            var BP = (defender.status !== 'Healthy') ? 100 : 50;
            var bpDesc = BP;
            break;
        case 'Heavy Slam':
        case 'Heat Crash':
            var W = attacker.weight / defender.weight;
            var BP = (W >= 5) ? 120 : (W >= 4) ? 100 : (W >= 3) ? 80 : (W >= 2) ? 60 : 40;
            var bpDesc = BP;
            break;
        case 'Stored Power':
            var BP = 20 + 20 * countBoosts(attacker);
            var bpDesc = BP;
            break;
        case 'Acrobatics':
            var BP = (attacker.item === 'Flying Gem') ? 110 : 55;
            var bpDesc = BP;
            break;
        case 'Wake-Up Slap':
            var BP = (defender.status === 'Asleep') ? 120 : 60;
            var bpDesc = BP;
            break;
        case 'Weather Ball':
            var BP = (weather !== '(none)') ? 100 : 50;
            var bpDesc = BP;
            break;
        case 'Fling':
            var BP = getFlingPower(trueAttackerItem);
            var bpDesc = BP;
            descAtItem = true;
            break;
        // Avalanche
        // Eruption, Water Spout
        // Wring Out, Crush Claw
        // Assurance
        // Flail, Reversal
        // Pursuit
        default: 
            var BP = move.bp;
            break;
    }
    
    // apply modifiers
    var UA = 0x1000;
    if ((attacker.ability === 'Technician' && BP <= 60) ||
            (attacker.ability === 'Flare Boost' && attacker.status === 'Burned' && !move.physical) ||
            (attacker.ability === 'Toxic Boost' && attacker.status === 'Poisoned' && move.physical)) {
        UA = 0x1800;
    } else if ((attacker.ability === 'Reckless' && isRecoilMove(move.name)) ||
            (attacker.ability === 'Iron Fist' && isPunchMove(move.name))) {
        UA = 0x1333;
    } else if (attacker.ability === 'Analytic' && (attacker.sp < defender.sp || isSwitchin)) {
        UA = 0x14CD;
    } else if (attacker.ability === 'Rivalry (+)') {
        UA = 0x1400;
    } else if (attacker.ability === 'Rivalry (-)') {
        UA = 0xC00;
    } else if (attacker.ability === 'Sand Force' && weather === 'Sandstorm' && ['Ground','Rock','Steel'].indexOf(move.type) !== -1) {
        UA = 0x14CD;
        descWeather = true;
    }
    
    var OA = 0x1000;
    if (defender.ability === 'Heatproof' && move.type === 'Fire') {
        OA = 0x800;
    } else if (defender.ability === 'Dry Skin' && move.type === 'Fire') {
        OA = 0x1400;
    }
    
    var SF = (attacker.ability === 'Sheer Force' && isSheerForceMove(move.name)) ? 0x14CD : 0x1000;
    
    var IT = 0x1000;
    if ((attacker.item === 'Muscle Band' && move.physical) ||
            (attacker.item === 'Wise Glasses' && !move.physical)) {
        IT = 0x1199;
    } else if (((attacker.item === 'Adamant Orb' && attacker.name === 'Dialga') ||
            (attacker.item === 'Griseous Orb' && attacker.name === 'Giratina-O') ||
            (attacker.item === 'Lustrous Orb' && attacker.name === 'Palkia')) &&
            (move.type === attacker.type1 || move.type === attacker.type2)) {
        IT = 0x1333;
    } else if (attacker.item.indexOf(move.type) !== -1) {
        if (attacker.item.indexOf('Plate') !== -1) {
            IT = 0x1333;
        } else if (attacker.item.indexOf('Gem') !== -1) {
            IT = 0x1800;
        }
    }
    
    var MV = 0x1000;
    if (move.name === 'Facade' && ['Burned','Paralyzed','Poisoned'].indexOf(attacker.status) !== -1) MV = 0x2000;
    else if (move.name === 'Venoshock' && defender.status === 'Poisoned') MV = 0x2000;
    // Brine (0x2000)
    // Retaliate (0x2000)
    // Fusion Bolt + Fusion Flare (0x2000)
    
    //Me First (0x1800)
    var SB = (move.name === 'SolarBeam' && ['Rain Dance','Sandstorm','Hail'].indexOf(weather) !== -1) ? 0x800 : 0x1000;
    //Charge (0x2000)
    var HH = isHelpingHand ? 0x1800 : 0x1000;
    //Water Sport & Mud Sport (0x548)
    
    //chain the modifiers together and apply
    BP = Math.max(1, round(BP * chainMods([UA, OA, SF, IT, MV, SB, HH]) / 0x1000));
    
    
    ////////////////////////////////
    ////////// (SP)ATTACK //////////
    ////////////////////////////////
    
    var TF = (defender.ability === 'Thick Fat' && (move.type === 'Fire' || move.type === 'Ice')) ? 0x800 : 0x1000;
    
    var attackerAt = attacker.at;
    var attackerAbility = attacker.ability;
    var attackerStatus = attacker.status;
    if (move.name === 'Foul Play') {
        attackerAt = defender.at;
        attackerAbility = defender.ability;
        attackerStatus = defender.status;
    }
    
    var AA = 0x1000;
    if ((attackerAbility === 'Guts' && attackerStatus !== 'Healthy' && move.physical) ||
            (attackerAbility === 'Torrent' && move.type === 'Water') ||
            (attackerAbility === 'Swarm' && move.type === 'Bug') ||
            (attackerAbility === 'Overgrow' && move.type === 'Grass') ||
            (attackerAbility === 'Blaze' && move.type === 'Fire') ||
            // Plus & Minus
            (attackerAbility === 'Flash Fire' && move.type === 'Fire')) {
        AA = 0x1800;
    } else if (move.physical && (attackerAbility === 'Huge Power' || attackerAbility === 'Pure Power')) {
        AA = 0x2000;
    } else if (attackerAbility === 'Defeatist' || (move.physical && attackerAbility === 'Slow Start')) {
        AA = 0x800;
    } else if (weather === 'Sunny Day' && 
            (attackerAbility === 'Solar Power' && !move.physical) ||
            (attackerAbility === 'Flower Gift' && move.physical)) {
        AA = 0x1800;
        descWeather = true;
    }
    
    var AI = 0x1000;
    if ((attacker.item === 'Thick Club' && (attacker.name === 'Cubone' || attacker.name === 'Marowak') && move.physical) ||
            (attacker.item === 'DeepSeaTooth' && attacker.name === 'Clamperl' && !move.physical) ||
            (attacker.item === 'Light Ball' && attacker.name === 'Pikachu')) {
        AI = 0x2000;
    } else if ((attacker.item === 'Choice Band' && move.physical) || (attacker.item === 'Choice Specs' && !move.physical) ||
            (attacker.item === 'Soul Dew' && (attacker.name === 'Latias' || attacker.name === 'Latios') && !move.physical)) {
        AI = 0x1800;
    }
    
    //chain the modifiers together and apply
    var AT = Math.max(1, round((move.physical ? attackerAt : attacker.sa) * chainMods([TF, AA, AI]) / 0x1000));
    
    
    /////////////////////////////////
    ////////// (SP)DEFENSE //////////
    /////////////////////////////////
    
    var DF = hitsPhysical(move) ? defender.df : defender.sd;
    var DFM = hitsPhysical(move) ? defender.dfm : defender.sdm;

    // apply stat boosts
    if (attacker.ability !== 'Unaware' && move.name !== 'Sacred Sword') {
        if (isCriticalHit) {
            DF = Math.min(DF, getModifiedStat(DF, DFM));
        } else {
            DF = getModifiedStat(DF, DFM);
        }
    } else {
        DFM = 0;
    }
    
    // apply sandstorm SD boost
    if (weather === 'Sandstorm' && (defender.type1 === 'Rock' || defender.type2 === 'Rock') && !hitsPhysical(move)) {
        DF = round(DF * 3/2);
        descWeather = true;
    }
    
    var DA = 0x1000;
    if (defender.ability === 'Marvel Scale' && defender.status !== 'Healthy' && hitsPhysical(move)) {
        DA = 0x1800;
    } else if (defender.ability === 'Flower Gift' && weather === 'Sunny Day' && !hitsPhysical(move)) {
        DA = 0x1800;
        descWeather = true;
    }
    
    var DI = 0x1000;
    if (defender.item === 'DeepSeaScale' && defender.name === 'Clamperl' && !hitsPhysical(move)) {
        DI = 0x2000;
    } else if (defender.item === 'Eviolite' ||
            (defender.item === 'Metal Powder' && defender.name === 'Ditto') ||
            (defender.item === 'Soul Dew' && (defender.name === 'Latias' || defender.name === 'Latios') && !hitsPhysical(move))) {
        DI = 0x1800;
    }
    
    //chain the modifiers together and apply
    DF = Math.max(1, round(DF * chainMods([DA, DI]) / 0x1000));
    

    ////////////////////////////
    ////////// DAMAGE //////////
    ////////////////////////////

    var BaseDamage = Math.floor(Math.floor((Math.floor((2 * attacker.level) / 5 + 2) * BP * AT) / DF) / 50 + 2);
    
    // damage modifiers
    var SPRD = (isDoubles && isSpreadMove(move.name)) ? 0xC00 : 0x1000;
    BaseDamage = round(BaseDamage * SPRD / 0x1000);
    
    var WTHR = weather === 'Sunny Day' ? (move.type === 'Fire' ? 0x1800 : move.type === 'Water' ? 0x800 : 0x1000) :
                weather === 'Rain Dance' ? (move.type === 'Water' ? 0x1800 : move.type === 'Fire' ? 0x800 : 0x1000) :
                0x1000;
    BaseDamage = round(BaseDamage * WTHR / 0x1000);
    
    if (isCriticalHit) {
        BaseDamage *= 2;
    }
    
    var STAB = 0x1000;
    if (move.type === attacker.type1 || move.type === attacker.type2) {
        if (attacker.ability === 'Adaptability') {
            STAB = 0x2000;
            descAtAbil = true;
        } else {
            STAB = 0x1800;
        }
    }
    
    var BURN = move.physical && attacker.status === 'Burned' && attacker.ability !== 'Guts';
    
    var RL = ((move.physical ? isReflect : isLightScreen) && attacker.ability !== 'Infiltrator' && !isCriticalHit) ? (isDoubles ? 0xA8F : 0x800) : 0x1000;
    var MS = (defender.ability === 'Multiscale') ? 0x800 : 0x1000;
    var TL = (attacker.ability === 'Tinted Lens' && TYPE < 1) ? 0x2000 : 0x1000;
    //friend guard (0xC00)
    var SN = (attacker.ability === 'Sniper' && isCriticalHit) ? 0x1800 : 0x1000;
    var SR = ((defender.ability === 'Solid Rock' || defender.ability === 'Filter') && TYPE > 1) ? 0xC00 : 0x1000;
    //metronome
    var EB = (attacker.item === 'Expert Belt' && TYPE > 1) ? 0x1333 : 0x1000;
    var LO = (attacker.item === 'Life Orb') ? 0x14CC : 0x1000;
    var BR = (defender.item === (move.type + ' Berry') && (TYPE > 1 || move.type === 'Normal') && attacker.ability !== 'Unnerve') ? 0x800 : 0x1000;
    //move combos (EQ + Dig, Surf + Dive, Stomp/Steamroller + Minimize) (0x2000)
    
    var FMOD = chainMods([RL, MS, TL, SN, SR, EB, LO, BR]);
    
    var damage = [];
    
    for(var i = 0; i < 16; i++) {
        damage[i] = Math.floor((BaseDamage * (85 + i)) / 100);
        damage[i] = round(damage[i] * STAB / 0x1000);
        damage[i] = damage[i] * TYPE;
        if(BURN) damage[i] = damage[i] / 2;
        damage[i] = Math.max(1, damage[i]);
        damage[i] = round(damage[i] * FMOD / 0x1000);
        
        // multi-hit moves...this won't give perfect spreads (there are 16^x possibilities for a move with x hits), but at least the max and min will be right
        if (isTwoHitMove(move.name)) {
            damage[i] *= 2;
        } else if (isMultiHitMove(move.name)) {
            if (attacker.ability === 'Skill Link') {
                damage[i] *= 5;
                var typeDesc = '5 hits';
            } else {
                damage[i] *= 3;
                var typeDesc = '3 hits';
            }
        }
    }
    
    descAtItem = descAtItem || IT !== 0x1000 || AI !== 0x1000 || EB !== 0x1000 || LO !== 0x1000;
    descAtAbil = descAtAbil || UA !== 0x1000 || SF !== 0x1000 || AA !== 0x1000 || TL !== 0x1000 || SN !== 0x1000 || 
                (attacker.ability === 'Hustle' && move.physical) || (attacker.ability === 'Skill Link' && isMultiHitMove(move.name));
    descDfItem = descDfItem || DI !== 0x1000 || BR !== 0x1000;
    descDfAbil = descDfAbil || OA !== 0x1000 || TF !== 0x1000 || DA !== 0x1000 || MS !== 0x1000 || SR !== 0x1000;
    descWeather = descWeather || SB !== 0x1000 || WTHR !== 0x1000;
    
    var atBoost = move.physical ? attacker.atm : attacker.sam;
    var atBoostDesc = atBoost > 0 ? '+' + atBoost + ' ' : atBoost < 0 ? atBoost + ' ' : '';
    var atEvDesc = (move.physical ? attacker.ati : attacker.sai) + ' ';
    var atItemDesc = descAtItem ? trueAttackerItem + ' ' : '';
    var atAbilDesc = descAtAbil ? attacker.ability + ' ' : '';
    var atBurnDesc = BURN ? 'burned ' : '';
    var hhDesc = isHelpingHand ? ' Helping Hand ' : ' ';
    var moveExtraDesc = (bpDesc || typeDesc) ? (' (' + (bpDesc ? bpDesc + ' BP' : '') + (typeDesc ? (bpDesc ? ' ' : '') + typeDesc : '') + ')') : '';
    var dfBoostDesc = DFM > 0 ? '+' + DFM + ' ' : DFM < 0 ? DFM + ' ' : '';
    var dfEvDesc = defender.hpi + ' / ' + (hitsPhysical(move) ? defender.dfi : defender.sdi) + ' ';
    var dfItemDesc = descDfItem ? trueDefenderItem + ' ' : '';
    var dfAbilDesc = descDfAbil ? defender.ability + ' ' : '';
    var screenDesc = RL !== 0x1000 ? ' through ' + (move.physical ? 'Reflect' : 'Light Screen') : '';
    var weatherDesc = descWeather ? (weather === 'Rain Dance' ? ' in rain' : weather === 'Sunny Day' ? ' in sun' : weather === 'Sandstorm' ? ' in sand' : weather === 'Hail' ? ' in hail' : '') : '';
    var critDesc = isCriticalHit ? ' on a critical hit' : '';
    var desc = atBoostDesc + atEvDesc + atItemDesc + atAbilDesc + atBurnDesc + attacker.name + hhDesc + move.name + moveExtraDesc + 
            ' vs. ' + dfBoostDesc + dfEvDesc + dfItemDesc + dfAbilDesc + defender.name + screenDesc + weatherDesc + critDesc;
            
    return {
        'damage' : damage,
        'desc' : desc
    };
}

// round DOWN on .5 instead of up. stupid.
function round(num) {
    return (num % 1 > 0.5) ? Math.ceil(num) : Math.floor(num);
}

function chainMods(mods) {
    var M = 0x1000;
    for(var i = 0; i < mods.length; i++) {
        if(mods[i] !== 0x1000) {
            M = ((M * mods[i]) + 0x800) >> 12;
        }
    }
    return M;
}

function countBoosts(pkmn) {
    var getBoosts = function(mod) {
        return mod ? Math.max(0, mod) : 0;
    }
    return getBoosts(pkmn.atm) + getBoosts(pkmn.dfm) + getBoosts(pkmn.sam) + getBoosts(pkmn.sdm) + getBoosts(pkmn.spm);
}

function getModifiedStat(stat, mod) {
    return mod > 0 ? stat * (2 + mod) / 2 :
            mod < 0 ? stat * 2 / (2 - mod) :
            stat;
}

function getFinalSpeed(speed, mod, item) {
    var SP = getModifiedStat(speed, mod);
    if (item === 'Choice Scarf') {
        return Math.floor(SP * 1.5); // are we supposed to floor or round here?
    } else if (item === 'Macho Brace' || item === 'Iron Ball') {
        return Math.floor(SP * 0.5); // lol who cares this is a damage calc not a "what does +3 Macho Brace Sharpedo outspeed" calc
    } else {
        return SP;
    }
}

function setForecastType(pkmn, weather) {
    if (weather === 'Sunny Day') {
        pkmn.type1 = 'Fire';
    } else if (weather === 'Rain Dance') {
        pkmn.type1 = 'Water';
    } else if (weather === 'Hail') {
        pkmn.type1 = 'Ice';
    } else {
        pkmn.type1 = 'Normal';
    }
    pkmn.type2 = '(none)';
}

function hitsPhysical(move) {
    return move.physical || move.name === 'Psyshock' || move.name === 'Psystrike' || move.name === 'Secret Sword';
}

function isSpreadMove(move) {
    return [
                'Blizzard', 'Bulldoze', 'Discharge', 'Earthquake', 'Eruption',
                'Explosion', 'Glaciate', 'Heat Wave', 'Hyper Voice', 'Icy Wind',
                'Lava Plume', 'Muddy Water', 'Nature Power', 'Rock Slide', 
                'Searing Shot', 'Selfdestruct', 'Sludge Wave', 'Surf', 'Water Spout'
            ].indexOf(move) !== -1;
}

function isRecoilMove(move) {
    return [
                'Brave Bird', 'Double-Edge', 'Flare Blitz', 'Head Charge', 'Head Smash',
                'Hi Jump Kick', 'Jump Kick', 'Volt Tackle', 'Wild Charge', 'Wood Hammer'
            ].indexOf(move) !== -1;
}

function isPunchMove(move) {
    return [
                'Bullet Punch', 'Drain Punch', 'DynamicPunch', 'Fire Punch',
                'Focus Punch', 'Hammer Arm', 'Ice Punch', 'Mach Punch',
                'Meteor Mash', 'Shadow Punch', 'Sky Uppercut', 'ThunderPunch'
            ].indexOf(move) !== -1;
}

function isSheerForceMove(move) {
    return [
                'Air Slash', 'AncientPower', 'Bite', 'Blaze Kick', 'Blizzard', 'Blue Flare', 'Body Slam', 'Bolt Strike',
                'Bounce', 'Bug Buzz', 'Charge Beam', 'Chatter', 'Cross Poison', 'Crunch', 'Dark Pulse', 'Discharge',
                'Dragon Rush', 'Earth Power', 'Energy Ball', 'Extrasensory', 'Fiery Dance', 'Fire Blast', 'Fire Fang', 
                'Fire Punch', 'Flamethrower', 'Flare Blitz', 'Flash Cannon', 'Focus Blast', 'Force Palm', 'Gunk Shot',
                'Headbutt', 'Heat Wave', 'Hurricane', 'Ice Beam', 'Ice Fang', 'Ice Punch', 'Icicle Crash', 'Iron Head',
                'Iron Tail', 'Lava Plume', 'Meteor Mash', 'Night Daze', 'Poison Jab', 'Psychic', 'Razor Shell',
                'Rock Climb', 'Rock Slide', 'Sacred Fire', 'Scald', 'Searing Shot', 'Seed Flare', 'Shadow Ball',
                'Signal Beam', 'Sludge Bomb', 'Sludge Wave', 'Spark', 'Stomp', 'Thunder', 'Thunder Fang',
                'ThunderPunch', 'Thunderbolt', 'Tri Attack', 'Water Pulse', 'Waterfall', 'Zen Headbutt'
            ].indexOf(move) !== -1;
}

function isTwoHitMove(move) {
    return [ 'Bonemerang', 'Double Hit', 'Dual Chop', 'Gear Grind' ].indexOf(move) !== -1;
}

function isMultiHitMove(move) {
    return [ 'Bullet Seed', 'Icicle Spear', 'Rock Blast', 'Tail Slap' ].indexOf(move) !== -1;
}

function getFlingPower(item) {
    return item === 'Iron Ball' ? 130 :
        item.indexOf('Fossil') !== -1 || ['Hard Stone','Old Amber','Rare Bone'].indexOf(item) !== -1 ? 100 :
        item.indexOf('Plate') !== -1 || ['DeepSeaTooth','Thick Club'].indexOf(item) !== -1 ? 90 :
        ['Poison Barb','Dragon Fang'].indexOf(item) !== -1 ? 70 :
        ['Adamant Orb','Lustrous Orb','Macho Brace'].indexOf(item) !== -1 ? 60 :
        item === 'Sharp Beak' ? 50 : 
        item === 'Eviolite' ? 40 :
        ['Black Belt','Black Sludge','BlackGlasses','Charcoal','DeepSeaScale','Flame Orb',"King's Rock",'Life Orb','Light Ball','Magnet',
        'Metal Coat','Miracle Seed','Mystic Water','NeverMeltIce','Razor Fang','Soul Dew','Spell Tag','Toxic Orb','TwistedSpoon'].indexOf(item) !== -1 ? 30 : 
        10;
}

function getNaturalGift(item) {
    var gift = {
        'Apicot Berry' : {'t':'Ground','p':80},
        'Babiri Berry' : {'t':'Steel','p':60},
        'Belue Berry' : {'t':'Electric','p':80},
        'Charti Berry' : {'t':'Rock','p':60},
        'Chesto Berry' : {'t':'Water','p':60},
        'Chilan Berry' : {'t':'Normal','p':60},
        'Chople Berry' : {'t':'Fighting','p':60},
        'Coba Berry' : {'t':'Flying','p':60},
        'Colbur Berry' : {'t':'Dark','p':60},
        'Custap Berry' : {'t':'Ghost','p':80},
        'Durin Berry' : {'t':'Water','p':80},
        'Enigma Berry' : {'t':'Bug','p':80},
        'Ganlon Berry' : {'t':'Ice','p':80},
        'Haban Berry' : {'t':'Dragon','p':60},
        'Jaboca Berry' : {'t':'Dragon','p':80},
        'Kasib Berry' : {'t':'Ghost','p':60},
        'Kebia Berry' : {'t':'Poison','p':60},
        'Lansat Berry' : {'t':'Flying','p':80},
        'Leppa Berry' : {'t':'Fighting','p':60},
        'Liechi Berry' : {'t':'Grass','p':80},
        'Lum Berry' : {'t':'Flying','p':60},
        'Micle Berry' : {'t':'Rock','p':80},
        'Occa Berry' : {'t':'Fire','p':60},
        'Oran Berry' : {'t':'Poison','p':60},
        'Pamtre Berry' : {'t':'Steel','p':70},
        'Passho Berry' : {'t':'Water','p':60},
        'Payapa Berry' : {'t':'Psychic','p':60},
        'Petaya Berry' : {'t':'Poison','p':80},
        'Rawst Berry' : {'t':'Grass','p':60},
        'Rindo Berry' : {'t':'Grass','p':60},
        'Rowap Berry' : {'t':'Dark','p':80},
        'Salac Berry' : {'t':'Fighting','p':80},
        'Shuca Berry' : {'t':'Ground','p':60},
        'Sitrus Berry' : {'t':'Psychic','p':60},
        'Starf Berry' : {'t':'Psychic','p':80},
        'Tanga Berry' : {'t':'Bug','p':60},
        'Wacan Berry' : {'t':'Electric','p':60},
        'Watmel Berry' : {'t':'Fire','p':80},
        'Yache Berry' : {'t':'Ice','p':60}
    }[item];
    return gift ? gift : {'t':'Normal','p':1};
}

function getSimpleItem(item) {
    switch (item) {
        case 'Chilan Berry':
            return 'Normal Berry';
            break;
        case 'Occa Berry':
            return 'Fire Berry';
            break;
        case 'Passho Berry':
            return 'Water Berry';
            break;
        case 'Wacan Berry':
            return 'Electric Berry';
            break;
        case 'Rindo Berry':
            return 'Grass Berry';
            break;
        case 'Yache Berry':
            return 'Ice Berry';
            break;
        case 'Chople Berry':
            return 'Fighting Berry';
            break;
        case 'Kebia Berry':
            return 'Poison Berry';
            break;
        case 'Shuca Berry':
            return 'Ground Berry';
            break;
        case 'Coba Berry':
            return 'Flying Berry';
            break;
        case 'Payapa Berry':
            return 'Psychic Berry';
            break;
        case 'Tanga Berry':
            return 'Bug Berry';
            break;
        case 'Charti Berry':
            return 'Rock Berry';
            break;
        case 'Kasib Berry':
            return 'Ghost Berry';
            break;
        case 'Haban Berry':
            return 'Dragon Berry';
            break;
        case 'Colbur Berry':
            return 'Dark Berry';
            break;
        case 'Babiri Berry':
            return 'Steel Berry';
            break;
        case 'Draco Plate':
        case 'Dragon Fang':
            return 'Dragon Plate';
            break;
        case 'Dread Plate':
        case 'BlackGlasses':
            return 'Dark Plate';
            break;
        case 'Earth Plate':
        case 'Soft Sand':
            return 'Ground Plate';
            break;
        case 'Fist Plate':
        case 'Black Belt':
            return 'Fighting Plate';
            break;
        case 'Flame Plate':
        case 'Charcoal':
            return 'Fire Plate';
            break;
        case 'Icicle Plate':
        case 'NeverMeltIce':
            return 'Ice Plate';
            break;
        case 'Insect Plate':
        case 'SilverPowder':
            return 'Bug Plate';
            break;
        case 'Iron Plate':
        case 'Metal Coat':
            return 'Steel Plate';
            break;
        case 'Meadow Plate':
        case 'Rose Incense':
        case 'Miracle Seed':
            return 'Grass Plate';
            break;
        case 'Mind Plate':
        case 'Odd Incense':
        case 'TwistedSpoon':
            return 'Psychic Plate';
            break;
        case 'Sky Plate':
        case 'Sharp Beak':
            return 'Flying Plate';
            break;
        case 'Splash Plate':
        case 'Sea Incense':
        case 'Wave Incense':
        case 'Mystic Water':
            return 'Water Plate';
            break;
        case 'Spooky Plate':
        case 'Spell Tag':
            return 'Ghost Plate';
            break;
        case 'Stone Plate':
        case 'Rock Incense':
        case 'Hard Stone':
            return 'Rock Plate';
            break;
        case 'Toxic Plate':
        case 'Poison Barb':
            return 'Poison Plate';
            break;
        case 'Zap Plate':
        case 'Magnet':
            return 'Electric Plate';
            break;
        case 'Silk Scarf':
            return 'Normal Plate';
            break;
        default:
            return item;
    }
}